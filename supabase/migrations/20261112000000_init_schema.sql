-- ============================================================================
-- SUPERCLINIC & PHARMACY POS: MULTI-TENANT SAAS DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ============================================================================
-- Architecture: Hybrid Shared Database, Shared Schema with Strict Row-Level Security (RLS)
-- Target Platform: Supabase (PostgreSQL 15+)
-- Isolation: Tenant ID + Tenant Type Guardrails + Role-Based Access Control (RBAC)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. ENUMS & DOMAINS
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE tenant_type_enum AS ENUM ('clinic', 'pharmacy');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier_enum AS ENUM ('free', 'starter', 'pro', 'enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'super_admin',
        'clinic_admin',
        'doctor',
        'receptionist',
        'pharmacy_owner',
        'pharmacist'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status_enum AS ENUM (
        'scheduled',
        'checked_in',
        'in_consultation',
        'emergency',
        'completed',
        'cancelled',
        'no_show'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_enum AS ENUM ('cash', 'upi', 'card', 'insurance', 'net_banking');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status_enum AS ENUM ('draft', 'issued', 'paid', 'partially_paid', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE prescription_status_enum AS ENUM ('active', 'dispensed', 'partially_dispensed', 'cancelled', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE token_dispense_status_enum AS ENUM ('active', 'dispensed', 'cancelled', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE broadcast_status_enum AS ENUM ('queued', 'sent', 'delivered', 'read', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_action_enum AS ENUM ('READ', 'CREATE', 'UPDATE', 'DELETE', 'DISPENSE', 'EXPORT_PDF');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. CORE TENANT & USER MANAGEMENT
-- ============================================================================

-- Tenants Table
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type tenant_type_enum NOT NULL,
    branding_logo TEXT,
    address TEXT,
    phone VARCHAR(30),
    email VARCHAR(255),
    tax_identifier VARCHAR(50), -- GSTIN / VAT / Tax ID
    subscription_tier subscription_tier_enum NOT NULL DEFAULT 'starter',
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'active',
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Users / Profiles Table (Integrated with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL,
    phone VARCHAR(30),
    is_active BOOLEAN NOT NULL DEFAULT true,
    specialization VARCHAR(100), -- For doctors
    license_number VARCHAR(100), -- Medical council / Pharmacy council license
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    
    -- Constraint: super_admin can have NULL tenant_id, all other roles MUST have tenant_id
    CONSTRAINT chk_user_tenant_role CHECK (
        (role = 'super_admin' AND tenant_id IS NULL) OR
        (role <> 'super_admin' AND tenant_id IS NOT NULL)
    )
);

-- ============================================================================
-- 4. CLINIC HIS MODULE TABLES (CLINIC TENANTS ONLY)
-- ============================================================================

-- Patients Table (EMR Demographics & Core Medical Profile)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    mrn VARCHAR(50) NOT NULL, -- Medical Record Number (unique per clinic)
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    blood_group VARCHAR(10),
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    emergency_contact JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT uq_clinic_mrn UNIQUE(tenant_id, mrn)
);

-- Appointments & Queue Management Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    time_slot TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 15,
    token_number INT NOT NULL, -- Daily queue token number
    status appointment_status_enum NOT NULL DEFAULT 'scheduled',
    is_emergency BOOLEAN NOT NULL DEFAULT false,
    reason_for_visit TEXT,
    symptoms TEXT,
    check_in_time TIMESTAMPTZ,
    consultation_start_time TIMESTAMPTZ,
    consultation_end_time TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Billing & Invoices Table (Clinic Fee Collection)
CREATE TABLE IF NOT EXISTS public.clinic_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL,
    payment_method payment_method_enum NOT NULL,
    payment_transaction_ref VARCHAR(100),
    status invoice_status_enum NOT NULL DEFAULT 'paid',
    notes TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT uq_clinic_invoice_number UNIQUE(tenant_id, invoice_number)
);

-- Clinic Invoice Line Items
CREATE TABLE IF NOT EXISTS public.clinic_invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES public.clinic_invoices(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL, -- e.g. "General Consultation", "ECG", "Dressing"
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12,2) NOT NULL,
    total_price NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Prescriptions Table (EMR Digital Prescriptions)
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    doctor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    icd10_code VARCHAR(20) NOT NULL,
    icd10_description VARCHAR(255),
    vitals_snapshot JSONB DEFAULT '{}'::jsonb, -- BP, Pulse, Temp, SpO2 at time of consult
    diagnosis TEXT NOT NULL,
    medications JSONB NOT NULL, -- Array of objects: [{name, dosage, frequency, duration, route, instructions}]
    advice TEXT,
    follow_up_date DATE,
    status prescription_status_enum NOT NULL DEFAULT 'active',
    pdf_storage_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- WhatsApp Broadcast / Notification Log Table
CREATE TABLE IF NOT EXISTS public.whatsapp_broadcast_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    campaign_type VARCHAR(100) NOT NULL, -- 'doctor_delay', 'emergency_notice', 'appointment_reminder', 'rx_download'
    doctor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    recipient_phone VARCHAR(30) NOT NULL,
    recipient_patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    template_name VARCHAR(100) NOT NULL,
    template_params JSONB NOT NULL DEFAULT '{}'::jsonb,
    provider VARCHAR(50) NOT NULL DEFAULT 'meta', -- 'meta', 'twilio'
    provider_message_id VARCHAR(255),
    status broadcast_status_enum NOT NULL DEFAULT 'queued',
    error_message TEXT,
    retry_count INT NOT NULL DEFAULT 0,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 5. PHARMACY POS MODULE TABLES (PHARMACY TENANTS ONLY)
-- ============================================================================

-- Pharmacy Inventory Table (Real-time Stock Management)
CREATE TABLE IF NOT EXISTS public.pharmacy_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    medicine_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    category VARCHAR(100) NOT NULL, -- 'Antibiotics', 'Analgesics', 'Cardiovascular', etc.
    dosage_form VARCHAR(50) NOT NULL, -- 'Tablet', 'Syrup', 'Injection', 'Ointment'
    strength VARCHAR(50), -- '500mg', '10ml', etc.
    manufacturer VARCHAR(255),
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    unit_cost_price NUMERIC(12,2) NOT NULL,
    unit_mrp NUMERIC(12,2) NOT NULL,
    unit_selling_price NUMERIC(12,2) NOT NULL,
    stock_level INT NOT NULL DEFAULT 0,
    reorder_alert_threshold INT NOT NULL DEFAULT 20,
    location_rack VARCHAR(50),
    is_prescription_required BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT uq_pharmacy_batch UNIQUE(tenant_id, medicine_name, batch_number),
    CONSTRAINT chk_positive_stock CHECK (stock_level >= 0)
);

-- Pharmacy Sales / POS Invoices Table
CREATE TABLE IF NOT EXISTS public.pharmacy_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255) DEFAULT 'Walk-in Customer',
    customer_phone VARCHAR(30),
    doctor_reference VARCHAR(255), -- Name of prescribing doctor
    prescription_dispense_token_id UUID, -- Optional foreign fulfillment reference
    subtotal NUMERIC(12,2) NOT NULL,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL,
    payment_method payment_method_enum NOT NULL,
    payment_reference VARCHAR(100),
    status invoice_status_enum NOT NULL DEFAULT 'paid',
    cashier_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT uq_pharmacy_invoice_number UNIQUE(tenant_id, invoice_number)
);

-- Pharmacy Sales Line Items Table
CREATE TABLE IF NOT EXISTS public.pharmacy_sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    sale_id UUID NOT NULL REFERENCES public.pharmacy_sales(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES public.pharmacy_inventory(id) ON DELETE RESTRICT,
    medicine_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_mrp NUMERIC(12,2) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    discount_percent NUMERIC(5,2) DEFAULT 0.00,
    total_price NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT chk_sale_quantity CHECK (quantity > 0)
);

-- ============================================================================
-- 6. SECURE BRIDGE: PRESCRIPTION DISPENSE TOKENS (ZERO DB COUPLING)
-- ============================================================================
-- Allows Pharmacies to fulfill Clinic Digital Prescriptions via a secure UUID token
-- without granting cross-tenant database read access to patient clinical records.

CREATE TABLE IF NOT EXISTS public.prescription_dispense_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Shared Token presented to Pharmacy (QR / UUID)
    prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    clinic_tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    clinic_name VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    patient_masked_name VARCHAR(255) NOT NULL, -- e.g. "J*** D**" or First Name only for HIPAA/GDPR
    patient_phone VARCHAR(30) NOT NULL,
    verification_pin_hash VARCHAR(255), -- Optional 4-digit OTP or PIN for dispensing safety
    medication_snapshot JSONB NOT NULL, -- Exact prescribed items snapshot at time of issue
    status token_dispense_status_enum NOT NULL DEFAULT 'active',
    dispensed_by_pharmacy_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    dispensed_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    pharmacy_sale_id UUID REFERENCES public.pharmacy_sales(id) ON DELETE SET NULL,
    dispensed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now() + interval '30 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add Foreign Key back to pharmacy_sales now that token table exists
ALTER TABLE public.pharmacy_sales
ADD CONSTRAINT fk_sales_dispense_token
FOREIGN KEY (prescription_dispense_token_id)
REFERENCES public.prescription_dispense_tokens(id)
ON DELETE SET NULL;

-- ============================================================================
-- 7. AUDIT LOGGING MODULE (TAMPER-RESISTANT EMR & PRESCRIPTION AUDIT)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    user_role user_role_enum,
    action audit_action_enum NOT NULL,
    resource_type VARCHAR(100) NOT NULL, -- 'PATIENT_EMR', 'PRESCRIPTION', 'BILLING', 'INVENTORY'
    resource_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_fields TEXT[],
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 8. PERFORMANCE INDEXES
-- ============================================================================

-- Tenants & Users
CREATE INDEX IF NOT EXISTS idx_tenants_type ON public.tenants(type);
CREATE INDEX IF NOT EXISTS idx_users_tenant_role ON public.users(tenant_id, role);

-- Patients & Appointments (Clinic)
CREATE INDEX IF NOT EXISTS idx_patients_tenant ON public.patients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_patients_tenant_phone ON public.patients(tenant_id, phone);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_slot ON public.appointments(tenant_id, time_slot);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_doctor_date ON public.appointments(tenant_id, doctor_id, time_slot);
CREATE INDEX IF NOT EXISTS idx_appointments_queue ON public.appointments(tenant_id, time_slot, status, is_emergency);

-- Billing & Invoices (Clinic)
CREATE INDEX IF NOT EXISTS idx_clinic_invoices_tenant_patient ON public.clinic_invoices(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_clinic_invoices_tenant_created ON public.clinic_invoices(tenant_id, created_at);

-- Prescriptions (Clinic)
CREATE INDEX IF NOT EXISTS idx_prescriptions_tenant_patient ON public.prescriptions(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON public.prescriptions(tenant_id, doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_created ON public.prescriptions(tenant_id, created_at);

-- WhatsApp Logs
CREATE INDEX IF NOT EXISTS idx_whatsapp_tenant_status ON public.whatsapp_broadcast_logs(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_provider_msg_id ON public.whatsapp_broadcast_logs(provider_message_id);

-- Pharmacy Inventory & Sales
CREATE INDEX IF NOT EXISTS idx_pharmacy_inv_tenant ON public.pharmacy_inventory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_inv_barcode ON public.pharmacy_inventory(tenant_id, barcode);
CREATE INDEX IF NOT EXISTS idx_pharmacy_inv_stock_alert ON public.pharmacy_inventory(tenant_id, stock_level) WHERE stock_level <= reorder_alert_threshold;
CREATE INDEX IF NOT EXISTS idx_pharmacy_inv_expiry ON public.pharmacy_inventory(tenant_id, expiry_date);
CREATE INDEX IF NOT EXISTS idx_pharmacy_sales_tenant_date ON public.pharmacy_sales(tenant_id, created_at);

-- Prescription Dispense Tokens
CREATE INDEX IF NOT EXISTS idx_dispense_tokens_status ON public.prescription_dispense_tokens(id, status);
CREATE INDEX IF NOT EXISTS idx_dispense_tokens_clinic ON public.prescription_dispense_tokens(clinic_tenant_id);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_resource ON public.audit_logs(tenant_id, resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_date ON public.audit_logs(user_id, created_at DESC);

-- ============================================================================
-- 9. SUPABASE SECURITY DEFINER HELPER FUNCTIONS (RLS ENGINE)
-- ============================================================================
-- These functions extract tenant context directly from the authenticated session
-- and cache them with STABLE execution for optimal RLS query performance.

CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID AS $$
    SELECT auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID AS $$
    SELECT tenant_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role_enum AS $$
    SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_tenant_type()
RETURNS tenant_type_enum AS $$
    SELECT t.type 
    FROM public.tenants t
    JOIN public.users u ON u.tenant_id = t.id
    WHERE u.id = auth.uid() 
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'super_admin'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================================
-- 10. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS across all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_broadcast_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_dispense_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- Tenants Policies
--------------------------------------------------------------------------------
CREATE POLICY "SuperAdmin full access on tenants"
    ON public.tenants FOR ALL
    USING (public.is_super_admin());

CREATE POLICY "Users can view their own tenant"
    ON public.tenants FOR SELECT
    USING (id = public.current_tenant_id());

CREATE POLICY "Tenant owners/admins can update their tenant settings"
    ON public.tenants FOR UPDATE
    USING (
        id = public.current_tenant_id() AND 
        public.current_user_role() IN ('clinic_admin', 'pharmacy_owner')
    );

--------------------------------------------------------------------------------
-- Users & Roles Policies
--------------------------------------------------------------------------------
CREATE POLICY "SuperAdmin full access on users"
    ON public.users FOR ALL
    USING (public.is_super_admin());

CREATE POLICY "Users can view members of their own tenant"
    ON public.users FOR SELECT
    USING (tenant_id = public.current_tenant_id());

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Admins can manage members of their own tenant"
    ON public.users FOR ALL
    USING (
        tenant_id = public.current_tenant_id() AND
        public.current_user_role() IN ('clinic_admin', 'pharmacy_owner')
    );

--------------------------------------------------------------------------------
-- Clinic HIS: Patients Policies (Clinic Tenants Only)
--------------------------------------------------------------------------------
CREATE POLICY "Clinic members can view their clinic patients"
    ON public.patients FOR SELECT
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'clinic' AND
            public.current_user_role() IN ('clinic_admin', 'doctor', 'receptionist')
        )
    );

CREATE POLICY "Clinic staff can insert and update clinic patients"
    ON public.patients FOR INSERT
    WITH CHECK (
        tenant_id = public.current_tenant_id() AND
        public.current_tenant_type() = 'clinic' AND
        public.current_user_role() IN ('clinic_admin', 'doctor', 'receptionist')
    );

CREATE POLICY "Clinic staff can update clinic patients"
    ON public.patients FOR UPDATE
    USING (
        tenant_id = public.current_tenant_id() AND
        public.current_tenant_type() = 'clinic' AND
        public.current_user_role() IN ('clinic_admin', 'doctor', 'receptionist')
    );

CREATE POLICY "Only ClinicAdmin can delete clinic patients"
    ON public.patients FOR DELETE
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'clinic' AND
            public.current_user_role() = 'clinic_admin'
        )
    );

--------------------------------------------------------------------------------
-- Clinic HIS: Appointments Policies
--------------------------------------------------------------------------------
CREATE POLICY "Clinic staff can view appointments"
    ON public.appointments FOR SELECT
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'clinic' AND
            public.current_user_role() IN ('clinic_admin', 'doctor', 'receptionist')
        )
    );

