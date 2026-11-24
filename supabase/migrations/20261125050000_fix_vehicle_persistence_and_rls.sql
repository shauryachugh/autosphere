-- Migration: 20261125050000_fix_vehicle_persistence_and_rls.sql
-- Description: Hardening vehicle persistence, indexing, and Row Level Security policies

-- 1. Ensure RLS is active on public.vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- 2. Idempotent Policy definitions for public.vehicles
DROP POLICY IF EXISTS "Users can select own vehicles" ON public.vehicles;
CREATE POLICY "Users can select own vehicles" 
ON public.vehicles FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own vehicles" ON public.vehicles;
CREATE POLICY "Users can insert own vehicles" 
ON public.vehicles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vehicles" ON public.vehicles;
CREATE POLICY "Users can update own vehicles" 
ON public.vehicles FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicles" ON public.vehicles;
CREATE POLICY "Users can delete own vehicles" 
ON public.vehicles FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 3. Composite Indexes for performant vehicle retrieval by authenticated user
CREATE INDEX IF NOT EXISTS idx_vehicles_user_created 
ON public.vehicles (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vehicles_user_primary 
ON public.vehicles (user_id, is_primary);
