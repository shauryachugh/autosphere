-- See supabase/migrations/20261124000000_autosphere_schema.sql for the complete SQL migration.
-- You can run this file directly in the Supabase Dashboard -> SQL Editor.

-- 1. PROFILES TABLE
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
  avg_efficiency TEXT DEFAULT '',
  claimed_mileage NUMERIC(8, 2),
  actual_mileage NUMERIC(8, 2),
  monthly_km_driven INT,
  estimated_resale_value NUMERIC(12, 2),
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

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- POLICIES
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can select own vehicles" ON public.vehicles;
CREATE POLICY "Users can select own vehicles" ON public.vehicles FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own vehicles" ON public.vehicles;
CREATE POLICY "Users can insert own vehicles" ON public.vehicles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own vehicles" ON public.vehicles;
CREATE POLICY "Users can update own vehicles" ON public.vehicles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own vehicles" ON public.vehicles;
CREATE POLICY "Users can delete own vehicles" ON public.vehicles FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can select own expenses" ON public.vehicle_expenses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses" ON public.vehicle_expenses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses" ON public.vehicle_expenses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses" ON public.vehicle_expenses FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can select own maintenance" ON public.maintenance_records FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own maintenance" ON public.maintenance_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own maintenance" ON public.maintenance_records FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own maintenance" ON public.maintenance_records FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can select own insurance" ON public.insurance_records FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own insurance" ON public.insurance_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own insurance" ON public.insurance_records FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own insurance" ON public.insurance_records FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can select own fuel records" ON public.fuel_records FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own fuel records" ON public.fuel_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own fuel records" ON public.fuel_records FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own fuel records" ON public.fuel_records FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can select own recommendations" ON public.saved_recommendations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recommendations" ON public.saved_recommendations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own recommendations" ON public.saved_recommendations FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can select own preferences" ON public.user_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- USER SETUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, city, state)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'AutoSphere Member'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'city', 'Bengaluru'),
    COALESCE(new.raw_user_meta_data->>'state', 'Karnataka')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================================
-- PHASE 3: SMART CAR REPLACEMENT INTELLIGENCE SCHEMA
-- ==========================================================

-- 9. CAR CATALOGUE TABLE
CREATE TABLE IF NOT EXISTS public.car_catalogue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'cng')),
  transmission TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic', 'dct', 'cvt', 'amt', 'single-speed')),
  body_type TEXT NOT NULL CHECK (body_type IN ('suv', 'sedan', 'hatchback', 'mpv', 'crossover')),
  ex_showroom_price NUMERIC(12, 2) NOT NULL CHECK (ex_showroom_price > 0),
  estimated_on_road_price NUMERIC(12, 2) NOT NULL CHECK (estimated_on_road_price > 0),
  mileage_or_range NUMERIC(8, 2) NOT NULL CHECK (mileage_or_range > 0),
  mileage_unit TEXT NOT NULL DEFAULT 'km/l',
  power_bhp INT NOT NULL DEFAULT 120,
  torque_nm INT NOT NULL DEFAULT 200,
  safety_rating TEXT DEFAULT '5 Star Bharat NCAP',
  annual_maintenance_estimate NUMERIC(10, 2) NOT NULL DEFAULT 12000.00,
  annual_insurance_estimate NUMERIC(10, 2) NOT NULL DEFAULT 35000.00,
  resale_percentage_3yr NUMERIC(5, 2) NOT NULL DEFAULT 65.00,
  resale_percentage_5yr NUMERIC(5, 2) NOT NULL DEFAULT 48.00,
  image_url TEXT,
  highlights TEXT[] DEFAULT '{}',
  why_recommended TEXT DEFAULT '',
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. RECOMMENDATION ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.recommendation_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Smart Car Replacement Analysis',
  current_vehicle_data JSONB NOT NULL,
  replacement_criteria JSONB NOT NULL,
  current_car_tco JSONB NOT NULL,
  recommended_cars JSONB NOT NULL,
  compared_car_ids TEXT[] DEFAULT '{}',
  verdict TEXT NOT NULL CHECK (verdict IN ('KEEP_CURRENT', 'CONSIDER_UPGRADING', 'REPLACEMENT_FINANCIALLY_BENEFICIAL')),
  verdict_details JSONB NOT NULL,
  five_year_net_difference NUMERIC(12, 2) NOT NULL DEFAULT 0,
  is_saved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_car_catalogue_fuel_body ON public.car_catalogue (fuel_type, body_type);
