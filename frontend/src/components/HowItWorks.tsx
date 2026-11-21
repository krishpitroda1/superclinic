'use client';

import React from 'react';
import { UserCheck, Stethoscope, QrCode, ShoppingCart } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: UserCheck,
      title: 'Check-in & Smart Token',
      desc: 'Receptionist books walk-in or scheduled patient. Instant queue token generated with emergency elevation flag.',
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      step: '02',
      icon: Stethoscope,
      title: 'Doctor EMR & Digital Rx',
      desc: 'Doctor records vitals, searches ICD-10 diagnosis, prescribes medicines, and clicks "Issue Prescription".',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      step: '03',
      icon: QrCode,
      title: 'Dispense Token & WhatsApp',
      desc: 'System generates an isolated UUID token and sends the patient a WhatsApp notification with printable Rx link.',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      step: '04',
      icon: ShoppingCart,
      title: 'Pharmacy Scan & Dispense',
      desc: 'Pharmacist scans the QR code. Items auto-populate in POS cart, stock is atomically deducted, and bill printed.',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-bold text-teal-600 mb-2">
            Seamless End-to-End Workflow
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How The Ecosystem Works In Real Life
          </p>
          <p className="mt-3 text-slate-600 text-base">
            From patient arrival at the front desk to prescription dispense at the pharmacy counter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 group-hover:text-teal-600 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

