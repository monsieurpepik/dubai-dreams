import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight } from 'lucide-react';

export const TrustedDevelopersStrip = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  const { data: developers } = useQuery({
    queryKey: ['developers-strip'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('id, name, logo_url')
        .order('total_projects', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  if (!developers?.length) return null;

  return (
    <section ref={ref} className="py-12 md:py-16 bg-secondary/50 border-y border-border/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-8">
            Projects from Dubai's established developers
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {developers.map((developer, index) => (
              <motion.div
                key={developer.id}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
              <Link to={`/developers/${developer.slug}`}>
                {developer.logo_url ? (
                  <img
                    src={developer.logo_url}
                    alt={developer.name}
                    className="h-8 md:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                  />
                ) : (
                  <span className="inline-block px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50 border border-border/30 rounded-full hover:text-foreground hover:border-foreground/30 transition-all duration-300">
                    {developer.name}
                  </span>
                )}
              </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/developers" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group">
              <span>View all developers</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
