import { FuelType } from '../types';
import {
  CarVariant,
  OnRoadPriceBreakdown,
  OnRoadPriceCalculationInput,
} from '../types/automotive.types';
import { getRtoRule } from '../data/stateRtoRulesData';
import { STATES_BY_ID, CITIES_BY_ID } from '../data/locationsData';

// Modular, Decoupled On-Road Pricing Engine for Indian Automobiles
export function calculateOnRoadPrice(input: OnRoadPriceCalculationInput): OnRoadPriceBreakdown {
  const {
    exShowroomPriceINR,
    fuelType,
    stateId,
    cityId,
    engineCapacityCc,
    includeZeroDepInsurance = true,
    includeExtendedWarranty = false,
    includeAccessoriesKit = false,
  } = input;

  const state = STATES_BY_ID.get(stateId.toUpperCase()) || {
    id: stateId,
    name: stateId,
    type: 'state',
    capital: '',
    rtoCodePrefix: stateId,
    isActive: true,
  };

  const city = CITIES_BY_ID.get(cityId.toLowerCase()) || {
    id: cityId,
    name: cityId,
    stateId: stateId,
    tier: 2,
    rtoCodes: [],
    isMetro: false,
    municipalParkingTaxINR: 2000,
    localCessPercent: 0,
    isActive: true,
  };

  // 1. STATE RTO ROAD TAX
  const rule = getRtoRule(state.id, fuelType, exShowroomPriceINR);
  let baseRoadTax = Math.round(exShowroomPriceINR * (rule.taxPercent / 100));

  // Karnataka specific 11% Infrastructure Cess on road tax amount
  if (state.id.toUpperCase() === 'KA' && baseRoadTax > 0) {
    baseRoadTax = Math.round(baseRoadTax * 1.11);
  }

  const rtoRoadTaxINR = baseRoadTax + (rule.fixedCessINR || 0) + (rule.greenCessINR || 0);

  // 2. RTO REGISTRATION & SMART CARD & HSRP PLATES
  const rtoRegistrationFeeINR = 600;
  const smartCardAndPlateFeeINR = 1800; // HSRP laser plate + smart card RC + postal delivery

  // 3. MUNICIPAL PARKING TAX & LOCAL CESS
  const municipalParkingTaxINR = city.municipalParkingTaxINR || 0;
  const stateGreenCessINR = rule.greenCessINR || 0;

  // 4. TCS (Tax Collected at Source - Section 206C(1F) of IT Act: 1% for ex-showroom > ₹10,00,000)
  const tcsINR = exShowroomPriceINR > 1000000 ? Math.round(exShowroomPriceINR * 0.01) : 0;

  // 5. FASTAG MANDATORY CHARGE
  const fastagFeeINR = 500;

  // 6. COMPREHENSIVE INSURANCE (1-Yr OD + 3-Yr Mandatory TP + Zero Dep)
  // IDV (Insured Declared Value) is 95% of Ex-Showroom for brand-new vehicle
  const idv = Math.round(exShowroomPriceINR * 0.95);

  // 1-Year Own Damage (OD) premium: ~2.4% of IDV
  const insuranceBasicODINR = Math.round(idv * 0.024);

  // 3-Year Mandatory Third Party (TP) Insurance (IRDAI Slabs)
  let insuranceMandatoryTPINR = 10240; // standard 1000cc - 1500cc slab
  if (fuelType === 'electric') {
    insuranceMandatoryTPINR = 5540; // IRDAI subsidized electric TP slab
  } else if (engineCapacityCc && engineCapacityCc < 1000) {
    insuranceMandatoryTPINR = 6280;
  } else if (engineCapacityCc && engineCapacityCc > 1500) {
    insuranceMandatoryTPINR = 24800;
  }

  // Zero Depreciation (Bumper-to-Bumper) Add-on: ~0.45% of Ex-Showroom
  const insuranceZeroDepAddonINR = includeZeroDepInsurance ? Math.round(exShowroomPriceINR * 0.0045) : 0;

  const totalInsuranceINR = insuranceBasicODINR + insuranceMandatoryTPINR + insuranceZeroDepAddonINR;

  // 7. OPTIONAL DEALER PACKAGES
  const extendedWarrantyINR = includeExtendedWarranty
    ? Math.max(12000, Math.round(exShowroomPriceINR * 0.012))
    : 0;

  const essentialAccessoriesKitINR = includeAccessoriesKit ? 12500 : 0;

  // 8. TOTALS
  const mandatoryOnRoadPriceINR =
    exShowroomPriceINR +
    rtoRoadTaxINR +
    rtoRegistrationFeeINR +
    smartCardAndPlateFeeINR +
    municipalParkingTaxINR +
    tcsINR +
    fastagFeeINR +
    totalInsuranceINR;

  const totalOnRoadPriceINR =
    mandatoryOnRoadPriceINR + extendedWarrantyINR + essentialAccessoriesKitINR;

  // 9. TAX SAVINGS VS NATIONAL AVERAGE BENCHMARK
  // Benchmark national tax: 13% for petrol/hybrid/cng, 15% for diesel, 5% for electric
  const nationalAvgTaxPercent = fuelType === 'electric' ? 5 : fuelType === 'diesel' ? 15 : 13;
  const nationalAvgTax = Math.round(exShowroomPriceINR * (nationalAvgTaxPercent / 100));
  const taxSavingsVsNationalAverageINR = Math.max(0, nationalAvgTax - rtoRoadTaxINR);

  return {
    exShowroomPriceINR,
    stateId: state.id,
    stateName: state.name,
    cityId: city.id,
    cityName: city.name,
    fuelType,
    rtoRoadTaxPercent: rule.taxPercent,
    rtoRoadTaxINR,
    rtoRegistrationFeeINR,
    smartCardAndPlateFeeINR,
    municipalParkingTaxINR,
    stateGreenCessINR,
    tcsINR,
    fastagFeeINR,
    insuranceBasicODINR,
    insuranceMandatoryTPINR,
    insuranceZeroDepAddonINR,
    totalInsuranceINR,
    extendedWarrantyINR,
    essentialAccessoriesKitINR,
    mandatoryOnRoadPriceINR,
    totalOnRoadPriceINR,
    taxSavingsVsNationalAverageINR,
  };
}

