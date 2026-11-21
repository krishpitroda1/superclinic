'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can I purchase and use the Pharmacy Store software without buying the Clinic software?',
      a: 'Yes, 100%! We sell the Standalone Pharmacy Store POS directly to retail chemist and pharmacy shop owners for ₹2,499/month. You can manage stock of all 30+ Indian essential medicines (Dolo, Augmentin, Pan-40, etc.), batch numbers, expiry warnings, walk-in cash/UPI sales in ₹ INR, and monthly turnover charts completely independently with zero clinic dependency.'
    },
    {
      q: 'How does the prescription fulfillment bridge work between clinics and pharmacies?',
      a: 'When a doctor issues a digital prescription in the Clinic HIS, the system automatically creates a de-identified dispense token with a unique UUID/QR code. The patient presents this token at any pharmacy running our software. The pharmacist scans the code, loads the prescribed medications into their POS cart, and completes the sale without ever gaining direct database access to the clinic’s private patient records.'
    },
    {
      q: 'How is tenant data isolated and secured in Supabase for multiple hospitals?',
      a: 'We use PostgreSQL Row-Level Security (RLS) policies at the database engine level. Every query is filtered by the authenticated user’s tenant ID and tenant type. Clinic staff can never query pharmacy tables, and pharmacy staff can never access clinic EMR records, even if an API route was compromised.'
    },
    {
      q: 'Does the Pharmacy Store POS support barcode scanners and thermal receipt printers?',
      a: 'Yes. The POS billing interface supports standard USB/Bluetooth barcode scanners (HID mode). Invoices can be printed on standard 2-inch or 3-inch thermal roll printers (ESC/POS compatible) as well as full A4 page printers with GST calculation.'
    },
    {
      q: 'Can doctors collect consultation fees in their cabin or send patients to the reception desk?',
      a: 'Yes! Upon completing any consultation, the doctor can choose either: (1) Collect consultation fee directly in the doctor cabin via Cash/UPI, or (2) Route the patient to the Reception/Admin desk for payment collection. The reception desk receives an instant alert with the patient name and fee due.'
    },
    {
      q: 'What happens to patients after doctor consultation is completed?',
      a: 'As soon as the doctor marks a consultation completed, the patient is automatically removed from the active Reception Lobby queue and moved to the Consultation History ledger with full diagnostic notes, prescribed medicines, and billing status.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Everything you need to know about our Multi-Hospital HIS, Standalone Pharmacy Store, and Indian healthcare workflows.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-teal-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
