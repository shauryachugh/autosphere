-- ==========================================================
-- PHASE 5: DIGITAL VEHICLE PASSPORT AND HEALTH TRACKER SCHEMA
-- ==========================================================

-- 1. EXTEND VEHICLES TABLE WITH PASSPORT ATTRIBUTES
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS engine_number TEXT,
ADD COLUMN IF NOT EXISTS rto_code TEXT,
ADD COLUMN IF NOT EXISTS previous_owners_count INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'Pearl White',
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';

-- 2. VEHICLE DOCUMENTS TABLE (Digital Document Vault)
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

-- 3. MAINTENANCE SCHEDULES TABLE (Vehicle Health Subsystem Tracker)
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

-- 4. VEHICLE REMINDERS TABLE (Smart In-App Reminders)
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

-- 5. VEHICLE PHOTOS TABLE (Vehicle Passport Gallery)
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

-- POLICIES: Strict user isolation (auth.uid() = user_id)
DROP POLICY IF EXISTS "Users can view own vehicle documents" ON public.vehicle_documents;
CREATE POLICY "Users can view own vehicle documents" ON public.vehicle_documents FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own vehicle documents" ON public.vehicle_documents;
CREATE POLICY "Users can insert own vehicle documents" ON public.vehicle_documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vehicle documents" ON public.vehicle_documents;
CREATE POLICY "Users can update own vehicle documents" ON public.vehicle_documents FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicle documents" ON public.vehicle_documents;
CREATE POLICY "Users can delete own vehicle documents" ON public.vehicle_documents FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Maintenance Schedules Policies
DROP POLICY IF EXISTS "Users can view own maintenance schedules" ON public.maintenance_schedules;
CREATE POLICY "Users can view own maintenance schedules" ON public.maintenance_schedules FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own maintenance schedules" ON public.maintenance_schedules;
CREATE POLICY "Users can insert own maintenance schedules" ON public.maintenance_schedules FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own maintenance schedules" ON public.maintenance_schedules;
CREATE POLICY "Users can update own maintenance schedules" ON public.maintenance_schedules FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own maintenance schedules" ON public.maintenance_schedules;
CREATE POLICY "Users can delete own maintenance schedules" ON public.maintenance_schedules FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Vehicle Reminders Policies
DROP POLICY IF EXISTS "Users can view own vehicle reminders" ON public.vehicle_reminders;
CREATE POLICY "Users can view own vehicle reminders" ON public.vehicle_reminders FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own vehicle reminders" ON public.vehicle_reminders;
CREATE POLICY "Users can insert own vehicle reminders" ON public.vehicle_reminders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vehicle reminders" ON public.vehicle_reminders;
CREATE POLICY "Users can update own vehicle reminders" ON public.vehicle_reminders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicle reminders" ON public.vehicle_reminders;
CREATE POLICY "Users can delete own vehicle reminders" ON public.vehicle_reminders FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Vehicle Photos Policies
DROP POLICY IF EXISTS "Users can view own vehicle photos" ON public.vehicle_photos;
CREATE POLICY "Users can view own vehicle photos" ON public.vehicle_photos FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own vehicle photos" ON public.vehicle_photos;
CREATE POLICY "Users can insert own vehicle photos" ON public.vehicle_photos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vehicle photos" ON public.vehicle_photos;
CREATE POLICY "Users can update own vehicle photos" ON public.vehicle_photos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicle photos" ON public.vehicle_photos;
CREATE POLICY "Users can delete own vehicle photos" ON public.vehicle_photos FOR DELETE TO authenticated USING (auth.uid() = user_id);
