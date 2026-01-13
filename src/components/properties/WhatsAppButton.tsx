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

  // Inline variant for cards
  if (variant === 'inline') {
    return (
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
      >
        <MessageCircle className="w-4 h-4" />
        <span>WhatsApp</span>
      </motion.a>
    );
  }

  // Sidebar variant for property detail
  if (variant === 'sidebar') {
    return (
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white px-4 py-3 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Chat on WhatsApp</span>
      </motion.a>
    );
  }

  // Floating variant - shows on all screen sizes with expanded state on desktop
  return (
    <>
      {/* Mobile: Simple button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50 md:hidden flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>

      {/* Desktop: Expandable button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50 hidden md:block"
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-background border border-border rounded-2xl shadow-xl p-4 w-72"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Chat with us</p>
                    <p className="text-xs text-muted-foreground">Typically replies instantly</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="bg-muted/50 rounded-xl p-3 mb-3">
                <p className="text-sm text-muted-foreground">
                  👋 Hi! Interested in {cityName} property? Our experts are ready to help you find your perfect investment.
                </p>
              </div>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#20BD5A] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start Chat</span>
              </a>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Chat with us</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};