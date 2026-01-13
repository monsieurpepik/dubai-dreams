import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';
import heroImage from '@/assets/hero-dubai-skyline.jpeg';

// Default headlines that work for any market
const defaultHeadlines = [
  {
    headline: "The Smartest Entry Point",
    subline: "Premium off-plan investments, expertly curated"
  },
  {
    headline: "Where Ambition Meets Opportunity",
    subline: "The world's most coveted addresses, before they're built"
  },
  {
    headline: "Your Investment Journey Begins",
    subline: "Expert guidance. Premium access. Exceptional returns."
  }
];

// Market-specific headlines (keyed by tenant slug)
const marketHeadlines: Record<string, Array<{ headline: string; subline: string }>> = {
  dubai: [
    {
      headline: "Wake Up to the Arabian Gulf",
      subline: "Where your morning view changes everything"
    },
    {
      headline: "Your Tax-Free Chapter Begins",
      subline: "0% income tax. 100% opportunity"
    },
    {
      headline: "Where Ambition Meets the Sea",
      subline: "Dubai's most coveted addresses, before they're built"
    },
    {
      headline: "The World's Safe Haven",
      subline: "Invest where the future is being designed"
    }
  ],
  mumbai: [
    {
      headline: "The Heart of India's Future",
      subline: "Premium addresses in the city that never sleeps"
    },
    {
      headline: "Where Dreams Take Shape",
      subline: "Mumbai's most prestigious developments await"
    }
  ],
  saudi: [
    {
      headline: "Vision 2030 Begins Here",
      subline: "Be part of the Kingdom's transformation"
    },
    {
      headline: "The New Frontier of Investment",
      subline: "Premium residences in Saudi Arabia's rising cities"
    }
  ]
};

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { tenant } = useTenant();

  // Get headlines for current tenant
  const headlines = tenant?.slug 
    ? (marketHeadlines[tenant.slug] || defaultHeadlines)
    : defaultHeadlines;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  const scrollToProperties = () => {
    const element = document.getElementById('properties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const current = headlines[currentIndex];

  // Use tenant hero image or default
  const backgroundImage = tenant?.theme?.hero_image_url || heroImage;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Ken Burns */}
      <div className="absolute inset-0">
        <motion.img
          key="hero-bg"
          src={backgroundImage}
          alt={`${tenant?.office_location?.city || 'City'} skyline at golden hour`}
          className="h-full w-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 30, ease: "linear" }}
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-24 md:px-12 lg:px-20 lg:pb-32">
        {/* Rotating Headlines */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h1 className="mb-4 font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-white leading-[1.05]">
              {current.headline}
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-light tracking-wide max-w-xl">
              {current.subline}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Headline Indicators */}
        <div className="flex gap-2 mb-10">
          {headlines.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-0.5 transition-all duration-500 ease-out ${
                index === currentIndex 
                  ? 'w-8 bg-white' 
                  : 'w-4 bg-white/30 hover:bg-white/60 hover:w-6'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={scrollToProperties}
          className="border border-white/40 bg-white/5 backdrop-blur-sm px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all duration-500 ease-out hover:bg-white/95 hover:text-black hover:border-white"
        >
          Explore Residences
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/40 to-white/0" />
      </motion.div>
    </section>
  );
}