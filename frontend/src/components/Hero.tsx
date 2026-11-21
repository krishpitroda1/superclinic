'use client';

import React, { useState } from 'react';
import { 
  Stethoscope, 
  Pill, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Zap, 
  QrCode, 
  AlertTriangle 
} from 'lucide-react';

interface HeroProps {
  onOpenAuth: (defaultType?: 'clinic' | 'pharmacy') => void;
}

export default function Hero({ onOpenAuth }: HeroProps) {
  const [activePreview, setActivePreview] = useState<'clinic' | 'pharmacy'>('clinic');

  return (
    <section className="relative pt-12 pb-24 overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-slate-50">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-teal-200/30 via-emerald-200/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-teal-200 shadow-sm text-xs font-semibold text-teal-800">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Next-Gen Multi-Hospital & Pharmacy Store SaaS Platform</span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Run Your Clinic with <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Precision</span>.
            <br />
            Power Your Pharmacy Store with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">Speed</span>.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The unified SaaS engineered for OPD Hospitals, Polyclinics, and Independent Retail Chemist Stores. Buy individually as a standalone software or deploy together with instant digital prescription QR fulfillment.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('clinic')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition shadow-lg shadow-teal-600/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Launch Hospital / Clinic HIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('pharmacy')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Pill className="w-4 h-4" />
              <span>Launch Pharmacy Store POS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Security & Isolation Callouts */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Supabase Multi-Tenant RLS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Zero Cross-DB Patient Leakage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Sub-Second Barcode Counter Checkout</span>
            </div>
          </div>
        </div>

        {/* Interactive Live Preview Switcher Component */}
        <div className="mt-8 max-w-5xl mx-auto">
          {/* Switch Toggle */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 backdrop-blur border border-slate-300 shadow-inner">
              <button
                onClick={() => setActivePreview('clinic')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activePreview === 'clinic'
                    ? 'bg-white text-teal-700 shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span>Clinic HIS: Live Queue & EMR</span>
              </button>
              <button
                onClick={() => setActivePreview('pharmacy')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activePreview === 'pharmacy'
                    ? 'bg-white text-emerald-700 shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>Pharmacy Store: Stock, Expiry & Billing</span>
              </button>
            </div>
          </div>

          {/* Preview Window Shell */}
          <div className="rounded-2xl border border-slate-300/80 bg-white shadow-2xl shadow-slate-300/60 overflow-hidden">
            {/* Window header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs font-mono text-slate-400">
                  {activePreview === 'clinic' 
                    ? 'https://superclinic.app/clinic?tenant=apollo-hospital' 
                    : 'https://superclinic.app/pharmacy?tenant=apex-care-pharmacy'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-teal-400 font-mono">
                  Tenant-Type: {activePreview.toUpperCase()}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800">
                  CURRENCY: ₹ INR
                </span>
              </div>
            </div>

            {/* Simulated Live Viewport */}
            <div className="p-6 bg-slate-50/60 min-h-[380px]">
              {activePreview === 'clinic' ? (
                /* Clinic HIS Preview */
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <span>Apollo Multi-Speciality Clinic</span>
                        <span className="text-xs font-normal text-slate-500">• Reception Lobby Queue</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">3 Patients in Queue • Dr. Sharma Consulting</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-amber-600" />
                        Avg Wait: 10 min
                      </span>
                      <button 
                        onClick={() => onOpenAuth('clinic')}
                        className="px-3.5 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition"
                      >
                        Open Doctor Cabin
                      </button>
                    </div>
                  </div>

                  {/* Queue Items */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-rose-50/60 border-2 border-rose-300 p-4 rounded-xl relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          EMERGENCY BUMP
                        </span>
                        <span className="text-lg font-black text-rose-900">#01</span>
                      </div>
                      <h5 className="font-bold text-slate-900 mt-2 text-sm">Priya Sharma (34y/F)</h5>
                      <p className="text-xs text-slate-600">Acute chest tightness • BP: 145/95</p>
                      <div className="mt-3 text-[11px] text-rose-800 font-medium">Elevated to Token #1 Priority</div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                          IN CABIN CONSULT
                        </span>
                        <span className="text-lg font-black text-teal-700">#02</span>
                      </div>
                      <h5 className="font-bold text-slate-900 mt-2 text-sm">Rajesh Kumar (52y/M)</h5>
                      <p className="text-xs text-slate-600">Type 2 Diabetes Review • HBA1c Check</p>
                      <div className="mt-3 text-[11px] text-teal-700 font-medium">Fee: ₹500 (Cabin or Desk Collect)</div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          LOBBY WAITING
                        </span>
                        <span className="text-lg font-black text-slate-700">#03</span>
                      </div>
                      <h5 className="font-bold text-slate-900 mt-2 text-sm">Amit Verma (29y/M)</h5>
                      <p className="text-xs text-slate-600">Seasonal viral flu & cough</p>
                      <div className="mt-3 text-[11px] text-slate-500">Checked in at 10:15 AM</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pharmacy Store Preview */
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <span>Apex Care Pharmacy Store</span>
                        <span className="text-xs font-normal text-slate-500">• Retail POS Counter #1</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">Top 30 Indian Medicines in Stock (100 Units each)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                        All Indian Brands Stocked
                      </span>
                      <button 
                        onClick={() => onOpenAuth('pharmacy')}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                      >
                        Open Billing Counter
                      </button>
                    </div>
                  </div>

                  {/* Inventory & POS Rows */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white border border-slate-200 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          IN STOCK: 100 Units
                        </span>
                        <span className="text-xs font-mono text-slate-400">DOLO-650</span>
                      </div>
                      <h5 className="font-bold text-slate-900 mt-2 text-sm">Dolo 650 (Paracetamol)</h5>
                      <p className="text-xs text-slate-500">Batch: BAT-2026-D1 • MRP: ₹35</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-emerald-600 text-sm">₹30</span>
                        <span className="text-[10px] text-slate-400 font-mono">Cost: ₹18</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          IN STOCK: 100 Units
                        </span>
                        <span className="text-xs font-mono text-slate-400">AUG-625</span>
                      </div>
                      <h5 className="font-bold text-slate-900 mt-2 text-sm">Augmentin 625 Duo</h5>
                      <p className="text-xs text-slate-500">Amoxyclav 625mg • MRP: ₹220</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-emerald-600 text-sm">₹195</span>
                        <span className="text-[10px] text-slate-400 font-mono">Cost: ₹140</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-tr from-teal-50 to-emerald-50 border border-teal-200 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-800 bg-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <QrCode className="w-3 h-3 text-teal-600" />
                          RX QR FULFILLMENT
                        </span>
                        <span className="text-xs font-mono text-teal-600">READY</span>
                      </div>
                      <h5 className="font-bold text-slate-900 mt-2 text-sm">Scan Clinic QR Code</h5>
                      <p className="text-xs text-slate-600">Auto-loads doctor prescription items into POS cart.</p>
                      <div className="mt-3 text-[11px] text-teal-800 font-semibold">Instant billing in ₹ INR</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
