import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Layers, 
  ArrowLeft, 
  ArrowRight, 
  IndianRupee, 
  Fuel, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Info,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatINR, formatLakhsCrores } from '../../utils/formatters';
import { ReplacementCarTCO, CurrentCarTCO } from '../../types/replacement.types';

interface RankedCarsStepProps {
  rankedCars: ReplacementCarTCO[];
  currentCarTCO: CurrentCarTCO;
  selectedCarIds: string[];
  onToggleCarSelection: (id: string) => void;
  onBack: () => void;
  onProceedToCompare: () => void;
}

export const RankedCarsStep: React.FC<RankedCarsStepProps> = ({
  rankedCars,
  currentCarTCO,
  selectedCarIds,
  onToggleCarSelection,
  onBack,
  onProceedToCompare,
}) => {
  const [filterFuel, setFilterFuel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'price' | 'tco' | 'efficiency'>('match');

  // Filter cars
  let displayedCars = rankedCars.filter((item) => {
    if (filterFuel !== 'all' && item.car.fuelType !== filterFuel) return false;
    return true;
  });

  // Sort cars
  displayedCars = [...displayedCars].sort((a, b) => {
    if (sortBy === 'price') return a.estimatedOnRoadPriceINR - b.estimatedOnRoadPriceINR;
    if (sortBy === 'tco') return a.fiveYearTotalOwnershipCostINR - b.fiveYearTotalOwnershipCostINR;
    if (sortBy === 'efficiency') return b.car.mileageOrRange - a.car.mileageOrRange;
    return b.matchScore - a.matchScore;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Algorithmic Replacement Recommendations
            </h2>
            <Badge variant="electric" size="sm">
              {displayedCars.length} Matches
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evaluated on budget fit, monthly cash flow, 5-year TCO, safety and fuel economics
          </p>
        </div>

        {/* Selected Counter & Compare CTA */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            {selectedCarIds.length}/3 Selected
          </span>
          <Button
            onClick={onProceedToCompare}
            disabled={selectedCarIds.length === 0}
            variant="primary"
            size="sm"
            icon={<Layers className="w-4 h-4" />}
          >
            Compare & View Verdict ({selectedCarIds.length})
          </Button>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-dark-900 border border-slate-800">
        {/* Fuel Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 px-1 font-medium">Filter:</span>
          {[
            { label: 'All Tech', value: 'all' },
            { label: 'EV', value: 'electric' },
            { label: 'Strong Hybrid', value: 'hybrid' },
            { label: 'Diesel', value: 'diesel' },
            { label: 'Petrol', value: 'petrol' },
            { label: 'CNG', value: 'cng' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterFuel(f.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterFuel === f.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white bg-dark-850 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="match">Smart Match Score</option>
            <option value="price">On-Road Price (Lowest)</option>
            <option value="tco">5-Year TCO (Lowest)</option>
            <option value="efficiency">Mileage / Range</option>
          </select>
        </div>
      </div>

      {/* Selection Guidance Notice */}
      <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex items-center justify-between text-xs text-cyan-300">
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Select up to <strong>3 replacement vehicles</strong> to benchmark against your current car in the Comparison Matrix.
          </span>
        </span>
        <span className="font-semibold text-slate-400 hidden sm:inline">
          {selectedCarIds.length} of 3 chosen
        </span>
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedCars.map((item) => {
          const isSelected = selectedCarIds.includes(item.car.id);
          const annualFuelSavings = Math.round(
            currentCarTCO.annualFuelExpenditure - item.annualFuelCostINR
          );
          const fiveYearDiff = Math.round(
            item.fiveYearTotalOwnershipCostINR - currentCarTCO.fiveYearTotalOwnershipCost
          );

          return (
            <div
              key={item.car.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-card flex flex-col justify-between ${
                isSelected
                  ? 'bg-dark-900 border-cyan-500 shadow-glow-subtle ring-1 ring-cyan-500/40'
                  : 'bg-dark-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Photo & Badge Banner */}
                <div className="relative aspect-[16/9] max-h-56 overflow-hidden">
                  <img
                    src={item.car.imageUrl}
                    alt={item.car.model}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="electric" size="sm">
                      {item.matchScore}/100 Match Score
                    </Badge>
                    <Badge
                      variant={
                        item.car.fuelType === 'electric'
                          ? 'success'
                          : item.car.fuelType === 'hybrid'
                          ? 'info'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {item.car.fuelType.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Selection Checkbox Pill */}
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => onToggleCarSelection(item.car.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                        isSelected
                          ? 'bg-cyan-500 text-dark-950 shadow-glow-blue'
                          : 'bg-dark-950/80 text-slate-300 border border-slate-700 hover:text-white hover:border-slate-500'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>+ Select to Compare</span>
                      )}
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {item.car.make} {item.car.model}
                      </h3>
                      <p className="text-xs text-slate-300">{item.car.variant}</p>
                    </div>
                    <span className="text-xs bg-dark-900/90 text-emerald-300 px-2 py-1 rounded-md border border-emerald-500/30 font-medium">
                      {item.car.safetyRating}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Financial Grid */}
                  <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                        Est. On-Road Price
                      </span>
                      <span className="text-base font-bold text-white font-mono">
                        {formatINR(item.estimatedOnRoadPriceINR)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                        Est. Monthly EMI
                      </span>
                      <span className="text-base font-bold text-emerald-400 font-mono">
                        {formatINR(item.monthlyEmiINR)}/mo
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                        Monthly Fuel / Power
                      </span>
                      <span className="text-base font-bold text-cyan-300 font-mono">
                        {formatINR(item.monthlyFuelCostINR)}/mo
                      </span>
                    </div>
                  </div>

                  {/* Why Selected Explanations */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Why Recommended for You
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-200">
                      {item.whySelectedReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 font-bold shrink-0">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Highlights */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.car.highlights.map((h, i) => (
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
                      <span className="text-[10px] text-slate-400 block">Efficiency</span>
                      <span className="font-bold text-cyan-300 font-mono">
                        {item.car.mileageOrRange} {item.car.mileageUnit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Power / Torque</span>
                      <span className="font-semibold text-white">
                        {item.car.powerBhp} BHP / {item.car.torqueNm} Nm
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">3-Yr Resale</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {item.car.resalePercentage3Yr}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0">
                <Button
                  onClick={() => onToggleCarSelection(item.car.id)}
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full"
                  icon={isSelected ? <Check className="w-4 h-4" /> : <Layers className="w-4 h-4 text-cyan-400" />}
                >
                  {isSelected ? 'Selected for Comparison Matrix' : 'Select for Comparison Matrix'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <Button
          onClick={onBack}
          variant="outline"
          size="md"
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Requirements
        </Button>

        <Button
          onClick={onProceedToCompare}
          disabled={selectedCarIds.length === 0}
          variant="primary"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Comparison & Final Verdict ({selectedCarIds.length} Selected)
        </Button>
      </div>
    </div>
  );
};
