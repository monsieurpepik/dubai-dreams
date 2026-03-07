
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS rera_permit_number text,
  ADD COLUMN IF NOT EXISTS dld_registration_number text,
  ADD COLUMN IF NOT EXISTS service_charge_sqft numeric,
  ADD COLUMN IF NOT EXISTS size_sqft_from numeric,
  ADD COLUMN IF NOT EXISTS size_sqft_to numeric,
  ADD COLUMN IF NOT EXISTS total_units integer,
  ADD COLUMN IF NOT EXISTS parking_included boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS property_type text DEFAULT 'apartment',
  ADD COLUMN IF NOT EXISTS furnishing_status text DEFAULT 'unfurnished';
