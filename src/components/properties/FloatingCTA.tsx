import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { analytics } from '@/lib/analytics';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FloatingCTAProps {
  propertyName?: string;
}

export const FloatingCTA = ({ propertyName }: FloatingCTAProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { tenant, getWhatsAppUrl, getPropertyWhatsAppUrl } = useTenant();

  const whatsappUrl = propertyName 
    ? getPropertyWhatsAppUrl(propertyName)
    : getWhatsAppUrl();

  if (!tenant?.whatsapp_number) return null;

  const handleWhatsApp = () => {
    analytics.clickWhatsApp(propertyName);
  };

  const cityName = tenant?.office_location?.city || 'property';

  return (
    <>
      {/* Mobile — two-button row, WhatsApp primary */}
      <div className="fixed bottom-20 right-4 z-50 md:hidden flex flex-col gap-2">
        <Link
          to="/contact"
          className="w-10 h-10 rounded-full bg-background border border-border/50 text-foreground flex items-center justify-center shadow-lg"
        >
          <Phone className="w-3.5 h-3.5" />
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsApp}
          className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      {/* Desktop — expandable stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.4 }}
        className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end gap-2"
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-background border border-border/30 p-6 w-72 rounded-xl shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Get in Touch
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <p className="text-sm text-foreground mb-5">
                Have a question about {cityName} property?
              </p>
              
              <div className="space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 w-full bg-foreground text-background px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] hover:opacity-90 transition-opacity rounded-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <Link
                  to="/advisor"
                  className="flex items-center justify-center gap-2 w-full border border-border/50 text-foreground px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] hover:bg-secondary/50 transition-colors rounded-xl"
                >
                  <Phone className="w-4 h-4" />
                  <span>Book a Call</span>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              <Link
                to="/advisor"
                className="w-11 h-11 rounded-full bg-background border border-border/50 text-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <Phone className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsExpanded(true)}
                className="w-11 h-11 rounded-full bg-foreground/80 backdrop-blur-sm text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors duration-300"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
