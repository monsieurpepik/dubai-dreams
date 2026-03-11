import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const menuItems = [
  { label: 'Properties', href: '/properties' },
  { label: 'Off-Plan', href: '/properties?status=off-plan' },
  { label: 'Rentals', href: '/properties?status=rental' },
];

const subLinks = [
  { label: 'Villas', href: '/properties?type=villa' },
  { label: 'Apartments', href: '/properties?type=apartment' },
  { label: 'Penthouses', href: '/properties?type=penthouse' },
  { label: 'Plots', href: '/properties?type=plot' },
];

const secondaryLinks = [
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (href: string) => {
    onClose();
    navigate(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[59] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 bottom-0 z-[60] w-[85vw] max-w-[420px] bg-black border-r border-white/[0.08] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 h-16 md:h-20 border-b border-white/[0.08] shrink-0">
              <span className="text-[13px] font-semibold tracking-[0.25em] text-white uppercase">
                OWNING DUBAI
              </span>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-white/30 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main nav */}
            <div className="flex-1 overflow-y-auto px-8 py-10">
              {/* Primary — large */}
              <div className="space-y-1">
                {menuItems.map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => go(item.href)}
                    className={`block w-full text-left py-3 text-[28px] md:text-[34px] font-light tracking-[0.02em] transition-colors duration-300 ${
                      location.pathname === item.href || (item.href.includes('?') && location.search.includes(item.href.split('?')[1]))
                        ? 'text-white'
                        : 'text-white/30 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>

              {/* Sub-categories */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="mt-6 pl-1 border-l border-white/[0.08] ml-1"
              >
                <p className="text-[9px] tracking-[0.25em] text-white/30 uppercase mb-3 pl-4">
                  By Type
                </p>
                {subLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => go(link.href)}
                    className="block w-full text-left pl-4 py-2 text-[13px] tracking-[0.05em] text-white/30 hover:text-white/60 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </motion.div>

              {/* Divider */}
              <div className="h-px bg-white/[0.08] my-8" />

              {/* Secondary links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="space-y-1"
              >
                {secondaryLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => go(link.href)}
                    className="block w-full text-left py-2 text-[12px] tracking-[0.15em] text-white/30 hover:text-white/60 transition-colors uppercase"
                  >
                    {link.label}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Bottom — consistent CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="px-8 py-6 border-t border-white/[0.08] shrink-0"
            >
              <button
                onClick={() => {
                  onClose();
                  const el = document.getElementById('advisor-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3.5 bg-white text-black text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-all"
              >
                Get Matched
              </button>
              <div className="flex items-center justify-center gap-5 mt-5 text-[10px] tracking-[0.1em] text-white/30 uppercase">
                <a href="#" className="hover:text-white/60 transition-colors">IG</a>
                <a href="#" className="hover:text-white/60 transition-colors">YT</a>
                <a href="#" className="hover:text-white/60 transition-colors">LI</a>
              </div>
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
