import {
  getEfficiencyUnit,
  getEffectiveActualMileage,
  formatVehicleEfficiency,
  calculateGarageEconomyAverages,
} from '../src/utils/vehicleEconomy';
import { Vehicle } from '../src/types';

function assert(cond: boolean, name: string) {
  if (!cond) {
    console.error(`  ❌ [FAIL] ${name}`);
    process.exit(1);
  }
  console.log(`  ✓ [PASS] ${name}`);
}

function makeVehicle(overrides: Partial<Vehicle>): Vehicle {
  return {
    id: 'v-1',
    make: 'Hyundai',
    model: 'Creta',
    variant: 'SX',
    year: 2024,
    regNumber: 'KA 01 AB 1234',
    vin: '',
    fuelType: 'petrol',
    transmission: 'automatic',
    bodyType: 'suv',
    powerBhp: 115,
    torqueNm: 144,
    odoKm: 12000,
    currentFuelPercent: 75,
    estimatedRangeKm: 500,
    avgEfficiency: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: '2027-01-01',
    insuranceProvider: '',
    pucExpiryDate: '2027-01-01',
    lastServiceDate: '2026-01-01',
    lastServiceKm: 10000,
    nextServiceDueDate: '2027-01-01',
    nextServiceDueKm: 20000,
    healthScore: 95,
    image: '',
    isPrimary: false,
    city: 'Bengaluru',
    state: 'Karnataka',
    fastagBalanceINR: 0,
    connectedStatus: 'online',
    tyrePressurePsi: { frontLeft: 33, frontRight: 33, rearLeft: 33, rearRight: 33, spare: 34 },
    ...overrides,
  };
}

console.log('========================================================================');
console.log('⚡ AutoSphere Edit Vehicle & Economy Figures Test Suite');
console.log('========================================================================');

// 1. Unit mapping
assert(getEfficiencyUnit('petrol') === 'km/l', 'Petrol uses km/l');
assert(getEfficiencyUnit('diesel') === 'km/l', 'Diesel uses km/l');
assert(getEfficiencyUnit('hybrid') === 'km/l', 'Hybrid uses km/l');
assert(getEfficiencyUnit('cng') === 'km/kg', 'CNG uses km/kg');
assert(getEfficiencyUnit('electric') === 'km/kWh', 'Electric uses km/kWh (never km/l)');

// 2. Missing economy values must NOT default to 14.5
const emptyPetrol = makeVehicle({ fuelType: 'petrol', avgEfficiency: '' });
assert(getEffectiveActualMileage(emptyPetrol) === undefined, 'Missing petrol mileage stays undefined (no 14.5 default)');
assert(formatVehicleEfficiency(getEffectiveActualMileage(emptyPetrol), 'petrol') === 'Not set', 'Missing mileage formats as "Not set"');

const legacyEvWhKm = makeVehicle({ id: 'ev-legacy', fuelType: 'electric', avgEfficiency: '135 Wh/km' });
assert(getEffectiveActualMileage(legacyEvWhKm) === undefined, 'Legacy EV Wh/km string is not misread as km/kWh');

// 3. Explicit numeric values
const petrolCar = makeVehicle({ id: 'v-petrol', fuelType: 'petrol', actualMileage: 15.5, claimedMileage: 18.4 });
const dieselCar = makeVehicle({ id: 'v-diesel', fuelType: 'diesel', actualMileage: 18.5, claimedMileage: 21.0 });
const cngCar = makeVehicle({ id: 'v-cng', fuelType: 'cng', actualMileage: 24.0, claimedMileage: 26.5 });
const evCar = makeVehicle({ id: 'v-ev', fuelType: 'electric', actualMileage: 6.8, claimedMileage: 8.2 });
const noEconomyCar = makeVehicle({ id: 'v-empty', fuelType: 'petrol' });

assert(formatVehicleEfficiency(evCar.actualMileage, 'electric') === '6.8 km/kWh', 'EV efficiency displays in km/kWh');
assert(formatVehicleEfficiency(cngCar.actualMileage, 'cng') === '24 km/kg', 'CNG efficiency displays in km/kg');

// 4. Garage averages grouped by unit & excluding missing vehicles
const averages = calculateGarageEconomyAverages([petrolCar, dieselCar, cngCar, evCar, noEconomyCar]);
assert(averages.length === 3, 'Averages grouped separately into km/l, km/kg, and km/kWh');

const liquidAvg = averages.find((g) => g.unit === 'km/l');
assert(liquidAvg?.vehicleCount === 2 && liquidAvg.average === 17, `Liquid fuel average excludes missing-economy car: ${liquidAvg?.average} km/l across ${liquidAvg?.vehicleCount} vehicles`);

const evAvg = averages.find((g) => g.unit === 'km/kWh');
assert(evAvg?.vehicleCount === 1 && evAvg.average === 6.8, `EV average kept separate: ${evAvg?.average} km/kWh`);

// 5. Recalculation after edit
const editedPetrol = { ...petrolCar, actualMileage: 17.5 };
const updatedAverages = calculateGarageEconomyAverages([editedPetrol, dieselCar, noEconomyCar]);
const updatedLiquid = updatedAverages.find((g) => g.unit === 'km/l');
assert(updatedLiquid?.average === 18, `Garage average recalculated after edit: ${updatedLiquid?.average} km/l`);

console.log('========================================================================');
console.log('🎉 ALL EDIT VEHICLE & ECONOMY TESTS PASSED!');
console.log('========================================================================');
