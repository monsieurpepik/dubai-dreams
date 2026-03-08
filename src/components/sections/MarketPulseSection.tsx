import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { areaToSlug } from '@/data/areas';

export const MarketPulseSection = () => {
  const { formatPrice } = useTenant();

  const { data: marketData } = useQuery({
    queryKey: ['all-area-market-data'],
    queryFn: async () => {
      const { data, error } = await supabase.from('area_market_data').select('*');
      if (error) throw error;
      return data;
    },
  });

  const stats = useMemo(() => {
    if (!marketData || marketData.length === 0) return null;
    const avgPrice = Math.round(marketData.reduce((s, a) => s + Number(a.avg_price_sqft), 0) / marketData.length);
    const avgGrowth = +(marketData.reduce((s, a) => s + Number(a.trend_percentage), 0) / marketData.length).toFixed(1);
    const topArea = [...marketData].sort((a, b) => b.trend_percentage - a.trend_percentage)[0];
    const offplanAreas = marketData.filter(a => a.offplan_vs_ready_delta != null && a.offplan_vs_ready_delta !== 0);
    const avgOffplan = offplanAreas.length > 0
      ? +(offplanAreas.reduce((s, a) => s + Number(a.offplan_vs_ready_delta), 0) / offplanAreas.length).toFixed(1)
      : null;
    return { avgPrice, avgGrowth, topArea, avgOffplan };
  }, [marketData]);

  const chartData = useMemo(() => {
    if (!marketData) return [];
    return [...marketData]
      .sort((a, b) => b.avg_price_sqft - a.avg_price_sqft)
      .slice(0, 8)
      .map(a => ({ area: a.area, value: Number(a.avg_price_sqft) }));
  }, [marketData]);

  if (!stats) return null;

  return (
    <section className="py-16 md:py-24 border-t border-border/10">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="label-editorial mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Market Intelligence
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Dubai Market Pulse
              </h2>
            </div>
            <Link
              to="/market"
              className="hidden md:flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Full market data <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 block mb-1">City Avg / sqft</span>
              <span className="text-xl md:text-2xl font-serif text-foreground">{formatPrice(stats.avgPrice)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 block mb-1">Avg 12M Growth</span>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-xl md:text-2xl font-serif text-foreground">+{stats.avgGrowth}%</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 block mb-1">Top Performer</span>
              <Link to={`/areas/${areaToSlug(stats.topArea.area)}`} className="text-xl md:text-2xl font-serif text-accent hover:underline">
                {stats.topArea.area}
              </Link>
            </div>
            {stats.avgOffplan != null && (
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 block mb-1">Avg Off-Plan Δ</span>
                <span className="text-xl md:text-2xl font-serif text-accent">{stats.avgOffplan}%</span>
              </div>
            )}
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="h-[280px] md:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 110, right: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis type="category" dataKey="area" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={100} />
                  <Tooltip
                    formatter={(value: number) => [formatPrice(value), 'Avg/sqft']}
                    contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground) / 0.15)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Mobile CTA */}
          <Link
            to="/market"
            className="md:hidden mt-8 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-accent"
          >
            Explore full market data <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
