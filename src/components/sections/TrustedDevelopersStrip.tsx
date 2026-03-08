import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const TrustedDevelopersStrip = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  const { data: developers } = useQuery({
    queryKey: ['developers-strip'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('id, name, logo_url, slug')
        .order('total_projects', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  if (!developers?.length) return null;

  return (
    <section ref={ref} className="py-16 md:py-24 bg-secondary/20 border-y border-border/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="font-serif text-lg md:text-xl tracking-[0.15em] uppercase text-muted-foreground/60 mb-12 md:mb-16">
            Trusted Developers
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 lg:gap-20">
            {developers.map((developer, index) => (
              <motion.div
                key={developer.id}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/developers/${developer.slug}`} className="block">
                  {developer.logo_url ? (
                    <img
                      src={developer.logo_url}
                      alt={developer.name}
                      className="h-10 md:h-14 w-auto opacity-60 hover:opacity-100 transition-opacity duration-500"
                      onError={(e) => {
                        // Hide broken image, show text fallback
                        const target = e.currentTarget;
                        const parent = target.parentElement;
                        target.style.display = 'none';
                        if (parent) {
                          const fallback = document.createElement('span');
                          fallback.className = 'inline-block px-6 py-3 text-sm font-serif tracking-widest uppercase text-background/60 border border-background/30 hover:text-background hover:border-background/60 transition-all duration-500';
                          fallback.textContent = developer.name;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <span className="inline-block px-6 py-3 text-sm font-serif tracking-widest uppercase text-background/60 border border-background/30 hover:text-background hover:border-background/60 transition-all duration-500">
                      {developer.name}
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
