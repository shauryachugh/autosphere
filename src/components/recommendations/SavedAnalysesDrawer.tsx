import React from 'react';
import { 
  X, 
  History, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Car,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatINR, formatDate } from '../../utils/formatters';
import { SavedRecommendationAnalysis } from '../../types/replacement.types';

interface SavedAnalysesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analyses: SavedRecommendationAnalysis[];
  onLoadAnalysis: (analysis: SavedRecommendationAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
}

export const SavedAnalysesDrawer: React.FC<SavedAnalysesDrawerProps> = ({
  isOpen,
  onClose,
  analyses,
  onLoadAnalysis,
  onDeleteAnalysis,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-dark-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-full bg-dark-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <History className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Saved Replacement Analyses</h3>
              <p className="text-xs text-slate-400">Past evaluated vehicle ownership audits</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analyses List */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {analyses.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <History className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No Saved Analyses Yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Complete a smart car replacement analysis and click "Save Analysis to Profile" to store it securely in Supabase.
              </p>
            </div>
          ) : (
            analyses.map((item) => {
              const carData = item.currentVehicleData;
              const verdictBadge =
                item.verdict === 'KEEP_CURRENT'
                  ? { variant: 'success' as const, label: 'KEEP CAR' }
                  : item.verdict === 'CONSIDER_UPGRADING'
                  ? { variant: 'warning' as const, label: 'CONSIDER UPGRADE' }
                  : { variant: 'electric' as const, label: 'REPLACE NOW' };

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-dark-850 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {carData.make} {carData.model}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-dark-800 text-slate-300 border border-slate-700">
                          {carData.fuelType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {carData.variant} ({carData.manufacturingYear}) • {carData.city}
                      </p>
                    </div>

                    <Badge variant={verdictBadge.variant} size="xs">
                      {verdictBadge.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 text-slate-300 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Current 5-Yr TCO:</span>
                      <span>{formatINR(item.currentCarTCO.fiveYearTotalOwnershipCost)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">5-Yr Net Variance:</span>
                      <span className={item.fiveYearNetDifference <= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                        {item.fiveYearNetDifference <= 0
                          ? `Saves ${formatINR(Math.abs(item.fiveYearNetDifference))}`
                          : `+${formatINR(item.fiveYearNetDifference)}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.createdAt)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDeleteAnalysis(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete saved analysis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <Button
                        onClick={() => {
                          onLoadAnalysis(item);
                          onClose();
                        }}
                        variant="primary"
                        size="sm"
                        icon={<ExternalLink className="w-3 h-3" />}
                      >
                        Load Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-dark-950/60 text-center">
          <Button onClick={onClose} variant="outline" size="sm" className="w-full">
            Close Saved Analyses
          </Button>
        </div>
      </div>
    </div>
  );
};
