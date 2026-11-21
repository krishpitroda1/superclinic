export type TenantType = 'clinic' | 'pharmacy';

export type UserRole = 
  | 'super_admin'
  | 'clinic_admin'
  | 'doctor'
  | 'receptionist'
  | 'pharmacy_owner'
  | 'pharmacist';

export type AppointmentStatus = 
  | 'scheduled'
  | 'checked_in'
  | 'in_consultation'
  | 'emergency'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'insurance' | 'net_banking';

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'partially_paid' | 'cancelled' | 'refunded';

export type PrescriptionStatus = 'active' | 'dispensed' | 'partially_dispensed' | 'cancelled' | 'expired';

export interface AuthenticatedUser {
  id: string; // Supabase auth.users UUID
  email: string;
  tenant_id: string; // Multi-tenant context
  role: UserRole;
  tenant_type: TenantType;
}

export interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string; // e.g. "1-0-1", "TID"
  duration: string; // e.g. "5 days"
  route: string; // e.g. "Oral", "Topical"
  instructions?: string; // e.g. "After food"
}

export interface PharmacySaleItemInput {
  inventory_id: string;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
}

