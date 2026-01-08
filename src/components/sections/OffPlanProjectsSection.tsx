import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SmartSortChips, SortOption } from '@/components/properties/SmartSortChips';
import { LuxuryPropertyGrid } from '@/components/properties/LuxuryPropertyGrid';

export const OffPlanProjectsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeSort, setActiveSort] = useState<SortOption>('featured');

  // Fetch properties with images and developers
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          developer:developers(*),
          property_images(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Sort properties based on active sort
  const sortedProperties = useMemo(() => {
    const sorted = [...properties];
    
    switch (activeSort) {
      case 'lowest-price':
        return sorted.sort((a, b) => a.price_from - b.price_from);
      case 'nearest-delivery':
        return sorted.sort((a, b) => {
          if (!a.completion_date) return 1;
          if (!b.completion_date) return -1;
          return new Date(a.completion_date).getTime() - new Date(b.completion_date).getTime();
        });
      case 'premium':
        return sorted.sort((a, b) => b.price_from - a.price_from);
      case 'featured':
      default:
        return sorted;
    }
  }, [properties, activeSort]);

  return (
    <section
      ref={ref}
      id="properties"
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      <div className="container-wide relative z-10">
        {/* Minimal Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
            Collection
          </h2>
          
          {/* Smart Sort Chips */}
          <SmartSortChips 
            activeSort={activeSort} 
            onSortChange={setActiveSort} 
          />
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <span className="text-xs uppercase tracking-luxury text-muted-foreground">
            {sortedProperties.length} Properties
          </span>
        </motion.div>

        {/* Property Grid */}
        <LuxuryPropertyGrid properties={sortedProperties} isLoading={isLoading} />
      </div>
    </section>
  );
};
