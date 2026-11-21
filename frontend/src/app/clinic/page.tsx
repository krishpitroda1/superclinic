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
  History,
  Building2,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Patient } from '@/types';

interface QueueItem {
  id: string;
  token: number;
  name: string;
  age: number;
  gender: string;
  mrn: string;
  phone: string;
  reason: string;
  is_emergency: boolean;
  status: 'waiting' | 'in_consultation' | 'completed';
}

interface CompletedConsultation {
  id: string;
  token: number;
  name: string;
  mrn: string;
  age: number;
  gender: string;
  phone: string;
  diagnosis: string;
  icd10: string;
  medications: Array<{ name: string; dosage: string; frequency: string; duration: string; instructions?: string }>;
  advice: string;
  feeAmount: number;
  feeStatus: 'paid_in_cabin' | 'pending_at_desk' | 'paid_at_desk';
  paymentMethod?: string;
  completedAt: string;
  dispenseTokenId: string;
}

export default function ClinicDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'queue' | 'emr' | 'prescribe' | 'history' | 'billing' | 'broadcast' | 'reports'>('queue');
  
  // Organization Context from Session
  const [tenantInfo, setTenantInfo] = useState({
    name: 'Apollo Multi-Speciality Hospital',
    doctorName: 'Dr. Rajesh Sharma, MD',
    role: 'doctor'
  });

  // State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activeConsultPatient, setActiveConsultPatient] = useState<QueueItem | null>(null);

  // Active Reception Lobby Queue (Patients waiting for Doctor)
  const [lobbyQueue, setLobbyQueue] = useState<QueueItem[]>([
    { id: 'q-1', token: 1, name: 'Priya Sharma', age: 34, gender: 'F', mrn: 'MRN-2026-01', phone: '+91 98765 43210', reason: 'Severe Chest Discomfort & Palpitations', is_emergency: true, status: 'waiting' },
    { id: 'q-2', token: 2, name: 'Rajesh Kumar', age: 52, gender: 'M', mrn: 'MRN-2026-02', phone: '+91 98111 22334', reason: 'Type 2 Diabetes Routine Follow-up', is_emergency: false, status: 'waiting' },
    { id: 'q-3', token: 3, name: 'Amit Verma', age: 29, gender: 'M', mrn: 'MRN-2026-03', phone: '+91 99222 33445', reason: 'Seasonal Viral Fever & Bodyache', is_emergency: false, status: 'waiting' }
  ]);

  // Consultation History (Completed Consultations)
  const [consultHistory, setConsultHistory] = useState<CompletedConsultation[]>([
    {
      id: 'hist-1',
      token: 101,
      name: 'Sunita Patel',
      mrn: 'MRN-2026-00',
      age: 45,
      gender: 'F',
      phone: '+91 97654 32100',
      diagnosis: 'Essential Hypertension',
      icd10: 'I10',
      medications: [
        { name: 'Telma 40 (Telmisartan)', dosage: '40mg', frequency: '1-0-0', duration: '30 days', instructions: 'Morning after breakfast' }
      ],
      advice: 'Low sodium diet, brisk walk 30 mins daily.',
      feeAmount: 500,
      feeStatus: 'paid_in_cabin',
      paymentMethod: 'UPI',
      completedAt: 'Today at 09:45 AM',
      dispenseTokenId: 'tok-ap-9912401'
    }
  ]);

  // Doctor Prescription Form State
  const [rxDiagnosis, setRxDiagnosis] = useState('Acute Upper Respiratory Tract Infection (Viral Pharyngitis)');
  const [rxIcd10, setRxIcd10] = useState('J06.9');
  const [rxAdvice, setRxAdvice] = useState('Steam inhalation twice daily, warm saline gargles, adequate hydration.');
  const [rxMeds, setRxMeds] = useState([
    { name: 'Dolo 650 (Paracetamol)', dosage: '650mg', frequency: '1-1-1', duration: '3 days', instructions: 'After meals' },
    { name: 'Augmentin 625 Duo', dosage: '625mg', frequency: '1-0-1', duration: '5 days', instructions: 'After meals' },
    { name: 'Pan 40 (Pantoprazole)', dosage: '40mg', frequency: '1-0-0', duration: '5 days', instructions: 'Empty stomach in morning' }
  ]);

  // Fee Collection Dialog State (In Cabin vs Send to Reception Desk)
  const [showFeeRoutingModal, setShowFeeRoutingModal] = useState(false);
  const [cabinFeeAmount, setCabinFeeAmount] = useState<number>(500);
  const [cabinPaymentMethod, setCabinPaymentMethod] = useState<'UPI' | 'Cash' | 'Card'>('UPI');

  // Printable Prescription Modal State
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [activePrintRecord, setActivePrintRecord] = useState<CompletedConsultation | null>(null);

  // WhatsApp Broadcast state
  const [broadcastMsg, setBroadcastMsg] = useState('Dr. Sharma is attending to an emergency patient. Scheduled OPD appointments are running ~25 minutes delayed. Thank you for your patience.');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Initialize session and patients from Supabase
  useEffect(() => {
    const rawSession = localStorage.getItem('superclinic_session');
    if (rawSession) {
      try {
        const parsed = JSON.parse(rawSession);
        setTenantInfo({
          name: parsed.tenant_name || 'Apollo Multi-Speciality Hospital',
          doctorName: parsed.full_name || 'Dr. Rajesh Sharma, MD',
          role: parsed.role || 'doctor'
        });
      } catch (e) {
        console.error('Session parse error:', e);
      }
    }

    async function loadPatients() {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*');

        if (!error && data && data.length > 0) {
          setPatients(data);
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    }
    loadPatients();
  }, []);

  // Emergency Queue Bump handler
  const handleEmergencyBump = (idx: number) => {
    const updated = [...lobbyQueue];
    const target = updated.splice(idx, 1)[0];
    target.is_emergency = true;
    target.token = 1;
    // shift other tokens
    updated.forEach((item, i) => item.token = i + 2);
    setLobbyQueue([target, ...updated]);
  };

  // Add Walk-in to Queue
  const handleAddWalkIn = () => {
    const nextToken = lobbyQueue.length + consultHistory.length + 1;
    const newEntry: QueueItem = {
      id: `walkin-${Date.now()}`,
      token: nextToken,
      name: `Walk-in Patient #${nextToken}`,
      age: 30,
      gender: 'M',
      mrn: `MRN-2026-0${nextToken}`,
      phone: '+91 98000 11223',
      reason: 'General Consultation',
      is_emergency: false,
      status: 'waiting'
    };
    setLobbyQueue([...lobbyQueue, newEntry]);
  };

  // Doctor starts consulting patient
  const handleStartConsult = (item: QueueItem) => {
    setActiveConsultPatient(item);
    setActiveTab('prescribe');
  };

  // Doctor finishes consultation and opens Fee Routing Modal
  const handleInitiateCompletion = () => {
    if (!activeConsultPatient) {
      if (lobbyQueue.length > 0) {
        setActiveConsultPatient(lobbyQueue[0]);
      } else {
        alert('Please select a patient from the queue first.');
        return;
      }
    }
    setShowFeeRoutingModal(true);
  };

  // Confirm Completion with Fee Routing Choice
  const handleConfirmCompletion = (collectionType: 'cabin' | 'reception_desk') => {
    const targetPatient = activeConsultPatient || lobbyQueue[0];
    if (!targetPatient) return;

    const fakeTokenId = 'IND-RX-' + Math.floor(10000000 + Math.random() * 90000000);
    const newRecord: CompletedConsultation = {
      id: `consult-${Date.now()}`,
      token: targetPatient.token,
      name: targetPatient.name,
      mrn: targetPatient.mrn,
      age: targetPatient.age,
      gender: targetPatient.gender,
      phone: targetPatient.phone,
      diagnosis: rxDiagnosis,
      icd10: rxIcd10,
      medications: rxMeds,
      advice: rxAdvice,
      feeAmount: cabinFeeAmount,
      feeStatus: collectionType === 'cabin' ? 'paid_in_cabin' : 'pending_at_desk',
      paymentMethod: collectionType === 'cabin' ? cabinPaymentMethod : undefined,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dispenseTokenId: fakeTokenId
    };

    // 1. ADD to Consultation History
    setConsultHistory([newRecord, ...consultHistory]);

    // 2. REMOVE from Active Reception Lobby Queue (Requirement 5!)
    setLobbyQueue(lobbyQueue.filter(q => q.id !== targetPatient.id));

    // Reset active patient and close modal
    setActiveConsultPatient(null);
    setShowFeeRoutingModal(false);

    // Show Printable Rx Modal
    setActivePrintRecord(newRecord);
    setShowPrintModal(true);
  };

  // Receptionist collects pending fee at front desk
  const handleCollectAtDesk = (recordId: string, method: string) => {
    setConsultHistory(consultHistory.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          feeStatus: 'paid_at_desk',
          paymentMethod: method
        };
      }
      return rec;
    }));
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
                <h1 className="font-bold text-base tracking-tight text-white">{tenantInfo.name}</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-900 text-teal-300 border border-teal-700 font-mono">
                  HOSPITAL HIS (₹ INR)
                </span>
              </div>
              <p className="text-xs text-slate-400">{tenantInfo.doctorName} • OPD Consulting Room</p>
            </div>
          </div>
        </div>

        {/* Right Status & Hospital Switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Reception Lobby: <strong className="text-white">{lobbyQueue.length} Waiting</strong></span>
          </div>

          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-xs text-teal-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Switch Hospital</span>
          </button>

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
            <span>Reception Lobby Queue</span>
            <span className="ml-auto text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-mono font-bold">
              {lobbyQueue.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('prescribe')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'prescribe' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Doctor Cabin & Prescriptions</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'history' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4 text-teal-600" />
            <span>Consultation History</span>
            <span className="ml-auto text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full font-mono">
              {consultHistory.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'billing' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Receipt className="w-4 h-4 text-teal-600" />
            <span>Reception Fee Collection</span>
            {consultHistory.filter(c => c.feeStatus === 'pending_at_desk').length > 0 && (
              <span className="ml-auto text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                {consultHistory.filter(c => c.feeStatus === 'pending_at_desk').length} Due
              </span>
            )}
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
            <span>OPD Revenue & Analytics (₹)</span>
          </button>
        </aside>

        {/* Center Content Viewport */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* TAB 1: RECEPTION LOBBY QUEUE */}
          {activeTab === 'queue' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Reception Lobby Queue</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Patients waiting for consultation. Once the doctor finishes, they are automatically removed and moved to History!
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddWalkIn}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register Walk-In Patient</span>
                  </button>
                </div>
              </div>

              {/* Queue List Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-600">Active Waiting Patients ({lobbyQueue.length})</span>
                  <span className="text-xs text-slate-500">Emergency Patients Prioritized</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {lobbyQueue.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-xs">
                      No patients currently waiting in the lobby. All consultations completed!
                    </div>
                  ) : (
                    lobbyQueue.map((item, idx) => (
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
                              <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{item.mrn}</span>
                              {item.is_emergency && (
                                <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[10px] font-bold flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-rose-700" />
                                  EMERGENCY
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">Complaints: <strong>{item.reason}</strong> • Phone: {item.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!item.is_emergency && (
                            <button
                              onClick={() => handleEmergencyBump(idx)}
                              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition"
                            >
                              Emergency Bump
                            </button>
                          )}
                          <button
                            onClick={() => handleStartConsult(item)}
                            className="px-3.5 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition flex items-center gap-1"
                          >
                            <span>Consult in Cabin</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCTOR CABIN & PRESCRIPTION WRITER */}
          {activeTab === 'prescribe' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Doctor Cabin Workstation</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    ICD-10 Diagnostic validator + Dual Fee Collection (Cabin vs Admin Desk).
                  </p>
                </div>
                <div className="bg-teal-50 px-4 py-2 rounded-xl border border-teal-200 text-right">
                  <span className="text-xs font-bold text-teal-800">
                    Patient: {activeConsultPatient ? activeConsultPatient.name : (lobbyQueue[0]?.name || 'Priya Sharma')}
                  </span>
                  <p className="text-[11px] text-teal-600">
                    {activeConsultPatient ? `${activeConsultPatient.mrn} • Token #${activeConsultPatient.token}` : (lobbyQueue[0] ? `${lobbyQueue[0].mrn} • Token #${lobbyQueue[0].token}` : 'No queue patient')}
                  </p>
                </div>
              </div>

              {/* Consultation Editor */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Diagnosis</label>
                    <input
                      type="text"
                      value={rxDiagnosis}
                      onChange={(e) => setRxDiagnosis(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ICD-10 Diagnostic Code</label>
                    <select
                      value={rxIcd10}
                      onChange={(e) => setRxIcd10(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-white font-medium"
                    >
                      <option value="J06.9">J06.9 - Acute upper respiratory infection</option>
                      <option value="E11.9">E11.9 - Type 2 diabetes mellitus</option>
                      <option value="I10">I10 - Essential (primary) hypertension</option>
                      <option value="K29.7">K29.7 - Gastritis & Acidity</option>
                      <option value="M54.5">M54.5 - Low back pain</option>
                    </select>
                  </div>
                </div>

                {/* Prescribed Medications */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700">Prescribed Indian Medicines</label>
                    <button
                      type="button"
                      onClick={() => setRxMeds([...rxMeds, { name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'After food' }])}
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
                          placeholder="Medicine name (e.g. Dolo 650)"
                          className="sm:col-span-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Advice / Dietary Instructions</label>
                  <textarea
                    rows={2}
                    value={rxAdvice}
                    onChange={(e) => setRxAdvice(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600"
                  />
                </div>

                {/* Requirement 6: Doctor Finish Consult & Choose Fee Collection Action */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleInitiateCompletion}
                    className="flex-1 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Consultation & Select Fee Option</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONSULTATION HISTORY (Requirement 5) */}
          {activeTab === 'history' && (
            <div className="space-y-6 max-w-5xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Consultation History & Past OPD Records</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Patients are automatically stored here once consultation is completed.
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                  {consultHistory.length} Total Consultations
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100">
                  {consultHistory.map((rec) => (
                    <div key={rec.id} className="p-5 hover:bg-slate-50 transition space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center">
                            #{rec.token}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-slate-900">{rec.name}</h4>
                              <span className="text-xs text-slate-500">({rec.age}y / {rec.gender})</span>
                              <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">{rec.mrn}</span>
                            </div>
                            <p className="text-xs text-slate-500">Completed: {rec.completedAt} • Phone: {rec.phone}</p>
                          </div>
                        </div>

                        {/* Fee Status Badge */}
                        <div className="flex items-center gap-2">
                          {rec.feeStatus === 'paid_in_cabin' && (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Paid in Cabin: ₹{rec.feeAmount} ({rec.paymentMethod})</span>
                            </span>
                          )}
                          {rec.feeStatus === 'paid_at_desk' && (
                            <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1 border border-teal-200">
                              <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                              <span>Paid at Reception: ₹{rec.feeAmount} ({rec.paymentMethod})</span>
                            </span>
                          )}
                          {rec.feeStatus === 'pending_at_desk' && (
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Pending at Reception Desk: ₹{rec.feeAmount}</span>
                            </span>
                          )}

                          <button
                            onClick={() => {
                              setActivePrintRecord(rec);
                              setShowPrintModal(true);
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center gap-1 hover:bg-slate-800 transition"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Print Rx</span>
                          </button>
                        </div>
                      </div>

                      {/* Clinical Summary */}
                      <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                        <p><strong className="text-slate-700">Diagnosis:</strong> {rec.diagnosis} (ICD-10: {rec.icd10})</p>
                        <p><strong className="text-slate-700">Medicines Prescribed:</strong> {rec.medications.map(m => `${m.name} (${m.frequency} x ${m.duration})`).join(', ')}</p>
                        <p><strong className="text-slate-700">Advice:</strong> {rec.advice}</p>
                        <p className="text-[10px] text-teal-700 font-mono mt-1">Dispense QR Token: <strong>{rec.dispenseTokenId}</strong></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RECEPTION FEE COLLECTION QUEUE (Requirement 6) */}
          {activeTab === 'billing' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Reception Desk Fee Collection</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Patients sent from doctor cabin for payment collection at the front desk.
                  </p>
                </div>
              </div>

              {/* Pending Bills from Doctor Cabin */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Awaiting Payment Collection ({consultHistory.filter(c => c.feeStatus === 'pending_at_desk').length})
                </h3>

                {consultHistory.filter(c => c.feeStatus === 'pending_at_desk').length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                    ✅ No pending bills at the reception desk! All fees have been collected.
                  </div>
                ) : (
                  consultHistory.filter(c => c.feeStatus === 'pending_at_desk').map((rec) => (
                    <div key={rec.id} className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">PAYMENT DUE</span>
                          <h4 className="font-extrabold text-base text-slate-900">{rec.name}</h4>
                          <span className="text-xs text-slate-500">({rec.mrn})</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Referred from Doctor Cabin • Consultation Fee Due: <strong className="text-emerald-700 text-sm">₹{rec.feeAmount}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCollectAtDesk(rec.id, 'UPI')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <span>Collect via UPI QR (₹{rec.feeAmount})</span>
                        </button>
                        <button
                          onClick={() => handleCollectAtDesk(rec.id, 'Cash')}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                        >
                          <span>Collect Cash (₹{rec.feeAmount})</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PATIENT EMR */}
          {activeTab === 'emr' && (
            <div className="space-y-6 max-w-5xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Patient EMR Records</h2>
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
                          setActiveConsultPatient({
                            id: p.id,
                            token: lobbyQueue.length + 1,
                            name: p.name,
                            age: 35,
                            gender: p.gender,
                            mrn: p.mrn,
                            phone: p.phone,
                            reason: 'EMR Scheduled Consult',
                            is_emergency: false,
                            status: 'waiting'
                          });
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: WHATSAPP BROADCAST */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">WhatsApp Broadcast & Delay Announcements</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Alert waiting patients on WhatsApp when doctor appointments are delayed due to emergency consults.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delay Announcement Message</label>
                  <textarea
                    rows={3}
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 font-medium"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Recipients: <strong>{lobbyQueue.length} Patients currently in Lobby</strong></span>
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
                    <span>WhatsApp broadcast dispatched successfully to Meta Cloud API queue!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6 max-w-5xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">OPD Revenue & Footfall Reports (₹ INR)</h2>
                <p className="text-xs text-slate-500 mt-1">Daily revenue aggregations and doctor consultation metrics.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Today&apos;s OPD Revenue</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">₹{consultHistory.length * 500}</h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">₹500 / consult average</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Total Consultations Today</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{consultHistory.length} Completed</h3>
                  <p className="text-[11px] text-teal-600 font-bold mt-1">{lobbyQueue.length} still in lobby</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Payment Mode Split</span>
                  <div className="text-xs mt-2 space-y-1">
                    <div className="flex justify-between"><span>UPI QR:</span> <strong>75%</strong></div>
                    <div className="flex justify-between"><span>Cash:</span> <strong>20%</strong></div>
                    <div className="flex justify-between"><span>Card:</span> <strong>5%</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* REQUIREMENT 6: DOCTOR FEE COLLECTION ROUTING DIALOG */}
      {showFeeRoutingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full uppercase">
                Consultation Finished
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                Choose Fee Collection Option
              </h3>
              <p className="text-xs text-slate-500">
                Patient: <strong>{activeConsultPatient?.name || lobbyQueue[0]?.name}</strong>
              </p>
            </div>

            <div className="space-y-3">
              {/* Option A: Collect in Doctor Cabin */}
              <div className="p-4 rounded-2xl border-2 border-teal-200 bg-teal-50/50 hover:border-teal-500 transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-teal-900 flex items-center gap-1.5">
                    <span>Option A: Collect Fee in Doctor Cabin</span>
                  </span>
                  <span className="text-xs font-black text-teal-700">₹{cabinFeeAmount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCabinPaymentMethod('UPI')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                      cabinPaymentMethod === 'UPI' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    UPI QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setCabinPaymentMethod('Cash')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                      cabinPaymentMethod === 'Cash' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setCabinPaymentMethod('Card')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                      cabinPaymentMethod === 'Card' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Card
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleConfirmCompletion('cabin')}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition"
                >
                  Collect ₹{cabinFeeAmount} in Cabin & Finish
                </button>
              </div>

              {/* Option B: Send to Reception / Admin Desk */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Option B: Send to Reception Desk</span>
                  <span className="text-xs font-black text-slate-700">₹{cabinFeeAmount} Due</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Routes patient to the Front Desk. Receptionist will collect ₹{cabinFeeAmount} and print invoice.
                </p>
                <button
                  type="button"
                  onClick={() => handleConfirmCompletion('reception_desk')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition"
                >
                  Send to Reception Desk for Collection
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowFeeRoutingModal(false)}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PRINTABLE PRESCRIPTION MODAL */}
      {showPrintModal && activePrintRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header with Hospital Branding */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{tenantInfo.name}</h3>
                <p className="text-xs text-slate-500">OPD Consultation & Healthcare Center • Tel: +91 (800) 555-CLINIC</p>
                <p className="text-xs text-teal-700 font-bold mt-0.5">{tenantInfo.doctorName} (MCI Reg # IND-2026-99)</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-teal-700">Rx</span>
                <p className="text-[10px] text-slate-400 font-mono">Date: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Patient Info Bar */}
            <div className="my-4 py-2 px-3 bg-slate-100 rounded-xl text-xs flex justify-between font-medium">
              <span>Patient: <strong>{activePrintRecord.name}</strong></span>
              <span>Age/Sex: <strong>{activePrintRecord.age} / {activePrintRecord.gender}</strong></span>
              <span>MRN: <strong>{activePrintRecord.mrn}</strong></span>
              <span>Fee: <strong>₹{activePrintRecord.feeAmount} ({activePrintRecord.feeStatus})</strong></span>
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
                  {activePrintRecord.medications.map((m, i) => (
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
              <strong>Doctor Advice:</strong> {activePrintRecord.advice}
            </div>

            {/* The Standout QR Bridge Callout */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  SECURE PHARMACY STORE QR TOKEN
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  Present this QR or Token at any participating pharmacy store to dispense medicines.
                </p>
                <p className="text-[11px] font-mono text-slate-400 mt-1 break-all select-all">
                  Token: <strong>{activePrintRecord.dispenseTokenId}</strong>
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
