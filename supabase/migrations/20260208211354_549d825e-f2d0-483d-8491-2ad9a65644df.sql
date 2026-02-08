
-- Testimonials table for social proof
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  quote TEXT NOT NULL,
  property_name TEXT,
  rating INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials are publicly readable"
ON public.testimonials FOR SELECT
USING (true);

-- Seed testimonials
INSERT INTO public.testimonials (name, country, quote, property_name, rating, is_featured) VALUES
('Sarah M.', 'United Kingdom', 'The ROI projections were spot-on. My Dubai Marina apartment has appreciated 22% since purchase. The team made the entire process seamless from London.', 'Marina Vista', 5, true),
('Ahmed K.', 'Saudi Arabia', 'As a first-time off-plan investor, I was nervous. Their market analysis and payment plan breakdowns gave me the confidence to commit. Best decision I made.', 'Creek Horizon', 5, true),
('Priya S.', 'India', 'I compared 15 projects across 3 platforms. This was the only one that showed real ROI data and connected me directly with the developer. Closed in 2 weeks.', 'Sobha Verde', 5, true);
