import { useState, useEffect, createContext, useContext } from 'react';

export type DisplayCurrency = 'AED' | 'USD' | 'EUR' | 'GBP';

// Approximate conversion rates from AED
const CONVERSION_RATES: Record<DisplayCurrency, number> = {
  AED: 1,
  USD: 0.2723,
  EUR: 0.2512,
  GBP: 0.2153,
};

const SYMBOLS: Record<DisplayCurrency, string> = {
  AED: 'AED',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const STORAGE_KEY = 'display-currency';

export function useDisplayCurrency() {
  const [displayCurrency, setDisplayCurrencyState] = useState<DisplayCurrency>(() => {
    if (typeof window === 'undefined') return 'AED';
    return (localStorage.getItem(STORAGE_KEY) as DisplayCurrency) || 'AED';
  });

  const setDisplayCurrency = (currency: DisplayCurrency) => {
    setDisplayCurrencyState(currency);
    localStorage.setItem(STORAGE_KEY, currency);
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent('currency-change', { detail: currency }));
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const currency = (e as CustomEvent).detail as DisplayCurrency;
      setDisplayCurrencyState(currency);
    };
    window.addEventListener('currency-change', handler);
    return () => window.removeEventListener('currency-change', handler);
  }, []);

  const convertPrice = (aedAmount: number): number => {
    return aedAmount * CONVERSION_RATES[displayCurrency];
  };

  const formatDisplayPrice = (aedAmount: number, options?: { compact?: boolean }): string => {
    const converted = convertPrice(aedAmount);
    const symbol = SYMBOLS[displayCurrency];
    const compact = options?.compact ?? false;

    if (compact) {
      if (converted >= 1000000) {
        const m = converted / 1000000;
        return `${symbol} ${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
      } else if (converted >= 1000) {
        const k = converted / 1000;
        return `${symbol} ${k.toFixed(0)}K`;
      }
      return `${symbol} ${Math.round(converted)}`;
    }

    const formatted = new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(converted);
    return `${symbol} ${formatted}`;
  };

  return {
    displayCurrency,
    setDisplayCurrency,
    convertPrice,
    formatDisplayPrice,
  };
}
