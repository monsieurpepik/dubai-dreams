import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/hooks/useTenant';

export function HomeMobileCTA() {
  const { tenant, getPropertyWhatsAppUrl } = useTenant();
  const contactPhone = tenant?.phone;
  const whatsappUrl = getPropertyWhatsAppUrl('your off-plan portfolio');

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      <div className="h-4 bg-gradient-to-t from-background to-transparent" />
      <div className="bg-background/95 backdrop-blur-xl border-t border-border/30 px-4 py-3 safe-area-pb">
        <div className="flex gap-2">
          {contactPhone && (
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center justify-center h-11 w-11 border border-border/50 text-foreground shrink-0 rounded-md"
              aria-label="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-11 w-11 border border-border/50 text-emerald-500 shrink-0 rounded-md"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <Button
            onClick={() => {
              const el = document.getElementById('advisor-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 h-11 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-wide"
          >
            Speak to an Advisor
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
