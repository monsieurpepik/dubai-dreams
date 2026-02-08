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
          {/* Transformational headline */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-[1.1] tracking-tight">
            Turn AED 500K Into a Portfolio
          </h1>
          
          {/* Supporting text - investment focused */}
          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-xl mx-auto font-light">
            Off-plan projects with 6-10% projected yields. Tax-free returns.
          </p>

          {/* Dual CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="/calculator"
              className="inline-block px-10 py-4 bg-white text-black text-xs font-medium uppercase tracking-[0.2em] hover:bg-white/90 transition-colors duration-300"
            >
              See Your Returns
            </a>
            <a
              href="/properties"
              className="inline-block px-10 py-4 border border-white/30 text-white text-xs font-medium uppercase tracking-[0.2em] hover:bg-white/10 transition-colors duration-300"
            >
              Browse Projects
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Geometric Accent — subtle diamond */}
      <motion.svg
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <rect
          x="400" y="300" width="200" height="200"
          transform="rotate(45 500 400)"
          stroke="white"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
        <rect
          x="370" y="270" width="260" height="260"
          transform="rotate(45 500 400)"
          stroke="white"
          strokeOpacity="0.04"
          strokeWidth="0.5"
        />
      </motion.svg>

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