CREATE POLICY "Clinic staff can manage appointments"
    ON public.appointments FOR ALL
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'clinic' AND
            public.current_user_role() IN ('clinic_admin', 'doctor', 'receptionist')
        )
    );

--------------------------------------------------------------------------------
-- Clinic HIS: Invoices & Line Items Policies
--------------------------------------------------------------------------------
CREATE POLICY "Clinic staff can view clinic invoices"
    ON public.clinic_invoices FOR SELECT
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'clinic' AND
            public.current_user_role() IN ('clinic_admin', 'receptionist', 'doctor')
        )
    );

CREATE POLICY "Receptionists and ClinicAdmins can create clinic invoices"
    ON public.clinic_invoices FOR INSERT
    WITH CHECK (
        tenant_id = public.current_tenant_id() AND
        public.current_tenant_type() = 'clinic' AND
        public.current_user_role() IN ('clinic_admin', 'receptionist')
    );

CREATE POLICY "Receptionists and ClinicAdmins can update clinic invoices"
    ON public.clinic_invoices FOR UPDATE
    USING (
        tenant_id = public.current_tenant_id() AND
        public.current_tenant_type() = 'clinic' AND
        public.current_user_role() IN ('clinic_admin', 'receptionist')
    );

CREATE POLICY "Clinic staff can view clinic invoice items"
    ON public.clinic_invoice_items FOR SELECT
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'clinic'
        )
    );

