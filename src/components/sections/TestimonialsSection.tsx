import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useRef } from 'react';

const countryFlags: Record<string, string> = {
  'UK': '🇬🇧', 'United Kingdom': '🇬🇧', 'USA': '🇺🇸', 'United States': '🇺🇸',
  'India': '🇮🇳', 'Pakistan': '🇵🇰', 'UAE': '🇦🇪', 'Saudi Arabia': '🇸🇦',
  'Germany': '🇩🇪', 'France': '🇫🇷', 'Canada': '🇨🇦', 'Australia': '🇦🇺',
  'China': '🇨🇳', 'Russia': '🇷🇺', 'Nigeria': '🇳🇬', 'Egypt': '🇪🇬',
  'South Africa': '🇿🇦', 'Brazil': '🇧🇷', 'Lebanon': '🇱🇧', 'Jordan': '🇯🇴',
  'Kuwait': '🇰🇼', 'Bahrain': '🇧🇭', 'Oman': '🇴🇲', 'Qatar': '🇶🇦',
  'Italy': '🇮🇹', 'Spain': '🇪🇸', 'Netherlands': '🇳🇱', 'Sweden': '🇸🇪',
  'Singapore': '🇸🇬', 'Japan': '🇯🇵', 'South Korea': '🇰🇷',
};

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
    <section className="py-28 md:py-36 lg:py-44 bg-secondary/30">
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

      {/* Horizontal scroll on mobile, grid on desktop */}
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
              className="relative min-w-[300px] md:min-w-0 snap-start bg-card border border-border/30 rounded-2xl p-8 md:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Large decorative quote */}
              <span className="text-8xl font-serif text-muted-foreground/15 leading-none select-none absolute top-4 left-6">
                "
              </span>

              <p className="text-base md:text-lg text-foreground leading-relaxed relative z-10 font-light mt-8">
                {t.quote}
              </p>
              
              <footer className="mt-8 pt-6 border-t border-border/30">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {countryFlags[t.country] && `${countryFlags[t.country]} `}{t.country}
                  </span>
                  {t.property_name && (
                    <>
                      <span className="text-border">·</span>
                      <span className="text-xs text-muted-foreground">{t.property_name}</span>
                    </>
                  )}
                </div>
              </footer>
            </motion.blockquote>
          ))
        )}
      </div>
    </section>
  );
};
