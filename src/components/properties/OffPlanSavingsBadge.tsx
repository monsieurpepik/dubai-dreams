import { TrendingDown } from 'lucide-react';

interface OffPlanSavingsBadgeProps {
  savingsPercent: number;
  size?: 'sm' | 'md';
}

export const OffPlanSavingsBadge = ({ savingsPercent, size = 'sm' }: OffPlanSavingsBadgeProps) => {
  if (savingsPercent <= 0) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 bg-accent/10 text-accent ${
      size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
    } font-medium uppercase tracking-wider`}>
      <TrendingDown className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>Save {savingsPercent.toFixed(0)}% vs Ready</span>
    </div>
  );
};
