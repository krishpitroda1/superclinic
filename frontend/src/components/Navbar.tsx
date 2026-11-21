'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Stethoscope, Pill, ArrowRight, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (defaultRole?: 'doctor' | 'pharmacist' | 'receptionist') => void;
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
                + RxPOS
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Unified Clinic HIS & Pharmacy POS</p>
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
          <a href="#pricing" className="hover:text-teal-600 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-teal-600 transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-teal-600 transition-colors">Contact</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Demo Launch Dropdown */}
          <div className="relative group">
            <button 
              onClick={() => onOpenAuth('doctor')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              1-Click Demo Login
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-2 hidden group-hover:block transition-all z-50">
              <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">Test Personas</p>
              <button 
                onClick={() => onOpenAuth('doctor')}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-teal-50 flex items-center justify-between text-slate-800 font-medium"
              >
                <span>👨‍⚕️ Dr. Smith (Clinic HIS)</span>
                <span className="text-[10px] text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded">Doctor</span>
              </button>
              <button 
                onClick={() => onOpenAuth('pharmacist')}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-emerald-50 flex items-center justify-between text-slate-800 font-medium"
              >
                <span>💊 Alex (Pharmacy POS)</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Pharmacist</span>
              </button>
              <button 
                onClick={() => onOpenAuth('receptionist')}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-800 font-medium"
              >
                <span>📋 Emily (Reception Desk)</span>
                <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Front Desk</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => onOpenAuth()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition shadow-sm hover:shadow"
          >
            <span>Sign In to Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={() => onOpenAuth('doctor')}
            className="text-xs bg-teal-600 text-white font-medium px-3 py-1.5 rounded-lg"
          >
            Demo
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
            Pricing
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
              onClick={() => { setMobileMenuOpen(false); onOpenAuth('doctor'); }}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 text-sm font-medium text-center"
            >
              Demo: Clinic Portal (Dr. Smith)
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth('pharmacist'); }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium text-center"
            >
              Demo: Pharmacy POS (Alex)
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-sm font-medium text-center"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

