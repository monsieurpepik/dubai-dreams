-- Create newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  interests TEXT[] DEFAULT '{}',
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  source TEXT DEFAULT 'website'
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (insert)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (true);

-- Only service role can view subscribers (for admin/email campaigns)
CREATE POLICY "Service role can view subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (false);

-- Add index for email lookups
CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);

-- Add index for active subscribers
CREATE INDEX idx_newsletter_active ON public.newsletter_subscribers(is_active) WHERE is_active = true;