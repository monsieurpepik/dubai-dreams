
-- Create article category enum
CREATE TYPE public.article_category AS ENUM ('market_pulse', 'project_analysis', 'area_intelligence', 'investor_playbook');

-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  category article_category NOT NULL DEFAULT 'market_pulse',
  author_name TEXT NOT NULL DEFAULT 'OwningDubai Research',
  author_role TEXT DEFAULT 'Market Intelligence',
  published_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT false,
  reading_time_min INTEGER DEFAULT 5,
  related_property_ids JSONB DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public read for published articles
CREATE POLICY "Published articles are publicly readable"
  ON public.articles
  FOR SELECT
  USING (published_at IS NOT NULL AND published_at <= now());

-- Add updated_at trigger
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
