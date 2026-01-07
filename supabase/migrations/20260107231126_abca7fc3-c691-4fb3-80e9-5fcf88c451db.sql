-- Add property_id to leads table for property inquiries
ALTER TABLE public.leads 
ADD COLUMN property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_leads_property ON public.leads(property_id);