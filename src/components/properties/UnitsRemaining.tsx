import { motion } from 'framer-motion';
import { AlertCircle, Flame } from 'lucide-react';
import { useMemo } from 'react';

interface UnitsRemainingProps {
  propertyId: string;
  status?: string;
  className?: string;
  variant?: 'badge' | 'bar';
}

// Simulate units remaining - in production this would come from database
const generateUnitsData = (propertyId: string) => {
  const hash = propertyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const totalUnits = ((hash % 5) + 1) * 50; // 50, 100, 150, 200, 250
  const soldPercent = (hash % 40) + 55; // 55-94% sold
  const remaining = Math.ceil(totalUnits * (1 - soldPercent / 100));
  
  return { totalUnits, soldPercent, remaining };
};

export const UnitsRemaining = ({ 
  propertyId, 
  status = 'selling',
  className = '',
  variant = 'badge'
}: UnitsRemainingProps) => {
  const units = useMemo(() => generateUnitsData(propertyId), [propertyId]);
  
  // Don't show for sold out or pre-launch
  if (status === 'sold_out') return null;
  
  const isLimited = units.remaining <= 10;
  const isUrgent = units.remaining <= 5;

  if (variant === 'badge') {
    if (!isLimited) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-1.5 ${className}`}
      >
        <div className={`
          flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
          ${isUrgent 
            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' 
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
          }
        `}>
          {isUrgent ? (
            <Flame className="w-3 h-3" />
          ) : (
            <AlertCircle className="w-3 h-3" />
          )}
          <span>Only {units.remaining} left</span>
        </div>
      </motion.div>
    );
  }

  // Bar variant - shows progress
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Availability</span>
        <span className={`font-medium ${isUrgent ? 'text-red-500' : isLimited ? 'text-amber-500' : 'text-foreground'}`}>
          {units.remaining} units remaining
        </span>
      </div>
      
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${units.soldPercent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 rounded-full ${
            isUrgent 
              ? 'bg-gradient-to-r from-red-500 to-red-400' 
              : isLimited 
                ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                : 'bg-gradient-to-r from-primary to-accent'
          }`}
        />
      </div>
      
      <p className="text-xs text-muted-foreground">
        {units.soldPercent}% sold • {units.totalUnits} total units
      </p>
    </motion.div>
  );
};

// Minimal dot indicator for cards
export const ScarcityDot = ({ propertyId, status }: { propertyId: string; status?: string }) => {
  const units = useMemo(() => generateUnitsData(propertyId), [propertyId]);
  
  if (status === 'sold_out' || units.remaining > 10) return null;
  
  const isUrgent = units.remaining <= 5;
  
  return (
    <span className={`text-xs font-medium ${isUrgent ? 'text-red-500' : 'text-amber-500'}`}>
      {units.remaining} left
    </span>
  );
};
