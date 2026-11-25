import {
  RAJASTHAN_RTO_OFFICES,
  getRtosForState,
  findRtoByCode,
} from '../src/data/rtoOfficesData';
import { indianCarCatalogue } from '../src/data/indianCarCatalogue';
import {
  calculateCurrentCarTCO,
  rankReplacementCars,
  generateFinalVerdict,
} from '../src/utils/tcoCalculator';
import { CurrentVehicleAnalysis, ReplacementRequirements } from '../src/types/replacement.types';

function assert(cond: boolean, name: string) {
  if (!cond) {
    console.error(`  ❌ [FAIL] ${name}`);
    process.exit(1);
  }
  console.log(`  ✓ [PASS] ${name}`);
}

console.log('========================================================================');
console.log('🧪 AutoSphere Rajasthan RTO + Verdict + Filter Persistence Test Suite');
console.log('========================================================================');

// 1. Rajasthan RTO Database Checks
const rjCodes = RAJASTHAN_RTO_OFFICES.map((r) => r.code);
const uniqueCodes = new Set(rjCodes);
assert(rjCodes.length === uniqueCodes.size, `Zero duplicate Rajasthan RTO codes (${rjCodes.length} unique records)`);
assert(rjCodes.length >= 60, `Includes older RJ01-RJ38 and newer allocations up to RJ60+ (Total: ${rjCodes.length})`);
assert(Boolean(findRtoByCode('RJ14') && findRtoByCode('RJ45') && findRtoByCode('RJ60')), 'Includes Jaipur multiple RTO allocations (RJ14, RJ45, RJ60)');
assert(Boolean(findRtoByCode('RJ55')?.districtOrCity.includes('Pokhran')), 'RJ55 maps to Pokhran (Jaisalmer)');
assert(Boolean(findRtoByCode('RJ58')?.districtOrCity.includes('Salumber')), 'RJ58 maps to Salumber');
assert(findRtoByCode('RJ61')?.verificationStatus === 'needs_verification', 'Uncertain newer code RJ61 marked as needs_verification');

const onlyRj = getRtosForState('Rajasthan');
assert(onlyRj.every((r) => r.stateId === 'RJ'), 'Selecting Rajasthan returns Rajasthan RTOs only');
const onlyKa = getRtosForState('Karnataka');
assert(onlyKa.length > 0 && onlyKa.every((r) => r.stateId === 'KA'), 'Selecting Karnataka returns Karnataka RTOs only');

// 2. Diesel Filter Enforcement
const sampleCurrentCar: CurrentVehicleAnalysis = {
  make: 'Maruti Suzuki',
  model: 'Swift',
  variant: 'ZXI',
  manufacturingYear: 2019,
  fuelType: 'petrol',
  transmission: 'manual',
  bodyType: 'hatchback',
  currentOdometer: 52000,
  monthlyKmDriven: 1500,
  monthlyFuelExpenditure: 9000,
  annualMaintenanceExpenses: 12000,
  annualRepairExpenses: 6000,
  annualInsuranceExpenses: 18000,
  currentEstimatedResaleValue: 480000,
  city: 'Jaipur',
  state: 'Rajasthan',
};

const currentTCO = calculateCurrentCarTCO(sampleCurrentCar);
const dieselCriteria: ReplacementRequirements = {
  maxPurchaseBudgetINR: 2500000,
  preferredMonthlyEmiINR: 30000,
  downPaymentINR: 400000,
  applyResaleAsDownPayment: true,
  loanTenureYears: 5,
  loanInterestRatePercent: 9.0,
  preferredFuelType: 'diesel',
  transmissionPreference: 'all',
  vehicleCategory: 'all',
  monthlyDrivingDistanceKm: 1500,
  state: 'Rajasthan',
  city: 'Jaipur',
  cityDrivingPercent: 60,
  highwayDrivingPercent: 40,
};

const dieselRanked = rankReplacementCars(
  indianCarCatalogue,
  dieselCriteria,
  currentTCO,
  sampleCurrentCar.currentEstimatedResaleValue
);
assert(dieselRanked.length > 0, `Diesel filter returned ${dieselRanked.length} Diesel vehicles`);
assert(dieselRanked.every((r) => r.car.fuelType === 'diesel'), 'Diesel filter strictly excludes Petrol/EV/Hybrid/CNG');
assert(!dieselRanked.some((r) => r.car.model.toLowerCase().includes('punch')), 'Tata Punch is NOT in Diesel-filtered results');

// 3. Tata Punch Verdict Fix (Strict Selected-ID Binding)
const selectedWithoutPunch = dieselRanked.slice(0, 2);
const verdictForSelected = generateFinalVerdict(
  currentTCO,
  selectedWithoutPunch,
  dieselCriteria,
  sampleCurrentCar
);
assert(
  Boolean(verdictForSelected.bestReplacementCar && selectedWithoutPunch.some((s) => s.car.id === verdictForSelected.bestReplacementCar!.car.id)),
  `Verdict picks strictly from selected IDs (${verdictForSelected.bestReplacementCar?.car.make} ${verdictForSelected.bestReplacementCar?.car.model})`
);
assert(
  !verdictForSelected.summary.toLowerCase().includes('punch'),
  'Verdict summary does NOT mention Tata Punch when Punch is not selected'
);

const emptyVerdict = generateFinalVerdict(currentTCO, [], dieselCriteria, sampleCurrentCar);
assert(
  emptyVerdict.bestReplacementCar === undefined && emptyVerdict.summary === 'Select vehicles to generate your comparison.',
  'Empty selection returns "Select vehicles to generate your comparison." without fallback car'
);

console.log('========================================================================');
console.log('🎉 ALL RAJASTHAN RTO, VERDICT & FILTER PERSISTENCE TESTS PASSED!');
console.log('========================================================================');
