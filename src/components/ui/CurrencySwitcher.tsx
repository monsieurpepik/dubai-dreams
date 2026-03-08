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
    <div className="relative group">
      <select
        value={displayCurrency}
        onChange={(e) => setDisplayCurrency(e.target.value as DisplayCurrency)}
        className="appearance-none h-8 pl-3 pr-7 text-[11px] tracking-[0.15em] bg-background/40 backdrop-blur-sm border border-border/30 text-muted-foreground rounded-full hover:border-border/60 hover:bg-background/70 hover:text-foreground focus:outline-none transition-all duration-300 cursor-pointer"
        aria-label="Currency"
      >
        {currencies.map(c => (
          <option key={c.code} value={c.code}>{c.label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};
