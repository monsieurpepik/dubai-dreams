import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import heroImage from '@/assets/hero-dubai-skyline.jpeg';

export function HeroSection() {
  const { tenant, formatPrice } = useTenant();
  const [activeIndex, setActiveIndex] = useState(0);

  const cityName = tenant?.office_location?.city || 'Dubai';
  const backgroundImage = tenant?.theme?.hero_image_url || heroImage;

  const { data: featuredProperties = [] } = useQuery({
    queryKey: ['hero-featured-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id, name, slug, area, price_from,
          developer:developers(name),
          property_images(url, is_primary, display_order)
        `)
        .order('created_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data || [];
    },
  });

  const activeProperty = featuredProperties[activeIndex] || null;

  const primaryImage = activeProperty
    ? [...(activeProperty.property_images || [])]
        .sort((a: any, b: any) => (a.is_primary ? -1 : b.is_primary ? 1 : (a.display_order || 0) - (b.display_order || 0)))[0]?.url
    : null;

  const goNext = useCallback(() => {
    if (featuredProperties.length === 0) return;
    setActiveIndex((i) => (i + 1) % featuredProperties.length);
  }, [featuredProperties.length]);

  const goPrev = useCallback(() => {
    if (featuredProperties.length === 0) return;
    setActiveIndex((i) => (i === 0 ? featuredProperties.length - 1 : i - 1));
  }, [featuredProperties.length]);

  // Auto-advance every 5s
  useEffect(() => {
    if (featuredProperties.length <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext, featuredProperties.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col">
      {/* Background — Ken Burns */}
      <div className="absolute inset-0">
        <motion.img
          src={backgroundImage}
          alt={`${cityName} skyline`}
          className="h-full w-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 40, ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
      </div>

      {/* Content — bottom-aligned */}
      <div className="relative z-10 flex-1 flex items-end">
        <div className="container-wide w-full pb-20 md:pb-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
            {/* Left — Headline */}
            <div className="flex-1 max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-[10px] tracking-[0.35em] text-white/60 mb-6"
              >
                OFF-PLAN PROPERTIES
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-light leading-[1.1] tracking-wide"
              >
                {cityName}'s Premier
                <br />
                Off-Plan Platform
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-5 text-sm md:text-base text-white/60 font-light max-w-lg leading-relaxed"
              >
                Curated investment-grade projects from {cityName}'s most trusted developers
              </motion.p>
            </div>

            {/* Right — Floating Property Card */}
            {activeProperty && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="w-full md:w-[340px] lg:w-[380px] shrink-0"
              >
                <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] rounded-lg overflow-hidden">
                  {/* Thumbnail */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProperty.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {primaryImage && (
                        <img
                          src={primaryImage}
                          alt={activeProperty.name}
                          className="w-full aspect-[16/10] object-cover"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-[10px] tracking-[0.2em] text-white/30 mb-1.5">
                      {(activeProperty.developer as any)?.name || 'Developer'}
                    </p>
                    <h3 className="font-serif text-lg text-white leading-tight">
                      {activeProperty.name}
                    </h3>
                    <p className="text-xs text-white/40 mt-1">{activeProperty.area}</p>
                    <p className="font-serif text-base text-white/80 mt-3">
                      From {formatPrice(activeProperty.price_from, { compact: true })}
                    </p>
                    <Link
                      to={`/properties/${activeProperty.slug}`}
                      className="inline-block mt-4 text-[11px] tracking-[0.15em] text-white/50 hover:text-white transition-colors duration-300"
                    >
                      View Project →
                    </Link>
                  </div>

                  {/* Nav row */}
                  {featuredProperties.length > 1 && (
                    <div className="flex items-center justify-between px-5 pb-4">
                      <div className="flex gap-1.5">
                        {featuredProperties.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`h-[2px] rounded-full transition-all duration-300 ${
                              i === activeIndex ? 'w-5 bg-white/60' : 'w-2 bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={goPrev}
                          className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={goNext}
                          className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em] text-white/20">Scroll</span>
        <ChevronDown className="w-3.5 h-3.5 text-white/20" />
      </motion.div>
    </section>
  );
}
