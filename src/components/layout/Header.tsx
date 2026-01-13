import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';

const navItems = [
  { label: 'Properties', href: '#properties', isRoute: false },
  { label: 'About', href: '/about', isRoute: true },
  { label: 'Calculator', href: '/calculator', isRoute: true },
  { label: 'Contact', href: '/contact', isRoute: true },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { tenant } = useTenant();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: typeof navItems[0]) => {
    setIsMobileMenuOpen(false);
    
    if (item.isRoute) {
      navigate(item.href);
    } else {
      const id = item.href.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Extract brand name parts for styling
  const brandName = tenant?.brand_name || 'OwningDubai';
  const brandParts = brandName.match(/^(Owning)(.*)$/);
  const brandPrefix = brandParts?.[1] || 'Owning';
  const brandLocation = brandParts?.[2] || '';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/90 backdrop-blur-xl border-b border-border/30' 
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:h-20 lg:px-12">
          {/* Logo - Tenant Aware */}
          <Link 
            to="/" 
            className="text-[11px] font-medium uppercase tracking-[0.25em] text-foreground transition-all duration-300 hover:opacity-70"
          >
            {brandPrefix}<span className="font-semibold">{brandLocation}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-all duration-300 hover:text-foreground hover:opacity-80"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground md:hidden transition-opacity duration-300 hover:opacity-70 active:opacity-50"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-10">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavClick(item)}
                  className="font-serif text-3xl font-light text-foreground"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}