import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SmartSortChips, SortOption } from '@/components/properties/SmartSortChips';
import { LuxuryPropertyGrid } from '@/components/properties/LuxuryPropertyGrid';
import { LifestyleCollections, LifestyleFilter } from '@/components/properties/LifestyleCollections';

export const OffPlanProjectsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeSort, setActiveSort] = useState<SortOption>('featured');
  const [activeLifestyle, setActiveLifestyle] = useState<LifestyleFilter>('all');

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

  // Filter by lifestyle collection
  const filteredByLifestyle = useMemo(() => {
    if (activeLifestyle === 'all') return properties;
    
    return properties.filter((property) => {
      const area = property.area?.toLowerCase() || '';
      const features = JSON.stringify(property.features || []).toLowerCase();
      const name = property.name?.toLowerCase() || '';
      
      switch (activeLifestyle) {
        case 'waterfront':
          return area.includes('harbour') || area.includes('beach') || area.includes('marina') || 
                 area.includes('creek') || area.includes('island') || name.includes('beach');
        case 'golf':
          return area.includes('hills') || area.includes('golf') || features.includes('golf');
        case 'sky':
          return name.includes('tower') || name.includes('residences') || features.includes('penthouse');
        case 'family':
          return features.includes('villa') || features.includes('townhouse') || area.includes('villa');
        case 'investment':
          return (property.roi_estimate || 0) >= 7;
        default:
          return true;
      }
    });
  }, [properties, activeLifestyle]);

  // Sort properties based on active sort
  const sortedProperties = useMemo(() => {
    const sorted = [...filteredByLifestyle];
    
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
  }, [filteredByLifestyle, activeSort]);

  return (
    <section
      ref={ref}
      id="properties"
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <span className="label-editorial text-accent mb-4 block">
            Curated Selection
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
            Off-Plan Collection
          </h2>
        </motion.div>

        {/* Lifestyle Collections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <LifestyleCollections 
            activeFilter={activeLifestyle} 
            onFilterChange={setActiveLifestyle} 
          />
        </motion.div>

        {/* Smart Sort Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
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
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {sortedProperties.length} {sortedProperties.length === 1 ? 'Property' : 'Properties'}
          </span>
        </motion.div>

        {/* Property Grid */}
        <LuxuryPropertyGrid properties={sortedProperties} isLoading={isLoading} />
      </div>
    </section>
  );
};
