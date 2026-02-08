import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, Map, Columns, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { CleanPropertyGrid } from '@/components/properties/CleanPropertyGrid';
import { SmartSortBar, SortOption } from '@/components/properties/SmartSortBar';
import { PropertyFilters, FilterState, defaultFilters } from '@/components/properties/PropertyFilters';
import { CompareBar } from '@/components/properties/CompareBar';
import { PropertyMap } from '@/components/properties/PropertyMap';
import { CategoryBar, CategoryFilter } from '@/components/properties/CategoryBar';
import { SaveSearchButton } from '@/components/properties/SaveSearchButton';
import { CleanPropertyCard } from '@/components/properties/CleanPropertyCard';
import { useTenant } from '@/hooks/useTenant';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const collectionMeta: Record<string, { title: string; description: string }> = {
  'golden-visa': { title: 'Golden Visa Eligible', description: 'Properties qualifying for 10-year UAE residency' },
  'high-yield': { title: 'High Yield Projects', description: 'Estimated rental returns of 7%+' },
  'handover-2025': { title: 'Handover 2025', description: 'Ready for delivery this year' },
  'waterfront': { title: 'Waterfront Living', description: 'Beachfront and marina properties' },
};

const Properties = () => {
  const { tenant } = useTenant();
  const [searchParams, setSearchParams] = useSearchParams();
  const collection = searchParams.get('collection');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'split'>('grid');
  const [category, setCategory] = useState<CategoryFilter>(
    (collection as CategoryFilter) || 'all'
  );
  const cityName = tenant?.office_location?.city || 'Dubai';

  const handleCategoryChange = (cat: CategoryFilter) => {
    setCategory(cat);
    if (cat === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ collection: cat });
    }
  };

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', sortBy],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*, developer:developers(*), property_images(*)');

      switch (sortBy) {
        case 'lowest-entry': query = query.order('price_from', { ascending: true }); break;
        case 'fastest-delivery': query = query.order('completion_date', { ascending: true, nullsFirst: false }); break;
        case 'best-value': query = query.order('roi_estimate', { ascending: false, nullsFirst: false }); break;
        default: query = query.order('created_at', { ascending: false }); break;
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredProperties = useMemo(() => {
    let result = properties || [];
    const activeFilter = category !== 'all' ? category : collection;

    if (activeFilter) {
      switch (activeFilter) {
        case 'golden-visa':
          result = result.filter(p => p.price_from >= 2000000 || p.golden_visa_eligible);
          break;
        case 'high-yield':
          result = result.filter(p => p.roi_estimate && p.roi_estimate >= 7);
          break;
        case 'handover-2025':
          result = result.filter(p => p.completion_date && new Date(p.completion_date).getFullYear() === 2025);
          break;
        case 'waterfront':
          const waterfrontAreas = ['Dubai Marina', 'Palm Jumeirah', 'Creek Harbour', 'Dubai Harbour', 'Jumeirah Beach', 'Bluewaters'];
          result = result.filter(p =>
            waterfrontAreas.some(a => p.area?.toLowerCase().includes(a.toLowerCase()) || p.location?.toLowerCase().includes(a.toLowerCase()))
          );
          break;
        case 'studio':
          result = result.filter(p => p.bedrooms?.includes(0));
          break;
        case '1br':
          result = result.filter(p => p.bedrooms?.includes(1));
          break;
        case '2br':
          result = result.filter(p => p.bedrooms?.includes(2));
          break;
        case '3br+':
          result = result.filter(p => p.bedrooms?.some((b: number) => b >= 3));
          break;
      }
    }

    if (filters.area !== 'All Areas') {
      result = result.filter(p => p.area === filters.area);
    }
    if (filters.bedrooms !== 'Any') {
      if (filters.bedrooms === '4+') {
        result = result.filter(p => p.bedrooms?.some((b: number) => b >= 4));
      } else if (filters.bedrooms === 'Studio') {
        result = result.filter(p => p.bedrooms?.includes(0));
      } else {
        result = result.filter(p => p.bedrooms?.includes(Number(filters.bedrooms)));
      }
    }
    if (filters.priceRange[0] > 500_000 || filters.priceRange[1] < 50_000_000) {
      result = result.filter(p => p.price_from >= filters.priceRange[0] && p.price_from <= filters.priceRange[1]);
    }
    if (filters.status !== 'All') {
      result = result.filter(p => p.status?.toLowerCase() === filters.status.toLowerCase());
    }

    return result;
  }, [properties, collection, category, filters]);

  const propertyCount = filteredProperties.length;
  const currentCollection = collection && collectionMeta[collection];
  const pageTitle = currentCollection ? currentCollection.title : 'Off-Plan Projects';
  const pageDescription = currentCollection
    ? currentCollection.description
    : `Discover curated off-plan developments in ${cityName}.`;

  const viewButtons = [
    { mode: 'grid' as const, icon: LayoutGrid, label: 'Grid view' },
    { mode: 'split' as const, icon: Columns, label: 'Split view' },
    { mode: 'map' as const, icon: Map, label: 'Map view' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${pageTitle} in ${cityName}`}
        description={pageDescription}
        url={`https://owning${cityName.toLowerCase()}.com/properties${collection ? `?collection=${collection}` : ''}`}
      />
      <Header />
      <main className="pt-20">
        <section className="py-12 md:py-16 border-b border-border/30">
          <div className="container-wide">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {currentCollection && (
                <a href="/properties" className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-3 block hover:text-foreground transition-colors">
                  ← All Projects
                </a>
              )}
              <p className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-3">
                {propertyCount} {propertyCount === 1 ? 'Project' : 'Projects'}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">{pageTitle}</h1>
              {currentCollection && (
                <p className="text-muted-foreground mt-3 max-w-xl">{currentCollection.description}</p>
              )}
            </motion.div>
          </div>
        </section>

        <CategoryBar active={category} onChange={handleCategoryChange} />

        <section className="py-12 md:py-16">
          <div className="container-wide">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <PropertyFilters filters={filters} onChange={setFilters} resultCount={propertyCount} />
                <SaveSearchButton
                  filters={{ ...filters, category }}
                  hasActiveFilters={
                    category !== 'all' ||
                    filters.area !== 'All Areas' ||
                    filters.bedrooms !== 'Any' ||
                    filters.priceRange[0] > 500000 ||
                    filters.priceRange[1] < 50000000 ||
                    filters.status !== 'All'
                  }
                />
              </div>
              <div className="flex items-center gap-1 border border-border/50">
                {viewButtons.map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2 transition-colors ${viewMode === mode ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {viewMode === 'grid' && (
              <>
                <SmartSortBar activeSort={sortBy} onSortChange={setSortBy} propertyCount={propertyCount} />
                <CleanPropertyGrid properties={filteredProperties} isLoading={isLoading} />
              </>
            )}

            {viewMode === 'map' && (
              <PropertyMap properties={filteredProperties} />
            )}

            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="max-h-[80vh] overflow-y-auto space-y-6 pr-2">
                  <SmartSortBar activeSort={sortBy} onSortChange={setSortBy} propertyCount={propertyCount} />
                  {filteredProperties.map((p: any, i: number) => (
                    <CleanPropertyCard key={p.id} property={p} index={i} variant="compact" />
                  ))}
                </div>
                <div className="sticky top-24 h-[80vh]">
                  <PropertyMap properties={filteredProperties} />
                </div>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && propertyCount === 0 && (properties?.length || 0) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
                  <Search className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <p className="text-lg text-foreground font-serif">No properties match your criteria</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Try adjusting your filters or explore our curated collections for inspiration.
                </p>
                <div className="flex gap-3 justify-center pt-4">
                  <button onClick={() => { setFilters(defaultFilters); setCategory('all'); setSearchParams({}); }} className="btn-outline text-xs !px-5 !py-2.5">
                    Clear Filters
                  </button>
                  <Link to="/#collections" className="btn-primary text-xs !px-5 !py-2.5">
                    Browse Collections
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <CompareBar />
    </div>
  );
};

export default Properties;