CREATE POLICY "Clinic staff can manage invoice items"
    ON public.clinic_invoice_items FOR ALL
    USING (
        tenant_id = public.current_tenant_id() AND
        public.current_tenant_type() = 'clinic' AND
        public.current_user_role() IN ('clinic_admin', 'receptionist')
    );

--------------------------------------------------------------------------------
-- Clinic HIS: Prescriptions Policies (Doctors write, Clinic staff view)
--------------------------------------------------------------------------------
CREATE POLICY "Clinic staff can view prescriptions"
    ON public.prescriptions FOR SELECT
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'clinic' AND
            public.current_user_role() IN ('clinic_admin', 'doctor', 'receptionist')
        )
    );

CREATE POLICY "Only Doctors can issue prescriptions"
    ON public.prescriptions FOR INSERT
    WITH CHECK (
        tenant_id = public.current_tenant_id() AND
        public.current_tenant_type() = 'clinic' AND
        public.current_user_role() = 'doctor' AND
        doctor_id = auth.uid()
    );

CREATE POLICY "Only prescribing Doctor or ClinicAdmin can update prescription"
    ON public.prescriptions FOR UPDATE
    USING (
        tenant_id = public.current_tenant_id() AND
        public.current_tenant_type() = 'clinic' AND
        (
            public.current_user_role() = 'clinic_admin' OR 
            (public.current_user_role() = 'doctor' AND doctor_id = auth.uid())
        )
    );

