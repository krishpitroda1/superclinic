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
  const [defaultType, setDefaultType] = useState<'clinic' | 'pharmacy'>('clinic');

  const handleOpenAuth = (type?: 'clinic' | 'pharmacy') => {
    if (type) setDefaultType(type);
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
        <PharmacyStoreOwnerSection onOpenAuth={(type) => handleOpenAuth(type || 'pharmacy')} />

        {/* Complete Features Showcase (Clinic HIS vs Pharmacy POS vs Bridge) */}
        <FeaturesShowcase />

        {/* 4-Step End-to-End Workflow */}
        <HowItWorks />

        {/* Transparent Pricing in ₹ INR (Including Direct Pharmacy POS Purchase) */}
        <PricingSection onOpenAuth={(type) => handleOpenAuth(type || 'clinic')} />

        {/* Interactive FAQ Accordion */}
        <FAQSection />

        {/* About Architecture & HIPAA Compliance */}
        <AboutSection />

        {/* Contact & Custom Demo Request Form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Multi-Tenant Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultType={defaultType}
      />
    </div>
  );
}
