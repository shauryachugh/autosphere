import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Fuel, 
  Zap, 
  Activity, 
  Wrench, 
  Coins, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  ArrowRight, 
  PlusCircle, 
  Gauge, 
  Radio, 
  AlertTriangle,
  ChevronRight,
  IndianRupee,
  CarFront,
  Bell,
  Award,
  FileText,
  CheckCircle2,
  Clock,
  Check,
  ShoppingBag,
  Tag
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { NumberPlate } from '../components/common/NumberPlate';
import { formatINR, formatKm, formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { healthPassportService } from '../services/healthPassportService';
import { VehicleReminder } from '../types/passport.types';

export const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { 
    activeVehicle, 
    vehicles,
    activeVehicleExpenses, 
    diagnostics, 
    runDiagnosticScan, 
    isScanning,
    openLogExpense, 
    openBookService, 
    openValuation,
    openAddVehicle,
    userProfile,
    isVehiclesLoading
  } = useApp();

  // Show loading skeleton while vehicles are being retrieved
  if (isVehiclesLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="h-8 w-48 bg-dark-800 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-64 bg-dark-850 rounded animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-dark-800 rounded-lg animate-pulse" />
        </div>
        <Card>
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center animate-spin">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Loading Vehicle Telematics...</h3>
            <p className="text-sm text-slate-400">
              Synchronizing OBD-II diagnostics, fuel economy and garage records from database...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // If user has no vehicles yet, show guided onboarding state
  if (!activeVehicle || vehicles.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to AutoSphere
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              India-wide connected automotive intelligence platform
            </p>
          </div>
          <Button onClick={openAddVehicle} variant="primary" icon={<PlusCircle className="w-4 h-4" />}>
            Add Vehicle
          </Button>
        </div>

        <Card>
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center shadow-glow-subtle">
              <CarFront className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Your Garage is Empty</h3>
            <p className="text-sm text-slate-400">
              Register your vehicle to unlock real-time fuel & battery telemetry, predictive maintenance alerts, and lifecycle cost tracking.
            </p>
            <Button onClick={openAddVehicle} variant="primary" icon={<PlusCircle className="w-4 h-4" />}>
              Register Your First Vehicle
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Monthly expenditure calculation
  const currentMonth = '2026-11';
  const monthlyExpenses = activeVehicleExpenses.filter((e) => e.date.startsWith(currentMonth));
  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amountINR, 0);

  // Annual expenditure calculation
  const currentYear = '2026';
  const annualExpenses = activeVehicleExpenses.filter((e) => e.date.startsWith(currentYear));
  const annualTotal = annualExpenses.reduce((sum, e) => sum + e.amountINR, 0);

  // Health and alerts
  const activeAlerts = diagnostics.filter((d) => !d.isResolved && d.severity !== 'info');
  const isEV = activeVehicle.fuelType === 'electric';

  // Smart Compliance & Service Reminders
  const [reminders, setReminders] = React.useState<VehicleReminder[]>([]);

  React.useEffect(() => {
    if (activeVehicle?.id) {
      healthPassportService.getReminders(activeVehicle.id).then(setReminders);
    }
  }, [activeVehicle?.id]);

  const handleCompleteReminder = async (remId: string) => {
    if (!activeVehicle?.id) return;
    await healthPassportService.markReminderComplete(activeVehicle.id, remId);
    const updated = await healthPassportService.getReminders(activeVehicle.id);
    setReminders(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome & Quick Status Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || userProfile?.name?.split(' ')[0] || 'Driver'}
            </h1>
            <span className="p-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time automotive intelligence briefing for <span className="text-white font-medium">{activeVehicle.make} {activeVehicle.model}</span> ({activeVehicle.city})
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={openLogExpense}
            variant="primary"
            size="sm"
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Log Expense
          </Button>
          <Button
            onClick={openBookService}
            variant="secondary"
            size="sm"
            icon={<Wrench className="w-4 h-4 text-sky-400" />}
          >
            Book Service
          </Button>
          <Link to="/passport">
            <Button
              variant="outline"
              size="sm"
              icon={<Award className="w-4 h-4 text-cyan-400" />}
            >
              Passport
            </Button>
          </Link>
          <Link to="/documents">
            <Button
              variant="outline"
              size="sm"
              icon={<FileText className="w-4 h-4 text-purple-400" />}
            >
              Vault
            </Button>
          </Link>
          <Button
            onClick={openValuation}
            variant="outline"
            size="sm"
            icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
          >
            Market Value
          </Button>
          <Button
            onClick={runDiagnosticScan}
            variant="ghost"
            size="sm"
            isLoading={isScanning}
            icon={<Activity className="w-4 h-4 text-cyan-400" />}
          >
            Run OBD Scan
          </Button>
        </div>
      </div>

      {/* Hero Vehicle Telematics Showcase Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 shadow-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Vehicle Image & Specs */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={isEV ? 'success' : 'info'} size="xs" dot>
                    {isEV ? 'Electric Vehicle' : `${activeVehicle.fuelType.toUpperCase()} POWER`}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">
                    {activeVehicle.year} Model
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {activeVehicle.make} {activeVehicle.model}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {activeVehicle.variant}
                </p>
              </div>

              <NumberPlate
                registrationNumber={activeVehicle.regNumber}
                isEV={isEV}
                size="md"
              />
            </div>

            {/* Vehicle Photo with glowing border */}
            <div className="relative rounded-xl overflow-hidden border border-slate-700/80 aspect-video max-h-52 group">
              <img
                src={activeVehicle.image}
                alt={`${activeVehicle.make} ${activeVehicle.model}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-dark-950/80 backdrop-blur-md border border-slate-800">
                <span className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  {activeVehicle.connectedCarPlatform || 'Connected Telematics'}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {formatKm(activeVehicle.odoKm)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Live Telematics Gauge Cluster */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Metric 1: Fuel / Battery Level */}
            <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{isEV ? 'State of Charge' : 'Fuel Tank'}</span>
                {isEV ? (
                  <Zap className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Fuel className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                {activeVehicle.currentFuelPercent}%
              </div>
              <div className="w-full bg-dark-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    activeVehicle.currentFuelPercent > 25
                      ? isEV
                        ? 'bg-emerald-400'
                        : 'bg-cyan-400'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${activeVehicle.currentFuelPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Est. Range: <strong className="text-slate-200">{activeVehicle.estimatedRangeKm} km</strong>
              </span>
            </div>

            {/* Metric 2: Vehicle Health Score */}
            <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>OBD Health Score</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                {activeVehicle.healthScore}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <div className="w-full bg-dark-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${activeVehicle.healthScore}%` }}
                />
              </div>
              <span className="text-[10px] text-emerald-400 mt-1 block font-medium">
                {activeVehicle.healthScore >= 90 ? 'Optimal Condition' : 'Attention Needed'}
              </span>
            </div>

            {/* Metric 3: Tyre Pressure (TPMS) */}
            <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>TPMS (Cold PSI)</span>
                <Gauge className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                {activeVehicle.tyrePressurePsi?.frontLeft ?? 33} <span className="text-xs text-slate-400 font-normal">PSI</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 space-y-0.5">
                <div className="flex justify-between">
                  <span>FL: {activeVehicle.tyrePressurePsi?.frontLeft ?? 33} PSI</span>
                  <span>FR: {activeVehicle.tyrePressurePsi?.frontRight ?? 33} PSI</span>
                </div>
                <div className="flex justify-between">
                  <span>RL: {activeVehicle.tyrePressurePsi?.rearLeft ?? 33} PSI</span>
                  <span>RR: {activeVehicle.tyrePressurePsi?.rearRight ?? 33} PSI</span>
                </div>
              </div>
            </div>

            {/* Metric 4: Real-World Efficiency */}
            <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Avg Efficiency</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-white font-mono">
                {activeVehicle.avgEfficiency}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Last calculated over 450 km
              </span>
            </div>

            {/* Metric 5: Next Scheduled Service */}
            <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Service Due</span>
                <Calendar className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-sm font-bold text-white font-mono truncate">
                {formatDate(activeVehicle.nextServiceDueDate)}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                At {formatKm(activeVehicle.nextServiceDueKm)}
              </span>
            </div>

            {/* Metric 6: FASTag Balance */}
            <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>FASTag Wallet</span>
                <IndianRupee className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-white font-mono">
                {formatINR(activeVehicle.fastagBalanceINR)}
              </div>
              <span className="text-[10px] text-emerald-400 mt-1 block font-medium">
                Active & Linked (NHAI)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Expenditure & Health Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="November 2026 Expenses"
          value={formatINR(monthlyTotal)}
          subtitle="Fuel, tolls & maintenance"
          icon={<IndianRupee className="w-5 h-5" />}
          trend={{ value: '14%', isPositive: true, period: 'vs Oct' }}
          accentColor="cyan"
          onClick={openLogExpense}
        />

        <StatCard
          title="2026 Annual Ownership (TCO)"
          value={formatINR(annualTotal)}
          subtitle="Total operational spend"
          icon={<Coins className="w-5 h-5" />}
          trend={{ value: '₹6.4 / km', isNeutral: true }}
          accentColor="indigo"
        />

        <StatCard
          title="OBD Diagnostics"
          value={activeAlerts.length === 0 ? 'Healthy' : `${activeAlerts.length} Attention`}
          subtitle={activeAlerts.length === 0 ? 'Zero active trouble codes' : 'DPF soot notice'}
          icon={<Activity className="w-5 h-5" />}
          trend={{ value: 'OBD-II', isNeutral: true }}
          accentColor={activeAlerts.length === 0 ? 'emerald' : 'amber'}
        />

        <StatCard
          title="Resale Fair Market Value"
          value={formatINR(
            activeVehicle.purchasePriceINR
              ? Math.round(activeVehicle.purchasePriceINR * Math.max(0.4, 1 - (2026 - (activeVehicle.year || 2023)) * 0.1))
              : (activeVehicle.odoKm ? Math.max(300000, 1500000 - activeVehicle.odoKm * 10) : 1000000)
          )}
          subtitle={`${activeVehicle.city || 'Regional'} verified market`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: 'Market Ready', isPositive: true }}
          accentColor="emerald"
          onClick={openValuation}
        />
      </div>

      {/* Middle Row: Recent Maintenance Activity & Vehicle Health Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Maintenance & Expense Activity (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            header={
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-cyan-400" />
                <span>Recent Expenses & Maintenance</span>
              </div>
            }
            actions={
              <Link
                to="/ownership-cost"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {activeVehicleExpenses.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <p className="font-semibold text-slate-300">No recorded expenses.</p>
                <p className="text-slate-500">Add vehicle expenses to view your ownership cost analysis.</p>
                <Button onClick={openLogExpense} variant="ghost" size="sm" className="mt-2 text-cyan-400">
                  + Log First Expense
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {activeVehicleExpenses.slice(0, 5).map((exp) => (
                  <div key={exp.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-dark-800 border border-slate-700 text-slate-300 shrink-0">
                        {exp.category === 'fuel' ? (
                          <Fuel className="w-4 h-4 text-cyan-400" />
                        ) : exp.category === 'charging' ? (
                          <Zap className="w-4 h-4 text-emerald-400" />
                        ) : exp.category === 'service' ? (
                          <Wrench className="w-4 h-4 text-sky-400" />
                        ) : (
                          <Coins className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {exp.vendor}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {exp.notes || exp.category} • {formatDate(exp.date)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-white font-mono">
                        {formatINR(exp.amountINR)}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono">
                        {exp.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Vehicle Health & Diagnostic Advisory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            header={
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Vehicle Health Advisories</span>
              </div>
            }
            actions={
              <Link
                to="/vehicle-health"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                Diagnostics Hub <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {diagnostics.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-300">No active vehicle alerts.</p>
                <p className="text-slate-500 text-[11px]">All monitored vehicle subsystems are reporting healthy.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {diagnostics.slice(0, 2).map((diag) => (
                  <div
                    key={diag.id}
                    className={`p-3 rounded-xl border ${
                      diag.severity === 'warning'
                        ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                        : 'bg-dark-850 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={diag.severity === 'warning' ? 'warning' : 'info'} size="xs">
                        {diag.code}
                      </Badge>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(diag.detectedDate)}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1.5">{diag.title}</h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {diag.laymanExplanation}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Recommended action:</span>
                      <Link
                        to="/vehicle-health"
                        className="text-cyan-400 hover:underline font-medium"
                      >
                        View Fix Guide →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Smart Compliance & Service Reminders Card */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span>Compliance & Service Reminders</span>
                </div>
                {reminders.filter(r => !r.isCompleted).length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {reminders.filter(r => !r.isCompleted).length} Due
                  </span>
                )}
              </div>
            }
            actions={
              <Link
                to="/reminders"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                All Reminders <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="space-y-2.5">
              {reminders.filter(r => !r.isCompleted).slice(0, 3).map((rem) => {
                const isOverdue = new Date(rem.dueDate) < new Date();
                return (
                  <div
                    key={rem.id}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isOverdue
                        ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                        : rem.priority === 'high'
                        ? 'bg-amber-950/15 border-amber-800/30 text-amber-200'
                        : 'bg-dark-850 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white truncate">{rem.title}</span>
                          {isOverdue ? (
                            <Badge variant="danger" size="xs">Overdue</Badge>
                          ) : (
                            <span className="text-[10px] text-slate-400">Due {rem.dueDate}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{rem.description}</p>
                      </div>
                      <button
                        onClick={() => handleCompleteReminder(rem.id)}
                        title="Mark Complete"
                        className="p-1 rounded-lg bg-dark-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/40 transition-colors shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {reminders.filter(r => !r.isCompleted).length === 0 && (
                <div className="py-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  All compliance & service items are up to date!
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Recommended Replacement Cars Preview Banner */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Smart Car Upgrade Intelligence</span>
          </div>
        }
        actions={
          <Link
            to="/recommendations"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            Upgrade Intelligence <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        <div className="p-6 text-center max-w-lg mx-auto space-y-3">
          <Sparkles className="w-8 h-8 text-cyan-400/60 mx-auto" />
          <h4 className="text-sm font-semibold text-white">Smart Car Replacement Intelligence</h4>
          <p className="text-xs text-slate-400">
            Complete your vehicle and budget details to generate recommendations.
          </p>
          <Link to="/recommendations">
            <Button variant="primary" size="sm" className="mt-2">
              Calculate Replacement Cars
            </Button>
          </Link>
        </div>
      </Card>

      {/* Buy & Sell Intelligence & Compatible Accessories (Phase 7 Integration) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Buy & Sell Intelligence Card */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Buy & Sell Intelligence Spotlight</span>
            </div>
          }
          actions={
            <Link
              to="/buy-sell"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              Explore Buy Smart <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  Algorithmic Valuation Engine
                </span>
                <h4 className="text-xs font-bold text-white">
                  Sell your {activeVehicle.make} {activeVehicle.model} with TruePrice™
                </h4>
                <p className="text-[11px] text-slate-400">
                  Instant transparent price quote based on regional RTO data in {activeVehicle.city}.
                </p>
              </div>
              <Link to="/buy-sell">
                <Button variant="primary" size="sm" icon={<Tag className="w-3.5 h-3.5" />}>
                  List Car
                </Button>
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Verified pre-owned cars in {activeVehicle.city}:</span>
              <Link to="/buy-sell" className="text-cyan-400 hover:underline font-semibold">
                Browse Pre-Owned Deals →
              </Link>
            </div>
          </div>
        </Card>

        {/* Tailored Accessories Card */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>Accessories Matched to Your Garage</span>
            </div>
          }
          actions={
            <Link
              to="/accessories"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              All Accessories <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-300">
                Explore OEM & verified compatible accessories for your {activeVehicle.make} {activeVehicle.model}.
              </p>
              <Link to="/accessories">
                <Button variant="outline" size="sm" className="text-cyan-400 border-cyan-500/30">
                  Browse Compatible Accessories
                </Button>
              </Link>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
              <span>Looking for dashcams or EV wallboxes?</span>
              <Link to="/accessories" className="text-cyan-400 hover:underline font-semibold">
                View Curated Hub →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
