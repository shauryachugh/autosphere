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
  activeVehicle: Vehicle;
  setActiveVehicleId: (id: string) => void;
  addVehicle: (vehicle: Partial<Vehicle> & Pick<Vehicle, 'make' | 'model' | 'variant' | 'year' | 'regNumber' | 'fuelType' | 'transmission' | 'odoKm' | 'city' | 'state'>) => Promise<Vehicle | null>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('autosphere_vehicles');
    return saved ? JSON.parse(saved) : initialVehicles;
  });

  const [activeVehicleId, setActiveVehicleId] = useState<string>(() => {
    const saved = localStorage.getItem('autosphere_active_vehicle');
    return saved || 'veh-xuv700-01';
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('autosphere_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  // Sync Supabase data when real authenticated user is loaded
  useEffect(() => {
    let isMounted = true;

    if (!user && !isGuest) {
      setVehicles([]);
      setExpenses([]);
      setActiveVehicleId('');
      return;
    }

    if (isGuest) {
      const savedVehicles = localStorage.getItem('autosphere_vehicles');
      setVehicles(savedVehicles ? JSON.parse(savedVehicles) : initialVehicles);
      const savedExpenses = localStorage.getItem('autosphere_expenses');
      setExpenses(savedExpenses ? JSON.parse(savedExpenses) : initialExpenses);
      const savedActive = localStorage.getItem('autosphere_active_vehicle');
      setActiveVehicleId(savedActive || 'veh-xuv700-01');
      return;
    }

    if (!isSupabaseConfigured || !user) return;

    async function syncSupabase() {
      try {
        // 1. Vehicles from Supabase
        const { data: dbVehicles, error: vErr } = await (supabase
          .from('vehicles') as any)
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (!vErr && isMounted) {
          if (dbVehicles && dbVehicles.length > 0) {
            const mappedVehicles: Vehicle[] = (dbVehicles as any[]).map((v) => ({
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
              currentFuelPercent: v.current_fuel_percent || 70,
              batteryHealthPercent: v.battery_health_percent || 98,
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
              isPrimary: v.is_primary,
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
            }));
            setVehicles(mappedVehicles);
            setActiveVehicleId((prev) => mappedVehicles.some((m) => m.id === prev) ? prev : mappedVehicles[0].id);
          } else {
            // User has 0 vehicles in Supabase — clean empty state, no mock data!
            setVehicles([]);
            setActiveVehicleId('');
          }
        } else if (vErr) {
          console.error('Error fetching vehicles from Supabase:', vErr);
        }

        // 2. Vehicle Expenses from Supabase
        const { data: dbExpenses, error: eErr } = await (supabase
          .from('vehicle_expenses') as any)
          .select('*')
          .eq('user_id', user!.id)
          .order('expense_date', { ascending: false });

        if (!eErr && isMounted) {
          if (dbExpenses && dbExpenses.length > 0) {
            const mappedExpenses: Expense[] = (dbExpenses as any[]).map((e) => ({
              id: e.id,
              vehicleId: e.vehicle_id,
              category: e.category as any,
              amountINR: Number(e.amount_inr),
              date: e.expense_date,
              odoKm: e.odometer_km || 0,
              vendor: e.vendor,
              notes: e.notes || '',
              paymentMethod: e.payment_method as any,
              receiptAttached: e.receipt_attached,
              fuelLitresOrUnits: e.fuel_litres_or_units ? Number(e.fuel_litres_or_units) : undefined,
            }));
            setExpenses(mappedExpenses);
          } else {
            setExpenses([]);
          }
        } else if (eErr) {
          console.error('Error fetching expenses from Supabase:', eErr);
        }
      } catch (err) {
        console.error('Supabase synchronization error:', err);
      }
    }

    syncSupabase();
    return () => { isMounted = false; };
  }, [user, isGuest]);

  const [diagnostics, setDiagnostics] = useState<DiagnosticIssue[]>(() => {
    const saved = localStorage.getItem('autosphere_diagnostics');
    return saved ? JSON.parse(saved) : initialDiagnostics;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('autosphere_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('autosphere_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('autosphere_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [cart, setCart] = useState<{ item: Accessory; quantity: number }[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = aiAssistantService.getChatHistory();
    return saved && saved.length > 0 ? saved : sampleChatMessages;
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

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('autosphere_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('autosphere_active_vehicle', activeVehicleId);
  }, [activeVehicleId]);

  useEffect(() => {
    localStorage.setItem('autosphere_expenses', JSON.stringify(expenses));
  }, [expenses]);

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

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0] || initialVehicles[0];

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
    if (isSupabaseConfigured && user && !isGuest) {
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
          console.error('Error inserting vehicle into Supabase:', error);
          showToast('Failed to save vehicle: ' + error.message, 'error');
          return null;
        }

        if (data) {
          const persistedVehicle: Vehicle = {
            ...baseVehicle,
            id: data.id, // True PostgreSQL UUID
          };
          setVehicles((prev) => [persistedVehicle, ...prev]);
          setActiveVehicleId(persistedVehicle.id);
          showToast(`${persistedVehicle.make} ${persistedVehicle.model} added to your garage!`, 'success');
          return persistedVehicle;
        }
      } catch (err: any) {
        console.error('Exception inserting vehicle into Supabase:', err);
        showToast('Error saving vehicle: ' + err.message, 'error');
        return null;
      }
    }

    setVehicles((prev) => [baseVehicle, ...prev]);
    setActiveVehicleId(tempId);
    showToast(`${baseVehicle.make} ${baseVehicle.model} added to your garage!`, 'success');
    return baseVehicle;
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );

    if (isSupabaseConfigured && user && !isGuest) {
      try {
        const dbUpdates: any = {};
        if (updates.odoKm !== undefined) dbUpdates.current_odometer = updates.odoKm;
        if (updates.healthScore !== undefined) dbUpdates.health_score = updates.healthScore;
        if (updates.currentFuelPercent !== undefined) dbUpdates.current_fuel_percent = updates.currentFuelPercent;
        if (updates.avgEfficiency !== undefined) dbUpdates.avg_efficiency = updates.avgEfficiency;
        if (updates.isPrimary !== undefined) dbUpdates.is_primary = updates.isPrimary;
        if (updates.insuranceExpiryDate !== undefined) dbUpdates.insurance_expiry_date = updates.insuranceExpiryDate;
        if (updates.pucExpiryDate !== undefined) dbUpdates.puc_expiry_date = updates.pucExpiryDate;

        const { error } = await (supabase.from('vehicles') as any)
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating vehicle in Supabase:', error);
          showToast('Failed to update vehicle in database: ' + error.message, 'error');
          return;
        }
      } catch (err: any) {
        console.error('Exception updating vehicle in Supabase:', err);
        showToast('Error updating vehicle: ' + err.message, 'error');
        return;
      }
    }

    showToast('Vehicle details updated successfully.', 'success');
  };

  const deleteVehicle = async (id: string) => {
    if (vehicles.length <= 1) {
      showToast('You must keep at least one vehicle in your garage.', 'warning');
      return;
    }

    if (isSupabaseConfigured && user && !isGuest) {
      try {
        const { error } = await (supabase.from('vehicles') as any)
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting vehicle from Supabase:', error);
          showToast('Failed to delete vehicle: ' + error.message, 'error');
          return;
        }
      } catch (err: any) {
        console.error('Exception deleting vehicle from Supabase:', err);
        showToast('Error deleting vehicle: ' + err.message, 'error');
        return;
      }
    }

    const remaining = vehicles.filter((v) => v.id !== id);
    setVehicles(remaining);
    if (activeVehicleId === id) {
      setActiveVehicleId(remaining[0]?.id || '');
    }

    showToast('Vehicle removed from garage.', 'info');
  };

  const addExpense = async (newExpenseData: Omit<Expense, 'id'>) => {
    if (isSupabaseConfigured && user && !isGuest) {
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
    if (isSupabaseConfigured && user && !isGuest) {
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
