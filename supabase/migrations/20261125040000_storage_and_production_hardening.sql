-- Migration: 20261125040000_storage_and_production_hardening.sql
-- Description: Production storage bucket setup, private user isolation policies, and database performance hardening

-- ==========================================================
-- 1. STORAGE BUCKETS SETUP
-- ==========================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('vehicle-documents', 'vehicle-documents', false),
  ('vehicle-photos', 'vehicle-photos', true),
  ('listing-photos', 'listing-photos', true)
ON CONFLICT (id) DO UPDATE 
SET public = EXCLUDED.public;

-- ==========================================================
-- 2. STORAGE ROW LEVEL SECURITY POLICIES
-- ==========================================================

-- A. VEHICLE DOCUMENTS (Strict Private Isolation per User)
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

-- B. VEHICLE PHOTOS (Authenticated read & upload)
DROP POLICY IF EXISTS "Users can view vehicle photos" ON storage.objects;
CREATE POLICY "Users can view vehicle photos" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'vehicle-photos');

DROP POLICY IF EXISTS "Users can upload vehicle photos" ON storage.objects;
CREATE POLICY "Users can upload vehicle photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vehicle-photos');

-- C. LISTING PHOTOS (Public read for active marketplace, authenticated upload)
DROP POLICY IF EXISTS "Public can view listing photos" ON storage.objects;
CREATE POLICY "Public can view listing photos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'listing-photos');

DROP POLICY IF EXISTS "Authenticated users can upload listing photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload listing photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'listing-photos');

-- ==========================================================
-- 3. PRODUCTION PERFORMANCE & RLS VERIFICATION
-- ==========================================================
-- Ensure composite index on used_car_listings for query optimization
CREATE INDEX IF NOT EXISTS idx_listings_active_city_price 
ON public.used_car_listings (status, city, asking_price_inr);

-- Ensure composite index on vehicle_documents for fast lookup
CREATE INDEX IF NOT EXISTS idx_vehicle_docs_user_category 
ON public.vehicle_documents (user_id, category);

-- Ensure composite index on maintenance_schedules for health computation
CREATE INDEX IF NOT EXISTS idx_schedules_veh_subsystem_status 
ON public.maintenance_schedules (vehicle_id, subsystem, status);
