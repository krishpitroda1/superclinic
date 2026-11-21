'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can I purchase and use the Pharmacy POS without buying the Clinic software?',
      a: 'Yes, 100%! We sell the Standalone Pharmacy POS directly to retail chemist and pharmacy store owners for $49/month. You can manage inventory, batch numbers, expiry warnings, walk-in cash/UPI sales, and monthly turnover charts completely independently with zero clinic dependency.'
    },
    {
      q: 'How does the prescription fulfillment bridge work between clinics and pharmacies?',
      a: 'When a doctor issues a digital prescription in the Clinic HIS, the system automatically creates a de-identified dispense token with a unique UUID/QR code. The patient presents this token at any pharmacy running our POS. The pharmacist scans the code, loads the prescribed medications into their POS cart, and completes the sale without ever gaining direct database access to the clinic’s private patient records.'
    },
    {
      q: 'How is tenant data isolated and secured in Supabase?',
      a: 'We use PostgreSQL Row-Level Security (RLS) policies at the database engine level. Every query is filtered by the authenticated user’s tenant ID and tenant type. Clinic staff can never query pharmacy tables, and pharmacy staff can never access clinic EMR records, even if an API route was compromised.'
    },
    {
      q: 'Does the Pharmacy POS support barcode scanners and thermal printers?',
      a: 'Yes. The POS billing interface supports standard USB/Bluetooth barcode scanners (HID mode). Invoices can be printed on standard 2-inch or 3-inch thermal roll printers (ESC/POS compatible) as well as full A4 page printers.'
    },
    {
      q: 'How does the WhatsApp Broadcast integration handle doctor delays?',
      a: 'The Clinic HIS has a built-in delay alert dispatcher connected to the Meta WhatsApp Cloud API. If a doctor is delayed by emergency consultations, the receptionist can trigger a delay broadcast to all scheduled patients for that time slot in one click.'
    },
    {
      q: 'Are patient medical records compliant with HIPAA / GDPR audit guidelines?',
      a: 'Yes. Our database schema includes automated PostgreSQL trigger-based audit logs for every creation, modification, or deletion of patient EMR profiles and prescriptions. In addition, our API layer logs all read and PDF export operations with IP addresses and user timestamps.'
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
            Everything you need to know about our Clinic HIS, Standalone Pharmacy POS, and security.
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

