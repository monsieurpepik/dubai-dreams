import { motion } from 'framer-motion';
import { Phone, MessageCircle, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/hooks/useTenant';

interface MobileCTABarProps {
  propertyName: string;
  priceFrom: number;
  onInquireClick: () => void;
  brochureUrl?: string | null;
}

export const MobileCTABar = ({ propertyName, priceFrom, onInquireClick, brochureUrl }: MobileCTABarProps) => {
  const { tenant, formatPrice, getPropertyWhatsAppUrl } = useTenant();
  const contactPhone = tenant?.phone;
  const whatsappUrl = getPropertyWhatsAppUrl(propertyName);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="h-6 bg-gradient-to-t from-background to-transparent" />
      
      <div className="bg-background/95 backdrop-blur-xl border-t border-border/30 px-4 py-3 safe-area-pb">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">From</span>
            <p className="text-lg font-medium text-foreground">{formatPrice(priceFrom, { compact: true })}</p>
          </div>
          <span className="text-xs text-muted-foreground">Off-plan</span>
        </div>
        
        <div className="flex gap-2">
          {contactPhone && (
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center justify-center h-12 w-12 border border-border/50 text-foreground shrink-0 rounded-md"
              aria-label="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-12 w-12 border border-border/50 text-emerald-500 shrink-0 rounded-md"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          {brochureUrl && (
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-12 w-12 border border-border/50 text-foreground shrink-0 rounded-md"
              aria-label="Download Brochure"
            >
              <FileDown className="w-4 h-4" />
            </a>
          )}
          <Button 
            onClick={onInquireClick}
            className="flex-1 h-12 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-wide"
          >
            Schedule Call
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
