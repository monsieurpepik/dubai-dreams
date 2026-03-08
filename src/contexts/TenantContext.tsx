import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Tenant } from '@/types/tenant';
import { DEFAULT_TENANT_SLUG } from '@/types/tenant';
import { detectTenantSlug, fetchTenant } from '@/services/tenantService';
import { formatPrice, formatPriceRange, getCurrencySymbol } from '@/utils/currency';
import { useDisplayCurrency } from '@/hooks/useDisplayCurrency';
import { initGA } from '@/lib/analytics';

interface TenantContextValue {
  tenant: Tenant | null;
  isLoading: boolean;
  error: Error | null;
  
  // Helpers
  formatPrice: (amount: number, options?: { compact?: boolean; showSymbol?: boolean }) => string;
  formatPriceRange: (priceFrom: number, priceTo: number | null, options?: { compact?: boolean }) => string;
  getCurrencySymbol: () => string;
  
  // Feature flags
  hasFeature: (feature: keyof Tenant['features']) => boolean;
  
  // WhatsApp
  getWhatsAppUrl: (message?: string) => string;
  getPropertyWhatsAppUrl: (propertyName: string) => string;
}

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { displayCurrency, formatDisplayPrice } = useDisplayCurrency();

  useEffect(() => {
    async function loadTenant() {
      try {
        setIsLoading(true);
        setError(null);
        
        const slug = detectTenantSlug();
        let tenantData = await fetchTenant(slug);
        
        // Fallback to default tenant if not found
        if (!tenantData && slug !== DEFAULT_TENANT_SLUG) {
          console.warn(`Tenant ${slug} not found, falling back to ${DEFAULT_TENANT_SLUG}`);
          tenantData = await fetchTenant(DEFAULT_TENANT_SLUG);
        }
        
        if (!tenantData) {
          throw new Error('No tenant configuration found');
        }
        
        setTenant(tenantData);
        
        // Apply tenant theme if configured
        applyTenantTheme(tenantData);
        
      } catch (err) {
        console.error('Failed to load tenant:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    loadTenant();
  }, []);

  // Helper functions that use current tenant
  const contextFormatPrice = (amount: number, options?: { compact?: boolean; showSymbol?: boolean }) => {
    // If display currency is not AED, use the display currency formatter
    if (displayCurrency !== 'AED') {
      return formatDisplayPrice(amount, options);
    }
    return formatPrice(amount, tenant, options);
  };

  const contextFormatPriceRange = (priceFrom: number, priceTo: number | null, options?: { compact?: boolean }) => {
    return formatPriceRange(priceFrom, priceTo, tenant, options);
  };

  const contextGetCurrencySymbol = () => {
    return getCurrencySymbol(tenant);
  };

  const hasFeature = (feature: keyof Tenant['features']): boolean => {
    if (!tenant) return false;
    return tenant.features[feature] === true;
  };

  const getWhatsAppUrl = (message?: string): string => {
    if (!tenant?.whatsapp_number) {
      return '#';
    }
    const defaultMessage = `Hi, I'm interested in ${tenant.brand_display} properties.`;
    const msg = message || defaultMessage;
    return `https://wa.me/${tenant.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
  };

  const getPropertyWhatsAppUrl = (propertyName: string): string => {
    const message = `Hi, I'm interested in ${propertyName}. Can you provide more details?`;
    return getWhatsAppUrl(message);
  };

  const value: TenantContextValue = {
    tenant,
    isLoading,
    error,
    formatPrice: contextFormatPrice,
    formatPriceRange: contextFormatPriceRange,
    getCurrencySymbol: contextGetCurrencySymbol,
    hasFeature,
    getWhatsAppUrl,
    getPropertyWhatsAppUrl,
  };

  // Show loading state while fetching tenant
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !tenant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-2">Configuration Error</h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

/**
 * Hook to access tenant context
 */
export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  
  return context;
}

/**
 * Apply tenant-specific theme CSS variables
 */
function applyTenantTheme(tenant: Tenant): void {
  const root = document.documentElement;
  
  // Apply accent color if configured
  if (tenant.theme?.accent_color) {
    // Parse HSL from tenant config
    const hslMatch = tenant.theme.accent_color.match(/hsl\((\d+),?\s*(\d+)%?,?\s*(\d+)%?\)/);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      root.style.setProperty('--tenant-accent', `${h} ${s}% ${l}%`);
    }
  }
  
  // Set document title
  if (tenant.seo_config?.default_title) {
    document.title = tenant.seo_config.default_title;
  }
}
