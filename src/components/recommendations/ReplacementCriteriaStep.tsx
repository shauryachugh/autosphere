import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  IndianRupee, 
  Fuel, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Percent, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatINR, formatLakhsCrores } from '../../utils/formatters';
import { ReplacementRequirements } from '../../types/replacement.types';
import { FuelType, TransmissionType, BodyType } from '../../types';
import { SearchableLocationSelect } from '../common/SearchableLocationSelect';

interface ReplacementCriteriaStepProps {
  initialCriteria: ReplacementRequirements;
  currentCarResaleValue: number;
  onBack: () => void;
  onNext: (criteria: ReplacementRequirements) => void;
}

export const ReplacementCriteriaStep: React.FC<ReplacementCriteriaStepProps> = ({
  initialCriteria,
  currentCarResaleValue,
  onBack,
  onNext,
}) => {
  const [criteria, setCriteria] = useState<ReplacementRequirements>(initialCriteria);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(criteria);
  };

  const indianStates = [
    'Karnataka',
    'Maharashtra',
    'Delhi NCR',
    'Tamil Nadu',
    'Telangana',
    'Gujarat',
    'Uttar Pradesh',
    'Kerala',
    'West Bengal',
    'Rajasthan',
    'Punjab',
    'Haryana',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Budget & Financing Parameters */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-cyan-400" />
              Budget & Auto Financing Framework
            </span>
            <Badge variant="neutral" size="xs">
              Step 2 of 4
            </Badge>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Max Purchase Budget */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Maximum Vehicle Budget (On-Road):</span>
              <span className="text-cyan-400 font-mono font-bold text-sm">
                {formatLakhsCrores(criteria.maxPurchaseBudgetINR)}
              </span>
            </div>
            <input
              type="range"
              min="800000"
              max="7500000"
              step="50000"
              value={criteria.maxPurchaseBudgetINR}
              onChange={(e) =>
                setCriteria({ ...criteria, maxPurchaseBudgetINR: parseInt(e.target.value, 10) })
              }
              className="w-full accent-cyan-400 h-1.5 bg-dark-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>₹8 Lakh (Entry)</span>
              <span>₹25 Lakh (Mid SUV)</span>
              <span>₹75 Lakh (Luxury)</span>
            </div>
          </div>

          {/* Preferred Monthly EMI */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Preferred Monthly EMI Limit:</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                {formatINR(criteria.preferredMonthlyEmiINR)} / mo
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="95000"
              step="2500"
              value={criteria.preferredMonthlyEmiINR}
              onChange={(e) =>
                setCriteria({ ...criteria, preferredMonthlyEmiINR: parseInt(e.target.value, 10) })
              }
              className="w-full accent-emerald-400 h-1.5 bg-dark-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>₹10,000 / mo</span>
              <span>₹35,000 / mo</span>
              <span>₹95,000 / mo</span>
            </div>
          </div>

          {/* Cash Down Payment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Cash Down Payment Allocation (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">₹</span>
              <input
                type="number"
                min="0"
                step="25000"
                value={criteria.downPaymentINR}
                onChange={(e) =>
                  setCriteria({ ...criteria, downPaymentINR: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Direct upfront savings or bank transfer</p>
          </div>
        </div>

        {/* Resale Value Trade-In Toggle */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <label className="flex items-start sm:items-center justify-between p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 cursor-pointer transition-all hover:bg-cyan-950/30">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={criteria.applyResaleAsDownPayment}
                onChange={(e) =>
                  setCriteria({ ...criteria, applyResaleAsDownPayment: e.target.checked })
                }
                className="w-4 h-4 rounded accent-cyan-400 text-cyan-500 focus:ring-0 bg-dark-800 cursor-pointer"
              />
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  Apply Current Vehicle Trade-In Value towards Down Payment
                </p>
                <p className="text-xs text-slate-400">
                  Deducts your estimated current car value ({formatINR(currentCarResaleValue)}) from the replacement loan principal.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline font-mono font-bold text-emerald-400 text-xs">
              +{formatINR(currentCarResaleValue)} Equity
            </span>
          </label>
        </div>

        {/* Loan Tenure & Interest Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Loan Tenure (Auto Loan Repayment Period)
            </label>
            <select
              value={criteria.loanTenureYears}
              onChange={(e) =>
                setCriteria({ ...criteria, loanTenureYears: parseInt(e.target.value, 10) || 5 })
              }
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="3">3 Years (36 Months - Fast Payoff)</option>
              <option value="4">4 Years (48 Months)</option>
              <option value="5">5 Years (60 Months - Standard India)</option>
              <option value="7">7 Years (84 Months - Lowest Monthly EMI)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Expected Bank Interest Rate:</span>
              <span className="text-cyan-400 font-mono font-bold">{criteria.loanInterestRatePercent}% p.a.</span>
            </div>
            <input
              type="range"
              min="8.0"
              max="12.0"
              step="0.25"
              value={criteria.loanInterestRatePercent}
              onChange={(e) =>
                setCriteria({ ...criteria, loanInterestRatePercent: parseFloat(e.target.value) || 9.0 })
              }
              className="w-full accent-cyan-400 h-1.5 bg-dark-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>8.0% (SBI / HDFC Premium)</span>
              <span>9.0% (Median)</span>
              <span>12.0% (NBFC)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Powertrain, Transmission & Body Preferences */}
      <Card
        header={
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <Fuel className="w-4 h-4 text-cyan-400" />
            Vehicle Type & Powertrain Preferences
          </span>
        }
      >
        <div className="space-y-4">
          {/* Fuel Tech Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Preferred Powertrain Technology
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { label: 'All Tech', value: 'all' },
                { label: 'Electric (EV)', value: 'electric' },
                { label: 'Strong Hybrid', value: 'hybrid' },
                { label: 'Diesel', value: 'diesel' },
                { label: 'Petrol', value: 'petrol' },
                { label: 'CNG', value: 'cng' },
              ].map((f) => (
                <button
                  type="button"
                  key={f.value}
                  onClick={() => setCriteria({ ...criteria, preferredFuelType: f.value as any })}
                  className={`p-2.5 rounded-xl text-xs font-semibold transition-all border text-center ${
                    criteria.preferredFuelType === f.value
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-glow-subtle'
                      : 'bg-dark-850 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Transmission */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Transmission Preference
              </label>
              <select
                value={criteria.transmissionPreference}
                onChange={(e) => setCriteria({ ...criteria, transmissionPreference: e.target.value as any })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Any Transmission</option>
                <option value="automatic">Automatic (AT / Torque Converter / DCT / CVT)</option>
                <option value="manual">Manual (MT)</option>
                <option value="single-speed">Single Speed EV</option>
              </select>
            </div>

            {/* Vehicle Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vehicle Body Category
              </label>
              <select
                value={criteria.vehicleCategory}
                onChange={(e) => setCriteria({ ...criteria, vehicleCategory: e.target.value as any })}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Any Category (SUV, Sedan, MPV, Hatchback)</option>
                <option value="suv">SUV & Compact Crossover</option>
                <option value="sedan">Executive Sedan</option>
                <option value="mpv">7-Seater MPV Family Car</option>
                <option value="hatchback">Urban Hatchback</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Driving Commute & State Tax Location */}
      <Card
        header={
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Commute Patterns & Regional RTO Jurisdiction
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Monthly Commute Distance */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Expected Monthly Driving Distance:</span>
              <span className="text-cyan-400 font-mono font-bold">{criteria.monthlyDrivingDistanceKm.toLocaleString('en-IN')} km</span>
            </div>
            <input
              type="range"
              min="400"
              max="4000"
              step="50"
              value={criteria.monthlyDrivingDistanceKm}
              onChange={(e) =>
                setCriteria({ ...criteria, monthlyDrivingDistanceKm: parseInt(e.target.value, 10) || 500 })
              }
              className="w-full accent-cyan-400 h-1.5 bg-dark-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">Calculates 5-year fuel & electricity consumption</p>
          </div>

          {/* Traffic Condition Mix */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Driving Condition Mix:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {criteria.cityDrivingPercent}% City / {100 - criteria.cityDrivingPercent}% Highway
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="85"
              step="5"
              value={criteria.cityDrivingPercent}
              onChange={(e) => {
                const city = parseInt(e.target.value, 10) || 50;
                setCriteria({
                  ...criteria,
                  cityDrivingPercent: city,
                  highwayDrivingPercent: 100 - city,
                });
              }}
              className="w-full accent-emerald-400 h-1.5 bg-dark-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">High city % favors EV & Hybrid regenerative braking</p>
          </div>

          {/* Location for Road Tax */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Registration Location (State & City RTO Tax)
            </label>
            <SearchableLocationSelect
              selectedState={criteria.state}
              selectedCity={criteria.city}
              onLocationChange={(s, c) => {
                setCriteria({
                  ...criteria,
                  state: s.name,
                  city: c.name,
                });
              }}
              showFuelSnippet={true}
            />
            <p className="text-[10px] text-slate-500 mt-1">Applies authentic state road tax & EV subsidy rules</p>
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          size="md"
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Current Vehicle
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Generate Smart Recommendations
        </Button>
      </div>
    </form>
  );
};
