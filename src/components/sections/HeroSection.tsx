import { motion } from 'framer-motion';
import { useTenant } from '@/hooks/useTenant';
import heroImage from '@/assets/hero-dubai-skyline.jpeg';

export function HeroSection() {
  const { tenant } = useTenant();
  
  // Dynamic city name from tenant
  const cityName = tenant?.office_location?.city || 'Dubai';
  
  // Use tenant hero image or default
  const backgroundImage = tenant?.theme?.hero_image_url || heroImage;

  const scrollToProperties = () => {
    const element = document.getElementById('properties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image - Subtle Ken Burns */}
      <div className="absolute inset-0">
        <motion.img
          src={backgroundImage}
          alt={`${cityName} skyline`}
          className="h-full w-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 25, ease: "linear" }}
        />
        {/* Apple-style dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Content - Centered, confident */}
      <div className="relative z-10 container-wide text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          {/* Authority headline - single, calm, confident */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-[1.1] tracking-tight">
            The Smartest Entry Point to {cityName} Real Estate
          </h1>
          
          {/* Single line supporting text */}
          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-xl mx-auto font-light">
            Off-plan developments from trusted developers.
          </p>

          {/* Single CTA - Apple minimal style */}
          <motion.a
            href="/properties"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-block px-10 py-4 bg-white text-black text-xs font-medium uppercase tracking-[0.2em] hover:bg-white/90 transition-colors duration-300"
          >
            Explore Projects
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator - subtle line */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-12 bg-white/20" />
      </motion.div>
    </section>
  );
}
