import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, Facebook, Search } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { SearchOverlay } from '@/components/properties/SearchOverlay';

const primaryNavItems = [
  { label: 'Properties', href: '/properties' },
  { label: 'Calculator', href: '/calculator' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const allNavItems = [
  ...primaryNavItems,
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Developer Portal', href: '/developer/login' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { tenant } = useTenant();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    navigate(href);
  };

  const brandName = tenant?.brand_name || 'OwningDubai';
  const brandParts = brandName.match(/^(Owning)(.*)$/);
  const brandPrefix = brandParts?.[1] || 'Owning';
  const brandLocation = brandParts?.[2] || '';

  const socialLinks = tenant?.social_links;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-xl border-b border-border/20' 
            : 'bg-transparent'
        }`}
      >
        <div className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12 transition-all duration-500 ${
          isScrolled ? 'h-14 md:h-14' : 'h-16 md:h-20'
        }`}>
          {/* Logo — slightly larger */}
          <Link 
            to="/" 
            className={`font-medium uppercase tracking-[0.25em] text-foreground transition-all duration-500 hover:opacity-70 ${
              isScrolled ? 'text-[11px]' : 'text-xs'
            }`}
          >
            {brandPrefix}<span className="font-semibold">{brandLocation}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 md:flex">
            {primaryNavItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-all duration-300 hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
          </nav>

          {/* Mobile buttons */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="relative z-50 p-2 text-foreground transition-opacity duration-300 hover:opacity-70"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-50 p-2 text-foreground transition-opacity duration-300 hover:opacity-70"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-background flex flex-col md:hidden"
          >
            <nav className="flex-1 flex flex-col justify-center px-10 gap-2">
              {allNavItems.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-left font-serif text-3xl leading-[1.4] transition-colors duration-300 ${
                      isActive
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground/60 font-light hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="px-10 pb-10 space-y-6"
            >
              <div className="flex items-center gap-5">
                {socialLinks?.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {socialLinks?.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {!socialLinks?.instagram && !socialLinks?.facebook && (
                  <>
                    <span className="text-muted-foreground/40"><Instagram className="w-5 h-5" /></span>
                    <span className="text-muted-foreground/40"><Facebook className="w-5 h-5" /></span>
                  </>
                )}
              </div>

              <div className="border-t border-border/30 pt-6">
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="font-light">Have a project in mind?</span>
                  <span className="text-xs uppercase tracking-[0.2em] font-medium">Get in touch →</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
