'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Stethoscope, Pill, ArrowRight, Menu, X, Building2 } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (defaultType?: 'clinic' | 'pharmacy') => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-slate-900">SuperClinic</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                | Pharmacy Store
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Unified Clinic HIS & Pharmacy Store Management</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
          <a href="#pharmacy-standalone" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
            <Pill className="w-3.5 h-3.5 text-emerald-500" />
            Pharmacy Store POS
          </a>
          <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-teal-600 transition-colors">Pricing (₹ INR)</a>
          <a href="#faq" className="hover:text-teal-600 transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-teal-600 transition-colors">Contact</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('clinic')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-teal-200 text-teal-800 text-xs font-bold bg-teal-50 hover:bg-teal-100 transition"
          >
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>Hospital / Clinic Portal</span>
          </button>

          <button
            onClick={() => onOpenAuth('pharmacy')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 transition"
          >
            <Pill className="w-4 h-4 text-emerald-600" />
            <span>Pharmacy Store Portal</span>
          </button>

          <button
            onClick={() => onOpenAuth()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition shadow-sm hover:shadow"
          >
            <Building2 className="w-4 h-4 text-teal-400" />
            <span>Select Tenant / Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={() => onOpenAuth()}
            className="text-xs bg-slate-900 text-white font-medium px-3 py-1.5 rounded-lg"
          >
            Sign In
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <a 
            href="#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            Features
          </a>
          <a 
            href="#pharmacy-standalone" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-emerald-600"
          >
            💊 Pharmacy Store POS
          </a>
          <a 
            href="#how-it-works" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            How It Works
          </a>
          <a 
            href="#pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            Pricing (₹ INR)
          </a>
          <a 
            href="#faq" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            FAQ
          </a>
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            Contact
          </a>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth('clinic'); }}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 text-sm font-medium text-center"
            >
              Hospital & Clinic Portal
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth('pharmacy'); }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium text-center"
            >
              Pharmacy Store Portal
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-sm font-medium text-center"
            >
              Select Hospital / Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
