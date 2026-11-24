import { 
  Vehicle, 
  Expense, 
  DiagnosticIssue, 
  ReplacementCar, 
  MarketplaceCar, 
  Accessory, 
  DocumentItem, 
  NotificationItem,
  UserProfile,
  ChatMessage
} from '../types';

// All user data starts empty and is loaded strictly from authenticated Supabase tables or user input
export const initialVehicles: Vehicle[] = [];

export const initialExpenses: Expense[] = [];

export const initialDiagnostics: DiagnosticIssue[] = [];

export const replacementCars: ReplacementCar[] = [];

export const marketplaceCars: MarketplaceCar[] = [];

export const accessories: Accessory[] = [];

export const initialDocuments: DocumentItem[] = [];

export const initialNotifications: NotificationItem[] = [];

export const initialUserProfile: UserProfile = {
  name: '',
  email: '',
  phone: '',
  city: 'Bengaluru',
  state: 'Karnataka',
  fastagWalletBalance: 0,
  defaultFuelType: 'petrol',
  drivingMonthlyAverageKm: 1000,
  connectedCarSyncEnabled: false,
  alerts: {
    serviceReminders: true,
    pucExpiry: true,
    insuranceRenewal: true,
    fastagLowBalance: true,
    speedAlerts: false,
  },
};

export const sampleChatMessages: ChatMessage[] = [];
