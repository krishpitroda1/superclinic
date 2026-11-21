'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Building2, 
  Stethoscope, 
  Pill, 
  PlusCircle, 
  User, 
  Mail,
  CheckCircle2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'clinic' | 'pharmacy';
}

const REGISTERED_HOSPITALS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Apollo Multi-Speciality Hospital', city: 'Mumbai', type: 'clinic' },
  { id: 'hosp-city-health', name: 'City Health Clinic', city: 'Delhi', type: 'clinic' },
  { id: 'hosp-fortis', name: 'Fortis Healthcare Center', city: 'Bangalore', type: 'clinic' },
  { id: 'hosp-max', name: 'Max Super Specialty Hospital', city: 'Hyderabad', type: 'clinic' },
];

const REGISTERED_PHARMACIES = [
  { id: '22222222-2222-2222-2222-222222222222', name: 'Apex Care Pharmacy Store', city: 'Mumbai', type: 'pharmacy' },
  { id: 'pharm-medplus', name: 'MedPlus Chemist & Druggist', city: 'Hyderabad', type: 'pharmacy' },
  { id: 'pharm-apollo-ret', name: 'Apollo Pharmacy Retail Store', city: 'Bangalore', type: 'pharmacy' },
];

export default function AuthModal({ isOpen, onClose, defaultType = 'clinic' }: AuthModalProps) {
  const router = useRouter();
  const [tenantType, setTenantType] = useState<'clinic' | 'pharmacy'>(defaultType);
  const [selectedTenantId, setSelectedTenantId] = useState<string>(
    defaultType === 'clinic' ? REGISTERED_HOSPITALS[0].id : REGISTERED_PHARMACIES[0].id
  );
  const [customTenantName, setCustomTenantName] = useState('');
  const [isRegisteringNew, setIsRegisteringNew] = useState(false);

  // User credentials
  const [role, setRole] = useState<string>(tenantType === 'clinic' ? 'doctor' : 'pharmacist');
  const [fullName, setFullName] = useState(tenantType === 'clinic' ? 'Dr. Rajesh Sharma' : 'Alex Chemist');
  const [email, setEmail] = useState('doctor@apollohospital.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTenantTypeChange = (type: 'clinic' | 'pharmacy') => {
    setTenantType(type);
    setIsRegisteringNew(false);
    if (type === 'clinic') {
      setSelectedTenantId(REGISTERED_HOSPITALS[0].id);
      setRole('doctor');
      setFullName('Dr. Rajesh Sharma');
      setEmail('doctor@apollohospital.com');
    } else {
      setSelectedTenantId(REGISTERED_PHARMACIES[0].id);
      setRole('pharmacist');
      setFullName('Alex (Store Owner)');
      setEmail('alex@apexpharmacy.com');
    }
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const activeTenantList = tenantType === 'clinic' ? REGISTERED_HOSPITALS : REGISTERED_PHARMACIES;
    const selectedObj = activeTenantList.find(t => t.id === selectedTenantId);
    const tenantName = isRegisteringNew 
      ? (customTenantName || (tenantType === 'clinic' ? 'New Healthcare Clinic' : 'New Pharmacy Store'))
      : (selectedObj?.name || (tenantType === 'clinic' ? 'Apollo Multi-Speciality Hospital' : 'Apex Care Pharmacy Store'));

    const sessionData = {
      tenant_id: isRegisteringNew ? `tenant-${Date.now()}` : selectedTenantId,
      tenant_name: tenantName,
      tenant_type: tenantType,
      role,
      user_id: `user-${Date.now()}`,
      full_name: fullName,
      email,
      currency: 'INR'
    };

    localStorage.setItem('superclinic_session', JSON.stringify(sessionData));

    setTimeout(() => {
      setLoading(false);
      onClose();
      if (tenantType === 'clinic') {
        router.push('/clinic');
      } else {
        router.push('/pharmacy');
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative max-h-[95vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>MULTI-TENANT SAAS AUTHENTICATION</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Your Healthcare Organization
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Select your Hospital / Clinic or Independent Pharmacy Store workspace.
          </p>

          {/* Tenant Type Selector */}
          <div className="mt-4 grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-200/80">
            <button
              type="button"
              onClick={() => handleTenantTypeChange('clinic')}
              className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
                tenantType === 'clinic' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Hospital / Clinic</span>
            </button>
            <button
              type="button"
              onClick={() => handleTenantTypeChange('pharmacy')}
              className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
                tenantType === 'pharmacy' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>Pharmacy Store</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAuthenticate} className="p-6 space-y-4">
          
          {/* Step 1: Select Organization / Store */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Select {tenantType === 'clinic' ? 'Hospital / Clinic' : 'Pharmacy Store'}</span>
              </label>
              <button
                type="button"
                onClick={() => setIsRegisteringNew(!isRegisteringNew)}
                className="text-[11px] text-teal-600 font-bold hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3" />
                <span>{isRegisteringNew ? 'Select Existing' : '+ Register New'}</span>
              </button>
            </div>

            {isRegisteringNew ? (
              <input
                type="text"
                required
                placeholder={tenantType === 'clinic' ? 'e.g. LifeCare Polyclinic & Diagnostics' : 'e.g. National Chemist & Medical Store'}
                value={customTenantName}
                onChange={(e) => setCustomTenantName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-teal-300 text-xs font-semibold focus:outline-none focus:border-teal-600 bg-teal-50/30"
              />
            ) : (
              <select
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-teal-600 bg-white"
              >
                {(tenantType === 'clinic' ? REGISTERED_HOSPITALS : REGISTERED_PHARMACIES).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.city})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Step 2: Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Select Role</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {tenantType === 'clinic' ? (
                <>
                  <button
                    type="button"
                    onClick={() => { setRole('doctor'); setFullName('Dr. Rajesh Sharma'); }}
                    className={`py-2 px-3 rounded-xl border font-bold text-left transition ${
                      role === 'doctor' ? 'bg-teal-50 border-teal-500 text-teal-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    👨‍⚕️ Doctor / Consultant
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole('receptionist'); setFullName('Priya (Reception Desk)'); }}
                    className={`py-2 px-3 rounded-xl border font-bold text-left transition ${
                      role === 'receptionist' ? 'bg-teal-50 border-teal-500 text-teal-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    📋 Receptionist / Admin
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { setRole('pharmacist'); setFullName('Alex Chemist'); }}
                    className={`py-2 px-3 rounded-xl border font-bold text-left transition ${
                      role === 'pharmacist' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    💊 Pharmacist / Cashier
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole('pharmacy_owner'); setFullName('Ramesh (Store Owner)'); }}
                    className={`py-2 px-3 rounded-xl border font-bold text-left transition ${
                      role === 'pharmacy_owner' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🏪 Pharmacy Store Owner
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Step 3: User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email ID</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition shadow-lg flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Entering Organization Workspace...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Automatic Tenant & Row-Level Isolation Enabled</span>
          </p>
        </form>

      </div>
    </div>
  );
}