CREATE INDEX IF NOT EXISTS idx_car_catalogue_price ON public.car_catalogue (ex_showroom_price);
CREATE INDEX IF NOT EXISTS idx_recommendation_analyses_user ON public.recommendation_analyses (user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_analyses_created ON public.recommendation_analyses (created_at DESC);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.car_catalogue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_analyses ENABLE ROW LEVEL SECURITY;

-- POLICIES
DROP POLICY IF EXISTS "Public read access to car catalogue" ON public.car_catalogue;
CREATE POLICY "Public read access to car catalogue" ON public.car_catalogue FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert car catalogue" ON public.car_catalogue;
CREATE POLICY "Authenticated users can insert car catalogue" ON public.car_catalogue FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Users can select own analyses" ON public.recommendation_analyses;
CREATE POLICY "Users can select own analyses" ON public.recommendation_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own analyses" ON public.recommendation_analyses;
CREATE POLICY "Users can insert own analyses" ON public.recommendation_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own analyses" ON public.recommendation_analyses;
CREATE POLICY "Users can update own analyses" ON public.recommendation_analyses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own analyses" ON public.recommendation_analyses;
CREATE POLICY "Users can delete own analyses" ON public.recommendation_analyses FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ==========================================================
-- PHASE 4: INDIA AUTOMOTIVE DATABASE AND PRICING ENGINE SCHEMA
-- ==========================================================

-- 11. MANUFACTURERS TABLE
CREATE TABLE IF NOT EXISTS public.manufacturers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL DEFAULT 'India',
  year_established_india INT,
  headquarters_india TEXT,
  logo_url TEXT,
  website_url TEXT,
  support_phone TEXT,
  market_share_percent NUMERIC(5, 2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. CAR MODELS TABLE
CREATE TABLE IF NOT EXISTS public.car_models (
  id TEXT PRIMARY KEY,
  manufacturer_id TEXT NOT NULL REFERENCES public.manufacturers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('suv', 'sedan', 'hatchback', 'mpv', 'crossover')),
  launch_year INT NOT NULL,
  market_status TEXT NOT NULL CHECK (market_status IN ('active', 'discontinued', 'upcoming')),
  available_fuel_types TEXT[] NOT NULL DEFAULT '{}',
  available_transmissions TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  description TEXT,
  safety_rating TEXT DEFAULT '5 Star Bharat NCAP',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. CAR VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.car_variants (
  id TEXT PRIMARY KEY,
  model_id TEXT NOT NULL REFERENCES public.car_models(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'cng')),
  transmission TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic', 'dct', 'cvt', 'amt', 'single-speed')),
  engine_capacity_cc INT,
  battery_capacity_kwh NUMERIC(6, 2),
  power_bhp NUMERIC(6, 1) NOT NULL,
  torque_nm NUMERIC(6, 1) NOT NULL,
  mileage_or_range NUMERIC(8, 2) NOT NULL,
  mileage_unit TEXT NOT NULL CHECK (mileage_unit IN ('km/l', 'km/charge', 'km/kg')),
  seating_capacity INT NOT NULL DEFAULT 5,
  ex_showroom_price NUMERIC(12, 2) NOT NULL CHECK (ex_showroom_price > 0),
  annual_maintenance_estimate NUMERIC(10, 2) NOT NULL DEFAULT 8000.00,
  annual_insurance_estimate NUMERIC(10, 2) NOT NULL DEFAULT 30000.00,
  ground_clearance_mm INT,
  boot_capacity_litres INT,
  fuel_tank_capacity_litres INT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. INDIAN STATES TABLE (28 States + 8 Union Territories)
CREATE TABLE IF NOT EXISTS public.indian_states (
  id TEXT PRIMARY KEY, -- State Code (e.g. 'KA', 'DL', 'MH')
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('state', 'union_territory')),
  capital TEXT NOT NULL,
  rto_code_prefix TEXT NOT NULL,
  gst_state_code TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 15. INDIAN CITIES TABLE
CREATE TABLE IF NOT EXISTS public.indian_cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state_id TEXT NOT NULL REFERENCES public.indian_states(id) ON DELETE CASCADE,
  tier INT NOT NULL CHECK (tier IN (1, 2, 3)),
  rto_codes TEXT[] NOT NULL DEFAULT '{}',
  is_metro BOOLEAN NOT NULL DEFAULT false,
  municipal_parking_tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
  local_cess_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 16. STATE RTO RULES TABLE (Configurable Road Tax Slabs)
CREATE TABLE IF NOT EXISTS public.state_rto_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id TEXT NOT NULL REFERENCES public.indian_states(id) ON DELETE CASCADE,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'cng', 'all')),
  price_min NUMERIC(12, 2) NOT NULL DEFAULT 0,
  price_max NUMERIC(12, 2) NOT NULL DEFAULT 999999999,
  tax_percent NUMERIC(5, 2) NOT NULL,
  fixed_cess NUMERIC(10, 2) NOT NULL DEFAULT 0,
  green_cess NUMERIC(10, 2) NOT NULL DEFAULT 0,
  special_notes TEXT,
  effective_year INT NOT NULL DEFAULT 2026
);

