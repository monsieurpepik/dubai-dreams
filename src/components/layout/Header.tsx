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

  // Listen for mobile tab bar menu trigger
  useEffect(() => {
    const handler = () => setIsMenuOpen(true);
    window.addEventListener('open-mobile-menu', handler);
    return () => window.removeEventListener('open-mobile-menu', handler);
  }, []);


  const brandName = tenant?.brand_name || 'OwningDubai';

  // Show search pill when scrolled on homepage, or always on other pages
  const showSearchPill = (!isHomepage || isScrolled);

  return (
    <>
      {/* Skip to content */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:text-xs">
        Skip to content
      </a>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border/30'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12 h-16 md:h-20">
          {/* Brand — left on desktop when pill is showing, centered otherwise */}
          <Link
            to="/"
            className={`font-serif text-lg md:text-xl font-light tracking-[0.08em] text-foreground hover:opacity-70 transition-all duration-300 ${
              showSearchPill ? 'relative' : 'absolute left-1/2 -translate-x-1/2'
            }`}
          >
            {brandName}
          </Link>

          {/* Search Pill — center */}
          <AnimatePresence>
            {showSearchPill && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-3 px-5 py-2 border border-border/30 rounded-full bg-background/60 backdrop-blur-sm hover:shadow-md hover:border-border/60 transition-all duration-300 group"
              >
                <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <div className="flex items-center gap-0 text-xs text-muted-foreground">
                  <span className="pr-3 border-r border-border/40">Area</span>
                  <span className="px-3 border-r border-border/40">Bedrooms</span>
                  <span className="pl-3">Budget</span>
                </div>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Mobile search icon + Menu — right */}
          <div className="flex items-center gap-3">
            <CurrencySwitcher />
            {showSearchPill && isMobile && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-4 h-4" />
              </motion.button>
            )}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/30 hover:border-border/60 bg-background/40 backdrop-blur-sm hover:bg-background/70 transition-all duration-300"
              aria-label="Open navigation menu"
            >
              <div className="flex flex-col gap-[3px]">
                <span className="block w-3.5 h-[1.5px] bg-muted-foreground group-hover:bg-foreground transition-colors duration-300 rounded-full" />
                <span className="block w-2.5 h-[1.5px] bg-muted-foreground group-hover:bg-foreground transition-colors duration-300 rounded-full" />
              </div>
              <span className="text-[11px] tracking-[0.15em] text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Menu
              </span>
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
