import { FuelPricing, EvChargingTariff } from '../types/automotive.types';
import { FuelType } from '../types';

export const STATE_FUEL_PRICES: FuelPricing[] = [
  { stateId: 'KA', stateName: 'Karnataka', cityName: 'Bengaluru', petrolPricePerLitreINR: 102.86, dieselPricePerLitreINR: 88.94, cngPricePerKgINR: 82.50, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'MH', stateName: 'Maharashtra', cityName: 'Mumbai', petrolPricePerLitreINR: 104.21, dieselPricePerLitreINR: 92.15, cngPricePerKgINR: 76.00, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'DL', stateName: 'Delhi (NCT)', cityName: 'New Delhi', petrolPricePerLitreINR: 94.72, dieselPricePerLitreINR: 87.62, cngPricePerKgINR: 75.09, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'TN', stateName: 'Tamil Nadu', cityName: 'Chennai', petrolPricePerLitreINR: 100.75, dieselPricePerLitreINR: 92.34, cngPricePerKgINR: 85.00, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'TS', stateName: 'Telangana', cityName: 'Hyderabad', petrolPricePerLitreINR: 107.41, dieselPricePerLitreINR: 95.65, cngPricePerKgINR: 92.00, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'UP', stateName: 'Uttar Pradesh', cityName: 'Lucknow', petrolPricePerLitreINR: 94.65, dieselPricePerLitreINR: 87.76, cngPricePerKgINR: 84.70, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'HR', stateName: 'Haryana', cityName: 'Gurugram', petrolPricePerLitreINR: 95.19, dieselPricePerLitreINR: 88.05, cngPricePerKgINR: 80.12, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'GJ', stateName: 'Gujarat', cityName: 'Ahmedabad', petrolPricePerLitreINR: 94.42, dieselPricePerLitreINR: 90.11, cngPricePerKgINR: 77.20, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'WB', stateName: 'West Bengal', cityName: 'Kolkata', petrolPricePerLitreINR: 103.94, dieselPricePerLitreINR: 90.76, cngPricePerKgINR: 85.50, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'KL', stateName: 'Kerala', cityName: 'Kochi', petrolPricePerLitreINR: 105.58, dieselPricePerLitreINR: 94.59, cngPricePerKgINR: 86.00, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'RJ', stateName: 'Rajasthan', cityName: 'Jaipur', petrolPricePerLitreINR: 104.88, dieselPricePerLitreINR: 90.36, cngPricePerKgINR: 88.00, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'PB', stateName: 'Punjab', cityName: 'Chandigarh', petrolPricePerLitreINR: 96.28, dieselPricePerLitreINR: 86.53, cngPricePerKgINR: 84.50, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'AP', stateName: 'Andhra Pradesh', cityName: 'Visakhapatnam', petrolPricePerLitreINR: 108.29, dieselPricePerLitreINR: 96.17, cngPricePerKgINR: 89.00, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'MP', stateName: 'Madhya Pradesh', cityName: 'Indore', petrolPricePerLitreINR: 106.50, dieselPricePerLitreINR: 91.89, cngPricePerKgINR: 89.50, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'DEFAULT', stateName: 'National Average', cityName: 'All India', petrolPricePerLitreINR: 98.50, dieselPricePerLitreINR: 89.50, cngPricePerKgINR: 82.00, updatedAt: '2026-11-20T00:00:00Z' },
];

