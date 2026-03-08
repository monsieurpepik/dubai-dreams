import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Building2, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function TrustBar() {
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true });

  const { data: counts } = useQuery({
    queryKey: ['trust-bar-counts'],
    queryFn: async () => {
      const [devResult, propResult] = await Promise.all([
        supabase.from('developers').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('listing_status', 'published'),
      ]);
      return {
        developers: devResult.count || 0,
        properties: propResult.count || 0,
      };
    },
    staleTime: 60_000,
  });

  const MIN_THRESHOLD = 5;

  const stats = [
    ...(counts && counts.developers >= MIN_THRESHOLD
      ? [{ icon: Building2, value: `${counts.developers}+`, label: 'Verified developers' }]
      : []),
    ...(counts && counts.properties >= MIN_THRESHOLD
      ? [{ icon: TrendingUp, value: `${counts.properties}+`, label: 'Off-plan projects listed' }]
      : []),
    { icon: Users, value: '0%', label: 'Income tax on returns' },
  ];

  return (
    <section ref={ref} className="py-8 md:py-10 border-b border-border/30 bg-muted/30">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <stat.icon className="w-4 h-4 text-muted-foreground/60" strokeWidth={1.5} />
              <span className="font-serif text-lg text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
