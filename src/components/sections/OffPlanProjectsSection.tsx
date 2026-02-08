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

  const sortedProperties = useMemo(() => {
    const sorted = [...properties];
    
    switch (activeSort) {
      case 'best-value':
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
      className="relative py-28 md:py-36 lg:py-44 bg-background overflow-hidden"
    >
      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-20"
        >
          <h2 className="font-serif text-foreground mb-4">
            Off-Plan Collection
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Curated developments from Dubai's most trusted developers.
          </p>
        </motion.div>

        {/* Smart Sort Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-12"
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
