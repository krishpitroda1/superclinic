import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, requireTenantType, requireRole, emrAuditLogger } from '../middleware/auth';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Enforce Clinic isolation on all clinic routes
router.use(requireAuth, requireTenantType('clinic'));

// ============================================================================
// 1. EMR: PATIENT MANAGEMENT
// ============================================================================

// List / Search Patients
router.get('/patients', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req: Request, res: Response) => {
  const { search, limit = 20, offset = 0 } = req.query;
  const tenantId = req.user!.tenant_id;

  let query = supabase
    .from('patients')
    .select('id, mrn, name, dob, gender, phone, blood_group, chronic_conditions, created_at')
    .eq('tenant_id', tenantId)
    .range(Number(offset), Number(offset) + Number(limit) - 1)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,mrn.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json({ data, total: count });
});

// Get Single Patient EMR Profile (with Audit Logger)
router.get('/patients/:id', 
  requireRole(['clinic_admin', 'doctor', 'receptionist']),
  emrAuditLogger('PATIENT_EMR'),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenant_id;

    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        appointments (id, time_slot, token_number, status, is_emergency, doctor_id, created_at),
        prescriptions (id, icd10_code, diagnosis, medications, advice, created_at),
        clinic_invoices (id, invoice_number, total_amount, payment_method, status, created_at)
      `)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Patient not found' });
    res.json(data);
  }
);

// Register New Patient EMR
router.post('/patients', requireRole(['clinic_admin', 'receptionist']), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenant_id;
  const { mrn, name, dob, gender, phone, email, height_cm, weight_kg, blood_group, allergies, chronic_conditions, emergency_contact } = req.body;

  const { data, error } = await supabase
    .from('patients')
    .insert({
      tenant_id: tenantId,
      mrn,
      name,
      dob,
      gender,
      phone,
      email,
      height_cm,
      weight_kg,
      blood_group,
      allergies,
      chronic_conditions,
      emergency_contact,
      created_by: req.user!.id
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Update Patient EMR (Vitals, Chronic Conditions)
router.patch('/patients/:id', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user!.tenant_id;

  const { data, error } = await supabase
    .from('patients')
    .update(req.body)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ============================================================================
// 2. SMART APPOINTMENTS & QUEUE MANAGEMENT
// ============================================================================

// Daily Queue Management (Priority sorting: Emergency first, then Token Number)
router.get('/queue', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenant_id;
  const date = req.query.date as string || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id,
      token_number,
      time_slot,
      status,
      is_emergency,
      patient:patients (id, mrn, name, phone, blood_group),
      doctor:users!doctor_id (id, full_name, specialization)
    `)
    .eq('tenant_id', tenantId)
    .gte('time_slot', `${date}T00:00:00Z`)
    .lte('time_slot', `${date}T23:59:59Z`)
    .order('is_emergency', { ascending: false }) // Emergency flags bumped to top
    .order('token_number', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Schedule an Appointment (auto-calculates next daily token)
router.post('/appointments', requireRole(['clinic_admin', 'receptionist']), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenant_id;
  const { patient_id, doctor_id, time_slot, is_emergency, reason_for_visit } = req.body;

  // Compute token number for the doctor for that calendar day
  const dateStr = time_slot.split('T')[0];
  const { count } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('doctor_id', doctor_id)
    .gte('time_slot', `${dateStr}T00:00:00Z`)
    .lte('time_slot', `${dateStr}T23:59:59Z`);

  const nextToken = (count || 0) + 1;

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      tenant_id: tenantId,
      patient_id,
      doctor_id,
      time_slot,
      token_number: nextToken,
      is_emergency: !!is_emergency,
      status: is_emergency ? 'emergency' : 'scheduled',
      reason_for_visit
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Update Queue Status (Check-in, Call Patient, Complete)
router.patch('/appointments/:id/status', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const tenantId = req.user!.tenant_id;

  const updates: any = { status };
  if (status === 'checked_in') updates.check_in_time = new Date().toISOString();
  if (status === 'in_consultation') updates.consultation_start_time = new Date().toISOString();
  if (status === 'completed') updates.consultation_end_time = new Date().toISOString();

  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ============================================================================
// 3. DIGITAL PRESCRIPTIONS (ICD-10 VALIDATION & TOKEN GENERATION)
// ============================================================================

// Create Digital Prescription (Only Doctor)
router.post('/prescriptions', requireRole(['doctor']), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenant_id;
  const doctorId = req.user!.id;
  const { patient_id, appointment_id, icd10_code, icd10_description, vitals_snapshot, diagnosis, medications, advice, follow_up_date } = req.body;

  // Basic ICD-10 format validation (e.g. A00.0 - Z99.9)
  const icd10Regex = /^[A-Z][0-9]{2}(\.[0-9]{1,4})?$/;
  if (!icd10Regex.test(icd10_code)) {
    return res.status(400).json({ error: `Invalid ICD-10 format: '${icd10_code}'. Expected format: e.g., 'J06.9' or 'E11.9'.` });
  }

  const { data, error } = await supabase
    .from('prescriptions')
    .insert({
      tenant_id: tenantId,
      patient_id,
      doctor_id: doctorId,
      appointment_id,
      icd10_code,
      icd10_description,
      vitals_snapshot: vitals_snapshot || {},
      diagnosis,
      medications,
      advice,
      follow_up_date
    })
    .select(`
      *,
      dispense_token:prescription_dispense_tokens!prescription_dispense_tokens_prescription_id_fkey(id, expires_at)
    `)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Get Prescription by ID (Audited EMR read)
router.get('/prescriptions/:id', 
  requireRole(['clinic_admin', 'doctor', 'receptionist']),
  emrAuditLogger('PRESCRIPTION'),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenant_id;

    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        patient:patients (id, mrn, name, dob, gender, phone),
        doctor:users!doctor_id (id, full_name, specialization, license_number),
        tenant:tenants (name, address, phone, branding_logo)
      `)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Prescription not found' });
    res.json(data);
  }
);

// ============================================================================
// 4. FEE COLLECTION & BRANDED INVOICES
// ============================================================================

router.post('/invoices', requireRole(['clinic_admin', 'receptionist']), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenant_id;
  const { patient_id, appointment_id, doctor_id, items, payment_method, discount_amount = 0, tax_amount = 0, payment_transaction_ref, notes } = req.body;

  // Calculate Subtotal & Total
  const subtotal = items.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0);
  const total = subtotal + Number(tax_amount) - Number(discount_amount);

  // Generate Unique Invoice Number (e.g. INV-202611-001)
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

  // Create Invoice
  const { data: invoice, error: invError } = await supabase
    .from('clinic_invoices')
    .insert({
      tenant_id: tenantId,
      patient_id,
      appointment_id,
      doctor_id,
      invoice_number: invoiceNumber,
      subtotal,
      tax_amount,
      discount_amount,
      total_amount: total,
      payment_method,
      payment_transaction_ref,
      status: 'paid',
      notes,
      created_by: req.user!.id
    })
    .select()
    .single();

  if (invError) return res.status(400).json({ error: invError.message });

  // Insert Line Items
  const lineItems = items.map((item: any) => ({
    tenant_id: tenantId,
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity || 1,
    unit_price: item.unit_price,
    total_price: item.unit_price * (item.quantity || 1)
  }));

  const { error: itemsError } = await supabase.from('clinic_invoice_items').insert(lineItems);
  if (itemsError) return res.status(400).json({ error: itemsError.message });

  res.status(201).json({ invoice, items: lineItems });
});

// ============================================================================
// 5. WHATSAPP BROADCAST (BULK ANNOUNCEMENTS & WEBHOOK LOGS)
// ============================================================================

router.post('/whatsapp/broadcast', requireRole(['clinic_admin', 'receptionist']), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenant_id;
  const { campaign_type, doctor_id, recipient_phone_list, template_name, template_params } = req.body;

  // Create queue records in database
  const entries = recipient_phone_list.map((phone: string) => ({
    tenant_id: tenantId,
    campaign_type,
    doctor_id,
    recipient_phone: phone,
    template_name,
    template_params: template_params || {},
    provider: 'meta',
    status: 'queued'
  }));

  const { data, error } = await supabase
    .from('whatsapp_broadcast_logs')
    .insert(entries)
    .select();

  if (error) return res.status(400).json({ error: error.message });

  // In production: dispatch background job to process the queued WhatsApp batch
  res.status(202).json({ message: 'Broadcast campaign queued successfully', count: data.length });
});

// ============================================================================
// 6. CLINIC FINANCIAL & PERFORMANCE REPORTS (AGGREGATIONS)
// ============================================================================

router.get('/reports/financial', requireRole(['clinic_admin']), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenant_id;
  const { start_date, end_date } = req.query;

  const startDate = start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const endDate = end_date || new Date().toISOString();

  // Aggregate total revenue, payment method split, and doctor performance
  const { data: invoices, error } = await supabase
    .from('clinic_invoices')
    .select('id, total_amount, payment_method, doctor_id, created_at')
    .eq('tenant_id', tenantId)
    .eq('status', 'paid')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) return res.status(400).json({ error: error.message });

  const summary = {
    total_revenue: 0,
    by_payment_method: {} as Record<string, number>,
    by_doctor: {} as Record<string, number>,
    total_invoices_count: invoices.length
  };

  invoices.forEach(inv => {
    summary.total_revenue += Number(inv.total_amount);
    summary.by_payment_method[inv.payment_method] = (summary.by_payment_method[inv.payment_method] || 0) + Number(inv.total_amount);
    if (inv.doctor_id) {
      summary.by_doctor[inv.doctor_id] = (summary.by_doctor[inv.doctor_id] || 0) + Number(inv.total_amount);
    }
  });

  res.json(summary);
});

export default router;

