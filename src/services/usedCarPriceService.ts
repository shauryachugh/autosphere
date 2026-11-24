// src/services/usedCarPriceService.ts
// Algorithmic Used-Car Fair Price Intelligence Engine for AutoSphere

import { FuelType, TransmissionType } from '../types';
import {
  VehicleCondition,
  UsedCarPriceEstimate,
  PriceEstimateFactor,
  PriceAssessment,
  ConfidenceLevel,
} from '../types/buysell.types';
import { INDIAN_CAR_VARIANTS } from '../data/variantsData';

export interface ValuationInput {
  make: string;
  model: string;
  variant?: string;
  year: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  odometerKm: number;
  ownershipCount: number;
  condition: VehicleCondition;
  city: string;
  askingPriceINR?: number;
}

// Brand resale retention multipliers in the Indian secondary car market
const BRAND_RESALE_COEFFICIENTS: Record<string, number> = {
  'toyota': 1.12,
  'maruti suzuki': 1.08,
  'maruti': 1.08,
  'mahindra': 1.03,
  'hyundai': 1.02,
  'tata motors': 1.00,
  'tata': 1.00,
  'kia': 1.00,
  'honda': 0.98,
  'skoda': 0.92,
  'volkswagen': 0.92,
  'mg': 0.90,
  'mg motor': 0.90,
  'renault': 0.88,
  'nissan': 0.86,
  'bmw': 0.82,
  'mercedes-benz': 0.82,
  'audi': 0.80,
};

// Base ex-showroom defaults for popular models if not matched directly in database
const MODEL_BASELINE_EX_SHOWROOM_INR: Record<string, number> = {
  'swift': 780000,
  'baleno': 850000,
  'brezza': 1050000,
  'ertiga': 1100000,
  'dzire': 820000,
  'grand vitara': 1450000,
  'punch': 750000,
  'nexon': 1150000,
  'nexon.ev': 1650000,
  'harrier': 1950000,
  'safari': 2100000,
  'tiago': 620000,
  'creta': 1480000,
  'venue': 1020000,
  'i20': 890000,
  'verna': 1350000,
  'xuv700': 2050000,
  'scorpio-n': 1750000,
  'thar': 1550000,
  'xuv300': 1100000,
  'xuv 3xo': 1050000,
  'seltos': 1480000,
  'sonet': 1040000,
  'innova crysta': 2250000,
  'innova hycross': 2450000,
  'fortuner': 3650000,
  'hyryder': 1450000,
  'city': 1380000,
  'amaze': 850000,
  'elevate': 1350000,
  'slavia': 1380000,
  'kushaq': 1450000,
  'virtus': 1380000,
  'taigun': 1450000,
};