-- 17. FUEL PRICING RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.fuel_pricing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id TEXT NOT NULL REFERENCES public.indian_states(id) ON DELETE CASCADE,
  city_id TEXT REFERENCES public.indian_cities(id) ON DELETE SET NULL,
  petrol_price_per_litre NUMERIC(6, 2) NOT NULL,
  diesel_price_per_litre NUMERIC(6, 2) NOT NULL,
  cng_price_per_kg NUMERIC(6, 2) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. EV CHARGING TARIFFS TABLE
CREATE TABLE IF NOT EXISTS public.ev_charging_tariffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id TEXT NOT NULL REFERENCES public.indian_states(id) ON DELETE CASCADE,
  discom_name TEXT NOT NULL,
  domestic_ac_rate_per_kwh NUMERIC(6, 2) NOT NULL,
  public_dc_fast_rate_per_kwh NUMERIC(6, 2) NOT NULL,
  commercial_fleet_rate_per_kwh NUMERIC(6, 2) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_car_models_mfr ON public.car_models(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_car_models_cat ON public.car_models(category);
CREATE INDEX IF NOT EXISTS idx_car_variants_model ON public.car_variants(model_id);
CREATE INDEX IF NOT EXISTS idx_car_variants_fuel ON public.car_variants(fuel_type);
CREATE INDEX IF NOT EXISTS idx_car_variants_price ON public.car_variants(ex_showroom_price);
CREATE INDEX IF NOT EXISTS idx_indian_cities_state ON public.indian_cities(state_id);
CREATE INDEX IF NOT EXISTS idx_state_rto_rules_state ON public.state_rto_rules(state_id, fuel_type);
CREATE INDEX IF NOT EXISTS idx_fuel_pricing_state ON public.fuel_pricing_records(state_id);
CREATE INDEX IF NOT EXISTS idx_ev_tariffs_state ON public.ev_charging_tariffs(state_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indian_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indian_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.state_rto_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_pricing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_charging_tariffs ENABLE ROW LEVEL SECURITY;

-- POLICIES: Public read access
DROP POLICY IF EXISTS "Public read manufacturers" ON public.manufacturers;
CREATE POLICY "Public read manufacturers" ON public.manufacturers FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read car models" ON public.car_models;
CREATE POLICY "Public read car models" ON public.car_models FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read car variants" ON public.car_variants;
CREATE POLICY "Public read car variants" ON public.car_variants FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read indian states" ON public.indian_states;
CREATE POLICY "Public read indian states" ON public.indian_states FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read indian cities" ON public.indian_cities;
CREATE POLICY "Public read indian cities" ON public.indian_cities FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read state rto rules" ON public.state_rto_rules;
CREATE POLICY "Public read state rto rules" ON public.state_rto_rules FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read fuel pricing" ON public.fuel_pricing_records;
CREATE POLICY "Public read fuel pricing" ON public.fuel_pricing_records FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public read ev tariffs" ON public.ev_charging_tariffs;
CREATE POLICY "Public read ev tariffs" ON public.ev_charging_tariffs FOR SELECT TO public USING (true);

-- Authenticated write access
DROP POLICY IF EXISTS "Auth write manufacturers" ON public.manufacturers;
CREATE POLICY "Auth write manufacturers" ON public.manufacturers FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write car models" ON public.car_models;
CREATE POLICY "Auth write car models" ON public.car_models FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write car variants" ON public.car_variants;
CREATE POLICY "Auth write car variants" ON public.car_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write indian states" ON public.indian_states;
CREATE POLICY "Auth write indian states" ON public.indian_states FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write indian cities" ON public.indian_cities;
CREATE POLICY "Auth write indian cities" ON public.indian_cities FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write state rto rules" ON public.state_rto_rules;
CREATE POLICY "Auth write state rto rules" ON public.state_rto_rules FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write fuel pricing" ON public.fuel_pricing_records;
CREATE POLICY "Auth write fuel pricing" ON public.fuel_pricing_records FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write ev tariffs" ON public.ev_charging_tariffs;
CREATE POLICY "Auth write ev tariffs" ON public.ev_charging_tariffs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================================
-- PHASE 5: DIGITAL VEHICLE PASSPORT AND HEALTH TRACKER SCHEMA
-- ==========================================================

-- 19. EXTEND VEHICLES TABLE WITH PASSPORT ATTRIBUTES
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS engine_number TEXT,
ADD COLUMN IF NOT EXISTS rto_code TEXT,
ADD COLUMN IF NOT EXISTS previous_owners_count INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'Pearl White',
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';

-- 20. VEHICLE DOCUMENTS TABLE (Digital Document Vault)
CREATE TABLE IF NOT EXISTS public.vehicle_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('rc', 'insurance', 'puc', 'purchase_invoice', 'service_invoice', 'warranty', 'other')),
  document_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  file_url TEXT,
  storage_path TEXT,
  file_size_bytes BIGINT DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'expiring_soon', 'expired', 'under_review')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 21. MAINTENANCE SCHEDULES TABLE (Vehicle Health Subsystem Tracker)
