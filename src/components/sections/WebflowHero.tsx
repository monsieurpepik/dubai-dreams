import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-dubai-skyline.jpeg';

export function WebflowHero() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, navigate to properties as CTA
    navigate('/properties');
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center items-center">
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0">
        <motion.img
          src={heroImage}
          alt="Dubai skyline"
          className="h-full w-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 30, ease: 'linear' }}
        />
        {/* Dark overlays — heavy vignette like Webflow */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.4) 100%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        {/* Logo SVG — OWNING DUBAI in the exact Webflow typeface style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <h1 className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-[0.3em] text-white uppercase leading-none"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
            OWNING DUBAI
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-white/30" />
            <p className="text-[10px] tracking-[0.35em] text-white/50 uppercase font-medium">
              Luxury Marketplace
            </p>
            <div className="h-px w-8 bg-white/30" />
          </div>
        </motion.div>

        {/* Main headline — Webflow GSAP line-up animation style */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.5rem,7vw,5.5rem)] font-light text-white leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Dubai's Own
          <br />
          <span className="font-normal">Marketplace</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-[15px] md:text-[17px] text-white/60 font-light leading-relaxed max-w-xl"
        >
          Be the first to experience unparalleled access to Dubai's most exclusive properties, curated from the finest sources.
        </motion.p>

        {/* CTA Buttons — Webflow style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={() => navigate('/properties')}
            className="px-8 py-4 bg-white text-black text-[12px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-all duration-300 min-w-[220px]"
          >
            Explore Properties
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('advisor-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-transparent border border-white/30 text-white text-[12px] font-medium tracking-[0.2em] uppercase hover:bg-white/10 hover:border-white/50 transition-all duration-300 min-w-[220px]"
          >
            Personal Shopper
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em] text-white/30 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-6 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
