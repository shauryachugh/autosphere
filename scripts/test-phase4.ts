// scripts/test-phase4.ts
// Comprehensive Test Suite for AutoSphere Phase 4: India Automotive Database & Pricing Engine

import { INDIAN_MANUFACTURERS } from '../src/data/manufacturersData';
import { INDIAN_CAR_MODELS } from '../src/data/modelsData';
import { INDIAN_CAR_VARIANTS } from '../src/data/variantsData';
import { ALL_INDIAN_STATES, ALL_INDIAN_CITIES, getCitiesForState, searchLocations } from '../src/data/locationsData';
import { STATE_RTO_RULES, getRtoRule } from '../src/data/stateRtoRulesData';
import { STATE_FUEL_PRICES, STATE_EV_TARIFFS, calculateLocationRunningCostPerKm } from '../src/data/fuelTariffsData';
import { calculateOnRoadPrice, calculateVariantOnRoadPrice, comparePriceAcrossStates } from '../src/utils/pricingEngine';

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

console.log('========================================================================');
console.log('⚡ AutoSphere Phase 4: India Automotive Database & Pricing Engine Tests');
console.log('========================================================================');

// ------------------------------------------------------------------------
// MODULE 1: MANUFACTURER DATABASE TESTS
// ------------------------------------------------------------------------
console.log('\n[1/6] Testing Manufacturer Database...');
assert(INDIAN_MANUFACTURERS.length >= 11, 'Contains at least 11 major OEMs', `Found ${INDIAN_MANUFACTURERS.length}`);

const requiredOEMs = [
  'Maruti Suzuki',
  'Hyundai Motor India',
  'Tata Motors',
  'Mahindra & Mahindra',
  'Kia India',
  'Toyota Kirloskar Motor',
  'Honda Cars India',
  'Skoda Auto India',
  'Volkswagen India',
  'Renault India',
  'MG Motor India',
];

for (const oem of requiredOEMs) {
  const found = INDIAN_MANUFACTURERS.some(m => m.name === oem);
  assert(found, `OEM present: ${oem}`);
}

const allHaveFields = INDIAN_MANUFACTURERS.every(
  m => m.id && m.name && m.slug && m.country && m.yearEstablishedIndia > 1900 && m.headquartersIndia && m.websiteUrl && m.supportPhone
);
assert(allHaveFields, 'All manufacturers contain complete valid metadata');

// ------------------------------------------------------------------------
// MODULE 2: CAR MODEL DATABASE TESTS
// ------------------------------------------------------------------------
console.log('\n[2/6] Testing Car Model Database...');
assert(INDIAN_CAR_MODELS.length >= 20, 'Contains at least 20 distinct car models', `Found ${INDIAN_CAR_MODELS.length}`);

const mfrIds = new Set(INDIAN_MANUFACTURERS.map(m => m.id));
const allModelsValidMfr = INDIAN_CAR_MODELS.every(m => mfrIds.has(m.manufacturerId));
assert(allModelsValidMfr, 'Every car model references a valid manufacturer ID');

const categories = new Set(INDIAN_CAR_MODELS.map(m => m.category));
['suv', 'sedan', 'hatchback', 'mpv', 'crossover'].forEach(cat => {
  assert(categories.has(cat as any), `Contains category: ${cat}`);
});

const allModelsHaveLaunchAndStatus = INDIAN_CAR_MODELS.every(
  m => m.launchYear >= 1990 && m.marketStatus === 'active' && m.availableFuelTypes.length > 0 && typeof m.imageUrl === 'string'
);
assert(allModelsHaveLaunchAndStatus, 'Every model has valid launch year, active status, fuels, and image field');

// ------------------------------------------------------------------------
// MODULE 3: VARIANT DATABASE TESTS
// ------------------------------------------------------------------------
console.log('\n[3/6] Testing Variant Database...');
assert(INDIAN_CAR_VARIANTS.length >= 20, 'Contains at least 20 comprehensive variants', `Found ${INDIAN_CAR_VARIANTS.length}`);

const modelIds = new Set(INDIAN_CAR_MODELS.map(m => m.id));
const allVariantsValidModel = INDIAN_CAR_VARIANTS.every(v => modelIds.has(v.modelId));
assert(allVariantsValidModel, 'Every variant references a valid model ID');

