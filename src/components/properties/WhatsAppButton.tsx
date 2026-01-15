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

  // Don't render if no WhatsApp number configured
  if (!tenant?.whatsapp_number) {
    return null;
  }

  const handleClick = () => {
    analytics.clickWhatsApp(propertyName);
  };

  // City name for personalized messages
  const cityName = tenant?.office_location?.city || 'property';

  // Inline variant for cards - neutral, minimal
  if (variant === 'inline') {
    return (
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs font-medium uppercase tracking-wider"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Message</span>
      </motion.a>
    );
  }

  // Sidebar variant for property detail - calm, professional
  if (variant === 'sidebar') {
    return (
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex items-center justify-center gap-2 w-full bg-foreground text-background px-4 py-3 text-xs font-medium uppercase tracking-wider transition-opacity hover:opacity-90"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Start Conversation</span>
      </motion.a>
    );
  }

  // Floating variant - neutral, confident, no urgency
  return (
    <>
      {/* Mobile: Simple button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="fixed bottom-6 right-6 z-50 md:hidden flex items-center justify-center w-12 h-12 bg-foreground text-background"
      >
        <MessageCircle className="w-5 h-5" />
      </motion.a>

      {/* Desktop: Expandable widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="fixed bottom-6 right-6 z-50 hidden md:block"
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-background border border-border p-6 w-72"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Contact
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
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
                className="flex items-center justify-center gap-2 w-full bg-foreground text-background px-4 py-3 text-xs font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start Conversation</span>
              </a>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-foreground text-background px-5 py-3 text-xs font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};