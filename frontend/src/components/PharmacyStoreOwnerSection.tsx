'use client';

import React from 'react';
import { 
  Calendar, 
  Receipt, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Boxes, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface PharmacyStoreOwnerSectionProps {
  onOpenAuth: (type?: 'pharmacy') => void;
}

export default function PharmacyStoreOwnerSection({ onOpenAuth }: PharmacyStoreOwnerSectionProps) {
  return (
    <section id="pharmacy-standalone" className="py-24 bg-gradient-to-b from-white via-emerald-50/20 to-white relative overflow-hidden border-y border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold border border-emerald-200 mb-4">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            <span>STANDALONE COMMERCIAL PHARMACY STORE SOFTWARE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Own an Independent Chemist or Pharmacy Store?
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
              Run Your Entire Retail Business on Pharmacy Store POS
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            You don&apos;t need a hospital or clinic to use our Pharmacy Store software. You can purchase this as a 100% standalone system to manage stock of Indian essential medicines, track batch expiry dates, ring up walk-in customers in seconds with UPI/Cash, and track your total monthly sales turnover and gross margins.
          </p>
        </div>

        {/* 4 Pillars for Pharmacy Store Owners */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1: Inventory & Batches */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Boxes className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Real-Time Indian Drug Stock</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track stock across top 30 Indian branded medicines (Dolo, Augmentin, Pan 40, Azithromycin) with batch numbers and rack positions.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Automatic low-stock reorder warnings</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Barcode & SKU lookup integration</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Expiry Tracker */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Expiry Date Guardian</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Eliminate expired stock losses. Visual alerts notify you 30, 60, and 90 days before medicines expire.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Zero expired medicines sold at POS</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Return-to-distributor batch report</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Rapid Billing Counter */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Sub-Second Walk-in POS</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed for high-speed counter checkout. Scan barcode, adjust strip/tablet count, apply discount, and collect via UPI QR or Cash in ₹ INR.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                <span>Thermal 2&quot; / 3&quot; receipt & A4 bill print</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                <span>Cash drawer & barcode scanner ready</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Monthly Sales & Profit Charts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Monthly Turnover & Margins</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Real-time financial dashboard tracking gross revenue in ₹ INR, cost of goods, net margins, and top-selling therapeutic categories.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
                <span>Daily register closing reconciliation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
                <span>Exportable GST & Tax summary sheets</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Spotlight: Standalone vs Connected Mode */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flexible Dual-Mode Software</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Works 100% Standalone for Your Shop — But Ready for Clinic Prescriptions When You Want It
              </h3>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                You can operate your store independently with zero hospital dependencies. If local clinics also use SuperClinic, patients can walk in with a digital QR prescription code. You simply scan the code to instantly load and dispense the exact prescribed medications without typing!
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Standalone Retail Mode: Walk-in customers</span>
                </div>
                <div className="bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  <span>Bridge Mode: Scan Clinic QR Tokens</span>
                </div>
                <div className="bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Direct Purchase: ₹2,499/month flat</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => onOpenAuth('pharmacy')}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                <span>Launch Pharmacy Store Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#pricing"
                className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs text-center border border-slate-700 transition"
              >
                View Pharmacy Store Pricing (₹2,499/mo)
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
