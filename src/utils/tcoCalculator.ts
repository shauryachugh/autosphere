import { FuelType } from '../types';
import {
  CurrentVehicleAnalysis,
  ReplacementRequirements,
  CurrentCarTCO,
  ReplacementCarSpec,
  ReplacementCarTCO,
  FinalVerdict,
  VerdictType,
} from '../types/replacement.types';

// Standard Indian Fuel & Electricity Tariffs (Current Benchmark Estimates in Metro Hubs)
export const FUEL_PRICES_INR = {
  petrol: 102.5, // INR / Litre
  diesel: 88.5,  // INR / Litre
  cng: 82.0,     // INR / kg
  electric: 8.5, // INR / kWh domestic AC wallbox tariff
};

// 1. Calculate Current Vehicle Total Cost of Ownership (TCO)
export function calculateCurrentCarTCO(analysis: CurrentVehicleAnalysis): CurrentCarTCO {
  const monthlyKm = Math.max(100, analysis.monthlyKmDriven || 1000);
  const monthlyFuel = Math.max(0, analysis.monthlyFuelExpenditure || 0);

  // Fuel expenditure per km
  const fuelExpenditurePerKm = monthlyKm > 0 ? Number((monthlyFuel / monthlyKm).toFixed(2)) : 0;
  const annualFuelExpenditure = monthlyFuel * 12;

  const annualMaintenance = Math.max(0, analysis.annualMaintenanceExpenses || 0);
  const annualRepairs = Math.max(0, analysis.annualRepairExpenses || 0);
  const annualInsurance = Math.max(0, analysis.annualInsuranceExpenses || 0);

  // Monthly operating cash flow
  const monthlyOwnershipExpenditure = Math.round(
    monthlyFuel + (annualMaintenance + annualRepairs + annualInsurance) / 12
  );
  const annualOwnershipExpenditure = monthlyOwnershipExpenditure * 12;

  // Estimated annual depreciation on current market value
  // Vehicles older than 3 years typically depreciate 10% - 12% annually on written-down value in India
  const currentResale = Math.max(0, analysis.currentEstimatedResaleValue || 0);
  const annualDepreciation = Math.round(currentResale * 0.11);

  // Estimated future maintenance increments as vehicle ages / odometer climbs
  // Year 1-3: maintenance rises by ~8% compounded
  // Year 4-5: maintenance rises by ~12% compounded (suspension, clutch, brake discs, battery)
  const baseAnnualMaintRepair = annualMaintenance + annualRepairs;
  const estimatedFutureMaintenance3Yr = Math.round(
    baseAnnualMaintRepair * (1 + 1.08 + 1.16)
  );
  const estimatedFutureMaintenance5Yr = Math.round(
    baseAnnualMaintRepair * (1 + 1.08 + 1.16 + 1.28 + 1.40)
  );

  // Projected resale value at 3 and 5 years
  const threeYearResaleValue = Math.round(currentResale * Math.pow(1 - 0.11, 3));
  const fiveYearResaleValue = Math.round(currentResale * Math.pow(1 - 0.11, 5));

  // 3-Year & 5-Year Total Cost of Ownership
  // Operating costs + Net vehicle depreciation
  const threeYearOperating = (annualFuelExpenditure + annualInsurance) * 3 + estimatedFutureMaintenance3Yr;
  const fiveYearOperating = (annualFuelExpenditure + annualInsurance) * 5 + estimatedFutureMaintenance5Yr;

  const threeYearDepreciation = currentResale - threeYearResaleValue;
  const fiveYearDepreciation = currentResale - fiveYearResaleValue;

  const threeYearTotalOwnershipCost = Math.round(threeYearOperating + threeYearDepreciation);
  const fiveYearTotalOwnershipCost = Math.round(fiveYearOperating + fiveYearDepreciation);

  // Net TCO considering remaining asset value
  const threeYearNetTCO = threeYearTotalOwnershipCost;
  const fiveYearNetTCO = fiveYearTotalOwnershipCost;

  return {
    monthlyOwnershipExpenditure,
    annualOwnershipExpenditure,
    fuelExpenditurePerKm,
    annualFuelExpenditure,
    annualMaintenance,
    annualRepairs,
    annualInsurance,
    annualDepreciation,
    estimatedFutureMaintenance3Yr,
    estimatedFutureMaintenance5Yr,
    threeYearTotalOwnershipCost,
    fiveYearTotalOwnershipCost,
    threeYearResaleValue,
    fiveYearResaleValue,
    threeYearNetTCO,
    fiveYearNetTCO,
  };
}

