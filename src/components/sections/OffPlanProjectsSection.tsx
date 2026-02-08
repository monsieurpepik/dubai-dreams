import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CleanPropertyGrid } from '@/components/properties/CleanPropertyGrid';

export const OffPlanProjectsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

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

  // Editor's Picks: limit to 6 on homepage
  const editorsPicks = useMemo(() => properties.slice(0, 6), [properties]);

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
          className="flex items-end justify-between mb-16 md:mb-20"
        >
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-accent mb-3">
              Editor's Picks
            </p>
            <h2 className="font-serif text-foreground">
              Off-Plan Collection
            </h2>
          </div>
          <Link
            to="/properties"
            className="hidden md:inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
          >
            View All {properties.length > 0 ? `${properties.length} Projects` : ''}
            <span className="text-lg">→</span>
          </Link>
        </motion.div>

        {/* Property Grid — max 6 */}
        <CleanPropertyGrid properties={editorsPicks} isLoading={isLoading} />

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16 md:mt-20"
        >
          <Link
            to="/properties"
            className="inline-block px-10 py-4 border border-foreground/20 text-foreground text-xs font-medium uppercase tracking-[0.2em] hover:border-foreground hover:bg-foreground/5 transition-all duration-300"
          >
            Explore All Projects
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
