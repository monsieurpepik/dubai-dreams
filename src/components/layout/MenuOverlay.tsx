import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LogOut, ChevronRight } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { useAuth } from '@/hooks/useAuth';

interface CategoryItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const categories: CategoryItem[] = [
  {
    label: 'Properties',
    href: '/properties',
    children: [
      { label: 'Villas', href: '/properties?type=villa' },
      { label: 'Apartments', href: '/properties?type=apartment' },
      { label: 'Penthouses', href: '/properties?type=penthouse' },
      { label: 'Plots', href: '/properties?type=plot' },
    ],
  },
  {
    label: 'Off-Plan',
    href: '/properties?status=off-plan',
    children: [
      { label: 'New Launches', href: '/properties?status=off-plan&sort=newest' },
      { label: 'Payment Plans', href: '/properties?status=off-plan&feature=payment-plan' },
    ],
  },
  {
    label: 'Rentals',
    href: '/properties?status=rental',
  },
];

const secondaryItems = [
  { label: 'Deal Finder', href: '/discover' },
  { label: 'Golden Visa', href: '/calculator' },
  { label: 'Insights', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
}

export function MenuOverlay({ isOpen, onClose, onSearchOpen }: MenuOverlayProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { tenant } = useTenant();
  const { user, signOut } = useAuth();
  const brandName = tenant?.brand_name || 'OWNING DUBAI';

  const handleNavClick = (href: string) => {
    onClose();
    navigate(href);
  };

  const toggleCategory = (label: string) => {
    setExpandedCategory(prev => prev === label ? null : label);
  };

  // Background image based on hovered item
  const bgImages: Record<string, string> = {
    'Properties': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'Off-Plan': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'Rentals': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'Deal Finder': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    'Golden Visa': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  };
  const activeImage = hoveredItem ? bgImages[hoveredItem] || bgImages['Properties'] : bgImages['Properties'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] bg-black flex flex-col"
        >
          {/* Header bar */}
          <div className="relative flex items-center justify-between px-6 lg:px-12 h-16 md:h-20 border-b border-white/10">
            <span className="text-[14px] md:text-[16px] font-semibold tracking-[0.25em] uppercase text-white">
              {brandName}
            </span>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main content */}
          <div className="relative flex-1 flex overflow-hidden">
            {/* Left — Navigation */}
            <nav className="w-full md:w-[45%] flex flex-col justify-between px-8 md:px-14 lg:px-20 py-10 overflow-y-auto">
              {/* Category nav — Figma style */}
              <div>
                <p className="text-[10px] tracking-[0.15em] text-white/40 uppercase mb-6">Categories</p>
                <div className="space-y-1">
                  {categories.map((cat, index) => (
                    <motion.div
                      key={cat.label}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        onClick={() => cat.children ? toggleCategory(cat.label) : handleNavClick(cat.href)}
                        onMouseEnter={() => setHoveredItem(cat.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="group flex items-center justify-between w-full text-left py-3 transition-all duration-300"
                      >
                        <span className={`text-2xl md:text-3xl lg:text-4xl tracking-[0.02em] transition-all duration-300 ${
                          expandedCategory === cat.label
                            ? 'text-white'
                            : 'text-white/50 group-hover:text-white'
                        }`}>
                          {cat.label}
                        </span>
                        {cat.children && (
                          <ChevronRight className={`w-5 h-5 text-white/30 transition-transform duration-300 ${
                            expandedCategory === cat.label ? 'rotate-90 text-white/60' : ''
                          }`} />
                        )}
                      </button>

                      {/* Sub-items */}
                      <AnimatePresence>
                        {cat.children && expandedCategory === cat.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pl-6 pb-3 space-y-1 border-l border-white/10 ml-2">
                              {cat.children.map((child) => (
                                <button
                                  key={child.label}
                                  onClick={() => handleNavClick(child.href)}
                                  className="block w-full text-left py-2 text-sm tracking-[0.08em] text-white/40 hover:text-white transition-colors duration-200"
                                >
                                  {child.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Thin divider */}
                <div className="h-px bg-white/10 my-8" />

                {/* Secondary nav */}
                <div className="space-y-1">
                  {secondaryItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => handleNavClick(item.href)}
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`block w-full text-left py-2 text-sm tracking-[0.1em] uppercase transition-colors duration-200 ${
                        location.pathname === item.href ? 'text-white' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Bottom — Social + CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-10 pt-6 border-t border-white/10"
              >
                <button
                  onClick={() => handleNavClick('/contact')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#1127D2] text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-[4px] hover:opacity-90 transition-opacity"
                >
                  Personal Shopper
                </button>
                <div className="flex items-center gap-6 mt-6 text-[11px] tracking-[0.1em] text-white/30 uppercase">
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="hover:text-white transition-colors">YouTube</a>
                  <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                </div>
              </motion.div>
            </nav>

            {/* Right — Image panel (desktop only) */}
            <div className="hidden md:block md:w-[55%] relative overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="relative border-t border-white/10 px-6 lg:px-12 py-4 md:py-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <button
                onClick={() => { onClose(); onSearchOpen(); }}
                className="text-[11px] tracking-[0.15em] text-white/40 hover:text-white transition-colors uppercase"
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
                    className="text-[11px] tracking-[0.15em] text-white/40 hover:text-white transition-colors flex items-center gap-1.5 uppercase"
                  >
                    <User className="w-3.5 h-3.5" />
                    Shortlist
                  </Link>
                  <button
                    onClick={() => { signOut(); onClose(); }}
                    className="text-[11px] tracking-[0.15em] text-white/40 hover:text-white transition-colors flex items-center gap-1.5 uppercase"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={onClose}
                  className="text-[11px] tracking-[0.15em] text-white/40 hover:text-white transition-colors flex items-center gap-1.5 uppercase"
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
