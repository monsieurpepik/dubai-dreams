import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, Waves, Calendar, Home, Bed } from 'lucide-react';

export type CategoryFilter = 
  | 'all' | 'golden-visa' | 'high-yield' | 'waterfront' 
  | 'handover-2025' | 'studio' | '1br' | '2br' | '3br+';

const categories: { id: CategoryFilter; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: Home },
  { id: 'golden-visa', label: 'Golden Visa', icon: Crown },
  { id: 'high-yield', label: 'High Yield', icon: TrendingUp },
  { id: 'waterfront', label: 'Waterfront', icon: Waves },
  { id: 'handover-2025', label: 'Handover 2025', icon: Calendar },
  { id: 'studio', label: 'Studio', icon: Bed },
  { id: '1br', label: '1 BR', icon: Bed },
  { id: '2br', label: '2 BR', icon: Bed },
  { id: '3br+', label: '3 BR+', icon: Bed },
];

interface CategoryBarProps {
  active: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
}

export const CategoryBar = ({ active, onChange }: CategoryBarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-border/30 sticky top-20 z-30 bg-background/95 backdrop-blur-sm">
      <div className="container-wide">
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto scrollbar-hide py-3 -mx-2 px-2"
        >
          {categories.map((cat) => {
            const isActive = active === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="category-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-foreground"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
