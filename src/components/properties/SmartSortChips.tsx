import { motion } from 'framer-motion';

export type SortOption = 'featured' | 'lowest-price' | 'nearest-delivery' | 'premium';

interface SmartSortChipsProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'lowest-price', label: 'Lowest Entry' },
  { value: 'nearest-delivery', label: 'Nearest Delivery' },
  { value: 'premium', label: 'Premium' },
];

export const SmartSortChips = ({ activeSort, onSortChange }: SmartSortChipsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap gap-2"
    >
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.value)}
          className={`
            px-5 py-2.5 text-xs uppercase tracking-luxury transition-all duration-300
            ${activeSort === option.value
              ? 'bg-foreground text-background'
              : 'bg-transparent border border-border/50 text-muted-foreground hover:border-foreground/50 hover:text-foreground'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </motion.div>
  );
};
