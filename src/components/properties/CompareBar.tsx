import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, X } from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';

export const CompareBar = () => {
  const { compareIds, clearAll, count } = useCompare();

  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-background/95 backdrop-blur-xl"
      >
        <div className="container-wide flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">
              {count} {count === 1 ? 'property' : 'properties'} selected
            </span>
            <span className="text-xs text-muted-foreground">(max 3)</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Clear
            </button>
            {count >= 2 ? (
              <Link to={`/compare?ids=${compareIds.join(',')}`} className="btn-primary text-xs px-6 py-2.5">
                Compare Now
              </Link>
            ) : (
              <span className="text-xs text-muted-foreground">Select at least 2</span>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
