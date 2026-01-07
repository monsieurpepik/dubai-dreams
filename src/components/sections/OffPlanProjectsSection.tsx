import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { LuxuryPropertyGrid } from '@/components/properties/LuxuryPropertyGrid';
import { SplitText } from '@/components/ui/SplitText';

interface Filters {
  area: string;
  developer: string;
  priceRange: string;
  bedrooms: string;
}

const initialFilters: Filters = {
  area: 'all',
  developer: 'all',
  priceRange: 'all',
  bedrooms: 'all',
};

export const OffPlanProjectsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [filters, setFilters] = useState<Filters>(initialFilters);

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

  // Fetch developers for filter dropdown
  const { data: developers = [] } = useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('slug, name')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Get unique areas from properties
  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(properties.map((p) => p.area))];
    return uniqueAreas.sort();
  }, [properties]);

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Area filter
      if (filters.area !== 'all' && property.area !== filters.area) {
        return false;
      }

      // Developer filter
      if (
        filters.developer !== 'all' &&
        property.developer?.slug !== filters.developer
      ) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const price = property.price_from;
        switch (filters.priceRange) {
          case 'under-1m':
            if (price >= 1000000) return false;
            break;
          case '1m-2m':
            if (price < 1000000 || price >= 2000000) return false;
            break;
          case '2m-5m':
            if (price < 2000000 || price >= 5000000) return false;
            break;
          case '5m-10m':
            if (price < 5000000 || price >= 10000000) return false;
            break;
          case 'above-10m':
            if (price < 10000000) return false;
            break;
        }
      }

      // Bedrooms filter
      if (filters.bedrooms !== 'all') {
        const targetBedroom = parseInt(filters.bedrooms);
        if (targetBedroom === 4) {
          // 4+ bedrooms
          if (!property.bedrooms?.some((b) => b >= 4)) return false;
        } else {
          if (!property.bedrooms?.includes(targetBedroom)) return false;
        }
      }

      return true;
    });
  }, [properties, filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <section
      ref={ref}
      id="off-plan"
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      <div className="container-wide relative z-10">
        {/* Section Header - Editorial Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-luxury mb-6 block">
            Curated Collection
          </span>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            <SplitText delay={100}>Off-Plan Properties</SplitText>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover Dubai's most prestigious off-plan developments from leading
            developers. Secure your investment with flexible payment plans.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-12">
          <PropertyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            areas={areas}
            developers={developers}
          />
        </div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {filteredProperties.length} Properties
          </span>
        </motion.div>

        {/* Luxury Property Grid */}
        <LuxuryPropertyGrid properties={filteredProperties} isLoading={isLoading} />
      </div>
    </section>
  );
};
