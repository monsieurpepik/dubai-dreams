import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LogOut } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { useAuth } from '@/hooks/useAuth';

const primaryItems = [
  { label: 'Properties', href: '/properties', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
  { label: 'Developers', href: '/developers', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
  { label: 'Intelligence', href: '/insights', image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80' },
  { label: 'Private Advisor', href: '/advisor', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80' },
  { label: 'Calculator', href: '/calculator', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80' },
];

const secondaryItems = [
  { label: 'About', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
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
  const { user, signOut } = useAuth();
  const brandName = tenant?.brand_name || 'OwningDubai';

  const handleNavClick = (href: string) => {
    onClose();
    navigate(href);
  };

  const activeImage = hoveredIndex !== null ? primaryItems[hoveredIndex].image : primaryItems[0].image;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] bg-background flex flex-col"
        >
          {/* Mobile background image */}
          <div
            className="absolute inset-0 md:hidden bg-cover bg-center opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: `url(${primaryItems[0].image})` }}
          />

          {/* Header bar */}
          <div className="relative flex items-center justify-between px-6 lg:px-12 h-16 md:h-20 border-b border-border/30">
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
          <div className="relative flex-1 flex overflow-hidden">
            {/* Left — Navigation */}
            <nav className="w-full md:w-[45%] flex flex-col justify-center px-8 md:px-14 lg:px-20 py-8">
              {/* Primary nav */}
              <div className="space-y-0">
                {primaryItems.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => handleNavClick(item.href)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="group flex items-center gap-4 w-full text-left py-4 transition-all duration-300"
                    >
                      <div className={`w-0.5 h-6 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-foreground' : 'bg-transparent group-hover:bg-border'
                      }`} />
                      <span className={`font-serif text-3xl md:text-3xl lg:text-4xl tracking-[0.02em] transition-all duration-300 ${
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-1'
                      }`}>
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Separator */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="h-px bg-border/40 my-6 origin-left max-w-[200px]"
              />

              {/* Secondary nav */}
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {secondaryItems.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 + index * 0.04, duration: 0.4 }}
                      onClick={() => handleNavClick(item.href)}
                      className={`text-sm tracking-[0.08em] transition-colors duration-300 ${
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground/60 hover:text-foreground'
                      }`}
                    >
                      {item.label}
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
              <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="relative border-t border-border/30 px-6 lg:px-12 py-4 md:py-5 flex items-center justify-between"
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

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/saved"
                    onClick={onClose}
                    className="text-[11px] tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    Shortlist
                  </Link>
                  <button
                    onClick={() => { signOut(); onClose(); }}
                    className="text-[11px] tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={onClose}
                  className="text-[11px] tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
