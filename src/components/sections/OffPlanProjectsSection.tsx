import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CleanPropertyGrid } from '@/components/properties/CleanPropertyGrid';
import { SmartSortBar, SortOption } from '@/components/properties/SmartSortBar';

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

  // Sort properties based on active sort - MVP smart sorting only
  const sortedProperties = useMemo(() => {
    const sorted = [...properties];
    
    switch (activeSort) {
      case 'best-value':
        // Best value = highest ROI + payment plan flexibility
        return sorted.sort((a, b) => {
          const aScore = (a.roi_estimate || 0) + (a.payment_plan ? 2 : 0);
          const bScore = (b.roi_estimate || 0) + (b.payment_plan ? 2 : 0);
          return bScore - aScore;
        });
      case 'lowest-entry':
        return sorted.sort((a, b) => a.price_from - b.price_from);
      case 'fastest-delivery':
        return sorted.sort((a, b) => {
          if (!a.completion_date) return 1;
          if (!b.completion_date) return -1;
          return new Date(a.completion_date).getTime() - new Date(b.completion_date).getTime();
        });
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
        {/* Section Header - Apple minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Off-Plan Collection
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Curated developments from Dubai's most trusted developers.
          </p>
        </motion.div>

        {/* Smart Sort Bar - MVP focused */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <SmartSortBar
            activeSort={activeSort}
            onSortChange={setActiveSort}
            propertyCount={sortedProperties.length}
          />
        </motion.div>

        {/* Property Grid */}
        <CleanPropertyGrid properties={sortedProperties} isLoading={isLoading} />
      </div>
    </section>
  );
};
