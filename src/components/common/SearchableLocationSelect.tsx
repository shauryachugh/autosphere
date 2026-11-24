import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Search, ChevronDown, Check, Building2, Zap, Fuel } from 'lucide-react';
import { ALL_INDIAN_STATES, ALL_INDIAN_CITIES, getCitiesForState } from '../../data/locationsData';
import { getFuelPricing, getEvTariff } from '../../data/fuelTariffsData';
import { IndianCity, IndianState } from '../../types/automotive.types';

interface SearchableLocationSelectProps {
  selectedState: string; // stateId (e.g. 'KA') or state name (e.g. 'Karnataka')
  selectedCity: string; // cityId or city name (e.g. 'bengaluru')
  onLocationChange: (state: IndianState, city: IndianCity) => void;
  showFuelSnippet?: boolean;
  className?: string;
}

export const SearchableLocationSelect: React.FC<SearchableLocationSelectProps> = ({
  selectedState,
  selectedCity,
  onLocationChange,
  showFuelSnippet = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'cities' | 'states'>('cities');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize initial selection
  const currentState = useMemo(() => {
    return ALL_INDIAN_STATES.find(
      s => s.id.toLowerCase() === (selectedState || '').toLowerCase() ||
           s.name.toLowerCase() === (selectedState || '').toLowerCase()
    ) || ALL_INDIAN_STATES.find(s => s.id === 'KA')!;
  }, [selectedState]);

  const currentCity = useMemo(() => {
    return ALL_INDIAN_CITIES.find(
      c => c.id.toLowerCase() === (selectedCity || '').toLowerCase() ||
           c.name.toLowerCase() === (selectedCity || '').toLowerCase()
    ) || ALL_INDIAN_CITIES.find(c => c.stateId === currentState.id) || ALL_INDIAN_CITIES[0];
  }, [selectedCity, currentState]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered lists
  const filteredCities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      // Prioritize current state cities, then major metros
      const stateCities = getCitiesForState(currentState.id);
      const otherMetros = ALL_INDIAN_CITIES.filter(c => c.stateId !== currentState.id && c.isMetro);
      return [...stateCities, ...otherMetros];
    }
    return ALL_INDIAN_CITIES.filter(
      c => c.name.toLowerCase().includes(q) ||
           (c.stateName && c.stateName.toLowerCase().includes(q)) ||
           c.rtoCodes.some(r => r.toLowerCase().includes(q))
    );
  }, [searchQuery, currentState]);

  const filteredStates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_INDIAN_STATES;
    return ALL_INDIAN_STATES.filter(
      s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.capital.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCitySelect = (city: IndianCity) => {
    const state = ALL_INDIAN_STATES.find(s => s.id === city.stateId) || currentState;
    onLocationChange(state, city);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleStateSelect = (state: IndianState) => {
    const stateCities = getCitiesForState(state.id);
    const primaryCity = stateCities[0] || {
      id: `${state.id.toLowerCase()}-city`,
      name: state.capital || state.name,
      stateId: state.id,
      stateName: state.name,
      tier: 2,
      rtoCodes: [`${state.rtoCodePrefix}-01`],
      isMetro: false,
      municipalParkingTaxINR: 1500,
      localCessPercent: 0,
      isActive: true,
    };
    onLocationChange(state, primaryCity);
    setActiveTab('cities');
  };

  const fuelRates = getFuelPricing(currentState.id);
  const evRates = getEvTariff(currentState.id);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-carbon-800/80 hover:bg-carbon-700/80 border border-carbon-700 hover:border-cyan-500/50 transition-all text-left group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white truncate">{currentCity.name}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-carbon-700 text-cyan-400 font-mono">
                {currentState.id}
              </span>
              {currentCity.isMetro && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Metro
                </span>
              )}
            </div>
            <div className="text-xs text-carbon-400 truncate">
              {currentState.name} {currentCity.rtoCodes.length > 0 && `• ${currentCity.rtoCodes[0]}`}
            </div>
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-carbon-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>

      {/* Fuel & EV rates quick strip */}
      {showFuelSnippet && (
        <div className="mt-2 flex items-center gap-2 overflow-x-auto text-[11px] text-carbon-400 px-1 py-1">
          <span className="flex items-center gap-1 text-amber-400/90 whitespace-nowrap">
            <Fuel className="w-3 h-3 text-amber-400" /> Petrol: ₹{fuelRates.petrolPricePerLitreINR}/L
          </span>
          <span className="text-carbon-600">•</span>
          <span className="flex items-center gap-1 text-slate-300 whitespace-nowrap">
            Diesel: ₹{fuelRates.dieselPricePerLitreINR}/L
          </span>
          <span className="text-carbon-600">•</span>
          <span className="flex items-center gap-1 text-cyan-400/90 whitespace-nowrap">
            <Zap className="w-3 h-3 text-cyan-400" /> EV AC: ₹{evRates.domesticAcRatePerKwhINR}/kWh
          </span>
        </div>
      )}

      {/* Dropdown Modal Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[320px] max-w-md bg-carbon-900 border border-carbon-700/80 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-carbon-800 bg-carbon-900/90">
            <div className="relative">
              <Search className="w-4 h-4 text-carbon-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search city, state or RTO (e.g. Pune, MH, KA-01)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-carbon-800 text-sm text-white pl-9 pr-4 py-2 rounded-xl border border-carbon-700 focus:outline-none focus:border-cyan-500 placeholder-carbon-500"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setActiveTab('cities')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'cities'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-carbon-400 hover:text-white bg-carbon-800/50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Cities ({filteredCities.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('states')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'states'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-carbon-400 hover:text-white bg-carbon-800/50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> States & UTs (36)
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="max-h-64 overflow-y-auto p-2 divide-y divide-carbon-800/40">
            {activeTab === 'cities' ? (
              filteredCities.length > 0 ? (
                filteredCities.map(city => {
                  const isSelected = city.id === currentCity.id;
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'hover:bg-carbon-800 text-carbon-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{city.name}</span>
                          <span className="text-[11px] px-1.5 py-0.2 rounded bg-carbon-800 text-carbon-400 font-mono">
                            {city.stateId}
                          </span>
                          {city.isMetro && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-medium">
                              Metro
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-carbon-400 mt-0.5">
                          {city.stateName || city.stateId} • RTO: {city.rtoCodes.slice(0, 3).join(', ')}
                          {city.rtoCodes.length > 3 ? '...' : ''}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-carbon-400">
                  No cities found matching "{searchQuery}".
                </div>
              )
            ) : (
              filteredStates.map(state => {
                const isSelected = state.id === currentState.id;
                return (
                  <button
                    key={state.id}
                    type="button"
                    onClick={() => handleStateSelect(state)}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'hover:bg-carbon-800 text-carbon-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{state.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-carbon-800 text-cyan-400 font-mono">
                          {state.id}
                        </span>
                        {state.type === 'union_territory' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400">
                            UT
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-carbon-400 mt-0.5">
                        Capital: {state.capital} • Prefix: {state.rtoCodePrefix}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
