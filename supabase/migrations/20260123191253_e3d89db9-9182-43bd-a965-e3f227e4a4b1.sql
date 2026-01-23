-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

-- Create merchant_users table (links auth users to developers)
CREATE TABLE public.merchant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    developer_id UUID REFERENCES public.developers(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, developer_id)
);

-- Create merchant_invites table
CREATE TABLE public.merchant_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    developer_id UUID REFERENCES public.developers(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'editor',
    token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add merchant columns to developers table
ALTER TABLE public.developers
ADD COLUMN is_merchant BOOLEAN DEFAULT false,
ADD COLUMN subscription_tier TEXT DEFAULT 'free',
ADD COLUMN onboarded_at TIMESTAMP WITH TIME ZONE;

-- Add tracking columns to properties table
ALTER TABLE public.properties
ADD COLUMN submitted_by UUID REFERENCES auth.users(id),
ADD COLUMN last_edited_by UUID REFERENCES auth.users(id),
ADD COLUMN listing_status TEXT DEFAULT 'published';

-- Add status columns to leads table
ALTER TABLE public.leads
ADD COLUMN claimed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN claimed_by UUID REFERENCES auth.users(id),
ADD COLUMN lead_status TEXT DEFAULT 'new';

-- Enable RLS on new tables
ALTER TABLE public.merchant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_invites ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_merchant_role(_user_id UUID, _developer_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.merchant_users
    WHERE user_id = _user_id
      AND developer_id = _developer_id
      AND role = _role
  )
$$;

-- Function to check if user belongs to a developer (any role)
CREATE OR REPLACE FUNCTION public.user_belongs_to_developer(_user_id UUID, _developer_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.merchant_users
    WHERE user_id = _user_id
      AND developer_id = _developer_id
  )
$$;

-- Function to get user's developer_id
CREATE OR REPLACE FUNCTION public.get_user_developer_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT developer_id
  FROM public.merchant_users
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for merchant_users
CREATE POLICY "Users can view their own merchant memberships"
ON public.merchant_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view team members"
ON public.merchant_users
FOR SELECT
TO authenticated
USING (
  public.has_merchant_role(auth.uid(), developer_id, 'admin')
);

CREATE POLICY "Admins can insert team members"
ON public.merchant_users
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_merchant_role(auth.uid(), developer_id, 'admin')
);

CREATE POLICY "Admins can delete team members"
ON public.merchant_users
FOR DELETE
TO authenticated
USING (
  public.has_merchant_role(auth.uid(), developer_id, 'admin')
  AND user_id != auth.uid()
);

-- RLS Policies for merchant_invites
CREATE POLICY "Admins can view invites for their developer"
ON public.merchant_invites
FOR SELECT
TO authenticated
USING (
  public.has_merchant_role(auth.uid(), developer_id, 'admin')
);

CREATE POLICY "Admins can create invites"
ON public.merchant_invites
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_merchant_role(auth.uid(), developer_id, 'admin')
);

CREATE POLICY "Anyone can view invite by token for acceptance"
ON public.merchant_invites
FOR SELECT
USING (true);

-- Update trigger for merchant_users
CREATE TRIGGER update_merchant_users_updated_at
BEFORE UPDATE ON public.merchant_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();