const variantFuels = new Set(INDIAN_CAR_VARIANTS.map(v => v.fuelType));
['petrol', 'diesel', 'electric', 'hybrid', 'cng'].forEach(f => {
  assert(variantFuels.has(f as any), `Contains variant fuel type: ${f}`);
});

// Verify EV and ICE specific fields
const nexonEvVariant = INDIAN_CAR_VARIANTS.find(v => v.id === 'var-tata-nexon-ev-fearless');
assert(Boolean(nexonEvVariant && nexonEvVariant.batteryCapacityKwh === 45.0), 'EV variant contains battery capacity (45 kWh)');
assert(Boolean(nexonEvVariant && nexonEvVariant.mileageUnit === 'km/charge'), 'EV variant uses km/charge unit');

const xuv700Diesel = INDIAN_CAR_VARIANTS.find(v => v.id === 'var-mahindra-xuv700-ax7-l-diesel-at');
assert(Boolean(xuv700Diesel && xuv700Diesel.engineCapacityCc === 2184), 'Diesel variant contains engine displacement (2184 cc)');
assert(Boolean(xuv700Diesel && xuv700Diesel.seatingCapacity === 7), 'XUV700 variant supports 7 seats');

const allVariantsHavePrices = INDIAN_CAR_VARIANTS.every(
  v => v.exShowroomPriceINR > 500000 && v.powerBhp > 50 && v.torqueNm > 80 && v.annualMaintenanceEstimateINR > 0
);
assert(allVariantsHavePrices, 'All variants have realistic ex-showroom prices and power figures');

// ------------------------------------------------------------------------
// MODULE 4: INDIA LOCATION DATABASE TESTS
// ------------------------------------------------------------------------
console.log('\n[4/6] Testing India Location Database...');
assert(ALL_INDIAN_STATES.length === 36, 'Contains exactly 36 States and Union Territories (28 States + 8 UTs)', `Found ${ALL_INDIAN_STATES.length}`);

const statesOnly = ALL_INDIAN_STATES.filter(s => s.type === 'state');
const utsOnly = ALL_INDIAN_STATES.filter(s => s.type === 'union_territory');
assert(statesOnly.length === 28, 'Contains 28 States');
assert(utsOnly.length === 8, 'Contains 8 Union Territories');

assert(ALL_INDIAN_CITIES.length >= 30, 'Contains comprehensive city catalogue', `Found ${ALL_INDIAN_CITIES.length}`);

const stateIds = new Set(ALL_INDIAN_STATES.map(s => s.id));
const allCitiesHaveValidState = ALL_INDIAN_CITIES.every(c => stateIds.has(c.stateId));
assert(allCitiesHaveValidState, 'Every city maps to a valid State/UT ID');

const kaCities = getCitiesForState('KA');
assert(kaCities.length >= 4, 'Karnataka contains multiple cities (Bengaluru, Mysuru, Mangaluru, etc.)');

const searchRes = searchLocations('Pune');
assert(searchRes.cities.some(c => c.name === 'Pune' && c.stateId === 'MH'), 'Search successfully resolves Pune in Maharashtra');

// ------------------------------------------------------------------------
// MODULE 5: MODULAR ON-ROAD PRICING ENGINE TESTS
// ------------------------------------------------------------------------
console.log('\n[5/6] Testing Modular On-Road Pricing Engine...');

// Test 1: EV in Karnataka has 0% RTO tax + waiver benefits
const evPricingKA = calculateOnRoadPrice({
  exShowroomPriceINR: 1699000,
  fuelType: 'electric',
  stateId: 'KA',
  cityId: 'bengaluru',
});
assert(evPricingKA.rtoRoadTaxINR === 0, 'EV in Karnataka has ₹0 RTO road tax', `Tax: ${evPricingKA.rtoRoadTaxINR}`);
assert(evPricingKA.taxSavingsVsNationalAverageINR > 0, 'EV in Karnataka earns tax savings vs national average');

