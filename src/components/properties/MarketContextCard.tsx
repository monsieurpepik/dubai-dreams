import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Minus, Percent } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MarketContextCardProps {
  area: string;
  propertyPriceFrom: number;
  propertySizeSqft?: number;
}

type Verdict = 'opportunity' | 'fair' | 'premium';

const verdictConfig: Record<Verdict, { label: string; color: string; bgColor: string }> = {
  opportunity: {
    label: 'Opportunity',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  fair: {
    label: 'Fair Value',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  premium: {
    label: 'Premium Location',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
};

const formatCurrency = (value: number): string => {
  return `AED ${value.toLocaleString()}`;
};

export const MarketContextCard = ({ 
  area, 
  propertyPriceFrom,
  propertySizeSqft = 1000
}: MarketContextCardProps) => {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['area-market-data', area],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('area_market_data')
        .select('*')
        .eq('area', area)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!area,
  });

  if (isLoading) {
    return (
      <div className="bg-card border border-border/50 p-8 animate-pulse">
        <div className="h-4 w-32 bg-muted mb-6" />
        <div className="space-y-4">
          <div className="h-8 w-full bg-muted" />
          <div className="h-8 w-full bg-muted" />
        </div>
      </div>
    );
  }

  if (!marketData) {
    return null;
  }

  const estimatedPricePerSqft = propertyPriceFrom / propertySizeSqft;
  
  const priceRatio = estimatedPricePerSqft / marketData.avg_price_sqft;
  let verdict: Verdict;
  if (priceRatio < 0.95) {
    verdict = 'opportunity';
  } else if (priceRatio <= 1.10) {
    verdict = 'fair';
  } else {
    verdict = 'premium';
  }

  const verdictInfo = verdictConfig[verdict];

  const TrendIcon = marketData.trend_12m === 'up' 
    ? TrendingUp 
    : marketData.trend_12m === 'down' 
      ? TrendingDown 
      : Minus;

  const trendColor = marketData.trend_12m === 'up'
    ? 'text-emerald-500'
    : marketData.trend_12m === 'down'
      ? 'text-red-500'
      : 'text-muted-foreground';

  const hasOffplanDiscount = marketData.offplan_vs_ready_delta && marketData.offplan_vs_ready_delta > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border/50 p-6"
    >
      <h3 className="text-sm font-medium text-foreground mb-5 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-accent" />
        {area} Market
      </h3>
      
      <div className="space-y-3">
        {/* Area Average */}
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Area average</span>
          <span className="text-sm text-foreground font-medium">
            {formatCurrency(marketData.avg_price_sqft)}/sqft
          </span>
        </div>

        {/* 12-Month Trend */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">12-month trend</span>
          <div className={`flex items-center gap-1.5 ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            <span className="text-sm font-medium">
              {marketData.trend_12m === 'up' ? '+' : ''}
              {marketData.trend_percentage}%
            </span>
          </div>
        </div>

        {/* Off-Plan Discount - NEW */}
        {hasOffplanDiscount && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Off-plan discount</span>
            <div className="flex items-center gap-1.5 text-accent">
              <Percent className="w-3 h-3" />
              <span className="text-sm font-medium">
                {marketData.offplan_vs_ready_delta.toFixed(0)}% below ready
              </span>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border/30 my-3" />

        {/* Verdict */}
        <div className={`p-3 ${verdictInfo.bgColor}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Verdict</span>
            <span className={`text-xs font-medium uppercase tracking-wider ${verdictInfo.color}`}>
              {verdictInfo.label}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
