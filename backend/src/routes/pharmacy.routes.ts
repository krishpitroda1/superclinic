import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, requireTenantType, requireRole } from '../middleware/auth';
import { PharmacySaleItemInput } from '../types';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Enforce Pharmacy isolation on all pharmacy routes
router.use(requireAuth, requireTenantType('pharmacy'));

// ============================================================================
// 1. INVENTORY & STOCK MANAGEMENT
// ============================================================================

// List / Search Inventory with stock alert flags
router.get('/inventory', requireRole(['pharmacy_owner', 'pharmacist']), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenant_id;
  const { search, low_stock_only, category, limit = 50, offset = 0 } = req.query;

  let query = supabase
    .from('pharmacy_inventory')
    .select('*', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .range(Number(offset), Number(offset) + Number(limit) - 1)
    .order('medicine_name', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.or(`medicine_name.ilike.%${search}%,generic_name.ilike.%${search}%,barcode.eq.${search}`);
  }

  const { data, error, count } = await query;
  if (error) return res.status(400).json({ error: error.message });

  // Filter low stock if requested
  const result = low_stock_only === 'true'
    ? data.filter(item => item.stock_level <= item.reorder_alert_threshold)
    : data;

  res.json({ data: result, total: count });
});

// Add New Medicine Batch to Inventory
router.post('/inventory', requireRole(['pharmacy_owner', 'pharmacist']), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenant_id;
  const {
    sku,
    barcode,
    medicine_name,
    generic_name,
    category,
    dosage_form,
    strength,
    manufacturer,
    batch_number,
    expiry_date,
    unit_cost_price,
    unit_mrp,
    unit_selling_price,
    stock_level,
    reorder_alert_threshold = 20,
    location_rack,
    is_prescription_required = true
  } = req.body;

  const { data, error } = await supabase
    .from('pharmacy_inventory')
    .insert({
      tenant_id: tenantId,
      sku,
      barcode,
      medicine_name,
      generic_name,
      category,
      dosage_form,
      strength,
      manufacturer,
      batch_number,
      expiry_date,
      unit_cost_price,
      unit_mrp,
      unit_selling_price,
      stock_level,
      reorder_alert_threshold,
      location_rack,
      is_prescription_required
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Update Inventory Stock / Price
router.patch('/inventory/:id', requireRole(['pharmacy_owner', 'pharmacist']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user!.tenant_id;

  const { data, error } = await supabase
    .from('pharmacy_inventory')
    .update(req.body)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ============================================================================
// 2. POS BILLING COUNTER (WALK-IN CHECKOUT)
// ============================================================================

router.post('/pos/checkout', requireRole(['pharmacy_owner', 'pharmacist']), async (req: Request, res: Response) => {
  const tenantId = req.user!.tenant_id;
  const cashierId = req.user!.id;
  const {
    customer_name = 'Walk-in Customer',
    customer_phone,
    doctor_reference,
    prescription_dispense_token_id,
    items, // PharmacySaleItemInput[]
    payment_method,
    payment_reference,
    discount_amount = 0,
    tax_amount = 0
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Checkout cart is empty.' });
  }

  // Generate Pharmacy Invoice Number
  const invoiceNumber = `POS-${Date.now().toString().slice(-7)}`;

  // 1. Verify stock availability for all items before checkout
  for (const item of items) {
    const { data: stockItem, error } = await supabase
      .from('pharmacy_inventory')
      .select('id, medicine_name, stock_level')
      .eq('id', item.inventory_id)
      .eq('tenant_id', tenantId)
      .single();

    if (error || !stockItem) {
      return res.status(400).json({ error: `Inventory item ${item.inventory_id} not found.` });
    }

    if (stockItem.stock_level < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for '${stockItem.medicine_name}'. Available: ${stockItem.stock_level}, Requested: ${item.quantity}`
      });
    }
  }

  // Calculate totals
  const subtotal = items.reduce((acc: number, it: any) => acc + (it.unit_price * it.quantity), 0);
  const totalAmount = subtotal + Number(tax_amount) - Number(discount_amount);

  // 2. Insert Sale Record
  const { data: sale, error: saleError } = await supabase
    .from('pharmacy_sales')
    .insert({
      tenant_id: tenantId,
      invoice_number: invoiceNumber,
      customer_name,
      customer_phone,
      doctor_reference,
      prescription_dispense_token_id: prescription_dispense_token_id || null,
      subtotal,
      tax_amount,
      discount_amount,
      total_amount: totalAmount,
      payment_method,
      payment_reference,
      cashier_id: cashierId,
      status: 'paid'
    })
    .select()
    .single();

  if (saleError) return res.status(400).json({ error: saleError.message });

  // 3. Insert Line Items (PostgreSQL trigger automatically decrements inventory stock level)
  const lineItems = items.map((it: any) => ({
    tenant_id: tenantId,
    sale_id: sale.id,
    inventory_id: it.inventory_id,
    medicine_name: it.medicine_name || 'Medicine Item',
    batch_number: it.batch_number || 'BATCH-DEFAULT',
    quantity: it.quantity,
    unit_mrp: it.unit_mrp || it.unit_price,
    unit_price: it.unit_price,
    discount_percent: it.discount_percent || 0,
    total_price: it.unit_price * it.quantity
  }));

  const { error: itemsError } = await supabase.from('pharmacy_sale_items').insert(lineItems);
  if (itemsError) return res.status(400).json({ error: itemsError.message });

  // 4. If this sale fulfilled a digital prescription token, update the token state
  if (prescription_dispense_token_id) {
    await supabase
      .from('prescription_dispense_tokens')
      .update({
        status: 'dispensed',
        dispensed_by_pharmacy_id: tenantId,
        dispensed_by_user_id: cashierId,
        pharmacy_sale_id: sale.id,
        dispensed_at: new Date().toISOString()
      })
      .eq('id', prescription_dispense_token_id);
  }

  res.status(201).json({ sale, items: lineItems });
});

// ============================================================================
// 3. SECURE DIGITAL PRESCRIPTION FULFILLMENT (UUID TOKEN BRIDGE)
// ============================================================================

// Look up a prescription token presented by a walk-in patient (QR / Token)
// Note: Reads ONLY the isolated token table snapshot, NOT the clinic's private EMR database!
router.get('/prescriptions/token/:tokenId', requireRole(['pharmacy_owner', 'pharmacist']), async (req: Request, res: Response) => {
  const { tokenId } = req.params;

  const { data: token, error } = await supabase
    .from('prescription_dispense_tokens')
    .select(`
      id,
      clinic_name,
      doctor_name,
      patient_masked_name,
      patient_phone,
      medication_snapshot,
      status,
      expires_at,
      dispensed_at
    `)
    .eq('id', tokenId)
    .single();

  if (error || !token) {
    return res.status(404).json({ error: 'Prescription token not found or invalid.' });
  }

  // Check expiration
  if (new Date(token.expires_at) < new Date()) {
    return res.status(410).json({ error: 'This prescription token has expired.', token });
  }

  if (token.status === 'dispensed') {
    return res.status(409).json({ error: 'This prescription has already been dispensed.', token });
  }

  res.json(token);
});

export default router;