// Convenient helper for a CarVariant object
export function calculateVariantOnRoadPrice(
  variant: CarVariant,
  stateId: string,
  cityId: string,
  options?: {
    includeZeroDepInsurance?: boolean;
    includeExtendedWarranty?: boolean;
    includeAccessoriesKit?: boolean;
  }
): OnRoadPriceBreakdown {
  return calculateOnRoadPrice({
    exShowroomPriceINR: variant.exShowroomPriceINR,
    fuelType: variant.fuelType,
    stateId,
    cityId,
    engineCapacityCc: variant.engineCapacityCc,
    includeZeroDepInsurance: options?.includeZeroDepInsurance ?? true,
    includeExtendedWarranty: options?.includeExtendedWarranty ?? false,
    includeAccessoriesKit: options?.includeAccessoriesKit ?? false,
  });
}

// Compare on-road price across multiple states for the same vehicle
export function comparePriceAcrossStates(
  variant: CarVariant,
  stateIds: string[]
): { stateId: string; stateName: string; breakdown: OnRoadPriceBreakdown }[] {
  return stateIds.map((sid) => {
    const defaultCity = sid.toLowerCase() === 'ka' ? 'bengaluru' :
      sid.toLowerCase() === 'dl' ? 'new-delhi' :
      sid.toLowerCase() === 'mh' ? 'mumbai' :
      sid.toLowerCase() === 'up' ? 'lucknow' :
      sid.toLowerCase() === 'tn' ? 'chennai' : 'default';

    const breakdown = calculateVariantOnRoadPrice(variant, sid, defaultCity);
    return {
      stateId: sid,
      stateName: breakdown.stateName,
      breakdown,
    };
  });
}
