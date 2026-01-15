import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { CleanPropertyGrid } from '@/components/properties/CleanPropertyGrid';
import { SmartSortBar } from '@/components/properties/SmartSortBar';
import { useTenant } from '@/hooks/useTenant';
import { useState } from 'react';

import { SortOption } from '@/components/properties/SmartSortBar';

const Properties = () => {
  const { tenant } = useTenant();
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const cityName = tenant?.office_location?.city || 'Dubai';

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', sortBy],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select(`
          *,
          developer:developers(*),
          property_images(*)
        `);

      // Apply sorting
      switch (sortBy) {
        case 'lowest-entry':
          query = query.order('price_from', { ascending: true });
          break;
        case 'fastest-delivery':
          query = query.order('completion_date', { ascending: true, nullsFirst: false });
          break;
        case 'best-value':
          query = query.order('roi_estimate', { ascending: false, nullsFirst: false });
          break;
        case 'featured':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const propertyCount = properties?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`Off-Plan Projects in ${cityName}`}
        description={`Discover curated off-plan developments in ${cityName}. Browse ${propertyCount} projects from trusted developers with flexible payment plans.`}
        url={`https://owning${cityName.toLowerCase()}.com/properties`}
      />
      <Header />
      <main className="pt-20">
        {/* Minimal Header */}
        <section className="py-12 md:py-16 border-b border-border/30">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-3">
                {propertyCount} {propertyCount === 1 ? 'Project' : 'Projects'}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">
                Off-Plan Projects
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Smart Sort + Grid */}
        <section className="py-12 md:py-16">
          <div className="container-wide">
            <SmartSortBar 
              activeSort={sortBy} 
              onSortChange={setSortBy}
              propertyCount={propertyCount}
            />
            
            <CleanPropertyGrid 
              properties={properties || []} 
              isLoading={isLoading} 
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
