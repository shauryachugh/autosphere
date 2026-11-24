-- ============================================================================
-- AUTOSPHERE PHASE 7: BUY/SELL INTELLIGENCE & ACCESSORIES HUB MIGRATION
-- Migration: 20261125030000_buy_sell_and_accessories.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. USED CAR LISTINGS TABLE
-- ----------------------------------------------------------------------------
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

-- Indexes for search and filters
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.used_car_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.used_car_listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_make_model ON public.used_car_listings(make, model);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.used_car_listings(asking_price_inr);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.used_car_listings(city);

-- RLS for used_car_listings
ALTER TABLE public.used_car_listings ENABLE ROW LEVEL SECURITY;

-- Anyone can read active listings
CREATE POLICY "Public can view active listings"
  ON public.used_car_listings FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

-- Authenticated users can insert their own listings
CREATE POLICY "Users can create their own listings"
  ON public.used_car_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own listings
CREATE POLICY "Users can update their own listings"
  ON public.used_car_listings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete only their own listings
CREATE POLICY "Users can delete their own listings"
  ON public.used_car_listings FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 2. USED CAR SAFE ENQUIRIES TABLE
-- ----------------------------------------------------------------------------
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

-- RLS for used_car_enquiries: strictly private between buyer and seller
ALTER TABLE public.used_car_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view enquiries they sent or received"
  ON public.used_car_enquiries FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can send enquiries"
  ON public.used_car_enquiries FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants can update enquiries"
  ON public.used_car_enquiries FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- ----------------------------------------------------------------------------
-- 3. ACCESSORIES CATALOGUE TABLE
-- ----------------------------------------------------------------------------
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

-- RLS: Public can view catalogue
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view accessories"
  ON public.accessories FOR SELECT
  USING (true);

-- ----------------------------------------------------------------------------
-- 4. SAVED / WISHLIST ACCESSORIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accessory_id TEXT NOT NULL REFERENCES public.accessories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, accessory_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_accessories_user ON public.saved_accessories(user_id);

-- RLS for saved accessories
ALTER TABLE public.saved_accessories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved accessories"
  ON public.saved_accessories FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
