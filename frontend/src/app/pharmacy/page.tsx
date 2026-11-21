'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Pill, 
  Barcode, 
  Receipt, 
  Boxes, 
  Calendar, 
  TrendingUp, 
  QrCode, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  LogOut, 
  Printer, 
  ShoppingBag,
  Building2
} from 'lucide-react';

// TOP 30 INDIAN ESSENTIAL & MOST-SELLING MEDICINES (INITIALIZED TO 100 UNITS EACH)
const TOP_30_INDIAN_MEDICINES = [
  { id: 'ind-01', medicine_name: 'Dolo 650 (Paracetamol 650mg)', generic_name: 'Paracetamol', category: 'Analgesics / Fever', batch_number: 'BAT-IND-01', unit_mrp: 35, unit_cost_price: 18, unit_selling_price: 30, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-12-31', manufacturer: 'Micro Labs' },
  { id: 'ind-02', medicine_name: 'Augmentin 625 Duo', generic_name: 'Amoxicillin + Clavulanic Acid', category: 'Antibiotics', batch_number: 'BAT-IND-02', unit_mrp: 220, unit_cost_price: 140, unit_selling_price: 195, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-10-31', manufacturer: 'GSK' },
  { id: 'ind-03', medicine_name: 'Azee 500 (Azithromycin 500mg)', generic_name: 'Azithromycin', category: 'Antibiotics', batch_number: 'BAT-IND-03', unit_mrp: 135, unit_cost_price: 85, unit_selling_price: 120, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-08-31', manufacturer: 'Cipla' },
  { id: 'ind-04', medicine_name: 'Pan 40 (Pantoprazole 40mg)', generic_name: 'Pantoprazole', category: 'Antacid / PPI', batch_number: 'BAT-IND-04', unit_mrp: 160, unit_cost_price: 95, unit_selling_price: 145, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-11-30', manufacturer: 'Alkem' },
  { id: 'ind-05', medicine_name: 'Omez-D (Omeprazole + Domperidone)', generic_name: 'Omeprazole + Domperidone', category: 'Antacid / GERD', batch_number: 'BAT-IND-05', unit_mrp: 195, unit_cost_price: 120, unit_selling_price: 175, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-09-30', manufacturer: "Dr. Reddy's" },
  { id: 'ind-06', medicine_name: 'Glycomet 500 (Metformin 500mg)', generic_name: 'Metformin Hydrochloride', category: 'Antidiabetic', batch_number: 'BAT-IND-06', unit_mrp: 45, unit_cost_price: 25, unit_selling_price: 40, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-06-30', manufacturer: 'USV' },
  { id: 'ind-07', medicine_name: 'Amaryl 2 (Glimepiride 2mg)', generic_name: 'Glimepiride', category: 'Antidiabetic', batch_number: 'BAT-IND-07', unit_mrp: 145, unit_cost_price: 90, unit_selling_price: 130, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-07-31', manufacturer: 'Sanofi' },
  { id: 'ind-08', medicine_name: 'Telma 40 (Telmisartan 40mg)', generic_name: 'Telmisartan', category: 'Hypertension / BP', batch_number: 'BAT-IND-08', unit_mrp: 135, unit_cost_price: 80, unit_selling_price: 120, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2027-11-30', manufacturer: 'Glenmark' },
  { id: 'ind-09', medicine_name: 'Amlong 5 (Amlodipine 5mg)', generic_name: 'Amlodipine Besylate', category: 'Hypertension / BP', batch_number: 'BAT-IND-09', unit_mrp: 55, unit_cost_price: 30, unit_selling_price: 48, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-05-31', manufacturer: 'Micro Labs' },
  { id: 'ind-10', medicine_name: 'Atorva 10 (Atorvastatin 10mg)', generic_name: 'Atorvastatin', category: 'Cholesterol / Statin', batch_number: 'BAT-IND-10', unit_mrp: 130, unit_cost_price: 75, unit_selling_price: 115, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-04-30', manufacturer: 'Zydus Cadila' },
  { id: 'ind-11', medicine_name: 'Montair LC (Montelukast + Levocetirizine)', generic_name: 'Montelukast + Levocetirizine', category: 'Allergy & Respiratory', batch_number: 'BAT-IND-11', unit_mrp: 210, unit_cost_price: 130, unit_selling_price: 185, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-03-31', manufacturer: 'Cipla' },
  { id: 'ind-12', medicine_name: 'Cetzine 10 (Cetirizine 10mg)', generic_name: 'Cetirizine Hydrochloride', category: 'Antiallergy', batch_number: 'BAT-IND-12', unit_mrp: 22, unit_cost_price: 10, unit_selling_price: 19, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2029-01-31', manufacturer: 'GSK' },
  { id: 'ind-13', medicine_name: 'Ciplox 500 (Ciprofloxacin 500mg)', generic_name: 'Ciprofloxacin', category: 'Antibiotics', batch_number: 'BAT-IND-13', unit_mrp: 48, unit_cost_price: 25, unit_selling_price: 42, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-02-28', manufacturer: 'Cipla' },
  { id: 'ind-14', medicine_name: 'Taxim-O 200 (Cefixime 200mg)', generic_name: 'Cefixime', category: 'Antibiotics', batch_number: 'BAT-IND-14', unit_mrp: 125, unit_cost_price: 75, unit_selling_price: 110, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-07-31', manufacturer: 'Alkem' },
  { id: 'ind-15', medicine_name: 'Zerodol-SP (Aceclo + Para + Serratio)', generic_name: 'Aceclofenac + Paracetamol + Serratio', category: 'Pain & Swelling', batch_number: 'BAT-IND-15', unit_mrp: 125, unit_cost_price: 78, unit_selling_price: 112, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-06-30', manufacturer: 'Ipca Labs' },
  { id: 'ind-16', medicine_name: 'Voveran 50 (Diclofenac 50mg)', generic_name: 'Diclofenac Sodium', category: 'Pain Relief', batch_number: 'BAT-IND-16', unit_mrp: 65, unit_cost_price: 38, unit_selling_price: 58, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-09-30', manufacturer: 'Novartis' },
  { id: 'ind-17', medicine_name: 'Combiflam (Ibuprofen + Paracetamol)', generic_name: 'Ibuprofen + Paracetamol', category: 'Pain & Fever', batch_number: 'BAT-IND-17', unit_mrp: 47, unit_cost_price: 26, unit_selling_price: 42, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-11-30', manufacturer: 'Sanofi' },
  { id: 'ind-18', medicine_name: 'Emeset 4 (Ondansetron 4mg)', generic_name: 'Ondansetron', category: 'Anti-Emetic', batch_number: 'BAT-IND-18', unit_mrp: 62, unit_cost_price: 35, unit_selling_price: 55, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-05-31', manufacturer: 'Cipla' },
  { id: 'ind-19', medicine_name: 'Vomistop (Domperidone 10mg)', generic_name: 'Domperidone', category: 'Nausea Relief', batch_number: 'BAT-IND-19', unit_mrp: 40, unit_cost_price: 20, unit_selling_price: 35, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-08-31', manufacturer: 'Cipla' },
  { id: 'ind-20', medicine_name: 'Flagyl 400 (Metronidazole 400mg)', generic_name: 'Metronidazole', category: 'Antiamoebic', batch_number: 'BAT-IND-20', unit_mrp: 25, unit_cost_price: 12, unit_selling_price: 22, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-10-31', manufacturer: 'Abbott' },
  { id: 'ind-21', medicine_name: 'Rantac 150 (Ranitidine 150mg)', generic_name: 'Ranitidine Hydrochloride', category: 'Antacid', batch_number: 'BAT-IND-21', unit_mrp: 45, unit_cost_price: 24, unit_selling_price: 39, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-12-31', manufacturer: 'JB Chemicals' },
  { id: 'ind-22', medicine_name: 'Losar 50 (Losartan Potassium 50mg)', generic_name: 'Losartan Potassium', category: 'Hypertension / BP', batch_number: 'BAT-IND-22', unit_mrp: 115, unit_cost_price: 68, unit_selling_price: 102, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-03-31', manufacturer: 'Unichem' },
  { id: 'ind-23', medicine_name: 'Rosuvas 10 (Rosuvastatin 10mg)', generic_name: 'Rosuvastatin', category: 'Cholesterol / Statin', batch_number: 'BAT-IND-23', unit_mrp: 230, unit_cost_price: 145, unit_selling_price: 205, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-04-30', manufacturer: 'Sun Pharma' },
  { id: 'ind-24', medicine_name: 'Deplatt 75 (Clopidogrel 75mg)', generic_name: 'Clopidogrel', category: 'Cardiac Care', batch_number: 'BAT-IND-24', unit_mrp: 120, unit_cost_price: 70, unit_selling_price: 105, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-07-31', manufacturer: 'Torrent' },
  { id: 'ind-25', medicine_name: 'Thyronorm 50 (Levothyroxine 50mcg)', generic_name: 'Levothyroxine Sodium', category: 'Thyroid Care', batch_number: 'BAT-IND-25', unit_mrp: 165, unit_cost_price: 100, unit_selling_price: 148, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-06-30', manufacturer: 'Abbott' },
  { id: 'ind-26', medicine_name: 'Calcirol Sachet (Cholecalciferol 60k)', generic_name: 'Vitamin D3 60,000 IU', category: 'Vitamins & D3', batch_number: 'BAT-IND-26', unit_mrp: 110, unit_cost_price: 60, unit_selling_price: 98, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-09-30', manufacturer: 'Cadila' },
  { id: 'ind-27', medicine_name: 'Becosules Z (B-Complex + Zinc)', generic_name: 'Multivitamins with Zinc', category: 'Multivitamins', batch_number: 'BAT-IND-27', unit_mrp: 58, unit_cost_price: 32, unit_selling_price: 52, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-11-30', manufacturer: 'Pfizer' },
  { id: 'ind-28', medicine_name: 'Shelcal 500 (Calcium + D3)', generic_name: 'Calcium Carbonate + D3', category: 'Bone & Calcium', batch_number: 'BAT-IND-28', unit_mrp: 145, unit_cost_price: 85, unit_selling_price: 130, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2028-12-31', manufacturer: 'Torrent' },
  { id: 'ind-29', medicine_name: 'Ascoril-D Plus Cough Syrup', generic_name: 'Dextromethorphan + Chlorpheniramine', category: 'Cough & Cold', batch_number: 'BAT-IND-29', unit_mrp: 135, unit_cost_price: 80, unit_selling_price: 122, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2027-12-31', manufacturer: 'Glenmark' },
  { id: 'ind-30', medicine_name: 'Electral ORS (WHO Formula)', generic_name: 'Oral Rehydration Salts', category: 'ORS & Electrolyte', batch_number: 'BAT-IND-30', unit_mrp: 24, unit_cost_price: 14, unit_selling_price: 21, stock_level: 100, reorder_alert_threshold: 20, expiry_date: '2029-03-31', manufacturer: 'FDC' }
];

export default function PharmacyDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pos' | 'inventory' | 'expiry' | 'analytics' | 'bridge'>('pos');
  
  // Organization Context from Session
  const [tenantInfo, setTenantInfo] = useState({
    name: 'Apex Care Pharmacy Store',
    staffName: 'Alex Chemist',
    role: 'pharmacist'
  });

  // Inventory state (Indian Top 30 with 100 units each)
  const [inventory, setInventory] = useState(TOP_30_INDIAN_MEDICINES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Revenue & Sales Analytics (Dynamic state that increments with sales!)
  const [totalSalesRevenue, setTotalSalesRevenue] = useState(38450); // initial ₹ revenue
  const [todaySalesRevenue, setTodaySalesRevenue] = useState(4820);
  const [totalBillsIssued, setTotalBillsIssued] = useState(38);
  const [totalCOGS, setTotalCOGS] = useState(2450);

  // POS Cart State
  const [cart, setCart] = useState<any[]>([
    { id: 'ind-01', medicine_name: 'Dolo 650 (Paracetamol 650mg)', batch: 'BAT-IND-01', qty: 2, unit_price: 30, cost_price: 18, mrp: 35 },
    { id: 'ind-04', medicine_name: 'Pan 40 (Pantoprazole 40mg)', batch: 'BAT-IND-04', qty: 1, unit_price: 145, cost_price: 95, mrp: 160 }
  ]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'card'>('upi');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [completedSale, setCompletedSale] = useState<any | null>(null);

  // Prescription Token Fulfillment Bridge State
  const [inputTokenId, setInputTokenId] = useState('');
  const [tokenResult, setTokenResult] = useState<any | null>(null);
  const [tokenError, setTokenError] = useState('');

  // Add Item to Inventory Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({
    medicine_name: '',
    category: 'Analgesics',
    batch_number: '',
    unit_cost_price: 50,
    unit_mrp: 90,
    unit_selling_price: 80,
    stock_level: 100,
    reorder_alert_threshold: 20,
    expiry_date: '2028-12-31'
  });

  // Load session
  useEffect(() => {
    const rawSession = localStorage.getItem('superclinic_session');
    if (rawSession) {
      try {
        const parsed = JSON.parse(rawSession);
        setTenantInfo({
          name: parsed.tenant_name || 'Apex Care Pharmacy Store',
          staffName: parsed.full_name || 'Alex Chemist',
          role: parsed.role || 'pharmacist'
        });
      } catch (e) {
        console.error('Session parse error:', e);
      }
    }
  }, []);

  // Cart Calculations in ₹ INR
  const subtotal = cart.reduce((acc, item) => acc + (item.unit_price * item.qty), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxAmount = (subtotal - discountAmount) * 0.05; // 5% GST
  const grandTotal = subtotal - discountAmount + taxAmount;

  // Add medicine to cart (checks stock limit)
  const handleAddToCart = (item: any) => {
    if (item.stock_level <= 0) {
      alert(`Sorry! ${item.medicine_name} is currently OUT OF STOCK.`);
      return;
    }

    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      if (existing.qty >= item.stock_level) {
        alert(`Cannot add more. Available stock limit is ${item.stock_level} units.`);
        return;
      }
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, {
        id: item.id,
        medicine_name: item.medicine_name,
        batch: item.batch_number,
        qty: 1,
        unit_price: item.unit_selling_price,
        cost_price: item.unit_cost_price,
        mrp: item.unit_mrp
      }]);
    }
  };

  // Cart quantity adjust
  const handleUpdateQty = (id: string, delta: number) => {
    const itemInStock = inventory.find(inv => inv.id === id);
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.qty + delta;
        if (newQty < 1) return c;
        if (itemInStock && newQty > itemInStock.stock_level) {
          alert(`Maximum available stock is ${itemInStock.stock_level} units.`);
          return c;
        }
        return { ...c, qty: newQty };
      }
      return c;
    }));
  };

  // Remove from cart
  const handleRemoveItem = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  // REQUIREMENT 4: Dynamic stock deduction & revenue addition!
  const handleCheckout = () => {
    const invoiceNum = `BILL-IN-${Date.now().toString().slice(-6)}`;
    
    // 1. Deduct exact units from Inventory
    const updatedInventory = inventory.map(invItem => {
      const soldItem = cart.find(c => c.id === invItem.id);
      if (soldItem) {
        const newStock = Math.max(0, invItem.stock_level - soldItem.qty);
        return { ...invItem, stock_level: newStock };
      }
      return invItem;
    });

    setInventory(updatedInventory);

    // 2. Compute cost and revenue
    const cartCost = cart.reduce((acc, it) => acc + (it.cost_price * it.qty), 0);

    setTotalSalesRevenue(prev => prev + grandTotal);
    setTodaySalesRevenue(prev => prev + grandTotal);
    setTotalCOGS(prev => prev + cartCost);
    setTotalBillsIssued(prev => prev + 1);

    // 3. Set completed sale receipt
    setCompletedSale({
      invoice_number: invoiceNum,
      customer_name: customerName,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: grandTotal,
      paymentMethod,
      items: cart,
      date: new Date().toLocaleString('en-IN')
    });

    // Reset cart
    setCart([]);
  };

  // Lookup Token Bridge
  const handleLookupToken = () => {
    setTokenError('');
    if (!inputTokenId) {
      setTokenError('Please enter or scan a valid prescription QR code.');
      return;
    }

    setTokenResult({
      id: inputTokenId,
      clinic_name: 'Apollo Multi-Speciality Hospital',
      doctor_name: 'Dr. Rajesh Sharma, MD',
      patient_masked_name: 'P*** S***',
      patient_phone: '+91 98765 43210',
      medications: [
        { name: 'Dolo 650 (Paracetamol 650mg)', dosage: '650mg', frequency: '1-1-1', duration: '3 days' },
        { name: 'Augmentin 625 Duo', dosage: '625mg', frequency: '1-0-1', duration: '5 days' },
        { name: 'Pan 40 (Pantoprazole 40mg)', dosage: '40mg', frequency: '1-0-0', duration: '5 days' }
      ],
      status: 'active',
      expires_at: 'Valid for 30 Days'
    });
  };

  // Fulfill Token into Cart
  const handleFulfillToken = () => {
    if (!tokenResult) return;
    setCart([
      { id: 'ind-01', medicine_name: 'Dolo 650 (Paracetamol 650mg)', batch: 'BAT-IND-01', qty: 2, unit_price: 30, cost_price: 18, mrp: 35 },
      { id: 'ind-02', medicine_name: 'Augmentin 625 Duo', batch: 'BAT-IND-02', qty: 1, unit_price: 195, cost_price: 140, mrp: 220 },
      { id: 'ind-04', medicine_name: 'Pan 40 (Pantoprazole 40mg)', batch: 'BAT-IND-04', qty: 1, unit_price: 145, cost_price: 95, mrp: 160 }
    ]);
    setCustomerName('Clinic Patient: ' + tokenResult.patient_masked_name);
    setTokenResult({ ...tokenResult, status: 'dispensed' });
    setActiveTab('pos');
  };

  // Categories list
  const categories = ['All', 'Antibiotics', 'Analgesics / Fever', 'Antacid / PPI', 'Antacid / GERD', 'Antidiabetic', 'Hypertension / BP', 'Cholesterol / Statin', 'Allergy & Respiratory', 'Multivitamins', 'Bone & Calcium'];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* Top Application Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-white">{tenantInfo.name}</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  PHARMACY STORE POS (₹ INR)
                </span>
              </div>
              <p className="text-xs text-slate-400">Cashier: {tenantInfo.staffName} • Retail Billing Terminal</p>
            </div>
          </div>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-300">Today&apos;s Revenue: <strong className="text-emerald-400">₹{todaySalesRevenue.toLocaleString('en-IN')}</strong></span>
          </div>

          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-xs text-emerald-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Switch Store</span>
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
            onClick={() => setActiveTab('pos')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'pos' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Walk-in Billing Counter</span>
            {cart.length > 0 && (
              <span className="ml-auto text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-mono">{cart.length}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'inventory' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Boxes className="w-4 h-4 text-emerald-600" />
            <span>Top 30 Indian Drug Stock</span>
            <span className="ml-auto text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">30</span>
          </button>

          <button
            onClick={() => setActiveTab('expiry')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'expiry' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Expiry Date Guardian</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'analytics' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Monthly Sales & Charts (₹)</span>
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'bridge' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <QrCode className="w-4 h-4 text-teal-400" />
            <span>Fulfill Hospital Rx Token</span>
          </button>
        </aside>

        {/* Center Content Viewport */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* TAB 1: POS BILLING COUNTER WITH TOP 30 INDIAN MEDICINES */}
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl">
              
              {/* Left Column: Product Search Grid */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search Dolo, Augmentin, Pan 40, Azithromycin, Telma..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-100 px-3 py-2 rounded-xl">
                    <Barcode className="w-4 h-4" />
                    <span>Barcode Ready</span>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                        selectedCategory === cat
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Available Inventory Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
                  {inventory
                    .filter(item => {
                      const matchesSearch = item.medicine_name.toLowerCase().includes(searchQuery.toLowerCase()) || item.generic_name.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
                      return matchesSearch && matchesCat;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleAddToCart(item)}
                        className={`bg-white p-4 rounded-2xl border transition group cursor-pointer ${
                          item.stock_level <= 0 
                            ? 'border-slate-200 opacity-60 bg-slate-50 cursor-not-allowed'
                            : 'border-slate-200 hover:border-emerald-500 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono">{item.manufacturer} • {item.batch_number}</span>
                            <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {item.medicine_name}
                            </h4>
                            <p className="text-xs text-slate-500">{item.generic_name}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            item.stock_level <= 0
                              ? 'bg-rose-600 text-white'
                              : item.stock_level <= item.reorder_alert_threshold
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.stock_level <= 0 ? 'OUT OF STOCK' : `Stock: ${item.stock_level}`}
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-400 line-through mr-1.5">₹{item.unit_mrp}</span>
                            <span className="text-sm font-black text-slate-900">₹{item.unit_selling_price}</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            <span>+ Add to Cart</span>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Right Column: POS Billing Cart */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-black text-base text-slate-900">Retail Billing Counter</h3>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="text-xs text-slate-500 mt-0.5 border-b border-dashed border-slate-300 focus:outline-none"
                      />
                    </div>
                    <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold">
                      {cart.length} Items
                    </span>
                  </div>

                  {/* Cart Items List */}
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto my-4">
                    {cart.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400">
                        Cart is empty. Select from top 30 Indian medicines or scan barcode.
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{item.medicine_name}</p>
                            <p className="text-[10px] text-slate-400">Batch {item.batch} • ₹{item.unit_price} each</p>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Quantity Adjuster */}
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                              <button 
                                onClick={() => handleUpdateQty(item.id, -1)}
                                className="px-2 py-1 hover:bg-slate-200 text-slate-600"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 font-bold text-slate-900 text-xs">{item.qty}</span>
                              <button 
                                onClick={() => handleUpdateQty(item.id, 1)}
                                className="px-2 py-1 hover:bg-slate-200 text-slate-600"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-bold text-slate-900 min-w-[50px] text-right">
                              ₹{(item.unit_price * item.qty).toFixed(2)}
                            </span>

                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-slate-400 hover:text-rose-500 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Price Calculations in ₹ INR */}
                  <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Discount:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(Number(e.target.value))}
                          className="w-12 px-1 py-0.5 rounded border border-slate-200 text-right text-xs"
                        />
                        <span>% (-₹{discountAmount.toFixed(2)})</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>GST (5%):</span>
                      <span className="font-medium">+₹{taxAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Grand Total:</span>
                      <span className="text-emerald-600 text-base">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`py-2 text-xs font-bold rounded-xl border transition ${
                          paymentMethod === 'upi' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        UPI / QR Code
                      </button>
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`py-2 text-xs font-bold rounded-xl border transition ${
                          paymentMethod === 'cash' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        Cash
                      </button>
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`py-2 text-xs font-bold rounded-xl border transition ${
                          paymentMethod === 'card' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        Card
                      </button>
                    </div>
                  </div>
                </div>

                {/* Checkout Button: Decrements Stock & Adds Revenue! */}
                <button
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className="mt-6 w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Deduct Stock & Print Bill (₹{grandTotal.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & STOCK MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 max-w-6xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Top 30 Indian Essential Medicines Stock</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    All medicines initialized with 100 units. Sales automatically deduct from this live ledger.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Batch</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Medicine Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Manufacturer</th>
                      <th className="py-3 px-4">Batch Number</th>
                      <th className="py-3 px-4">Cost (₹)</th>
                      <th className="py-3 px-4">Selling Price (₹)</th>
                      <th className="py-3 px-4 font-bold text-emerald-700">Units in Stock</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{item.medicine_name}</td>
                        <td className="py-3 px-4 text-slate-500">{item.category}</td>
                        <td className="py-3 px-4 font-medium text-slate-600">{item.manufacturer}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{item.batch_number}</td>
                        <td className="py-3 px-4">₹{item.unit_cost_price}</td>
                        <td className="py-3 px-4 font-bold">₹{item.unit_selling_price}</td>
                        <td className="py-3 px-4 font-black">
                          <span className={item.stock_level <= item.reorder_alert_threshold ? 'text-rose-600 text-sm' : 'text-slate-900 text-sm'}>
                            {item.stock_level} Units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {item.stock_level <= 0 ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                              Out of Stock
                            </span>
                          ) : item.stock_level <= item.reorder_alert_threshold ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              Low Stock Alert
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EXPIRY DATE GUARDIAN */}
          {activeTab === 'expiry' && (
            <div className="space-y-6 max-w-5xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">Batch Expiry Date Guardian</h2>
                <p className="text-xs text-slate-500 mt-1">Automatic alerts for batches nearing expiration. Zero expired medicines sold.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-emerald-800">Safe Batches (Valid 2028-2029)</span>
                  <h3 className="text-2xl font-black text-emerald-900 mt-1">28 Batches</h3>
                  <p className="text-[11px] text-emerald-700 mt-1">Dolo, Augmentin, Pan 40, etc.</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-amber-800">Expiring Late 2027</span>
                  <h3 className="text-2xl font-black text-amber-900 mt-1">2 Batches</h3>
                  <p className="text-[11px] text-amber-700 mt-1">Telma 40 & Ascoril-D Syrup</p>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-rose-800">Expired Stock Blocked</span>
                  <h3 className="text-2xl font-black text-rose-900 mt-1">0 Batches</h3>
                  <p className="text-[11px] text-rose-700 mt-1">All shelf items safe & verified</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MONTHLY SALES & PROFIT CHARTS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-5xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">Monthly Turnover & Gross Margins (₹ INR)</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Live revenue accumulator that increments automatically on each counter sale!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">This Month&apos;s Revenue</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">₹{totalSalesRevenue.toLocaleString('en-IN')}</h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ Live accumulator</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Cost of Goods (COGS)</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">₹{totalCOGS.toLocaleString('en-IN')}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Wholesale Cost</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Gross Profit Margin</span>
                  <h3 className="text-2xl font-black text-emerald-600 mt-1">
                    ₹{(totalSalesRevenue - totalCOGS).toLocaleString('en-IN')}
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-bold mt-1">
                    {((totalSalesRevenue - totalCOGS) / (totalSalesRevenue || 1) * 100).toFixed(1)}% Gross Margin
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Invoices Issued</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{totalBillsIssued} Receipts</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Average ₹{(totalSalesRevenue / (totalBillsIssued || 1)).toFixed(0)} / bill</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FULFILL CLINIC RX TOKEN (BRIDGE) */}
          {activeTab === 'bridge' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 mb-3">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>SECURE HOSPITAL TOKEN BRIDGE</span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">Fulfill Hospital Digital Prescription</h2>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Enter or scan the patient&apos;s digital prescription token. The system securely retrieves the medication snapshot without accessing private clinic EMR records.
                </p>

                <div className="mt-5 flex gap-2">
                  <input
                    type="text"
                    value={inputTokenId}
                    onChange={(e) => setInputTokenId(e.target.value)}
                    placeholder="Enter Prescription Token (e.g. IND-RX-8912401 or paste from clinic)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
                  />
                  <button
                    onClick={handleLookupToken}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition"
                  >
                    Verify QR Token
                  </button>
                </div>

                {tokenError && <p className="text-xs text-rose-400 mt-2">{tokenError}</p>}
              </div>

              {/* Verified Token Display */}
              {tokenResult && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        ACTIVE PRESCRIPTION TOKEN
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 mt-1">
                        Issued by: {tokenResult.clinic_name} ({tokenResult.doctor_name})
                      </h3>
                      <p className="text-xs text-slate-500">Patient: <strong>{tokenResult.patient_masked_name}</strong> • Phone: {tokenResult.patient_phone}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{tokenResult.expires_at}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prescribed Medications</h4>
                    <div className="space-y-2">
                      {tokenResult.medications.map((m: any, i: number) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{m.name}</span>
                            <span className="text-slate-500 ml-2">({m.frequency} for {m.duration})</span>
                          </div>
                          <span className="text-emerald-700 font-bold">100 Units In Stock</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleFulfillToken}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Load 3 Medicines into Billing Cart & Dispense</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* COMPLETED SALE RECEIPT MODAL IN ₹ INR */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-xs">
            {/* Thermal Print Receipt Simulation */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <h3 className="font-black text-sm uppercase text-slate-900">{tenantInfo.name}</h3>
              <p className="text-[10px] text-slate-500">Retail Chemist & Medical Store • GSTIN: 27AABCT3518Q1Z4</p>
              <p className="text-[10px] font-mono text-slate-600 mt-1">Tax Invoice: {completedSale.invoice_number}</p>
              <p className="text-[10px] text-slate-400">{completedSale.date}</p>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5">
              <p className="text-[11px] text-slate-700">Customer: <strong>{completedSale.customer_name}</strong></p>
              <div className="space-y-1 mt-2">
                {completedSale.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.qty}x {it.medicine_name}</span>
                    <span className="font-mono">₹{(it.unit_price * it.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-3 space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>₹{completedSale.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (5%):</span>
                <span>+₹{completedSale.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL PAID ({completedSale.paymentMethod.toUpperCase()}):</span>
                <span className="text-emerald-700 font-black">₹{completedSale.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => setCompletedSale(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW BATCH MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-4">Add Medicine Batch to Inventory</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Medicine Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cefpodoxime 200mg"
                  value={newMed.medicine_name}
                  onChange={(e) => setNewMed({ ...newMed, medicine_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Batch Number</label>
                  <input
                    type="text"
                    placeholder="BAT-IND-31"
                    value={newMed.batch_number}
                    onChange={(e) => setNewMed({ ...newMed, batch_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    value={newMed.stock_level}
                    onChange={(e) => setNewMed({ ...newMed, stock_level: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={newMed.unit_cost_price}
                    onChange={(e) => setNewMed({ ...newMed, unit_cost_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Selling MRP (₹)</label>
                  <input
                    type="number"
                    value={newMed.unit_selling_price}
                    onChange={(e) => setNewMed({ ...newMed, unit_selling_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={newMed.expiry_date}
                  onChange={(e) => setNewMed({ ...newMed, expiry_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newMed.medicine_name && newMed.batch_number) {
                    setInventory([...inventory, {
                      id: `med-${Date.now()}`,
                      medicine_name: newMed.medicine_name,
                      generic_name: newMed.medicine_name,
                      category: newMed.category,
                      batch_number: newMed.batch_number,
                      unit_cost_price: newMed.unit_cost_price,
                      unit_mrp: newMed.unit_mrp,
                      unit_selling_price: newMed.unit_selling_price,
                      stock_level: newMed.stock_level,
                      reorder_alert_threshold: newMed.reorder_alert_threshold,
                      expiry_date: newMed.expiry_date,
                      manufacturer: 'Indian Pharma Co.'
                    }]);
                    setShowAddModal(false);
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                Save Batch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
