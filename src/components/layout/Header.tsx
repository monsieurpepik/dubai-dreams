import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { SearchOverlay } from '@/components/properties/SearchOverlay';

const allNavItems = [
  { label: 'Properties', href: '/properties' },
  { label: 'Developers', href: '/developers' },
  { label: 'Intelligence', href: '/insights' },
  { label: 'Private Advisor', href: '/advisor' },
  { label: 'Calculator', href: '/calculator' },
  { label: 'About', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { tenant } = useTenant();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    navigate(href);
  };

  const brandName = tenant?.brand_name || 'OwningDubai';

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border/10'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12 h-16 md:h-20">
          {/* Empty left spacer for centering */}
          <div className="w-16" />

          {/* Brand — centered */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 font-serif text-lg md:text-xl font-light tracking-[0.08em] text-foreground hover:opacity-70 transition-opacity duration-300"
          >
            {brandName}
          </Link>

          {/* Menu — right */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-[11px] tracking-[0.15em] text-muted-foreground hover:text-foreground transition-opacity duration-300"
          >
            Menu
          </button>
        </div>
      </motion.header>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-background flex flex-col"
          >
            {/* Close */}
            <div className="flex justify-end px-6 lg:px-12 h-16 md:h-20 items-center">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-opacity duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col justify-center px-10 md:px-20 gap-1">
              {allNavItems.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-left font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.3] transition-opacity duration-300 ${
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground/40 hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </nav>

            {/* Bottom — search + contact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="px-10 md:px-20 pb-10 flex items-center justify-between"
            >
              <button
                onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-opacity duration-300"
              >
                Search
              </button>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-opacity duration-300"
              >
                Get in touch
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
