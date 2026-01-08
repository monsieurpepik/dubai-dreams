import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  propertyName?: string;
}

export const WhatsAppButton = ({ propertyName }: WhatsAppButtonProps) => {
  const message = propertyName 
    ? `Hi, I'm interested in ${propertyName}. Can you provide more details?`
    : `Hi, I'm interested in Dubai off-plan properties.`;
  
  const whatsappUrl = `https://wa.me/971000000000?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#20bd5a] transition-colors duration-300"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-medium">WhatsApp</span>
    </motion.a>
  );
};
