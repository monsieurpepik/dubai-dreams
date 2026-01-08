import { TrendingUp } from 'lucide-react';

interface ROIBadgeProps {
  roiPercent: number;
  size?: 'sm' | 'md';
}

export const ROIBadge = ({ roiPercent, size = 'sm' }: ROIBadgeProps) => {
  if (!roiPercent || roiPercent <= 0) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 text-muted-foreground ${
      size === 'sm' ? 'text-[10px]' : 'text-xs'
    } font-medium uppercase tracking-wider`}>
      <TrendingUp className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>Est. ROI {roiPercent.toFixed(1)}%</span>
    </div>
  );
};
