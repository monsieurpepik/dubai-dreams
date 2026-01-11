import { motion } from 'framer-motion';
import { TrendingUp, Clock, Flame, Sparkles, Award } from 'lucide-react';

interface DynamicBadgesProps {
  status?: string;
  roiEstimate?: number | null;
  completionDate?: string | null;
  goldenVisaEligible?: boolean;
  isNew?: boolean;
  className?: string;
}

export const DynamicBadges = ({ 
  status, 
  roiEstimate, 
  completionDate,
  goldenVisaEligible,
  isNew,
  className = '' 
}: DynamicBadgesProps) => {
  const badges = [];

  // New Launch Badge
  if (isNew || status === 'new_launch') {
    badges.push({
      icon: Sparkles,
      label: 'New Launch',
      className: 'bg-accent/20 text-accent border-accent/30',
      animate: true,
    });
  }

  // High Demand Badge (based on ROI)
  if (roiEstimate && roiEstimate >= 7.5) {
    badges.push({
      icon: Flame,
      label: 'High Demand',
      className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      animate: true,
    });
  }

  // Handover Soon Badge
  if (completionDate) {
    const handoverDate = new Date(completionDate);
    const now = new Date();
    const monthsUntilHandover = (handoverDate.getFullYear() - now.getFullYear()) * 12 + 
                                 (handoverDate.getMonth() - now.getMonth());
    
    if (monthsUntilHandover > 0 && monthsUntilHandover <= 6) {
      badges.push({
        icon: Clock,
        label: 'Handover Soon',
        className: 'bg-green-500/20 text-green-400 border-green-500/30',
        animate: false,
      });
    }
  }

  // Golden Visa Badge
  if (goldenVisaEligible) {
    badges.push({
      icon: Award,
      label: 'Golden Visa',
      className: 'bg-gold/20 text-gold border-gold/30',
      animate: false,
    });
  }

  // ROI Badge (if notable but not high demand)
  if (roiEstimate && roiEstimate >= 6 && roiEstimate < 7.5) {
    badges.push({
      icon: TrendingUp,
      label: `${roiEstimate.toFixed(1)}% ROI`,
      className: 'bg-white/10 text-white/80 border-white/20',
      animate: false,
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.slice(0, 3).map((badge, index) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1] 
          }}
          className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 
            text-[10px] font-medium uppercase tracking-wider
            rounded-full border backdrop-blur-sm
            ${badge.className}
          `}
        >
          {badge.animate ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <badge.icon className="w-3 h-3" />
            </motion.div>
          ) : (
            <badge.icon className="w-3 h-3" />
          )}
          <span>{badge.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

// Status Badge for overlay position
export const StatusBadge = ({ status, className = '' }: { status: string; className?: string }) => {
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case 'new_launch':
      case 'launching':
        return 'bg-accent text-accent-foreground';
      case 'sold_out':
        return 'bg-destructive/80 text-destructive-foreground';
      case 'limited':
        return 'bg-orange-500/80 text-white';
      default:
        return 'bg-foreground/80 text-background';
    }
  };

  const getStatusLabel = () => {
    switch (status?.toLowerCase()) {
      case 'new_launch':
        return 'New Launch';
      case 'launching':
        return 'Launching Soon';
      case 'sold_out':
        return 'Sold Out';
      case 'limited':
        return 'Limited Units';
      default:
        return status;
    }
  };

  if (!status || status === 'available') return null;

  return (
    <motion.span
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        inline-block px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider
        ${getStatusStyle()}
        ${className}
      `}
    >
      {getStatusLabel()}
    </motion.span>
  );
};
