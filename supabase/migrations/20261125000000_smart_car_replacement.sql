-- ==========================================================
-- AUTOSPHERE PHASE 3: SMART CAR REPLACEMENT INTELLIGENCE SCHEMA
-- Migration: 20261125000000_smart_car_replacement.sql
-- ==========================================================

-- 1. CAR CATALOGUE TABLE
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

-- 2. RECOMMENDATION ANALYSES TABLE
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

-- POLICIES FOR CAR CATALOGUE
-- Public read access so anyone (authenticated or anonymous evaluating cars) can view vehicle specs
DROP POLICY IF EXISTS "Public read access to car catalogue" ON public.car_catalogue;
CREATE POLICY "Public read access to car catalogue"
  ON public.car_catalogue FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert car catalogue" ON public.car_catalogue;
CREATE POLICY "Authenticated users can insert car catalogue"
  ON public.car_catalogue FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- POLICIES FOR RECOMMENDATION ANALYSES
-- Strict user isolation: users only see and modify their own analyses
DROP POLICY IF EXISTS "Users can select own analyses" ON public.recommendation_analyses;
CREATE POLICY "Users can select own analyses"
  ON public.recommendation_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own analyses" ON public.recommendation_analyses;
CREATE POLICY "Users can insert own analyses"
  ON public.recommendation_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own analyses" ON public.recommendation_analyses;
CREATE POLICY "Users can update own analyses"
  ON public.recommendation_analyses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own analyses" ON public.recommendation_analyses;
CREATE POLICY "Users can delete own analyses"
  ON public.recommendation_analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
