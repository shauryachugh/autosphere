import { StateRtoRule } from '../types/automotive.types';
import { FuelType } from '../types';

export const STATE_RTO_RULES: StateRtoRule[] = [
  // --- KARNATAKA (KA) ---
  { id: 'rto-ka-ev', stateId: 'KA', fuelType: 'electric', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 0.0, fixedCessINR: 0, greenCessINR: 0, specialNotes: '100% RTO Road Tax exemption under Karnataka EV Policy', effectiveYear: 2026 },
  { id: 'rto-ka-petrol-low', stateId: 'KA', fuelType: 'petrol', priceMinINR: 0, priceMaxINR: 1000000, taxPercent: 14.0, fixedCessINR: 1000, greenCessINR: 500, specialNotes: '14% Road Tax + 11% Infrastructure Cess on tax', effectiveYear: 2026 },
  { id: 'rto-ka-petrol-mid', stateId: 'KA', fuelType: 'petrol', priceMinINR: 1000000, priceMaxINR: 2000000, taxPercent: 17.0, fixedCessINR: 1500, greenCessINR: 500, specialNotes: '17% Road Tax for 10L - 20L bracket', effectiveYear: 2026 },
  { id: 'rto-ka-petrol-high', stateId: 'KA', fuelType: 'petrol', priceMinINR: 2000000, priceMaxINR: 999999999, taxPercent: 18.0, fixedCessINR: 2000, greenCessINR: 500, specialNotes: '18% Road Tax for luxury bracket > 20L', effectiveYear: 2026 },
  { id: 'rto-ka-diesel-mid', stateId: 'KA', fuelType: 'diesel', priceMinINR: 0, priceMaxINR: 2000000, taxPercent: 15.5, fixedCessINR: 1500, greenCessINR: 1000, specialNotes: '15.5% Diesel Road Tax + Infra Cess', effectiveYear: 2026 },
  { id: 'rto-ka-diesel-high', stateId: 'KA', fuelType: 'diesel', priceMinINR: 2000000, priceMaxINR: 999999999, taxPercent: 18.5, fixedCessINR: 2000, greenCessINR: 1000, specialNotes: '18.5% Diesel Road Tax for > 20L bracket', effectiveYear: 2026 },
  { id: 'rto-ka-hybrid', stateId: 'KA', fuelType: 'hybrid', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 14.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: '14% Standard Strong Hybrid Road Tax', effectiveYear: 2026 },
  { id: 'rto-ka-cng', stateId: 'KA', fuelType: 'cng', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 10.0, fixedCessINR: 800, greenCessINR: 0, specialNotes: '10% Clean Fuel Road Tax', effectiveYear: 2026 },

  // --- DELHI (NCT) (DL) ---
  { id: 'rto-dl-ev', stateId: 'DL', fuelType: 'electric', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 0.0, fixedCessINR: 0, greenCessINR: 0, specialNotes: '100% Tax Waiver under Delhi Electric Vehicles Policy', effectiveYear: 2026 },
  { id: 'rto-dl-petrol-low', stateId: 'DL', fuelType: 'petrol', priceMinINR: 0, priceMaxINR: 600000, taxPercent: 4.0, fixedCessINR: 500, greenCessINR: 0, specialNotes: '4% Road Tax for sub-6L segment', effectiveYear: 2026 },
  { id: 'rto-dl-petrol-mid', stateId: 'DL', fuelType: 'petrol', priceMinINR: 600000, priceMaxINR: 1000000, taxPercent: 7.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: '7% Road Tax for 6L - 10L bracket', effectiveYear: 2026 },
  { id: 'rto-dl-petrol-high', stateId: 'DL', fuelType: 'petrol', priceMinINR: 1000000, priceMaxINR: 999999999, taxPercent: 10.0, fixedCessINR: 1500, greenCessINR: 0, specialNotes: '10% Road Tax for > 10L bracket', effectiveYear: 2026 },
  { id: 'rto-dl-diesel-mid', stateId: 'DL', fuelType: 'diesel', priceMinINR: 0, priceMaxINR: 1000000, taxPercent: 8.75, fixedCessINR: 1500, greenCessINR: 2000, specialNotes: '8.75% Diesel Tax + Green Tax', effectiveYear: 2026 },
  { id: 'rto-dl-diesel-high', stateId: 'DL', fuelType: 'diesel', priceMinINR: 1000000, priceMaxINR: 999999999, taxPercent: 12.5, fixedCessINR: 2000, greenCessINR: 2500, specialNotes: '12.5% Diesel Tax for > 10L bracket', effectiveYear: 2026 },
  { id: 'rto-dl-hybrid', stateId: 'DL', fuelType: 'hybrid', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 8.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: '8% Strong Hybrid Concession Rate', effectiveYear: 2026 },
  { id: 'rto-dl-cng', stateId: 'DL', fuelType: 'cng', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 5.0, fixedCessINR: 500, greenCessINR: 0, specialNotes: '5% Clean Fuel CNG Rate', effectiveYear: 2026 },

  // --- MAHARASHTRA (MH) ---
  { id: 'rto-mh-ev', stateId: 'MH', fuelType: 'electric', priceMinINR: 0, priceMaxINR: 2000000, taxPercent: 0.0, fixedCessINR: 0, greenCessINR: 0, specialNotes: '0% EV Road Tax waiver up to 20L', effectiveYear: 2026 },
  { id: 'rto-mh-ev-luxury', stateId: 'MH', fuelType: 'electric', priceMinINR: 2000000, priceMaxINR: 999999999, taxPercent: 6.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: '6% Concession for Luxury EVs', effectiveYear: 2026 },
  { id: 'rto-mh-petrol-low', stateId: 'MH', fuelType: 'petrol', priceMinINR: 0, priceMaxINR: 1000000, taxPercent: 11.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: '11% Road Tax for sub-10L', effectiveYear: 2026 },
  { id: 'rto-mh-petrol-mid', stateId: 'MH', fuelType: 'petrol', priceMinINR: 1000000, priceMaxINR: 2000000, taxPercent: 12.0, fixedCessINR: 1500, greenCessINR: 0, specialNotes: '12% Road Tax for 10L - 20L', effectiveYear: 2026 },
  { id: 'rto-mh-petrol-high', stateId: 'MH', fuelType: 'petrol', priceMinINR: 2000000, priceMaxINR: 999999999, taxPercent: 13.0, fixedCessINR: 2000, greenCessINR: 0, specialNotes: '13% Road Tax for > 20L', effectiveYear: 2026 },
  { id: 'rto-mh-diesel-mid', stateId: 'MH', fuelType: 'diesel', priceMinINR: 0, priceMaxINR: 2000000, taxPercent: 14.0, fixedCessINR: 1500, greenCessINR: 1000, specialNotes: '14% Diesel Road Tax', effectiveYear: 2026 },
  { id: 'rto-mh-diesel-high', stateId: 'MH', fuelType: 'diesel', priceMinINR: 2000000, priceMaxINR: 999999999, taxPercent: 15.0, fixedCessINR: 2000, greenCessINR: 1000, specialNotes: '15% Diesel Road Tax for > 20L', effectiveYear: 2026 },
  { id: 'rto-mh-hybrid', stateId: 'MH', fuelType: 'hybrid', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 11.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: '11% Hybrid Tariff', effectiveYear: 2026 },
  { id: 'rto-mh-cng', stateId: 'MH', fuelType: 'cng', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 8.0, fixedCessINR: 800, greenCessINR: 0, specialNotes: '8% Clean CNG Tariff', effectiveYear: 2026 },

  // --- UTTAR PRADESH (UP) ---
  { id: 'rto-up-ev', stateId: 'UP', fuelType: 'electric', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 0.0, fixedCessINR: 0, greenCessINR: 0, specialNotes: '100% Road Tax Waiver under UP EV Policy', effectiveYear: 2026 },
  { id: 'rto-up-hybrid', stateId: 'UP', fuelType: 'hybrid', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 0.0, fixedCessINR: 0, greenCessINR: 0, specialNotes: '100% Road Tax Waiver for Strong Hybrids under UP Clean Mobility Initiative', effectiveYear: 2026 },
  { id: 'rto-up-petrol-low', stateId: 'UP', fuelType: 'petrol', priceMinINR: 0, priceMaxINR: 1000000, taxPercent: 8.0, fixedCessINR: 800, greenCessINR: 0, specialNotes: '8% Road Tax for sub-10L', effectiveYear: 2026 },
  { id: 'rto-up-petrol-high', stateId: 'UP', fuelType: 'petrol', priceMinINR: 1000000, priceMaxINR: 999999999, taxPercent: 10.0, fixedCessINR: 1200, greenCessINR: 0, specialNotes: '10% Road Tax for > 10L', effectiveYear: 2026 },
  { id: 'rto-up-diesel-high', stateId: 'UP', fuelType: 'diesel', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 10.0, fixedCessINR: 1200, greenCessINR: 500, specialNotes: '10% Road Tax for Diesel', effectiveYear: 2026 },
  { id: 'rto-up-cng', stateId: 'UP', fuelType: 'cng', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 6.0, fixedCessINR: 500, greenCessINR: 0, specialNotes: '6% CNG Road Tax', effectiveYear: 2026 },

  // --- TAMIL NADU (TN) ---
  { id: 'rto-tn-ev', stateId: 'TN', fuelType: 'electric', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 0.0, fixedCessINR: 0, greenCessINR: 0, specialNotes: '100% Tax Waiver under TN EV Policy', effectiveYear: 2026 },
  { id: 'rto-tn-petrol-low', stateId: 'TN', fuelType: 'petrol', priceMinINR: 0, priceMaxINR: 1000000, taxPercent: 12.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: '12% Road Tax for sub-10L', effectiveYear: 2026 },
  { id: 'rto-tn-petrol-high', stateId: 'TN', fuelType: 'petrol', priceMinINR: 1000000, priceMaxINR: 999999999, taxPercent: 18.0, fixedCessINR: 1500, greenCessINR: 0, specialNotes: '18% Road Tax for > 10L', effectiveYear: 2026 },
  { id: 'rto-tn-diesel-high', stateId: 'TN', fuelType: 'diesel', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 18.0, fixedCessINR: 1500, greenCessINR: 500, specialNotes: '18% Diesel Road Tax', effectiveYear: 2026 },
  { id: 'rto-tn-hybrid', stateId: 'TN', fuelType: 'hybrid', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 13.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: '13% Hybrid Tariff', effectiveYear: 2026 },

  // --- TELANGANA (TS) ---
  { id: 'rto-ts-ev', stateId: 'TS', fuelType: 'electric', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 0.0, fixedCessINR: 0, greenCessINR: 0, specialNotes: '100% Exemption under Telangana EV Policy', effectiveYear: 2026 },
  { id: 'rto-ts-petrol-low', stateId: 'TS', fuelType: 'petrol', priceMinINR: 0, priceMaxINR: 1000000, taxPercent: 14.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: '14% Road Tax for sub-10L', effectiveYear: 2026 },
  { id: 'rto-ts-petrol-high', stateId: 'TS', fuelType: 'petrol', priceMinINR: 1000000, priceMaxINR: 999999999, taxPercent: 17.0, fixedCessINR: 1500, greenCessINR: 0, specialNotes: '17% Road Tax for > 10L', effectiveYear: 2026 },
  { id: 'rto-ts-diesel', stateId: 'TS', fuelType: 'diesel', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 17.5, fixedCessINR: 1500, greenCessINR: 500, specialNotes: '17.5% Diesel Road Tax', effectiveYear: 2026 },
  { id: 'rto-ts-hybrid', stateId: 'TS', fuelType: 'hybrid', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 14.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: '14% Hybrid Tariff', effectiveYear: 2026 },

  // --- GUJARAT (GJ) ---
  { id: 'rto-gj-ev', stateId: 'GJ', fuelType: 'electric', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 4.5, fixedCessINR: 500, greenCessINR: 0, specialNotes: '4.5% Subsidized EV Rate', effectiveYear: 2026 },
  { id: 'rto-gj-petrol', stateId: 'GJ', fuelType: 'petrol', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 6.0, fixedCessINR: 600, greenCessINR: 0, specialNotes: '6% Flat Road Tax (Individual Registration)', effectiveYear: 2026 },
  { id: 'rto-gj-diesel', stateId: 'GJ', fuelType: 'diesel', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 6.0, fixedCessINR: 600, greenCessINR: 0, specialNotes: '6% Flat Diesel Road Tax', effectiveYear: 2026 },
  { id: 'rto-gj-cng', stateId: 'GJ', fuelType: 'cng', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 6.0, fixedCessINR: 500, greenCessINR: 0, specialNotes: '6% Flat CNG Road Tax', effectiveYear: 2026 },

  // --- KERALA (KL) ---
  { id: 'rto-kl-ev', stateId: 'KL', fuelType: 'electric', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 5.0, fixedCessINR: 500, greenCessINR: 0, specialNotes: '5% Reduced Electric Rate', effectiveYear: 2026 },
  { id: 'rto-kl-petrol-low', stateId: 'KL', fuelType: 'petrol', priceMinINR: 0, priceMaxINR: 1000000, taxPercent: 11.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: '11% Road Tax for sub-10L', effectiveYear: 2026 },
  { id: 'rto-kl-petrol-high', stateId: 'KL', fuelType: 'petrol', priceMinINR: 1000000, priceMaxINR: 2000000, taxPercent: 16.0, fixedCessINR: 1500, greenCessINR: 0, specialNotes: '16% Road Tax for 10L - 20L', effectiveYear: 2026 },
  { id: 'rto-kl-petrol-lux', stateId: 'KL', fuelType: 'petrol', priceMinINR: 2000000, priceMaxINR: 999999999, taxPercent: 21.0, fixedCessINR: 2000, greenCessINR: 0, specialNotes: '21% Luxury Tax for > 20L', effectiveYear: 2026 },
  { id: 'rto-kl-diesel-high', stateId: 'KL', fuelType: 'diesel', priceMinINR: 1000000, priceMaxINR: 2000000, taxPercent: 16.0, fixedCessINR: 1500, greenCessINR: 500, specialNotes: '16% Diesel Road Tax', effectiveYear: 2026 },

  // --- DEFAULT / FALLBACK NATIONAL SLAB ---
  { id: 'rto-default-ev', stateId: 'DEFAULT', fuelType: 'electric', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 2.0, fixedCessINR: 500, greenCessINR: 0, specialNotes: 'Average Indian EV Concession', effectiveYear: 2026 },
  { id: 'rto-default-petrol', stateId: 'DEFAULT', fuelType: 'petrol', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 12.0, fixedCessINR: 1000, greenCessINR: 0, specialNotes: 'Average Indian National Road Tax', effectiveYear: 2026 },
  { id: 'rto-default-diesel', stateId: 'DEFAULT', fuelType: 'diesel', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 14.0, fixedCessINR: 1200, greenCessINR: 500, specialNotes: 'Average Indian Diesel Road Tax', effectiveYear: 2026 },
  { id: 'rto-default-cng', stateId: 'DEFAULT', fuelType: 'cng', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 8.0, fixedCessINR: 500, greenCessINR: 0, specialNotes: 'Average Clean Fuel Rate', effectiveYear: 2026 },
  { id: 'rto-default-hybrid', stateId: 'DEFAULT', fuelType: 'hybrid', priceMinINR: 0, priceMaxINR: 999999999, taxPercent: 11.0, fixedCessINR: 800, greenCessINR: 0, specialNotes: 'Average Hybrid Rate', effectiveYear: 2026 },
];

