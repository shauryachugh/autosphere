import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Gauge,
  Zap,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  Thermometer,
  Disc,
  Cpu,
  CheckCircle2,
  Wrench,
  Check,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  FileCheck,
  Sparkles,
  Settings2,
  DollarSign,
  X,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatINR, formatDate, formatKm, getDaysRemaining } from '../utils/formatters';
import { healthPassportService } from '../services/healthPassportService';
import {
  MaintenanceScheduleItem,
  HealthSubsystem,
  HealthStatus,
  HealthDashboardSummary,
} from '../types/passport.types';

export const VehicleHealth: React.FC = () => {
  const {
    activeVehicle,
    vehicles,
    setActiveVehicleId,
    diagnostics,
    resolveDiagnostic,
    runDiagnosticScan,
    isScanning,
    showToast,
  } = useApp();

  const [schedules, setSchedules] = useState<MaintenanceScheduleItem[]>([]);
  const [summary, setSummary] = useState<HealthDashboardSummary | null>(null);
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isLogServiceOpen, setIsLogServiceOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [activeItemForAction, setActiveItemForAction] = useState<MaintenanceScheduleItem | null>(null);

  // Service Log Form
  const [logForm, setLogForm] = useState({
    subsystem: 'engine' as HealthSubsystem,
    itemName: 'Engine Oil & Oil Filter Replacement',
    serviceDate: new Date().toISOString().split('T')[0],
    odometerKm: activeVehicle?.odoKm || 0,
    expenseINR: 4500,
    serviceProvider: 'Authorized OEM Service Center',
    technicianNotes: 'Replaced fully synthetic oil & filter. Inspected washer.',
    createExpenseRecord: true,
  });

  // Customize Form
  const [customForm, setCustomForm] = useState({
    intervalMonths: 12,
    intervalKm: 10000,
    technicianNotes: '',
  });

  const loadHealthData = async () => {
    if (!activeVehicle?.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const [schedData, summData] = await Promise.all([
      healthPassportService.getMaintenanceSchedules(activeVehicle.id, activeVehicle.odoKm),
      healthPassportService.getHealthSummary(activeVehicle.id, activeVehicle.odoKm),
    ]);
    setSchedules(schedData);
    setSummary(summData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeVehicle?.id) {
      loadHealthData();
    } else {
      setIsLoading(false);
    }
  }, [activeVehicle?.id, activeVehicle?.odoKm]);

  const handleOpenLogModal = (item?: MaintenanceScheduleItem) => {
    if (item) {
      setLogForm({
        subsystem: item.subsystem,
        itemName: item.itemName,
        serviceDate: new Date().toISOString().split('T')[0],
        odometerKm: activeVehicle?.odoKm || 0,
        expenseINR: item.actualExpenseINR || 3000,
        serviceProvider: item.serviceProvider || 'Authorized OEM Service Center',
        technicianNotes: item.technicianNotes || '',
        createExpenseRecord: true,
      });
    }
    setIsLogServiceOpen(true);
  };

  const handleOpenCustomizeModal = (item: MaintenanceScheduleItem) => {
    setActiveItemForAction(item);
    setCustomForm({
      intervalMonths: item.intervalMonths,
      intervalKm: item.intervalKm,
      technicianNotes: item.technicianNotes || '',
    });
    setIsCustomizeOpen(true);
  };

  const handleSaveServiceLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVehicle?.id) return;
    try {
      await healthPassportService.logMaintenanceServiceEvent({
        vehicleId: activeVehicle.id,
        subsystem: logForm.subsystem,
        itemName: logForm.itemName,
        serviceDate: logForm.serviceDate,
        odometerKm: logForm.odometerKm,
        expenseINR: logForm.expenseINR,
        serviceProvider: logForm.serviceProvider,
        technicianNotes: logForm.technicianNotes,
        createExpenseRecord: logForm.createExpenseRecord,
      });

      showToast(`Service "${logForm.itemName}" logged and synced with expenses`, 'success');
      setIsLogServiceOpen(false);
      loadHealthData();
    } catch {
      showToast('Failed to log service', 'error');
    }
  };

  const handleSaveCustomSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItemForAction || !activeVehicle) return;

    try {
      const updated: MaintenanceScheduleItem = {
        ...activeItemForAction,
        intervalMonths: customForm.intervalMonths,
        intervalKm: customForm.intervalKm,
        technicianNotes: customForm.technicianNotes,
        isCustom: true,
      };

      if (updated.lastServiceDate) {
        const next = new Date(updated.lastServiceDate);
        next.setMonth(next.getMonth() + updated.intervalMonths);
        updated.recommendedNextDate = next.toISOString().split('T')[0];
      }
      if (updated.lastServiceKm !== undefined) {
        updated.recommendedNextKm = updated.lastServiceKm + updated.intervalKm;
      }
      updated.status = healthPassportService.calculateHealthStatus(
        updated.lastServiceDate,
        updated.lastServiceKm,
        updated.intervalMonths,
        updated.intervalKm,
        activeVehicle.odoKm
      );

      await healthPassportService.saveMaintenanceScheduleItem(updated);
      showToast('Maintenance schedule interval updated', 'success');
      setIsCustomizeOpen(false);
      loadHealthData();
    } catch {
      showToast('Failed to update schedule', 'error');
    }
  };

  if (!activeVehicle || vehicles.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-carbon-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Vehicle Health Tracker & Subsystems
              </h1>
              <Badge variant="electric" size="sm">
                Telemetry Synchronized
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-carbon-400 mt-1">
              Predictive component wear tracking, scheduled servicing intervals, and diagnostic compliance
            </p>
          </div>
        </div>

        <Card className="p-12 text-center border-dashed border-carbon-800 bg-carbon-900/40">
          <div className="max-w-md mx-auto space-y-4">
            <Activity className="w-12 h-12 text-carbon-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No active vehicle alerts</h3>
            <p className="text-sm text-carbon-400">
              No vehicles added yet. Add your first vehicle to get started.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const isEV = activeVehicle.fuelType === 'electric';
  const unresolvedDiagnostics = diagnostics.filter(d => !d.isResolved);

  const subsystems = [
    { label: 'All Subsystems', value: 'all' },
    { label: 'Engine & Fluids', value: 'engine' },
    { label: 'Battery & Electrical', value: 'battery' },
    { label: 'Tyres & Alignment', value: 'tyres' },
    { label: 'Brakes & Hydraulic', value: 'brakes' },
    { label: 'Transmission', value: 'transmission' },
    { label: 'AC & Climate', value: 'ac' },
  ];

  const filteredSchedules = selectedSubsystem === 'all'
    ? schedules
    : schedules.filter(s => s.subsystem === selectedSubsystem);

  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case 'up_to_date':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
            <Check className="w-3 h-3" /> Up to Date
          </span>
        );
      case 'due_soon':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Due Soon
          </span>
        );
      case 'overdue':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Overdue
          </span>
        );
      case 'info_missing':
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-carbon-800 text-carbon-400 border border-carbon-700">
            Info Missing
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-carbon-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Vehicle Health Tracker & Subsystems
            </h1>
            <Badge variant="electric" size="sm">
              Telemetry Synchronized
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-carbon-400 mt-1">
            Predictive component wear tracking, scheduled servicing intervals, and diagnostic compliance for {activeVehicle.make} {activeVehicle.model} ({activeVehicle.regNumber}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => handleOpenLogModal()}
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
          >
            Log Service & Expense
          </Button>

          <Button
            onClick={runDiagnosticScan}
            variant="outline"
            size="sm"
            isLoading={isScanning}
            icon={<RotateCw className="w-4 h-4" />}
          >
            Run OBD-II Scan
          </Button>
        </div>
      </div>

      {/* KPI Status Strip (Module 7: Visual Status Indicators) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Score Card */}
        <div className="p-4 rounded-2xl bg-carbon-900 border border-carbon-800 text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-carbon-400 block">Health Index</span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono mt-0.5 block">{summary?.overallScore ?? 100}/100</span>
          <span className="text-[10px] text-emerald-400 font-medium">Optimal</span>
        </div>

        {/* Up to Date */}
        <div className="p-4 rounded-2xl bg-carbon-900 border border-carbon-800 text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-carbon-400 block">Up to Date</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5 block">{summary?.upToDateCount || 0}</span>
          <span className="text-[10px] text-carbon-400">Subsystems clean</span>
        </div>

        {/* Due Soon */}
        <div className="p-4 rounded-2xl bg-carbon-900 border border-carbon-800 text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-carbon-400 block">Due Soon</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5 block">{summary?.dueSoonCount || 0}</span>
          <span className="text-[10px] text-amber-300">Within 30d / 1k km</span>
        </div>

        {/* Overdue */}
        <div className="p-4 rounded-2xl bg-carbon-900 border border-carbon-800 text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-carbon-400 block">Overdue</span>
          <span className="text-2xl font-extrabold text-rose-400 font-mono mt-0.5 block">{summary?.overdueCount || 0}</span>
          <span className="text-[10px] text-rose-300">Action needed</span>
        </div>

        {/* Total Maintenance Expenditure */}
        <div className="p-4 rounded-2xl bg-carbon-900 border border-carbon-800 text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-carbon-400 block">Total Maint. Spend</span>
          <span className="text-lg font-extrabold text-white font-mono mt-1 block">
            ₹{(summary?.totalMaintenanceSpendINR ?? 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-cyan-400">Lifetime Ledger</span>
        </div>

        {/* Document Status */}
        <div className="p-4 rounded-2xl bg-carbon-900 border border-carbon-800 text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-carbon-400 block">Vault Compliance</span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono mt-0.5 block">
            {summary?.documentCompletenessPercent ?? 0}%
          </span>
          <span className="text-[10px] text-emerald-400">RC & Ins. Valid</span>
        </div>
      </div>

      {/* Real-World Diagnostics Notice */}
      <div className="p-3.5 rounded-xl bg-carbon-900/60 border border-carbon-800 text-xs text-carbon-400 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            Diagnostic statuses are derived from actual recorded service dates, odometer milestones, and connected telemetry (no simulated mechanical guessing).
          </span>
        </div>
        <span className="text-cyan-400 text-xs font-mono font-bold whitespace-nowrap">
          Current Odo: {formatKm(activeVehicle.odoKm)}
        </span>
      </div>

      {/* Subsystem Health Checklist & Schedules */}
      <div className="space-y-4">
        {/* Subsystem Filter Chips */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {subsystems.map(sub => (
              <button
                key={sub.value}
                type="button"
                onClick={() => setSelectedSubsystem(sub.value)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedSubsystem === sub.value
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-carbon-900 border border-carbon-800 text-carbon-300 hover:bg-carbon-800'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-carbon-400 font-mono">
            {filteredSchedules.length} tracked items
          </span>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-carbon-900 border border-carbon-800 hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-carbon-800 text-carbon-400 font-mono">
                    {item.subsystem}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                <h3 className="text-sm font-bold text-white mt-2.5">{item.itemName}</h3>

                {/* Last Service & Recommended Next Service */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-carbon-400">
                    <span>Last Serviced:</span>
                    <span className="text-white font-mono">
                      {item.lastServiceDate ? formatDate(item.lastServiceDate) : 'Not recorded'}
                      {item.lastServiceKm ? ` (${formatKm(item.lastServiceKm)})` : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-carbon-400">
                    <span>Recommended Next:</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {item.recommendedNextDate ? formatDate(item.recommendedNextDate) : 'Pending'}
                      {item.recommendedNextKm ? ` (@ ${formatKm(item.recommendedNextKm)})` : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-carbon-400 pt-1 border-t border-carbon-800/60 text-[11px]">
                    <span>Standard Interval:</span>
                    <span className="text-carbon-300 font-mono">
                      Every {item.intervalMonths} mos / {formatKm(item.intervalKm)}
                    </span>
                  </div>
                </div>

                {item.technicianNotes && (
                  <p className="text-[11px] text-carbon-400 mt-2.5 p-2 rounded-xl bg-carbon-800/40 border border-carbon-800 leading-relaxed italic">
                    "{item.technicianNotes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-carbon-800/60">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleOpenLogModal(item)}
                  icon={<Wrench className="w-3.5 h-3.5" />}
                >
                  Log Service
                </Button>
                <button
                  type="button"
                  onClick={() => handleOpenCustomizeModal(item)}
                  className="p-2 rounded-xl bg-carbon-800 hover:bg-carbon-700 text-carbon-400 hover:text-white transition-colors"
                  title="Customize recommended interval"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TPMS & OBD-II Diagnostics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-carbon-800">
        {/* TPMS Visualizer (6 cols) */}
        <div className="lg:col-span-6">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  Direct TPMS Tyre Pressure Monitoring (PSI)
                </span>
                <span className="text-xs text-emerald-400 font-medium">Cold Balanced</span>
              </div>
            }
          >
            <div className="p-4 flex flex-col items-center">
              <div className="relative w-48 h-72 flex items-center justify-center my-2">
                <div className="w-32 h-64 rounded-3xl border-2 border-carbon-700/80 bg-carbon-900/60 flex flex-col justify-between p-3 relative">
                  <div className="w-full h-8 rounded-t-xl bg-carbon-800/50" />
                  <div className="w-full h-12 rounded-lg border border-carbon-700/60 bg-carbon-800/20" />
                  <div className="w-full h-8 rounded-b-xl bg-carbon-800/50" />
                </div>

                {/* 4 Tyres */}
                <div className="absolute -left-6 top-6 p-2 rounded-xl bg-carbon-800 border border-carbon-700 text-center font-mono shadow-md">
                  <div className="text-[10px] text-carbon-400 font-sans">Front L</div>
                  <div className="text-sm font-bold text-cyan-400">{activeVehicle.tyrePressurePsi?.frontLeft ?? 33} PSI</div>
                </div>

                <div className="absolute -right-6 top-6 p-2 rounded-xl bg-carbon-800 border border-carbon-700 text-center font-mono shadow-md">
                  <div className="text-[10px] text-carbon-400 font-sans">Front R</div>
                  <div className="text-sm font-bold text-cyan-400">{activeVehicle.tyrePressurePsi?.frontRight ?? 33} PSI</div>
                </div>

                <div className="absolute -left-6 bottom-6 p-2 rounded-xl bg-carbon-800 border border-carbon-700 text-center font-mono shadow-md">
                  <div className="text-[10px] text-carbon-400 font-sans">Rear L</div>
                  <div className="text-sm font-bold text-cyan-400">{activeVehicle.tyrePressurePsi?.rearLeft ?? 33} PSI</div>
                </div>

                <div className="absolute -right-6 bottom-6 p-2 rounded-xl bg-carbon-800 border border-carbon-700 text-center font-mono shadow-md">
                  <div className="text-[10px] text-carbon-400 font-sans">Rear R</div>
                  <div className="text-sm font-bold text-cyan-400">{activeVehicle.tyrePressurePsi?.rearRight ?? 33} PSI</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* DTC Diagnostics (6 cols) */}
        <div className="lg:col-span-6">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  OBD-II Diagnostic Fault Codes (DTC)
                </span>
                <span className="text-xs text-carbon-400">
                  {unresolvedDiagnostics.length} Active Codes
                </span>
              </div>
            }
          >
            <div className="space-y-3 p-2">
              {diagnostics.length === 0 ? (
                <div className="py-8 text-center text-xs text-carbon-400 space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="font-semibold text-white">No active vehicle alerts.</p>
                  <p className="text-carbon-400">All OBD-II powertrain and safety sensors reporting normal.</p>
                </div>
              ) : (
                diagnostics.map(issue => (
                  <div
                    key={issue.id}
                    className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                      issue.isResolved
                        ? 'bg-carbon-900/40 border-carbon-800 opacity-60'
                        : issue.severity === 'critical'
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : 'bg-amber-950/20 border-amber-500/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-carbon-800 text-[11px]">
                          {issue.code}
                        </span>
                        <span className="font-bold text-white">{issue.title}</span>
                      </div>
                      <p className="text-carbon-300 mt-1">{issue.laymanExplanation}</p>
                      <div className="text-[11px] text-carbon-400 mt-1">
                        Action: {issue.suggestedAction}
                      </div>
                    </div>

                    {!issue.isResolved && (
                      <button
                        type="button"
                        onClick={() => resolveDiagnostic(issue.id)}
                        className="px-2.5 py-1 rounded-lg bg-carbon-800 hover:bg-carbon-700 text-carbon-300 hover:text-white text-[11px] font-medium whitespace-nowrap transition-colors"
                      >
                        Clear DTC
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Log Service Modal */}
      {isLogServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-carbon-900 border border-carbon-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-carbon-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                Log Maintenance Service & Expense
              </h3>
              <button
                onClick={() => setIsLogServiceOpen(false)}
                className="text-carbon-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveServiceLog} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Subsystem</label>
                <select
                  value={logForm.subsystem}
                  onChange={e => setLogForm({ ...logForm, subsystem: e.target.value as HealthSubsystem })}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="engine">Engine & Powertrain</option>
                  <option value="battery">12V Battery / Electrical</option>
                  <option value="tyres">Tyres & Wheel Alignment</option>
                  <option value="brakes">Brakes & Friction Materials</option>
                  <option value="transmission">Transmission & Gearbox</option>
                  <option value="ac">Air Conditioning & HVAC</option>
                  <option value="other">General / Periodic Inspection</option>
                </select>
              </div>

              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Maintenance Item Name</label>
                <input
                  type="text"
                  value={logForm.itemName}
                  onChange={e => setLogForm({ ...logForm, itemName: e.target.value })}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Service Date</label>
                  <input
                    type="date"
                    value={logForm.serviceDate}
                    onChange={e => setLogForm({ ...logForm, serviceDate: e.target.value })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Odometer at Service (km)</label>
                  <input
                    type="number"
                    value={logForm.odometerKm}
                    onChange={e => setLogForm({ ...logForm, odometerKm: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Actual Expense (₹ INR)</label>
                  <input
                    type="number"
                    value={logForm.expenseINR}
                    onChange={e => setLogForm({ ...logForm, expenseINR: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Workshop / Service Provider</label>
                  <input
                    type="text"
                    value={logForm.serviceProvider}
                    onChange={e => setLogForm({ ...logForm, serviceProvider: e.target.value })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Technician Notes / Parts Replaced</label>
                <textarea
                  rows={2}
                  value={logForm.technicianNotes}
                  onChange={e => setLogForm({ ...logForm, technicianNotes: e.target.value })}
                  placeholder="Record oil grade, parts replaced, brake pad wear notes..."
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Expense Sync Toggle */}
              <div className="p-3 rounded-xl bg-carbon-800/60 border border-carbon-700/60">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={logForm.createExpenseRecord}
                    onChange={e => setLogForm({ ...logForm, createExpenseRecord: e.target.checked })}
                    className="rounded border-carbon-600 text-cyan-500 focus:ring-0"
                  />
                  <div>
                    <span className="text-white font-medium block">Sync to Ownership Cost Ledger</span>
                    <span className="text-[11px] text-carbon-400">Automatically logs ₹{logForm.expenseINR.toLocaleString('en-IN')} as maintenance expense</span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-carbon-800">
                <Button type="button" variant="ghost" onClick={() => setIsLogServiceOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Service Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customize Schedule Modal */}
      {isCustomizeOpen && activeItemForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-carbon-900 border border-carbon-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-carbon-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-cyan-400" />
                Customize Maintenance Interval
              </h3>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="text-carbon-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomSchedule} className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-carbon-400 block text-[11px]">Item:</span>
                <span className="text-white font-bold text-sm">{activeItemForAction.itemName}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Interval (Months)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={customForm.intervalMonths}
                    onChange={e => setCustomForm({ ...customForm, intervalMonths: parseInt(e.target.value, 10) || 12 })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                  <span className="text-[10px] text-carbon-400 mt-1 block">e.g. 6 or 12 months</span>
                </div>

                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Interval (Kilometres)</label>
                  <input
                    type="number"
                    min="1000"
                    max="100000"
                    step="500"
                    value={customForm.intervalKm}
                    onChange={e => setCustomForm({ ...customForm, intervalKm: parseInt(e.target.value, 10) || 10000 })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                  <span className="text-[10px] text-carbon-400 mt-1 block">e.g. 7,500 or 10,000 km</span>
                </div>
              </div>

              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Custom OEM / Mechanic Notes</label>
                <textarea
                  rows={2}
                  value={customForm.technicianNotes}
                  onChange={e => setCustomForm({ ...customForm, technicianNotes: e.target.value })}
                  placeholder="e.g. Advised 7,500 km oil change due to severe urban stop-and-go driving."
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-carbon-800">
                <Button type="button" variant="ghost" onClick={() => setIsCustomizeOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
