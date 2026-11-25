-- Migration: Store selected RTO code and RTO/DTO office name on vehicles
ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS rto_code TEXT,
  ADD COLUMN IF NOT EXISTS rto_office TEXT;
