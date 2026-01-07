-- Create developers table
CREATE TABLE public.developers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  total_projects INTEGER DEFAULT 0,
  years_active INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  community TEXT,
  price_from NUMERIC NOT NULL,
  price_to NUMERIC,
  bedrooms INTEGER[] DEFAULT ARRAY[1,2,3],
  completion_date DATE,
  payment_plan TEXT,
  roi_estimate NUMERIC,
  golden_visa_eligible BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'selling' CHECK (status IN ('upcoming', 'selling', 'sold_out')),
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property_images table
CREATE TABLE public.property_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Developers are publicly readable" ON public.developers FOR SELECT USING (true);
CREATE POLICY "Properties are publicly readable" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Property images are publicly readable" ON public.property_images FOR SELECT USING (true);

-- Create indexes
CREATE INDEX idx_properties_developer ON public.properties(developer_id);
CREATE INDEX idx_properties_area ON public.properties(area);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_price ON public.properties(price_from);
CREATE INDEX idx_property_images_property ON public.property_images(property_id);

-- Trigger for updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed developers
INSERT INTO public.developers (name, slug, logo_url, description, total_projects, years_active) VALUES
('Emaar Properties', 'emaar', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'Dubai''s largest developer, creators of Burj Khalifa and Dubai Mall', 60, 27),
('DAMAC Properties', 'damac', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'Luxury developer known for branded residences', 45, 22),
('Nakheel', 'nakheel', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'Creators of Palm Jumeirah and The World Islands', 35, 23),
('Sobha Realty', 'sobha', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'Premium quality construction and finishing', 25, 18),
('Meraas', 'meraas', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'Lifestyle destinations and urban experiences', 20, 15);

-- Seed properties
INSERT INTO public.properties (name, slug, developer_id, location, area, community, price_from, price_to, bedrooms, completion_date, payment_plan, roi_estimate, golden_visa_eligible, status, description, features) VALUES
('The Oasis', 'the-oasis', (SELECT id FROM public.developers WHERE slug = 'emaar'), 'Dubai', 'Al Barari', 'The Oasis by Emaar', 15000000, 50000000, ARRAY[4,5,6], '2027-12-01', '60/40', 6.5, true, 'selling', 'Ultra-luxury villas in a lush green sanctuary', '["Private Pool", "Smart Home", "Golf Course View", "Concierge"]'::jsonb),
('Beachfront Living', 'beachfront-living', (SELECT id FROM public.developers WHERE slug = 'emaar'), 'Dubai', 'Dubai Harbour', 'Emaar Beachfront', 2400000, 8500000, ARRAY[1,2,3,4], '2026-06-01', '70/30', 7.2, true, 'selling', 'Beachfront apartments with stunning marina views', '["Beach Access", "Infinity Pool", "Gym", "Spa"]'::jsonb),
('Creek Waters', 'creek-waters', (SELECT id FROM public.developers WHERE slug = 'emaar'), 'Dubai', 'Dubai Creek Harbour', 'Creek Waters', 1200000, 4500000, ARRAY[1,2,3], '2026-09-01', '80/20', 7.8, true, 'selling', 'Waterfront living at Dubai Creek with Downtown views', '["Creek View", "Rooftop Pool", "Kids Play Area", "Retail"]'::jsonb),
('DAMAC Lagoons', 'damac-lagoons', (SELECT id FROM public.developers WHERE slug = 'damac'), 'Dubai', 'DAMAC Hills', 'DAMAC Lagoons', 1800000, 6000000, ARRAY[3,4,5], '2026-03-01', '60/40', 6.8, true, 'selling', 'Mediterranean-inspired townhouses with lagoon access', '["Private Lagoon", "Crystal Lagoon", "Beach Club", "Water Sports"]'::jsonb),
('Safa Two', 'safa-two', (SELECT id FROM public.developers WHERE slug = 'damac'), 'Dubai', 'Business Bay', 'Safa Park', 3500000, 15000000, ARRAY[2,3,4], '2027-06-01', '50/50', 5.9, true, 'upcoming', 'Super-tall tower with de Grisogono interiors', '["Branded Residences", "Sky Lounge", "Private Cinema", "Valet"]'::jsonb),
('Palm Beach Towers', 'palm-beach-towers', (SELECT id FROM public.developers WHERE slug = 'nakheel'), 'Dubai', 'Palm Jumeirah', 'Palm Beach Towers', 2800000, 12000000, ARRAY[1,2,3,4], '2025-12-01', '70/30', 7.5, true, 'selling', 'Beachfront apartments on the iconic Palm Jumeirah', '["Private Beach", "Infinity Pool", "Fine Dining", "Spa"]'::jsonb),
('Como Residences', 'como-residences', (SELECT id FROM public.developers WHERE slug = 'nakheel'), 'Dubai', 'Palm Jumeirah', 'Como Residences', 21000000, 65000000, ARRAY[4,5,6], '2027-09-01', '40/60', 5.5, true, 'upcoming', 'Ultra-luxury penthouses on Palm Jumeirah frond tip', '["Private Pool", "Butler Service", "Helipad Access", "Yacht Berth"]'::jsonb),
('Sobha Hartland II', 'sobha-hartland-ii', (SELECT id FROM public.developers WHERE slug = 'sobha'), 'Dubai', 'Mohammed Bin Rashid City', 'Sobha Hartland', 1100000, 3800000, ARRAY[1,2,3], '2026-06-01', '80/20', 8.1, true, 'selling', 'Premium apartments in a green urban community', '["Lagoon View", "Premium Finishes", "Green Spaces", "Retail"]'::jsonb),
('Sobha One', 'sobha-one', (SELECT id FROM public.developers WHERE slug = 'sobha'), 'Dubai', 'Sobha Hartland', 'Sobha Hartland', 1500000, 4200000, ARRAY[1,2,3], '2026-12-01', '70/30', 7.4, true, 'selling', 'Twin tower development with skybridge', '["Skybridge", "Sky Pool", "Observatory", "Concierge"]'::jsonb),
('Bluewaters Residences', 'bluewaters-residences', (SELECT id FROM public.developers WHERE slug = 'meraas'), 'Dubai', 'Bluewaters Island', 'Bluewaters', 3200000, 9500000, ARRAY[1,2,3,4], '2025-06-01', '100% Ready', 0, true, 'selling', 'Island living next to Ain Dubai observation wheel', '["Island Living", "Ain Dubai View", "Beach Club", "Retail"]'::jsonb),
('Port de La Mer', 'port-de-la-mer', (SELECT id FROM public.developers WHERE slug = 'meraas'), 'Dubai', 'La Mer', 'Port de La Mer', 2100000, 7800000, ARRAY[1,2,3,4], '2025-09-01', '100% Ready', 0, true, 'selling', 'Mediterranean-inspired waterfront living', '["Marina Access", "Yacht Club", "Beach", "Fine Dining"]'::jsonb),
('The Valley', 'the-valley', (SELECT id FROM public.developers WHERE slug = 'emaar'), 'Dubai', 'The Valley', 'The Valley', 950000, 2200000, ARRAY[3,4], '2026-03-01', '80/20', 8.5, false, 'selling', 'Family-focused community with town squares', '["Town Square", "Sports Hub", "Parks", "Schools"]'::jsonb);

