import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, TreePine, Building2, Home, TrendingUp, SlidersHorizontal, X, ChevronUp } from 'lucide-react';

export type LifestyleFilter = 'all' | 'waterfront' | 'golf' | 'sky' | 'family' | 'investment';
export type SortOption = 'featured' | 'lowest-price' | 'nearest-delivery' | 'premium';

interface FloatingFilterBarProps {
  activeLifestyle: LifestyleFilter;
  activeSort: SortOption;
  onLifestyleChange: (filter: LifestyleFilter) => void;
  onSortChange: (sort: SortOption) => void;
  propertyCount: number;
}

const lifestyleFilters = [
  { id: 'all' as const, label: 'All', icon: null },
  { id: 'waterfront' as const, label: 'Waterfront', icon: Waves },
  { id: 'golf' as const, label: 'Golf', icon: TreePine },
  { id: 'sky' as const, label: 'Sky Living', icon: Building2 },
  { id: 'family' as const, label: 'Family', icon: Home },
  { id: 'investment' as const, label: 'Investment', icon: TrendingUp },
];

const sortOptions = [
  { value: 'featured' as const, label: 'Featured' },
  { value: 'lowest-price' as const, label: 'Lowest Price' },
  { value: 'nearest-delivery' as const, label: 'Soonest Delivery' },
  { value: 'premium' as const, label: 'Premium' },
];

export const FloatingFilterBar = ({
  activeLifestyle,
  activeSort,
  onLifestyleChange,
  onSortChange,
  propertyCount,
}: FloatingFilterBarProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`
          w-full transition-all duration-500 ease-out
          ${isSticky 
            ? 'fixed top-0 left-0 right-0 z-50 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50' 
            : 'relative'
          }
        `}
      >
        <div className={`${isSticky ? 'container-wide' : ''}`}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Lifestyle Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
              {lifestyleFilters.map((filter) => {
                const isActive = activeLifestyle === filter.id;
                const Icon = filter.icon;
                
                return (
                  <motion.button
                    key={filter.id}
                    onClick={() => onLifestyleChange(filter.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative flex items-center gap-2 px-4 py-2.5 rounded-full
                      text-xs font-medium uppercase tracking-wider
                      transition-all duration-300 ease-out whitespace-nowrap
                      ${isActive 
                        ? 'bg-foreground text-background' 
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />}
                    {filter.label}
                    
                    {/* Active Indicator Dot */}
                    {isActive && (
                      <motion.span
                        layoutId="activeLifestyle"
                        className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-accent"
                        style={{ x: '-50%' }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Right Side: Sort & Count */}
            <div className="flex items-center gap-4">
              {/* Property Count */}
              <motion.span
                key={propertyCount}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-muted-foreground whitespace-nowrap"
              >
                {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
              </motion.span>

              {/* Sort Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowSort(!showSort)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full
                    text-xs font-medium uppercase tracking-wider
                    transition-all duration-300
                    ${showSort 
                      ? 'bg-foreground text-background' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                  `}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {sortOptions.find(s => s.value === activeSort)?.label || 'Sort'}
                  </span>
                  <ChevronUp className={`w-3 h-3 transition-transform duration-300 ${showSort ? '' : 'rotate-180'}`} />
                </motion.button>

                {/* Sort Dropdown Menu */}
                <AnimatePresence>
                  {showSort && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setShowSort(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 top-full mt-2 z-50 min-w-[180px] p-2 rounded-2xl bg-card border border-border shadow-2xl"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              onSortChange(option.value);
                              setShowSort(false);
                            }}
                            className={`
                              w-full px-4 py-2.5 text-left text-sm rounded-xl
                              transition-colors duration-200
                              ${activeSort === option.value 
                                ? 'bg-muted text-foreground font-medium' 
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                              }
                            `}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Spacer when sticky */}
      {isSticky && <div className="h-[72px]" />}
    </>
  );
};
