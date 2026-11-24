export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng';
export type TransmissionType = 'manual' | 'automatic' | 'dct' | 'cvt' | 'amt' | 'single-speed';
export type BodyType = 'suv' | 'sedan' | 'hatchback' | 'mpv' | 'crossover';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  manufacturingYear?: number;
  registrationYear?: number;
  regNumber: string;
  vin: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  engineCc?: number;
  batteryCapacityKwh?: number;
  powerBhp: number;
  torqueNm: number;
  odoKm: number;
  purchasePriceINR?: number;
  purchaseDate?: string;
  currentFuelPercent: number; // or SoC % for EV
  batteryHealthPercent?: number; // for EV
  estimatedRangeKm: number;
  avgEfficiency: string; // e.g., "14.2 km/l" or "138 Wh/km"
  insurancePolicyNumber: string;
  insuranceExpiryDate: string;
  insuranceProvider: string;
  pucExpiryDate: string;
  lastServiceDate: string;
  lastServiceKm: number;
  nextServiceDueDate: string;
  nextServiceDueKm: number;
  healthScore: number; // 0 - 100
  image: string;
  isPrimary: boolean;
  city: string;
  state: string;
  fastagBalanceINR: number;
  connectedCarPlatform?: 'AdrenoX' | 'Tata iRA' | 'Hyundai Bluelink' | 'Suzuki Connect' | 'Kia Connect';
  connectedStatus: 'online' | 'standby' | 'disconnected';
  tyrePressurePsi: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
    spare: number;
  };
}

export type ExpenseCategory = 
  | 'fuel'
  | 'charging'
  | 'service'
  | 'toll'
  | 'insurance'
  | 'wash'
  | 'accessories'
  | 'parking'
  | 'challan';

export interface Expense {
  id: string;
  vehicleId: string;
  category: ExpenseCategory;
  amountINR: number;
  date: string;
  odoKm: number;
  vendor: string;
  notes: string;
  paymentMethod: 'UPI' | 'Credit Card' | 'FASTag' | 'Net Banking' | 'Cash';
  receiptAttached?: boolean;
  fuelLitresOrUnits?: number;
}

export interface DiagnosticIssue {
  id: string;
  code: string; // e.g. P0420
  title: string;
  subsystem: 'engine' | 'battery' | 'transmission' | 'brakes' | 'tpms' | 'electrical' | 'emissions';
  severity: 'critical' | 'warning' | 'info';
  detectedDate: string;
  description: string;
  laymanExplanation: string;
  suggestedAction: string;
  estimatedRepairCostINR: number;
  isResolved: boolean;
}

export interface ReplacementCar {
  id: string;
  make: string;
  model: string;
  variant: string;
  priceExShowroomINR: number;
  onRoadPriceBangaloreINR: number;
  fuelType: FuelType;
  bodyType: BodyType;
  transmission: TransmissionType;
  araiEfficiency: string;
  monthlyRunningCostINR: number;
  annualCostSavingsINR: number;
  upgradeScore: number; // e.g. 92/100
  powerBhp: number;
  torqueNm: number;
  safetyRating: string; // e.g., "5 Star Bharat NCAP"
  image: string;
  highlights: string[];
  whyRecommended: string;
  pros: string[];
  cons: string[];
  keyCompetitors: string[];
}

export interface MarketplaceCar {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  regState: string;
  city: string;
  regNumberMasked: string; // e.g. KA 03 ** 8920
  fuelType: FuelType;
  transmission: TransmissionType;
  odoKm: number;
  ownersCount: number;
  fairMarketPriceINR: number;
  originalPriceINR: number;
  inspectionScore: number; // out of 100
  warrantyMonths: number;
  certified: boolean;
  serviceHistoryVerified: boolean;
  accidentalHistory: 'clean' | 'minor' | 'flood_free';
  insuranceType: 'Comprehensive' | 'Zero Dep' | 'Third Party';
  image: string;
  features: string[];
  sellerType: 'AutoSphere Certified' | 'Direct Owner';
  postedDaysAgo: number;
}

export interface Accessory {
  id: string;
  name: string;
  brand: string;
  category: 'smart_tech' | 'ev_charging' | 'comfort' | 'maintenance' | 'protection' | 'styling';
  priceINR: number;
  originalPriceINR: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  highlights: string[];
  compatibility: 'Universal' | 'Mahindra' | 'Tata' | 'Hyundai' | 'Toyota' | 'All EVs';
  inStock: boolean;
  fastDelivery: boolean;
}

export interface DocumentItem {
  id: string;
  vehicleId: string;
  title: string;
  type: 'RC' | 'Insurance' | 'PUC' | 'Driving License' | 'Warranty Booklet' | 'Service Invoice';
  docNumber: string;
  expiryDate?: string;
  issueDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  fileSize: string;
  lastVerified: string;
}

export interface ServiceBooking {
  id: string;
  vehicleId: string;
  centerName: string;
  serviceType: 'Periodic Maintenance' | 'Brake Pad Replacement' | 'Diagnostics & OBD Check' | 'Full Detailing' | 'Battery Health Check';
  preferredDate: string;
  preferredTimeSlot: string;
  estimatedCostINR: number;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  contactPerson: string;
  pickupDropRequired: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'service' | 'fastag' | 'document' | 'recommendation';
  severity: 'high' | 'medium' | 'info';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
  structuredData?: {
    type: 'cost_estimate' | 'comparison' | 'dtc_diagnostics' | 'rto_guide';
    title: string;
    items: { label: string; value: string }[];
    actionButton?: { label: string; link: string };
  };
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  fastagWalletBalance: number;
  defaultFuelType: FuelType;
  drivingMonthlyAverageKm: number;
  connectedCarSyncEnabled: boolean;
  alerts: {
    serviceReminders: boolean;
    pucExpiry: boolean;
    insuranceRenewal: boolean;
    fastagLowBalance: boolean;
    speedAlerts: boolean;
  };
}
