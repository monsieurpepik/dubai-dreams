import { supabase } from '@/integrations/supabase/client';
import type { Tenant } from '@/types/tenant';
import { DEFAULT_TENANT_SLUG } from '@/types/tenant';

// Map hostnames to tenant slugs
const DOMAIN_TO_SLUG: Record<string, string> = {
  'owningdubai.com': 'dubai',
  'www.owningdubai.com': 'dubai',
  'owningmumbai.com': 'mumbai',
  'www.owningmumbai.com': 'mumbai',
  'owningsaudi.com': 'saudi',
  'www.owningsaudi.com': 'saudi',
  'owningparis.com': 'paris',
  'www.owningparis.com': 'paris',
  'owninglondon.com': 'london',
  'www.owninglondon.com': 'london',
};

/**
 * Detect tenant slug from current hostname
 */
export function detectTenantSlug(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_TENANT_SLUG;
  }

  const hostname = window.location.hostname;
  
  // Check URL params first (for development/preview)
  const urlParams = new URLSearchParams(window.location.search);
  const tenantParam = urlParams.get('tenant');
  if (tenantParam) {
    return tenantParam;
  }

  // Check for known domains
  if (DOMAIN_TO_SLUG[hostname]) {
    return DOMAIN_TO_SLUG[hostname];
  }

  // Check for staging/preview URLs (lovable.app, vercel.app, etc.)
  // These default to Dubai for now
  if (hostname.includes('lovable.app') || 
      hostname.includes('vercel.app') ||
      hostname.includes('netlify.app') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1') {
    // Check localStorage for tenant override in dev
    const storedTenant = localStorage.getItem('owning_tenant_override');
    if (storedTenant) {
      return storedTenant;
    }
    return DEFAULT_TENANT_SLUG;
  }

  // Default fallback
  return DEFAULT_TENANT_SLUG;
}

/**
 * Fetch tenant configuration from database
 */
export async function fetchTenant(slug: string): Promise<Tenant | null> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching tenant:', error);
    return null;
  }

  if (!data) {
    console.warn(`Tenant not found: ${slug}`);
    return null;
  }

  // Type cast the JSONB fields through unknown
  return {
    ...data,
    office_location: data.office_location as unknown as Tenant['office_location'],
    working_hours: data.working_hours as unknown as Tenant['working_hours'],
    residency_program: data.residency_program as unknown as Tenant['residency_program'],
    mortgage_config: data.mortgage_config as unknown as Tenant['mortgage_config'],
    theme: (data.theme as unknown as Tenant['theme']) || {},
    seo_config: (data.seo_config as unknown as Tenant['seo_config']) || {
      title_template: '%s | ' + data.brand_name,
      default_title: data.brand_name,
      default_description: '',
    },
    features: (data.features as unknown as Tenant['features']) || {},
  } as Tenant;
}

/**
 * Fetch tenant by domain
 */
export async function fetchTenantByDomain(domain: string): Promise<Tenant | null> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('domain', domain)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching tenant by domain:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    office_location: data.office_location as unknown as Tenant['office_location'],
    working_hours: data.working_hours as unknown as Tenant['working_hours'],
    residency_program: data.residency_program as unknown as Tenant['residency_program'],
    mortgage_config: data.mortgage_config as unknown as Tenant['mortgage_config'],
    theme: (data.theme as unknown as Tenant['theme']) || {},
    seo_config: (data.seo_config as unknown as Tenant['seo_config']) || {
      title_template: '%s | ' + data.brand_name,
      default_title: data.brand_name,
      default_description: '',
    },
    features: (data.features as unknown as Tenant['features']) || {},
  } as Tenant;
}

/**
 * Set tenant override for development
 */
export function setTenantOverride(slug: string | null): void {
  if (slug) {
    localStorage.setItem('owning_tenant_override', slug);
  } else {
    localStorage.removeItem('owning_tenant_override');
  }
  window.location.reload();
}

/**
 * Get current tenant override
 */
export function getTenantOverride(): string | null {
  return localStorage.getItem('owning_tenant_override');
}
