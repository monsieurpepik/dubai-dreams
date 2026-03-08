import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';

export const ExclusiveSelectionsSection = () => {
  const { formatPrice } = useTenant();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: properties = [] } = useQuery({
    queryKey: ['exclusive-selections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id, name, slug, area, price_from, tagline,
          developer:developers(name),
          property_images(url, is_primary, display_order)
        `)
        .order('created_at', { ascending: false })
        .limit(8);
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
    const cardWidth = el.querySelector('[data-card]')?.clientWidth || 400;
    el.scrollBy({ left: direction === 'right' ? cardWidth + 24 : -(cardWidth + 24), behavior: 'smooth' });
    setTimeout(updateScrollState, 400);
  };

  const getPrimaryImage = (images: any[]) =>
    [...(images || [])]
      .sort((a, b) => (a.is_primary ? -1 : b.is_primary ? 1 : (a.display_order || 0) - (b.display_order || 0)))[0]?.url;

  if (properties.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      {/* Header */}
      <div className="container-wide flex items-end justify-between mb-10 md:mb-14">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-muted-foreground/30 mb-3">
            CURATED FOR YOU
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground font-light">
            Exclusive Selections
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-6 overflow-x-auto scrollbar-hide pl-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] pr-8 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map((property: any, i: number) => {
          const image = getPrimaryImage(property.property_images);
          return (
            <motion.div
              key={property.id}
              data-card
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="shrink-0 w-[300px] md:w-[360px] lg:w-[400px] snap-start"
            >
              <Link to={`/properties/${property.slug}`} className="group block">
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl">
                  {image ? (
                    <img
                      src={image}
                      alt={property.name}
                      className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full aspect-[4/5] bg-muted" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-4 left-4 font-serif text-base text-white">
                    From {formatPrice(property.price_from, { compact: true })}
                  </p>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-1">
                  <p className="text-[10px] tracking-[0.2em] text-muted-foreground/30">
                    {property.developer?.name || 'Developer'}
                  </p>
                  <h3 className="font-serif text-lg text-foreground leading-tight group-hover:text-foreground/60 transition-colors duration-300">
                    {property.name}
                  </h3>
                  <p className="text-xs text-muted-foreground/60">
                    {property.area}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile: View all */}
      <div className="container-wide mt-10 md:hidden text-center">
        <Link
          to="/properties"
          className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          View all projects →
        </Link>
      </div>
    </section>
  );
};
