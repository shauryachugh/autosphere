// src/services/aiContextService.ts
// Synthesizes AutoSphere domain intelligence and active vehicle context for AutoSphere AI

import { Vehicle, Expense, DiagnosticIssue } from '../types';
import { HealthDashboardSummary, VehicleReminder } from '../types/passport.types';

export interface AutoSphereAIContext {
  vehicle?: {
    make: string;
    model: string;
    variant: string;
    year: number;
    fuelType: string;
    transmission: string;
    odoKm: number;
    city: string;
    state: string;
    healthScore: number;
    currentFuelPercent?: number;
    estimatedRangeKm?: number;
    avgEfficiency?: string;
    tyrePressurePsi?: {
      frontLeft: number;
      frontRight: number;
      rearLeft: number;
      rearRight: number;
    };
    monthlyFuelSpendINR?: number;
    annualSpendINR?: number;
    subsystemStatuses?: {
      engine?: string;
      battery?: string;
      tyres?: string;
      brakes?: string;
      transmission?: string;
      ac?: string;
    };
    pucExpiry?: string;
    insuranceExpiry?: string;
    activeAdvisories?: Array<{
      code: string;
      title: string;
      severity: string;
      explanation: string;
    }>;
  };
  marketBenchmarks: {
    petrolPriceAvgINR: number;
    dieselPriceAvgINR: number;
    cngPriceAvgINR: number;
    evDomesticTariffINR: number;
    evPublicChargingTariffINR: number;
    topCarsUnder10L: string[];
    topCars10to20L: string[];
    topCarsAbove20L: string[];
  };
}

export function synthesizeVehicleContext(
  activeVehicle?: Vehicle | null,
  expenses?: Expense[],
  diagnostics?: DiagnosticIssue[],
  healthSummary?: HealthDashboardSummary | null,
  reminders?: VehicleReminder[]
): AutoSphereAIContext {
  let vehicleContext: AutoSphereAIContext['vehicle'] = undefined;

  if (activeVehicle) {
    const currentMonth = '2026-11';
    const currentYear = '2026';

    const monthlyExpenses = (expenses || []).filter(e => e.date.startsWith(currentMonth));
    const monthlyFuelSpendINR = monthlyExpenses
      .filter(e => e.category === 'fuel')
      .reduce((sum, e) => sum + e.amountINR, 0);

    const annualSpendINR = (expenses || [])
      .filter(e => e.date.startsWith(currentYear))
      .reduce((sum, e) => sum + e.amountINR, 0);

    const activeAdvisories = (diagnostics || [])
      .filter(d => !d.isResolved)
      .map(d => ({
        code: d.code,
        title: d.title,
        severity: d.severity,
        explanation: d.laymanExplanation,
      }));

    vehicleContext = {
      make: activeVehicle.make,
      model: activeVehicle.model,
      variant: activeVehicle.variant,
      year: activeVehicle.year,
      fuelType: activeVehicle.fuelType,
      transmission: activeVehicle.transmission,
      odoKm: activeVehicle.odoKm,
      city: activeVehicle.city,
      state: activeVehicle.state,
      healthScore: activeVehicle.healthScore,
      currentFuelPercent: activeVehicle.currentFuelPercent,
      estimatedRangeKm: activeVehicle.estimatedRangeKm,
      avgEfficiency: activeVehicle.avgEfficiency,
      tyrePressurePsi: activeVehicle.tyrePressurePsi,
      monthlyFuelSpendINR: monthlyFuelSpendINR || 8200,
      annualSpendINR: annualSpendINR || 124500,
      pucExpiry: healthSummary?.pucStatus?.expiryDate || '2025-03-20',
      insuranceExpiry: healthSummary?.insuranceStatus?.expiryDate || '2025-04-14',
      activeAdvisories: activeAdvisories.length > 0 ? activeAdvisories : undefined,
    };
  }

  return {
    vehicle: vehicleContext,
    marketBenchmarks: {
      petrolPriceAvgINR: 102.86,
      dieselPriceAvgINR: 88.94,
      cngPriceAvgINR: 82.5,
      evDomesticTariffINR: 8.15,
      evPublicChargingTariffINR: 21.0,
      topCarsUnder10L: [
        'Maruti Suzuki Swift ZXi (₹8.49L on-road)',
        'Tata Punch Accomplished (₹8.75L on-road)',
        'Hyundai Exter SX (₹8.90L on-road)',
        'Tata Nexon Smart (₹9.80L on-road)',
        'Maruti Suzuki Brezza LXi (₹9.65L on-road)',
      ],
      topCars10to20L: [
        'Tata Nexon.ev Fearless 45 (₹17.89L on-road)',
        'Hyundai Creta SX Tech (₹18.45L on-road)',
        'Maruti Grand Vitara Hybrid (₹19.20L on-road)',
        'Mahindra Scorpio-N Z4 (₹17.65L on-road)',
        'Kia Seltos HTX (₹18.10L on-road)',
      ],
      topCarsAbove20L: [
        'Mahindra XUV700 AX7L (₹26.40L on-road)',
        'Toyota Innova Hycross ZX (₹31.50L on-road)',
        'BYD Atto 3 (₹26.20L on-road)',
        'Skoda Kodiaq L&K (₹41.50L on-road)',
      ],
    },
  };
}
