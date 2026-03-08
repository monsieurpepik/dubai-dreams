import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useRef } from 'react';

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const TestimonialSkeleton = () => (
  <div className="min-w-[320px] md:min-w-[400px] space-y-5 p-8">
    <Skeleton className="h-24 w-full" />
    <div className="pt-2 space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

export const TestimonialsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  if (!isLoading && !testimonials?.length) return null;

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container-wide mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-serif text-foreground">
            Trusted by Investors
          </h2>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible scrollbar-hide px-6 md:px-0 md:container-wide snap-x snap-mandatory"
      >
        {isLoading ? (
          <>
            <TestimonialSkeleton />
            <TestimonialSkeleton />
            <TestimonialSkeleton />
          </>
        ) : (
          testimonials?.map((t, i) => (
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-w-[300px] md:min-w-0 snap-start p-8 md:p-10 flex flex-col justify-between"
            >
              <p className="text-base md:text-lg text-foreground leading-relaxed font-light italic">
                "{t.quote}"
              </p>
              
              <footer className="mt-8 pt-6 border-t border-border/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-[11px] font-medium text-muted-foreground tracking-wide shrink-0">
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.country}
                    {t.property_name && ` · ${t.property_name}`}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))
        )}
      </div>
    </section>
  );
};
