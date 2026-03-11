import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { SearchOverlay } from '@/components/properties/SearchOverlay';
import { useIsMobile } from '@/hooks/use-mobile';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { MenuOverlay } from '@/components/layout/MenuOverlay';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { tenant } = useTenant();
  const isMobile = useIsMobile();
  const isHomepage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handler = () => setIsMenuOpen(true);
    window.addEventListener('open-mobile-menu', handler);
    return () => window.removeEventListener('open-mobile-menu', handler);
  }, []);

  const showSearchPill = (!isHomepage || isScrolled);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:text-xs">
        Skip to content
      </a>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12 h-16 md:h-20">
          {/* Left — MENU + hamburger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="group flex items-center gap-2.5 transition-colors duration-300"
            aria-label="Open navigation menu"
          >
            <div className="flex flex-col gap-[5px]">
              <span className="block w-[20px] h-[1.5px] bg-white/60 group-hover:bg-white transition-colors duration-300 rounded-full" />
              <span className="block w-[20px] h-[1.5px] bg-white/60 group-hover:bg-white transition-colors duration-300 rounded-full" />
            </div>
            <span className="hidden md:inline text-[13px] font-medium text-white/60 group-hover:text-white transition-colors">
              Menu
            </span>
          </button>

          {/* Center — OWNING DUBAI logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 text-[14px] md:text-[16px] font-bold tracking-[0.25em] text-white hover:opacity-70 transition-opacity duration-300 uppercase whitespace-nowrap"
          >
            OWNING DUBAI
          </Link>

          {/* Right — Search + Currency + CTA */}
          <div className="flex items-center gap-2.5">
            <CurrencySwitcher />

            <AnimatePresence>
              {showSearchPill && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 text-white/30 hover:text-white hover:bg-white/[0.08] rounded-full transition-all duration-200"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* CTA — Airbnb pill button */}
            <button
              onClick={() => {
                const el = document.getElementById('advisor-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden md:flex items-center bg-white text-black text-[13px] font-semibold px-5 py-2.5 rounded-full hover:bg-white/90 hover:shadow-[0_2px_12px_rgba(255,255,255,0.12)] active:scale-[0.97] transition-all duration-200"
            >
              Get Matched
            </button>
          </div>
        </div>
      </motion.header>

      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSearchOpen={() => setIsSearchOpen(true)}
      />

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
