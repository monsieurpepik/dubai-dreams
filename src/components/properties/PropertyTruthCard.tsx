import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { DealMeter } from '@/components/demand/DealMeter';
import { TrendingUp, Droplets, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyTruthCardProps {
  propertyId: string;
  propertyName: string;
  area: string;
  priceFrom: number;
  roiEstimate: number | null;
  sizeSqftFrom: number | null;
  completionDate: string | null;
  propertyType: string | null;
}

interface ScoringResult {
  deal_score: number;
  yield_estimate: number;
  liquidity_score: number;
  verdict: 'Undervalued' | 'Fair Price' | 'Premium';
  insight: string;
}

export const PropertyTruthCard = ({
  propertyName,
  area,
  priceFrom,
  roiEstimate,
  sizeSqftFrom,
  completionDate,
  propertyType,
}: PropertyTruthCardProps) => {
  const { data, isLoading } = useQuery<ScoringResult | null>({
    queryKey: ['property-truth', propertyName, area],
    queryFn: async () => {
      const { data: result, error } = await supabase.functions.invoke('match-deals', {
        body: {
          budget: [priceFrom * 0.8, priceFrom * 1.2],
          locations: [area],
          goal: 'capital_growth',
          risk: 'moderate',
          propertyTypes: propertyType ? [propertyType] : [],
        },
      });

      if (error) throw error;

      // Find our property in results or use the top result as proxy
      const results = result?.results || [];
      const match = results.find((r: any) => r.name === propertyName) || results[0];

      if (!match) return null;

      return {
        deal_score: match.deal_score,
        yield_estimate: match.yield_estimate,
        liquidity_score: match.liquidity_score,
        verdict: match.verdict,
        insight: match.insight,
      };
    },
    staleTime: 1000 * 60 * 30, // 30 min cache
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  if (!data) return null;

  const verdictColor = {
    Undervalued: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    'Fair Price': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    Premium: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  }[data.verdict];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          AI Deal Analysis
        </h3>
        <span className={`text-[10px] font-medium uppercase tracking-[0.1em] px-2.5 py-1 rounded-full border ${verdictColor}`}>
          {data.verdict}
        </span>
      </div>

      <div className="flex justify-center mb-5">
        <DealMeter score={data.deal_score} size={100} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Est. Yield</p>
            <p className="text-sm font-medium text-foreground">{data.yield_estimate.toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
            <Droplets className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Liquidity</p>
            <p className="text-sm font-medium text-foreground">{data.liquidity_score}/100</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
        <Shield className="w-3 h-3 inline mr-1 -mt-0.5" />
        {data.insight}
      </p>
    </motion.div>
  );
};
