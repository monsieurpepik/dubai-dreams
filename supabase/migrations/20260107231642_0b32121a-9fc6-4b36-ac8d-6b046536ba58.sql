-- Add luxury presentation fields to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS lifestyle_description TEXT,
ADD COLUMN IF NOT EXISTS architect TEXT,
ADD COLUMN IF NOT EXISTS view_type TEXT[],
ADD COLUMN IF NOT EXISTS exclusive_amenities JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT,
ADD COLUMN IF NOT EXISTS brochure_url TEXT;

-- Create property_highlights table for premium amenity showcasing
CREATE TABLE IF NOT EXISTS public.property_highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on property_highlights
ALTER TABLE public.property_highlights ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Property highlights are publicly readable" 
ON public.property_highlights 
FOR SELECT 
USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_property_highlights_property_id 
ON public.property_highlights(property_id);

-- Add index for view_type array queries
CREATE INDEX IF NOT EXISTS idx_properties_view_type 
ON public.properties USING GIN(view_type);