--------------------------------------------------------------------------------
-- Clinic HIS: WhatsApp Broadcast Logs Policies
--------------------------------------------------------------------------------
CREATE POLICY "Clinic staff can view whatsapp logs"
    ON public.whatsapp_broadcast_logs FOR SELECT
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'clinic'
        )
    );

CREATE POLICY "Clinic admins and receptionists can insert whatsapp broadcast logs"
    ON public.whatsapp_broadcast_logs FOR INSERT
    WITH CHECK (
        tenant_id = public.current_tenant_id() AND
        public.current_tenant_type() = 'clinic' AND
        public.current_user_role() IN ('clinic_admin', 'receptionist', 'doctor')
    );

--------------------------------------------------------------------------------
-- Pharmacy POS: Inventory Policies (Pharmacy Tenants Only)
--------------------------------------------------------------------------------
CREATE POLICY "Pharmacy staff can view pharmacy inventory"
    ON public.pharmacy_inventory FOR SELECT
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'pharmacy' AND
            public.current_user_role() IN ('pharmacy_owner', 'pharmacist')
        )
    );

CREATE POLICY "Pharmacy staff can manage pharmacy inventory"
    ON public.pharmacy_inventory FOR ALL
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'pharmacy' AND
            public.current_user_role() IN ('pharmacy_owner', 'pharmacist')
        )
    );

