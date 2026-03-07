import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';

const navItems = [
  { label: 'Properties', href: '/properties', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
  { label: 'Developers', href: '/developers', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
  { label: 'Intelligence', href: '/insights', image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80' },
  { label: 'Private Advisor', href: '/advisor', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80' },
  { label: 'Calculator', href: '/calculator', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80' },
  { label: 'About', href: '/about', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
  { label: 'How It Works', href: '/how-it-works', image: 'https://images.unsplash.com/photo-1582407947092-50af6a9d6a1e?w=800&q=80' },
  { label: 'Contact', href: '/contact', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
];

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
}

export function MenuOverlay({ isOpen, onClose, onSearchOpen }: MenuOverlayProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { tenant } = useTenant();
  const brandName = tenant?.brand_name || 'OwningDubai';

  const handleNavClick = (href: string) => {
    onClose();
    navigate(href);
  };

  const activeImage = hoveredIndex !== null ? navItems[hoveredIndex].image : navItems[0].image;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] bg-background flex flex-col"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 lg:px-12 h-16 md:h-20 border-b border-border/10">
            <span className="font-serif text-lg tracking-[0.08em] text-foreground">
              {brandName}
            </span>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left — Navigation */}
            <nav className="w-full md:w-[45%] flex flex-col justify-center px-8 md:px-14 lg:px-20 py-8">
              <div className="space-y-0">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  const num = String(index + 1).padStart(2, '0');
                  return (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => handleNavClick(item.href)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="group flex items-center gap-4 md:gap-6 w-full text-left py-2.5 md:py-3 transition-all duration-300"
                    >
                      {/* Active indicator */}
                      <div className={`w-0.5 h-6 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-foreground' : 'bg-transparent group-hover:bg-border'
                      }`} />

                      {/* Number */}
                      <span className="text-[10px] tracking-[0.2em] text-muted-foreground/50 font-light w-6 shrink-0">
                        {num}
                      </span>

                      {/* Label */}
                      <span className={`font-serif text-2xl md:text-3xl lg:text-4xl tracking-[0.02em] transition-all duration-300 ${
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-1'
                      }`}>
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </nav>

            {/* Right — Image panel (desktop only) */}
            <div className="hidden md:block md:w-[55%] relative overflow-hidden bg-muted/30">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt=""
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="border-t border-border/10 px-6 lg:px-12 py-4 md:py-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <button
                onClick={() => { onClose(); onSearchOpen(); }}
                className="text-[11px] tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
              >
                Search
              </button>
              <CurrencySwitcher />
            </div>

            <div className="flex items-center gap-6">
              <span className="hidden md:inline text-[10px] tracking-[0.15em] text-muted-foreground/40">
                Dubai, UAE
              </span>
              <Link
                to="/contact"
                onClick={onClose}
                className="text-[11px] tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
              >
                Get in touch →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
