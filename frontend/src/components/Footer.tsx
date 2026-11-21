'use client';

import React from 'react';
import { Stethoscope, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">SuperClinic + RxPOS</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm mb-4">
              Unified multi-tenant cloud software for modern healthcare. Deploy independently as a Clinic HIS, standalone Pharmacy POS, or together with automated prescription QR dispensing.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Protected with Supabase PostgreSQL Row-Level Security</span>
            </div>
          </div>

          {/* Column 1: Clinic HIS */}
          <div>
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-4">Clinic HIS</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-white transition">Smart Queue & Tokens</a></li>
              <li><a href="#features" className="hover:text-white transition">EMR Patient History</a></li>
              <li><a href="#features" className="hover:text-white transition">ICD-10 Prescriptions</a></li>
              <li><a href="#features" className="hover:text-white transition">Fee Collection & Invoices</a></li>
              <li><a href="#features" className="hover:text-white transition">WhatsApp Delays Broadcast</a></li>
            </ul>
          </div>

          {/* Column 2: Pharmacy POS */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">Pharmacy POS</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#pharmacy-standalone" className="hover:text-white transition">Standalone POS Software</a></li>
              <li><a href="#pharmacy-standalone" className="hover:text-white transition">Batch & Expiry Tracker</a></li>
              <li><a href="#pharmacy-standalone" className="hover:text-white transition">Walk-in Billing Counter</a></li>
              <li><a href="#pharmacy-standalone" className="hover:text-white transition">Monthly Turnover Charts</a></li>
              <li><a href="#features" className="hover:text-white transition">Prescription QR Bridge</a></li>
            </ul>
          </div>

          {/* Column 3: Platform & Legal */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Security & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#about" className="hover:text-white transition">HIPAA / GDPR Ready</a></li>
              <li><a href="#about" className="hover:text-white transition">Immutable Audit Logs</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Subscription Tiers</a></li>
              <li><a href="#faq" className="hover:text-white transition">FAQ Documentation</a></li>
              <li><a href="#contact" className="hover:text-white transition">Enterprise SLA</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} SuperClinic & RxPOS Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for doctors, pharmacists & patients worldwide.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

