import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  const scrollToProperties = () => {
    const element = document.getElementById('properties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with subtle zoom */}
      <div className="absolute inset-0">
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: "easeOut" }}
        >
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85"
            alt="Dubai skyline"
            className="h-full w-full object-cover"
          />
        </motion.div>
        {/* Dark overlay - JamesEdition style */}
        <div className="absolute inset-0 bg-black/65" />
      </div>

      {/* Content - Centered, minimal */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-6 text-[10px] font-medium uppercase tracking-[0.3em] text-white/50"
        >
          Dubai Off-Plan
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-10 h-px w-16 bg-white/25"
        />

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-6 max-w-3xl font-serif text-4xl font-light leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl"
        >
          Curated residences from the world's most ambitious city
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mb-14 max-w-lg text-sm leading-relaxed text-white/45 md:text-base"
        >
          A collection of exceptional off-plan properties, 
          selected for discerning investors.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          onClick={scrollToProperties}
          className="border border-white/25 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white/50 hover:bg-white/5"
        >
          View Collection
        </motion.button>
      </div>

      {/* Scroll Indicator - Minimal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/35">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4 text-white/35" />
        </motion.div>
      </motion.div>
    </section>
  );
}