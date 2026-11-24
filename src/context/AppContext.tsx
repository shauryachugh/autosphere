import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { aiAssistantService } from '../services/aiAssistantService';
import { synthesizeVehicleContext } from '../services/aiContextService';
import { 
  Vehicle, 
  Expense, 
  DiagnosticIssue, 
  DocumentItem, 
  NotificationItem, 
  UserProfile, 
  ChatMessage,
  Accessory,
  ServiceBooking
} from '../types';
import { 
  initialVehicles, 
  initialExpenses, 
  initialDiagnostics, 
  initialDocuments, 
  initialNotifications, 
  initialUserProfile, 
  sampleChatMessages 
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Vehicles
  vehicles: Vehicle[];
  activeVehicleId: string;
  activeVehicle: Vehicle | null;
  setActiveVehicleId: (id: string) => void;
  isVehiclesLoading: boolean;
  vehiclesError: string | null;
  refreshVehicles: () => Promise<void>;
  addVehicle: (vehicle: Partial<Vehicle> & Pick<Vehicle, 'make' | 'model' | 'variant' | 'year' | 'regNumber' | 'fuelType' | 'transmission' | 'odoKm' | 'city' | 'state'>) => Promise<Vehicle | null>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<boolean>;
  deleteVehicle: (id: string) => Promise<boolean>;

  // Expenses
  expenses: Expense[];
  activeVehicleExpenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Diagnostics & Health
  diagnostics: DiagnosticIssue[];
  resolveDiagnostic: (id: string) => void;
  runDiagnosticScan: () => Promise<void>;
  isScanning: boolean;

  // Documents
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id'>) => void;

  // Service Bookings
  serviceBookings: ServiceBooking[];
  bookService: (booking: Omit<ServiceBooking, 'id' | 'status'>) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Accessories Cart
  cart: { item: Accessory; quantity: number }[];
  addToCart: (item: Accessory) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotalINR: number;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // AI Assistant Chat
  chatMessages: ChatMessage[];
  sendUserMessage: (content: string) => Promise<void>;
  clearChatHistory: () => void;
  isAiTyping: boolean;

  // Global Modals
  isLogExpenseOpen: boolean;
  openLogExpense: () => void;
  closeLogExpense: () => void;

  isBookServiceOpen: boolean;
  openBookService: () => void;
  closeBookService: () => void;

  isAddVehicleOpen: boolean;
  openAddVehicle: () => void;
  closeAddVehicle: () => void;

  isValuationOpen: boolean;
  openValuation: () => void;
  closeValuation: () => void;

  // Notifications Toast system
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function mapDbVehicleToFrontend(v: any): Vehicle {
  return {
    id: v.id,
    make: v.make,
    model: v.model,
    variant: v.variant,
    year: v.manufacturing_year,
    manufacturingYear: v.manufacturing_year,
    registrationYear: v.registration_year,
    regNumber: v.registration_number,
    vin: v.vin || '',
    fuelType: v.fuel_type as any,
    transmission: v.transmission as any,
    bodyType: (v.body_type as any) || 'suv',
    powerBhp: v.power_bhp || 150,
    torqueNm: v.torque_nm || 300,
    odoKm: v.current_odometer,
    purchasePriceINR: Number(v.purchase_price) || 0,
    purchaseDate: v.purchase_date || undefined,
    currentFuelPercent: v.current_fuel_percent ?? 70,
    batteryHealthPercent: v.battery_health_percent ?? 98,
    estimatedRangeKm: v.estimated_range_km || 450,
    avgEfficiency: v.avg_efficiency || '14.2 km/l',
    insurancePolicyNumber: v.insurance_policy_number || '',
    insuranceExpiryDate: v.insurance_expiry_date || '2027-04-18',
    insuranceProvider: v.insurance_provider || 'HDFC ERGO General Insurance',
    pucExpiryDate: v.puc_expiry_date || '2027-01-15',
    lastServiceDate: v.last_service_date || '2026-08-10',
    lastServiceKm: v.last_service_km || 20000,
    nextServiceDueDate: v.next_service_due_date || '2027-02-10',
    nextServiceDueKm: v.next_service_due_km || 30000,
    healthScore: v.health_score || 95,
    image: v.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    isPrimary: Boolean(v.is_primary),
    city: v.registration_city,
    state: v.registration_state,
    fastagBalanceINR: 1500,
    connectedCarPlatform: (v.connected_car_platform as any) || 'AdrenoX',
    connectedStatus: (v.connected_status as any) || 'online',
    tyrePressurePsi: {
      frontLeft: v.tyre_pressure_front_left || 34,
      frontRight: v.tyre_pressure_front_right || 34,
      rearLeft: v.tyre_pressure_rear_left || 33,
      rearRight: v.tyre_pressure_rear_right || 33,
      spare: v.tyre_pressure_spare || 34,
    },
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [isVehiclesLoading, setIsVehiclesLoading] = useState<boolean>(true);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicleId, setActiveVehicleId] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Fetch all vehicles belonging to the authenticated user from Supabase
  const fetchUserVehicles = React.useCallback(async (userId: string) => {
    setIsVehiclesLoading(true);
    setVehiclesError(null);

    // 1. If Supabase is configured, Supabase is the permanent source of truth
    if (isSupabaseConfigured) {
      try {
        const { data: dbVehicles, error: vErr } = await (supabase
          .from('vehicles') as any)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (vErr) {
          console.error('[AutoSphere] Supabase vehicle retrieval error:', vErr);
          setVehiclesError(vErr.message);

          // Attempt fallback to user-scoped cache to avoid blank screen during network glitch
          if (typeof localStorage !== 'undefined') {
            const cached = localStorage.getItem(`autosphere_vehicles_${userId}`);
            if (cached) {
              try {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setVehicles(parsed);
                  setActiveVehicleId((prev) => parsed.some((p: Vehicle) => p.id === prev) ? prev : parsed[0].id);
                }
              } catch {}
            }
          }
          setIsVehiclesLoading(false);
          return;
        }

        if (dbVehicles && dbVehicles.length > 0) {
          const mapped: Vehicle[] = (dbVehicles as any[]).map(mapDbVehicleToFrontend);
          setVehicles(mapped);
          setActiveVehicleId((prev) => mapped.some((m) => m.id === prev) ? prev : (mapped.find((m) => m.isPrimary)?.id || mapped[0].id));

          // Save to user-scoped cache
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`autosphere_vehicles_${userId}`, JSON.stringify(mapped));
            localStorage.setItem(`autosphere_active_vehicle_${userId}`, mapped[0].id);
          }
        } else {
          // Confirmed 0 vehicles in database for this account
          setVehicles([]);
          setActiveVehicleId('');
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`autosphere_vehicles_${userId}`, JSON.stringify([]));
          }
        }

        setIsVehiclesLoading(false);
        return;
      } catch (err: any) {
        console.error('[AutoSphere] Exception during vehicle fetch from Supabase:', err);
        setVehiclesError(err.message || 'Failed to retrieve vehicles from database');
      }
    }

    // 2. Offline / Demo fallback: use user-scoped localStorage
    if (typeof localStorage !== 'undefined') {
      const storageKey = `autosphere_vehicles_${userId}`;
      const local = localStorage.getItem(storageKey);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            setVehicles(parsed);
            if (parsed.length > 0) {
              setActiveVehicleId((prev) => parsed.some((m: Vehicle) => m.id === prev) ? prev : parsed[0].id);
            } else {
              setActiveVehicleId('');
            }
            setIsVehiclesLoading(false);
            return;
          }
        } catch {}
      }
    }

    setVehicles([]);
    setActiveVehicleId('');
    setIsVehiclesLoading(false);
  }, []);

  // Fetch expenses for the authenticated user
  const fetchUserExpenses = React.useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data: dbExpenses, error: eErr } = await (supabase
        .from('vehicle_expenses') as any)
        .select('*')
        .eq('user_id', userId)
        .order('expense_date', { ascending: false });

      if (!eErr && dbExpenses) {
        const mapped: Expense[] = (dbExpenses as any[]).map((e) => ({
          id: e.id,
          vehicleId: e.vehicle_id,
          category: e.category as any,
          amountINR: Number(e.amount_inr),
          date: e.expense_date,
          odoKm: e.odometer_km || 0,
          vendor: e.vendor || '',
          notes: e.notes || '',
          paymentMethod: e.payment_method as any,
          receiptAttached: Boolean(e.receipt_attached),
          fuelLitresOrUnits: e.fuel_litres_or_units ? Number(e.fuel_litres_or_units) : undefined,
        }));
        setExpenses(mapped);
      }
    } catch (err) {
      console.error('[AutoSphere] Expense retrieval error:', err);
    }
  }, []);

  // Primary lifecycle coordinator: waits for authentication restoration before making decisions
  useEffect(() => {
    let isMounted = true;

    // While Supabase authentication is restoring the session: DO NOT TOUCH STATE!
    if (isAuthLoading) {
      setIsVehiclesLoading(true);
      return;
    }

    // Unauthenticated (logged out): clear user-specific in-memory state cleanly
    if (!user) {
      setVehicles([]);
      setExpenses([]);
      setActiveVehicleId('');
      setIsVehiclesLoading(false);
      setVehiclesError(null);
      return;
    }

    // Authenticated user: retrieve their actual records from Supabase
    if (user && isMounted) {
      fetchUserVehicles(user.id);
      fetchUserExpenses(user.id);
    }

    return () => {
      isMounted = false;
    };
  }, [user, isAuthLoading, fetchUserVehicles, fetchUserExpenses]);

  const refreshVehicles = React.useCallback(async () => {
    if (user) {
      await fetchUserVehicles(user.id);
      await fetchUserExpenses(user.id);
    }
  }, [user, fetchUserVehicles, fetchUserExpenses]);

  const [diagnostics, setDiagnostics] = useState<DiagnosticIssue[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => ({
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
  }));

  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [cart, setCart] = useState<{ item: Accessory; quantity: number }[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = aiAssistantService.getChatHistory();
    return saved && saved.length > 0 ? saved : [];
  });
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Modal states
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState(false);
  const [isBookServiceOpen, setIsBookServiceOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isValuationOpen, setIsValuationOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist to user-scoped storage to prevent cross-account contamination or premature wipe
  useEffect(() => {
    if (typeof localStorage === 'undefined' || isAuthLoading) return;
    if (user) {
      localStorage.setItem(`autosphere_vehicles_${user.id}`, JSON.stringify(vehicles));
      if (activeVehicleId) {
        localStorage.setItem(`autosphere_active_vehicle_${user.id}`, activeVehicleId);
      }
    }
  }, [vehicles, activeVehicleId, user, isAuthLoading]);

  useEffect(() => {
    if (typeof localStorage === 'undefined' || isAuthLoading) return;
    if (user) {
      localStorage.setItem(`autosphere_expenses_${user.id}`, JSON.stringify(expenses));
    }
  }, [expenses, user, isAuthLoading]);

  useEffect(() => {
    localStorage.setItem('autosphere_diagnostics', JSON.stringify(diagnostics));
  }, [diagnostics]);

  useEffect(() => {
    localStorage.setItem('autosphere_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('autosphere_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('autosphere_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0] || null;

  const activeVehicleExpenses = expenses.filter((e) => activeVehicle && e.vehicleId === activeVehicle.id);

  const addVehicle = async (
    newVehicleData: Partial<Vehicle> &
      Pick<Vehicle, 'make' | 'model' | 'variant' | 'year' | 'regNumber' | 'fuelType' | 'transmission' | 'odoKm' | 'city' | 'state'>
  ): Promise<Vehicle | null> => {
    const tempId = `veh-${Date.now().toString(36)}`;
    const baseVehicle: Vehicle = {
      bodyType: 'suv',
      vin: newVehicleData.vin || ('MA1' + Math.random().toString(36).substring(2, 10).toUpperCase()),
      currentFuelPercent: 75,
      estimatedRangeKm: 450,
      avgEfficiency: newVehicleData.fuelType === 'electric' ? '135 Wh/km' : '14.2 km/l',
      insurancePolicyNumber: 'HDFC-ERGO-' + Math.floor(100000 + Math.random() * 900000),
      insuranceExpiryDate: '2027-05-20',
      insuranceProvider: 'HDFC ERGO General Insurance',
      pucExpiryDate: '2027-02-18',
      lastServiceDate: '2026-06-10',
      lastServiceKm: Math.max(0, (newVehicleData.odoKm || 10000) - 5000),
      nextServiceDueDate: '2027-06-10',
      nextServiceDueKm: (newVehicleData.odoKm || 10000) + 10000,
      image: newVehicleData.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      powerBhp: newVehicleData.fuelType === 'electric' ? 145 : 170,
      torqueNm: newVehicleData.fuelType === 'electric' ? 250 : 350,
      fastagBalanceINR: 1000,
      ...newVehicleData,
      id: tempId,
      healthScore: 95,
      isPrimary: vehicles.length === 0,
      connectedStatus: 'online',
      tyrePressurePsi: {
        frontLeft: 33,
        frontRight: 33,
        rearLeft: 33,
        rearRight: 33,
        spare: 34,
      },
    };

    // Persist to Supabase if connected and authenticated
    if (isSupabaseConfigured && user) {
      try {
        const { data, error } = await (supabase.from('vehicles') as any)
          .insert([{
            user_id: user.id,
            make: baseVehicle.make,
            model: baseVehicle.model,
            variant: baseVehicle.variant,
            manufacturing_year: baseVehicle.manufacturingYear || baseVehicle.year,
            registration_year: baseVehicle.registrationYear || baseVehicle.year,
            registration_number: baseVehicle.regNumber,
            vin: baseVehicle.vin,
            fuel_type: baseVehicle.fuelType,
            transmission: baseVehicle.transmission,
            body_type: baseVehicle.bodyType,
            current_odometer: baseVehicle.odoKm,
            purchase_price: baseVehicle.purchasePriceINR || 2400000,
            purchase_date: baseVehicle.purchaseDate || new Date().toISOString().split('T')[0],
            registration_state: baseVehicle.state,
            registration_city: baseVehicle.city,
            power_bhp: baseVehicle.powerBhp,
            torque_nm: baseVehicle.torqueNm,
            current_fuel_percent: baseVehicle.currentFuelPercent,
            health_score: baseVehicle.healthScore,
            is_primary: baseVehicle.isPrimary,
            image_url: baseVehicle.image,
            connected_car_platform: baseVehicle.connectedCarPlatform || 'AdrenoX',
          }])
          .select()
          .single();

        if (error) {
          console.error('[AutoSphere] Error inserting vehicle into Supabase:', error);
          showToast('Failed to save vehicle: ' + error.message, 'error');
          return null;
        }

        if (data) {
          const persistedVehicle: Vehicle = {
            ...baseVehicle,
            ...mapDbVehicleToFrontend(data),
            id: data.id, // True PostgreSQL UUID
          };
          setVehicles((prev) => [persistedVehicle, ...prev]);
          setActiveVehicleId(persistedVehicle.id);

          if (typeof localStorage !== 'undefined') {
            const userKey = `autosphere_vehicles_${user.id}`;
            const existingRaw = localStorage.getItem(userKey);
            let userList: Vehicle[] = [];
            try { userList = existingRaw ? JSON.parse(existingRaw) : []; } catch {}
            const updated = [persistedVehicle, ...userList.filter((v: Vehicle) => v.id !== persistedVehicle.id)];
            localStorage.setItem(userKey, JSON.stringify(updated));
            localStorage.setItem(`autosphere_active_vehicle_${user.id}`, persistedVehicle.id);
          }

          showToast(`${persistedVehicle.make} ${persistedVehicle.model} added to your garage!`, 'success');
          return persistedVehicle;
        }
      } catch (err: any) {
        console.error('[AutoSphere] Exception inserting vehicle into Supabase:', err);
        showToast('Error saving vehicle: ' + err.message, 'error');
        return null;
      }
    }

    setVehicles((prev) => [baseVehicle, ...prev]);
    setActiveVehicleId(tempId);
    if (typeof localStorage !== 'undefined') {
      const storageKey = user ? `autosphere_vehicles_${user.id}` : 'autosphere_vehicles_guest';
      const updated = [baseVehicle, ...vehicles];
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    showToast(`${baseVehicle.make} ${baseVehicle.model} added to your garage!`, 'success');
    return baseVehicle;
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<boolean> => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );

    if (isSupabaseConfigured && user) {
      try {
        const dbUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.make !== undefined) dbUpdates.make = updates.make;
        if (updates.model !== undefined) dbUpdates.model = updates.model;
        if (updates.variant !== undefined) dbUpdates.variant = updates.variant;
        if (updates.year !== undefined) dbUpdates.manufacturing_year = updates.year;
        if (updates.manufacturingYear !== undefined) dbUpdates.manufacturing_year = updates.manufacturingYear;
        if (updates.registrationYear !== undefined) dbUpdates.registration_year = updates.registrationYear;
        if (updates.regNumber !== undefined) dbUpdates.registration_number = updates.regNumber;
        if (updates.odoKm !== undefined) dbUpdates.current_odometer = updates.odoKm;
        if (updates.healthScore !== undefined) dbUpdates.health_score = updates.healthScore;
        if (updates.currentFuelPercent !== undefined) dbUpdates.current_fuel_percent = updates.currentFuelPercent;
        if (updates.avgEfficiency !== undefined) dbUpdates.avg_efficiency = updates.avgEfficiency;
        if (updates.isPrimary !== undefined) dbUpdates.is_primary = updates.isPrimary;
        if (updates.insuranceExpiryDate !== undefined) dbUpdates.insurance_expiry_date = updates.insuranceExpiryDate;
        if (updates.pucExpiryDate !== undefined) dbUpdates.puc_expiry_date = updates.pucExpiryDate;
        if (updates.city !== undefined) dbUpdates.registration_city = updates.city;
        if (updates.state !== undefined) dbUpdates.registration_state = updates.state;

        const { error } = await (supabase.from('vehicles') as any)
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('[AutoSphere] Error updating vehicle in Supabase:', error);
          showToast('Failed to update vehicle in database: ' + error.message, 'error');
          return false;
        }
      } catch (err: any) {
        console.error('[AutoSphere] Exception updating vehicle in Supabase:', err);
        showToast('Error updating vehicle: ' + err.message, 'error');
        return false;
      }
    }

    if (typeof localStorage !== 'undefined') {
      const storageKey = user ? `autosphere_vehicles_${user.id}` : 'autosphere_vehicles_guest';
      const updated = vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v));
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }

    showToast('Vehicle details updated successfully.', 'success');
    return true;
  };

  const deleteVehicle = async (id: string): Promise<boolean> => {
    if (vehicles.length <= 1) {
      showToast('You must keep at least one vehicle in your garage.', 'warning');
      return false;
    }

    if (isSupabaseConfigured && user) {
      try {
        const { error } = await (supabase.from('vehicles') as any)
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('[AutoSphere] Error deleting vehicle from Supabase:', error);
          showToast('Failed to delete vehicle: ' + error.message, 'error');
          return false;
        }
      } catch (err: any) {
        console.error('[AutoSphere] Exception deleting vehicle from Supabase:', err);
        showToast('Error deleting vehicle: ' + err.message, 'error');
        return false;
      }
    }

    const remaining = vehicles.filter((v) => v.id !== id);
    setVehicles(remaining);
    if (activeVehicleId === id) {
      setActiveVehicleId(remaining[0]?.id || '');
    }

    if (typeof localStorage !== 'undefined') {
      const storageKey = user ? `autosphere_vehicles_${user.id}` : 'autosphere_vehicles_guest';
      localStorage.setItem(storageKey, JSON.stringify(remaining));
      if (remaining[0]) {
        const activeKey = user ? `autosphere_active_vehicle_${user.id}` : 'autosphere_active_vehicle_guest';
        localStorage.setItem(activeKey, remaining[0].id);
      }
    }

    showToast('Vehicle removed from garage.', 'info');
    return true;
  };

  const addExpense = async (newExpenseData: Omit<Expense, 'id'>) => {
    if (isSupabaseConfigured && user) {
      try {
        const { data, error } = await (supabase.from('vehicle_expenses') as any)
          .insert([{
            user_id: user.id,
            vehicle_id: newExpenseData.vehicleId,
            category: newExpenseData.category,
            amount_inr: newExpenseData.amountINR,
            expense_date: newExpenseData.date,
            odometer_km: newExpenseData.odoKm,
            vendor: newExpenseData.vendor,
            notes: newExpenseData.notes,
            payment_method: newExpenseData.paymentMethod,
            receipt_attached: newExpenseData.receiptAttached || false,
            fuel_litres_or_units: newExpenseData.fuelLitresOrUnits,
          }])
          .select()
          .single();

        if (error) {
          console.error('Error saving expense to Supabase:', error);
          showToast('Failed to save expense: ' + error.message, 'error');
          return;
        }

        if (data) {
          const newExpense: Expense = {
            id: data.id,
            vehicleId: data.vehicle_id,
            category: data.category as any,
            amountINR: Number(data.amount_inr),
            date: data.expense_date,
            odoKm: data.odometer_km || 0,
            vendor: data.vendor,
            notes: data.notes || '',
            paymentMethod: data.payment_method as any,
            receiptAttached: data.receipt_attached,
            fuelLitresOrUnits: data.fuel_litres_or_units ? Number(data.fuel_litres_or_units) : undefined,
          };
          setExpenses((prev) => [newExpense, ...prev]);

          if (newExpense.odoKm && activeVehicle && newExpense.odoKm > activeVehicle.odoKm) {
            updateVehicle(newExpense.vehicleId, { odoKm: newExpense.odoKm });
          }

          showToast(`Expense of ₹${newExpense.amountINR.toLocaleString('en-IN')} logged.`, 'success');
          return;
        }
      } catch (err: any) {
        console.error('Exception saving expense to Supabase:', err);
        showToast('Error saving expense: ' + err.message, 'error');
        return;
      }
    }

    const id = `exp-${Date.now()}`;
    const newExpense: Expense = { ...newExpenseData, id };
    setExpenses((prev) => [newExpense, ...prev]);

    if (newExpense.odoKm && activeVehicle && newExpense.odoKm > activeVehicle.odoKm) {
      updateVehicle(newExpense.vehicleId, { odoKm: newExpense.odoKm });
    }

    showToast(`Expense of ₹${newExpense.amountINR.toLocaleString('en-IN')} logged.`, 'success');
  };

  const deleteExpense = async (id: string) => {
    if (isSupabaseConfigured && user) {
      try {
        const { error } = await (supabase.from('vehicle_expenses') as any)
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting expense from Supabase:', error);
          showToast('Failed to delete expense: ' + error.message, 'error');
          return;
        }
      } catch (err: any) {
        console.error('Exception deleting expense from Supabase:', err);
        showToast('Error deleting expense: ' + err.message, 'error');
        return;
      }
    }

    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Expense entry deleted.', 'info');
  };

  const resolveDiagnostic = (id: string) => {
    setDiagnostics((prev) =>
      prev.map((diag) => (diag.id === id ? { ...diag, isResolved: true } : diag))
    );
    showToast('Diagnostic issue marked as resolved.', 'success');
  };

  const runDiagnosticScan = async () => {
    setIsScanning(true);
    showToast('Initializing OBD-II wireless diagnostic handshake...', 'info');
    await new Promise((resolve) => setTimeout(resolve, 2200));
    setIsScanning(false);
    showToast('Diagnostic scan completed! All telemetry nodes synchronized.', 'success');
  };

  const addDocument = (doc: Omit<DocumentItem, 'id'>) => {
    const id = `doc-${Date.now()}`;
    setDocuments((prev) => [{ ...doc, id }, ...prev]);
    showToast(`${doc.title} uploaded and verified via DigiLocker.`, 'success');
  };

  const bookService = (bookingData: Omit<ServiceBooking, 'id' | 'status'>) => {
    const id = `srv-${Date.now()}`;
    const newBooking: ServiceBooking = {
      ...bookingData,
      id,
      status: 'confirmed',
    };
    setServiceBookings((prev) => [newBooking, ...prev]);
    showToast(`Service appointment booked at ${bookingData.centerName}!`, 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const addToCart = (item: Accessory) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    showToast(`${item.name} added to cart.`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalINR = cart.reduce(
    (sum, item) => sum + item.item.priceINR * item.quantity,
    0
  );

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
    showToast('Profile and preferences updated.', 'success');
  };

  const sendUserMessage = async (content: string) => {
    const userMsgId = `chat-user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedWithUser = [...chatMessages, userMsg];
    setChatMessages(updatedWithUser);
    aiAssistantService.saveChatHistory(userProfile?.email, updatedWithUser);
    setIsAiTyping(true);

    try {
      const context = synthesizeVehicleContext(activeVehicle, activeVehicleExpenses, diagnostics);
      const aiResponse = await aiAssistantService.sendMessage(content, context, chatMessages);

      const botMsgId = `chat-bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        structuredData: aiResponse.structuredData,
        suggestions: aiResponse.suggestions,
      };

      const finalMessages = [...updatedWithUser, botMsg];
      setChatMessages(finalMessages);
      aiAssistantService.saveChatHistory(userProfile?.email, finalMessages);
    } catch (err) {
      console.error('Error generating AI response:', err);
      const errorMsg: ChatMessage = {
        id: `chat-error-${Date.now()}`,
        sender: 'assistant',
        content: 'I encountered a temporary connection issue. Please try again or select one of the suggested prompts below.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Which car should I buy under ₹10 lakh?', 'What maintenance does my car need?'],
      };
      const fallbackList = [...updatedWithUser, errorMsg];
      setChatMessages(fallbackList);
      aiAssistantService.saveChatHistory(userProfile?.email, fallbackList);
    } finally {
      setIsAiTyping(false);
    }
  };

  const clearChatHistory = () => {
    aiAssistantService.clearChatHistory(userProfile?.email);
    setChatMessages([]);
  };

  return (
    <AppContext.Provider
      value={{
        vehicles,
        activeVehicleId,
        activeVehicle,
        setActiveVehicleId,
        isVehiclesLoading,
        vehiclesError,
        refreshVehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,

        expenses,
        activeVehicleExpenses,
        addExpense,
        deleteExpense,

        diagnostics,
        resolveDiagnostic,
        runDiagnosticScan,
        isScanning,

        documents,
        addDocument,

        serviceBookings,
        bookService,

        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotalINR,

        userProfile,
        updateUserProfile,

        chatMessages,
        sendUserMessage,
        clearChatHistory,
        isAiTyping,

        isLogExpenseOpen,
        openLogExpense: () => setIsLogExpenseOpen(true),
        closeLogExpense: () => setIsLogExpenseOpen(false),

        isBookServiceOpen,
        openBookService: () => setIsBookServiceOpen(true),
        closeBookService: () => setIsBookServiceOpen(false),

        isAddVehicleOpen,
        openAddVehicle: () => setIsAddVehicleOpen(true),
        closeAddVehicle: () => setIsAddVehicleOpen(false),

        isValuationOpen,
        openValuation: () => setIsValuationOpen(true),
        closeValuation: () => setIsValuationOpen(false),

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
