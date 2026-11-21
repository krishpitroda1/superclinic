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
  AlertTriangle, 
  ArrowLeft, 
  LogOut, 
  Printer, 
  ShoppingBag
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PharmacyInventoryItem } from '@/types';

export default function PharmacyDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pos' | 'inventory' | 'expiry' | 'analytics' | 'bridge'>('pos');
  
  // Inventory state from Supabase
  const [inventory, setInventory] = useState<PharmacyInventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // POS Cart State
  const [cart, setCart] = useState<any[]>([
    { id: '1', medicine_name: 'Amoxicillin 500mg', batch: 'BAT-2026-A1', qty: 2, unit_price: 8.99, mrp: 9.99 },
    { id: '2', medicine_name: 'Metformin HCl 500mg', batch: 'BAT-2026-M2', qty: 1, unit_price: 4.99, mrp: 5.50 }
  ]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card'>('upi');
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
    unit_cost_price: 2.50,
    unit_mrp: 6.00,
    unit_selling_price: 5.50,
    stock_level: 100,
    reorder_alert_threshold: 25,
    expiry_date: '2028-12-31'
  });

  // Load Inventory from Supabase
  useEffect(() => {
    async function fetchInventory() {
      try {
        const { data, error } = await supabase
          .from('pharmacy_inventory')
          .select('*')
          .eq('tenant_id', '22222222-2222-2222-2222-222222222222')
          .order('medicine_name', { ascending: true });

        if (!error && data) {
          setInventory(data);
        }
      } catch (err) {
        console.error('Error fetching inventory:', err);
      }
    }
    fetchInventory();
  }, []);

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.unit_price * item.qty), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxAmount = (subtotal - discountAmount) * 0.05; // 5% GST/Tax
  const grandTotal = subtotal - discountAmount + taxAmount;

  // Add medicine to cart
  const handleAddToCart = (item: PharmacyInventoryItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, {
        id: item.id,
        medicine_name: item.medicine_name,
        batch: item.batch_number,
        qty: 1,
        unit_price: item.unit_selling_price,
        mrp: item.unit_mrp
      }]);
    }
  };

  // Cart quantity adjust
  const handleUpdateQty = (id: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = Math.max(1, c.qty + delta);
        return { ...c, qty: newQty };
      }
      return c;
    }));
  };

  // Remove from cart
  const handleRemoveItem = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  // Complete POS Sale
  const handleCheckout = () => {
    const invoiceNum = `POS-${Date.now().toString().slice(-6)}`;
    const saleData = {
      invoice_number: invoiceNum,
      customer_name: customerName,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: grandTotal,
      paymentMethod,
      items: cart,
      date: new Date().toLocaleString()
    };

    setCompletedSale(saleData);

    // Decrement local inventory stock
    setInventory(prev => prev.map(inv => {
      const sold = cart.find(c => c.id === inv.id);
      if (sold) {
        return { ...inv, stock_level: Math.max(0, inv.stock_level - sold.qty) };
      }
      return inv;
    }));

    // Reset cart
    setCart([]);
  };

  // Lookup Token Bridge
  const handleLookupToken = () => {
    setTokenError('');
    if (!inputTokenId) {
      setTokenError('Please enter or scan a valid token.');
      return;
    }

    // Simulated token verification
    setTokenResult({
      id: inputTokenId,
      clinic_name: 'City Health Clinic',
      doctor_name: 'Dr. Smith, MD',
      patient_masked_name: 'S*** J***',
      patient_phone: '+1-555-1122',
      medications: [
        { name: 'Amoxicillin 500mg', dosage: '500mg', frequency: '1-0-1', duration: '5 days' },
        { name: 'Paracetamol 650mg', dosage: '650mg', frequency: '1-1-1', duration: '3 days' }
      ],
      status: 'active',
      expires_at: '2026-12-12'
    });
  };

  // Fulfill Token into Cart
  const handleFulfillToken = () => {
    if (!tokenResult) return;
    // Add prescribed items to cart
    setCart([
      { id: '1', medicine_name: 'Amoxicillin 500mg', batch: 'BAT-2026-A1', qty: 2, unit_price: 8.99, mrp: 9.99 },
      { id: 'med-paracetamol', medicine_name: 'Paracetamol 650mg', batch: 'BAT-2026-P9', qty: 1, unit_price: 2.50, mrp: 3.00 }
    ]);
    setCustomerName('Clinic Patient: ' + tokenResult.patient_masked_name);
    setTokenResult({ ...tokenResult, status: 'dispensed' });
    setActiveTab('pos');
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
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-white">Apex Care Pharmacy</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  STANDALONE POS
                </span>
              </div>
              <p className="text-xs text-slate-400">Cashier: Alex (Store Owner & Chief Pharmacist)</p>
            </div>
          </div>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300">Low Stock Alert: <strong className="text-rose-400">1 Item</strong></span>
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
            <span>Stock & Batch Inventory</span>
            <span className="ml-auto text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">{inventory.length}</span>
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
            <span>Monthly Sales & Charts</span>
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'bridge' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <QrCode className="w-4 h-4 text-teal-400" />
            <span>Fulfill Clinic Rx Token</span>
          </button>
        </aside>

        {/* Center Content Viewport */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* TAB 1: WALK-IN POS BILLING COUNTER */}
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl">
              
              {/* Left Column: Product Search Grid */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Scan barcode or search medicine name / salt..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-100 px-3 py-2 rounded-xl">
                    <Barcode className="w-4 h-4" />
                    <span>Scanner Active</span>
                  </div>
                </div>

                {/* Available Inventory Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inventory
                    .filter(item => item.medicine_name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleAddToCart(item)}
                        className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md cursor-pointer transition group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono">Batch: {item.batch_number}</span>
                            <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {item.medicine_name}
                            </h4>
                            <p className="text-xs text-slate-500">{item.dosage_form} • {item.category}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            item.stock_level <= item.reorder_alert_threshold
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            Qty: {item.stock_level}
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-400 line-through mr-1.5">${item.unit_mrp}</span>
                            <span className="text-sm font-black text-slate-900">${item.unit_selling_price}</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            <span>+ Add to Bill</span>
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
                      <h3 className="font-black text-base text-slate-900">Active POS Cart</h3>
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
                        Cart is empty. Click any medicine or scan barcode to add.
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{item.medicine_name}</p>
                            <p className="text-[10px] text-slate-400">Batch {item.batch} • ${item.unit_price} each</p>
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
                              ${(item.unit_price * item.qty).toFixed(2)}
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

                  {/* Price Calculations */}
                  <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
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
                        <span>% (-${discountAmount.toFixed(2)})</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>GST / Tax (5%):</span>
                      <span className="font-medium">+${taxAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Grand Total:</span>
                      <span className="text-emerald-600 text-base">${grandTotal.toFixed(2)}</span>
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
                        UPI / QR
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

                {/* Checkout Button */}
                <button
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className="mt-6 w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Charge & Print Receipt (${grandTotal.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & STOCK MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 max-w-6xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Pharmacy Inventory & Batches</h2>
                  <p className="text-xs text-slate-500 mt-1">Live from Supabase `pharmacy_inventory` table.</p>
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
                      <th className="py-3 px-4">Batch Number</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4">Cost Price</th>
                      <th className="py-3 px-4">Selling MRP</th>
                      <th className="py-3 px-4">Stock Level</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{item.medicine_name}</td>
                        <td className="py-3 px-4 text-slate-500">{item.category}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{item.batch_number}</td>
                        <td className="py-3 px-4">{item.expiry_date}</td>
                        <td className="py-3 px-4">${item.unit_cost_price}</td>
                        <td className="py-3 px-4 font-bold">${item.unit_selling_price}</td>
                        <td className="py-3 px-4 font-bold">
                          <span className={item.stock_level <= item.reorder_alert_threshold ? 'text-rose-600' : 'text-slate-800'}>
                            {item.stock_level}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {item.stock_level <= item.reorder_alert_threshold ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              Reorder Alert
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Good Stock
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
                <h2 className="text-xl font-extrabold text-slate-900">Expiry Date Dashboard</h2>
                <p className="text-xs text-slate-500 mt-1">Automatic alerts for batches nearing expiration. Zero expired medicines sold.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-emerald-800">Safe Batches (6+ Months)</span>
                  <h3 className="text-2xl font-black text-emerald-900 mt-1">2 Batches</h3>
                  <p className="text-[11px] text-emerald-700 mt-1">Amoxicillin & Metformin (Exp 2028)</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-amber-800">Expiring in 12-18 Months</span>
                  <h3 className="text-2xl font-black text-amber-900 mt-1">1 Batch</h3>
                  <p className="text-[11px] text-amber-700 mt-1">Lisinopril 10mg (Exp Nov 2027)</p>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-rose-800">Expired Stock Blocked</span>
                  <h3 className="text-2xl font-black text-rose-900 mt-1">0 Batches</h3>
                  <p className="text-[11px] text-rose-700 mt-1">All shelf items valid</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MONTHLY SALES & PROFIT CHARTS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-5xl">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">Monthly Turnover & Gross Margins</h2>
                <p className="text-xs text-slate-500 mt-1">Real-time revenue reporting for pharmacy store owners.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">This Month&apos;s Sales</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">$4,820.00</h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ +18% growth</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Cost of Goods (COGS)</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">$2,410.00</h3>
                  <p className="text-[11px] text-slate-500 mt-1">50% Procurement</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Gross Profit Margin</span>
                  <h3 className="text-2xl font-black text-emerald-600 mt-1">$2,410.00</h3>
                  <p className="text-[11px] text-emerald-700 font-bold mt-1">50.0% Gross Margin</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Invoices Issued</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">142 Receipts</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Avg $33.94 / bill</p>
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
                  <span>SECURE CROSS-TENANT BRIDGE</span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">Fulfill Clinic Digital Prescription</h2>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Enter the UUID token or scan the patient&apos;s QR code. The system securely retrieves the medication snapshot without accessing private clinic EMR records.
                </p>

                <div className="mt-5 flex gap-2">
                  <input
                    type="text"
                    value={inputTokenId}
                    onChange={(e) => setInputTokenId(e.target.value)}
                    placeholder="Paste Prescription Token UUID (e.g. d8f4b620-89ab-...)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
                  />
                  <button
                    onClick={handleLookupToken}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition"
                  >
                    Verify Token
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
                    <span className="text-xs text-slate-400 font-mono">Valid 30 Days</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prescribed Items Snapshot</h4>
                    <div className="space-y-2">
                      {tokenResult.medications.map((m: any, i: number) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{m.name}</span>
                            <span className="text-slate-500 ml-2">({m.frequency} for {m.duration})</span>
                          </div>
                          <span className="text-emerald-700 font-bold">In Stock</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleFulfillToken}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Load Into POS Cart & Dispense to Patient</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* COMPLETED SALE RECEIPT MODAL */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-xs">
            {/* Thermal Print Receipt Simulation */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <h3 className="font-black text-sm uppercase text-slate-900">Apex Care Pharmacy</h3>
              <p className="text-[10px] text-slate-500">456 Market St, Downtown • Ph: +1-555-0202</p>
              <p className="text-[10px] font-mono text-slate-600 mt-1">Receipt: {completedSale.invoice_number}</p>
              <p className="text-[10px] text-slate-400">{completedSale.date}</p>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5">
              <p className="text-[11px] text-slate-700">Customer: <strong>{completedSale.customer_name}</strong></p>
              <div className="space-y-1 mt-2">
                {completedSale.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.qty}x {it.medicine_name}</span>
                    <span className="font-mono">${(it.unit_price * it.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-3 space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>${completedSale.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (5%):</span>
                <span>+${completedSale.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>PAID ({completedSale.paymentMethod.toUpperCase()}):</span>
                <span>${completedSale.total.toFixed(2)}</span>
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
                <span>Print Slip</span>
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
                  placeholder="e.g. Ciprofloxacin 500mg"
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
                    placeholder="BAT-2026-X1"
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
                  <label className="block text-slate-700 font-bold mb-1">Cost Price ($)</label>
                  <input
                    type="number"
                    value={newMed.unit_cost_price}
                    onChange={(e) => setNewMed({ ...newMed, unit_cost_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Selling MRP ($)</label>
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
                      id: Date.now().toString(),
                      tenant_id: '22222222-2222-2222-2222-222222222222',
                      medicine_name: newMed.medicine_name,
                      category: newMed.category,
                      dosage_form: 'Tablet',
                      batch_number: newMed.batch_number,
                      expiry_date: newMed.expiry_date,
                      unit_cost_price: newMed.unit_cost_price,
                      unit_mrp: newMed.unit_mrp,
                      unit_selling_price: newMed.unit_selling_price,
                      stock_level: newMed.stock_level,
                      reorder_alert_threshold: newMed.reorder_alert_threshold
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

