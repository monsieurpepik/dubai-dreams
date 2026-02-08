
-- Add coordinates to properties for map view
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Property views tracking table
CREATE TABLE public.property_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  session_id TEXT,
  referrer TEXT,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert views (anonymous tracking)
CREATE POLICY "Anyone can insert property views"
ON public.property_views FOR INSERT
WITH CHECK (true);

-- Merchant users can view analytics for their properties
CREATE POLICY "Merchant users can view property analytics"
ON public.property_views FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    JOIN public.merchant_users mu ON mu.developer_id = p.developer_id
    WHERE p.id = property_views.property_id
    AND mu.user_id = auth.uid()
  )
);

-- Index for fast lookups
CREATE INDEX idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX idx_property_views_created_at ON public.property_views(created_at);

-- Email nurture sequences tracking
CREATE TABLE public.email_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  email_number INTEGER NOT NULL DEFAULT 1,
  email_type TEXT NOT NULL DEFAULT 'investment_report',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;

-- Service role only for email sequences (edge function uses service role)
CREATE POLICY "Service role manages email sequences"
ON public.email_sequences FOR ALL
USING (false);

CREATE INDEX idx_email_sequences_status ON public.email_sequences(status, scheduled_at);
CREATE INDEX idx_email_sequences_lead_id ON public.email_sequences(lead_id);
