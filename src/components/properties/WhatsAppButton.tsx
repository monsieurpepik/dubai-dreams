import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl, getPropertyWhatsAppUrl } from '@/config/contact';
import { analytics } from '@/lib/analytics';

interface WhatsAppButtonProps {
  propertyName?: string;
}

export const WhatsAppButton = ({ propertyName }: WhatsAppButtonProps) => {
  const whatsappUrl = propertyName 
    ? getPropertyWhatsAppUrl(propertyName)
    : getWhatsAppUrl();

  const handleClick = () => {
    analytics.clickWhatsApp(propertyName);
  };

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, opacity: 0.95 }}
      whileTap={{ scale: 0.98 }}
      transition={{ delay: 1, duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300 ease-out hover:shadow-xl"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-medium">WhatsApp</span>
    </motion.a>
  );
};
