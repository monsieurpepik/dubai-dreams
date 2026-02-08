import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
  <div className="space-y-5">
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, j) => (
        <Skeleton key={j} className="w-3.5 h-3.5" />
      ))}
    </div>
    <Skeleton className="h-20 w-full" />
    <div className="pt-2 space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

export const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (!isLoading && !testimonials?.length) return null;

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-background">
      <div className="container-wide">
        <div className="text-center mb-20">
          <h2 className="font-serif text-foreground">
            Trusted by Investors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
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
                className="relative space-y-5"
              >
                {/* Decorative quote mark */}
                <span className="absolute -top-6 -left-2 text-7xl font-serif text-muted/60 select-none pointer-events-none leading-none">"</span>

                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating || 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic relative z-10">
                  "{t.quote}"
                </p>
                <footer className="pt-2">
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {countryFlags[t.country] && `${countryFlags[t.country]} `}{t.country}
                  </p>
                </footer>
              </motion.blockquote>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
