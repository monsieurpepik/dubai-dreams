-- Add mortgage and Golden Visa tracking columns to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS mortgage_data JSONB;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS golden_visa_interest BOOLEAN DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS investment_capacity NUMERIC;