// 2. State-Specific Indian On-Road Price Calculator
export function calculateStateOnRoadPrice(
  exShowroomPrice: number,
  fuelType: FuelType,
  state: string
): { roadTax: number; insurance: number; registrationAndTcs: number; totalOnRoadPrice: number } {
  const normState = (state || 'karnataka').toLowerCase();

  let roadTaxPercent = 0.13; // default national average ~13%

  if (fuelType === 'electric') {
    // Electric Vehicles enjoy road tax subsidies or waivers in key states
    if (normState.includes('karnataka') || normState.includes('ka')) roadTaxPercent = 0.00; // KA EV exemption
    else if (normState.includes('delhi') || normState.includes('dl')) roadTaxPercent = 0.00; // DL EV exemption
    else if (normState.includes('maharashtra') || normState.includes('mh')) roadTaxPercent = 0.04;
    else if (normState.includes('tamil') || normState.includes('tn')) roadTaxPercent = 0.00;
    else roadTaxPercent = 0.04;
  } else if (fuelType === 'hybrid') {
    // Strong Hybrids have lower or standard road tax brackets
    if (normState.includes('karnataka') || normState.includes('ka')) roadTaxPercent = 0.14;
    else if (normState.includes('uttar') || normState.includes('up')) roadTaxPercent = 0.00; // UP hybrid waiver
    else roadTaxPercent = 0.11;
  } else if (fuelType === 'diesel') {
    // Diesel attracts higher RTO road tax
    if (normState.includes('karnataka') || normState.includes('ka')) roadTaxPercent = exShowroomPrice > 2000000 ? 0.18 : 0.15;
    else if (normState.includes('delhi') || normState.includes('dl')) roadTaxPercent = 0.125;
    else if (normState.includes('maharashtra') || normState.includes('mh')) roadTaxPercent = 0.14;
    else roadTaxPercent = 0.14;
  } else if (fuelType === 'cng') {
    roadTaxPercent = 0.09;
  } else {
    // Petrol
    if (normState.includes('karnataka') || normState.includes('ka')) roadTaxPercent = exShowroomPrice > 2000000 ? 0.17 : 0.14;
    else if (normState.includes('delhi') || normState.includes('dl')) roadTaxPercent = 0.10;
    else if (normState.includes('maharashtra') || normState.includes('mh')) roadTaxPercent = 0.12;
    else roadTaxPercent = 0.12;
  }

  const roadTax = Math.round(exShowroomPrice * roadTaxPercent);

  // 1-Year Comprehensive + 3-Year Mandatory Third Party Insurance
  const insurance = Math.round(exShowroomPrice * 0.035 + 8500);

  // TCS (1% if ex-showroom > ₹10 Lakhs) + FASTag + Smart card RTO registration + HSRP plate
  const tcs = exShowroomPrice > 1000000 ? Math.round(exShowroomPrice * 0.01) : 0;
  const registrationAndTcs = tcs + 5500;

  const totalOnRoadPrice = exShowroomPrice + roadTax + insurance + registrationAndTcs;

  return {
    roadTax,
    insurance,
    registrationAndTcs,
    totalOnRoadPrice,
  };
}

// 3. Standard Auto Loan EMI Calculator
export function calculateLoanEMI(
  principal: number,
  annualRatePercent: number,
  tenureYears: number
): { monthlyEMI: number; totalInterest: number; totalPayment: number } {
  if (principal <= 0) {
    return { monthlyEMI: 0, totalInterest: 0, totalPayment: 0 };
  }

  const totalMonths = Math.max(12, tenureYears * 12);

  if (annualRatePercent <= 0) {
    const monthlyEMI = Math.round(principal / totalMonths);
    return { monthlyEMI, totalInterest: 0, totalPayment: principal };
  }

  const monthlyRate = annualRatePercent / 12 / 100;

  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const monthlyEMI = Math.round((principal * monthlyRate * factor) / (factor - 1));
  const totalPayment = monthlyEMI * totalMonths;
  const totalInterest = Math.round(totalPayment - principal);

  return {
    monthlyEMI,
    totalInterest,
    totalPayment,
  };
}

