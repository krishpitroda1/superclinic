'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'clinic',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-5">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              Schedule a Custom Demo or Request Hardware Integration
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              Whether you are an independent pharmacy store owner needing barcode scanner setup, or a polyclinic looking for WhatsApp bulk broadcast automation, our solution specialists are ready to assist.
            </p>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email Support</p>
                  <p className="font-semibold text-slate-900">contact@superclinic.app</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">WhatsApp / Sales Hotline</p>
                  <p className="font-semibold text-slate-900">+1 (800) 555-CLINIC</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Global Head Office</p>
                  <p className="font-semibold text-slate-900">San Francisco, CA & Mumbai, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Thank you for reaching out!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Our solution engineering team has received your demo request and will reach out within 2 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. John Doe / Alex Chemist"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@cityclinic.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (with WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Business Type</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600 bg-white"
                    >
                      <option value="clinic">Clinic / Hospital OPD Only</option>
                      <option value="pharmacy">Standalone Pharmacy / Retail Chemist</option>
                      <option value="both">Both (Hospital + In-House Pharmacy)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">How can we help you?</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your clinic specialty, daily patient footfall, or pharmacy billing counter requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Product Demo</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

