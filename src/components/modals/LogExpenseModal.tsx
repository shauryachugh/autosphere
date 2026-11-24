import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Fuel, Zap, Wrench, Shield, Sparkles, Receipt, IndianRupee, MapPin } from 'lucide-react';
import { Button } from '../common/Button';
import { ExpenseCategory } from '../../types';

export const LogExpenseModal: React.FC = () => {
  const { 
    isLogExpenseOpen, 
    closeLogExpense, 
    activeVehicle, 
    vehicles, 
    addExpense,
    showToast 
  } = useApp();

  const [vehicleId, setVehicleId] = useState(activeVehicle?.id || '');
  const [category, setCategory] = useState<ExpenseCategory>(
    activeVehicle?.fuelType === 'electric' ? 'charging' : 'fuel'
  );
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [odoKm, setOdoKm] = useState(activeVehicle?.odoKm ? activeVehicle.odoKm.toString() : '10000');
  const [vendor, setVendor] = useState('');
  const [units, setUnits] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'FASTag' | 'Net Banking' | 'Cash'>('UPI');
  const [receiptAttached, setReceiptAttached] = useState(false);

  if (!isLogExpenseOpen) return null;

  const categories: { label: string; value: ExpenseCategory; icon: React.ReactNode }[] = [
    { label: 'Fuel', value: 'fuel', icon: <Fuel className="w-4 h-4" /> },
    { label: 'EV Charging', value: 'charging', icon: <Zap className="w-4 h-4" /> },
    { label: 'Service & Repair', value: 'service', icon: <Wrench className="w-4 h-4" /> },
    { label: 'FASTag / Toll', value: 'toll', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Insurance', value: 'insurance', icon: <Shield className="w-4 h-4" /> },
    { label: 'Wash & Detailing', value: 'wash', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Accessories', value: 'accessories', icon: <Receipt className="w-4 h-4" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Please enter a valid amount in INR.', 'error');
      return;
    }

    const targetVehicleId = vehicleId || activeVehicle?.id || vehicles[0]?.id;
    if (!targetVehicleId) {
      showToast('Please register a vehicle in your garage first.', 'warning');
      closeLogExpense();
      return;
    }

    addExpense({
      vehicleId: targetVehicleId,
      category,
      amountINR: parsedAmount,
      date,
      odoKm: parseInt(odoKm, 10) || activeVehicle?.odoKm || 0,
      vendor: vendor.trim() || 'Direct Vendor',
      notes: notes.trim(),
      paymentMethod,
      fuelLitresOrUnits: units ? parseFloat(units) : undefined,
      receiptAttached,
    });

    closeLogExpense();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <IndianRupee className="w-4 h-4" />
              </span>
              Log Vehicle Expense
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Record fuel, tolls, services or maintenance for automated TCO tracking
            </p>
          </div>
          <button
            onClick={closeLogExpense}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Vehicle Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Vehicle
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} ({v.regNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Expense Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    category === cat.value
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,210,255,0.15)]'
                      : 'bg-dark-850 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {cat.icon}
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Amount (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 4850"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Expense Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Odometer & Litres/Units */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Odometer Reading (km)
              </label>
              <input
                type="number"
                value={odoKm}
                onChange={(e) => setOdoKm(e.target.value)}
                placeholder="e.g. 28450"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {(category === 'fuel' || category === 'charging') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {category === 'fuel' ? 'Fuel Litres' : 'Charging kWh Units'}
                </label>
                <input
                  type="number"
                  step="any"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  placeholder={category === 'fuel' ? 'e.g. 52.4' : 'e.g. 36.5'}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            )}
          </div>

          {/* Vendor / Outlet */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Vendor / Service Center / Plaza
            </label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g. IndianOil Swagat, Sireesh Auto Mahindra, FASTag Toll"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['UPI', 'Credit Card', 'FASTag', 'Net Banking', 'Cash'] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    paymentMethod === method
                      ? 'bg-slate-200 text-slate-950 border-slate-200 font-semibold'
                      : 'bg-dark-850 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Notes & Receipt Attachment Simulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Full synthetic engine oil + tyre rotation"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Receipt toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-850 border border-slate-800">
            <span className="text-xs text-slate-300 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-cyan-400" />
              Attach Digital Invoice / UPI Receipt
            </span>
            <button
              type="button"
              onClick={() => {
                setReceiptAttached(!receiptAttached);
                showToast(
                  !receiptAttached
                    ? 'Receipt simulated as scanned and OCR processed.'
                    : 'Receipt removed.',
                  'info'
                );
              }}
              className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                receiptAttached
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-dark-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {receiptAttached ? '✓ Attached' : '+ Attach'}
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={closeLogExpense}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Expense Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
