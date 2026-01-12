import { motion } from 'framer-motion';
import { Eye, Clock, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

interface LiveActivityBadgeProps {
  propertyId: string;
  status?: string;
  className?: string;
  variant?: 'card' | 'detail';
}

// Simulate live activity data - in production this would come from analytics
const generateActivityData = (propertyId: string) => {
  // Use propertyId to generate consistent but varied numbers
  const hash = propertyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const viewing = (hash % 8) + 3; // 3-10 people
  const hoursAgo = (hash % 12) + 1; // 1-12 hours ago
  const weeklyViews = (hash % 50) + 25; // 25-74 views
  
  return { viewing, hoursAgo, weeklyViews };
};

export const LiveActivityBadge = ({ 
  propertyId, 
  status = 'selling',
  className = '',
  variant = 'card'
}: LiveActivityBadgeProps) => {
  const activity = useMemo(() => generateActivityData(propertyId), [propertyId]);
  
  // Don't show activity for sold out properties
  if (status === 'sold_out') return null;

  const isHighDemand = activity.viewing >= 5;

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className={`flex items-center gap-1.5 text-xs ${className}`}
      >
        <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{activity.viewing}</span> viewing now
          </span>
        </div>
      </motion.div>
    );
  }

  // Detail page variant - more comprehensive
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-wrap items-center gap-3 ${className}`}
    >
      {/* Live viewers */}
      <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-full border border-border/50">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Eye className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm">
          <span className="font-semibold text-foreground">{activity.viewing}</span>
          <span className="text-muted-foreground"> people viewing</span>
        </span>
      </div>

      {/* Last inquiry */}
      <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-full border border-border/50">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Last inquiry: <span className="text-foreground">{activity.hoursAgo}h ago</span>
        </span>
      </div>

      {/* High demand indicator */}
      {isHighDemand && (
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-2 rounded-full border border-amber-500/20"
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">High Demand</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// Compact inline version for cards
export const ActivityDot = ({ propertyId }: { propertyId: string }) => {
  const activity = useMemo(() => generateActivityData(propertyId), [propertyId]);
  
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
      </span>
      <span>{activity.viewing} viewing</span>
    </div>
  );
};
