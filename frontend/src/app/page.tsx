'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PharmacyStoreOwnerSection from '@/components/PharmacyStoreOwnerSection';
import FeaturesShowcase from '@/components/FeaturesShowcase';
import HowItWorks from '@/components/HowItWorks';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [defaultRole, setDefaultRole] = useState<'doctor' | 'pharmacist' | 'receptionist'>('doctor');

  const handleOpenAuth = (role?: 'doctor' | 'pharmacist' | 'receptionist') => {
    if (role) setDefaultRole(role);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero with interactive preview toggle */}
        <Hero onOpenAuth={handleOpenAuth} />

        {/* Dedicated Standalone Pharmacy Store Owner Section */}
        <PharmacyStoreOwnerSection onOpenAuth={(role) => handleOpenAuth(role || 'pharmacist')} />

        {/* Complete Features Showcase (Clinic HIS vs Pharmacy POS vs Bridge) */}
        <FeaturesShowcase />

        {/* 4-Step End-to-End Workflow */}
        <HowItWorks />

        {/* Transparent Pricing (Including Direct Pharmacy POS Purchase) */}
        <PricingSection onOpenAuth={(role) => handleOpenAuth(role || 'doctor')} />

        {/* Interactive FAQ Accordion */}
        <FAQSection />

        {/* About Architecture & HIPAA Compliance */}
        <AboutSection />

        {/* Contact & Custom Demo Request Form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Role-Based Authentication & 1-Click Demo Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={defaultRole}
      />
    </div>
  );
}
