'use client';

import React from 'react';
import { ShieldCheck, Database, Lock, Server, Cpu } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              Built on Modern Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-6">
              Empowering Healthcare Providers with Enterprise Grade Security
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              SuperClinic was built to bridge the gap between private clinic OPD consultations and neighborhood retail pharmacies. By combining PostgreSQL Row-Level Security with modern decoupled services, we provide healthcare organizations with the highest tier of confidentiality and performance.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-sm mb-1">
                  <Database className="w-4 h-4" />
                  <span>PostgreSQL RLS</span>
                </div>
                <p className="text-xs text-slate-500">Kernel-level multi-tenant isolation on Supabase.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
                  <Lock className="w-4 h-4" />
                  <span>HIPAA & GDPR Ready</span>
                </div>
                <p className="text-xs text-slate-500">Immutable audit logs on all EMR access & changes.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-1">
                  <Server className="w-4 h-4" />
                  <span>99.99% Uptime</span>
                </div>
                <p className="text-xs text-slate-500">Serverless architecture with high availability.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>Sub-Second POS</span>
                </div>
                <p className="text-xs text-slate-500">Optimized for high-speed counter checkout.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-8 text-white border border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span>Multi-Tenancy Guardrail Guarantees</span>
            </h3>
            
            <div className="space-y-4 text-xs font-mono">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <span className="text-teal-400 font-bold">1. Zero Cross-Product Access:</span>
                <p className="text-slate-300 mt-1 font-sans">
                  A pharmacy store user can NEVER query patient medical histories or EMRs. Queries are blocked at the database engine level via <code className="text-teal-300 bg-slate-950 px-1 py-0.5 rounded">current_tenant_type() = &apos;clinic&apos;</code> check.
                </p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <span className="text-emerald-400 font-bold">2. Tamper-Resistant Auditing:</span>
                <p className="text-slate-300 mt-1 font-sans">
                  EMR mutations are committed through automated PostgreSQL row triggers. No user or application layer can bypass the creation of an audit trail.
                </p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <span className="text-blue-400 font-bold">3. Atomic Stock Decrement:</span>
                <p className="text-slate-300 mt-1 font-sans">
                  Pharmacy sales trigger instantaneous inventory deductions with negative-stock prevention exceptions.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

