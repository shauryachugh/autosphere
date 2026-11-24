import { FuelType, TransmissionType, BodyType } from './index';

// 1. Digital Vehicle Passport Data Structures
export interface VehiclePassportData {
  id: string;
  userId: string;
  // Vehicle Identity
  make: string;
  model: string;
  variant: string;
  manufacturingYear: number;
  registrationYear: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  regNumber: string;
  registrationState: string;
  registrationCity: string;
  rtoCode?: string; // e.g. 'KA-01', 'DL-04', 'MH-02'
  purchaseDate?: string;
  purchasePriceINR?: number;
  currentOdometer: number;

  // Additional Extended Information
  chassisNumber?: string; // VIN (17 characters)
  engineNumber?: string;
  previousOwnersCount: number; // 1 = First Owner, 2 = Second Owner, etc.
  color: string; // e.g. 'Napoli Black', 'Daytona Grey', 'Pearl White'
  photos: string[];
  notes?: string;

  // Compliance & Connected Car Details
  insurancePolicyNumber?: string;
  insuranceProvider?: string;
  insuranceExpiryDate?: string;
  pucCertificateNumber?: string;
  pucExpiryDate?: string;
  healthScore: number;
  connectedCarPlatform?: string;
  lastServiceDate?: string;
  lastServiceKm?: number;
  nextServiceDueDate?: string;
  nextServiceDueKm?: number;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 2. Vehicle Health Subsystem Types
export type HealthSubsystem = 
  | 'engine'
  | 'battery'
  | 'tyres'
  | 'brakes'
  | 'transmission'
  | 'ac'
  | 'other';

export type HealthStatus = 
  | 'up_to_date'
  | 'due_soon'
  | 'overdue'
  | 'info_missing';

export interface MaintenanceScheduleItem {
  id: string;
  userId?: string;
  vehicleId: string;
  subsystem: HealthSubsystem;
  itemName: string; // e.g. 'Engine Oil & Filter', 'Battery Health & Terminals', 'Tyre Rotation & Balancing'
  lastServiceDate?: string;
  lastServiceKm?: number;
  intervalMonths: number; // Recommended calendar interval (e.g. 12 months)
  intervalKm: number; // Recommended odometer interval (e.g. 10,000 km)
  recommendedNextDate?: string;
  recommendedNextKm?: number;
  status: HealthStatus;
  actualExpenseINR?: number;
  serviceProvider?: string; // e.g. 'Tata Authorized Service (KHT Motors)', 'Bosch Car Service'
  technicianNotes?: string;
  isCustom: boolean;
  updatedAt?: string;
}

// 3. Digital Document Vault Types
export type DocumentCategory = 
  | 'rc'
  | 'insurance'
  | 'puc'
  | 'purchase_invoice'
  | 'service_invoice'
  | 'warranty'
  | 'other';

export type DocumentComplianceStatus = 
  | 'valid'
  | 'expiring_soon'
  | 'expired'
  | 'under_review';

export interface DigitalDocument {
  id: string;
  userId: string;
  vehicleId: string;
  title: string;
  category: DocumentCategory;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  fileUrl?: string;
  storagePath?: string; // Supabase Storage private path (e.g. `vehicle-documents/{userId}/{vehicleId}/doc.pdf`)
  fileSizeBytes: number;
  mimeType: string;
  status: DocumentComplianceStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// 4. Chronological Maintenance Timeline Event
export type TimelineActivityCategory = 
  | 'service'
  | 'repair'
  | 'part_replacement'
  | 'insurance'
  | 'puc'
  | 'fuel'
  | 'expense';

export interface MaintenanceTimelineEvent {
  id: string;
  vehicleId: string;
  date: string;
  odometerKm?: number;
  category: TimelineActivityCategory;
  title: string;
  description: string;
  amountINR?: number;
  serviceProvider?: string;
  invoiceId?: string;
  receiptUrl?: string;
  isComplianceRelated?: boolean;
}

// 5. Smart In-App Reminders
export type ReminderType = 
  | 'insurance'
  | 'puc'
  | 'service'
  | 'oil'
  | 'battery'
  | 'tyres'
  | 'brakes'
  | 'custom';

export type ReminderPriority = 'high' | 'medium' | 'low';

export interface VehicleReminder {
  id: string;
  userId: string;
  vehicleId: string;
  reminderType: ReminderType;
  title: string;
  description?: string;
  dueDate: string;
  dueKm?: number;
  priority: ReminderPriority;
  isCompleted: boolean;
  completedAt?: string;
  isDismissed: boolean;
  createdAt: string;
}

// 6. Overall Health Dashboard Summary
export interface HealthDashboardSummary {
  vehicleId: string;
  overallScore: number;
  upToDateCount: number;
  dueSoonCount: number;
  overdueCount: number;
  infoMissingCount: number;
  totalMaintenanceSpendINR: number;
  lastServiceInfo?: {
    date: string;
    km: number;
    provider: string;
    amountINR: number;
  };
  upcomingServiceInfo?: {
    dueDate: string;
    dueKm: number;
    daysRemaining: number;
    kmRemaining: number;
  };
  insuranceStatus: {
    policyNumber?: string;
    provider?: string;
    expiryDate?: string;
    daysRemaining?: number;
    status: DocumentComplianceStatus;
  };
  pucStatus: {
    certificateNumber?: string;
    expiryDate?: string;
    daysRemaining?: number;
    status: DocumentComplianceStatus;
  };
  documentCompletenessPercent: number; // e.g. 85%
}
