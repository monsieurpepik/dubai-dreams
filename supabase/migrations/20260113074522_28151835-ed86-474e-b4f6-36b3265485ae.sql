-- =============================================
-- PHASE 1: MULTI-TENANT FOUNDATION
-- =============================================

-- 1. Create tenants table with full configuration
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,              -- 'dubai', 'paris', 'saudi'
  domain TEXT UNIQUE NOT NULL,            -- 'owningdubai.com'
  
  -- Brand Configuration
  brand_name TEXT NOT NULL,               -- 'OwningDubai'
  brand_display TEXT NOT NULL,            -- 'Owning Dubai'
  brand_tagline TEXT,                     -- 'The Smartest Entry to Dubai Property'
  
  -- Contact Configuration
  email TEXT NOT NULL,
  whatsapp_number TEXT,
  phone TEXT,
  office_location JSONB,                  -- {area, city, country}
  working_hours JSONB,                    -- {weekdays, weekends}
  
  -- Regional Configuration
  currency_code TEXT NOT NULL DEFAULT 'AED',
  currency_symbol TEXT NOT NULL DEFAULT 'AED',
  currency_locale TEXT DEFAULT 'en-AE',
  country_code TEXT NOT NULL DEFAULT 'AE',
  regulatory_body TEXT,                   -- 'RERA', 'MahaRERA'
  regulatory_number TEXT,                 -- License/registration number
  
  -- Residency Program (optional - null if not applicable)
  residency_program JSONB,                -- {name, threshold, duration, benefits, requirements}
  
  -- Finance/Mortgage Configuration
  mortgage_config JSONB,                  -- {banks: [{name, rate}], max_ltv_resident, max_ltv_nonresident}
  
  -- Theme Configuration
  theme JSONB DEFAULT '{}'::jsonb,        -- {accent_color, hero_image_url, logo_url}
  
  -- SEO Configuration
  seo_config JSONB DEFAULT '{}'::jsonb,   -- {title_template, default_description, og_image_url}
  
  -- Feature Flags
  features JSONB DEFAULT '{}'::jsonb,     -- {has_residency_program, has_mortgage_calc, has_market_data}
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add tenant_id to properties table
ALTER TABLE public.properties 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- 3. Add tenant_id to developers table
ALTER TABLE public.developers 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- 4. Add tenant_id to leads table
ALTER TABLE public.leads 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- 5. Add tenant_id to newsletter_subscribers table
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- 6. Add tenant_id to document_requests table
ALTER TABLE public.document_requests 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- 7. Add tenant_id to area_market_data table
ALTER TABLE public.area_market_data 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- 8. Add tenant_id to property_images table
ALTER TABLE public.property_images 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- 9. Add tenant_id to property_highlights table
ALTER TABLE public.property_highlights 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- =============================================
-- ENABLE RLS ON TENANTS TABLE
-- =============================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- 10. Tenants are publicly readable (for config fetching)
CREATE POLICY "Tenants are publicly readable"
ON public.tenants
FOR SELECT
USING (is_active = true);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_domain ON public.tenants(domain);
CREATE INDEX idx_properties_tenant_id ON public.properties(tenant_id);
CREATE INDEX idx_developers_tenant_id ON public.developers(tenant_id);
CREATE INDEX idx_leads_tenant_id ON public.leads(tenant_id);

-- =============================================
-- UPDATE TRIGGER FOR TENANTS
-- =============================================
CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- SEED DUBAI TENANT
-- =============================================
INSERT INTO public.tenants (
  slug,
  domain,
  brand_name,
  brand_display,
  brand_tagline,
  email,
  whatsapp_number,
  phone,
  office_location,
  working_hours,
  currency_code,
  currency_symbol,
  currency_locale,
  country_code,
  regulatory_body,
  regulatory_number,
  residency_program,
  mortgage_config,
  theme,
  seo_config,
  features
) VALUES (
  'dubai',
  'owningdubai.com',
  'OwningDubai',
  'Owning Dubai',
  'The Smartest Entry to Dubai Real Estate',
  'info@owningdubai.com',
  '+971585939498',
  '+971585939498',
  '{"area": "Business Bay", "city": "Dubai", "country": "United Arab Emirates"}'::jsonb,
  '{"weekdays": "9:00 AM - 6:00 PM", "weekends": "10:00 AM - 4:00 PM", "timezone": "GST"}'::jsonb,
  'AED',
  'AED',
  'en-AE',
  'AE',
  'RERA',
  'ORN: 12345',
  '{
    "name": "UAE Golden Visa",
    "threshold": 2000000,
    "threshold_display": "AED 2,000,000",
    "duration": "10 years",
    "renewable": true,
    "benefits": [
      "Long-term UAE residency for investor and family",
      "No sponsor required",
      "Freedom to live, work, and study in UAE",
      "100% business ownership",
      "Access to UAE banking and services"
    ],
    "requirements": [
      "Property value AED 2M+ (can be off-plan)",
      "Property must be retained for visa duration",
      "Valid passport with 6+ months validity",
      "Health insurance coverage"
    ]
  }'::jsonb,
  '{
    "banks": [
      {"name": "Emirates NBD", "rate": 4.49},
      {"name": "ADCB", "rate": 4.29},
      {"name": "Mashreq", "rate": 4.59},
      {"name": "FAB", "rate": 4.39}
    ],
    "max_ltv_resident": 80,
    "max_ltv_nonresident": 50,
    "max_ltv_offplan": 50,
    "min_salary_aed": 15000
  }'::jsonb,
  '{
    "accent_color": "hsl(45, 93%, 47%)",
    "hero_image_url": null,
    "logo_url": null
  }'::jsonb,
  '{
    "title_template": "%s | Owning Dubai",
    "default_title": "Owning Dubai | Premium Off-Plan Properties",
    "default_description": "The smartest entry point to Dubai real estate. Explore premium off-plan developments with expert guidance.",
    "og_image_url": null
  }'::jsonb,
  '{
    "has_residency_program": true,
    "has_mortgage_calc": true,
    "has_market_data": true,
    "has_experts": true
  }'::jsonb
);

-- =============================================
-- UPDATE EXISTING DATA WITH DUBAI TENANT ID
-- =============================================
UPDATE public.properties SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'dubai');
UPDATE public.developers SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'dubai');
UPDATE public.leads SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'dubai');
UPDATE public.newsletter_subscribers SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'dubai');
UPDATE public.document_requests SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'dubai');
UPDATE public.area_market_data SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'dubai');
UPDATE public.property_images SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'dubai');
UPDATE public.property_highlights SET tenant_id = (SELECT id FROM public.tenants WHERE slug = 'dubai');