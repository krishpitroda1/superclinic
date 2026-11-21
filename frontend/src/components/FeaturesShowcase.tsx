'use client';

import React, { useState } from 'react';
import { 
  Stethoscope, 
  Pill, 
  QrCode, 
  Clock, 
  FileText, 
  Receipt, 
  MessageSquare, 
  BarChart3, 
  ShieldCheck, 
  Boxes, 
  Calendar, 
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function FeaturesShowcase() {
  const [activeTab, setActiveTab] = useState<'clinic' | 'pharmacy' | 'bridge'>('clinic');

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs uppercase tracking-widest font-bold text-teal-600 mb-2">
            Engineered For Modern Healthcare
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Two Specialized Products. One Connected Ecosystem.
          </p>
          <p className="mt-3 text-slate-600 text-base">
            Choose what fits your practice today. Run as a standalone Clinic HIS, a standalone Pharmacy POS, or combine them for automated fulfillment.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setActiveTab('clinic')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'clinic'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>1. Clinic HIS Modules</span>
            </button>
            <button
              onClick={() => setActiveTab('pharmacy')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'pharmacy'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>2. Standalone Pharmacy POS</span>
            </button>
            <button
              onClick={() => setActiveTab('bridge')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'bridge'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4 text-teal-400" />
              <span>3. The Secure QR Bridge</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'clinic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Queue & Emergency Flags</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automated daily token numbers. One-click emergency tag bumps critical patients directly to Token #1 priority with audible alerts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Comprehensive Patient EMR</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Full CRUD for vitals (BP, BMI, SpO2, Pulse), chronic disease records, longitudinal visit history, and allergy warnings.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Digital Prescriptions with ICD-10</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Fast diagnosis lookup with standardized ICD-10 code validator. Pre-formatted dosage schedules, advice, and printable PDF prescription.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fee Collection & Invoicing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Record consultation charges and diagnostics. Accept UPI, Cash, or Cards. Generate clinic-branded invoices with tax and discounts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">WhatsApp Bulk Broadcasts</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Doctor running behind schedule? Send automated WhatsApp delay broadcasts to waiting patients in one click. Webhook delivery tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Clinic Financial Reports</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real-time aggregations for daily revenue, payment method breakdowns (Cash vs. UPI vs. Card), and doctor patient visit metrics.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'pharmacy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 bg-emerald-50/30 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Rapid POS Counter</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Designed for high footfall pharmacy counters. Instant search by brand or generic salt, barcode scanner integration, and fast checkout.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-emerald-50/30 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Real-Time Stock & Batch Control</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track exact stock quantities by batch number. PostgreSQL atomic triggers decrement inventory upon every sale, preventing overselling.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-emerald-50/30 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Expiry Date Dashboard</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Color-coded alerts for batches nearing expiry within 30, 60, or 90 days. Block expired medicines from checkout automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-emerald-50/30 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Turnover & Margin Analytics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Daily and monthly gross merchandise value (GMV), net margins, top moving medications, and supplier purchase records.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-emerald-50/30 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hardware Printer Support</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Print formatted thermal receipts (2-inch or 3-inch roll) or A4 invoices. Full GST, tax breakdowns, and payment reference logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-emerald-50/30 hover:bg-white hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Low Stock Reorder Alerts</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Customizable reorder threshold triggers. When stock dips below minimum levels, visual alerts flag items for procurement.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'bridge' && (
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
            <div className="max-w-3xl">
              <span className="text-xs font-mono text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
                PATENT-GRADE MULTI-TENANT ARCHITECTURE
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-4 mb-4 tracking-tight">
                Zero Cross-Tenant DB Coupling: The Shared Dispense Token
              </h3>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                Most platforms fail by either putting clinics and pharmacies in one database with leaky permissions, or isolating them so heavily they cannot communicate. SuperClinic solves this with an isolated cryptographic dispense token.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-teal-600/30 text-teal-400 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Clinic Generates De-Identified Snapshot</h5>
                    <p className="text-xs text-slate-400 mt-1">Doctor issues prescription. Trigger creates a dispense token containing prescribed items and masked patient name (e.g. &quot;S*** J***&quot;).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Patient Carries QR / UUID Token</h5>
                    <p className="text-xs text-slate-400 mt-1">Patient receives QR token link via WhatsApp or printed prescription slip. Can walk into ANY participating pharmacy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Pharmacy Fulfills Without EMR Access</h5>
                    <p className="text-xs text-slate-400 mt-1">Pharmacist scans token. Items load into POS. When checkout completes, token status becomes &apos;dispensed&apos; without ever exposing patient medical history.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

