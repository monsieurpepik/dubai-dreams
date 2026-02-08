// Tenant type definitions for multi-tenant Owning platform

export interface TenantOfficeLocation {
  area: string;
  city: string;
  country: string;
}

export interface TenantWorkingHours {
  weekdays: string;
  weekends: string;
  timezone?: string;
}

export interface TenantResidencyProgram {
  name: string;
  threshold: number;
  threshold_display: string;
  duration: string;
  renewable?: boolean;
  benefits: string[];
  requirements: string[];
}

export interface TenantBank {
  name: string;
  rate: number;
}

export interface TenantMortgageConfig {
  banks: TenantBank[];
  max_ltv_resident: number;
  max_ltv_nonresident: number;
  max_ltv_offplan?: number;
  min_salary_aed?: number;
}

export interface TenantSocialLinks {
  instagram?: string | null;
  facebook?: string | null;
  x?: string | null;
  linkedin?: string | null;
}

export interface TenantTheme {
  accent_color?: string;
  hero_image_url?: string | null;
  logo_url?: string | null;
}

export interface TenantSeoConfig {
  title_template: string;
  default_title: string;
  default_description: string;
  og_image_url?: string | null;
}

export interface TenantFeatures {
  has_residency_program?: boolean;
  has_mortgage_calc?: boolean;
  has_market_data?: boolean;
  has_experts?: boolean;
}

export interface Tenant {
  id: string;
  slug: string;
  domain: string;
  
  // Brand
  brand_name: string;
  brand_display: string;
  brand_tagline: string | null;
  
  // Contact
  email: string;
  whatsapp_number: string | null;
  phone: string | null;
  office_location: TenantOfficeLocation | null;
  working_hours: TenantWorkingHours | null;
  
  // Regional
  currency_code: string;
  currency_symbol: string;
  currency_locale: string;
  country_code: string;
  regulatory_body: string | null;
  regulatory_number: string | null;
  
  // Residency Program (optional)
  residency_program: TenantResidencyProgram | null;
  
  // Mortgage
  mortgage_config: TenantMortgageConfig | null;
  
  // Theme
  theme: TenantTheme;
  
  // SEO
  seo_config: TenantSeoConfig;
  
  // Features
  features: TenantFeatures;
  
  // Social
  social_links: TenantSocialLinks | null;
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Default tenant configuration (Dubai fallback)
export const DEFAULT_TENANT_SLUG = 'dubai';
