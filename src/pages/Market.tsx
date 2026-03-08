import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, ArrowUpRight, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { areaToSlug } from '@/data/areas';
import { useTenant } from '@/hooks/useTenant';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

type SortKey = 'area' | 'price' | 'trend' | 'offplan';
type SortDir = 'asc' | 'desc';

const Market = () => {
  const { formatPrice } = useTenant();
  const [sortKey, setSortKey] = useState<SortKey>('price');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const { data: marketData, isLoading } = useQuery({
    queryKey: ['all-area-market-data'],
    queryFn: async () => {
      const { data, error } = await supabase.from('area_market_data').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: totalProperties } = useQuery({
    queryKey: ['total-property-count'],
    queryFn: async () => {
      const { count, error } = await supabase.from('properties').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
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

  const priceChartData = useMemo(() => {
    if (!marketData) return [];
    return [...marketData].sort((a, b) => b.avg_price_sqft - a.avg_price_sqft).map(a => ({
      area: a.area, value: Number(a.avg_price_sqft),
    }));
  }, [marketData]);

  const trendChartData = useMemo(() => {
    if (!marketData) return [];
    return [...marketData].sort((a, b) => b.trend_percentage - a.trend_percentage).map(a => ({
      area: a.area, value: Number(a.trend_percentage),
    }));
  }, [marketData]);

  const sortedTable = useMemo(() => {
    if (!marketData) return [];
    return [...marketData].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'area': cmp = a.area.localeCompare(b.area); break;
        case 'price': cmp = a.avg_price_sqft - b.avg_price_sqft; break;
        case 'trend': cmp = a.trend_percentage - b.trend_percentage; break;
        case 'offplan': cmp = (a.offplan_vs_ready_delta || 0) - (b.offplan_vs_ready_delta || 0); break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [marketData, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <button onClick={() => handleSort(k)} className="flex items-center gap-1 hover:text-foreground transition-colors">
      {label}
      {sortKey === k && <span className="text-[10px]">{sortDir === 'desc' ? '↓' : '↑'}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Dubai Market Trends — DLD Price Intelligence"
        description="Live Dubai property market data: area pricing rankings, 12-month growth trends, and off-plan discounts from DLD transaction records."
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-border/30">
          <div className="container-wide">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="label-editorial mb-3">Market Intelligence</p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                Dubai Market Pulse
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                City-wide pricing benchmarks, growth trajectories, and off-plan advantages — derived from DLD transaction data.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Summary Stats */}
        {stats && (
          <section className="py-12 md:py-16 border-b border-border/30">
            <div className="container-wide">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <span className="label-editorial block mb-2">City Avg / sqft</span>
                  <span className="text-2xl font-serif text-foreground">{formatPrice(stats.avgPrice)}</span>
                </div>
                <div>
                  <span className="label-editorial block mb-2">Avg 12M Growth</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-2xl font-serif text-foreground">+{stats.avgGrowth}%</span>
                  </div>
                </div>
                <div>
                  <span className="label-editorial block mb-2">Top Performer</span>
                  <Link to={`/areas/${areaToSlug(stats.topArea.area)}`} className="text-2xl font-serif text-accent hover:underline">
                    {stats.topArea.area}
                  </Link>
                  <span className="text-xs text-muted-foreground block mt-1">+{stats.topArea.trend_percentage}% growth</span>
                </div>
                <div>
                  <span className="label-editorial block mb-2">Total Projects</span>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-2xl font-serif text-foreground">{totalProperties || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Price Chart */}
        {priceChartData.length > 0 && (
          <section className="py-12 md:py-16 border-b border-border/30">
            <div className="container-wide">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-accent" />
                Areas by Price / sqft
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceChartData} layout="vertical" margin={{ left: 120, right: 40 }}>
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis type="category" dataKey="area" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={110} />
                    <Tooltip
                      formatter={(value: number) => [formatPrice(value), 'Avg/sqft']}
                      contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', fontSize: 12 }}
                    />
                    <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                      {priceChartData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground) / 0.2)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {/* Growth Chart */}
        {trendChartData.length > 0 && (
          <section className="py-12 md:py-16 border-b border-border/30">
            <div className="container-wide">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-accent" />
                12-Month Growth by Area
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendChartData} layout="vertical" margin={{ left: 120, right: 40 }}>
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} unit="%" />
                    <YAxis type="category" dataKey="area" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={110} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, '12M Growth']}
                      contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', fontSize: 12 }}
                    />
                    <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                      {trendChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.value >= 0 ? 'hsl(var(--accent))' : 'hsl(var(--destructive))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {/* Data Table */}
        <section className="py-12 md:py-16">
          <div className="container-wide">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">All Areas — Detailed Data</h2>
            {isLoading ? (
              <div className="h-40 bg-muted/30 animate-pulse" />
            ) : (
              <div className="border border-border/30">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><SortHeader label="Area" k="area" /></TableHead>
                      <TableHead className="text-right"><SortHeader label="Avg / sqft" k="price" /></TableHead>
                      <TableHead className="text-right"><SortHeader label="12M Trend" k="trend" /></TableHead>
                      <TableHead className="text-right"><SortHeader label="Off-Plan Δ" k="offplan" /></TableHead>
                      <TableHead className="text-right">Direction</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTable.map((area) => (
                      <TableRow key={area.id}>
                        <TableCell className="font-medium">
                          <Link to={`/areas/${areaToSlug(area.area)}`} className="hover:text-accent transition-colors">
                            {area.area}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-serif">{formatPrice(area.avg_price_sqft)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center gap-1 ${area.trend_percentage >= 0 ? 'text-accent' : 'text-destructive'}`}>
                            {area.trend_percentage >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {area.trend_percentage >= 0 ? '+' : ''}{area.trend_percentage}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {area.offplan_vs_ready_delta != null ? `${area.offplan_vs_ready_delta}%` : '—'}
                        </TableCell>
                        <TableCell className="text-right capitalize text-muted-foreground">{area.trend_12m}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`/areas/${areaToSlug(area.area)}`} className="text-muted-foreground hover:text-accent">
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Editorial note */}
            <div className="mt-8 text-xs text-muted-foreground/60 max-w-xl">
              <p>
                Market data derived from Dubai Land Department (DLD) transaction records and RERA-registered developments.
                Trends reflect 12-month rolling averages. Off-plan delta represents the typical discount of off-plan
                pricing versus ready/secondary market in the same area.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Market;
