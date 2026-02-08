import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CleanPropertyCard } from '@/components/properties/CleanPropertyCard';

export function RecentlyAddedSection() {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['recently-added'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, developer:developers(*), property_images(*)')
        .order('created_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || properties.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-background border-t border-border/10">
      <div className="container-wide">
        <h2 className="font-serif text-xl md:text-2xl text-foreground mb-10">
          Recently added
        </h2>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {properties.map((p: any, i: number) => (
            <div key={p.id} className="flex-shrink-0 w-72 md:w-80">
              <CleanPropertyCard property={p} index={i} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
