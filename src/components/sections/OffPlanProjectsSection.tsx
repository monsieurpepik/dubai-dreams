import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CleanPropertyGrid } from '@/components/properties/CleanPropertyGrid';

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

  const editorsPicks = useMemo(() => properties.slice(0, 3), [properties]);

  return (
    <section
      id="properties"
      className="py-28 md:py-36 lg:py-44 bg-background"
    >
      <div className="container-wide">
        {/* Header — sentence case, no animation */}
        <div className="flex items-end justify-between mb-16 md:mb-20">
          <h2 className="font-serif text-foreground">
            Selected works
          </h2>
          <Link
            to="/properties"
            className="hidden md:inline-flex text-xs text-muted-foreground hover:text-foreground transition-opacity duration-300 hover:opacity-70"
          >
            View all
          </Link>
        </div>

        {/* 3 Properties */}
        <CleanPropertyGrid properties={editorsPicks} isLoading={isLoading} />

        {/* Mobile CTA */}
        <div className="text-center mt-16 md:mt-20 md:hidden">
          <Link
            to="/properties"
            className="text-xs text-muted-foreground hover:text-foreground transition-opacity duration-300"
          >
            View all projects
          </Link>
        </div>
      </div>
    </section>
  );
};
