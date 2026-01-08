import { motion } from 'framer-motion';

export function HeroSection() {
  const scrollToProperties = () => {
    const element = document.getElementById('properties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85"
          alt="Dubai skyline"
          className="h-full w-full object-cover"
        />
        {/* Stronger gradient: dark at bottom, transparent at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content - Lower-left positioning for better composition */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-20 md:px-12 lg:px-20 lg:pb-24">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 font-serif text-5xl font-light tracking-tight text-white md:text-6xl lg:text-7xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        >
          DUBAI OFF-PLAN
        </motion.h1>

        {/* Single Line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8 text-lg text-white/70 font-light tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
        >
          Curated off-plan residences
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          onClick={scrollToProperties}
          className="border border-white/40 bg-white/5 backdrop-blur-sm px-10 py-4 text-xs font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-white hover:text-black"
        >
          Explore Residences
        </motion.button>
      </div>
    </section>
  );
}
