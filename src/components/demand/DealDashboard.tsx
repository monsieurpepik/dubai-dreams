import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowUpDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DealCard, type DealProperty } from './DealCard';
import { InvestorModeToggle } from './InvestorModeToggle';
import { DealRadarCTA } from './DealRadarCTA';
import { Skeleton } from '@/components/ui/skeleton';
import type { InvestorIntent } from './IntentBuilder';

interface DealDashboardProps {
  intent: InvestorIntent;
  onBack: () => void;
}

type SortKey = 'deal_score' | 'yield_estimate' | 'price_from';

export function DealDashboard({ intent, onBack }: DealDashboardProps) {
  const [investorMode, setInvestorMode] = useState(() => {
    try { return localStorage.getItem('od-investor-mode') === 'true'; } catch { return true; }
  });
  const [sortBy, setSortBy] = useState<SortKey>('deal_score');

  const toggleInvestorMode = (v: boolean) => {
    setInvestorMode(v);
    try { localStorage.setItem('od-investor-mode', String(v)); } catch {}
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['match-deals', intent],
    queryFn: async () => {
      const { data: result, error: fnError } = await supabase.functions.invoke('match-deals', {
        body: intent,
      });
      if (fnError) throw fnError;
      if (result?.error) throw new Error(result.error);
      return (result?.results || []) as DealProperty[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const sorted = [...(data || [])].sort((a, b) => {
    if (sortBy === 'price_from') return a.price_from - b.price_from;
    if (sortBy === 'yield_estimate') return b.yield_estimate - a.yield_estimate;
    return b.deal_score - a.deal_score;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Refine criteria
          </button>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">
            Your Deal Matches
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? 'Analyzing properties...' : `${sorted.length} properties scored by AI`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <InvestorModeToggle enabled={investorMode} onChange={toggleInvestorMode} />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-transparent text-xs focus:outline-none cursor-pointer"
            >
              <option value="deal_score">Deal Score</option>
              <option value="yield_estimate">Yield</option>
              <option value="price_from">Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32 mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-16">
          <p className="text-sm text-destructive">{(error as Error).message}</p>
          <button onClick={onBack} className="mt-4 text-sm text-muted-foreground hover:text-foreground underline">
            Try different criteria
          </button>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && sorted.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sorted.map((property, i) => (
            <DealCard key={property.id} property={property} index={i} investorMode={investorMode} />
          ))}
        </motion.div>
      )}

      {/* No results */}
      {!isLoading && !error && sorted.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No matching properties found.</p>
          <button onClick={onBack} className="mt-4 text-sm underline text-foreground">
            Adjust criteria
          </button>
        </div>
      )}

      {/* Deal Radar */}
      {!isLoading && sorted.length > 0 && (
        <div className="mt-16 border-t border-border">
          <DealRadarCTA filters={intent} />
        </div>
      )}
    </div>
  );
}
