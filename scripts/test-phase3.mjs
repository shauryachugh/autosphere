// scripts/test-phase3.mjs
// Comprehensive test suite for AutoSphere Phase 3: Smart Car Replacement Intelligence

import {
  calculateStateOnRoadPrice,
  calculateLoanEMI,
  calculateCurrentCarTCO,
  calculateReplacementCarTCO,
  rankReplacementCars,
  generateFinalVerdict,
} from '../src/utils/tcoCalculator.js';
import { INDIAN_CAR_CATALOGUE } from '../src/data/indianCarCatalogue.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
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
assert(INDIAN_CAR_CATALOGUE.length >= 10, 'Catalogue contains at least 10 vehicles', `Found ${INDIAN_CAR_CATALOGUE.length}`);

const oems = new Set(INDIAN_CAR_CATALOGUE.map(c => c.make));
const expectedOEMs = ['Tata', 'Maruti Suzuki', 'Mahindra', 'Hyundai', 'Toyota', 'Kia', 'Honda', 'Skoda', 'Volkswagen', 'MG Motor', 'Renault'];
for (const oem of expectedOEMs) {
  assert(oems.has(oem), `Contains OEM: ${oem}`);
}

const fuelTypes = new Set(INDIAN_CAR_CATALOGUE.map(c => c.fuelType));
['Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric'].forEach(fuel => {
  assert(fuelTypes.has(fuel), `Contains fuel type: ${fuel}`);
});

// 2. On-Road Price & State RTO Model Tests
console.log('\n[2/5] Testing State RTO & On-Road Price Engine...');

// EV in Karnataka should have 0% RTO tax
const evOnRoadKA = calculateStateOnRoadPrice(1449000, 'Electric', 'Karnataka');
assert(evOnRoadKA.rtoTaxINR === 0, 'EV in Karnataka has 0% RTO road tax', `Tax: ${evOnRoadKA.rtoTaxINR}`);
assert(evOnRoadKA.onRoadPriceINR > 1449000, 'EV On-road price includes insurance and reg fee', `Price: ${evOnRoadKA.onRoadPriceINR}`);

// Diesel in Karnataka has 18% RTO road tax
const dieselOnRoadKA = calculateStateOnRoadPrice(1600000, 'Diesel', 'Karnataka');
const expectedTaxKA = Math.round(1600000 * 0.18);
assert(dieselOnRoadKA.rtoTaxINR === expectedTaxKA, `Diesel in Karnataka has 18% RTO tax (₹${expectedTaxKA})`, `Got: ${dieselOnRoadKA.rtoTaxINR}`);

// Petrol in Delhi has 10% RTO tax (< ₹10L)
const petrolOnRoadDL = calculateStateOnRoadPrice(850000, 'Petrol', 'Delhi');
const expectedTaxDL = Math.round(850000 * 0.10);
assert(petrolOnRoadDL.rtoTaxINR === expectedTaxDL, `Petrol <10L in Delhi has 10% RTO tax (₹${expectedTaxDL})`, `Got: ${petrolOnRoadDL.rtoTaxINR}`);

// 3. Loan EMI & Compound Interest Calculation
console.log('\n[3/5] Testing Loan EMI & Interest Engine...');
// Loan: 10 Lakhs, 9.5% per annum, 5 years (60 months)
const emiResult = calculateLoanEMI(1000000, 9.5, 5);
// Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
// For 10L at 9.5% for 5 yrs, standard EMI is ~₹21,002
assert(emiResult.monthlyEmiINR >= 20900 && emiResult.monthlyEmiINR <= 21100, 
  `5-yr ₹10L EMI is ~₹21,002 (Got: ₹${emiResult.monthlyEmiINR})`);
assert(emiResult.totalInterestINR > 0, `Total loan interest is positive (Got: ₹${emiResult.totalInterestINR})`);
assert(emiResult.totalPaymentINR === 1000000 + emiResult.totalInterestINR, 
  'Total loan payment equals Principal + Total Interest');

// Zero loan amount test
const zeroLoan = calculateLoanEMI(0, 9.5, 5);
assert(zeroLoan.monthlyEmiINR === 0 && zeroLoan.totalInterestINR === 0, 'Zero loan yields zero EMI and interest');

// 4. Current Car & Replacement TCO Engines
console.log('\n[4/5] Testing Deterministic TCO Engine...');

