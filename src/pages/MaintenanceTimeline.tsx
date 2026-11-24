import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Filter,
  Wrench,
  ShieldCheck,
  Fuel,
  FileCheck,
  Calendar,
  Layers,
  ArrowDownUp,
  Download,
  DollarSign,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatINR, formatKm, formatDate } from '../utils/formatters';
import { healthPassportService } from '../services/healthPassportService';
import { MaintenanceTimelineEvent, TimelineActivityCategory } from '../types/passport.types';

export const MaintenanceTimeline: React.FC = () => {
  const { activeVehicle, vehicles, setActiveVehicleId, showToast } = useApp();
  const [timelineEvents, setTimelineEvents] = useState<MaintenanceTimelineEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    healthPassportService.getTimelineEvents(activeVehicle.id, selectedCategory).then(events => {
      if (mounted) {
        setTimelineEvents(events);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [activeVehicle.id, selectedCategory]);

  const categories: { label: string; value: string; icon: any }[] = [
    { label: 'All Activities', value: 'all', icon: Layers },
    { label: 'Periodic Service', value: 'service', icon: Wrench },
    { label: 'Parts & Repairs', value: 'part_replacement', icon: Wrench },
    { label: 'Insurance Renewals', value: 'insurance', icon: ShieldCheck },
    { label: 'PUC Tests', value: 'puc', icon: FileCheck },
    { label: 'Fuel Fill-ups', value: 'fuel', icon: Fuel },
  ];

  const getCategoryBadge = (category: TimelineActivityCategory) => {
    switch (category) {
      case 'service':
        return <Badge variant="electric" size="sm">Service</Badge>;
      case 'insurance':
        return <Badge variant="success" size="sm">Insurance</Badge>;
      case 'puc':
        return <Badge variant="neutral" size="sm">PUC Test</Badge>;
      case 'part_replacement':
        return <Badge variant="warning" size="sm">Replacement</Badge>;
      case 'repair':
        return <Badge variant="danger" size="sm">Repair</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-carbon-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Maintenance Timeline & Vehicle History
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">
              {activeVehicle.make} {activeVehicle.model} ({activeVehicle.regNumber})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-carbon-400 mt-1">
            Chronological audit ledger of periodic services, component replacements, insurance renewals and statutory compliance tests.
          </p>
        </div>

        {/* Vehicle Selector */}
        {vehicles.length > 1 && (
          <select
            value={activeVehicle.id}
            onChange={e => setActiveVehicleId(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.make} {v.model} ({v.regNumber})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map(c => {
          const Icon = c.icon;
          const isSelected = selectedCategory === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-carbon-900 border border-carbon-800 text-carbon-300 hover:bg-carbon-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Chronological Stream */}
      {isLoading ? (
        <div className="py-20 text-center text-carbon-400">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Loading historical timeline records...</p>
        </div>
      ) : timelineEvents.length > 0 ? (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-carbon-800">
          {timelineEvents.map((event, idx) => (
            <div key={event.id || idx} className="relative group">
              {/* Timeline Pin Node */}
              <div className="absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full bg-carbon-900 border-2 border-cyan-500 flex items-center justify-center group-hover:scale-125 transition-transform shadow-glow-subtle">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>

              {/* Event Card */}
              <div className="p-5 rounded-2xl bg-carbon-900 border border-carbon-800 hover:border-cyan-500/40 transition-colors shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {getCategoryBadge(event.category)}
                    <h3 className="text-sm font-bold text-white">{event.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-carbon-400 font-mono">
                    {event.odometerKm && <span>{formatKm(event.odometerKm)}</span>}
                    <span>•</span>
                    <span className="flex items-center gap-1 text-carbon-300">
                      <Calendar className="w-3 h-3 text-carbon-400" /> {formatDate(event.date)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-carbon-300 leading-relaxed">
                  {event.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-carbon-800/60 text-xs">
                  <span className="text-carbon-400">
                    {event.serviceProvider ? `Facility: ${event.serviceProvider}` : 'Logged by vehicle owner'}
                  </span>

                  {event.amountINR !== undefined && (
                    <span className="font-bold text-white font-mono">
                      Expense: ₹{event.amountINR.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-carbon-900 border border-carbon-800 space-y-2">
          <Clock className="w-8 h-8 text-carbon-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">No Activities Recorded</h4>
          <p className="text-xs text-carbon-400">No events matched the selected filter.</p>
        </div>
      )}
    </div>
  );
};