--------------------------------------------------------------------------------
-- Pharmacy POS: Sales & Items Policies
--------------------------------------------------------------------------------
CREATE POLICY "Pharmacy staff can view sales"
    ON public.pharmacy_sales FOR SELECT
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'pharmacy' AND
            public.current_user_role() IN ('pharmacy_owner', 'pharmacist')
        )
    );

CREATE POLICY "Pharmacy staff can record POS sales"
    ON public.pharmacy_sales FOR INSERT
    WITH CHECK (
        tenant_id = public.current_tenant_id() AND
        public.current_tenant_type() = 'pharmacy' AND
        public.current_user_role() IN ('pharmacy_owner', 'pharmacist')
    );

CREATE POLICY "Pharmacy staff can view sale items"
    ON public.pharmacy_sale_items FOR SELECT
    USING (
        public.is_super_admin() OR (
            tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'pharmacy'
        )
    );

CREATE POLICY "Pharmacy staff can insert sale items"
    ON public.pharmacy_sale_items FOR INSERT
    WITH CHECK (
        tenant_id = public.current_tenant_id() AND
        public.current_tenant_type() = 'pharmacy' AND
        public.current_user_role() IN ('pharmacy_owner', 'pharmacist')
    );

--------------------------------------------------------------------------------
-- Bridge: Prescription Dispense Tokens Policies
--------------------------------------------------------------------------------
-- Clinics can create tokens for their own prescriptions
CREATE POLICY "Clinics can manage their own dispense tokens"
    ON public.prescription_dispense_tokens FOR ALL
    USING (
        public.is_super_admin() OR (
            clinic_tenant_id = public.current_tenant_id() AND
            public.current_tenant_type() = 'clinic'
        )
    );

