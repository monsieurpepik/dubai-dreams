import { useDisplayCurrency, type DisplayCurrency } from '@/hooks/useDisplayCurrency';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useState } from 'react';

const currencies: { code: DisplayCurrency; label: string }[] = [
  { code: 'AED', label: 'AED' },
  { code: 'USD', label: 'USD' },
  { code: 'EUR', label: 'EUR' },
  { code: 'GBP', label: 'GBP' },
];

export const CurrencySwitcher = () => {
  const { displayCurrency, setDisplayCurrency } = useDisplayCurrency();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="text-[11px] tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300 px-1 py-1"
          aria-label="Switch currency"
        >
          {displayCurrency}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-auto min-w-[80px] p-1.5 bg-background/95 backdrop-blur-xl border border-border/40 rounded-lg shadow-lg"
      >
        <div className="flex flex-col">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setDisplayCurrency(c.code);
                setOpen(false);
              }}
              className={`text-[11px] tracking-[0.12em] px-3 py-1.5 text-left rounded-md transition-colors duration-200 ${
                displayCurrency === c.code
                  ? 'text-foreground bg-accent/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
