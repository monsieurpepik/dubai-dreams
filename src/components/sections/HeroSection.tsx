import { motion } from 'framer-motion';
import { useTenant } from '@/hooks/useTenant';
import { ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-dubai-skyline.jpeg';

export function HeroSection() {
  const { tenant } = useTenant();
  
  const cityName = tenant?.office_location?.city || 'Dubai';
  const backgroundImage = tenant?.theme?.hero_image_url || heroImage;

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col">
      {/* Background Image — ultra-slow Ken Burns */}
      <div className="absolute inset-0">
        <motion.img
          src={backgroundImage}
          alt={`${cityName} skyline`}
          className="h-full w-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 40, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/50" />
      </div>

      {/* Single word — centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-7xl md:text-9xl lg:text-[12rem] xl:text-[14rem] text-white font-light tracking-[0.12em] leading-none"
        >
          Possess
        </motion.h1>
      </div>

      {/* Scroll indicator — barely visible */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em] text-white/20">
          Scroll
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-white/20" />
      </motion.div>
    </section>
  );
}
