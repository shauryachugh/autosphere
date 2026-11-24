-- Migration: Add editable vehicle economy, monthly usage, and estimated resale value columns
-- Preserves all existing vehicle rows without injecting default economy figures.

ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS claimed_mileage NUMERIC(8, 2),
  ADD COLUMN IF NOT EXISTS actual_mileage NUMERIC(8, 2),
  ADD COLUMN IF NOT EXISTS monthly_km_driven INT,
  ADD COLUMN IF NOT EXISTS estimated_resale_value NUMERIC(12, 2);

-- Remove hardcoded default on avg_efficiency so newly created vehicles without economy data stay empty
ALTER TABLE public.vehicles
  ALTER COLUMN avg_efficiency SET DEFAULT '';
