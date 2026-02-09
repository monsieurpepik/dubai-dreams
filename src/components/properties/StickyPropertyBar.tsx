import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StickyPropertyBarProps {
  propertyName: string;
  price: string;
  onRequestReport: () => void;
}

export const StickyPropertyBar = ({ propertyName, price, onRequestReport }: StickyPropertyBarProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past ~500px (past gallery + specs)
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30"
        >
          <div className="container-wide flex items-center justify-between h-14">
            <h2 className="font-serif text-lg md:text-xl text-foreground truncate mr-4 !text-lg md:!text-xl">
              {propertyName}
            </h2>
            <div className="hidden md:block text-sm text-muted-foreground mr-4">
              From {price}
            </div>
            <Button
              onClick={onRequestReport}
              className="h-9 px-5 text-xs uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 shrink-0"
            >
              Request Access
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
