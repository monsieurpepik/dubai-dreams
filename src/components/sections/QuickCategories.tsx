import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Waves, Crown, TrendingUp, Building2, Home, Bed, 
  Sparkles, Calendar, ChevronLeft, ChevronRight 
} from 'lucide-react';

const categories = [
  { id: 'waterfront', label: 'Waterfront', icon: Waves },
  { id: 'golden-visa', label: 'Golden Visa', icon: Crown },
  { id: 'high-yield', label: 'High Yield', icon: TrendingUp },
  { id: 'penthouse', label: 'Penthouse', icon: Building2 },
  { id: 'villa', label: 'Villa', icon: Home },
  { id: 'studio', label: 'Studio', icon: Bed },
  { id: 'new-launch', label: 'New Launch', icon: Sparkles },
  { id: 'handover-2025', label: 'Handover 2025', icon: Calendar },
];

export function QuickCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <section className="border-b border-border/20 bg-background sticky top-16 md:top-20 z-30">
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Left fade + arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-background to-transparent flex items-center justify-start pl-1 opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Scrollable categories */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide py-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isHovered = hoveredId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/properties?collection=${cat.id}`)}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative flex flex-col items-center gap-1.5 min-w-[56px] group shrink-0 pb-2"
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isHovered ? 'text-foreground' : 'text-muted-foreground/60'
                  }`}
                />
                <span
                  className={`text-[11px] whitespace-nowrap transition-colors duration-200 ${
                    isHovered ? 'text-foreground' : 'text-muted-foreground/60'
                  }`}
                >
                  {cat.label}
                </span>
                {/* Underline */}
                {isHovered && (
                  <motion.div
                    layoutId="category-home-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right fade + arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-background to-transparent flex items-center justify-end pr-1 opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </section>
  );
}
