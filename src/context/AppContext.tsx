import React, { createContext, useContext, useState, useEffect } from 'react';
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
  addVehicle: (vehicle: Partial<Vehicle> & Pick<Vehicle, 'make' | 'model' | 'variant' | 'year' | 'regNumber' | 'fuelType' | 'transmission' | 'odoKm' | 'city' | 'state'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  // Expenses
  expenses: Expense[];
  activeVehicleExpenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(sampleChatMessages);
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

  const activeVehicleExpenses = expenses.filter((e) => e.vehicleId === activeVehicle.id);

  const addVehicle = (newVehicleData: Partial<Vehicle> & Pick<Vehicle, 'make' | 'model' | 'variant' | 'year' | 'regNumber' | 'fuelType' | 'transmission' | 'odoKm' | 'city' | 'state'>) => {
    const id = `veh-${Date.now().toString(36)}`;
    const newVehicle: Vehicle = {
      bodyType: 'suv',
      vin: 'MA1' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      currentFuelPercent: 75,
      estimatedRangeKm: 450,
      avgEfficiency: '14.2 km/l',
      insurancePolicyNumber: 'HDFC-ERGO-' + Math.floor(100000 + Math.random() * 900000),
      insuranceExpiryDate: '2027-05-20',
      insuranceProvider: 'HDFC ERGO General Insurance',
      pucExpiryDate: '2027-02-18',
      lastServiceDate: '2026-06-10',
      lastServiceKm: 10000,
      nextServiceDueDate: '2027-06-10',
      nextServiceDueKm: 20000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      powerBhp: 170,
      torqueNm: 350,
      fastagBalanceINR: 1000,
      ...newVehicleData,
      id,
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
    setVehicles((prev) => [...prev, newVehicle]);
    setActiveVehicleId(id);
    showToast(`${newVehicle.make} ${newVehicle.model} added to your garage!`, 'success');
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
    showToast('Vehicle details updated successfully.', 'success');
  };

  const deleteVehicle = (id: string) => {
    if (vehicles.length <= 1) {
      showToast('You must keep at least one vehicle in your garage.', 'warning');
      return;
    }
    const remaining = vehicles.filter((v) => v.id !== id);
    setVehicles(remaining);
    if (activeVehicleId === id) {
      setActiveVehicleId(remaining[0].id);
    }
    showToast('Vehicle removed from garage.', 'info');
  };

  const addExpense = (newExpenseData: Omit<Expense, 'id'>) => {
    const id = `exp-${Date.now()}`;
    const newExpense: Expense = {
      ...newExpenseData,
      id,
    };
    setExpenses((prev) => [newExpense, ...prev]);

    // Update vehicle odometer if expense odo is higher
    if (newExpense.odoKm && newExpense.odoKm > activeVehicle.odoKm) {
      updateVehicle(newExpense.vehicleId, { odoKm: newExpense.odoKm });
    }

    showToast(`Expense of ₹${newExpense.amountINR.toLocaleString('en-IN')} logged.`, 'success');
  };

  const deleteExpense = (id: string) => {
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

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    // Simulate intelligent contextual automotive responses
    setTimeout(() => {
      const lower = content.toLowerCase();
      let replyContent = '';
      let structuredData: ChatMessage['structuredData'] | undefined = undefined;
      let suggestions: string[] = [];

      if (lower.includes('service') || lower.includes('estimate') || lower.includes('cost')) {
        replyContent = `Based on genuine OEM parts data for your ${activeVehicle.make} ${activeVehicle.model} at ~${activeVehicle.odoKm.toLocaleString('en-IN')} km, an authorized 30,000 km service typically costs between ₹12,500 and ₹15,200 in Bengaluru.`;
        structuredData = {
          type: 'cost_estimate',
          title: '30,000 km Service Fair Price Breakdown',
          items: [
            { label: 'Synthetic Engine Oil (MaxiMile 6L)', value: '₹4,850' },
            { label: 'Oil Filter & O-Rings', value: '₹480' },
            { label: 'Air & Cabin AC Microfilter', value: '₹1,250' },
            { label: 'Fuel Filter Cartridge', value: '₹2,100' },
            { label: 'Brake Inspection & Caliper Greasing', value: '₹950' },
            { label: 'Labor Charges (Authorized)', value: '₹3,200' },
            { label: 'GST @ 18%', value: '₹2,309' },
            { label: 'Total Estimated Fair Cost', value: '₹15,139' },
          ],
          actionButton: { label: 'Book Authorized Service', link: '/garage' },
        };
        suggestions = ['Decline unnecessary engine decarb flushes', 'Check brake pad thickness', 'Ask about prepaid service pack'];
      } else if (lower.includes('dpf') || lower.includes('p2463') || lower.includes('soot') || lower.includes('error')) {
        replyContent = `Error Code P2463 indicates Diesel Particulate Filter Soot Accumulation (currently at ~68% in your telematics). This is very common in Indian bumper-to-bumper traffic when the exhaust gas temperature doesn't get hot enough for passive regeneration.`;
        structuredData = {
          type: 'dtc_diagnostics',
          title: 'OBD-II Fault Diagnostics: P2463',
          items: [
            { label: 'Subsystem', value: 'Exhaust & Emissions' },
            { label: 'Current Soot Mass', value: '68% (Warning Threshold)' },
            { label: 'Immediate Risk', value: 'Low (Safe for normal driving up to 80%)' },
            { label: 'DIY Highway Fix', value: '25 min drive at >2000 RPM on NICE Road' },
            { label: 'Service Center Cost', value: '₹0 (If DIY done) or ₹1,800 (Forced Regen)' },
          ],
          actionButton: { label: 'View Health Telematics', link: '/vehicle-health' },
        };
        suggestions = ['How to prevent DPF clogging in city traffic?', 'Is it covered under Mahindra warranty?', 'Show tyre pressures'];
      } else if (lower.includes('ev') || lower.includes('hybrid') || lower.includes('replace') || lower.includes('switch')) {
        replyContent = `If you drive ~1,250 km monthly in Bengaluru, switching from your Diesel XUV700 (₹6.8 / km) to an EV like Tata Harrier.ev or Nexon EV (₹1.4 / km) will save you approximately ₹6,750 per month, or ₹81,000 annually in fuel alone!`;
        structuredData = {
          type: 'comparison',
          title: 'Diesel vs EV 5-Year Ownership TCO',
          items: [
            { label: 'Current Diesel Cost (5 Yrs)', value: '₹5,10,000' },
            { label: 'EV Electricity Cost (5 Yrs)', value: '₹1,05,000' },
            { label: 'Net Fuel Savings', value: '₹4,05,000' },
            { label: 'Road Tax Exemption in KA', value: '₹3,80,000 (Savings)' },
            { label: '5-Year Total Benefit', value: '₹7,85,000' },
          ],
          actionButton: { label: 'Explore Smart Recommendations', link: '/recommendations' },
        };
        suggestions = ['Compare Toyota Innova Hycross Hybrid', 'What is battery warranty on Tata EVs?', 'Check my car exchange value'];
      } else if (lower.includes('challan') || lower.includes('rto') || lower.includes('traffic')) {
        replyContent = `AutoSphere connects with the Parivahan national database. For your vehicle ${activeVehicle.regNumber}, there is currently 0 pending e-challans on Karnataka One / Bengaluru Traffic Police portal.`;
        structuredData = {
          type: 'rto_guide',
          title: 'Parivahan RTO & Challan Status',
          items: [
            { label: 'Registration Number', value: activeVehicle.regNumber },
            { label: 'Registered RTO', value: 'KA-03 (Indiranagar, Bengaluru)' },
            { label: 'Pending Challans', value: '₹0 (Clear)' },
            { label: 'PUC Status', value: 'Valid till 15 Jan 2027' },
          ],
          actionButton: { label: 'View Documents Vault', link: '/garage' },
        };
        suggestions = ['How to renew PUC online?', 'Check FASTag balance', 'Calculate car resale value'];
      } else {
        replyContent = `I understand your query regarding "${content}". With AutoSphere's connected intelligence engine, we track your vehicle's mechanical telemetry, service intervals, and operating expenses in real-time. Would you like me to analyze your fuel trends, book a certified service, or check your car's fair market valuation?`;
        suggestions = [
          'What is my car\'s current market value?',
          'How can I lower my monthly vehicle expenses?',
          'Run a live OBD-II diagnostic scan',
          'Show top recommended replacement cars',
        ];
      }

      const botMsgId = `chat-bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        structuredData,
        suggestions,
      };

      setChatMessages((prev) => [...prev, botMsg]);
      setIsAiTyping(false);
    }, 900);
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
