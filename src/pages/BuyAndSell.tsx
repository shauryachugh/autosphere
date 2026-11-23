import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CarFront, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  MapPin, 
  Fuel, 
  Gauge, 
  CheckCircle2, 
  Calendar, 
  Filter, 
  DollarSign, 
  ArrowRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { NumberPlate } from '../components/common/NumberPlate';
import { formatINR, formatKm, formatDate } from '../utils/formatters';
import { marketplaceCars } from '../data/mockData';
import { MarketplaceCar } from '../types';

export const BuyAndSell: React.FC = () => {
  const { openValuation, showToast, activeVehicle } = useApp();

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [certifiedOnly, setCertifiedOnly] = useState<boolean>(true);
  const [activeCarModal, setActiveCarModal] = useState<MarketplaceCar | null>(null);

  // Filter listings
  const filteredCars = marketplaceCars.filter((car) => {
    if (selectedCity !== 'all' && car.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (selectedFuel !== 'all' && car.fuelType !== selectedFuel) return false;
    if (certifiedOnly && !car.certified) return false;
    return true;
  });

  const handleBookTestDrive = (car: MarketplaceCar) => {
    showToast(`Home doorstep test drive scheduled for ${car.make} ${car.model}!`, 'success');
    setActiveCarModal(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Buy & Sell Verified Cars
            </h1>
            <Badge variant="electric" size="sm">
              TruePrice™ Verified
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            200-point inspected pre-owned cars and instant algorithmic car valuation engine across Indian metros
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={openValuation}
            variant="primary"
            size="sm"
            icon={<TrendingUp className="w-4 h-4" />}
          >
            Value & Sell My Car
          </Button>
        </div>
      </div>

      {/* Hero Sell Car Callout Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-cyan-500/30 shadow-glow-subtle flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Instant AI Car Valuation & Direct Cash Buyout
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Planning to sell your {activeVehicle.make} {activeVehicle.model}?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Get an instant transparent price quote based on real RTO transaction data in {activeVehicle.city}. Enjoy zero spam calls, same-day RC transfer escrow, and doorstep payment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Button
            onClick={openValuation}
            variant="primary"
            size="md"
            icon={<TrendingUp className="w-4 h-4" />}
          >
            Calculate Car Valuation
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          {/* City */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-dark-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Cities (India)</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Gurugram">Delhi NCR / Gurugram</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>

          {/* Fuel */}
          <div>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="bg-dark-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Powertrains</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric (EV)</option>
            </select>
          </div>

          {/* Certified toggle */}
          <button
            onClick={() => setCertifiedOnly(!certifiedOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              certifiedOnly
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                : 'bg-dark-800 border-slate-700 text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AutoSphere Certified Only</span>
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredCars.length} inspected cars with clean title
        </span>
      </div>

      {/* Pre-Owned Verified Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="rounded-2xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden shadow-card flex flex-col justify-between"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative aspect-[16/9] max-h-56 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.model}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge variant="success" size="xs">
                    {car.inspectionScore}/100 Inspected
                  </Badge>
                  <Badge variant="electric" size="xs">
                    {car.warrantyMonths}m Warranty
                  </Badge>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-xs text-slate-300">{car.variant} ({car.year})</p>
                  </div>
                  <span className="text-xs text-slate-300 flex items-center gap-1 bg-dark-900/90 px-2 py-1 rounded-md border border-slate-700">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {car.city}
                  </span>
                </div>
              </div>

              {/* Specs & Pricing Details */}
              <div className="p-5 space-y-4">
                {/* Price Header */}
                <div className="flex items-baseline justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400">AutoSphere TruePrice™</span>
                    <div className="text-2xl font-extrabold text-white font-mono">
                      {formatINR(car.fairMarketPriceINR)}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 line-through font-mono">
                      {formatINR(car.originalPriceINR)}
                    </span>
                    <span className="block text-[11px] text-emerald-400 font-semibold">
                      Fair Market Certified
                    </span>
                  </div>
                </div>

                {/* Quick specs grid */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 bg-dark-850 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Driven</span>
                    <span className="font-semibold text-white font-mono">{formatKm(car.odoKm)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Fuel</span>
                    <span className="font-semibold text-white uppercase">{car.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Owner</span>
                    <span className="font-semibold text-white">{car.ownersCount}st Owner</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Plate</span>
                    <span className="font-mono text-[11px] text-slate-300">{car.regNumberMasked}</span>
                  </div>
                </div>

                {/* Key Features Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {car.features.map((f, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-dark-800 text-slate-300 border border-slate-700/60"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-5 pt-0 flex items-center justify-between gap-3">
              <Button
                onClick={() => setActiveCarModal(car)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                View 200-Pt Inspection Report
              </Button>
              <Button
                onClick={() => handleBookTestDrive(car)}
                variant="primary"
                size="sm"
                className="w-full"
              >
                Book Home Test Drive
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 200-Pt Inspection Details Modal */}
      {activeCarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-dark-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  AutoSphere 200-Point Inspection Certificate
                </h3>
                <p className="text-xs text-slate-400">
                  {activeCarModal.make} {activeCarModal.model} ({activeCarModal.regNumberMasked}) • Score: {activeCarModal.inspectionScore}/100
                </p>
              </div>
              <button
                onClick={() => setActiveCarModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Accident Record</span>
                  <span className="font-bold text-emerald-400 mt-1 block">100% Non-Accidental</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Flood History</span>
                  <span className="font-bold text-emerald-400 mt-1 block">Flood-Free Certified</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Odometer Verification</span>
                  <span className="font-bold text-emerald-400 mt-1 block">Genuine Tamper-Free</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Insurance</span>
                  <span className="font-bold text-cyan-400 mt-1 block">{activeCarModal.insuranceType}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <h4 className="font-bold text-white">Inspected Mechanical Systems</h4>
                <div className="space-y-1.5">
                  {[
                    { sys: 'Engine Compression & Turbocharger', status: 'Passed (A+ Grade)' },
                    { sys: 'Transmission Clutch / Torque Converter slip', status: 'Passed (Smooth Shifting)' },
                    { sys: 'Suspension & Bushings (Indian pothole durability)', status: 'Passed (Zero Leakage)' },
                    { sys: 'Electrical, ECU & ADAS Sensors', status: 'Passed (Zero Stored DTCs)' },
                    { sys: 'Tyre Tread Depth (Minimum 5.2mm remaining)', status: 'Passed (80% Life Left)' },
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-dark-850 border border-slate-800">
                      <span className="text-slate-300">{s.sys}</span>
                      <span className="text-emerald-400 font-semibold">{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-slate-800 bg-dark-950/60">
              <Button onClick={() => setActiveCarModal(null)} variant="ghost">
                Close
              </Button>
              <Button onClick={() => handleBookTestDrive(activeCarModal)} variant="primary">
                Book Free Doorstep Test Drive
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