export const STATE_EV_TARIFFS: EvChargingTariff[] = [
  { stateId: 'KA', stateName: 'Karnataka', discomName: 'BESCOM (Bangalore Electricity Supply Co.)', domesticAcRatePerKwhINR: 8.15, publicDcFastRatePerKwhINR: 21.00, commercialFleetRatePerKwhINR: 13.50, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'MH', stateName: 'Maharashtra', discomName: 'MSEDCL / Tata Power Mumbai', domesticAcRatePerKwhINR: 8.80, publicDcFastRatePerKwhINR: 22.50, commercialFleetRatePerKwhINR: 14.00, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'DL', stateName: 'Delhi (NCT)', discomName: 'Tata Power DDL / BSES Yamuna', domesticAcRatePerKwhINR: 6.50, publicDcFastRatePerKwhINR: 18.50, commercialFleetRatePerKwhINR: 11.50, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'TN', stateName: 'Tamil Nadu', discomName: 'TANGEDCO', domesticAcRatePerKwhINR: 7.20, publicDcFastRatePerKwhINR: 20.00, commercialFleetRatePerKwhINR: 12.80, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'TS', stateName: 'Telangana', discomName: 'TSSPDCL', domesticAcRatePerKwhINR: 7.80, publicDcFastRatePerKwhINR: 21.50, commercialFleetRatePerKwhINR: 13.20, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'UP', stateName: 'Uttar Pradesh', discomName: 'UPPCL (PVVNL / MVVNL)', domesticAcRatePerKwhINR: 7.40, publicDcFastRatePerKwhINR: 19.50, commercialFleetRatePerKwhINR: 12.00, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'GJ', stateName: 'Gujarat', discomName: 'UGVCL / Torrent Power', domesticAcRatePerKwhINR: 6.80, publicDcFastRatePerKwhINR: 19.00, commercialFleetRatePerKwhINR: 11.80, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'KL', stateName: 'Kerala', discomName: 'KSEB (Kerala State Electricity Board)', domesticAcRatePerKwhINR: 7.50, publicDcFastRatePerKwhINR: 20.50, commercialFleetRatePerKwhINR: 13.00, updatedAt: '2026-11-20T00:00:00Z' },
  { stateId: 'DEFAULT', stateName: 'National Average', discomName: 'Standard Indian Discom Average', domesticAcRatePerKwhINR: 7.50, publicDcFastRatePerKwhINR: 20.00, commercialFleetRatePerKwhINR: 13.00, updatedAt: '2026-11-20T00:00:00Z' },
];

export function getFuelPricing(stateId: string): FuelPricing {
  const norm = stateId.toUpperCase();
  const match = STATE_FUEL_PRICES.find(p => p.stateId === norm);
  if (match) return match;
  return STATE_FUEL_PRICES.find(p => p.stateId === 'DEFAULT')!;
}

export function getEvTariff(stateId: string): EvChargingTariff {
  const norm = stateId.toUpperCase();
  const match = STATE_EV_TARIFFS.find(t => t.stateId === norm);
  if (match) return match;
  return STATE_EV_TARIFFS.find(t => t.stateId === 'DEFAULT')!;
}

// Running cost per kilometre calculator based on location-specific pricing
export function calculateLocationRunningCostPerKm(
  fuelType: FuelType,
  mileageOrRange: number,
  stateId: string,
  acHomeChargingRatio = 0.85 // 85% home charging, 15% DC fast charging
): { costPerKmINR: number; benchmarkPriceINR: number; unitLabel: string } {
  const fuelPricing = getFuelPricing(stateId);
  const evTariff = getEvTariff(stateId);

  if (fuelType === 'electric') {
    // Blended electricity cost per kWh
    const blendedTariff = evTariff.domesticAcRatePerKwhINR * acHomeChargingRatio + evTariff.publicDcFastRatePerKwhINR * (1 - acHomeChargingRatio);
    // Typical EV efficiency: mileageOrRange / 40 (approx kWh capacity) -> e.g. 450 km / 45 kWh = 10 km/kWh
    const kmPerKwh = mileageOrRange > 0 ? (mileageOrRange / 45) : 8.5;
    const costPerKm = blendedTariff / Math.max(1, kmPerKwh);
    return {
      costPerKmINR: Number(costPerKm.toFixed(2)),
      benchmarkPriceINR: Number(blendedTariff.toFixed(2)),
      unitLabel: '₹/kWh',
    };
  }

  if (fuelType === 'cng') {
    const costPerKm = fuelPricing.cngPricePerKgINR / Math.max(1, mileageOrRange);
    return {
      costPerKmINR: Number(costPerKm.toFixed(2)),
      benchmarkPriceINR: fuelPricing.cngPricePerKgINR,
      unitLabel: '₹/kg',
    };
  }

  if (fuelType === 'diesel') {
    const costPerKm = fuelPricing.dieselPricePerLitreINR / Math.max(1, mileageOrRange);
    return {
      costPerKmINR: Number(costPerKm.toFixed(2)),
      benchmarkPriceINR: fuelPricing.dieselPricePerLitreINR,
      unitLabel: '₹/L',
    };
  }

  // Petrol & Strong Hybrid
  const costPerKm = fuelPricing.petrolPricePerLitreINR / Math.max(1, mileageOrRange);
  return {
    costPerKmINR: Number(costPerKm.toFixed(2)),
    benchmarkPriceINR: fuelPricing.petrolPricePerLitreINR,
    unitLabel: '₹/L',
  };
}
