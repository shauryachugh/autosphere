import React, { useState, useMemo } from 'react';
import {
  X,
  Calculator,
  Shield,
  FileText,
  MapPin,
  CheckCircle2,
  DollarSign,
  Fuel,
  Zap,
  Info,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Building2,
} from 'lucide-react';
import { CarVariant, IndianCity, IndianState } from '../../types/automotive.types';
import { calculateOnRoadPrice, comparePriceAcrossStates } from '../../utils/pricingEngine';
import { ALL_INDIAN_STATES, ALL_INDIAN_CITIES } from '../../data/locationsData';
import { SearchableLocationSelect } from '../common/SearchableLocationSelect';
import { getFuelPricing, getEvTariff } from '../../data/fuelTariffsData';

interface OnRoadPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: CarVariant | null;
  makeModelTitle?: string;
  initialStateId?: string;
  initialCityId?: string;
}

export const OnRoadPriceModal: React.FC<OnRoadPriceModalProps> = ({
  isOpen,
  onClose,
  variant,
  makeModelTitle,
  initialStateId = 'KA',
  initialCityId = 'bengaluru',
}) => {
  const [selectedState, setSelectedState] = useState<IndianState>(() => {
    return ALL_INDIAN_STATES.find(s => s.id === initialStateId) || ALL_INDIAN_STATES[0];
  });
  const [selectedCity, setSelectedCity] = useState<IndianCity>(() => {
    return ALL_INDIAN_CITIES.find(c => c.id === initialCityId) || ALL_INDIAN_CITIES[0];
  });

  // Toggles
  const [includeZeroDep, setIncludeZeroDep] = useState(true);
  const [includeWarranty, setIncludeWarranty] = useState(false);
  const [includeAccessories, setIncludeAccessories] = useState(false);

  // Active view tab: 'breakdown' | 'state-comparison'
  const [viewTab, setViewTab] = useState<'breakdown' | 'state-comparison'>('breakdown');

  // Fallback variant if none passed
  const activeVariant: CarVariant = useMemo(() => {
    if (variant) return variant;
    return {
      id: 'custom-variant',
      modelId: 'custom-model',
      name: 'Standard Configuration',
      fuelType: 'petrol',
      transmission: 'manual',
      powerBhp: 120,
      torqueNm: 170,
      mileageOrRange: 18.5,
      mileageUnit: 'km/l',
      seatingCapacity: 5,
      exShowroomPriceINR: 1250000,
      annualMaintenanceEstimateINR: 8000,
      annualInsuranceEstimateINR: 32000,
      isActive: true,
    };
  }, [variant]);

  // Pricing breakdown
  const breakdown = useMemo(() => {
    return calculateOnRoadPrice({
      exShowroomPriceINR: activeVariant.exShowroomPriceINR,
      fuelType: activeVariant.fuelType,
      stateId: selectedState.id,
      cityId: selectedCity.id,
      engineCapacityCc: activeVariant.engineCapacityCc,
      includeZeroDepInsurance: includeZeroDep,
      includeExtendedWarranty: includeWarranty,
      includeAccessoriesKit: includeAccessories,
    });
  }, [activeVariant, selectedState, selectedCity, includeZeroDep, includeWarranty, includeAccessories]);

  // Multi-state comparison list
  const stateComparisons = useMemo(() => {
    const keyStates = ['KA', 'DL', 'MH', 'UP', 'TN', 'GJ'];
    return comparePriceAcrossStates(activeVariant, keyStates);
  }, [activeVariant]);

  const fuelRates = getFuelPricing(selectedState.id);
  const evRates = getEvTariff(selectedState.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-carbon-900 border border-carbon-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-carbon-800 bg-carbon-950/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {makeModelTitle || 'Automotive Pricing Engine'}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 capitalize font-medium">
                  {activeVariant.fuelType}
                </span>
              </div>
              <p className="text-xs text-carbon-400 mt-0.5">
                {activeVariant.name} • Ex-Showroom: ₹{activeVariant.exShowroomPriceINR.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-carbon-800 hover:bg-carbon-700 text-carbon-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Control Bar: Location & View Tabs */}
        <div className="p-6 pb-4 border-b border-carbon-800 bg-carbon-900/60 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-carbon-400 mb-1.5 block">
              Registration State & City (RTO Jurisdiction)
            </label>
            <SearchableLocationSelect
              selectedState={selectedState.id}
              selectedCity={selectedCity.id}
              onLocationChange={(s, c) => {
                setSelectedState(s);
                setSelectedCity(c);
              }}
              showFuelSnippet={false}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 md:pt-4">
            <button
              type="button"
              onClick={() => setViewTab('breakdown')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                viewTab === 'breakdown'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                  : 'bg-carbon-800 hover:bg-carbon-700 text-carbon-300'
              }`}
            >
              <FileText className="w-4 h-4" /> Itemized Breakdown
            </button>
            <button
              type="button"
              onClick={() => setViewTab('state-comparison')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                viewTab === 'state-comparison'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                  : 'bg-carbon-800 hover:bg-carbon-700 text-carbon-300'
              }`}
            >
              <MapPin className="w-4 h-4" /> All-India State Tax Compare
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {viewTab === 'breakdown' ? (
            <>
              {/* Grand Total Hero Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-carbon-900 to-carbon-900 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Total On-Road Price in {breakdown.cityName}, {breakdown.stateName}
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold text-white mt-1">
                    ₹{breakdown.totalOnRoadPriceINR.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-carbon-400 mt-1 flex items-center gap-2">
                    <span>Includes RTO ({breakdown.rtoRoadTaxPercent}%), 3-Yr Insurance, Plates, TCS & FASTag</span>
                    {breakdown.taxSavingsVsNationalAverageINR > 0 && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        • Saves ₹{breakdown.taxSavingsVsNationalAverageINR.toLocaleString('en-IN')} vs national tax avg!
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="px-3 py-2 rounded-xl bg-carbon-800/80 border border-carbon-700">
                    <span className="text-carbon-400 block text-[10px] uppercase">RTO Road Tax</span>
                    <span className="font-bold text-white">₹{breakdown.rtoRoadTaxINR.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-carbon-800/80 border border-carbon-700">
                    <span className="text-carbon-400 block text-[10px] uppercase">Insurance Total</span>
                    <span className="font-bold text-white">₹{breakdown.totalInsuranceINR.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mandatory Government & RTO Levies */}
                <div className="p-5 rounded-2xl bg-carbon-800/40 border border-carbon-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    Statutory & Government Charges
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-carbon-800/60">
                      <span className="text-carbon-300">Ex-Showroom Price</span>
                      <span className="font-semibold text-white">₹{breakdown.exShowroomPriceINR.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-carbon-800/60">
                      <div>
                        <div className="text-carbon-300 flex items-center gap-1.5">
                          State RTO Road Tax ({breakdown.rtoRoadTaxPercent}%)
                          {breakdown.rtoRoadTaxINR === 0 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                              100% Waived
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-carbon-500">{breakdown.stateName} RTO Schedule</div>
                      </div>
                      <span className="font-semibold text-white">₹{breakdown.rtoRoadTaxINR.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-carbon-800/60">
                      <span className="text-carbon-300">RTO Registration Fee & Smart Card</span>
                      <span className="font-semibold text-white">₹{breakdown.rtoRegistrationFeeINR.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-carbon-800/60">
                      <span className="text-carbon-300">HSRP Laser Plates & Postal Dispatch</span>
                      <span className="font-semibold text-white">₹{breakdown.smartCardAndPlateFeeINR.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-carbon-800/60">
                      <div>
                        <span className="text-carbon-300">Municipal Parking & Local Cess</span>
                        <div className="text-[11px] text-carbon-500">{breakdown.cityName} Corporation</div>
                      </div>
                      <span className="font-semibold text-white">₹{breakdown.municipalParkingTaxINR.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-carbon-800/60">
                      <div>
                        <span className="text-carbon-300">TCS (1% under Sec 206C(1F))</span>
                        <div className="text-[11px] text-carbon-500">{breakdown.exShowroomPriceINR > 1000000 ? 'Applicable on > ₹10L' : 'Exempt'}</div>
                      </div>
                      <span className="font-semibold text-white">₹{breakdown.tcsINR.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-carbon-300">FASTag Issuance & Security</span>
                      <span className="font-semibold text-white">₹{breakdown.fastagFeeINR.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Insurance & Optional Addons */}
                <div className="space-y-6">
                  {/* Insurance Box */}
                  <div className="p-5 rounded-2xl bg-carbon-800/40 border border-carbon-800 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      Comprehensive Insurance (IRDAI)
                    </h3>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-carbon-800/60">
                        <div>
                          <span className="text-carbon-300">1-Year Own Damage (OD)</span>
                          <div className="text-[11px] text-carbon-500">IDV: ₹{(breakdown.exShowroomPriceINR * 0.95).toLocaleString('en-IN')}</div>
                        </div>
                        <span className="font-semibold text-white">₹{breakdown.insuranceBasicODINR.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 border-b border-carbon-800/60">
                        <div>
                          <span className="text-carbon-300">3-Year Mandatory Third Party (TP)</span>
                          <div className="text-[11px] text-carbon-500">IRDAI Statutory Tariffs</div>
                        </div>
                        <span className="font-semibold text-white">₹{breakdown.insuranceMandatoryTPINR.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between items-center py-1.5">
                        <label className="flex items-center gap-2 cursor-pointer text-carbon-300">
                          <input
                            type="checkbox"
                            checked={includeZeroDep}
                            onChange={e => setIncludeZeroDep(e.target.checked)}
                            className="rounded border-carbon-600 text-cyan-500 focus:ring-0"
                          />
                          <span>Zero Depreciation (Bumper-to-Bumper) Add-on</span>
                        </label>
                        <span className="font-semibold text-white">
                          ₹{breakdown.insuranceZeroDepAddonINR.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Optional Dealer Packages */}
                  <div className="p-5 rounded-2xl bg-carbon-800/40 border border-carbon-800 space-y-3">
                    <h3 className="text-sm font-bold text-white">Optional Dealer Add-Ons</h3>

                    <div className="space-y-2 text-xs">
                      <label className="flex items-center justify-between p-2.5 rounded-xl bg-carbon-800/60 hover:bg-carbon-800 cursor-pointer border border-carbon-700/60 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={includeWarranty}
                            onChange={e => setIncludeWarranty(e.target.checked)}
                            className="rounded border-carbon-600 text-cyan-500 focus:ring-0"
                          />
                          <div>
                            <span className="text-white font-medium">Extended OEM Warranty (4th & 5th Year)</span>
                            <div className="text-[11px] text-carbon-400">Covers engine, transmission & electricals</div>
                          </div>
                        </div>
                        <span className="font-bold text-cyan-400">+₹18,000</span>
                      </label>

                      <label className="flex items-center justify-between p-2.5 rounded-xl bg-carbon-800/60 hover:bg-carbon-800 cursor-pointer border border-carbon-700/60 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={includeAccessories}
                            onChange={e => setIncludeAccessories(e.target.checked)}
                            className="rounded border-carbon-600 text-cyan-500 focus:ring-0"
                          />
                          <div>
                            <span className="text-white font-medium">Essential Accessories Kit</span>
                            <div className="text-[11px] text-carbon-400">7D Mats, Mud Flaps, Body Cover, Trunk Mat</div>
                          </div>
                        </div>
                        <span className="font-bold text-cyan-400">+₹12,500</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Energy Benchmarks in City */}
              <div className="p-4 rounded-xl bg-carbon-800/20 border border-carbon-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-carbon-400">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Local Fuel & Power Tariffs in <strong>{breakdown.cityName}</strong>:</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-amber-400">Petrol: ₹{fuelRates.petrolPricePerLitreINR}/L</span>
                  <span className="text-slate-300">Diesel: ₹{fuelRates.dieselPricePerLitreINR}/L</span>
                  <span className="text-emerald-400">CNG: ₹{fuelRates.cngPricePerKgINR}/kg</span>
                  <span className="text-cyan-400">EV AC: ₹{evRates.domesticAcRatePerKwhINR}/kWh</span>
                </div>
              </div>
            </>
          ) : (
            /* Multi-State Tax Comparison View */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>
                  See how state road taxes dramatically alter the exact same vehicle's on-road price across Indian states.
                  Notice state EV waivers and hybrid concessions!
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-carbon-800 bg-carbon-800/20">
                <table className="w-full text-left text-xs">
                  <thead className="bg-carbon-800 text-carbon-400 uppercase font-bold text-[10px] tracking-wider border-b border-carbon-700">
                    <tr>
                      <th className="py-3 px-4">State</th>
                      <th className="py-3 px-4">RTO Road Tax %</th>
                      <th className="py-3 px-4">RTO Road Tax (₹)</th>
                      <th className="py-3 px-4">Insurance (₹)</th>
                      <th className="py-3 px-4">Total On-Road (₹)</th>
                      <th className="py-3 px-4">Variance vs Lowest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-carbon-800/60 font-mono">
                    {stateComparisons.map((item, idx) => {
                      const isCurrent = item.stateId === selectedState.id;
                      const lowestOnRoad = Math.min(...stateComparisons.map(s => s.breakdown.totalOnRoadPriceINR));
                      const diffFromLowest = item.breakdown.totalOnRoadPriceINR - lowestOnRoad;

                      return (
                        <tr
                          key={item.stateId}
                          className={`transition-colors ${
                            isCurrent
                              ? 'bg-cyan-500/10 text-white font-bold'
                              : 'hover:bg-carbon-800/40 text-carbon-300'
                          }`}
                        >
                          <td className="py-3 px-4 font-sans font-semibold">
                            {item.stateName} ({item.stateId})
                            {isCurrent && (
                              <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-cyan-500 text-black uppercase font-bold">
                                Selected
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {item.breakdown.rtoRoadTaxINR === 0 ? (
                              <span className="text-emerald-400 font-bold">0% (Waived)</span>
                            ) : (
                              `${item.breakdown.rtoRoadTaxPercent}%`
                            )}
                          </td>
                          <td className="py-3 px-4">
                            ₹{item.breakdown.rtoRoadTaxINR.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            ₹{item.breakdown.totalInsuranceINR.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 font-bold text-white text-sm">
                            ₹{item.breakdown.totalOnRoadPriceINR.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            {diffFromLowest === 0 ? (
                              <span className="text-emerald-400 font-bold uppercase text-[10px]">
                                Lowest Price in India
                              </span>
                            ) : (
                              <span className="text-amber-400">
                                +₹{diffFromLowest.toLocaleString('en-IN')}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-carbon-800 bg-carbon-950/60 flex items-center justify-between">
          <div className="text-xs text-carbon-400">
            *Ex-showroom prices, RTO taxes & IRDAI insurance rates are calibrated for 2026 Indian automotive regulatory standards.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg shadow-cyan-500/25"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
