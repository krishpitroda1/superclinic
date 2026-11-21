'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Pill, Stethoscope, Building2 } from 'lucide-react';

interface PricingSectionProps {
  onOpenAuth: (type?: 'clinic' | 'pharmacy') => void;
}

export default function PricingSection({ onOpenAuth }: PricingSectionProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs uppercase tracking-widest font-bold text-teal-600 mb-2">
            Transparent Pricing in ₹ Indian Rupees (INR)
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Buy What You Need. Scale When You Grow.
          </p>
          <p className="mt-3 text-slate-600 text-base">
            Pharmacy store owners can purchase the Standalone POS directly. Clinics can run solo or expand to full in-house pharmacy operations.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly Billing</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-slate-900 p-1 relative transition-colors focus:outline-none"
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Annual Billing
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid (4 Tiers) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Plan 1: Clinic Starter */}
          <div className="rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2 text-teal-700 font-bold text-sm mb-2">
                <Stethoscope className="w-4 h-4" />
                <span>Clinic Starter</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Solo OPD practitioners and small consulting rooms.</p>
              
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{isAnnual ? '1,599' : '1,999'}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>1 Doctor Account</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Up to 500 Patient EMRs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Smart Queue & Token Manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Digital Prescriptions & ICD-10</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Cabin vs Admin Fee Collection</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenAuth('clinic')}
              className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition"
            >
              Start Free Trial
            </button>
          </div>

          {/* Plan 2: STANDALONE PHARMACY STORE (Direct to Store Owners!) */}
          <div className="rounded-3xl border-2 border-emerald-500 p-6 flex flex-col justify-between bg-white shadow-xl shadow-emerald-500/10 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Direct Pharmacy Purchase</span>
            </div>

            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2 mt-1">
                <Pill className="w-4 h-4" />
                <span>Standalone Pharmacy Store</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">For independent retail chemists and pharmacy owners.</p>
              
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{isAnnual ? '1,999' : '2,499'}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Walk-in POS Billing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Top 30 Indian Drug Inventory Stock</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Batch Expiry Alerts (30/60/90 Days)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Total Monthly Sales & Profit in ₹</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Thermal Receipt & Barcode Ready</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Optional: Scan Clinic QR Prescriptions</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenAuth('pharmacy')}
              className="mt-8 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
            >
              Get Pharmacy Store POS
            </button>
          </div>

          {/* Plan 3: Clinic Pro */}
          <div className="rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2 text-teal-700 font-bold text-sm mb-2">
                <Building2 className="w-4 h-4" />
                <span>Clinic Pro</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Polyclinics & high-volume medical centers.</p>
              
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{isAnnual ? '3,999' : '4,999'}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Up to 5 Doctors & Receptionists</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Unlimited Patient EMR Records</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>WhatsApp Broadcast & Delay Alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Emergency Queue Priority System</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Doctor Consultation History Tracker</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenAuth('clinic')}
              className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition"
            >
              Choose Clinic Pro
            </button>
          </div>

          {/* Plan 4: Healthcare Suite (Clinic + Pharmacy Combo) */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900 text-white p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Healthcare Suite</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">Hospital OPD + In-House Pharmacy Store.</p>
              
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-white">
                  ₹{isAnnual ? '6,499' : '7,999'}
                </span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Full Clinic HIS + In-house Pharmacy Store</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Automated Prescription Dispense Bridge</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Unlimited Staff, Doctors & Cashiers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Full Audit Logs & Compliance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Priority Indian WhatsApp & Phone Support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenAuth('clinic')}
              className="mt-8 w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition"
            >
              Deploy Full Suite
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
