import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Fuel, 
  Zap, 
  ShieldCheck, 
  SlidersHorizontal, 
  ArrowRight, 
  Check, 
  X, 
  IndianRupee, 
  Layers,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatINR, formatLakhsCrores } from '../utils/formatters';
import { replacementCars } from '../data/mockData';
import { ReplacementCar, FuelType } from '../types';

export const Recommendations: React.FC = () => {
  const { activeVehicle } = useApp();

  // Filters & Driving Habit Simulator
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [selectedBody, setSelectedBody] = useState<string>('all');
  const [monthlyKm, setMonthlyKm] = useState<number>(1200);
  const [cityHighwayRatio, setCityHighwayRatio] = useState<number>(70); // 70% city, 30% highway
  const [comparedCar, setComparedCar] = useState<ReplacementCar | null>(null);

  // Filtered cars
  const filteredCars = replacementCars.filter((car) => {
    if (selectedFuel !== 'all' && car.fuelType !== selectedFuel) return false;
    if (selectedBody !== 'all' && car.bodyType !== selectedBody) return false;
    return true;
  });

  // Calculate dynamic savings based on user driving habits
  const calculateDynamicAnnualSavings = (car: ReplacementCar) => {
    // Current car per-km cost (Diesel approx ₹6.8/km, EV ₹1.4/km, Hybrid ₹4.2/km, Petrol ₹8.4/km)
    const currentCostPerKm = activeVehicle.fuelType === 'diesel' ? 6.8 : activeVehicle.fuelType === 'petrol' ? 8.4 : 1.4;
    const targetCostPerKm = car.fuelType === 'electric' ? 1.4 : car.fuelType === 'hybrid' ? 4.2 : 6.8;
    const annualKm = monthlyKm * 12;
    const savings = Math.max(0, Math.round((currentCostPerKm - targetCostPerKm) * annualKm));
    return savings;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart Car Upgrade Intelligence
          </h1>
          <Badge variant="electric" size="sm">
            AI TCO Match
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Algorithmic replacement analysis benchmarked against your current {activeVehicle.make} {activeVehicle.model} ({activeVehicle.regNumber})
        </p>
      </div>

      {/* Interactive Driving Habit Simulator */}
      <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-white">
              Personalized TCO Driving Habit Simulator
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Real-time Indian fuel & electricity tariff adjustments
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Monthly Driven Distance Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Monthly Commute Distance:</span>
              <span className="text-cyan-400 font-mono font-bold text-sm">
                {monthlyKm.toLocaleString('en-IN')} km / month
              </span>
            </div>
            <input
              type="range"
              min="400"
              max="3500"
              step="50"
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-dark-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>400 km (Weekend only)</span>
              <span>1,200 km (Standard India)</span>
              <span>3,500 km (Heavy highway)</span>
            </div>
          </div>

          {/* City vs Highway Driving Ratio */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Traffic Condition Mix:</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                {cityHighwayRatio}% City / {100 - cityHighwayRatio}% Highway
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={cityHighwayRatio}
              onChange={(e) => setCityHighwayRatio(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-dark-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>Highway Tourer</span>
              <span>Mixed Indian Metro</span>
              <span>Heavy Bangalore Bumper-to-Bumper</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-dark-900 p-1 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 px-2 font-medium">Fuel:</span>
          {[
            { label: 'All Tech', value: 'all' },
            { label: 'Electric (EV)', value: 'electric' },
            { label: 'Strong Hybrid', value: 'hybrid' },
            { label: 'Diesel', value: 'diesel' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setSelectedFuel(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFuel === f.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Found {filteredCars.length} algorithmically qualified cars</span>
        </div>
      </div>

      {/* Recommended Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCars.map((car) => {
          const dynamicSavings = calculateDynamicAnnualSavings(car);

          return (
            <div
              key={car.id}
              className="rounded-2xl bg-dark-900 border border-slate-800/90 hover:border-slate-700 transition-all duration-200 overflow-hidden shadow-card flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="relative aspect-[16/9] max-h-56 overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.model}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="electric" size="sm">
                      {car.upgradeScore}/100 Match Score
                    </Badge>
                    <Badge variant={car.fuelType === 'electric' ? 'success' : car.fuelType === 'hybrid' ? 'info' : 'neutral'} size="sm">
                      {car.fuelType.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-xs text-slate-300">{car.variant}</p>
                    </div>
                    <span className="text-xs bg-dark-900/90 text-emerald-300 px-2 py-1 rounded-md border border-emerald-500/30 font-medium">
                      {car.safetyRating}
                    </span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5 space-y-4">
                  {/* Financial Highlights */}
                  <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Ex-Showroom Price</span>
                      <span className="text-base font-bold text-white font-mono">
                        {formatINR(car.priceExShowroomINR)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-emerald-400 block font-semibold">
                        Estimated Annual Savings
                      </span>
                      <span className="text-base font-bold text-emerald-400 font-mono">
                        ~{formatINR(dynamicSavings)} / yr
                      </span>
                    </div>
                  </div>

                  {/* Why recommended in India */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Why Recommended
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {car.whyRecommended}
                    </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="flex flex-wrap gap-1.5">
                    {car.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-dark-800 text-slate-300 border border-slate-700/60"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>

                  {/* Specs Quick Strip */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Power</span>
                      <span className="font-semibold text-white">{car.powerBhp} BHP</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Torque</span>
                      <span className="font-semibold text-white">{car.torqueNm} Nm</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Efficiency</span>
                      <span className="font-semibold text-cyan-300">{car.araiEfficiency}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 flex items-center justify-between gap-3">
                <Button
                  onClick={() => setComparedCar(car)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  icon={<Layers className="w-4 h-4 text-cyan-400" />}
                >
                  Compare with My {activeVehicle.model}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Modal */}
      {comparedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-dark-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Side-by-Side Automotive Benchmarking
                </h3>
                <p className="text-xs text-slate-400">
                  {activeVehicle.make} {activeVehicle.model} vs {comparedCar.make} {comparedCar.model}
                </p>
              </div>
              <button
                onClick={() => setComparedCar(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-xl bg-dark-850 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                    Current Vehicle
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                    {activeVehicle.make} {activeVehicle.model}
                  </h4>
                  <p className="text-xs text-slate-400">{activeVehicle.variant}</p>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
                  <span className="text-[11px] text-cyan-400 uppercase font-bold tracking-wider">
                    Target Upgrade ({comparedCar.upgradeScore}/100 Match)
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                    {comparedCar.make} {comparedCar.model}
                  </h4>
                  <p className="text-xs text-slate-300">{comparedCar.variant}</p>
                </div>
              </div>

              {/* Comparison Metric Rows */}
              <div className="divide-y divide-slate-800 text-xs">
                <div className="py-2.5 grid grid-cols-3 items-center">
                  <span className="text-slate-400">Fuel & Powertrain</span>
                  <span className="text-center font-medium text-white">{activeVehicle.fuelType.toUpperCase()}</span>
                  <span className="text-center font-bold text-cyan-400">{comparedCar.fuelType.toUpperCase()}</span>
                </div>

                <div className="py-2.5 grid grid-cols-3 items-center">
                  <span className="text-slate-400">Real Efficiency</span>
                  <span className="text-center font-medium text-white">{activeVehicle.avgEfficiency}</span>
                  <span className="text-center font-bold text-emerald-400">{comparedCar.araiEfficiency}</span>
                </div>

                <div className="py-2.5 grid grid-cols-3 items-center">
                  <span className="text-slate-400">Power Output</span>
                  <span className="text-center font-medium text-white">{activeVehicle.powerBhp} BHP</span>
                  <span className="text-center font-bold text-white">{comparedCar.powerBhp} BHP</span>
                </div>

                <div className="py-2.5 grid grid-cols-3 items-center">
                  <span className="text-slate-400">Torque</span>
                  <span className="text-center font-medium text-white">{activeVehicle.torqueNm} Nm</span>
                  <span className="text-center font-bold text-white">{comparedCar.torqueNm} Nm</span>
                </div>

                <div className="py-2.5 grid grid-cols-3 items-center">
                  <span className="text-slate-400">Safety Rating</span>
                  <span className="text-center font-medium text-white">5 Star Global NCAP</span>
                  <span className="text-center font-bold text-emerald-400">{comparedCar.safetyRating}</span>
                </div>

                <div className="py-2.5 grid grid-cols-3 items-center bg-cyan-950/20 rounded-lg p-2">
                  <span className="text-cyan-300 font-bold">5-Year Projected Savings</span>
                  <span className="text-center text-slate-500 font-mono">-</span>
                  <span className="text-center font-bold text-emerald-400 font-mono text-sm">
                    +{formatINR(calculateDynamicAnnualSavings(comparedCar) * 5)}
                  </span>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 block mb-2">Key Advantages</span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {comparedCar.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 block mb-2">Things to Consider</span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {comparedCar.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <X className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-800 bg-dark-950/60">
              <Button onClick={() => setComparedCar(null)} variant="primary">
                Close Benchmark
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