// 4. Calculate Replacement Car TCO
export function calculateReplacementCarTCO(
  car: ReplacementCarSpec,
  criteria: ReplacementRequirements,
  currentCarResaleValue: number
): ReplacementCarTCO {
  const { totalOnRoadPrice } = calculateStateOnRoadPrice(
    car.exShowroomPriceINR,
    car.fuelType,
    criteria.state
  );

  // Compute effective down payment
  let effectiveDownPayment = criteria.downPaymentINR || Math.round(totalOnRoadPrice * 0.2);
  if (criteria.applyResaleAsDownPayment && currentCarResaleValue > 0) {
    effectiveDownPayment += currentCarResaleValue;
  }
  // Cap down payment at on-road price
  effectiveDownPayment = Math.min(totalOnRoadPrice, effectiveDownPayment);

  const loanAmount = Math.max(0, totalOnRoadPrice - effectiveDownPayment);
  const { monthlyEMI, totalInterest: totalLoanInterest } = calculateLoanEMI(
    loanAmount,
    criteria.loanInterestRatePercent || 9.0,
    criteria.loanTenureYears || 5
  );

  // Calculate Fuel / Energy Cost
  const monthlyKm = criteria.monthlyDrivingDistanceKm || 1200;
  let monthlyFuelCost = 0;

  if (car.fuelType === 'electric') {
    // Electric: ~130 - 150 Wh/km real consumption. Average Indian home charging costs ~₹1.35 / km
    // Efficiency: mileageOrRange is total range (e.g. 450 km on 45 kWh battery -> 10 km/kWh)
    const kmPerKwh = car.mileageOrRange > 0 ? (car.mileageOrRange / 45) : 7.5;
    monthlyFuelCost = Math.round((monthlyKm / Math.max(1, kmPerKwh)) * FUEL_PRICES_INR.electric);
  } else if (car.fuelType === 'cng') {
    monthlyFuelCost = Math.round((monthlyKm / Math.max(1, car.mileageOrRange)) * FUEL_PRICES_INR.cng);
  } else if (car.fuelType === 'diesel') {
    monthlyFuelCost = Math.round((monthlyKm / Math.max(1, car.mileageOrRange)) * FUEL_PRICES_INR.diesel);
  } else {
    // Petrol or Strong Hybrid
    monthlyFuelCost = Math.round((monthlyKm / Math.max(1, car.mileageOrRange)) * FUEL_PRICES_INR.petrol);
  }

  const annualFuelCost = monthlyFuelCost * 12;
  const annualMaintenanceCost = car.annualMaintenanceEstimateINR;
  const annualInsuranceCost = car.annualInsuranceEstimateINR;

  // Monthly Out of pocket expenditure (EMI + Fuel + Maint + Ins)
  const monthlyOwnershipExpenditureINR = Math.round(
    monthlyEMI + monthlyFuelCost + (annualMaintenanceCost + annualInsuranceCost) / 12
  );

  // Resale Values
  const expectedResaleValue3YrINR = Math.round(
    car.exShowroomPriceINR * (car.resalePercentage3Yr / 100)
  );
  const expectedResaleValue5YrINR = Math.round(
    car.exShowroomPriceINR * (car.resalePercentage5Yr / 100)
  );

  // Depreciation
  const annualDepreciationCostINR = Math.round((totalOnRoadPrice - expectedResaleValue5YrINR) / 5);

  // Three-Year and Five-Year Total Ownership Cost (Net TCO)
  // Net TCO = Total Financing Interest + Net Depreciation (OnRoad - Resale) + Fuel + Maintenance + Insurance
  // This avoids double-counting the loan principal with purchase price!
  const fiveYearLoanInterest = criteria.loanTenureYears <= 5 ? totalLoanInterest : Math.round(totalLoanInterest * (5 / criteria.loanTenureYears));
  const threeYearLoanInterest = Math.round(totalLoanInterest * (3 / criteria.loanTenureYears));

  const fiveYearDepreciation = totalOnRoadPrice - expectedResaleValue5YrINR;
  const threeYearDepreciation = totalOnRoadPrice - expectedResaleValue3YrINR;

  const fiveYearOperating = annualFuelCost * 5 + annualMaintenanceCost * 5 + annualInsuranceCost * 5;
  const threeYearOperating = annualFuelCost * 3 + annualMaintenanceCost * 3 + annualInsuranceCost * 3;

  const fiveYearTotalOwnershipCostINR = Math.round(fiveYearDepreciation + fiveYearLoanInterest + fiveYearOperating);
  const threeYearTotalOwnershipCostINR = Math.round(threeYearDepreciation + threeYearLoanInterest + threeYearOperating);

  const fiveYearNetTCOINR = fiveYearTotalOwnershipCostINR;
  const threeYearNetTCOINR = threeYearTotalOwnershipCostINR;

  return {
    car,
    purchasePriceINR: car.exShowroomPriceINR,
    estimatedOnRoadPriceINR: totalOnRoadPrice,
    downPaymentINR: effectiveDownPayment,
    loanAmountINR: loanAmount,
    monthlyEmiINR: monthlyEMI,
    totalLoanInterestINR: totalLoanInterest,
    monthlyFuelCostINR: monthlyFuelCost,
    annualFuelCostINR: annualFuelCost,
    annualMaintenanceCostINR: annualMaintenanceCost,
    annualInsuranceCostINR: annualInsuranceCost,
    annualDepreciationCostINR,
    expectedResaleValue3YrINR,
    expectedResaleValue5YrINR,
    threeYearTotalOwnershipCostINR,
    fiveYearTotalOwnershipCostINR,
    threeYearNetTCOINR,
    fiveYearNetTCOINR,
    monthlyOwnershipExpenditureINR,
    matchScore: 0,
    scoreBreakdown: {
      budgetScore: 0,
      affordabilityScore: 0,
      tcoScore: 0,
      efficiencyScore: 0,
      resaleScore: 0,
      preferenceScore: 0,
    },
    whySelectedReasons: [],
  };
}