export function getRtoRule(stateId: string, fuelType: FuelType, priceINR: number): StateRtoRule {
  const normState = stateId.toUpperCase();
  
  // 1. Try exact state + fuelType + price bracket
  const exactMatch = STATE_RTO_RULES.find(
    r => r.stateId === normState && r.fuelType === fuelType && priceINR >= r.priceMinINR && priceINR < r.priceMaxINR
  );
  if (exactMatch) return exactMatch;

  // 2. Try state + 'all' fuel types
  const stateAll = STATE_RTO_RULES.find(
    r => r.stateId === normState && r.fuelType === 'all' && priceINR >= r.priceMinINR && priceINR < r.priceMaxINR
  );
  if (stateAll) return stateAll;

  // 3. Fallback to DEFAULT national slab
  const defaultRule = STATE_RTO_RULES.find(
    r => r.stateId === 'DEFAULT' && r.fuelType === fuelType
  ) || STATE_RTO_RULES.find(r => r.stateId === 'DEFAULT' && r.fuelType === 'petrol');

  return defaultRule || {
    id: 'fallback',
    stateId: normState,
    fuelType,
    priceMinINR: 0,
    priceMaxINR: 999999999,
    taxPercent: 12.0,
    fixedCessINR: 1000,
    greenCessINR: 0,
    effectiveYear: 2026,
  };
}
