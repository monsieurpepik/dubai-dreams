
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view invite by token for acceptance" ON public.merchant_invites;

-- Add scoped policy: authenticated users can only see invites matching their email
CREATE POLICY "Users can view invites for their email"
ON public.merchant_invites
FOR SELECT
TO authenticated
USING (email = auth.email());