CREATE TABLE IF NOT EXISTS public.maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  subsystem TEXT NOT NULL CHECK (subsystem IN ('engine', 'battery', 'tyres', 'brakes', 'transmission', 'ac', 'other')),
  item_name TEXT NOT NULL,
  last_service_date DATE,
  last_service_km INT,
  interval_months INT NOT NULL DEFAULT 12,
  interval_km INT NOT NULL DEFAULT 10000,
  next_due_date DATE,
  next_due_km INT,
  status TEXT NOT NULL DEFAULT 'up_to_date' CHECK (status IN ('up_to_date', 'due_soon', 'overdue', 'info_missing')),
  last_expense_inr NUMERIC(10, 2) DEFAULT 0.00,
  service_provider TEXT,
  technician_notes TEXT,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 22. VEHICLE REMINDERS TABLE (Smart In-App Reminders)
CREATE TABLE IF NOT EXISTS public.vehicle_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('insurance', 'puc', 'service', 'oil', 'battery', 'tyres', 'brakes', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  due_km INT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 23. VEHICLE PHOTOS TABLE (Vehicle Passport Gallery)
CREATE TABLE IF NOT EXISTS public.vehicle_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  storage_path TEXT,
  caption TEXT,
  angle TEXT DEFAULT 'front' CHECK (angle IN ('front', 'rear', 'side', 'interior', 'engine', 'odometer', 'document', 'other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicle_docs_user_veh ON public.vehicle_documents(user_id, vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_docs_expiry ON public.vehicle_documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_maint_schedules_veh ON public.maintenance_schedules(vehicle_id, subsystem);
CREATE INDEX IF NOT EXISTS idx_maint_schedules_status ON public.maintenance_schedules(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_reminders_veh ON public.vehicle_reminders(vehicle_id, due_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_reminders_user_active ON public.vehicle_reminders(user_id, is_completed, is_dismissed);
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_veh ON public.vehicle_photos(vehicle_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_photos ENABLE ROW LEVEL SECURITY;

-- POLICIES: Strict user isolation
DROP POLICY IF EXISTS "Users can view own vehicle documents" ON public.vehicle_documents;
CREATE POLICY "Users can view own vehicle documents" ON public.vehicle_documents FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own vehicle documents" ON public.vehicle_documents;
CREATE POLICY "Users can insert own vehicle documents" ON public.vehicle_documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vehicle documents" ON public.vehicle_documents;
CREATE POLICY "Users can update own vehicle documents" ON public.vehicle_documents FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicle documents" ON public.vehicle_documents;
CREATE POLICY "Users can delete own vehicle documents" ON public.vehicle_documents FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own maintenance schedules" ON public.maintenance_schedules;
CREATE POLICY "Users can view own maintenance schedules" ON public.maintenance_schedules FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own maintenance schedules" ON public.maintenance_schedules;
CREATE POLICY "Users can insert own maintenance schedules" ON public.maintenance_schedules FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own maintenance schedules" ON public.maintenance_schedules;
CREATE POLICY "Users can update own maintenance schedules" ON public.maintenance_schedules FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own maintenance schedules" ON public.maintenance_schedules;
CREATE POLICY "Users can delete own maintenance schedules" ON public.maintenance_schedules FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own vehicle reminders" ON public.vehicle_reminders;
CREATE POLICY "Users can view own vehicle reminders" ON public.vehicle_reminders FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own vehicle reminders" ON public.vehicle_reminders;
CREATE POLICY "Users can insert own vehicle reminders" ON public.vehicle_reminders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vehicle reminders" ON public.vehicle_reminders;
CREATE POLICY "Users can update own vehicle reminders" ON public.vehicle_reminders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicle reminders" ON public.vehicle_reminders;
CREATE POLICY "Users can delete own vehicle reminders" ON public.vehicle_reminders FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own vehicle photos" ON public.vehicle_photos;
CREATE POLICY "Users can view own vehicle photos" ON public.vehicle_photos FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own vehicle photos" ON public.vehicle_photos;
CREATE POLICY "Users can insert own vehicle photos" ON public.vehicle_photos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vehicle photos" ON public.vehicle_photos;
CREATE POLICY "Users can update own vehicle photos" ON public.vehicle_photos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicle photos" ON public.vehicle_photos;
CREATE POLICY "Users can delete own vehicle photos" ON public.vehicle_photos FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- PHASE 7: BUY/SELL INTELLIGENCE & ACCESSORIES HUB
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.used_car_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  manufacturing_year INT NOT NULL,
  registration_year INT,
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  odometer_km INT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  rto_code TEXT,
  reg_number_masked TEXT,
  ownership_count INT DEFAULT 1,
  vehicle_condition TEXT DEFAULT 'good' CHECK (vehicle_condition IN ('excellent', 'very_good', 'good', 'fair')),
  asking_price_inr NUMERIC NOT NULL CHECK (asking_price_inr > 0),
  suggested_price_inr NUMERIC,
  price_confidence TEXT DEFAULT 'medium' CHECK (price_confidence IN ('high', 'medium', 'low')),
  description TEXT,
  features TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'sold')),
  is_verified BOOLEAN DEFAULT false,
  service_history_available BOOLEAN DEFAULT false,
  insurance_validity TEXT,
  puc_validity TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.used_car_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.used_car_listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_make_model ON public.used_car_listings(make, model);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.used_car_listings(asking_price_inr);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.used_car_listings(city);

ALTER TABLE public.used_car_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active listings" ON public.used_car_listings;
CREATE POLICY "Public can view active listings" ON public.used_car_listings FOR SELECT USING (status = 'active' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own listings" ON public.used_car_listings;
CREATE POLICY "Users can create their own listings" ON public.used_car_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own listings" ON public.used_car_listings;
CREATE POLICY "Users can update their own listings" ON public.used_car_listings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own listings" ON public.used_car_listings;
CREATE POLICY "Users can delete their own listings" ON public.used_car_listings FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.used_car_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.used_car_listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  offered_price_inr NUMERIC,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'resolved', 'closed')),
  seller_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_buyer ON public.used_car_enquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_seller ON public.used_car_enquiries(seller_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_listing ON public.used_car_enquiries(listing_id);

ALTER TABLE public.used_car_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view enquiries they sent or received" ON public.used_car_enquiries;
CREATE POLICY "Users can view enquiries they sent or received" ON public.used_car_enquiries FOR SELECT TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Buyers can send enquiries" ON public.used_car_enquiries;
CREATE POLICY "Buyers can send enquiries" ON public.used_car_enquiries FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Participants can update enquiries" ON public.used_car_enquiries;
CREATE POLICY "Participants can update enquiries" ON public.used_car_enquiries FOR UPDATE TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = seller_id) WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE TABLE IF NOT EXISTS public.accessories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'interior',
    'exterior',
    'cleaning_detailing',
    'electronics_infotainment',
    'safety_utility',
    'ev_accessories',
    'maintenance_essentials'
  )),
  short_description TEXT NOT NULL,
  indicative_price_inr NUMERIC NOT NULL CHECK (indicative_price_inr > 0),
  image TEXT NOT NULL,
  compatibility_type TEXT DEFAULT 'universal' CHECK (compatibility_type IN ('universal', 'specific')),
  compatible_makes TEXT[] DEFAULT '{}',
  compatible_models TEXT[] DEFAULT '{}',
  installation_difficulty TEXT DEFAULT 'easy_diy' CHECK (installation_difficulty IN ('easy_diy', 'moderate', 'professional_required')),
  is_sample_catalog_data BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_accessories_category ON public.accessories(category);
CREATE INDEX IF NOT EXISTS idx_accessories_compat ON public.accessories(compatibility_type);

ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view accessories" ON public.accessories;
CREATE POLICY "Public can view accessories" ON public.accessories FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.saved_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accessory_id TEXT NOT NULL REFERENCES public.accessories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, accessory_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_accessories_user ON public.saved_accessories(user_id);

ALTER TABLE public.saved_accessories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own saved accessories" ON public.saved_accessories;
CREATE POLICY "Users can manage their own saved accessories" ON public.saved_accessories FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- STORAGE BUCKETS & POLICIES (SUPABASE STORAGE)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('vehicle-documents', 'vehicle-documents', false),
  ('vehicle-photos', 'vehicle-photos', true),
  ('listing-photos', 'listing-photos', true)
ON CONFLICT (id) DO UPDATE 
SET public = EXCLUDED.public;

-- Vehicle Documents (Private per-user bucket)
DROP POLICY IF EXISTS "Users can read own vehicle documents" ON storage.objects;
CREATE POLICY "Users can read own vehicle documents" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'vehicle-documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can upload own vehicle documents" ON storage.objects;
CREATE POLICY "Users can upload own vehicle documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'vehicle-documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update own vehicle documents" ON storage.objects;
CREATE POLICY "Users can update own vehicle documents" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'vehicle-documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete own vehicle documents" ON storage.objects;
CREATE POLICY "Users can delete own vehicle documents" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'vehicle-documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Vehicle Photos & Listing Photos
DROP POLICY IF EXISTS "Users can view vehicle photos" ON storage.objects;
CREATE POLICY "Users can view vehicle photos" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'vehicle-photos');

DROP POLICY IF EXISTS "Users can upload vehicle photos" ON storage.objects;
CREATE POLICY "Users can upload vehicle photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vehicle-photos');

DROP POLICY IF EXISTS "Public can view listing photos" ON storage.objects;
CREATE POLICY "Public can view listing photos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'listing-photos');

DROP POLICY IF EXISTS "Authenticated users can upload listing photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload listing photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'listing-photos');


