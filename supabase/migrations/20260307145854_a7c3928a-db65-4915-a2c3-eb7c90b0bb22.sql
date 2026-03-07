
DROP POLICY IF EXISTS "Anyone can update their own saved search" ON public.saved_searches;

CREATE POLICY "Saved searches can only be deactivated"
ON public.saved_searches
FOR UPDATE
USING (true)
WITH CHECK (
  is_active = false
  AND email = (SELECT ss.email FROM public.saved_searches ss WHERE ss.id = saved_searches.id)
);
