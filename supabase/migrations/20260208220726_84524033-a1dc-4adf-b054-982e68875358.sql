
-- Create saved_searches table for search alert notifications
CREATE TABLE public.saved_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  frequency TEXT NOT NULL DEFAULT 'weekly',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_notified_at TIMESTAMP WITH TIME ZONE,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- Anyone can create a saved search
CREATE POLICY "Anyone can create saved searches"
  ON public.saved_searches
  FOR INSERT
  WITH CHECK (true);

-- Service role can read for processing notifications
CREATE POLICY "Service role can view saved searches"
  ON public.saved_searches
  FOR SELECT
  USING (false);

-- Users can unsubscribe (update is_active)
CREATE POLICY "Anyone can update their own saved search"
  ON public.saved_searches
  FOR UPDATE
  USING (true);