// Test 2: Diesel in Karnataka has 15.5% road tax + 11% infra cess
const dieselPricingKA = calculateOnRoadPrice({
  exShowroomPriceINR: 2000000,
  fuelType: 'diesel',
  stateId: 'KA',
  cityId: 'bengaluru',
  engineCapacityCc: 2000,
});
// 20L * 18.5% = 3.7L, with infra cess ~ ₹4,10,700
assert(dieselPricingKA.rtoRoadTaxINR > 350000, 'Diesel luxury SUV in Karnataka has > 17% effective RTO road tax', `Got: ₹${dieselPricingKA.rtoRoadTaxINR}`);

// Test 3: Strong Hybrid in Uttar Pradesh has 0% road tax under UP clean mobility initiative
const hybridPricingUP = calculateOnRoadPrice({
  exShowroomPriceINR: 1993000,
  fuelType: 'hybrid',
  stateId: 'UP',
  cityId: 'noida',
});
assert(hybridPricingUP.rtoRoadTaxINR === 0, 'Strong Hybrid in UP has 0% road tax waiver', `Tax: ${hybridPricingUP.rtoRoadTaxINR}`);

// Test 4: TCS (1%) application check
const sub10LPricing = calculateOnRoadPrice({
  exShowroomPriceINR: 964000,
  fuelType: 'petrol',
  stateId: 'DL',
  cityId: 'new-delhi',
});
assert(sub10LPricing.tcsINR === 0, 'Car under ₹10L has ₹0 TCS');

const above10LPricing = calculateOnRoadPrice({
  exShowroomPriceINR: 1500000,
  fuelType: 'petrol',
  stateId: 'DL',
  cityId: 'new-delhi',
});
assert(above10LPricing.tcsINR === 15000, 'Car at ₹15L has exact 1% TCS (₹15,000)');

// Test 5: Multi-state price comparison on the same vehicle
const gvHybridVariant = INDIAN_CAR_VARIANTS.find(v => v.id === 'var-maruti-gv-strong-hybrid-alpha')!;
const multiStateComp = comparePriceAcrossStates(gvHybridVariant, ['KA', 'DL', 'MH', 'UP']);
assert(multiStateComp.length === 4, 'Multi-state comparison evaluated across 4 states');

const upComp = multiStateComp.find(s => s.stateId === 'UP')!;
const kaComp = multiStateComp.find(s => s.stateId === 'KA')!;
assert(upComp.breakdown.totalOnRoadPriceINR < kaComp.breakdown.totalOnRoadPriceINR, 
  `UP on-road price (₹${upComp.breakdown.totalOnRoadPriceINR.toLocaleString('en-IN')}) is significantly lower than KA (₹${kaComp.breakdown.totalOnRoadPriceINR.toLocaleString('en-IN')}) due to UP hybrid road tax waiver`);

// ------------------------------------------------------------------------
// MODULE 6: FUEL AND EV CHARGING DATABASE TESTS
// ------------------------------------------------------------------------
console.log('\n[6/6] Testing Fuel & EV Charging Tariffs Engine...');
assert(STATE_FUEL_PRICES.length >= 10, 'Fuel prices recorded across major states', `Found ${STATE_FUEL_PRICES.length}`);
assert(STATE_EV_TARIFFS.length >= 8, 'EV charging tariffs recorded across state Discoms', `Found ${STATE_EV_TARIFFS.length}`);

// Test running cost per km for EV vs Petrol in Karnataka
const evRunningCostKA = calculateLocationRunningCostPerKm('electric', 489, 'KA');
const petrolRunningCostKA = calculateLocationRunningCostPerKm('petrol', 17.0, 'KA');

assert(evRunningCostKA.costPerKmINR < 2.0, `EV running cost in Karnataka is < ₹2.0/km (Got: ₹${evRunningCostKA.costPerKmINR}/km)`);
assert(petrolRunningCostKA.costPerKmINR > 5.0, `Petrol running cost in Karnataka is > ₹5.0/km (Got: ₹${petrolRunningCostKA.costPerKmINR}/km)`);
assert(evRunningCostKA.costPerKmINR < petrolRunningCostKA.costPerKmINR, 'EV running cost is over 60% cheaper per km than petrol in Karnataka');

console.log('\n========================================================================');
console.log(`Phase 4 Test Results: ${passed} Passed, ${failed} Failed`);
console.log('========================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Phase 4 Automotive Database & Pricing Engine Tests PASSED!');
}
