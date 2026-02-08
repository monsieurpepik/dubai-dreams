import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useTenant } from '@/hooks/useTenant';

export interface FilterState {
  area: string;
  bedrooms: string;
  priceRange: [number, number];
  status: string;
}

const AREAS = [
  'All Areas', 'Al Barari', 'Bluewaters Island', 'Business Bay', 'DAMAC Hills',
  'Dubai Creek Harbour', 'Dubai Harbour', 'La Mer', 'Mohammed Bin Rashid City',
  'Palm Jumeirah', 'Sobha Hartland', 'The Valley',
];

const BEDROOMS = ['Any', 'Studio', '1', '2', '3', '4+'];
const STATUSES = ['All', 'Selling', 'Upcoming'];

const PRICE_MIN = 500_000;
const PRICE_MAX = 50_000_000;

interface PropertyFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

export const PropertyFilters = ({ filters, onChange, resultCount }: PropertyFiltersProps) => {
  const [open, setOpen] = useState(false);
  const { formatPrice } = useTenant();

  const hasActive = filters.area !== 'All Areas' || filters.bedrooms !== 'Any' ||
    filters.priceRange[0] !== PRICE_MIN || filters.priceRange[1] !== PRICE_MAX ||
    filters.status !== 'All';

  const reset = () => onChange({
    area: 'All Areas', bedrooms: 'Any',
    priceRange: [PRICE_MIN, PRICE_MAX], status: 'All',
  });

  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs font-medium uppercase tracking-luxury text-muted-foreground hover:text-foreground transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasActive && (
          <span className="inline-flex items-center justify-center w-5 h-5 bg-foreground text-background text-[10px] rounded-full">
            !
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 pb-4 border-b border-border/30">
              {/* Area */}
              <div>
                <label className="label-editorial mb-2 block">Area</label>
                <select
                  value={filters.area}
                  onChange={e => onChange({ ...filters, area: e.target.value })}
                  className="w-full bg-transparent border border-border/50 text-sm text-foreground py-2 px-3 focus:outline-none focus:border-foreground/30 transition-colors"
                >
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="label-editorial mb-2 block">Bedrooms</label>
                <div className="flex flex-wrap gap-1">
                  {BEDROOMS.map(b => (
                    <button
                      key={b}
                      onClick={() => onChange({ ...filters, bedrooms: b })}
                      className={`px-3 py-2 min-h-[44px] text-xs border transition-colors ${
                        filters.bedrooms === b
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border/50 text-muted-foreground hover:border-foreground/30'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="label-editorial mb-2 block">
                  Price: {formatPrice(filters.priceRange[0], { compact: true })} – {formatPrice(filters.priceRange[1], { compact: true })}
                </label>
                <Slider
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={500_000}
                  value={filters.priceRange}
                  onValueChange={(v) => onChange({ ...filters, priceRange: v as [number, number] })}
                  className="mt-4"
                />
              </div>

              {/* Status */}
              <div>
                <label className="label-editorial mb-2 block">Status</label>
                <div className="flex gap-1">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => onChange({ ...filters, status: s })}
                      className={`px-4 py-2 min-h-[44px] text-xs border transition-colors ${
                        filters.status === s
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border/50 text-muted-foreground hover:border-foreground/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-xs text-muted-foreground">
                {resultCount} {resultCount === 1 ? 'result' : 'results'}
              </span>
              {hasActive && (
                <button onClick={reset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const defaultFilters: FilterState = {
  area: 'All Areas',
  bedrooms: 'Any',
  priceRange: [500_000, 50_000_000],
  status: 'All',
};
