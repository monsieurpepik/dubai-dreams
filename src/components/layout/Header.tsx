import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu } from 'lucide-react';
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

  // Show search pill when scrolled on homepage, or always on other pages
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
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/10'
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
            <div className="flex flex-col gap-[4px]">
              <span className="block w-[22px] h-[1.5px] bg-white/70 group-hover:bg-white transition-colors duration-300" />
              <span className="block w-[22px] h-[1.5px] bg-white/70 group-hover:bg-white transition-colors duration-300" />
            </div>
            <span className="hidden md:inline text-[12px] font-medium tracking-[0.05em] text-white/70 group-hover:text-white transition-colors uppercase">
              Menu
            </span>
          </button>

          {/* Center — OWNING DUBAI logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 text-[14px] md:text-[16px] font-semibold tracking-[0.25em] text-white hover:opacity-70 transition-opacity duration-300 uppercase whitespace-nowrap"
          >
            OWNING DUBAI
          </Link>

          {/* Right — Search + Currency + CTA */}
          <div className="flex items-center gap-3">
            <CurrencySwitcher />

            <AnimatePresence>
              {showSearchPill && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* CTA button — hidden on mobile */}
            <Link
              to="/deal-finder"
              className="hidden md:flex items-center gap-2 bg-[#1127D2] text-white text-[12px] font-medium tracking-[0.05em] px-3 py-2 rounded-[4px] hover:bg-[#0d1fb0] transition-colors uppercase"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Personal Shopper
            </Link>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mx-6 lg:mx-12 h-px bg-white/10" />
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
