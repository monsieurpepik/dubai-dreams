import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import heroImage from '@/assets/hero-dubai-skyline.jpeg';

const quickFilters = [
  { label: 'Off-Plan', href: '/properties?status=off-plan' },
  { label: 'Villas', href: '/properties?type=villa' },
  { label: 'Apartments', href: '/properties?type=apartment' },
  { label: 'Penthouses', href: '/properties?type=penthouse' },
];

export function WebflowHero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/properties?q=${encodeURIComponent(query.trim())}` : '/properties');
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.4) 100%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <h1 className="text-[clamp(1.8rem,4.5vw,3.5rem)] font-bold tracking-[0.3em] text-white uppercase leading-none">
            OWNING DUBAI
          </h1>
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.2rem,6vw,4.5rem)] font-light text-white leading-[1.1] tracking-[-0.02em]"
        >
          Find your property
          <br />
          <span className="text-white/60">in Dubai</span>
        </motion.h2>

        {/* Airbnb-style search bar — rounded, elevated, glassy */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 w-full max-w-xl"
        >
          <div
            className={`relative rounded-full transition-all duration-300 ${
              isFocused
                ? 'bg-white/[0.14] shadow-[0_8px_32px_rgba(255,255,255,0.08)]'
                : 'bg-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
            }`}
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search by area, developer, or project"
              className="w-full pl-13 pr-32 py-4 bg-transparent rounded-full text-[15px] text-white placeholder:text-white/35 focus:outline-none transition-all"
              style={{ paddingLeft: '3.2rem' }}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-white text-black text-[13px] font-semibold rounded-full hover:bg-white/90 hover:shadow-[0_2px_12px_rgba(255,255,255,0.15)] active:scale-[0.97] transition-all duration-200"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* Quick filter pills — rounded, Airbnb style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          {quickFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => navigate(filter.href)}
              className="px-5 py-2 text-[13px] text-white/60 bg-white/[0.06] border border-white/[0.1] rounded-full hover:bg-white/[0.12] hover:border-white/[0.2] hover:text-white active:scale-[0.97] transition-all duration-200"
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Or get matched CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          onClick={() => {
            const el = document.getElementById('advisor-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-8 text-[13px] text-white/30 hover:text-white/60 transition-colors underline underline-offset-4 decoration-white/[0.15] hover:decoration-white/30"
        >
          Or get matched by an advisor
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-6 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
