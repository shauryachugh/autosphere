import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Car, 
  Fuel, 
  Coins, 
  Gauge, 
  Shield, 
  Wrench, 
  Sparkles, 
  ArrowRight, 
  Check, 
  RefreshCw,
  Calculator,
  Info
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { NumberPlate } from '../common/NumberPlate';
import { formatINR, formatKm } from '../../utils/formatters';
import { CurrentVehicleAnalysis } from '../../types/replacement.types';
import { FuelType, TransmissionType, BodyType, Vehicle } from '../../types';
import { calculateCurrentCarTCO } from '../../utils/tcoCalculator';

interface CurrentVehicleStepProps {
  initialData: CurrentVehicleAnalysis;
  onNext: (data: CurrentVehicleAnalysis) => void;
}

export const CurrentVehicleStep: React.FC<CurrentVehicleStepProps> = ({
  initialData,
  onNext,
}) => {
  const { vehicles, activeVehicle, activeVehicleExpenses } = useApp();

  const [formData, setFormData] = useState<CurrentVehicleAnalysis>(initialData);

  // Auto-fill from selected garage vehicle
  const handleSelectGarageVehicle = (v: Vehicle) => {
    // Derive monthly fuel from activeVehicleExpenses
    const fuelExpenses = activeVehicleExpenses.filter(
      (e) => e.vehicleId === v.id && (e.category === 'fuel' || e.category === 'charging')
    );
    const totalFuelLogged = fuelExpenses.reduce((sum, e) => sum + e.amountINR, 0);
    const estimatedMonthlyFuel = fuelExpenses.length > 0 
      ? Math.round(totalFuelLogged / Math.max(1, Math.min(6, fuelExpenses.length)))
      : v.fuelType === 'electric' ? 1800 : v.fuelType === 'diesel' ? 8200 : 9500;

    const serviceExpenses = activeVehicleExpenses.filter(
      (e) => e.vehicleId === v.id && e.category === 'service'
    );
    const totalServiceLogged = serviceExpenses.reduce((sum, e) => sum + e.amountINR, 0);
    const estimatedAnnualMaint = serviceExpenses.length > 0
      ? totalServiceLogged
      : v.fuelType === 'electric' ? 7500 : 14500;

    // Resale value estimation rule of thumb
    const ageYears = Math.max(1, 2026 - (v.manufacturingYear || v.year || 2023));
    const originalPrice = v.purchasePriceINR || 2200000;
    const depFactor = Math.pow(0.88, ageYears);
    const estimatedResale = Math.round(originalPrice * depFactor);

    setFormData({
      vehicleId: v.id,
      make: v.make,
      model: v.model,
      variant: v.variant,
      manufacturingYear: v.manufacturingYear || v.year,
      fuelType: v.fuelType,
      transmission: v.transmission,
      bodyType: v.bodyType,
      currentOdometer: v.odoKm,
      monthlyKmDriven: 1250,
      monthlyFuelExpenditure: estimatedMonthlyFuel,
      annualMaintenanceExpenses: estimatedAnnualMaint,
      annualRepairExpenses: 8000,
      annualInsuranceExpenses: 34000,
      currentEstimatedResaleValue: estimatedResale,
      city: v.city || 'Bengaluru',
      state: v.state || 'Karnataka',
    });
  };

  // Re-calculate live TCO summary for current car
  const liveTCO = calculateCurrentCarTCO(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Garage Car Selector Strip (if user has cars) */}
      {vehicles.length > 0 && (
        <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-4 h-4 text-cyan-400" />
              Select Vehicle from Your Garage
            </span>
            <span className="text-xs text-slate-500">Auto-fills specifications and logged telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {vehicles.map((v) => {
              const isSelected = formData.vehicleId === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectGarageVehicle(v)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-glow-subtle'
                      : 'bg-dark-850 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={v.image}
                    alt={v.model}
                    className="w-12 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">
                      {v.make} {v.model}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{v.regNumber}</p>
                    <span className="text-[10px] font-semibold text-cyan-400 uppercase">
                      {v.fuelType} • {formatKm(v.odoKm)}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-cyan-400 text-dark-950 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Vehicle Core Specifications */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              Current Vehicle Profile & Verification
            </span>
            <Badge variant="neutral" size="xs">
              Step 1 of 4
            </Badge>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Manufacturer</label>
            <input
              type="text"
              required
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="e.g. Mahindra"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Model</label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="e.g. XUV700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Variant</label>
            <input
              type="text"
              value={formData.variant}
              onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="e.g. AX7L AWD"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Manufacturing Year</label>
            <input
              type="number"
              min="2005"
              max="2026"
              required
              value={formData.manufacturingYear}
              onChange={(e) => setFormData({ ...formData, manufacturingYear: parseInt(e.target.value, 10) || 2022 })}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Fuel Type</label>
            <select
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="diesel">Diesel</option>
              <option value="petrol">Petrol</option>
              <option value="electric">Electric (EV)</option>
              <option value="hybrid">Strong Hybrid</option>
              <option value="cng">CNG</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Transmission</label>
            <select
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value as TransmissionType })}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="automatic">Automatic (AT / Torque Converter)</option>
              <option value="manual">Manual (MT)</option>
              <option value="dct">Dual Clutch (DCT / DSG)</option>
              <option value="cvt">CVT (e-CVT)</option>
              <option value="single-speed">Single Speed EV</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Odometer (km)</label>
            <input
              type="number"
              min="0"
              step="500"
              required
              value={formData.currentOdometer}
              onChange={(e) => setFormData({ ...formData, currentOdometer: parseInt(e.target.value, 10) || 0 })}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Registered City & State</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-1/2 bg-dark-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                placeholder="Bengaluru"
              />
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-1/2 bg-dark-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                placeholder="Karnataka"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Operational Costs & Driving Telematics */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              Ownership Running Expenses & Usage Calibrations
            </span>
            <span className="text-xs text-slate-400">All amounts in INR (₹)</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Monthly Distance */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Monthly Driven Kilometres</span>
              <span className="text-cyan-400 font-mono">{formData.monthlyKmDriven.toLocaleString('en-IN')} km/mo</span>
            </div>
            <input
              type="range"
              min="300"
              max="4000"
              step="50"
              value={formData.monthlyKmDriven}
              onChange={(e) => setFormData({ ...formData, monthlyKmDriven: parseInt(e.target.value, 10) || 500 })}
              className="w-full accent-cyan-400 h-1.5 bg-dark-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">Average Indian private car: 1,000 - 1,400 km/mo</p>
          </div>

          {/* Monthly Fuel Spend */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Monthly Fuel / Energy Bill (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">₹</span>
              <input
                type="number"
                min="0"
                step="250"
                required
                value={formData.monthlyFuelExpenditure}
                onChange={(e) => setFormData({ ...formData, monthlyFuelExpenditure: parseFloat(e.target.value) || 0 })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Yields: <strong className="text-cyan-300 font-mono">₹{liveTCO.fuelExpenditurePerKm} / km</strong> running cost
            </p>
          </div>

          {/* Current Fair Resale Value */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Estimated Current Resale Value (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">₹</span>
              <input
                type="number"
                min="50000"
                step="25000"
                required
                value={formData.currentEstimatedResaleValue}
                onChange={(e) => setFormData({ ...formData, currentEstimatedResaleValue: parseFloat(e.target.value) || 100000 })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Used as benchmark for depreciation & trade-in down payment
            </p>
          </div>

          {/* Annual Maintenance */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Annual Scheduled Maintenance (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">₹</span>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.annualMaintenanceExpenses}
                onChange={(e) => setFormData({ ...formData, annualMaintenanceExpenses: parseFloat(e.target.value) || 0 })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Periodic oil changes, filters, wheel alignment</p>
          </div>

          {/* Annual Unscheduled Repairs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Annual Repairs & Parts Wear (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">₹</span>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.annualRepairExpenses}
                onChange={(e) => setFormData({ ...formData, annualRepairExpenses: parseFloat(e.target.value) || 0 })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Brake pads, suspension bushings, battery, AC work</p>
          </div>

          {/* Annual Insurance */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Annual Insurance Premium (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">₹</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.annualInsuranceExpenses}
                onChange={(e) => setFormData({ ...formData, annualInsuranceExpenses: parseFloat(e.target.value) || 0 })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Comprehensive policy renewal premium</p>
          </div>
        </div>
      </Card>

      {/* 4. Live Current Ownership Financial Snapshot */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-cyan-800/40 shadow-glow-subtle grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
            Current Monthly Spend
          </span>
          <span className="text-lg font-bold text-white font-mono">
            {formatINR(liveTCO.monthlyOwnershipExpenditure)}
          </span>
          <span className="text-[10px] text-slate-500 block">Fuel + Maint + Ins / mo</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
            Current Annual Spend
          </span>
          <span className="text-lg font-bold text-cyan-400 font-mono">
            {formatINR(liveTCO.annualOwnershipExpenditure)}
          </span>
          <span className="text-[10px] text-slate-500 block">Operating cash outflow</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
            Fuel Expenditure / KM
          </span>
          <span className="text-lg font-bold text-amber-400 font-mono">
            ₹{liveTCO.fuelExpenditurePerKm}
          </span>
          <span className="text-[10px] text-slate-500 block">Per kilometre driven</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
            5-Year Baseline TCO
          </span>
          <span className="text-lg font-bold text-emerald-400 font-mono">
            {formatINR(liveTCO.fiveYearTotalOwnershipCost)}
          </span>
          <span className="text-[10px] text-slate-500 block">5-Yr Ops + Depreciation</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Data will benchmark replacement vehicles deterministically
        </span>
        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Replacement Requirements
        </Button>
      </div>
    </form>
  );
};