// 5. Smart Ranking Algorithm (Weighted Multi-Factor System)
export function rankReplacementCars(
  candidates: ReplacementCarSpec[],
  criteria: ReplacementRequirements,
  currentTCO: CurrentCarTCO,
  currentCarResaleValue: number
): ReplacementCarTCO[] {
  // Enforce user-selected filters strictly — never silently fall back to 'all'
  const filteredCandidates = candidates.filter((car) => {
    if (criteria.preferredFuelType && criteria.preferredFuelType !== 'all' && car.fuelType !== criteria.preferredFuelType) {
      return false;
    }
    if (criteria.vehicleCategory && criteria.vehicleCategory !== 'all' && car.bodyType !== criteria.vehicleCategory) {
      return false;
    }
    if (criteria.transmissionPreference && criteria.transmissionPreference !== 'all' && car.transmission !== criteria.transmissionPreference) {
      return false;
    }
    return true;
  });

  const evaluatedCars = filteredCandidates.map((car) => {
    const tco = calculateReplacementCarTCO(car, criteria, currentCarResaleValue);

    // --- FACTOR 1: Budget Compatibility (Weight: 25%) ---
    // Target: On-road price <= maxPurchaseBudgetINR
    let budgetScore = 100;
    const maxBudget = criteria.maxPurchaseBudgetINR || 2500000;
    if (tco.estimatedOnRoadPriceINR > maxBudget) {
      const overRatio = (tco.estimatedOnRoadPriceINR - maxBudget) / maxBudget;
      budgetScore = Math.max(10, Math.round(100 - overRatio * 200));
    } else {
      const underRatio = (maxBudget - tco.estimatedOnRoadPriceINR) / maxBudget;
      // Sweet spot is 65% - 95% of budget
      budgetScore = underRatio > 0.4 ? 85 : 100;
    }

    // --- FACTOR 2: Monthly Affordability (Weight: 25%) ---
    // Target: monthlyOwnershipExpenditureINR <= preferredMonthlyEmiINR + monthlyFuelAllowance
    let affordabilityScore = 100;
    const preferredMonthly = criteria.preferredMonthlyEmiINR || 25000;
    if (tco.monthlyOwnershipExpenditureINR > preferredMonthly * 1.35) {
      const overRatio = (tco.monthlyOwnershipExpenditureINR - preferredMonthly * 1.35) / preferredMonthly;
      affordabilityScore = Math.max(15, Math.round(100 - overRatio * 150));
    } else {
      affordabilityScore = 95;
    }

    // --- FACTOR 3: 5-Year Total Cost of Ownership Benefit (Weight: 20%) ---
    // Compares replacement 5-Yr Net TCO against keeping current car
    let tcoScore = 50;
    const current5Yr = currentTCO.fiveYearTotalOwnershipCost;
    const diff = current5Yr - tco.fiveYearTotalOwnershipCostINR; // Positive = replacement is cheaper
    if (diff > 200000) {
      tcoScore = 100;
    } else if (diff > 0) {
      tcoScore = 80 + Math.round((diff / 200000) * 20);
    } else if (diff > -250000) {
      tcoScore = 70; // Marginally more expensive due to new purchase
    } else if (diff > -600000) {
      tcoScore = 50;
    } else {
      tcoScore = Math.max(20, Math.round(50 - (Math.abs(diff) / 1000000) * 30));
    }

    // --- FACTOR 4: Fuel Efficiency & Energy Economics (Weight: 10%) ---
    let efficiencyScore = 60;
    if (car.fuelType === 'electric') {
      efficiencyScore = 100; // ~₹1.3 / km
    } else if (car.fuelType === 'hybrid') {
      efficiencyScore = 92; // 24-28 km/l
    } else if (car.fuelType === 'cng') {
      efficiencyScore = 88; // 26 km/kg
    } else if (car.fuelType === 'diesel') {
      efficiencyScore = 75; // 17-20 km/l
    } else {
      efficiencyScore = 65; // Petrol 15-18 km/l
    }

    // --- FACTOR 5: Resale Retention (Weight: 10%) ---
    const resaleScore = Math.min(100, Math.max(40, Math.round(car.resalePercentage3Yr * 1.35)));

    // --- FACTOR 6: User Category & Driving Profile Preference Match (Weight: 10%) ---
    let preferenceScore = 80;
    if (criteria.preferredFuelType !== 'all' && car.fuelType === criteria.preferredFuelType) {
      preferenceScore += 10;
    }
    if (criteria.transmissionPreference !== 'all' && car.transmission === criteria.transmissionPreference) {
      preferenceScore += 5;
    }
    if (criteria.vehicleCategory !== 'all' && car.bodyType === criteria.vehicleCategory) {
      preferenceScore += 5;
    }
    preferenceScore = Math.min(100, preferenceScore);

    // Weighted Total Score
    const matchScore = Math.round(
      budgetScore * 0.25 +
      affordabilityScore * 0.25 +
      tcoScore * 0.20 +
      efficiencyScore * 0.10 +
      resaleScore * 0.10 +
      preferenceScore * 0.10
    );

    // Why selected bullet points
    const whySelectedReasons: string[] = [];
    if (tco.estimatedOnRoadPriceINR <= criteria.maxPurchaseBudgetINR) {
      whySelectedReasons.push(`Fits within your ₹${(criteria.maxPurchaseBudgetINR / 100000).toFixed(1)}L maximum budget (On-road: ₹${(tco.estimatedOnRoadPriceINR / 100000).toFixed(1)}L)`);
    }
    if (car.fuelType === 'electric' || car.fuelType === 'hybrid') {
      const annualFuelSavings = Math.round(currentTCO.annualFuelExpenditure - tco.annualFuelCostINR);
      if (annualFuelSavings > 0) {
        whySelectedReasons.push(`Saves ~₹${annualFuelSavings.toLocaleString('en-IN')} annually in fuel/energy compared to your current vehicle`);
      }
    }
    if (car.safetyRating.includes('5 Star')) {
      whySelectedReasons.push(`High 5-Star verified crash test protection for Indian highways`);
    }
    if (car.resalePercentage3Yr >= 70) {
      whySelectedReasons.push(`High resale value retention in Indian used car market (${car.resalePercentage3Yr}% after 3 yrs)`);
    }
    if (whySelectedReasons.length < 3) {
      whySelectedReasons.push(car.whyRecommended);
    }

    tco.matchScore = Math.min(99, Math.max(25, matchScore));
    tco.scoreBreakdown = {
      budgetScore,
      affordabilityScore,
      tcoScore,
      efficiencyScore,
      resaleScore,
      preferenceScore,
    };
    tco.whySelectedReasons = whySelectedReasons.slice(0, 4);

    return tco;
  });

  // Sort descending by match score
  return evaluatedCars.sort((a, b) => b.matchScore - a.matchScore);
}

