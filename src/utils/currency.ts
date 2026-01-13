import type { Tenant } from '@/types/tenant';

/**
 * Format a price according to tenant's currency configuration
 */
export function formatPrice(
  amount: number,
  tenant: Tenant | null,
  options: {
    compact?: boolean;
    showSymbol?: boolean;
  } = {}
): string {
  const { compact = false, showSymbol = true } = options;
  
  const currencyCode = tenant?.currency_code || 'AED';
  const currencySymbol = tenant?.currency_symbol || 'AED';
  const locale = tenant?.currency_locale || 'en-AE';

  // Indian numbering system for INR
  if (currencyCode === 'INR') {
    return formatIndianPrice(amount, currencySymbol, compact, showSymbol);
  }

  // Standard formatting
  if (compact) {
    return formatCompactPrice(amount, currencySymbol, showSymbol);
  }

  // Full number format
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(amount);

  return showSymbol ? `${currencySymbol} ${formatted}` : formatted;
}

/**
 * Format price in Indian numbering system (lakhs, crores)
 */
function formatIndianPrice(
  amount: number,
  symbol: string,
  compact: boolean,
  showSymbol: boolean
): string {
  if (compact) {
    if (amount >= 10000000) {
      // Crores
      const crores = amount / 10000000;
      const formatted = crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(1);
      return showSymbol ? `₹${formatted} Cr` : `${formatted} Cr`;
    } else if (amount >= 100000) {
      // Lakhs
      const lakhs = amount / 100000;
      const formatted = lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1);
      return showSymbol ? `₹${formatted} L` : `${formatted} L`;
    }
  }

  // Full Indian format
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);

  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Format price in compact notation (M, K)
 */
function formatCompactPrice(
  amount: number,
  symbol: string,
  showSymbol: boolean
): string {
  if (amount >= 1000000) {
    const millions = amount / 1000000;
    const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
    return showSymbol ? `${symbol} ${formatted}M` : `${formatted}M`;
  } else if (amount >= 1000) {
    const thousands = amount / 1000;
    const formatted = thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(0);
    return showSymbol ? `${symbol} ${formatted}K` : `${formatted}K`;
  }

  return showSymbol ? `${symbol} ${amount}` : `${amount}`;
}

/**
 * Format a price range
 */
export function formatPriceRange(
  priceFrom: number,
  priceTo: number | null,
  tenant: Tenant | null,
  options: { compact?: boolean } = {}
): string {
  const { compact = true } = options;

  if (!priceTo || priceFrom === priceTo) {
    return `From ${formatPrice(priceFrom, tenant, { compact })}`;
  }

  const fromFormatted = formatPrice(priceFrom, tenant, { compact, showSymbol: true });
  const toFormatted = formatPrice(priceTo, tenant, { compact, showSymbol: false });

  return `${fromFormatted} - ${toFormatted}`;
}

/**
 * Get currency symbol for tenant
 */
export function getCurrencySymbol(tenant: Tenant | null): string {
  if (!tenant) return 'AED';
  
  // Special handling for certain currencies
  if (tenant.currency_code === 'INR') return '₹';
  if (tenant.currency_code === 'EUR') return '€';
  if (tenant.currency_code === 'GBP') return '£';
  if (tenant.currency_code === 'USD') return '$';
  
  return tenant.currency_symbol;
}