const sampleCurrentCar = {
  make: 'Maruti Suzuki',
  model: 'Swift',
  variant: 'ZXi',
  year: 2017,
  fuelType: 'Petrol',
  currentOdometerKm: 95000,
  monthlyKmDriven: 1400,
  monthlyFuelExpenseINR: 9800,
  annualMaintenanceINR: 24000,
  annualRepairExpenseINR: 15000,
  annualInsuranceINR: 18000,
  currentResaleValueINR: 380000,
};

const currentTCO = calculateCurrentCarTCO(sampleCurrentCar);
assert(currentTCO.currentMonthlyExpenseINR > 0, `Current monthly expense calculated: ₹${currentTCO.currentMonthlyExpenseINR}`);
assert(currentTCO.fiveYearNetTCOINR > currentTCO.threeYearNetTCOINR, '5-year TCO is greater than 3-year TCO');
assert(currentTCO.fuelCostPerKmINR > 0, `Fuel cost per km: ₹${currentTCO.fuelCostPerKmINR.toFixed(2)}`);

const sampleRequirements = {
  budgetMaxINR: 1800000,
  preferredMonthlyEmiMaxINR: 25000,
  downPaymentINR: 400000,
  includeResaleInDownPayment: true,
  loanTenureYears: 5,
  loanInterestRatePercent: 9.5,
  fuelTypePreference: 'Any',
  transmissionPreference: 'Any',
  categoryPreference: 'Any',
  monthlyKmDriven: 1400,
  state: 'Karnataka',
  city: 'Bengaluru',
  drivingMix: 'City 70% / Highway 30%',
};

const nexonEV = INDIAN_CAR_CATALOGUE.find(c => c.model === 'Nexon.ev');
assert(Boolean(nexonEV), 'Nexon.ev found in catalogue');

const replacementTCO = calculateReplacementCarTCO(
  nexonEV,
  sampleRequirements,
  sampleCurrentCar.currentResaleValueINR
);

assert(replacementTCO.onRoadPriceINR > 0, `On-road price calculated: ₹${replacementTCO.onRoadPriceINR}`);
assert(replacementTCO.monthlyEmiINR >= 0, `Monthly EMI: ₹${replacementTCO.monthlyEmiINR}`);
assert(replacementTCO.monthlyFuelCostINR < sampleCurrentCar.monthlyFuelExpenseINR, 
  'EV monthly fuel/energy cost is significantly lower than petrol Swift');
assert(replacementTCO.fiveYearResaleValueINR > 0, `5-Year estimated resale value: ₹${replacementTCO.fiveYearResaleValueINR}`);
// Net TCO must not double count purchase price and loan principal
assert(replacementTCO.fiveYearNetTCOINR > 0, `5-Year Net TCO: ₹${replacementTCO.fiveYearNetTCOINR}`);

// 5. Ranking Engine & Final Verdict Tests
console.log('\n[5/5] Testing Multi-Factor Ranking & Verdict Engine...');

const rankedCars = rankReplacementCars(
  INDIAN_CAR_CATALOGUE,
  sampleCurrentCar,
  sampleRequirements
);

assert(rankedCars.length > 0, `Ranked ${rankedCars.length} replacement cars`);
assert(rankedCars[0].matchScore >= rankedCars[rankedCars.length - 1].matchScore, 
  'Cars are ordered by descending match score');
assert(rankedCars[0].matchRationale.length > 0, 'Top ranked car includes transparent match rationale');

// Test Verdict generation
const topCar = rankedCars[0];
const verdict = generateFinalVerdict(sampleCurrentCar, topCar, currentTCO, topCar.tco);

const validVerdicts = [
  'KEEP YOUR CURRENT CAR',
  'CONSIDER UPGRADING',
  'REPLACEMENT MAY BE FINANCIALLY BENEFICIAL',
];
assert(validVerdicts.includes(verdict.verdict), `Verdict outcome is valid: "${verdict.verdict}"`);
assert(verdict.headline.length > 0, 'Verdict has actionable headline');
assert(verdict.financialReasoning.length > 0, 'Verdict has detailed financial reasoning');
assert(verdict.actionPoints.length >= 3, 'Verdict includes at least 3 actionable next steps');

console.log('\n===============================================================');
console.log(`Phase 3 Test Results: ${passed} Passed, ${failed} Failed`);
console.log('===============================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Phase 3 Financial Engine & Recommendation Tests PASSED!');
}
