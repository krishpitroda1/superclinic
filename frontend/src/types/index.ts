export type TenantType = 'clinic' | 'pharmacy';

export type UserRole = 
  | 'super_admin'
  | 'clinic_admin'
  | 'doctor'
  | 'receptionist'
  | 'pharmacy_owner'
  | 'pharmacist';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: TenantType;
  branding_logo?: string;
  subscription_tier: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Patient {
  id: string;
  tenant_id: string;
  mrn: string;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email?: string;
  height_cm?: number;
  weight_kg?: number;
  blood_group?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  created_at: string;
}

export interface Appointment {
  id: string;
  tenant_id: string;
  patient_id: string;
  doctor_id: string;
  time_slot: string;
  token_number: number;
  status: 'scheduled' | 'checked_in' | 'in_consultation' | 'emergency' | 'completed' | 'cancelled';
  is_emergency: boolean;
  reason_for_visit?: string;
  patient?: Patient;
}

export interface Prescription {
  id: string;
  tenant_id: string;
  patient_id: string;
  doctor_id: string;
  icd10_code: string;
  icd10_description?: string;
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  advice?: string;
  created_at: string;
}

export interface PharmacyInventoryItem {
  id: string;
  tenant_id: string;
  sku?: string;
  barcode?: string;
  medicine_name: string;
  generic_name?: string;
  category: string;
  dosage_form: string;
  strength?: string;
  batch_number: string;
  expiry_date: string;
  unit_cost_price: number;
  unit_mrp: number;
  unit_selling_price: number;
  stock_level: number;
  reorder_alert_threshold: number;
  location_rack?: string;
}

export interface PrescriptionDispenseToken {
  id: string;
  prescription_id: string;
  clinic_tenant_id: string;
  clinic_name: string;
  doctor_name: string;
  patient_masked_name: string;
  patient_phone: string;
  medication_snapshot: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  status: 'active' | 'dispensed' | 'cancelled' | 'expired';
  expires_at: string;
  dispensed_at?: string;
}

