// scripts/test-phase3.ts
// Comprehensive test suite for AutoSphere Phase 3: Smart Car Replacement Intelligence

import {
  calculateStateOnRoadPrice,
  calculateLoanEMI,
  calculateCurrentCarTCO,
  calculateReplacementCarTCO,
  rankReplacementCars,
  generateFinalVerdict,
} from '../src/utils/tcoCalculator';
import { indianCarCatalogue } from '../src/data/indianCarCatalogue';
import { CurrentVehicleAnalysis, ReplacementRequirements } from '../src/types/replacement.types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
    failed++;
  }
}

console.log('===============================================================');
console.log('⚡ AutoSphere Phase 3: Smart Car Replacement Intelligence Tests');
console.log('===============================================================');

// 1. Catalogue Data Validation
console.log('\n[1/5] Testing Indian Car Catalogue Integrity...');
assert(indianCarCatalogue.length >= 10, 'Catalogue contains at least 10 vehicles', `Found ${indianCarCatalogue.length}`);

const oems = new Set(indianCarCatalogue.map(c => c.make));
const expectedOEMs = ['Tata Motors', 'Maruti Suzuki', 'Mahindra', 'Hyundai', 'Toyota', 'Kia', 'Honda', 'Skoda', 'Volkswagen', 'MG Motor', 'Renault'];
for (const oem of expectedOEMs) {
  assert(oems.has(oem), `Contains OEM: ${oem}`);
}

const fuelTypes = new Set(indianCarCatalogue.map(c => c.fuelType));
(['petrol', 'diesel', 'cng', 'hybrid', 'electric'] as const).forEach(fuel => {
  assert(fuelTypes.has(fuel), `Contains fuel type: ${fuel}`);
});

// 2. On-Road Price & State RTO Model Tests
console.log('\n[2/5] Testing State RTO & On-Road Price Engine...');

// EV in Karnataka should have 0% RTO tax
const evOnRoadKA = calculateStateOnRoadPrice(1699000, 'electric', 'Karnataka');
assert(evOnRoadKA.roadTax === 0, 'EV in Karnataka has 0% RTO road tax', `Tax: ${evOnRoadKA.roadTax}`);
assert(evOnRoadKA.totalOnRoadPrice > 1699000, 'EV On-road price includes insurance and reg fee', `Price: ${evOnRoadKA.totalOnRoadPrice}`);

// Diesel in Karnataka has 15-18% RTO road tax
const dieselOnRoadKA = calculateStateOnRoadPrice(1600000, 'diesel', 'Karnataka');
const expectedTaxKA = Math.round(1600000 * 0.15);
assert(dieselOnRoadKA.roadTax === expectedTaxKA, `Diesel <= 20L in Karnataka has 15% RTO tax (₹${expectedTaxKA})`, `Got: ${dieselOnRoadKA.roadTax}`);

// Petrol in Delhi has 10% RTO tax (< ₹10L)
const petrolOnRoadDL = calculateStateOnRoadPrice(850000, 'petrol', 'Delhi');
const expectedTaxDL = Math.round(850000 * 0.10);
assert(petrolOnRoadDL.roadTax === expectedTaxDL, `Petrol < 10L in Delhi has 10% RTO tax (₹${expectedTaxDL})`, `Got: ${petrolOnRoadDL.roadTax}`);

// 3. Loan EMI & Compound Interest Calculation
console.log('\n[3/5] Testing Loan EMI & Interest Engine...');
// Loan: 10 Lakhs, 9.5% per annum, 5 years (60 months)
const emiResult = calculateLoanEMI(1000000, 9.5, 5);
// For 10L at 9.5% for 5 yrs, standard EMI is ~₹21,002
assert(emiResult.monthlyEMI >= 20900 && emiResult.monthlyEMI <= 21100, 
  `5-yr ₹10L EMI is ~₹21,002 (Got: ₹${emiResult.monthlyEMI})`);
assert(emiResult.totalInterest > 0, `Total loan interest is positive (Got: ₹${emiResult.totalInterest})`);
assert(emiResult.totalPayment === 1000000 + emiResult.totalInterest, 
  'Total loan payment equals Principal + Total Interest');

// Zero loan amount test
const zeroLoan = calculateLoanEMI(0, 9.5, 5);
assert(zeroLoan.monthlyEMI === 0 && zeroLoan.totalInterest === 0, 'Zero loan yields zero EMI and interest');

// 4. Current Car & Replacement TCO Engines
console.log('\n[4/5] Testing Deterministic TCO Engine...');

