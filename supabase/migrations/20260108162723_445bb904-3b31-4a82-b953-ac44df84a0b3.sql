-- Add lifestyle tags for collection filtering
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lifestyle_tags TEXT[] DEFAULT '{}';

-- Add document requests table for brochure downloads
CREATE TABLE IF NOT EXISTS public.document_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  document_type TEXT DEFAULT 'brochure',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit document requests
CREATE POLICY "Anyone can insert document requests" 
ON public.document_requests 
FOR INSERT 
WITH CHECK (true);

-- Service role can view document requests
CREATE POLICY "Service role can view document requests" 
ON public.document_requests 
FOR SELECT 
USING (false);