-- Pharmacies can lookup and verify an active token by its exact UUID token ID!
CREATE POLICY "Pharmacies can read active tokens for fulfillment"
    ON public.prescription_dispense_tokens FOR SELECT
    USING (
        public.is_super_admin() OR (
            public.current_tenant_type() = 'pharmacy' AND
            public.current_user_role() IN ('pharmacy_owner', 'pharmacist') AND
            status IN ('active', 'dispensed')
        )
    );

-- Pharmacies can update token status to 'dispensed' upon fulfilling
CREATE POLICY "Pharmacies can mark token as dispensed"
    ON public.prescription_dispense_tokens FOR UPDATE
    USING (
        public.is_super_admin() OR (
            public.current_tenant_type() = 'pharmacy' AND
            public.current_user_role() IN ('pharmacy_owner', 'pharmacist')
        )
    )
    WITH CHECK (
        dispensed_by_pharmacy_id = public.current_tenant_id() AND
        dispensed_by_user_id = auth.uid()
    );

--------------------------------------------------------------------------------
-- Audit Logs Policies (Append Only, Read Restricted)
--------------------------------------------------------------------------------
CREATE POLICY "SuperAdmin can view all audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.is_super_admin());

CREATE POLICY "Tenant Admins can view their own tenant audit logs"
    ON public.audit_logs FOR SELECT
    USING (
        tenant_id = public.current_tenant_id() AND
        public.current_user_role() IN ('clinic_admin', 'pharmacy_owner')
    );

CREATE POLICY "Authenticated users and triggers can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- 11. AUTOMATED TRIGGERS & BUSINESS LOGIC
-- ============================================================================

-- A. Timestamp Updating Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_clinic_invoices_updated_at BEFORE UPDATE ON public.clinic_invoices FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_pharmacy_inventory_updated_at BEFORE UPDATE ON public.pharmacy_inventory FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_pharmacy_sales_updated_at BEFORE UPDATE ON public.pharmacy_sales FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- B. Automated EMR and Prescription Mutation Audit Trigger
CREATE OR REPLACE FUNCTION public.audit_record_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_user_email VARCHAR(255);
    v_user_role user_role_enum;
    v_tenant_id UUID;
    v_action audit_action_enum;
    v_res_type VARCHAR(100);
    v_res_id UUID;
    v_old JSONB := NULL;
    v_new JSONB := NULL;