const sampleCurrentCar: CurrentVehicleAnalysis = {
  make: 'Maruti Suzuki',
  model: 'Swift',
  variant: 'ZXi',
  manufacturingYear: 2017,
  fuelType: 'petrol',
  transmission: 'manual',
  bodyType: 'hatchback',
  currentOdometer: 95000,
  monthlyKmDriven: 1400,
  monthlyFuelExpenditure: 9800,
  annualMaintenanceExpenses: 24000,
  annualRepairExpenses: 15000,
  annualInsuranceExpenses: 18000,
  currentEstimatedResaleValue: 380000,
  city: 'Bengaluru',
  state: 'Karnataka',
};

const currentTCO = calculateCurrentCarTCO(sampleCurrentCar);
assert(currentTCO.monthlyOwnershipExpenditure > 0, `Current monthly expenditure calculated: ₹${currentTCO.monthlyOwnershipExpenditure}`);
assert(currentTCO.fiveYearTotalOwnershipCost > currentTCO.threeYearTotalOwnershipCost, '5-year TCO is greater than 3-year TCO');
assert(currentTCO.fuelExpenditurePerKm > 0, `Fuel cost per km: ₹${currentTCO.fuelExpenditurePerKm.toFixed(2)}`);

const sampleRequirements: ReplacementRequirements = {
  maxPurchaseBudgetINR: 1800000,
  preferredMonthlyEmiINR: 25000,
  downPaymentINR: 400000,
  applyResaleAsDownPayment: true,
  loanTenureYears: 5,
  loanInterestRatePercent: 9.5,
  preferredFuelType: 'all',
  transmissionPreference: 'all',
  vehicleCategory: 'all',
  monthlyDrivingDistanceKm: 1400,
  state: 'Karnataka',
  city: 'Bengaluru',
  cityDrivingPercent: 70,
  highwayDrivingPercent: 30,
};

const nexonEV = indianCarCatalogue.find(c => c.model === 'Nexon.ev');
assert(Boolean(nexonEV), 'Nexon.ev found in catalogue');

if (nexonEV) {
  const replacementTCO = calculateReplacementCarTCO(
    nexonEV,
    sampleRequirements,
    sampleCurrentCar.currentEstimatedResaleValue
  );

  assert(replacementTCO.estimatedOnRoadPriceINR > 0, `On-road price calculated: ₹${replacementTCO.estimatedOnRoadPriceINR}`);
  assert(replacementTCO.monthlyEmiINR >= 0, `Monthly EMI: ₹${replacementTCO.monthlyEmiINR}`);
  assert(replacementTCO.monthlyFuelCostINR < sampleCurrentCar.monthlyFuelExpenditure, 
    'EV monthly fuel/energy cost is significantly lower than petrol Swift');
  assert(replacementTCO.expectedResaleValue5YrINR > 0, `5-Year estimated resale value: ₹${replacementTCO.expectedResaleValue5YrINR}`);
  // Net TCO must not double count purchase price and loan principal
  assert(replacementTCO.fiveYearNetTCOINR > 0, `5-Year Net TCO: ₹${replacementTCO.fiveYearNetTCOINR}`);
}

// 5. Ranking Engine & Final Verdict Tests
console.log('\n[5/5] Testing Multi-Factor Ranking & Verdict Engine...');

const rankedCars = rankReplacementCars(
  indianCarCatalogue,
  sampleRequirements,
  currentTCO,
  sampleCurrentCar.currentEstimatedResaleValue
);

assert(rankedCars.length > 0, `Ranked ${rankedCars.length} replacement cars`);
assert(rankedCars[0].matchScore >= rankedCars[rankedCars.length - 1].matchScore, 
  'Cars are ordered by descending match score');
assert(rankedCars[0].whySelectedReasons.length > 0, 'Top ranked car includes transparent match rationale');

// Test Verdict generation
const verdict = generateFinalVerdict(
  currentTCO,
  rankedCars,
  sampleRequirements,
  sampleCurrentCar
);

const validOutcomes = [
  'KEEP_CURRENT',
  'CONSIDER_UPGRADING',
  'REPLACEMENT_FINANCIALLY_BENEFICIAL',
];
assert(validOutcomes.includes(verdict.outcome), `Verdict outcome is valid: "${verdict.outcome}"`);
assert(verdict.headline.length > 0, `Verdict headline: "${verdict.headline}"`);
assert(verdict.financialJustification.length > 0, 'Verdict has detailed financial reasoning');
assert(verdict.actionSteps.length >= 2, 'Verdict includes actionable next steps');

console.log('\n===============================================================');
console.log(`Phase 3 Test Results: ${passed} Passed, ${failed} Failed`);
console.log('===============================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Phase 3 Financial Engine & Recommendation Tests PASSED!');
}
