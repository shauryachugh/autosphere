import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Wrench, Calendar, Clock, MapPin, CheckCircle, Shield } from 'lucide-react';
import { Button } from '../common/Button';

export const BookServiceModal: React.FC = () => {
  const { 
    isBookServiceOpen, 
    closeBookService, 
    activeVehicle, 
    vehicles, 
    bookService, 
    showToast 
  } = useApp();

  const [vehicleId, setVehicleId] = useState(activeVehicle.id);
  const [serviceType, setServiceType] = useState<'Periodic Maintenance' | 'Brake Pad Replacement' | 'Diagnostics & OBD Check' | 'Full Detailing' | 'Battery Health Check'>('Periodic Maintenance');
  const [centerName, setCenterName] = useState('Sireesh Auto Mahindra Authorized, Singasandra');
  const [date, setDate] = useState('2026-11-28');
  const [timeSlot, setTimeSlot] = useState('09:30 AM');
  const [pickupDrop, setPickupDrop] = useState(true);
  const [contactName, setContactName] = useState('Shaurya Sharma');

  if (!isBookServiceOpen) return null;

  const estimatedPrices: Record<string, number> = {
    'Periodic Maintenance': 14500,
    'Brake Pad Replacement': 4800,
    'Diagnostics & OBD Check': 1200,
    'Full Detailing': 6500,
    'Battery Health Check': 850,
  };

  const serviceCenters = [
    'Sireesh Auto Mahindra Authorized, Singasandra (Bengaluru)',
    'Kropex Tata Motors Authorized Service, Hosur Road (Bengaluru)',
    'Hyundai Motor Plaza Main Workshop, Guindy (Chennai)',
    'Bosch Car Multi-Brand Super Service Hub, Whitefield',
    '3M Car Care Center & Ceramic Studio, Indiranagar',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookService({
      vehicleId,
      centerName,
      serviceType,
      preferredDate: date,
      preferredTimeSlot: timeSlot,
      estimatedCostINR: estimatedPrices[serviceType] || 5000,
      contactPerson: contactName,
      pickupDropRequired: pickupDrop,
    });
    closeBookService();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <Wrench className="w-4 h-4" />
              </span>
              Schedule Authorized Service
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Book OEM-certified periodic maintenance or diagnostics with transparent upfront estimates
            </p>
          </div>
          <button
            onClick={closeBookService}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Vehicle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Vehicle
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} - {v.regNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Service Package
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {([
                'Periodic Maintenance',
                'Brake Pad Replacement',
                'Diagnostics & OBD Check',
                'Full Detailing',
                'Battery Health Check',
              ] as const).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setServiceType(type)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    serviceType === type
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                      : 'bg-dark-850 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-medium">{type}</span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    ₹{estimatedPrices[type].toLocaleString('en-IN')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Service Center */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Authorized Service Workshop
            </label>
            <select
              value={centerName}
              onChange={(e) => setCenterName(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {serviceCenters.map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Preferred Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Preferred Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="09:00 AM">09:00 AM (Early Drop-off)</option>
                <option value="11:30 AM">11:30 AM (Mid-day Slot)</option>
                <option value="02:30 PM">02:30 PM (Afternoon Express)</option>
                <option value="04:30 PM">04:30 PM (Evening Inspection)</option>
              </select>
            </div>
          </div>

          {/* Doorstep Pickup Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-850 border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-white">Complimentary Valet Pick & Drop</p>
              <p className="text-[11px] text-slate-400">Driver assigned with live GPS tracking on service day</p>
            </div>
            <button
              type="button"
              onClick={() => setPickupDrop(!pickupDrop)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                pickupDrop ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-dark-950 transition-transform ${
                  pickupDrop ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Pricing Summary */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between">
            <span className="text-xs text-cyan-300 font-medium flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              Guaranteed OEM Parts & Fixed Estimate
            </span>
            <span className="text-sm font-bold text-white font-mono">
              ₹{estimatedPrices[serviceType].toLocaleString('en-IN')}
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={closeBookService}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Service Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
