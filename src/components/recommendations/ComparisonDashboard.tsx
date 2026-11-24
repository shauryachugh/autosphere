import React, { useState } from 'react';
import { 
  Layers, 
  TrendingUp, 
  Shield, 
  Fuel, 
  Coins, 
  Calendar, 
  Wrench, 
  BarChart3, 
  ArrowLeft, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatINR, formatKm } from '../../utils/formatters';
import { 
  CurrentVehicleAnalysis, 
  CurrentCarTCO, 
  ReplacementCarTCO 
} from '../../types/replacement.types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell 
} from 'recharts';

interface ComparisonDashboardProps {
  currentVehicle: CurrentVehicleAnalysis;
  currentCarTCO: CurrentCarTCO;
  comparedCars: ReplacementCarTCO[];
  onBack: () => void;
  onProceedToVerdict: () => void;
}

export const ComparisonDashboard: React.FC<ComparisonDashboardProps> = ({
  currentVehicle,
  currentCarTCO,
  comparedCars,
  onBack,
  onProceedToVerdict,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'cumulativeTco' | 'monthlySpend' | 'resale'>('cumulativeTco');

  // 1. Data for 5-Year Cumulative TCO Breakdown (Stacked Bar Chart)
  const cumulativeTcoData = [
    {
      name: `Current (${currentVehicle.model})`,
      Depreciation: currentCarTCO.fiveYearTotalOwnershipCost - (currentCarTCO.annualFuelExpenditure * 5 + currentCarTCO.annualInsurance * 5 + currentCarTCO.estimatedFutureMaintenance5Yr),
      FuelOrEnergy: currentCarTCO.annualFuelExpenditure * 5,
      MaintenanceAndRepairs: currentCarTCO.estimatedFutureMaintenance5Yr,
      Insurance: currentCarTCO.annualInsurance * 5,
      FinancingInterest: 0,
      Total5Yr: currentCarTCO.fiveYearTotalOwnershipCost,
    },
    ...comparedCars.map((item) => ({
      name: `${item.car.make.split(' ')[0]} ${item.car.model}`,
      Depreciation: item.annualDepreciationCostINR * 5,
      FuelOrEnergy: item.annualFuelCostINR * 5,
      MaintenanceAndRepairs: item.annualMaintenanceCostINR * 5,
      Insurance: item.annualInsuranceCostINR * 5,
      FinancingInterest: item.totalLoanInterestINR,
      Total5Yr: item.fiveYearTotalOwnershipCostINR,
    })),
  ];

  // 2. Data for Monthly Out-of-Pocket Cash Flow (Bar Chart)
  const monthlySpendData = [
    {
      name: `Current (${currentVehicle.model})`,
      MonthlyEMI: 0,
      MonthlyFuel: Math.round(currentCarTCO.annualFuelExpenditure / 12),
      MonthlyMaintenance: Math.round(currentCarTCO.annualMaintenance / 12),
      MonthlyInsurance: Math.round(currentCarTCO.annualInsurance / 12),
      TotalMonthly: currentCarTCO.monthlyOwnershipExpenditure,
    },
    ...comparedCars.map((item) => ({
      name: `${item.car.make.split(' ')[0]} ${item.car.model}`,
      MonthlyEMI: item.monthlyEmiINR,
      MonthlyFuel: item.monthlyFuelCostINR,
      MonthlyMaintenance: Math.round(item.annualMaintenanceCostINR / 12),
      MonthlyInsurance: Math.round(item.annualInsuranceCostINR / 12),
      TotalMonthly: item.monthlyOwnershipExpenditureINR,
    })),
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Interactive Automotive Benchmarking Matrix
            </h2>
            <Badge variant="electric" size="sm">
              Current vs {comparedCars.length} Replacements
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete financial comparison factoring purchase capital, bank interest, fuel burn, and residual resale value
          </p>
        </div>

        <Button
          onClick={onProceedToVerdict}
          variant="primary"
          size="sm"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          View Final Verdict Report
        </Button>
      </div>

      {/* Visual Analytics Section with Chart Tabs */}
      <Card
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Comparative Visual Financial Modeling
            </span>

            <div className="flex items-center gap-1.5 bg-dark-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveChartTab('cumulativeTco')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeChartTab === 'cumulativeTco'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                5-Year Cumulative TCO
              </button>
              <button
                onClick={() => setActiveChartTab('monthlySpend')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeChartTab === 'monthlySpend'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Out-of-Pocket Spend
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartTab === 'cumulativeTco' ? (
                <BarChart data={cumulativeTcoData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Depreciation" stackId="a" fill="#6366f1" name="Depreciation" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="FuelOrEnergy" stackId="a" fill="#00D2FF" name="5-Yr Fuel / Power" />
                  <Bar dataKey="MaintenanceAndRepairs" stackId="a" fill="#f59e0b" name="5-Yr Maintenance" />
                  <Bar dataKey="Insurance" stackId="a" fill="#10b981" name="5-Yr Insurance" />
                  <Bar dataKey="FinancingInterest" stackId="a" fill="#ec4899" name="Loan Interest" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={monthlySpendData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="MonthlyEMI" fill="#00D2FF" name="Monthly Loan EMI" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="MonthlyFuel" fill="#38bdf8" name="Monthly Fuel / Power" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="MonthlyMaintenance" fill="#f59e0b" name="Monthly Maintenance" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="MonthlyInsurance" fill="#10b981" name="Monthly Insurance" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <p className="text-center text-[11px] text-slate-500">
            {activeChartTab === 'cumulativeTco'
              ? 'Includes vehicle depreciation, energy consumption, periodic servicing, insurance, and bank finance interest.'
              : 'Direct monthly out-of-pocket cash commitment required from your bank account.'}
          </p>
        </div>
      </Card>

      {/* Comprehensive Metric Matrix Table */}
      <Card
        header={
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Detailed Head-to-Head Financial Ledger
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-850/80 text-slate-300 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 min-w-[180px]">Parameters</th>
                <th className="py-3 px-4 min-w-[180px] bg-slate-900/60 text-white">
                  Current: {currentVehicle.make} {currentVehicle.model}
                </th>
                {comparedCars.map((c) => (
                  <th key={c.car.id} className="py-3 px-4 min-w-[200px] text-cyan-300">
                    {c.car.make} {c.car.model}
                    <span className="block text-[10px] text-slate-400 font-normal">{c.car.variant}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {/* Row: Powertrain & Transmission */}
              <tr className="hover:bg-dark-850/30">
                <td className="py-3 px-4 font-semibold text-slate-400">Powertrain & Gearbox</td>
                <td className="py-3 px-4 font-mono uppercase bg-slate-900/40">
                  {currentVehicle.fuelType} • {currentVehicle.transmission}
                </td>
                {comparedCars.map((c) => (
                  <td key={c.car.id} className="py-3 px-4 font-mono uppercase text-white font-semibold">
                    {c.car.fuelType} • {c.car.transmission}
                  </td>
                ))}
              </tr>

              {/* Row: Mileage / Efficiency */}
              <tr className="hover:bg-dark-850/30">
                <td className="py-3 px-4 font-semibold text-slate-400">Certified Efficiency / Range</td>
                <td className="py-3 px-4 font-mono text-slate-300 bg-slate-900/40">
                  ₹{currentCarTCO.fuelExpenditurePerKm}/km running burn
                </td>
                {comparedCars.map((c) => (
                  <td key={c.car.id} className="py-3 px-4 font-mono font-bold text-cyan-400">
                    {c.car.mileageOrRange} {c.car.mileageUnit}
                  </td>
                ))}
              </tr>

              {/* Row: On-Road Purchase Price */}
              <tr className="hover:bg-dark-850/30">
                <td className="py-3 px-4 font-semibold text-slate-400">Estimated On-Road Price</td>
                <td className="py-3 px-4 font-mono text-slate-500 bg-slate-900/40">Already Owned</td>
                {comparedCars.map((c) => (
                  <td key={c.car.id} className="py-3 px-4 font-mono font-bold text-white">
                    {formatINR(c.estimatedOnRoadPriceINR)}
                  </td>
                ))}
              </tr>

              {/* Row: Monthly Loan EMI */}
              <tr className="hover:bg-dark-850/30">
                <td className="py-3 px-4 font-semibold text-slate-400">Monthly Auto Loan EMI</td>
                <td className="py-3 px-4 font-mono text-emerald-400 font-bold bg-slate-900/40">₹0 / month (Paid Off)</td>
                {comparedCars.map((c) => (
                  <td key={c.car.id} className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {formatINR(c.monthlyEmiINR)}/mo
                  </td>
                ))}
              </tr>

              {/* Row: Total Loan Financing Interest */}
              <tr className="hover:bg-dark-850/30">
                <td className="py-3 px-4 font-semibold text-slate-400">Total Bank Loan Interest</td>
                <td className="py-3 px-4 font-mono text-slate-500 bg-slate-900/40">₹0 (Zero Interest)</td>
                {comparedCars.map((c) => (
                  <td key={c.car.id} className="py-3 px-4 font-mono text-rose-400">
                    +{formatINR(c.totalLoanInterestINR)}
                  </td>
                ))}
              </tr>

              {/* Row: Monthly Fuel Cost */}
              <tr className="hover:bg-dark-850/30">
                <td className="py-3 px-4 font-semibold text-slate-400">Monthly Fuel / Power Cost</td>
                <td className="py-3 px-4 font-mono font-bold text-amber-400 bg-slate-900/40">
                  {formatINR(Math.round(currentCarTCO.annualFuelExpenditure / 12))}/mo
                </td>
                {comparedCars.map((c) => (
                  <td key={c.car.id} className="py-3 px-4 font-mono font-bold text-cyan-300">
                    {formatINR(c.monthlyFuelCostINR)}/mo
                  </td>
                ))}
              </tr>

              {/* Row: Annual Periodic Maintenance */}
              <tr className="hover:bg-dark-850/30">
                <td className="py-3 px-4 font-semibold text-slate-400">Annual Maintenance & Service</td>
                <td className="py-3 px-4 font-mono text-slate-300 bg-slate-900/40">
                  {formatINR(currentCarTCO.annualMaintenance + currentCarTCO.annualRepairs)}/yr
                </td>
                {comparedCars.map((c) => (
                  <td key={c.car.id} className="py-3 px-4 font-mono text-emerald-400">
                    {formatINR(c.annualMaintenanceCostINR)}/yr
                  </td>
                ))}
              </tr>

              {/* Row: Total Monthly Out-of-Pocket */}
              <tr className="hover:bg-dark-850/30 bg-cyan-950/10">
                <td className="py-3 px-4 font-bold text-white">Total Monthly Out-of-Pocket Cash Flow</td>
                <td className="py-3 px-4 font-mono font-bold text-white bg-slate-900/60">
                  {formatINR(currentCarTCO.monthlyOwnershipExpenditure)} / mo
                </td>
                {comparedCars.map((c) => (
                  <td key={c.car.id} className="py-3 px-4 font-mono font-bold text-cyan-400 text-sm">
                    {formatINR(c.monthlyOwnershipExpenditureINR)} / mo
                  </td>
                ))}
              </tr>

              {/* Row: 5-Year Resale Residual Value */}
              <tr className="hover:bg-dark-850/30">
                <td className="py-3 px-4 font-semibold text-slate-400">Expected Resale Value (5 Years)</td>
                <td className="py-3 px-4 font-mono text-slate-400 bg-slate-900/40">
                  {formatINR(currentCarTCO.fiveYearResaleValue)}
                </td>
                {comparedCars.map((c) => (
                  <td key={c.car.id} className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                    {formatINR(c.expectedResaleValue5YrINR)} ({c.car.resalePercentage5Yr}%)
                  </td>
                ))}
              </tr>

              {/* Row: 3-Year Total Cost of Ownership */}
              <tr className="hover:bg-dark-850/30">
                <td className="py-3 px-4 font-semibold text-slate-400">3-Year Total Ownership Cost</td>
                <td className="py-3 px-4 font-mono text-slate-300 bg-slate-900/40">
                  {formatINR(currentCarTCO.threeYearTotalOwnershipCost)}
                </td>
                {comparedCars.map((c) => (
                  <td key={c.car.id} className="py-3 px-4 font-mono text-slate-200">
                    {formatINR(c.threeYearTotalOwnershipCostINR)}
                  </td>
                ))}
              </tr>

              {/* Row: 5-Year Total Cost of Ownership (TCO) */}
              <tr className="hover:bg-dark-850/30 bg-dark-850/90 font-bold">
                <td className="py-3.5 px-4 text-white uppercase tracking-wider text-xs">
                  5-Year True Ownership TCO
                </td>
                <td className="py-3.5 px-4 font-mono text-base text-cyan-300 bg-slate-900">
                  {formatINR(currentCarTCO.fiveYearTotalOwnershipCost)}
                </td>
                {comparedCars.map((c) => {
                  const diff = c.fiveYearTotalOwnershipCostINR - currentCarTCO.fiveYearTotalOwnershipCost;
                  return (
                    <td key={c.car.id} className="py-3.5 px-4 font-mono text-base text-white">
                      {formatINR(c.fiveYearTotalOwnershipCostINR)}
                      <span className={`block text-[10px] font-sans font-semibold mt-0.5 ${
                        diff < 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {diff < 0 ? `Saves ${formatINR(Math.abs(diff))}` : `+${formatINR(diff)} more expensive`}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <Button
          onClick={onBack}
          variant="outline"
          size="md"
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Recommendations
        </Button>

        <Button
          onClick={onProceedToVerdict}
          variant="primary"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          View Final Verdict & Financial Intelligence Report
        </Button>
      </div>
    </div>
  );
};
