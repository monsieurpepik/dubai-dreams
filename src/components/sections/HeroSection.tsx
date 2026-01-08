import { motion } from 'framer-motion';

export function HeroSection() {
  const scrollToProperties = () => {
    const element = document.getElementById('properties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85"
          alt="Dubai skyline"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content - Centered, minimal */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 font-serif text-5xl font-light tracking-tight text-white md:text-6xl lg:text-7xl"
        >
          DUBAI OFF-PLAN
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6 h-px w-16 bg-accent"
        />

        {/* Single Line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-12 text-lg text-white/60 font-light tracking-wide"
        >
          Curated residences
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          onClick={scrollToProperties}
          className="border border-white/30 px-10 py-4 text-xs font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-white hover:text-black"
        >
          View Collection
        </motion.button>
      </div>
    </section>
  );
}
