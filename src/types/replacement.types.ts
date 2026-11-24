import { FuelType, TransmissionType, BodyType } from './index';

export interface CurrentVehicleAnalysis {
  vehicleId?: string;
  make: string;
  model: string;
  variant: string;
  manufacturingYear: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  currentOdometer: number;
  monthlyKmDriven: number;
  monthlyFuelExpenditure: number;
  annualMaintenanceExpenses: number;
  annualRepairExpenses: number;
  annualInsuranceExpenses: number;
  currentEstimatedResaleValue: number;
  city: string;
  state: string;
}

export interface ReplacementRequirements {
  maxPurchaseBudgetINR: number;
  preferredMonthlyEmiINR: number;
  downPaymentINR: number;
  applyResaleAsDownPayment: boolean;
  loanTenureYears: number; // e.g. 3, 4, 5, 7
  loanInterestRatePercent: number; // e.g. 9.0%
  preferredFuelType: FuelType | 'all';
  transmissionPreference: TransmissionType | 'all';
  vehicleCategory: BodyType | 'all';
  monthlyDrivingDistanceKm: number;
  state: string;
  city: string;
  cityDrivingPercent: number; // 0 - 100
  highwayDrivingPercent: number; // 0 - 100
}

export interface CurrentCarTCO {
  monthlyOwnershipExpenditure: number;
  annualOwnershipExpenditure: number;
  fuelExpenditurePerKm: number;
  annualFuelExpenditure: number;
  annualMaintenance: number;
  annualRepairs: number;
  annualInsurance: number;
  annualDepreciation: number;
  estimatedFutureMaintenance3Yr: number;
  estimatedFutureMaintenance5Yr: number;
  threeYearTotalOwnershipCost: number;
  fiveYearTotalOwnershipCost: number;
  threeYearResaleValue: number;
  fiveYearResaleValue: number;
  threeYearNetTCO: number;
  fiveYearNetTCO: number;
}

export interface ReplacementCarSpec {
  id: string;
  make: string;
  model: string;
  variant: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  exShowroomPriceINR: number;
  estimatedOnRoadPriceINR: number;
  mileageOrRange: number;
  mileageUnit: 'km/l' | 'km/charge' | 'km/kg';
  powerBhp: number;
  torqueNm: number;
  safetyRating: string;
  annualMaintenanceEstimateINR: number;
  annualInsuranceEstimateINR: number;
  resalePercentage3Yr: number;
  resalePercentage5Yr: number;
  imageUrl: string;
  highlights: string[];
  whyRecommended: string;
  pros: string[];
  cons: string[];
}

export interface ReplacementCarTCO {
  car: ReplacementCarSpec;
  purchasePriceINR: number;
  estimatedOnRoadPriceINR: number;
  downPaymentINR: number;
  loanAmountINR: number;
  monthlyEmiINR: number;
  totalLoanInterestINR: number;
  monthlyFuelCostINR: number;
  annualFuelCostINR: number;
  annualMaintenanceCostINR: number;
  annualInsuranceCostINR: number;
  annualDepreciationCostINR: number;
  expectedResaleValue3YrINR: number;
  expectedResaleValue5YrINR: number;
  threeYearTotalOwnershipCostINR: number;
  fiveYearTotalOwnershipCostINR: number;
  threeYearNetTCOINR: number;
  fiveYearNetTCOINR: number;
  monthlyOwnershipExpenditureINR: number;
  matchScore: number; // 0 - 100
  scoreBreakdown: {
    budgetScore: number;
    affordabilityScore: number;
    tcoScore: number;
    efficiencyScore: number;
    resaleScore: number;
    preferenceScore: number;
  };
  whySelectedReasons: string[];
}

export type VerdictType = 'KEEP_CURRENT' | 'CONSIDER_UPGRADING' | 'REPLACEMENT_FINANCIALLY_BENEFICIAL';

export interface FinalVerdict {
  outcome: VerdictType;
  headline: string;
  summary: string;
  financialJustification: string;
  fiveYearNetDifferenceINR: number; // Positive = replacement costs more; Negative = replacement saves money
  bestReplacementCar?: ReplacementCarTCO;
  keyInsights: string[];
  actionSteps: string[];
}

export interface SavedRecommendationAnalysis {
  id: string;
  userId: string;
  vehicleId?: string | null;
  title: string;
  currentVehicleData: CurrentVehicleAnalysis;
  replacementCriteria: ReplacementRequirements;
  currentCarTCO: CurrentCarTCO;
  recommendedCars: ReplacementCarTCO[];
  comparedCarIds: string[];
  verdict: VerdictType;
  verdictDetails: FinalVerdict;
  fiveYearNetDifference: number;
  isSaved: boolean;
  createdAt: string;
}
