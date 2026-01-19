import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { CleanPropertyGrid } from '@/components/properties/CleanPropertyGrid';
import { SmartSortBar } from '@/components/properties/SmartSortBar';
import { useTenant } from '@/hooks/useTenant';
import { useState, useMemo } from 'react';
import { SortOption } from '@/components/properties/SmartSortBar';

// Collection metadata for display
const collectionMeta: Record<string, { title: string; description: string }> = {
  'golden-visa': {
    title: 'Golden Visa Eligible',
    description: 'Properties qualifying for 10-year UAE residency',
  },
  'high-yield': {
    title: 'High Yield Projects',
    description: 'Estimated rental returns of 7%+',
  },
  'handover-2025': {
    title: 'Handover 2025',
    description: 'Ready for delivery this year',
  },
  'waterfront': {
    title: 'Waterfront Living',
    description: 'Beachfront and marina properties',
  },
};

const Properties = () => {
  const { tenant } = useTenant();
  const [searchParams] = useSearchParams();
  const collection = searchParams.get('collection');
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

  // Filter properties based on collection
  const filteredProperties = useMemo(() => {
    if (!properties || !collection) return properties;

    switch (collection) {
      case 'golden-visa':
        // Golden Visa requires AED 2M+ investment
        return properties.filter(p => p.price_from >= 2000000 || p.golden_visa_eligible);
      case 'high-yield':
        // High yield = ROI >= 7%
        return properties.filter(p => p.roi_estimate && p.roi_estimate >= 7);
      case 'handover-2025':
        // Properties completing in 2025
        return properties.filter(p => {
          if (!p.completion_date) return false;
          const year = new Date(p.completion_date).getFullYear();
          return year === 2025;
        });
      case 'waterfront':
        // Waterfront areas in Dubai
        const waterfrontAreas = ['Dubai Marina', 'Palm Jumeirah', 'Creek Harbour', 'Dubai Harbour', 'Jumeirah Beach', 'Bluewaters'];
        return properties.filter(p => 
          waterfrontAreas.some(area => 
            p.area?.toLowerCase().includes(area.toLowerCase()) ||
            p.location?.toLowerCase().includes(area.toLowerCase())
          )
        );
      default:
        return properties;
    }
  }, [properties, collection]);

  const propertyCount = filteredProperties?.length || 0;
  const currentCollection = collection && collectionMeta[collection];

  // Page title based on collection or default
  const pageTitle = currentCollection 
    ? currentCollection.title 
    : 'Off-Plan Projects';
  
  const pageDescription = currentCollection
    ? currentCollection.description
    : `Discover curated off-plan developments in ${cityName}. Browse ${propertyCount} projects from trusted developers with flexible payment plans.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${pageTitle} in ${cityName}`}
        description={pageDescription}
        url={`https://owning${cityName.toLowerCase()}.com/properties${collection ? `?collection=${collection}` : ''}`}
      />
      <Header />
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 md:py-16 border-b border-border/30">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Collection breadcrumb */}
              {currentCollection && (
                <a 
                  href="/properties" 
                  className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-3 block hover:text-foreground transition-colors"
                >
                  ← All Projects
                </a>
              )}
              
              <p className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-3">
                {propertyCount} {propertyCount === 1 ? 'Project' : 'Projects'}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">
                {pageTitle}
              </h1>
              
              {/* Collection description */}
              {currentCollection && (
                <p className="text-muted-foreground mt-3 max-w-xl">
                  {currentCollection.description}
                </p>
              )}
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
              properties={filteredProperties || []} 
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
