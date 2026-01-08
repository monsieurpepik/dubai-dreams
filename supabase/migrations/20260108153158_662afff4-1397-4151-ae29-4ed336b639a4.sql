-- Create area market data table for market context
CREATE TABLE public.area_market_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  area TEXT NOT NULL UNIQUE,
  avg_price_sqft NUMERIC NOT NULL,
  trend_12m TEXT NOT NULL CHECK (trend_12m IN ('up', 'flat', 'down')),
  trend_percentage NUMERIC NOT NULL DEFAULT 0,
  offplan_vs_ready_delta NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.area_market_data ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Area market data is publicly readable"
  ON public.area_market_data
  FOR SELECT
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_area_market_data_updated_at
  BEFORE UPDATE ON public.area_market_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();