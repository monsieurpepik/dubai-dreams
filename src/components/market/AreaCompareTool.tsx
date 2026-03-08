import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, TrendingUp, TrendingDown, ArrowUpRight, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { areaDescriptions, areaTags, areaToSlug } from '@/data/areas';
import { useTenant } from '@/hooks/useTenant';
import type { Tables } from '@/integrations/supabase/types';

type AreaData = Tables<'area_market_data'>;

interface AreaCompareToolProps {
  allAreas: AreaData[];
  propertyCounts?: Record<string, number>;
}

const COLORS = ['hsl(var(--accent))', 'hsl(var(--primary))', 'hsl(var(--muted-foreground))'];
const MAX_COMPARE = 3;

export const AreaCompareTool = ({ allAreas, propertyCounts }: AreaCompareToolProps) => {
  const { formatPrice } = useTenant();
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const addArea = (areaName: string) => {
    if (selectedAreas.length < MAX_COMPARE && !selectedAreas.includes(areaName)) {
      setSelectedAreas(prev => [...prev, areaName]);
    }
    setIsPickerOpen(false);
  };

  const removeArea = (areaName: string) => {
    setSelectedAreas(prev => prev.filter(a => a !== areaName));
  };

  const compareData = useMemo(() => {
    return selectedAreas.map(name => allAreas.find(a => a.area === name)).filter(Boolean) as AreaData[];
  }, [selectedAreas, allAreas]);

  const chartData = useMemo(() => {
    if (compareData.length === 0) return [];
    return [
      { metric: 'Price/sqft', ...Object.fromEntries(compareData.map(a => [a.area, Number(a.avg_price_sqft)])) },
      { metric: '12M Growth %', ...Object.fromEntries(compareData.map(a => [a.area, Number(a.trend_percentage)])) },
      { metric: 'Off-Plan Δ %', ...Object.fromEntries(compareData.map(a => [a.area, Number(a.offplan_vs_ready_delta || 0)])) },
    ];
  }, [compareData]);

  const availableAreas = allAreas.filter(a => !selectedAreas.includes(a.area)).sort((a, b) => a.area.localeCompare(b.area));

  return (
    <section className="py-12 md:py-16 border-b border-border/30">
      <div className="container-wide">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2 flex items-center gap-3">
          <Layers className="w-5 h-5 text-accent" />
          Compare Areas
        </h2>
        <p className="text-sm text-muted-foreground mb-8">Select up to 3 neighborhoods to compare side by side.</p>

        {/* Area Selector Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {selectedAreas.map((name, i) => (
            <motion.button
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => removeArea(name)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-border/50 hover:border-destructive/50 transition-colors group"
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
              <span className="text-sm text-foreground">{name}</span>
              <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive transition-colors" />
            </motion.button>
          ))}

          {selectedAreas.length < MAX_COMPARE && (
            <div className="relative">
              <button
                onClick={() => setIsPickerOpen(!isPickerOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-border/50 hover:border-accent/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add area</span>
              </button>

              <AnimatePresence>
                {isPickerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 mt-2 z-40 bg-background border border-border/50 shadow-lg max-h-60 overflow-y-auto w-64"
                  >
                    {availableAreas.map(a => (
                      <button
                        key={a.area}
                        onClick={() => addArea(a.area)}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors flex items-center justify-between"
                      >
                        <span>{a.area}</span>
                        <span className="text-[10px] text-muted-foreground">{formatPrice(a.avg_price_sqft)}/sqft</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Comparison Content */}
        {compareData.length >= 2 ? (
          <div className="space-y-12">
            {/* Side-by-side Stats */}
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${compareData.length}, 1fr)` }}>
              {compareData.map((area, i) => {
                const tags = areaTags[area.area];
                const desc = areaDescriptions[area.area];
                const count = propertyCounts?.[area.area] || 0;
                const isPositive = area.trend_percentage >= 0;

                return (
                  <motion.div
                    key={area.area}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border border-border/30 p-5 space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                      <Link
                        to={`/areas/${areaToSlug(area.area)}`}
                        className="font-serif text-lg text-foreground hover:text-accent transition-colors"
                      >
                        {area.area}
                      </Link>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                    </div>

                    {/* Description */}
                    {desc && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{desc}</p>
                    )}

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 block mb-0.5">Avg / sqft</span>
                        <span className="text-lg font-serif text-foreground">{formatPrice(area.avg_price_sqft)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 block mb-0.5">12M Growth</span>
                        <div className="flex items-center gap-1">
                          {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-accent" /> : <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
                          <span className={`text-lg font-serif ${isPositive ? 'text-accent' : 'text-destructive'}`}>
                            {isPositive ? '+' : ''}{area.trend_percentage}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 block mb-0.5">Off-Plan Δ</span>
                        <span className="text-lg font-serif text-foreground">
                          {area.offplan_vs_ready_delta != null ? `${area.offplan_vs_ready_delta}%` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 block mb-0.5">Projects</span>
                        <span className="text-lg font-serif text-foreground">{count}</span>
                      </div>
                    </div>

                    {/* Direction */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 block mb-0.5">Market Direction</span>
                      <span className="text-sm text-foreground capitalize">{area.trend_12m}</span>
                    </div>

                    {/* Lifestyle tags */}
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tags.map(tag => {
                          const Icon = tag.icon;
                          return (
                            <span key={tag.label} className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/5 text-muted-foreground text-[10px] uppercase tracking-wider">
                              <Icon className="w-3 h-3" />
                              {tag.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Grouped Bar Chart */}
            <div>
              <h3 className="font-serif text-xl text-foreground mb-6">Visual Comparison</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ left: 20, right: 20 }}>
                    <XAxis dataKey="metric" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {compareData.map((area, i) => (
                      <Bar key={area.area} dataKey={area.area} fill={COLORS[i]} radius={[2, 2, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : compareData.length === 1 ? (
          <div className="text-center py-10 text-muted-foreground text-sm border border-dashed border-border/30">
            Select at least one more area to start comparing.
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground text-sm border border-dashed border-border/30">
            Select 2–3 areas above to see a detailed side-by-side comparison.
          </div>
        )}
      </div>
    </section>
  );
};
