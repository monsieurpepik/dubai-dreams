import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileCTABarProps {
  propertyName: string;
  priceFrom: number;
  onInquireClick: () => void;
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(1)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

export const MobileCTABar = ({ propertyName, priceFrom, onInquireClick }: MobileCTABarProps) => {
  const whatsappMessage = `Hi, I'm interested in ${propertyName}. Can you provide more details?`;
  const whatsappUrl = `https://wa.me/971000000000?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Gradient fade above the bar */}
      <div className="h-6 bg-gradient-to-t from-background to-transparent" />
      
      {/* CTA Bar */}
      <div className="bg-background/95 backdrop-blur-xl border-t border-border/30 px-4 py-3 safe-area-pb">
        {/* Price indicator */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">From</span>
            <p className="text-lg font-medium text-foreground">{formatPrice(priceFrom)}</p>
          </div>
          <span className="text-xs text-muted-foreground">Off-plan</span>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button 
              variant="outline" 
              className="w-full h-12 gap-2 border-border/50 hover:bg-foreground/5 text-xs uppercase tracking-wide"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
          </a>
          
          <Button 
            onClick={onInquireClick}
            className="flex-1 h-12 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-wide"
          >
            <Phone className="w-4 h-4 mr-2" />
            Inquire Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
