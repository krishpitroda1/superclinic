'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Stethoscope, 
  Users, 
  Clock, 
  FileText, 
  Receipt, 
  MessageSquare, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Search, 
  Printer, 
  ArrowLeft, 
  LogOut, 
  QrCode, 
  Send,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Patient } from '@/types';

export default function ClinicDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'queue' | 'emr' | 'prescribe' | 'billing' | 'broadcast' | 'reports'>('queue');
  
  // State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Queue state
  const [queue, setQueue] = useState<any[]>([
    { id: '1', token: 1, name: 'Sarah Jenkins', age: 36, gender: 'F', reason: 'Severe Chest Discomfort', is_emergency: true, status: 'in_consultation' },
    { id: '2', token: 2, name: 'David Miller', age: 51, gender: 'M', reason: 'Type 2 Diabetes Follow-up', is_emergency: false, status: 'waiting' },
    { id: '3', token: 3, name: 'Emily Chen', age: 28, gender: 'F', reason: 'Seasonal Flu & Fever', is_emergency: false, status: 'waiting' }
  ]);

  // Prescription Form State
  const [rxDiagnosis, setRxDiagnosis] = useState('');
  const [rxIcd10, setRxIcd10] = useState('J06.9');
  const [rxAdvice, setRxAdvice] = useState('Hydration, bed rest for 3 days, avoid cold liquids.');
  const [rxMeds, setRxMeds] = useState([
    { name: 'Amoxicillin 500mg', dosage: '500mg', frequency: '1-0-1', duration: '5 days', instructions: 'After meals' },
    { name: 'Paracetamol 650mg', dosage: '650mg', frequency: '1-1-1', duration: '3 days', instructions: 'SOS for fever' }
  ]);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // WhatsApp Broadcast state
  const [broadcastMsg, setBroadcastMsg] = useState('Dr. Smith is attending to an emergency case. Appointments are running ~30 minutes delayed. Thank you for your patience.');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Invoicing state
  const [invAmount, setInvAmount] = useState('50.00');
  const [invPaymentMethod, setInvPaymentMethod] = useState('upi');
  const [invGenerated, setInvGenerated] = useState(false);

  // Load Seed Patients from Supabase
  useEffect(() => {
    async function loadPatients() {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('tenant_id', '11111111-1111-1111-1111-111111111111');

        if (!error && data && data.length > 0) {
          setPatients(data);
          setSelectedPatient(data[0]);
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    }
    loadPatients();
  }, []);

  // Emergency Queue Bump handler
  const handleEmergencyBump = (idx: number) => {
    const updated = [...queue];
    const target = updated.splice(idx, 1)[0];
    target.is_emergency = true;
    target.token = 1;
    // shift other tokens
    updated.forEach((item, i) => item.token = i + 2);
    setQueue([target, ...updated]);
  };

  // Add Walk-in to Queue
  const handleAddWalkIn = () => {
    const nextToken = queue.length + 1;
    const newEntry = {
      id: Date.now().toString(),
      token: nextToken,
      name: `Walk-in Patient #${nextToken}`,
      age: 32,
      gender: 'M',
      reason: 'General Consultation',
      is_emergency: false,
      status: 'waiting'
    };
    setQueue([...queue, newEntry]);
  };

  // Generate Prescription & Dispense Token
  const handleIssuePrescription = () => {
    const fakeTokenId = 'd8f4b620-89ab-4c3e-90f2-e' + Math.floor(10000000000 + Math.random() * 90000000000);
    setGeneratedToken(fakeTokenId);
    setShowPrintModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* Top Application Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-white">City Health Clinic</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-900 text-teal-300 border border-teal-700 font-mono">
                  CLINIC HIS
                </span>
              </div>
              <p className="text-xs text-slate-400">Dr. Smith, MD (Cardiologist & Physician)</p>
            </div>
          </div>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">OPD Queue: <strong>{queue.length} Active</strong></span>
          </div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 space-y-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('queue')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'queue' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Smart Queue & Tokens</span>
            <span className="ml-auto text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-mono">{queue.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('emr')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'emr' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-teal-600" />
            <span>Patient EMR Records</span>
          </button>

          <button
            onClick={() => setActiveTab('prescribe')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'prescribe' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Digital Prescriptions & ICD-10</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'billing' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Receipt className="w-4 h-4 text-teal-600" />
            <span>Fee Collection & Invoices</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'broadcast' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-teal-600" />
            <span>WhatsApp Delay Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'reports' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <span>Financial & OPD Reports</span>
          </button>
        </aside>

        {/* Center Content Viewport */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* TAB 1: SMART QUEUE */}
          {activeTab === 'queue' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">OPD Daily Queue Manager</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Emergency patient elevation, calling next token, and wait time optimization.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddWalkIn}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Walk-In Patient</span>
                  </button>
                </div>
              </div>

              {/* Queue List Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-600">Active Queue Tokens</span>
                  <span className="text-xs text-slate-500">Auto-sorted: Emergency first</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {queue.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className={`p-4 flex flex-wrap items-center justify-between gap-4 transition ${
                        item.is_emergency ? 'bg-rose-50/80 border-l-4 border-rose-500' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${
                          item.is_emergency ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-100 text-slate-800'
                        }`}>
                          <span className="text-[10px] uppercase font-mono">TOKEN</span>
                          <span className="text-base font-black">#{item.token}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                            <span className="text-xs text-slate-500">({item.age}y / {item.gender})</span>
                            {item.is_emergency && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[10px] font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-700" />
                                EMERGENCY
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">Reason: <strong>{item.reason}</strong></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!item.is_emergency && (
                          <button
                            onClick={() => handleEmergencyBump(idx)}
                            className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition"
                          >
                            Bump to Emergency
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedPatient(patients[0]);
                            setActiveTab('prescribe');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition"
                        >
                          Consult Patient
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PATIENT EMR */}
          {activeTab === 'emr' && (
            <div className="space-y-6 max-w-5xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Patient EMR Directory</h2>
                  <p className="text-xs text-slate-500 mt-1">Live from Supabase `patients` table (Row-Level Security isolated).</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, MRN, phone..."
                    className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 w-64"
                  />
                </div>
              </div>

              {/* Patient Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patients.map((p) => (
                  <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                          {p.mrn}
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900 mt-1">{p.name}</h3>
                        <p className="text-xs text-slate-500">DOB: {p.dob} • {p.gender} • Blood Group: <strong className="text-rose-600">{p.blood_group}</strong></p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPatient(p);
                          setActiveTab('prescribe');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs hover:bg-teal-100 transition"
                      >
                        Start Consult
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">Height / Weight:</span>
                        <p className="font-semibold text-slate-800">{p.height_cm} cm / {p.weight_kg} kg</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Phone:</span>
                        <p className="font-semibold text-slate-800">{p.phone}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.chronic_conditions?.map((c, i) => (
                        <span key={i} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                          {c}
                        </span>
                      ))}
                      {p.allergies?.map((a, i) => (
                        <span key={i} className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                          ⚠️ Allergy: {a}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DIGITAL PRESCRIPTIONS WITH ICD-10 */}
          {activeTab === 'prescribe' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Doctor Consultation & Prescription Writer</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    ICD-10 Code Validation + Auto-generation of Secure Dispense Token.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-teal-700">Patient: {selectedPatient?.name || 'Sarah Jenkins'}</span>
                  <p className="text-[11px] text-slate-500">{selectedPatient?.mrn || 'MRN-1001'} • Blood: {selectedPatient?.blood_group || 'O+'}</p>
                </div>
              </div>

              {/* Clinical Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Diagnosis</label>
                    <input
                      type="text"
                      value={rxDiagnosis}
                      onChange={(e) => setRxDiagnosis(e.target.value)}
                      placeholder="e.g. Acute upper respiratory infection"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ICD-10 Code (Validated)
                    </label>
                    <select
                      value={rxIcd10}
                      onChange={(e) => setRxIcd10(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-white"
                    >
                      <option value="J06.9">J06.9 - Acute upper respiratory infection, unspecified</option>
                      <option value="E11.9">E11.9 - Type 2 diabetes mellitus without complications</option>
                      <option value="I10">I10 - Essential (primary) hypertension</option>
                      <option value="K29.7">K29.7 - Gastritis, unspecified</option>
                    </select>
                  </div>
                </div>

                {/* Medications Table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700">Prescribed Medications</label>
                    <button
                      type="button"
                      onClick={() => setRxMeds([...rxMeds, { name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'After meals' }])}
                      className="text-xs text-teal-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Medicine
                    </button>
                  </div>

                  <div className="space-y-2">
                    {rxMeds.map((med, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => {
                            const updated = [...rxMeds];
                            updated[idx].name = e.target.value;
                            setRxMeds(updated);
                          }}
                          placeholder="Medicine name"
                          className="sm:col-span-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => {
                            const updated = [...rxMeds];
                            updated[idx].frequency = e.target.value;
                            setRxMeds(updated);
                          }}
                          placeholder="Frequency (1-0-1)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => {
                            const updated = [...rxMeds];
                            updated[idx].duration = e.target.value;
                            setRxMeds(updated);
                          }}
                          placeholder="Duration (5 days)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          value={med.instructions}
                          onChange={(e) => {
                            const updated = [...rxMeds];
                            updated[idx].instructions = e.target.value;
                            setRxMeds(updated);
                          }}
                          placeholder="Instructions"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advice */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Advice / Lifestyle Notes</label>
                  <textarea
                    rows={2}
                    value={rxAdvice}
                    onChange={(e) => setRxAdvice(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
                  />
                </div>

                {/* Action CTA */}
                <button
                  type="button"
                  onClick={handleIssuePrescription}
                  className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Issue Digital Prescription & Generate QR Token</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: BILLING & INVOICES */}
          {activeTab === 'billing' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Clinic Fee Collection</h2>
                  <p className="text-xs text-slate-500 mt-1">Consultation fee, diagnostic tests & branded invoices.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee ($)</label>
                    <input
                      type="number"
                      value={invAmount}
                      onChange={(e) => setInvAmount(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                    <select
                      value={invPaymentMethod}
                      onChange={(e) => setInvPaymentMethod(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-teal-600 bg-white"
                    >
                      <option value="upi">UPI / QR Payment</option>
                      <option value="cash">Cash Payment</option>
                      <option value="card">Credit / Debit Card</option>
                      <option value="insurance">Insurance Claim</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInvGenerated(true)}
                  className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition"
                >
                  Record Fee & Print Branded Invoice
                </button>

                {invGenerated && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold">✅ Invoice #INV-89104 Paid ($50.00 via {invPaymentMethod.toUpperCase()})</p>
                      <p className="text-[11px] text-emerald-700">Receipt logged to Supabase `clinic_invoices` table.</p>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print Bill
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: WHATSAPP BROADCAST */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">WhatsApp Broadcast & Delay Alerts</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Send bulk notifications to all waiting or scheduled patients when emergencies cause OPD delays.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delay Announcement Message</label>
                  <textarea
                    rows={3}
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Recipients: <strong>3 Patients currently in OPD Queue</strong></span>
                  <button
                    onClick={() => setBroadcastSent(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send WhatsApp Broadcast</span>
                  </button>
                </div>

                {broadcastSent && (
                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span>Broadcast dispatched to Meta WhatsApp Cloud API queue. 3/3 messages delivered.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6 max-w-5xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">Clinic Financial & OPD Performance</h2>
                <p className="text-xs text-slate-500 mt-1">Daily revenue aggregations and doctor consultation metrics.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Today&apos;s Revenue</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">$450.00</h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ +14% vs yesterday</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">OPD Footfall</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">9 Patients</h3>
                  <p className="text-[11px] text-teal-600 font-bold mt-1">Avg 14 min consult</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Payment Breakdown</span>
                  <div className="text-xs mt-2 space-y-1">
                    <div className="flex justify-between"><span>UPI:</span> <strong>70% ($315)</strong></div>
                    <div className="flex justify-between"><span>Cash:</span> <strong>20% ($90)</strong></div>
                    <div className="flex justify-between"><span>Card:</span> <strong>10% ($45)</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* PRINTABLE PRESCRIPTION MODAL */}
      {showPrintModal && generatedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header with Clinic Branding */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">City Health Clinic</h3>
                <p className="text-xs text-slate-500">123 Healthcare Ave, Medical City • Tel: +1-555-0101</p>
                <p className="text-xs text-teal-700 font-bold mt-0.5">Dr. Smith, MD (Reg # MED-2026-99)</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-teal-700">Rx</span>
                <p className="text-[10px] text-slate-400 font-mono">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Patient Info Bar */}
            <div className="my-4 py-2 px-3 bg-slate-100 rounded-xl text-xs flex justify-between font-medium">
              <span>Patient: <strong>{selectedPatient?.name || 'Sarah Jenkins'}</strong></span>
              <span>Age/Sex: <strong>36 / F</strong></span>
              <span>MRN: <strong>{selectedPatient?.mrn || 'MRN-1001'}</strong></span>
              <span>Diagnosis: <strong>{rxDiagnosis || 'Acute Bronchitis (ICD-10: ' + rxIcd10 + ')'}</strong></span>
            </div>

            {/* Prescribed Items */}
            <div className="my-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Medication Schedule</h4>
              <table className="w-full text-xs text-left">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-2">Medicine</th>
                    <th className="py-2">Frequency</th>
                    <th className="py-2">Duration</th>
                    <th className="py-2">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rxMeds.map((m, i) => (
                    <tr key={i}>
                      <td className="py-2 font-bold text-slate-900">{m.name}</td>
                      <td className="py-2">{m.frequency}</td>
                      <td className="py-2">{m.duration}</td>
                      <td className="py-2 text-slate-500">{m.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Advice */}
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 text-xs text-teal-900 mb-6">
              <strong>Advice:</strong> {rxAdvice}
            </div>

            {/* The Standout QR Bridge Callout */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  SECURE PHARMACY DISPENSE TOKEN
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  Present this QR or Token at any participating pharmacy to dispense medicines.
                </p>
                <p className="text-[11px] font-mono text-slate-400 mt-1 break-all select-all">
                  Token: <strong>{generatedToken}</strong>
                </p>
              </div>
              <div className="w-16 h-16 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center text-slate-950">
                <QrCode className="w-14 h-14" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Prescription</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

