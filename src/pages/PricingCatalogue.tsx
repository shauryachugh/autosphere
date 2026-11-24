import React, { useState, useMemo } from 'react';
import {
  Car,
  Filter,
  Search,
  Calculator,
  Zap,
  Fuel,
  Shield,
  Layers,
  MapPin,
  TrendingDown,
  ChevronRight,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import { INDIAN_MANUFACTURERS } from '../data/manufacturersData';
import { INDIAN_CAR_MODELS } from '../data/modelsData';
import { INDIAN_CAR_VARIANTS } from '../data/variantsData';
import { ALL_INDIAN_STATES, ALL_INDIAN_CITIES } from '../data/locationsData';
import { SearchableLocationSelect } from '../components/common/SearchableLocationSelect';
import { OnRoadPriceModal } from '../components/pricing/OnRoadPriceModal';
import { calculateOnRoadPrice } from '../utils/pricingEngine';
import { calculateLocationRunningCostPerKm } from '../data/fuelTariffsData';
import { CarVariant, IndianCity, IndianState } from '../types/automotive.types';
import { FuelType, BodyType } from '../types';

export const PricingCatalogue: React.FC = () => {
  // Location selection
  const [selectedState, setSelectedState] = useState<IndianState>(() => {
    return ALL_INDIAN_STATES.find(s => s.id === 'KA') || ALL_INDIAN_STATES[0];
  });
  const [selectedCity, setSelectedCity] = useState<IndianCity>(() => {
    return ALL_INDIAN_CITIES.find(c => c.id === 'bengaluru') || ALL_INDIAN_CITIES[0];
  });

  // Filters
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('all');
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<BodyType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal state
  const [modalVariant, setModalVariant] = useState<CarVariant | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Enriched Variants
  const modelMap = useMemo(() => new Map(INDIAN_CAR_MODELS.map(m => [m.id, m])), []);
  const mfrMap = useMemo(() => new Map(INDIAN_MANUFACTURERS.map(m => [m.id, m])), []);

  const enrichedVehicles = useMemo(() => {
    return INDIAN_CAR_VARIANTS.map(variant => {
      const model = modelMap.get(variant.modelId);
      const manufacturer = model ? mfrMap.get(model.manufacturerId) : undefined;
      return {
        variant,
        model,
        manufacturer,
      };
    });
  }, [modelMap, mfrMap]);

  // Filtered List
  const filteredVehicles = useMemo(() => {
    return enrichedVehicles.filter(item => {
      if (!item.model || !item.manufacturer) return false;

      // Manufacturer filter
      if (selectedManufacturer !== 'all' && item.manufacturer.id !== selectedManufacturer) {
        return false;
      }

      // Fuel type filter
      if (selectedFuelType !== 'all' && item.variant.fuelType !== selectedFuelType) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.model.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = `${item.manufacturer.name} ${item.model.name} ${item.variant.name}`.toLowerCase();
        if (!matchTitle.includes(q)) return false;
      }

      return true;
    });
  }, [enrichedVehicles, selectedManufacturer, selectedFuelType, selectedCategory, searchQuery]);

  const handleOpenPricingModal = (variant: CarVariant, title: string) => {
    setModalVariant(variant);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-carbon-900 via-carbon-900 to-cyan-950/40 border border-carbon-800 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
              <Calculator className="w-3.5 h-3.5" /> India-Wide Automotive Database & Pricing Engine
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              On-Road Price & Vehicle Catalogue
            </h1>
            <p className="text-sm text-carbon-400 mt-2 leading-relaxed">
              Explore authentic state-specific on-road prices across 12 Indian OEMs and all 36 States & Union Territories.
              Includes modular RTO road tax calculation, mandatory IRDAI insurance, TCS, FASTag, and local municipal parking charges.
            </p>
          </div>

          {/* Location Selector Pill */}
          <div className="w-full lg:w-80 p-4 rounded-2xl bg-carbon-800/80 border border-carbon-700/80 shadow-xl backdrop-blur-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-carbon-400 mb-2 block">
              Pricing Location Jurisdiction
            </span>
            <SearchableLocationSelect
              selectedState={selectedState.id}
              selectedCity={selectedCity.id}
              onLocationChange={(s, c) => {
                setSelectedState(s);
                setSelectedCity(c);
              }}
              showFuelSnippet={true}
            />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-6 rounded-2xl bg-carbon-900 border border-carbon-800 space-y-4">
        {/* Search Bar + Quick Counts */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-carbon-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search car make, model, or variant..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-carbon-800 text-sm text-white pl-10 pr-4 py-2.5 rounded-xl border border-carbon-700 focus:outline-none focus:border-cyan-500 placeholder-carbon-500"
            />
          </div>

          <div className="text-xs text-carbon-400 flex items-center gap-2">
            <span>Showing <strong className="text-white">{filteredVehicles.length}</strong> vehicles in {selectedCity.name}, {selectedState.id}</span>
          </div>
        </div>

        {/* Powertrain Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-carbon-400 font-semibold mr-1 flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5" /> Powertrain:
          </span>
          {(['all', 'electric', 'hybrid', 'petrol', 'diesel', 'cng'] as const).map(fuel => (
            <button
              key={fuel}
              type="button"
              onClick={() => setSelectedFuelType(fuel)}
              className={`px-3 py-1.5 rounded-xl font-medium uppercase tracking-wider text-[11px] transition-all ${
                selectedFuelType === fuel
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-carbon-800 text-carbon-300 hover:bg-carbon-700'
              }`}
            >
              {fuel === 'all' ? 'All Fuels' : fuel}
            </button>
          ))}
        </div>

        {/* Manufacturer Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-carbon-400 font-semibold mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> OEM:
          </span>
          <button
            type="button"
            onClick={() => setSelectedManufacturer('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedManufacturer === 'all'
                ? 'bg-carbon-700 text-white font-bold border border-carbon-600'
                : 'bg-carbon-800 text-carbon-400 hover:bg-carbon-700'
            }`}
          >
            All Brands ({INDIAN_MANUFACTURERS.length})
          </button>
          {INDIAN_MANUFACTURERS.map(mfr => (
            <button
              key={mfr.id}
              type="button"
              onClick={() => setSelectedManufacturer(mfr.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedManufacturer === mfr.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                  : 'bg-carbon-800 text-carbon-400 hover:bg-carbon-700'
              }`}
            >
              {mfr.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Vehicles */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map(({ variant, model, manufacturer }) => {
            if (!model || !manufacturer) return null;

            // Live On-road calculation for this car in the user's selected state & city
            const pricing = calculateOnRoadPrice({
              exShowroomPriceINR: variant.exShowroomPriceINR,
              fuelType: variant.fuelType,
              stateId: selectedState.id,
              cityId: selectedCity.id,
              engineCapacityCc: variant.engineCapacityCc,
              includeZeroDepInsurance: true,
            });

            // Running cost per km in this state
            const runningCost = calculateLocationRunningCostPerKm(
              variant.fuelType,
              variant.mileageOrRange,
              selectedState.id
            );

            const cardTitle = `${manufacturer.name} ${model.name}`;

            return (
              <div
                key={variant.id}
                className="group rounded-3xl bg-carbon-900 border border-carbon-800 hover:border-cyan-500/40 transition-all duration-200 overflow-hidden flex flex-col shadow-xl"
              >
                {/* Image Cover */}
                <div className="relative h-48 overflow-hidden bg-carbon-950">
                  <img
                    src={model.imageUrl}
                    alt={cardTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-900 via-transparent to-transparent" />

                  {/* Fuel Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold text-cyan-400 border border-cyan-500/30">
                      {variant.fuelType}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold text-white border border-white/20">
                      {variant.transmission}
                    </span>
                  </div>

                  {/* Safety Rating */}
                  {model.safetyRating && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> {model.safetyRating}
                    </div>
                  )}

                  {/* On-Road Price Banner */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-carbon-400 font-semibold">
                        On-Road in {selectedCity.name}
                      </div>
                      <div className="text-xl font-extrabold text-white">
                        ₹{pricing.totalOnRoadPriceINR.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-carbon-400">Ex-Showroom</div>
                      <div className="text-xs font-mono text-carbon-300">
                        ₹{variant.exShowroomPriceINR.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                        {manufacturer.name}
                      </span>
                      <span className="text-xs text-carbon-400 capitalize">
                        {model.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">
                      {model.name} <span className="font-normal text-carbon-300 text-xs">({variant.name})</span>
                    </h3>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-3 p-3 rounded-2xl bg-carbon-800/40 border border-carbon-800 text-center">
                      <div>
                        <span className="text-[10px] text-carbon-400 uppercase block">Power</span>
                        <span className="text-xs font-bold text-white">{variant.powerBhp} bhp</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-carbon-400 uppercase block">Torque</span>
                        <span className="text-xs font-bold text-white">{variant.torqueNm} Nm</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-carbon-400 uppercase block">Mileage / Range</span>
                        <span className="text-xs font-bold text-cyan-400">
                          {variant.mileageOrRange} {variant.mileageUnit}
                        </span>
                      </div>
                    </div>

                    {/* Running Cost and RTO Tax info */}
                    <div className="mt-3 flex items-center justify-between text-xs py-1.5 border-t border-b border-carbon-800/60 font-mono">
                      <span className="text-carbon-400">Running Cost:</span>
                      <span className="text-emerald-400 font-bold">~₹{runningCost.costPerKmINR} / km</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs font-mono">
                      <span className="text-carbon-400">RTO Tax ({pricing.rtoRoadTaxPercent}%):</span>
                      <span className="text-white font-semibold">
                        {pricing.rtoRoadTaxINR === 0 ? (
                          <span className="text-emerald-400 font-bold uppercase">₹0 (Waived)</span>
                        ) : (
                          `₹${pricing.rtoRoadTaxINR.toLocaleString('en-IN')}`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenPricingModal(variant, cardTitle)}
                    className="w-full py-2.5 rounded-xl bg-carbon-800 hover:bg-cyan-500 hover:text-black text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:text-black shadow-md"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Calculate On-Road Breakdown
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-carbon-900 border border-carbon-800 space-y-3">
          <Car className="w-10 h-10 text-carbon-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Vehicles Matched Your Filter</h3>
          <p className="text-xs text-carbon-400 max-w-sm mx-auto">
            Try resetting the manufacturer or fuel type filter to view all models across India.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedManufacturer('all');
              setSelectedFuelType('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* On-Road Price Breakdown Modal */}
      <OnRoadPriceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        variant={modalVariant}
        makeModelTitle={modalTitle}
        initialStateId={selectedState.id}
        initialCityId={selectedCity.id}
      />
    </div>
  );
};
