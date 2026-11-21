-- ============================================================================
-- SUPERCLINIC & PHARMACY POS: SEED TEST DATA FOR SUPABASE
-- Run this in Supabase SQL Editor after running 20261112000000_init_schema.sql
-- ============================================================================

-- 1. Create Sample Tenants
INSERT INTO public.tenants (id, name, slug, type, subscription_tier, address, phone, email)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'City Health Clinic', 'city-health', 'clinic', 'pro', '123 Healthcare Ave, Medical City', '+1-555-0101', 'admin@cityhealth.com'),
  ('22222222-2222-2222-2222-222222222222', 'Apex Care Pharmacy', 'apex-care', 'pharmacy', 'pro', '456 Market St, Downtown', '+1-555-0202', 'contact@apexpharmacy.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Create Sample Patients for City Health Clinic
INSERT INTO public.patients (id, tenant_id, mrn, name, dob, gender, phone, email, height_cm, weight_kg, blood_group, chronic_conditions, allergies)
VALUES 
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'MRN-1001', 'Sarah Jenkins', '1988-04-12', 'Female', '+1-555-1122', 'sarah.j@example.com', 165.0, 62.5, 'O+', ARRAY['Hypertension'], ARRAY['Penicillin']),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'MRN-1002', 'David Miller', '1975-09-25', 'Male', '+1-555-3344', 'david.m@example.com', 178.0, 84.0, 'A+', ARRAY['Type 2 Diabetes'], ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- 3. Create Sample Pharmacy Inventory for Apex Care Pharmacy
INSERT INTO public.pharmacy_inventory (
  tenant_id, sku, barcode, medicine_name, generic_name, category, dosage_form, strength, 
  manufacturer, batch_number, expiry_date, unit_cost_price, unit_mrp, unit_selling_price, stock_level, reorder_alert_threshold
) VALUES 
  ('22222222-2222-2222-2222-222222222222', 'MED-AMOX-500', '8901234567890', 'Amoxicillin 500mg', 'Amoxicillin Trihydrate', 'Antibiotics', 'Capsule', '500mg', 'Pfizer Labs', 'BAT-2026-A1', '2028-12-31', 4.50, 9.99, 8.99, 150, 30),
  ('22222222-2222-2222-2222-222222222222', 'MED-MET-500', '8901234567891', 'Metformin HCl 500mg', 'Metformin Hydrochloride', 'Antidiabetic', 'Tablet', '500mg', 'Novartis', 'BAT-2026-M2', '2028-06-30', 2.20, 5.50, 4.99, 200, 40),
  ('22222222-2222-2222-2222-222222222222', 'MED-LIS-10', '8901234567892', 'Lisinopril 10mg', 'Lisinopril Dihydrate', 'Cardiovascular', 'Tablet', '10mg', 'AstraZeneca', 'BAT-2026-L3', '2027-11-30', 3.80, 7.50, 6.99, 12, 25) -- Triggering reorder alert (< 25)
ON CONFLICT DO NOTHING;

