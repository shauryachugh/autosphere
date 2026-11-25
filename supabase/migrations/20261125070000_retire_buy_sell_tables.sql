-- Migration: Safely retire obsolete Buy & Sell database tables
-- Checks dependencies and row counts before dropping so genuine user data is never blindly wiped.
-- Preserves accessories and saved_accessories tables.

DO $$
BEGIN
  IF to_regclass('public.used_car_enquiries') IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.used_car_enquiries LIMIT 1) THEN
      DROP TABLE public.used_car_enquiries;
    END IF;
  END IF;

  IF to_regclass('public.used_car_listings') IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.used_car_listings LIMIT 1) THEN
      DROP TABLE public.used_car_listings;
    END IF;
  END IF;
END $$;
