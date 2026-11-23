import React from 'react';
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
  Radio, 
  Check, 
  ArrowRight,
  Info
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatINR, formatDate, formatKm } from '../utils/formatters';

export const VehicleHealth: React.FC = () => {
  const { 
    activeVehicle, 
    diagnostics, 
    resolveDiagnostic, 
    runDiagnosticScan, 
    isScanning,
    openBookService,
    showToast 
  } = useApp();

  const isEV = activeVehicle.fuelType === 'electric';
  const unresolvedDiagnostics = diagnostics.filter((d) => !d.isResolved);
  const resolvedDiagnostics = diagnostics.filter((d) => d.isResolved);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Vehicle Health & Telematics
            </h1>
            <Badge variant="electric" size="sm">
              OBD-II Connected
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time ECU parameter telemetry, predictive subsystem wear monitoring and DTC fault codes for {activeVehicle.make} {activeVehicle.model} ({activeVehicle.regNumber})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={openBookService}
            variant="outline"
            size="sm"
            icon={<Wrench className="w-4 h-4 text-sky-400" />}
          >
            Schedule Service
          </Button>

          <Button
            onClick={runDiagnosticScan}
            variant="primary"
            size="sm"
            isLoading={isScanning}
            icon={<RotateCw className="w-4 h-4" />}
          >
            Run Full OBD-II Scan
          </Button>
        </div>
      </div>

      {/* Main Health Status Banner */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-slate-800 shadow-card grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Overall Health Score Ring */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-800">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Circular Gauge Graphic */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#1e293b"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#00D2FF"
                strokeWidth="8"
                strokeDasharray={`${(activeVehicle.healthScore / 100) * 264} 264`}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white font-mono">
                {activeVehicle.healthScore}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                / 100 SCORE
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Powertrain & Subsystems Optimal
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5">
            Last wireless scan: Today, 22 mins ago
          </span>
        </div>

        {/* Subsystem Health Parameters */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Powertrain / Engine */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{isEV ? 'Electric Drive' : 'Engine Health'}</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-lg font-bold text-white font-mono">96%</span>
            <span className="text-[10px] text-emerald-400 block mt-1 font-medium">
              Zero Knock / Normal Timing
            </span>
          </div>

          {/* Coolant / Thermal */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Coolant Temp</span>
              <Thermometer className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-lg font-bold text-white font-mono">89°C</span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Operating Range (85-98°C)
            </span>
          </div>

          {/* Brake Wear */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Front Brake Pads</span>
              <Disc className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-lg font-bold text-amber-400 font-mono">3.8 mm</span>
            <span className="text-[10px] text-amber-300 block mt-1">
              Service at 30k km
            </span>
          </div>

          {/* 12V Auxiliary / Traction Battery */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{isEV ? 'High-Voltage SoH' : '12V Battery Health'}</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-lg font-bold text-white font-mono">
              {isEV ? `${activeVehicle.batteryHealthPercent}%` : '12.6 V'}
            </span>
            <span className="text-[10px] text-emerald-400 block mt-1 font-medium">
              Healthy Cranking Capacity
            </span>
          </div>

          {/* Transmission Fluid */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Transmission</span>
              <Gauge className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-lg font-bold text-white font-mono">Normal</span>
            <span className="text-[10px] text-slate-400 block mt-1">
              {activeVehicle.transmission.toUpperCase()}
            </span>
          </div>

          {/* Emissions / DPF */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Emissions / DPF</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-lg font-bold text-amber-400 font-mono">68% Soot</span>
            <span className="text-[10px] text-amber-300 block mt-1 font-medium">
              Highway Regen Needed
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: Tyre Pressure Monitoring System (TPMS) Interactive Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TPMS Vehicle Layout Graphic (6 cols) */}
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
              {/* Car Graphic Outline Representation */}
              <div className="relative w-64 h-80 bg-dark-850/60 rounded-3xl border border-slate-800 flex items-center justify-center p-4">
                <div className="absolute inset-x-12 inset-y-8 rounded-2xl border-2 border-dashed border-slate-700/60 flex items-center justify-center text-slate-600 text-xs font-mono">
                  CHASSIS
                </div>

                {/* Front Left Wheel */}
                <div className="absolute -left-3 top-10 flex flex-col items-center">
                  <div className="w-10 h-16 rounded-lg bg-dark-800 border-2 border-cyan-400/80 shadow-[0_0_12px_rgba(0,210,255,0.2)] flex items-center justify-center text-xs font-mono font-bold text-white">
                    {activeVehicle.tyrePressurePsi.frontLeft}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">FL (34)</span>
                </div>

                {/* Front Right Wheel */}
                <div className="absolute -right-3 top-10 flex flex-col items-center">
                  <div className="w-10 h-16 rounded-lg bg-dark-800 border-2 border-cyan-400/80 shadow-[0_0_12px_rgba(0,210,255,0.2)] flex items-center justify-center text-xs font-mono font-bold text-white">
                    {activeVehicle.tyrePressurePsi.frontRight}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">FR (34)</span>
                </div>

                {/* Rear Left Wheel */}
                <div className="absolute -left-3 bottom-10 flex flex-col items-center">
                  <div className="w-10 h-16 rounded-lg bg-dark-800 border-2 border-cyan-400/80 shadow-[0_0_12px_rgba(0,210,255,0.2)] flex items-center justify-center text-xs font-mono font-bold text-white">
                    {activeVehicle.tyrePressurePsi.rearLeft}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">RL (33)</span>
                </div>

                {/* Rear Right Wheel */}
                <div className="absolute -right-3 bottom-10 flex flex-col items-center">
                  <div className="w-10 h-16 rounded-lg bg-dark-800 border-2 border-cyan-400/80 shadow-[0_0_12px_rgba(0,210,255,0.2)] flex items-center justify-center text-xs font-mono font-bold text-white">
                    {activeVehicle.tyrePressurePsi.rearRight}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">RR (33)</span>
                </div>

                {/* Spare Tyre in boot */}
                <div className="absolute bottom-4 flex items-center gap-1.5 px-2 py-1 rounded bg-dark-900 border border-slate-700 text-[10px] text-slate-300 font-mono">
                  <span>Spare: {activeVehicle.tyrePressurePsi.spare} PSI</span>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-slate-400">
                Recommended cold pressure: <strong className="text-white">34 PSI (Front) / 33 PSI (Rear)</strong>
              </div>
            </div>
          </Card>
        </div>

        {/* OBD-II Fault Codes (DTC) Active Diagnostics (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Active DTC Diagnostic Trouble Codes ({unresolvedDiagnostics.length})
                </span>
                <Badge variant={unresolvedDiagnostics.length === 0 ? 'success' : 'warning'} size="xs">
                  {unresolvedDiagnostics.length === 0 ? 'All Clear' : 'Attention'}
                </Badge>
              </div>
            }
          >
            <div className="space-y-3">
              {unresolvedDiagnostics.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="font-semibold text-white">Zero Active Fault Codes Detected</p>
                  <p className="text-slate-500 mt-0.5">All electronic control units responding with code 00 (Good).</p>
                </div>
              ) : (
                unresolvedDiagnostics.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                          {issue.code}
                        </span>
                        <span className="text-xs font-bold text-white">{issue.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatDate(issue.detectedDate)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {issue.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-dark-900 border border-slate-800 text-xs text-slate-300">
                      <strong className="text-cyan-400 block mb-0.5">Suggested Action (Layman Guide):</strong>
                      {issue.suggestedAction}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="text-slate-400">
                        Est. Repair: <strong className="text-white font-mono">{formatINR(issue.estimatedRepairCostINR)}</strong>
                      </span>

                      <Button
                        onClick={() => resolveDiagnostic(issue.id)}
                        variant="outline"
                        size="sm"
                        icon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
                      >
                        Mark Cleared / Fixed
                      </Button>
                    </div>
                  </div>
                ))
              )}

              {/* Resolved Diagnostics History */}
              {resolvedDiagnostics.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Recently Cleared History
                  </span>
                  <div className="space-y-1.5">
                    {resolvedDiagnostics.map((r) => (
                      <div
                        key={r.id}
                        className="p-2 rounded-lg bg-dark-900/60 border border-slate-800/60 flex items-center justify-between text-xs text-slate-400"
                      >
                        <span className="font-mono">{r.code} - {r.title}</span>
                        <span className="text-emerald-400 font-medium">✓ Resolved</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
