import { FuelType, TransmissionType, BodyType } from './index';

// 1. Manufacturer Interface
export interface Manufacturer {
  id: string; // e.g. 'mfr-tata', 'mfr-maruti'
  name: string; // 'Tata Motors'
  slug: string; // 'tata-motors'
  country: string; // 'India'
  yearEstablishedIndia: number;
  headquartersIndia: string;
  logoUrl?: string;
  websiteUrl?: string;
  supportPhone?: string;
  marketSharePercent?: number;
  description?: string;
  isActive: boolean;
}

// 2. Car Model Interface
export type MarketStatus = 'active' | 'discontinued' | 'upcoming';

export interface CarModel {
  id: string; // e.g. 'model-tata-nexon'
  manufacturerId: string;
  name: string; // 'Nexon'
  slug: string; // 'nexon'
  category: BodyType;
  launchYear: number;
  marketStatus: MarketStatus;
  availableFuelTypes: FuelType[];
  availableTransmissions: TransmissionType[];
  imageUrl: string;
  description: string;
  safetyRating?: string; // e.g. '5 Star Bharat NCAP'
  isActive: boolean;
}

// 3. Car Variant Interface
export interface CarVariant {
  id: string; // e.g. 'var-tata-nexon-fearless-plus-dt'
  modelId: string;
  name: string; // 'Fearless Plus S Dual Tone'
  fuelType: FuelType;
  transmission: TransmissionType;
  engineCapacityCc?: number;
  batteryCapacityKwh?: number;
  powerBhp: number;
  torqueNm: number;
  mileageOrRange: number;
  mileageUnit: 'km/l' | 'km/charge' | 'km/kg';
  seatingCapacity: number;
  exShowroomPriceINR: number;
  annualMaintenanceEstimateINR: number;
  annualInsuranceEstimateINR: number;
  groundClearanceMm?: number;
  bootCapacityLitres?: number;
  fuelTankCapacityLitres?: number;
  highlights?: string[];
  isActive: boolean;
}

// Enriched Variant with Parent Model & Manufacturer
export interface EnrichedCarVariant extends CarVariant {
  model: CarModel;
  manufacturer: Manufacturer;
}

// 4. India Location Interfaces
export type StateType = 'state' | 'union_territory';

export interface IndianState {
  id: string; // e.g. 'KA', 'DL', 'MH'
  name: string; // 'Karnataka'
  type: StateType;
  capital: string;
  rtoCodePrefix: string; // 'KA'
  gstStateCode?: string; // '29'
  isActive: boolean;
}

export interface IndianCity {
  id: string; // e.g. 'bengaluru', 'mumbai', 'new-delhi'
  name: string; // 'Bengaluru'
  stateId: string; // 'KA'
  stateName?: string;
  tier: 1 | 2 | 3;
  rtoCodes: string[]; // ['KA-01', 'KA-02', 'KA-03', 'KA-04', 'KA-05', 'KA-50', 'KA-51', 'KA-53']
  isMetro: boolean;
  municipalParkingTaxINR: number;
  localCessPercent: number;
  isActive: boolean;
}

// 5. Configurable State RTO Tax Rules
export interface StateRtoRule {
  id: string;
  stateId: string;
  fuelType: FuelType | 'all';
  priceMinINR: number;
  priceMaxINR: number;
  taxPercent: number; // e.g. 14.0 for 14%
  fixedCessINR: number;
  greenCessINR: number;
  specialNotes?: string;
  effectiveYear: number;
}

// 6. Fuel & EV Charging Tariffs
export interface FuelPricing {
  stateId: string;
  stateName: string;
  cityId?: string;
  cityName?: string;
  petrolPricePerLitreINR: number;
  dieselPricePerLitreINR: number;
  cngPricePerKgINR: number;
  updatedAt: string;
}

export interface EvChargingTariff {
  stateId: string;
  stateName: string;
  discomName: string; // e.g. 'BESCOM', 'MSEDCL', 'TPDDL'
  domesticAcRatePerKwhINR: number; // e.g. 7.50
  publicDcFastRatePerKwhINR: number; // e.g. 21.00
  commercialFleetRatePerKwhINR: number; // e.g. 14.50
  updatedAt: string;
}

// 7. On-Road Price Breakdown
export interface OnRoadPriceBreakdown {
  exShowroomPriceINR: number;
  stateId: string;
  stateName: string;
  cityId: string;
  cityName: string;
  fuelType: FuelType;
  // Itemized Taxes & Fees
  rtoRoadTaxPercent: number;
  rtoRoadTaxINR: number;
  rtoRegistrationFeeINR: number;
  smartCardAndPlateFeeINR: number;
  municipalParkingTaxINR: number;
  stateGreenCessINR: number;
  tcsINR: number; // 1% if ex-showroom > 10L
  fastagFeeINR: number;
  // Insurance
  insuranceBasicODINR: number; // 1-year own damage
  insuranceMandatoryTPINR: number; // 3-year mandatory third party
  insuranceZeroDepAddonINR: number;
  totalInsuranceINR: number;
  // Optional Package Add-ons
  extendedWarrantyINR: number;
  essentialAccessoriesKitINR: number;
  // Aggregates
  mandatoryOnRoadPriceINR: number; // ExShowroom + RTO + Reg/Plate + Mandatory Insurance + FASTag + TCS
  totalOnRoadPriceINR: number; // Mandatory + Optional selected
  taxSavingsVsNationalAverageINR: number; // e.g. EV waiver benefit
}

export interface OnRoadPriceCalculationInput {
  exShowroomPriceINR: number;
  fuelType: FuelType;
  stateId: string;
  cityId: string;
  engineCapacityCc?: number;
  includeZeroDepInsurance?: boolean;
  includeExtendedWarranty?: boolean;
  includeAccessoriesKit?: boolean;
}
