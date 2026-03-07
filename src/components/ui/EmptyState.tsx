import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-24 space-y-5"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
        <Icon className="w-7 h-7 text-muted-foreground/30" />
      </div>
      <div>
        <p className="text-lg font-serif text-foreground mb-2">{title}</p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
      </div>
      {(actionLabel || secondaryLabel) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          {actionLabel && actionHref && (
            <Link to={actionHref} className="btn-primary inline-flex items-center gap-2">
              {actionLabel}
            </Link>
          )}
          {actionLabel && onAction && !actionHref && (
            <button onClick={onAction} className="btn-primary">
              {actionLabel}
            </button>
          )}
          {secondaryLabel && secondaryHref && (
            <Link to={secondaryHref} className="btn-outline inline-flex items-center gap-2">
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}
