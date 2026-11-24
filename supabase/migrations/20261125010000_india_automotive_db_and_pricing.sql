-- ==========================================================
-- PHASE 4: INDIA AUTOMOTIVE DATABASE AND PRICING ENGINE SCHEMA
-- ==========================================================

-- 1. MANUFACTURERS TABLE
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

-- 2. CAR MODELS TABLE
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

-- 3. CAR VARIANTS TABLE
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

-- 4. INDIAN STATES TABLE (28 States + 8 Union Territories)
CREATE TABLE IF NOT EXISTS public.indian_states (
  id TEXT PRIMARY KEY, -- State Code (e.g. 'KA', 'DL', 'MH')
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('state', 'union_territory')),
  capital TEXT NOT NULL,
  rto_code_prefix TEXT NOT NULL,
  gst_state_code TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. INDIAN CITIES TABLE
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

-- 6. STATE RTO RULES TABLE (Configurable Road Tax Slabs)
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

-- 7. FUEL PRICING RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.fuel_pricing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id TEXT NOT NULL REFERENCES public.indian_states(id) ON DELETE CASCADE,
  city_id TEXT REFERENCES public.indian_cities(id) ON DELETE SET NULL,
  petrol_price_per_litre NUMERIC(6, 2) NOT NULL,
  diesel_price_per_litre NUMERIC(6, 2) NOT NULL,
  cng_price_per_kg NUMERIC(6, 2) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. EV CHARGING TARIFFS TABLE
CREATE TABLE IF NOT EXISTS public.ev_charging_tariffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id TEXT NOT NULL REFERENCES public.indian_states(id) ON DELETE CASCADE,
  discom_name TEXT NOT NULL,
  domestic_ac_rate_per_kwh NUMERIC(6, 2) NOT NULL,
  public_dc_fast_rate_per_kwh NUMERIC(6, 2) NOT NULL,
  commercial_fleet_rate_per_kwh NUMERIC(6, 2) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for lightning-fast queries
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

-- POLICIES: Public read access for automotive reference catalogues
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

-- Authenticated write permissions
CREATE POLICY "Auth write manufacturers" ON public.manufacturers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write car models" ON public.car_models FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write car variants" ON public.car_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write indian states" ON public.indian_states FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write indian cities" ON public.indian_cities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write state rto rules" ON public.state_rto_rules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write fuel pricing" ON public.fuel_pricing_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write ev tariffs" ON public.ev_charging_tariffs FOR ALL TO authenticated USING (true) WITH CHECK (true);
