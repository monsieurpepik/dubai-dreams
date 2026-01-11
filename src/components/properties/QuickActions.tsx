import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, MessageCircle, Eye } from 'lucide-react';

interface QuickActionsProps {
  propertyId: string;
  propertyName: string;
  isVisible: boolean;
  onWhatsApp?: () => void;
}

export const QuickActions = ({ propertyId, propertyName, isVisible, onWhatsApp }: QuickActionsProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    
    // Store in localStorage for persistence
    const saved = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    if (isSaved) {
      localStorage.setItem('savedProperties', JSON.stringify(saved.filter((id: string) => id !== propertyId)));
    } else {
      localStorage.setItem('savedProperties', JSON.stringify([...saved, propertyId]));
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: propertyName,
          text: `Check out ${propertyName} on OwningDubai`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (err) {
      console.log('Share cancelled');
    }
    
    setTimeout(() => setIsSharing(false), 1500);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const message = encodeURIComponent(`Hi, I'm interested in ${propertyName}. Can you provide more details?`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const actions = [
    {
      icon: Heart,
      label: 'Save',
      onClick: handleSave,
      isActive: isSaved,
      activeClass: 'text-red-500 fill-red-500',
    },
    {
      icon: Share2,
      label: 'Share',
      onClick: handleShare,
      isActive: isSharing,
      activeClass: 'text-accent',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      onClick: handleWhatsApp,
      isActive: false,
      activeClass: 'text-green-500',
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-4 right-4 flex flex-col gap-2 z-20"
        >
          {actions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1] 
              }}
              onClick={action.onClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`
                w-10 h-10 rounded-full bg-black/60 backdrop-blur-md
                flex items-center justify-center
                transition-colors duration-300
                ${action.isActive ? action.activeClass : 'text-white hover:text-white/80'}
              `}
            >
              <action.icon className={`w-4 h-4 ${action.isActive && action.label === 'Save' ? 'fill-current' : ''}`} />
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Floating Save Button (always visible, top right)
export const FloatingSaveButton = ({ propertyId, className = '' }: { propertyId: string; className?: string }) => {
  const [isSaved, setIsSaved] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    return saved.includes(propertyId);
  });

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const saved = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    if (isSaved) {
      localStorage.setItem('savedProperties', JSON.stringify(saved.filter((id: string) => id !== propertyId)));
    } else {
      localStorage.setItem('savedProperties', JSON.stringify([...saved, propertyId]));
    }
    setIsSaved(!isSaved);
  };

  return (
    <motion.button
      onClick={handleSave}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className={`
        w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm
        flex items-center justify-center
        transition-all duration-300
        hover:bg-black/60
        ${className}
      `}
    >
      <motion.div
        animate={isSaved ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`w-4 h-4 transition-colors duration-300 ${
            isSaved ? 'text-red-500 fill-red-500' : 'text-white'
          }`} 
        />
      </motion.div>
    </motion.button>
  );
};
