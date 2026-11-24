-- ====================================================================
-- AutoSphere Phase 2 Database Schema & Security Definition
-- PostgreSQL + Supabase Authentication & Row Level Security (RLS)
-- ====================================================================

-- 1. PROFILES TABLE (Mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  city TEXT DEFAULT 'Bengaluru',
  state TEXT DEFAULT 'Karnataka',
  avatar_url TEXT DEFAULT '',
  fastag_wallet_balance NUMERIC(12, 2) NOT NULL DEFAULT 1500.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT NOT NULL,
  manufacturing_year INT NOT NULL,
  registration_year INT NOT NULL,
  registration_number TEXT NOT NULL,
  vin TEXT,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'cng')),
  transmission TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic', 'dct', 'cvt', 'amt', 'single-speed')),
  body_type TEXT NOT NULL DEFAULT 'suv' CHECK (body_type IN ('suv', 'sedan', 'hatchback', 'mpv', 'crossover')),
  current_odometer INT NOT NULL DEFAULT 0,
  purchase_price NUMERIC(12, 2) DEFAULT 0,
  purchase_date DATE,
  registration_state TEXT NOT NULL,
  registration_city TEXT NOT NULL,
  engine_cc INT,
  battery_capacity_kwh NUMERIC(6, 2),
  power_bhp INT DEFAULT 150,
  torque_nm INT DEFAULT 300,
  current_fuel_percent INT DEFAULT 75,
  battery_health_percent INT DEFAULT 98,
  estimated_range_km INT DEFAULT 450,
  avg_efficiency TEXT DEFAULT '14.2 km/l',
  insurance_policy_number TEXT DEFAULT '',
  insurance_provider TEXT DEFAULT 'HDFC ERGO General Insurance',
  insurance_expiry_date DATE,
  puc_expiry_date DATE,
  last_service_date DATE,
  last_service_km INT DEFAULT 0,
  next_service_due_date DATE,
  next_service_due_km INT DEFAULT 10000,
  health_score INT NOT NULL DEFAULT 95,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  connected_car_platform TEXT DEFAULT 'AdrenoX',
  connected_status TEXT DEFAULT 'online' CHECK (connected_status IN ('online', 'standby', 'disconnected')),
  tyre_pressure_front_left INT DEFAULT 34,
  tyre_pressure_front_right INT DEFAULT 34,
  tyre_pressure_rear_left INT DEFAULT 33,
  tyre_pressure_rear_right INT DEFAULT 33,
  tyre_pressure_spare INT DEFAULT 34,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. VEHICLE EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.vehicle_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('fuel', 'charging', 'service', 'toll', 'insurance', 'wash', 'accessories', 'parking', 'challan')),
  amount_inr NUMERIC(12, 2) NOT NULL CHECK (amount_inr >= 0),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  odometer_km INT,
  vendor TEXT NOT NULL DEFAULT '',
  notes TEXT DEFAULT '',
  payment_method TEXT NOT NULL DEFAULT 'UPI' CHECK (payment_method IN ('UPI', 'Credit Card', 'FASTag', 'Net Banking', 'Cash')),
  receipt_attached BOOLEAN NOT NULL DEFAULT false,
  fuel_litres_or_units NUMERIC(8, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. MAINTENANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  service_center TEXT NOT NULL,
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,
  odometer_km INT NOT NULL,
  cost_inr NUMERIC(12, 2) NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  invoice_number TEXT DEFAULT '',
  next_service_due_date DATE,
  next_service_due_km INT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. INSURANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.insurance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  policy_type TEXT NOT NULL DEFAULT 'Comprehensive Zero-Depreciation',
  premium_inr NUMERIC(12, 2) NOT NULL DEFAULT 0,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  idv_inr NUMERIC(12, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'expiring_soon', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. FUEL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.fuel_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'cng')),
  litres_or_kwh NUMERIC(8, 2) NOT NULL,
  price_per_unit_inr NUMERIC(8, 2) NOT NULL,
  total_cost_inr NUMERIC(10, 2) NOT NULL,
  odometer_km INT NOT NULL,
  fuel_station TEXT NOT NULL DEFAULT '',
  is_full_tank BOOLEAN NOT NULL DEFAULT true,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. SAVED RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.saved_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  recommended_car_id TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  projected_annual_savings_inr NUMERIC(12, 2) NOT NULL DEFAULT 0,
  upgrade_score INT NOT NULL DEFAULT 90,
  notes TEXT DEFAULT '',
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  default_fuel_type TEXT DEFAULT 'diesel',
  monthly_average_km INT DEFAULT 1200,
  connected_car_sync_enabled BOOLEAN NOT NULL DEFAULT true,
  alert_service_reminders BOOLEAN NOT NULL DEFAULT true,
  alert_puc_expiry BOOLEAN NOT NULL DEFAULT true,
  alert_insurance_renewal BOOLEAN NOT NULL DEFAULT true,
  alert_fastag_low_balance BOOLEAN NOT NULL DEFAULT true,
  alert_speed_warnings BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_expenses_user_id ON public.vehicle_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_expenses_vehicle_id ON public.vehicle_expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_expenses_date ON public.vehicle_expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle_id ON public.maintenance_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_insurance_vehicle_id ON public.insurance_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fuel_vehicle_id ON public.fuel_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON public.saved_recommendations(user_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Users can ONLY access their own records
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- 2. Vehicles Policies
CREATE POLICY "Users can select own vehicles" ON public.vehicles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles" ON public.vehicles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles" ON public.vehicles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles" ON public.vehicles
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Vehicle Expenses Policies
CREATE POLICY "Users can select own expenses" ON public.vehicle_expenses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" ON public.vehicle_expenses
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" ON public.vehicle_expenses
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON public.vehicle_expenses
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. Maintenance Records Policies
CREATE POLICY "Users can select own maintenance" ON public.maintenance_records
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own maintenance" ON public.maintenance_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own maintenance" ON public.maintenance_records
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own maintenance" ON public.maintenance_records
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 5. Insurance Records Policies
CREATE POLICY "Users can select own insurance" ON public.insurance_records
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insurance" ON public.insurance_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insurance" ON public.insurance_records
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own insurance" ON public.insurance_records
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 6. Fuel Records Policies
CREATE POLICY "Users can select own fuel records" ON public.fuel_records
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fuel records" ON public.fuel_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fuel records" ON public.fuel_records
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own fuel records" ON public.fuel_records
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 7. Saved Recommendations Policies
CREATE POLICY "Users can select own recommendations" ON public.saved_recommendations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations" ON public.saved_recommendations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations" ON public.saved_recommendations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 8. User Preferences Policies
CREATE POLICY "Users can select own preferences" ON public.user_preferences
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- AUTOMATIC PROFILE & PREFERENCE INITIALIZATION TRIGGER
-- Automatically sets up new user profile and preferences on sign up
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert default profile
  INSERT INTO public.profiles (id, full_name, phone, city, state)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'AutoSphere Member'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'city', 'Bengaluru'),
    COALESCE(new.raw_user_meta_data->>'state', 'Karnataka')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
