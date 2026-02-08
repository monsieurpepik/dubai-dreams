import { motion } from 'framer-motion';
import { useTenant } from '@/hooks/useTenant';
import { ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-dubai-skyline.jpeg';

export function HeroSection() {
  const { tenant } = useTenant();
  
  const cityName = tenant?.office_location?.city || 'Dubai';
  const backgroundImage = tenant?.theme?.hero_image_url || heroImage;

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Background Image - Ken Burns */}
      <div className="absolute inset-0">
        <motion.img
          src={backgroundImage}
          alt={`${cityName} skyline`}
          className="h-full w-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 25, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Split Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-12 lg:px-20 py-28 md:py-32">
        
        {/* Top Section — Subtitle + First Headline Word */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50 mb-4"
          >
            Invest With Confidence
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white leading-[0.95] tracking-tight"
          >
            TURN AED 500K
          </motion.h1>
        </div>

        {/* Center — Geometric Diamond */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 45 }}
          transition={{ duration: 1.2, ease, delay: 0.8 }}
          className="self-center"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 border border-white/15 relative">
            <div className="absolute inset-2 md:inset-3 border border-white/8" />
          </div>
        </motion.div>

        {/* Bottom Section — Second Headline + Description + CTA */}
        <div className="space-y-8">
          {/* Second headline — right-aligned */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.6 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white leading-[0.95] tracking-tight text-right"
          >
            INTO A PORTFOLIO
          </motion.h1>

          {/* Bottom bar — description left, CTA right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6"
          >
            <p className="text-sm md:text-base text-white/50 max-w-xs font-light leading-relaxed">
              Off-plan projects with 6-10% projected yields.
              <br />
              Tax-free returns.
            </p>

            <a
              href="/calculator"
              className="group flex items-center gap-3"
            >
              {/* Small diamond accent */}
              <span className="w-2 h-2 border border-white/40 rotate-45 group-hover:border-white/80 transition-colors" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">
                See Your Returns
              </span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll to Explore — bottom center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">
          Scroll to Explore
        </span>
        <ChevronDown className="w-4 h-4 text-white/30" />
      </motion.div>
    </section>
  );
}
