import { motion } from 'framer-motion';
import { Waves, TreePine, Building2, Home, TrendingUp } from 'lucide-react';

export type LifestyleFilter = 'all' | 'waterfront' | 'golf' | 'sky' | 'family' | 'investment';

interface LifestyleCollectionsProps {
  activeFilter: LifestyleFilter;
  onFilterChange: (filter: LifestyleFilter) => void;
}

const collections = [
  { 
    id: 'all' as const, 
    label: 'All', 
    icon: null,
    description: 'View all properties'
  },
  { 
    id: 'waterfront' as const, 
    label: 'Waterfront', 
    icon: Waves,
    description: 'Beach, marina & lagoon'
  },
  { 
    id: 'golf' as const, 
    label: 'Golf Living', 
    icon: TreePine,
    description: 'Championship courses'
  },
  { 
    id: 'sky' as const, 
    label: 'Sky Residences', 
    icon: Building2,
    description: 'Penthouses & high floors'
  },
  { 
    id: 'family' as const, 
    label: 'Family Estates', 
    icon: Home,
    description: 'Villas & townhouses'
  },
  { 
    id: 'investment' as const, 
    label: 'Investment Grade', 
    icon: TrendingUp,
    description: 'Highest ROI properties'
  },
];

export const LifestyleCollections = ({ activeFilter, onFilterChange }: LifestyleCollectionsProps) => {
  return (
    <div className="mb-12">
      <span className="label-editorial mb-4 block">Collections</span>
      <div className="flex flex-wrap gap-3">
        {collections.map((collection) => {
          const isActive = activeFilter === collection.id;
          const Icon = collection.icon;
          
          return (
            <motion.button
              key={collection.id}
              onClick={() => onFilterChange(collection.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                group relative flex items-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-[0.15em]
                transition-all duration-300 border
                ${isActive 
                  ? 'bg-foreground text-background border-foreground' 
                  : 'bg-transparent text-muted-foreground border-border hover:border-foreground/50 hover:text-foreground'
                }
              `}
            >
              {Icon && <Icon className="w-4 h-4" strokeWidth={1.5} />}
              {collection.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
