// src/types/buysell.types.ts
// Domain Types for AutoSphere Phase 7: Buy/Sell Intelligence & Accessories Hub

import { FuelType, TransmissionType } from './index';

export type VehicleCondition = 'excellent' | 'very_good' | 'good' | 'fair';
export type ListingStatus = 'draft' | 'active' | 'paused' | 'sold';
export type PriceAssessment = 'below_estimated_range' | 'within_estimated_range' | 'above_estimated_range';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type EnquiryStatus = 'pending' | 'responded' | 'resolved' | 'closed';

export interface PriceEstimateFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  percentage: number;
  description: string;
}

export interface UsedCarPriceEstimate {
  estimatedPriceINR: number;
  priceRangeMinINR: number;
  priceRangeMaxINR: number;
  recommendedAskingPriceINR: number;
  askingPriceINR: number;
  differenceINR: number;
  differencePercent: number;
  assessment: PriceAssessment;
  confidenceLevel: ConfidenceLevel;
  factors: PriceEstimateFactor[];
  assumptions: string[];
  calculatedAt: string;
}

export interface UsedCarListing {
  id: string;
  userId: string;
  title: string;
  make: string;
  model: string;
  variant: string;
  manufacturingYear: number;
  registrationYear?: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  odometerKm: number;
  city: string;
  state: string;
  rtoCode?: string;
  regNumberMasked?: string;
  ownershipCount: number;
  vehicleCondition: VehicleCondition;
  askingPriceINR: number;
  suggestedPriceINR?: number;
  priceEstimate?: UsedCarPriceEstimate;
  description: string;
  features: string[];
  photos: string[];
  status: ListingStatus;
  isVerified: boolean;
  serviceHistoryAvailable: boolean;
  insuranceValidity?: string;
  pucValidity?: string;
  sellerName?: string;
  sellerType?: 'AutoSphere Verified Direct' | 'Certified Individual Owner';
  createdAt: string;
  updatedAt: string;
}

export interface UsedCarEnquiry {
  id: string;
  listingId: string;
  listingTitle?: string;
  listingImage?: string;
  askingPriceINR?: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  message: string;
  offeredPriceINR?: number;
  status: EnquiryStatus;
  sellerResponse?: string;
  respondedAt?: string;
  createdAt: string;
}

export type AccessoryCategory =
  | 'interior'
  | 'exterior'
  | 'cleaning_detailing'
  | 'electronics_infotainment'
  | 'safety_utility'
  | 'ev_accessories'
  | 'maintenance_essentials';

export interface AccessoryItem {
  id: string;
  name: string;
  brand: string;
  category: AccessoryCategory;
  shortDescription: string;
  indicativePriceINR: number;
  image: string;
  photos?: string[];
  compatibilityType: 'universal' | 'specific';
  compatibleMakes?: string[];
  compatibleModels?: string[];
  compatibleVariants?: string[];
  specifications: Record<string, string>;
  installationDifficulty: 'easy_diy' | 'moderate' | 'professional_required';
  isSampleCatalogData: boolean;
  isSaved?: boolean;
}

export interface ListingFilterCriteria {
  searchQuery?: string;
  make?: string;
  fuelType?: string;
  transmission?: string;
  city?: string;
  minPriceINR?: number;
  maxPriceINR?: number;
  minYear?: number;
  maxOdometerKm?: number;
  condition?: string;
  verifiedOnly?: boolean;
}

export interface AccessoryFilterCriteria {
  searchQuery?: string;
  category?: string;
  maxPriceINR?: number;
  vehicleModel?: string;
  vehicleMake?: string;
  onlyCompatibleWithGarage?: boolean;
}
