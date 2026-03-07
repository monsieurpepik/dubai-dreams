import { useDisplayCurrency, type DisplayCurrency } from '@/hooks/useDisplayCurrency';

const currencies: { code: DisplayCurrency; label: string; symbol: string }[] = [
  { code: 'AED', label: 'AED', symbol: 'AED' },
  { code: 'USD', label: 'USD', symbol: '$' },
  { code: 'EUR', label: 'EUR', symbol: '€' },
  { code: 'GBP', label: 'GBP', symbol: '£' },
];

export const CurrencySwitcher = () => {
  const { displayCurrency, setDisplayCurrency } = useDisplayCurrency();

  return (
    <select
      value={displayCurrency}
      onChange={(e) => setDisplayCurrency(e.target.value as DisplayCurrency)}
      className="h-8 px-1.5 text-[11px] tracking-wide bg-transparent border border-border/30 text-muted-foreground rounded hover:border-border/60 focus:outline-none transition-colors cursor-pointer"
      aria-label="Currency"
    >
      {currencies.map(c => (
        <option key={c.code} value={c.code}>{c.label}</option>
      ))}
    </select>
  );
};
