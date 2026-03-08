import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { CleanPropertyCard } from '@/components/properties/CleanPropertyCard';

interface CollectionConfig {
  title: string;
  subtitle: string;
  filter: (query: any) => any;
  link: string;
}

const collections: CollectionConfig[] = [
  {
    title: 'Golden Visa Eligible',
    subtitle: 'Qualifying properties for UAE residency',
    filter: (q) => q.eq('golden_visa_eligible', true),
    link: '/properties?collection=golden-visa',
  },
];

const CollectionRow = ({ config, index }: { config: CollectionConfig; index: number }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: properties = [] } = useQuery({
    queryKey: ['collection', config.title],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*, developer:developers(*), property_images(*)')
        .eq('listing_status', 'published')
        .order('created_at', { ascending: false })
        .limit(10);
      
      query = config.filter(query);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('[data-ccard]')?.clientWidth || 340;
    el.scrollBy({ left: direction === 'right' ? cardWidth + 24 : -(cardWidth + 24), behavior: 'smooth' });
    setTimeout(updateScrollState, 400);
  };

  if (properties.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="py-16 md:py-24 overflow-hidden"
    >
      {/* Header */}
      <div className="container-wide flex items-end justify-between mb-8">
        <div>
          <h2 className="font-serif text-xl md:text-2xl text-foreground">
            {config.title}
          </h2>
          <p className="text-xs text-muted-foreground/60 mt-1">{config.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Link
            to={config.link}
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-3"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-5 overflow-x-auto scrollbar-hide pl-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] pr-8 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map((property: any, i: number) => (
          <div
            key={property.id}
            data-ccard
            className="shrink-0 w-[280px] md:w-[320px] lg:w-[340px] snap-start"
          >
            <CleanPropertyCard property={property} index={i} variant="compact" />
          </div>
        ))}
      </div>

      {/* Mobile: View all */}
      <div className="container-wide mt-6 md:hidden">
        <Link
          to={config.link}
          className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          View all {config.title.toLowerCase()} →
        </Link>
      </div>
    </motion.section>
  );
};

export const ThemedCollections = () => {
  return (
    <div className="border-t border-border/30">
      {collections.map((config, i) => (
        <CollectionRow key={config.title} config={config} index={i} />
      ))}
    </div>
  );
};
