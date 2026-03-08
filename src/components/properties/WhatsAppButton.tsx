import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { analytics } from '@/lib/analytics';
import { useState } from 'react';

interface WhatsAppButtonProps {
  propertyName?: string;
  variant?: 'floating' | 'inline' | 'sidebar';
}

export const WhatsAppButton = ({ propertyName, variant = 'floating' }: WhatsAppButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { tenant, getWhatsAppUrl, getPropertyWhatsAppUrl } = useTenant();

  const whatsappUrl = propertyName 
    ? getPropertyWhatsAppUrl(propertyName)
    : getWhatsAppUrl();

  if (!tenant?.whatsapp_number) return null;

  const handleClick = () => {
    analytics.clickWhatsApp(propertyName);
  };

  const cityName = tenant?.office_location?.city || 'property';

  if (variant === 'inline') {
    return (
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-xl"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Message</span>
      </motion.a>
    );
  }

  if (variant === 'sidebar') {
    return (
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex items-center justify-center gap-2 w-full bg-foreground text-background px-4 py-3 text-xs font-medium uppercase tracking-wider transition-opacity hover:opacity-90 rounded-xl"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Start Conversation</span>
      </motion.a>
    );
  }

  // Floating variant — subtle WhatsApp icon
  return (
    <>
      {/* Mobile */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.4 }}
        className="fixed bottom-6 right-6 z-50 md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-foreground/80 backdrop-blur-sm text-background shadow-lg"
      >
        <MessageCircle className="w-4.5 h-4.5" />
      </motion.a>

      {/* Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.4 }}
        className="fixed bottom-6 right-6 z-50 hidden md:block"
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
              
              <p className="text-sm text-foreground mb-6">
                Have a question about {cityName} property?
              </p>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="flex items-center justify-center gap-2 w-full bg-foreground text-background px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] hover:opacity-90 transition-opacity rounded-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              className="w-11 h-11 rounded-full bg-foreground/80 backdrop-blur-sm text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors duration-300"
            >
              <MessageCircle className="w-4.5 h-4.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
