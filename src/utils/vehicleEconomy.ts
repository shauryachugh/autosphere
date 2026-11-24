import { FuelType, Vehicle } from '../types';

export type EfficiencyUnit = 'km/l' | 'km/kg' | 'km/kWh';

/**
 * Returns the standard Indian automotive efficiency unit for a given fuel type.
 * EVs strictly use km/kWh (never km/l), CNG uses km/kg, and liquid/hybrid fuels use km/l.
 */
export function getEfficiencyUnit(fuelType: FuelType): EfficiencyUnit {
  if (fuelType === 'electric') return 'km/kWh';
  if (fuelType === 'cng') return 'km/kg';
  return 'km/l';
}

/**
 * Extracts a numeric mileage value from a vehicle's user-reported actualMileage field.
 * Falls back to parsing avgEfficiency only when its unit matches the fuel type.
 * Never returns a hardcoded default when economy data is missing.
 */
export function getEffectiveActualMileage(vehicle: Vehicle): number | undefined {
  if (
    typeof vehicle.actualMileage === 'number' &&
    Number.isFinite(vehicle.actualMileage) &&
    vehicle.actualMileage > 0
  ) {
    return vehicle.actualMileage;
  }

  if (vehicle.avgEfficiency && typeof vehicle.avgEfficiency === 'string') {
    const expectedUnit = getEfficiencyUnit(vehicle.fuelType);
    const trimmed = vehicle.avgEfficiency.trim();
    if (trimmed.toLowerCase().endsWith(expectedUnit.toLowerCase())) {
      const parsed = parseFloat(trimmed);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return undefined;
}

/**
 * Formats a numeric efficiency value with the correct unit for the vehicle's fuel type.
 */
export function formatVehicleEfficiency(
  value: number | null | undefined,
  fuelType: FuelType
): string {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return 'Not set';
  }
  const formatted = Number.isInteger(value) ? value.toString() : Number(value.toFixed(2)).toString();
  return `${formatted} ${getEfficiencyUnit(fuelType)}`;
}

export interface GarageEconomyAverageGroup {
  unit: EfficiencyUnit;
  label: string;
  average: number;
  vehicleCount: number;
}

/**
 * Calculates garage-wide average mileage grouped strictly by efficiency unit
 * (km/l for Petrol/Diesel/Hybrid, km/kg for CNG, km/kWh for Electric),
 * excluding vehicles that have no recorded economy figure.
 */
export function calculateGarageEconomyAverages(vehicles: Vehicle[]): GarageEconomyAverageGroup[] {
  const groups: Record<EfficiencyUnit, { label: string; sum: number; count: number }> = {
    'km/l': { label: 'Liquid Fuel & Hybrid (km/l)', sum: 0, count: 0 },
    'km/kg': { label: 'CNG Fleet (km/kg)', sum: 0, count: 0 },
    'km/kWh': { label: 'Electric Fleet (km/kWh)', sum: 0, count: 0 },
  };

  for (const vehicle of vehicles) {
    const actual = getEffectiveActualMileage(vehicle);
    if (actual === undefined) continue;
    const unit = getEfficiencyUnit(vehicle.fuelType);
    groups[unit].sum += actual;
    groups[unit].count += 1;
  }

  return (Object.keys(groups) as EfficiencyUnit[])
    .filter((unit) => groups[unit].count > 0)
    .map((unit) => ({
      unit,
      label: groups[unit].label,
      average: Number((groups[unit].sum / groups[unit].count).toFixed(2)),
      vehicleCount: groups[unit].count,
    }));
}
