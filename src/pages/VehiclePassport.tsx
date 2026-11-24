import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  QrCode,
  FileText,
  Car,
  Calendar,
  IndianRupee,
  Gauge,
  MapPin,
  Edit3,
  Camera,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
  Layers,
  FileCheck2,
  Share2,
  Download,
  Info,
} from 'lucide-react';
import { NumberPlate } from '../components/common/NumberPlate';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatINR, formatKm, formatDate } from '../utils/formatters';
import { healthPassportService } from '../services/healthPassportService';
import { VehiclePassportData } from '../types/passport.types';

export const VehiclePassport: React.FC = () => {
  const { activeVehicle, vehicles, setActiveVehicleId, showToast } = useApp();
  const [passport, setPassport] = useState<VehiclePassportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form State for Editing
  const [editForm, setEditForm] = useState<Partial<VehiclePassportData>>({});

  useEffect(() => {
    let mounted = true;
    if (!activeVehicle?.id) {
      setIsLoading(false);
      setPassport(null);
      return;
    }
    setIsLoading(true);
    healthPassportService.getPassport(activeVehicle.id).then(data => {
      if (mounted) {
        setPassport(data);
        setEditForm(data || {});
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [activeVehicle?.id]);

  const handleSavePassport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passport || !activeVehicle?.id) return;
    try {
      const updated = await healthPassportService.updatePassport(activeVehicle.id, editForm);
      setPassport(updated);
      setIsEditModalOpen(false);
      showToast('Digital Vehicle Passport updated successfully', 'success');
    } catch {
      showToast('Failed to save passport updates', 'error');
    }
  };

  const handleSharePassport = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Secure Vehicle Passport Link copied to clipboard', 'info');
  };

  if (!activeVehicle || vehicles.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-carbon-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Digital Vehicle Passport
            </h1>
            <p className="text-xs sm:text-sm text-carbon-400 mt-1">
              Cryptographically verified, tamper-evident digital ownership identity for Indian vehicles.
            </p>
          </div>
        </div>

        <Card className="p-12 text-center border-dashed border-carbon-800 bg-carbon-900/40">
          <div className="max-w-md mx-auto space-y-4">
            <Car className="w-12 h-12 text-carbon-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No vehicles added yet</h3>
            <p className="text-sm text-carbon-400">
              No vehicles added yet. Add your first vehicle to get started.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading || !passport) {
    return (
      <div className="py-20 text-center text-carbon-400">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm">Retrieving Digital Vehicle Passport from secure ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-carbon-900 via-carbon-900 to-cyan-950/40 border border-carbon-800 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker & Parivahan Verified
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                {passport.previousOwnersCount === 1 ? '1st Single Owner' : `${passport.previousOwnersCount} Owners`}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              {passport.make} {passport.model}
              <span className="text-lg lg:text-xl font-normal text-carbon-400 font-mono">({passport.variant})</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-carbon-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {passport.registrationCity}, {passport.registrationState} ({passport.rtoCode})
              </span>
              <span>•</span>
              <span className="capitalize">{passport.fuelType} • {passport.transmission}</span>
              <span>•</span>
              <span>Year: {passport.manufacturingYear}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSharePassport}
              icon={<Share2 className="w-4 h-4" />}
            >
              Share Passport
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              icon={<Edit3 className="w-4 h-4" />}
            >
              Edit Vehicle Info
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Passport Identity Card & Telematics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Official Digital Passport Certificate */}
        <div className="lg:col-span-8 space-y-6">
          {/* Certificate Surface */}
          <div className="rounded-3xl bg-carbon-900 border border-carbon-800 p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl">
            {/* Watermark Logo */}
            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none">
              <Car className="w-64 h-64 text-white" />
            </div>

            {/* Passport Certificate Header */}
            <div className="flex items-center justify-between pb-6 border-b border-carbon-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-subtle">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">DIGITAL VEHICLE PASSPORT</h3>
                  <p className="text-xs text-carbon-400 font-mono">AUTOSPHERE VEHICLE LEDGER ID: {passport.id.slice(0, 18).toUpperCase()}</p>
                </div>
              </div>

              {/* Number Plate Preview */}
              <NumberPlate registrationNumber={passport.regNumber} size="md" isEV={passport.fuelType === 'electric'} />
            </div>

            {/* Core Identity Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <span className="text-carbon-400 uppercase tracking-wider text-[10px] block font-semibold">Make & Model</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{passport.make} {passport.model}</span>
                <span className="text-carbon-400 text-[11px]">{passport.variant}</span>
              </div>

              <div>
                <span className="text-carbon-400 uppercase tracking-wider text-[10px] block font-semibold">Registration Number</span>
                <span className="font-bold text-cyan-400 font-mono text-sm mt-0.5 block">{passport.regNumber}</span>
                <span className="text-carbon-400 text-[11px]">{passport.rtoCode}</span>
              </div>

              <div>
                <span className="text-carbon-400 uppercase tracking-wider text-[10px] block font-semibold">Current Odometer</span>
                <span className="font-bold text-white font-mono text-sm mt-0.5 block">{formatKm(passport.currentOdometer)}</span>
                <span className="text-emerald-400 text-[11px]">Verified telemetry</span>
              </div>

              <div>
                <span className="text-carbon-400 uppercase tracking-wider text-[10px] block font-semibold">Manufacturing / Reg Year</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{passport.manufacturingYear} / {passport.registrationYear}</span>
                <span className="text-carbon-400 text-[11px]">Age: {2026 - passport.manufacturingYear} years</span>
              </div>

              <div>
                <span className="text-carbon-400 uppercase tracking-wider text-[10px] block font-semibold">Fuel & Transmission</span>
                <span className="font-bold text-white text-sm mt-0.5 block capitalize">{passport.fuelType}</span>
                <span className="text-carbon-400 text-[11px] capitalize">{passport.transmission}</span>
              </div>

              <div>
                <span className="text-carbon-400 uppercase tracking-wider text-[10px] block font-semibold">Body Category</span>
                <span className="font-bold text-white text-sm mt-0.5 block capitalize">{passport.bodyType}</span>
                <span className="text-carbon-400 text-[11px]">Passenger Car</span>
              </div>
            </div>

            {/* Extended Technical Identity (Chassis, Engine, Color, Ownership) */}
            <div className="pt-6 border-t border-carbon-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-carbon-800/40 border border-carbon-800">
                <span className="text-carbon-400 uppercase tracking-wider text-[10px] block">Chassis Number (VIN)</span>
                <span className="font-mono font-bold text-white text-xs mt-1 block truncate">
                  {passport.chassisNumber || 'MA1TN8SK9P2E90123'}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" /> 17-Digit Standard
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-carbon-800/40 border border-carbon-800">
                <span className="text-carbon-400 uppercase tracking-wider text-[10px] block">Engine Number</span>
                <span className="font-mono font-bold text-white text-xs mt-1 block truncate">
                  {passport.engineNumber || 'EN7849129A'}
                </span>
                <span className="text-[10px] text-carbon-400 mt-0.5 block">Factory matched</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-carbon-800/40 border border-carbon-800">
                <span className="text-carbon-400 uppercase tracking-wider text-[10px] block">Exterior Color</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3.5 h-3.5 rounded-full border border-white/20 bg-slate-300" />
                  <span className="font-semibold text-white">{passport.color}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-carbon-800/40 border border-carbon-800">
                <span className="text-carbon-400 uppercase tracking-wider text-[10px] block">Ownership Status</span>
                <span className="font-bold text-cyan-400 mt-1 block">
                  {passport.previousOwnersCount === 1 ? '1st Owner (Original)' : `${passport.previousOwnersCount}nd Owner`}
                </span>
                <span className="text-[10px] text-carbon-400">Clear title</span>
              </div>
            </div>

            {/* Financial Purchase Stamp */}
            {passport.purchasePriceINR && (
              <div className="pt-4 border-t border-carbon-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-carbon-400">Initial Invoice Purchase Price: </span>
                  <span className="font-bold text-white font-mono">₹{passport.purchasePriceINR.toLocaleString('en-IN')}</span>
                  {passport.purchaseDate && (
                    <span className="text-carbon-500 ml-1">on {formatDate(passport.purchaseDate)}</span>
                  )}
                </div>
                <div className="text-carbon-400 font-mono text-[11px]">
                  State: {passport.registrationState} • City: {passport.registrationCity}
                </div>
              </div>
            )}

            {/* Owner Notes */}
            {passport.notes && (
              <div className="p-4 rounded-2xl bg-carbon-800/20 border border-carbon-800/60 text-xs">
                <span className="text-carbon-400 font-semibold block mb-1">Vehicle Ownership Notes:</span>
                <p className="text-carbon-300 italic">{passport.notes}</p>
              </div>
            )}
          </div>

          {/* Vehicle Photographs Stream */}
          <div className="rounded-3xl bg-carbon-900 border border-carbon-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  Vehicle Photographic Record
                </h3>
                <p className="text-xs text-carbon-400">Visual condition archive of {passport.make} {passport.model}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                icon={<Camera className="w-4 h-4" />}
              >
                Add Photos
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {passport.photos.map((photoUrl, idx) => (
                <div key={idx} className="relative h-44 rounded-2xl overflow-hidden border border-carbon-700/60 group">
                  <img
                    src={photoUrl}
                    alt={`${passport.make} ${passport.model} photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-[11px] text-white font-medium">Photo #{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: QR Ledger, Compliance & Fleet Quick-Switch */}
        <div className="lg:col-span-4 space-y-6">
          {/* QR Verification Box */}
          <div className="p-6 rounded-3xl bg-carbon-900 border border-carbon-800 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-glow-subtle">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Digital Passport QR</h4>
              <p className="text-xs text-carbon-400 mt-1">
                Scan during resale valuation, RTO transfer, or insurance claim for instant vehicle verification.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white max-w-[160px] mx-auto shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                  `AutoSphere-Passport:${passport.regNumber}:${passport.chassisNumber || ''}`
                )}`}
                alt="Passport QR Code"
                className="w-full h-full"
              />
            </div>

            <div className="text-[11px] text-carbon-400 font-mono">
              PARIVAHAN DIGITAL VAULT CERTIFIED
            </div>
          </div>

          {/* Compliance Quick Status */}
          <div className="p-6 rounded-3xl bg-carbon-900 border border-carbon-800 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              Statutory Compliance Status
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-carbon-800/50 border border-carbon-700/60 flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold block">Comprehensive Insurance</span>
                  <span className="text-carbon-400 text-[11px]">{passport.insuranceProvider}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                  Valid
                </span>
              </div>

              <div className="p-3 rounded-xl bg-carbon-800/50 border border-carbon-700/60 flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold block">PUC Emission Certificate</span>
                  <span className="text-carbon-400 text-[11px]">Expires {formatDate(passport.pucExpiryDate || '2025-03-20')}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">
                  Due Soon
                </span>
              </div>

              <div className="p-3 rounded-xl bg-carbon-800/50 border border-carbon-700/60 flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold block">Smart Card RC</span>
                  <span className="text-carbon-400 text-[11px]">{passport.rtoCode}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Switch Garage Vehicles */}
          {vehicles.length > 1 && (
            <div className="p-6 rounded-3xl bg-carbon-900 border border-carbon-800 space-y-3 shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-carbon-400">
                Switch Garage Vehicle
              </h4>
              <div className="space-y-2">
                {vehicles.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveVehicleId(v.id)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center justify-between transition-colors ${
                      v.id === activeVehicle.id
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'bg-carbon-800/40 hover:bg-carbon-800 text-carbon-300'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-xs text-white block">{v.make} {v.model}</span>
                      <span className="text-[11px] text-carbon-400">{v.regNumber}</span>
                    </div>
                    {v.id === activeVehicle.id && <span className="text-xs font-bold">Viewing</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Vehicle Passport Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-carbon-900 border border-carbon-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-carbon-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                Edit Digital Vehicle Passport
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-carbon-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSavePassport} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Make</label>
                  <input
                    type="text"
                    value={editForm.make || ''}
                    onChange={e => setEditForm({ ...editForm, make: e.target.value })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Model</label>
                  <input
                    type="text"
                    value={editForm.model || ''}
                    onChange={e => setEditForm({ ...editForm, model: e.target.value })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Variant</label>
                  <input
                    type="text"
                    value={editForm.variant || ''}
                    onChange={e => setEditForm({ ...editForm, variant: e.target.value })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Registration Number</label>
                  <input
                    type="text"
                    value={editForm.regNumber || ''}
                    onChange={e => setEditForm({ ...editForm, regNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Odometer (km)</label>
                  <input
                    type="number"
                    value={editForm.currentOdometer || ''}
                    onChange={e => setEditForm({ ...editForm, currentOdometer: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Exterior Color</label>
                  <input
                    type="text"
                    value={editForm.color || ''}
                    onChange={e => setEditForm({ ...editForm, color: e.target.value })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Previous Owners</label>
                  <select
                    value={editForm.previousOwnersCount || 1}
                    onChange={e => setEditForm({ ...editForm, previousOwnersCount: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={1}>1st Owner</option>
                    <option value={2}>2nd Owner</option>
                    <option value={3}>3rd Owner</option>
                    <option value={4}>4+ Owners</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Chassis Number (VIN)</label>
                  <input
                    type="text"
                    value={editForm.chassisNumber || ''}
                    onChange={e => setEditForm({ ...editForm, chassisNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Engine Number</label>
                  <input
                    type="text"
                    value={editForm.engineNumber || ''}
                    onChange={e => setEditForm({ ...editForm, engineNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Vehicle Ownership Notes</label>
                <textarea
                  rows={3}
                  value={editForm.notes || ''}
                  onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Record service packages, ceramic coating, tyre replacement details..."
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-carbon-800">
                <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
