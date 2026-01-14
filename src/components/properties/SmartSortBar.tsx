import { motion } from 'framer-motion';

export type SortOption = 'featured' | 'best-value' | 'lowest-entry' | 'fastest-delivery';

interface SmartSortBarProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  propertyCount: number;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'best-value', label: 'Best Value' },
  { value: 'lowest-entry', label: 'Lowest Entry' },
  { value: 'fastest-delivery', label: 'Fastest Delivery' },
];

export const SmartSortBar = ({
  activeSort,
  onSortChange,
  propertyCount,
}: SmartSortBarProps) => {
  return (
    <div className="flex items-center justify-between gap-6 flex-wrap">
      {/* Sort Pills - Apple style minimal */}
      <div className="flex items-center gap-2">
        {sortOptions.map((option) => {
          const isActive = activeSort === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`
                relative px-4 py-2.5
                text-xs font-medium uppercase tracking-wider
                transition-all duration-300 ease-out
                ${isActive 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {option.label}
              
              {/* Active underline */}
              {isActive && (
                <motion.span
                  layoutId="activeSortUnderline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Property Count */}
      <motion.span
        key={propertyCount}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-muted-foreground"
      >
        {propertyCount} {propertyCount === 1 ? 'project' : 'projects'}
      </motion.span>
    </div>
  );
};