-- Seed property images
INSERT INTO public.property_images (property_id, url, alt_text, is_primary, display_order) 
SELECT p.id, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'Luxury villa exterior', true, 0 FROM public.properties p WHERE p.slug = 'the-oasis'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Villa pool', false, 1 FROM public.properties p WHERE p.slug = 'the-oasis'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Villa interior', false, 2 FROM public.properties p WHERE p.slug = 'the-oasis'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'Beachfront apartment', true, 0 FROM public.properties p WHERE p.slug = 'beachfront-living'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'Living room', false, 1 FROM public.properties p WHERE p.slug = 'beachfront-living'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'Kitchen', false, 2 FROM public.properties p WHERE p.slug = 'beachfront-living'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'Creek view apartment', true, 0 FROM public.properties p WHERE p.slug = 'creek-waters'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'Modern interior', false, 1 FROM public.properties p WHERE p.slug = 'creek-waters'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Lagoon townhouse', true, 0 FROM public.properties p WHERE p.slug = 'damac-lagoons'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 'Pool area', false, 1 FROM public.properties p WHERE p.slug = 'damac-lagoons'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'Safa Two tower', true, 0 FROM public.properties p WHERE p.slug = 'safa-two'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800', 'Luxury interior', false, 1 FROM public.properties p WHERE p.slug = 'safa-two'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', 'Palm beach view', true, 0 FROM public.properties p WHERE p.slug = 'palm-beach-towers'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', 'Beachfront pool', false, 1 FROM public.properties p WHERE p.slug = 'palm-beach-towers'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Como penthouse', true, 0 FROM public.properties p WHERE p.slug = 'como-residences'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', 'Private pool', false, 1 FROM public.properties p WHERE p.slug = 'como-residences'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800', 'Hartland apartments', true, 0 FROM public.properties p WHERE p.slug = 'sobha-hartland-ii'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', 'Green spaces', false, 1 FROM public.properties p WHERE p.slug = 'sobha-hartland-ii'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'Sobha One towers', true, 0 FROM public.properties p WHERE p.slug = 'sobha-one'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800', 'Sky pool', false, 1 FROM public.properties p WHERE p.slug = 'sobha-one'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'Bluewaters view', true, 0 FROM public.properties p WHERE p.slug = 'bluewaters-residences'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800', 'Ain Dubai', false, 1 FROM public.properties p WHERE p.slug = 'bluewaters-residences'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800', 'Port de La Mer', true, 0 FROM public.properties p WHERE p.slug = 'port-de-la-mer'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', 'Marina view', false, 1 FROM public.properties p WHERE p.slug = 'port-de-la-mer'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'The Valley homes', true, 0 FROM public.properties p WHERE p.slug = 'the-valley'
UNION ALL SELECT p.id, 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800', 'Community park', false, 1 FROM public.properties p WHERE p.slug = 'the-valley';