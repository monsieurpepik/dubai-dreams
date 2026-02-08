import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CleanPropertyCard } from '@/components/properties/CleanPropertyCard';
import { PropertyGridSkeleton } from '@/components/properties/PropertyCardSkeleton';

export const OffPlanProjectsSection = () => {
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

  const editorsPicks = useMemo(() => properties.slice(0, 6), [properties]);
  const totalCount = properties.length;

  return (
    <section
      id="properties"
      className="py-28 md:py-36 lg:py-44 bg-background"
    >
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-end justify-between mb-16 md:mb-20">
          <h2 className="font-serif text-foreground">
            Selected works
          </h2>
          <Link
            to="/properties"
            className="hidden md:inline-flex text-xs text-muted-foreground hover:text-foreground transition-opacity duration-300 hover:opacity-70"
          >
            {editorsPicks.length} of {totalCount} projects · View all
          </Link>
        </div>

        {/* Asymmetric Editorial Grid */}
        {isLoading ? (
          <PropertyGridSkeleton />
        ) : editorsPicks.length > 0 ? (
          <div className="space-y-8">
            {/* Row 1: 2 large featured cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {editorsPicks.slice(0, 2).map((p: any, i: number) => (
                <CleanPropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
            {/* Row 2: 4 smaller cards */}
            {editorsPicks.length > 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {editorsPicks.slice(2, 6).map((p: any, i: number) => (
                  <CleanPropertyCard key={p.id} property={p} index={i + 2} variant="compact" />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Mobile CTA */}
        <div className="text-center mt-16 md:mt-20 md:hidden">
          <Link
            to="/properties"
            className="text-xs text-muted-foreground hover:text-foreground transition-opacity duration-300"
          >
            {editorsPicks.length} of {totalCount} · View all projects
          </Link>
        </div>
      </div>
    </section>
  );
};
