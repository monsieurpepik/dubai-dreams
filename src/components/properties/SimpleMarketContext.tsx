import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SimpleMarketContextProps {
  area: string;
  propertyPriceFrom: number;
  propertySizeSqft?: number;
}

type Verdict = 'opportunity' | 'fair' | 'slightly-high';

const verdictConfig: Record<Verdict, { label: string; description: string }> = {
  opportunity: {
    label: 'Opportunity',
    description: 'Priced below area average. Potential for strong appreciation.',
  },
  fair: {
    label: 'Fair Value',
    description: 'Aligned with current market rates for this location.',
  },
  'slightly-high': {
    label: 'Premium',
    description: 'Above average for the area. Reflects premium positioning.',
  },
};

export const SimpleMarketContext = ({ 
  area, 
  propertyPriceFrom,
  propertySizeSqft = 1000
}: SimpleMarketContextProps) => {
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

  if (isLoading || !marketData) {
    return null;
  }

  // Calculate verdict
  const estimatedPricePerSqft = propertyPriceFrom / propertySizeSqft;
  const priceRatio = estimatedPricePerSqft / marketData.avg_price_sqft;
  
  let verdict: Verdict;
  if (priceRatio < 0.95) {
    verdict = 'opportunity';
  } else if (priceRatio <= 1.10) {
    verdict = 'fair';
  } else {
    verdict = 'slightly-high';
  }

  const verdictInfo = verdictConfig[verdict];
  const trendDirection = marketData.trend_12m === 'up' ? '↑' : marketData.trend_12m === 'down' ? '↓' : '→';
  const trendSign = marketData.trend_12m === 'up' ? '+' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border/50 p-6"
    >
      <h3 className="text-sm font-medium text-foreground mb-6">
        {area} Market
      </h3>
      
      <div className="space-y-4">
        {/* 12-Month Trend */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">12-month trend</span>
          <span className="text-foreground">
            {trendDirection} {trendSign}{marketData.trend_percentage}%
          </span>
        </div>

        {/* Off-plan vs Ready */}
        {marketData.offplan_vs_ready_delta && marketData.offplan_vs_ready_delta > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Off-plan discount</span>
            <span className="text-foreground">
              {marketData.offplan_vs_ready_delta.toFixed(0)}% below ready
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border/30 pt-4 mt-4">
          {/* Verdict */}
          <div className="text-center">
            <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
              Market Verdict
            </span>
            <span className="text-lg font-medium text-foreground block mb-2">
              {verdictInfo.label}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {verdictInfo.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