export class UsedCarPriceService {
  /**
   * Calculates a transparent, deterministic fair-price estimate for Indian used cars.
   */
  estimatePrice(input: ValuationInput): UsedCarPriceEstimate {
    const currentYear = 2026;
    const vehicleAge = Math.max(0, currentYear - input.year);
    const factors: PriceEstimateFactor[] = [];

    // 1. Determine Baseline Original Cost (New Car Benchmark)
    let baselineOriginalPrice = 1200000;
    const matchedVariant = INDIAN_CAR_VARIANTS.find(
      v => v.modelId.toLowerCase().includes(input.model.toLowerCase().replace(/\s+/g, '-')) ||
           input.model.toLowerCase().includes(v.modelId.toLowerCase())
    );

    if (matchedVariant) {
      baselineOriginalPrice = matchedVariant.exShowroomPriceINR;
    } else {
      const modelKey = input.model.toLowerCase().trim();
      for (const [key, price] of Object.entries(MODEL_BASELINE_EX_SHOWROOM_INR)) {
        if (modelKey.includes(key)) {
          baselineOriginalPrice = price;
          break;
        }
      }
    }

    // 2. Age-Based Depreciation Curve
    // Indian passenger car depreciation benchmark
    let ageDepreciationMultiplier = 1.0;
    if (vehicleAge === 0) ageDepreciationMultiplier = 0.90;
    else if (vehicleAge === 1) ageDepreciationMultiplier = 0.83;
    else if (vehicleAge === 2) ageDepreciationMultiplier = 0.74;
    else if (vehicleAge === 3) ageDepreciationMultiplier = 0.66;
    else if (vehicleAge === 4) ageDepreciationMultiplier = 0.59;
    else if (vehicleAge === 5) ageDepreciationMultiplier = 0.52;
    else if (vehicleAge === 6) ageDepreciationMultiplier = 0.46;
    else if (vehicleAge === 7) ageDepreciationMultiplier = 0.40;
    else if (vehicleAge === 8) ageDepreciationMultiplier = 0.35;
    else if (vehicleAge === 9) ageDepreciationMultiplier = 0.30;
    else ageDepreciationMultiplier = Math.max(0.18, 0.28 - (vehicleAge - 10) * 0.03);

    const ageDepreciationPct = Math.round((1 - ageDepreciationMultiplier) * 100);
    factors.push({
      factor: `Vehicle Age (${vehicleAge} Year${vehicleAge === 1 ? '' : 's'})`,
      impact: 'negative',
      percentage: -ageDepreciationPct,
      description: `Standard secondary market age depreciation benchmark for a ${vehicleAge}-year old passenger vehicle.`,
    });

    let currentPrice = baselineOriginalPrice * ageDepreciationMultiplier;

    // 3. Brand Resale Factor
    const makeKey = input.make.toLowerCase().trim();
    const brandMultiplier = BRAND_RESALE_COEFFICIENTS[makeKey] || 1.00;
    if (brandMultiplier !== 1.00) {
      const brandPct = Math.round((brandMultiplier - 1.00) * 100);
      factors.push({
        factor: `Brand Demand (${input.make})`,
        impact: brandMultiplier > 1 ? 'positive' : 'negative',
        percentage: brandPct,
        description: brandMultiplier > 1
          ? `High secondary market demand and widespread service network support higher price retention.`
          : `Higher depreciation typical of European or niche brands due to premium parts/maintenance costs.`,
      });
      currentPrice *= brandMultiplier;
    }

    // 4. Odometer Reading Impact (Baseline: 12,000 km / year)
    const expectedKm = Math.max(10000, vehicleAge * 12000);
    const kmDelta = input.odometerKm - expectedKm;
    let odoMultiplier = 1.0;

    if (kmDelta < -15000) {
      // Significantly lower mileage
      odoMultiplier = 1.06;
      factors.push({
        factor: `Low Odometer Reading (${input.odometerKm.toLocaleString('en-IN')} km)`,
        impact: 'positive',
        percentage: 6,
        description: `Vehicle driven significantly below national average (~${Math.round(input.odometerKm / Math.max(1, vehicleAge)).toLocaleString('en-IN')} km/yr vs 12,000 km/yr baseline).`,
      });
    } else if (kmDelta > 20000) {
      // High mileage
      const penalty = Math.min(0.18, Math.round((kmDelta / 10000) * 0.025 * 100) / 100);
      odoMultiplier = 1.0 - penalty;
      factors.push({
        factor: `High Odometer Reading (${input.odometerKm.toLocaleString('en-IN')} km)`,
        impact: 'negative',
        percentage: -Math.round(penalty * 100),
        description: `Higher mileage increases mechanical component wear and reduces market premium.`,
      });
    } else {
      factors.push({
        factor: `Typical Odometer Mileage (${input.odometerKm.toLocaleString('en-IN')} km)`,
        impact: 'neutral',
        percentage: 0,
        description: `Mileage is within standard commuter parameters for vehicle age.`,
      });
    }
    currentPrice *= odoMultiplier;

    // 5. Ownership Count Adjustment
    let ownershipMultiplier = 1.0;
    if (input.ownershipCount === 1) {
      factors.push({
        factor: 'First Owner (Single Hand)',
        impact: 'positive',
        percentage: 3,
        description: 'Single-owner vehicles command a premium in the Indian used car market.',
      });
      ownershipMultiplier = 1.03;
    } else if (input.ownershipCount === 2) {
      factors.push({
        factor: 'Second Owner',
        impact: 'negative',
        percentage: -6,
        description: 'Two registered owners slightly reduces secondary market valuation.',
      });
      ownershipMultiplier = 0.94;
    } else if (input.ownershipCount >= 3) {
      const penalty = input.ownershipCount === 3 ? -14 : -22;
      factors.push({
        factor: `${input.ownershipCount} Registered Owners`,
        impact: 'negative',
        percentage: penalty,
        description: 'Multiple previous registrations significantly impact buyer confidence and pricing.',
      });
      ownershipMultiplier = 1.0 + penalty / 100;
    }
    currentPrice *= ownershipMultiplier;

    // 6. Vehicle Physical Condition
    let conditionMultiplier = 1.0;
    if (input.condition === 'excellent') {
      conditionMultiplier = 1.05;
      factors.push({
        factor: 'Excellent Vehicle Condition',
        impact: 'positive',
        percentage: 5,
        description: 'Pristine exterior paint, mint upholstery, complete service logbook, and zero mechanical advisories.',
      });
    } else if (input.condition === 'very_good') {
      conditionMultiplier = 1.01;
      factors.push({
        factor: 'Very Good Condition',
        impact: 'positive',
        percentage: 1,
        description: 'Well-kept vehicle with only minor cosmetic wear consistent with age.',
      });
    } else if (input.condition === 'good') {
      conditionMultiplier = 0.96;
      factors.push({
        factor: 'Good Condition (Standard Wear)',
        impact: 'negative',
        percentage: -4,
        description: 'Minor bumper scratches or regular tyre wear requiring minor refurbishment.',
      });
    } else if (input.condition === 'fair') {
      conditionMultiplier = 0.88;
      factors.push({
        factor: 'Fair Condition (Refurbishment Needed)',
        impact: 'negative',
        percentage: -12,
        description: 'Requires suspension overhaul, tyre replacement, or paint detailing.',
      });
    }
    currentPrice *= conditionMultiplier;

    // 7. Fuel Type & Regional Location Delta
    const cityLower = (input.city || '').toLowerCase();
    if (input.fuelType === 'diesel' && (cityLower.includes('delhi') || cityLower.includes('ncr') || cityLower.includes('noida') || cityLower.includes('gurgaon'))) {
      currentPrice *= 0.86;
      factors.push({
        factor: 'Delhi-NCR 10-Year Diesel NGT Rule',
        impact: 'negative',
        percentage: -14,
        description: 'NGT regulatory ban restricting diesel vehicles older than 10 years reduces Delhi-NCR demand.',
      });
    } else if (input.fuelType === 'cng') {
      currentPrice *= 1.03;
      factors.push({
        factor: 'Factory CNG Demand',
        impact: 'positive',
        percentage: 3,
        description: 'Strong commuter demand for certified economical fuel powertrains.',
      });
    } else if (input.fuelType === 'electric') {
      if (vehicleAge >= 5) {
        currentPrice *= 0.90;
        factors.push({
          factor: 'EV Battery Aging (5+ Years)',
          impact: 'negative',
          percentage: -10,
          description: 'Market adjustment reflecting remaining high-voltage battery warranty threshold.',
        });
      }
    }

    // Round to nearest ₹5,000
    const estimatedPriceINR = Math.round(currentPrice / 5000) * 5000;
    const priceRangeMinINR = Math.round((estimatedPriceINR * 0.94) / 5000) * 5000;
    const priceRangeMaxINR = Math.round((estimatedPriceINR * 1.06) / 5000) * 5000;
    const recommendedAskingPriceINR = Math.round((estimatedPriceINR * 1.03) / 5000) * 5000;

    // Price Assessment against Asking Price
    const askingPrice = input.askingPriceINR || estimatedPriceINR;
    const differenceINR = askingPrice - estimatedPriceINR;
    const differencePercent = Math.round(((askingPrice - estimatedPriceINR) / estimatedPriceINR) * 100);

    let assessment: PriceAssessment = 'within_estimated_range';
    if (askingPrice < priceRangeMinINR) {
      assessment = 'below_estimated_range';
    } else if (askingPrice > priceRangeMaxINR) {
      assessment = 'above_estimated_range';
    }

    // Confidence Level
    let confidenceLevel: ConfidenceLevel = 'high';
    if (vehicleAge >= 8 || input.ownershipCount >= 3 || input.odometerKm > 140000) {
      confidenceLevel = 'medium';
    }
    if (vehicleAge >= 12 || input.odometerKm > 180000) {
      confidenceLevel = 'low';
    }

    const assumptions = [
      'Estimates are indicative ranges and do not constitute a verified legal appraisal or guaranteed sale quote.',
      'Assumes non-accidental chassis, clean body structural pillars, and flood-free vehicle history.',
      'Assumes valid RTO registration certificate (RC) without unpaid challans, bank hypothecation, or legal disputes.',
      'Reflects direct consumer-to-consumer transacted benchmarks; dealership trade-in prices are typically 8%–15% lower.',
    ];

    return {
      estimatedPriceINR,
      priceRangeMinINR,
      priceRangeMaxINR,
      recommendedAskingPriceINR,
      askingPriceINR: askingPrice,
      differenceINR,
      differencePercent,
      assessment,
      confidenceLevel,
      factors,
      assumptions,
      calculatedAt: new Date().toISOString(),
    };
  }
}

export const usedCarPriceService = new UsedCarPriceService();
