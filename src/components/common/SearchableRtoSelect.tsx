import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Building2, AlertCircle } from 'lucide-react';
import { getRtosForState, RtoOfficeRecord } from '../../data/rtoOfficesData';

interface SearchableRtoSelectProps {
  selectedState: string;
  selectedRtoCode?: string;
  selectedRtoOffice?: string;
  onSelectRto: (rto: RtoOfficeRecord | null) => void;
  className?: string;
}

export const SearchableRtoSelect: React.FC<SearchableRtoSelectProps> = ({
  selectedState,
  selectedRtoCode,
  selectedRtoOffice,
  onSelectRto,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const stateRtos = useMemo(() => getRtosForState(selectedState), [selectedState]);

  const filteredRtos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return stateRtos;
    return stateRtos.filter(
      (r) =>
        r.code.toLowerCase().includes(q) ||
        r.displayCode.toLowerCase().includes(q) ||
        r.officeName.toLowerCase().includes(q) ||
        r.districtOrCity.toLowerCase().includes(q) ||
        r.officeType.toLowerCase().includes(q)
    );
  }, [stateRtos, searchQuery]);

  const currentRto = useMemo(() => {
    if (!selectedRtoCode) return null;
    const clean = selectedRtoCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    return stateRtos.find((r) => r.code === clean) || null;
  }, [selectedRtoCode, stateRtos]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
        RTO / DTO Registration Office ({selectedState || 'Select State'})
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 bg-dark-800 border border-slate-700 hover:border-cyan-500/50 rounded-xl px-3.5 py-2 text-sm text-left text-white transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
          {currentRto ? (
            <span className="truncate">
              <strong className="font-mono text-cyan-300">{currentRto.code}</strong> — {currentRto.officeName} ({currentRto.districtOrCity})
            </span>
          ) : selectedRtoCode ? (
            <span className="truncate">
              <strong className="font-mono text-cyan-300">{selectedRtoCode}</strong>
              {selectedRtoOffice ? ` — ${selectedRtoOffice}` : ''}
            </span>
          ) : (
            <span className="text-slate-400 truncate">
              {stateRtos.length > 0
                ? `Search ${selectedState} RTO/DTO (${stateRtos.length} offices available)...`
                : `No preloaded RTOs for ${selectedState || 'this state'}`}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-dark-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-slate-800 bg-dark-950/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by code (RJ14, RJ45), district, or RTO/DTO..."
                className="w-full bg-dark-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
            {filteredRtos.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching RTO/DTO offices found for {selectedState || 'selected state'}.
              </div>
            ) : (
              filteredRtos.map((rto) => {
                const isSelected = currentRto?.code === rto.code;
                return (
                  <button
                    key={rto.code}
                    type="button"
                    onClick={() => {
                      onSelectRto(rto);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between gap-2 hover:bg-dark-800 transition-colors ${
                      isSelected ? 'bg-cyan-500/10' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-cyan-300">
                          {rto.code}
                        </span>
                        <span className="text-xs font-semibold text-white truncate">
                          {rto.officeName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-dark-850 border border-slate-700 text-[10px] font-bold text-slate-300">
                          {rto.officeType}
                        </span>
                        {rto.verificationStatus === 'Pending Official Verification' && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-medium text-amber-300 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> Pending Official Verification
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {rto.districtOrCity}, {rto.stateName}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
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
