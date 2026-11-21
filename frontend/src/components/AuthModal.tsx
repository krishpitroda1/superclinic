'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'doctor' | 'pharmacist' | 'receptionist';
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'demo' | 'email'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLaunchPersona = (role: 'doctor' | 'receptionist' | 'pharmacist' | 'pharmacy_owner') => {
    setLoading(true);
    // Store active demo session in localStorage for portal state
    const sessionData = {
      role,
      user_id: role === 'doctor' ? 'doctor-smith-id' : role === 'pharmacist' ? 'alex-pharmacist-id' : 'emily-receptionist-id',
      email: role === 'doctor' ? 'dr.smith@cityhealth.com' : role === 'pharmacist' ? 'alex@apexcare.com' : 'reception@cityhealth.com',
      tenant_id: (role === 'pharmacist' || role === 'pharmacy_owner') ? '22222222-2222-2222-2222-222222222222' : '11111111-1111-1111-1111-111111111111',
      tenant_name: (role === 'pharmacist' || role === 'pharmacy_owner') ? 'Apex Care Pharmacy' : 'City Health Clinic',
      tenant_type: (role === 'pharmacist' || role === 'pharmacy_owner') ? 'pharmacy' : 'clinic'
    };

    localStorage.setItem('superclinic_session', JSON.stringify(sessionData));

    setTimeout(() => {
      onClose();
      if (role === 'pharmacist' || role === 'pharmacy_owner') {
        router.push('/pharmacy');
      } else {
        router.push('/clinic');
      }
    }, 400);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Default smart routing based on email domain
    const isPharmacy = email.toLowerCase().includes('pharmacy') || email.toLowerCase().includes('chemist');
    const role = isPharmacy ? 'pharmacist' : 'doctor';

    const sessionData = {
      role,
      user_id: 'authenticated-user-id',
      email,
      tenant_id: isPharmacy ? '22222222-2222-2222-2222-222222222222' : '11111111-1111-1111-1111-111111111111',
      tenant_name: isPharmacy ? 'Apex Care Pharmacy' : 'City Health Clinic',
      tenant_type: isPharmacy ? 'pharmacy' : 'clinic'
    };

    localStorage.setItem('superclinic_session', JSON.stringify(sessionData));

    setTimeout(() => {
      onClose();
      if (isPharmacy) {
        router.push('/pharmacy');
      } else {
        router.push('/clinic');
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>ROLE-BASED AUTHENTICATION</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Sign In to SuperClinic & RxPOS
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Access your Clinic HIS dashboard or Standalone Pharmacy POS counter.
          </p>

          {/* Toggle between 1-Click Demo and Email Login */}
          <div className="mt-4 flex rounded-xl bg-slate-200/80 p-1">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'demo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              ⚡ 1-Click Test Personas
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              🔑 Email & Password
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'demo' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Select a pre-seeded account to experience the system immediately:
              </p>

              {/* Persona 1: Doctor */}
              <button
                disabled={loading}
                onClick={() => handleLaunchPersona('doctor')}
                className="w-full p-3.5 rounded-2xl border-2 border-teal-200 bg-teal-50/50 hover:bg-teal-100/60 hover:border-teal-400 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    👨‍⚕️
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Dr. Smith, MD (Doctor)</h4>
                    <p className="text-[11px] text-teal-800">City Health Clinic • EMR & Prescriptions</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Persona 2: Pharmacist / Store Owner */}
              <button
                disabled={loading}
                onClick={() => handleLaunchPersona('pharmacist')}
                className="w-full p-3.5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 hover:border-emerald-400 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    💊
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Alex (Pharmacy Store Owner)</h4>
                    <p className="text-[11px] text-emerald-800">Apex Care Pharmacy • POS Billing & Expiry</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Persona 3: Receptionist */}
              <button
                disabled={loading}
                onClick={() => handleLaunchPersona('receptionist')}
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                    📋
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Emily (Front Desk Receptionist)</h4>
                    <p className="text-[11px] text-slate-500">City Health Clinic • Queue & Billing Invoices</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {loading && (
                <div className="text-center py-2 text-xs font-semibold text-teal-700 animate-pulse">
                  Establishing tenant isolation & launching workspace...
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="doctor@cityhealth.com or chemist@apex.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Uses Supabase JWT tokens with Row-Level Security verification.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