BEGIN
    -- Determine action
    IF (TG_OP = 'INSERT') THEN
        v_action := 'CREATE';
        v_res_id := NEW.id;
        v_new := to_jsonb(NEW);
        v_tenant_id := NEW.tenant_id;
    ELSIF (TG_OP = 'UPDATE') THEN
        v_action := 'UPDATE';
        v_res_id := NEW.id;
        v_old := to_jsonb(OLD);
        v_new := to_jsonb(NEW);
        v_tenant_id := NEW.tenant_id;
    ELSIF (TG_OP = 'DELETE') THEN
        v_action := 'DELETE';
        v_res_id := OLD.id;
        v_old := to_jsonb(OLD);
        v_tenant_id := OLD.tenant_id;
    END IF;

    -- Lookup user info
    SELECT email, role INTO v_user_email, v_user_role 
    FROM public.users WHERE id = auth.uid();

    -- Determine resource type
    IF TG_TABLE_NAME = 'patients' THEN
        v_res_type := 'PATIENT_EMR';
    ELSIF TG_TABLE_NAME = 'prescriptions' THEN
        v_res_type := 'PRESCRIPTION';
    ELSE
        v_res_type := UPPER(TG_TABLE_NAME);
    END IF;

    -- Insert audit log entry
    INSERT INTO public.audit_logs (
        tenant_id,
        user_id,
        user_email,
        user_role,
        action,
        resource_type,
        resource_id,
        old_data,
        new_data,
        created_at
    ) VALUES (
        v_tenant_id,
        auth.uid(),
        v_user_email,
        v_user_role,
        v_action,
        v_res_type,
        v_res_id,
        v_old,
        v_new,
        timezone('utc'::text, now())
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind audit triggers to critical EMR tables
CREATE TRIGGER trg_audit_patients
    AFTER INSERT OR UPDATE OR DELETE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.audit_record_changes();

CREATE TRIGGER trg_audit_prescriptions
    AFTER INSERT OR UPDATE OR DELETE ON public.prescriptions
    FOR EACH ROW EXECUTE FUNCTION public.audit_record_changes();

-- C. Real-Time Pharmacy Stock Deduction Trigger upon POS Sale
CREATE OR REPLACE FUNCTION public.deduct_inventory_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.pharmacy_inventory
    SET stock_level = stock_level - NEW.quantity,
        updated_at = timezone('utc'::text, now())
    WHERE id = NEW.inventory_id
      AND tenant_id = NEW.tenant_id;

    -- Ensure stock did not go negative
    IF (SELECT stock_level FROM public.pharmacy_inventory WHERE id = NEW.inventory_id) < 0 THEN
        RAISE EXCEPTION 'Insufficient stock for inventory item ID %', NEW.inventory_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_deduct_inventory_item
    AFTER INSERT ON public.pharmacy_sale_items
    FOR EACH ROW EXECUTE FUNCTION public.deduct_inventory_on_sale();

-- D. Auto-Generate Dispense Token When Prescription is Created
CREATE OR REPLACE FUNCTION public.generate_dispense_token_for_prescription()
RETURNS TRIGGER AS $$
DECLARE
    v_clinic_name VARCHAR(255);
    v_doctor_name VARCHAR(255);
    v_patient_name VARCHAR(255);
    v_patient_phone VARCHAR(30);
    v_masked_name VARCHAR(255);
BEGIN
    -- Fetch clinic name
    SELECT name INTO v_clinic_name FROM public.tenants WHERE id = NEW.tenant_id;
    
    -- Fetch doctor name
    SELECT full_name INTO v_doctor_name FROM public.users WHERE id = NEW.doctor_id;

    -- Fetch patient details
    SELECT name, phone INTO v_patient_name, v_patient_phone FROM public.patients WHERE id = NEW.patient_id;

    -- Simple name masking (e.g., "John Doe" -> "J*** D**")
    v_masked_name := regexp_replace(v_patient_name, '(\w)\w+', '\1***', 'g');

    -- Insert active dispense token
    INSERT INTO public.prescription_dispense_tokens (
        prescription_id,
        clinic_tenant_id,
        clinic_name,
        doctor_name,
        patient_masked_name,
        patient_phone,
        medication_snapshot,
        status,
        expires_at
    ) VALUES (
        NEW.id,
        NEW.tenant_id,
        v_clinic_name,
        v_doctor_name,
        v_masked_name,
        v_patient_phone,
        NEW.medications,
        'active',
        timezone('utc'::text, now() + interval '30 days')
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_create_dispense_token
    AFTER INSERT ON public.prescriptions
    FOR EACH ROW EXECUTE FUNCTION public.generate_dispense_token_for_prescription();