// 6. Generate Objective, Rigorous Final Verdict strictly from currently selected cars
export function generateFinalVerdict(
  currentTCO: CurrentCarTCO,
  selectedCars: ReplacementCarTCO[],
  criteria: ReplacementRequirements,
  currentAnalysis: CurrentVehicleAnalysis
): FinalVerdict {
  if (!selectedCars || selectedCars.length === 0) {
    return {
      outcome: 'KEEP_CURRENT',
      headline: 'SELECT VEHICLES TO COMPARE',
      summary: 'Select vehicles to generate your comparison.',
      financialJustification: 'No replacement vehicles are currently selected for comparison.',
      fiveYearNetDifferenceINR: 0,
      bestReplacementCar: undefined,
      keyInsights: ['Select at least one replacement vehicle in Step 3 to evaluate 5-year TCO'],
      actionSteps: ['Return to Ranked Recommendations and select vehicles to compare'],
    };
  }

  // Pick the best car strictly among the user's currently selected vehicles
  const sortedSelection = [...selectedCars].sort((a, b) => b.matchScore - a.matchScore);
  const bestCar = sortedSelection[0];
  const otherSelectedNames = sortedSelection
    .slice(1)
    .map((c) => `${c.car.make} ${c.car.model}`)
    .join(' and ');
  const comparisonContext = otherSelectedNames
    ? ` Among your selected vehicles (${sortedSelection.map((c) => `${c.car.make} ${c.car.model}`).join(', ')}), ${bestCar.car.make} ${bestCar.car.model} achieved the strongest overall score (${bestCar.matchScore}/100) with a 5-year net TCO of ₹${bestCar.fiveYearTotalOwnershipCostINR.toLocaleString('en-IN')}.`
    : ` Evaluated for your selected ${bestCar.car.make} ${bestCar.car.model} (${bestCar.car.variant}).`;
  const fiveYearCurrentNet = currentTCO.fiveYearTotalOwnershipCost;
  const fiveYearBestNet = bestCar.fiveYearTotalOwnershipCostINR;

  // netDifference = Replacement 5Yr TCO - Current 5Yr TCO
  // If positive: replacement is MORE expensive overall.
  // If negative: replacement actually SAVES money overall over 5 years.
  const fiveYearNetDifferenceINR = Math.round(fiveYearBestNet - fiveYearCurrentNet);

  // Verdict Logic:
  // Must account for the replacement purchase price, financing interest and steep initial depreciation.
  // Never recommend replacement simply because the new car has cheaper fuel or maintenance!
  let outcome: VerdictType = 'KEEP_CURRENT';
  let headline = '';
  let summary = '';
  let financialJustification = '';
  const keyInsights: string[] = [];
  const actionSteps: string[] = [];

  const isCurrentCarOldOrHighMileage = currentAnalysis.currentOdometer > 110000 || (2026 - currentAnalysis.manufacturingYear) >= 8;
  const isHeavyAnnualMileage = (criteria.monthlyDrivingDistanceKm || 1200) >= 1800;

  if (fiveYearNetDifferenceINR < -100000) {
    // REPLACEMENT SAVES SUBSTANTIAL MONEY (e.g. high monthly km user switching from thirsty diesel/petrol to EV/CNG)
    outcome = 'REPLACEMENT_FINANCIALLY_BENEFICIAL';
    headline = 'REPLACEMENT MAY BE FINANCIALLY BENEFICIAL';
    summary = `Upgrading to the ${bestCar.car.make} ${bestCar.car.model} will save you approximately ₹${Math.abs(fiveYearNetDifferenceINR).toLocaleString('en-IN')} over the next 5 years.${comparisonContext}`;
    financialJustification = `Your high commute of ${criteria.monthlyDrivingDistanceKm.toLocaleString('en-IN')} km/month causes steep ongoing fuel (₹${currentTCO.annualFuelExpenditure.toLocaleString('en-IN')}/yr) and escalating repair expenses. The replacement's ultra-low running cost (₹${bestCar.annualFuelCostINR.toLocaleString('en-IN')}/yr) outweighs its loan interest and depreciation.`;

    keyInsights.push(`Net 5-year ownership savings: ₹${Math.abs(fiveYearNetDifferenceINR).toLocaleString('en-IN')} in your pocket`);
    keyInsights.push(`Fuel expenditure drops from ₹${(currentTCO.annualFuelExpenditure / 12).toLocaleString('en-IN')}/mo to ~₹${bestCar.monthlyFuelCostINR.toLocaleString('en-IN')}/mo`);
    keyInsights.push(`Avoids upcoming major periodic repairs on ${currentAnalysis.make} ${currentAnalysis.model}`);

    actionSteps.push(`Sell your ${currentAnalysis.make} ${currentAnalysis.model} privately to realize its ₹${(currentAnalysis.currentEstimatedResaleValue / 100000).toFixed(1)}L fair value`);
    actionSteps.push(`Apply the resale proceeds as down payment to minimize loan interest`);
    actionSteps.push(`Schedule an authorized test drive of ${bestCar.car.make} ${bestCar.car.model}`);

  } else if (fiveYearNetDifferenceINR <= 180000 && (isCurrentCarOldOrHighMileage || isHeavyAnnualMileage)) {
    // MARGINAL FINANCIAL VARIANCE & CURRENT CAR HAS AGE / RELIABILITY RISK
    outcome = 'CONSIDER_UPGRADING';
    headline = 'CONSIDER UPGRADING';
    summary = `The 5-year cost difference between keeping your car and upgrading to the ${bestCar.car.make} ${bestCar.car.model} is relatively narrow (~₹${Math.abs(fiveYearNetDifferenceINR).toLocaleString('en-IN')}).${comparisonContext}`;
    financialJustification = `While purchasing the ${bestCar.car.make} ${bestCar.car.model} costs an estimated ₹${fiveYearNetDifferenceINR.toLocaleString('en-IN')} more across 5 years, this small premium gives you a brand-new vehicle with 5-star crash safety, full factory warranty, modern ADAS, and zero mechanical breakdown anxiety.`;

    keyInsights.push(`Five-year cost difference is modest (~₹${Math.round(fiveYearNetDifferenceINR / 60).toLocaleString('en-IN')}/month)`);
    keyInsights.push(`Substantially lower mechanical breakdown risk and zero PUC worries`);
    keyInsights.push(`Significant upgrade in structural crash safety and comfort`);

    actionSteps.push(`Inspect your current car's suspension and transmission before deciding`);
    actionSteps.push(`If ongoing repairs exceed ₹40,000 this year, proceed with upgrade`);
    actionSteps.push(`Compare loan offers to secure under 9.0% auto finance`);

  } else {
    // KEEPING CURRENT CAR IS BY FAR THE SMARTEST FINANCIAL DECISION
    outcome = 'KEEP_CURRENT';
    headline = 'KEEP YOUR CURRENT CAR';
    summary = `Financially, keeping your ${currentAnalysis.make} ${currentAnalysis.model} is much smarter than buying a replacement, saving you ₹${fiveYearNetDifferenceINR.toLocaleString('en-IN')} over 5 years.${comparisonContext}`;
    financialJustification = `Although the ${bestCar.car.make} ${bestCar.car.model} offers lower fuel expenses, buying it requires ₹${(bestCar.estimatedOnRoadPriceINR / 100000).toFixed(1)}L upfront, ₹${(bestCar.totalLoanInterestINR / 100000).toFixed(1)}L in loan financing interest, and steep new car depreciation (₹${(bestCar.annualDepreciationCostINR * 5 / 100000).toFixed(1)}L over 5 yrs). The fuel savings do not justify the new car capital outlay.`;

    keyInsights.push(`Retaining your car saves you ₹${fiveYearNetDifferenceINR.toLocaleString('en-IN')} across 5 years`);
    keyInsights.push(`Your vehicle has already absorbed its steepest early depreciation curve`);
    keyInsights.push(`Zero monthly EMI commitments leave your monthly cash flow free`);

    actionSteps.push(`Invest ₹15,000 - ₹25,000 in preventive maintenance (fluids, filters, brake pads)`);
    actionSteps.push(`Renew insurance early with Zero-Depreciation if still eligible`);
    actionSteps.push(`Re-evaluate replacement in 24 months or after 30,000 additional kilometres`);
  }

  return {
    outcome,
    headline,
    summary,
    financialJustification,
    fiveYearNetDifferenceINR,
    bestReplacementCar: bestCar,
    keyInsights,
    actionSteps,
  };
}
