import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, SortAsc, MapPin, CheckSquare, Square, Layers } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { areaDescriptions, areaTags, areaToSlug } from '@/data/areas';
import { useTenant } from '@/hooks/useTenant';

type SortOption = 'alphabetical' | 'price-high' | 'price-low' | 'growth';

const Areas = () => {
  const [sort, setSort] = useState<SortOption>('growth');
  const [compareAreas, setCompareAreas] = useState<string[]>([]);
  const { formatPrice } = useTenant();
  const navigate = useNavigate();

  const toggleCompare = (areaName: string) => {
    setCompareAreas(prev =>
      prev.includes(areaName)
        ? prev.filter(a => a !== areaName)
        : prev.length < 3 ? [...prev, areaName] : prev
    );
  };

  const goToCompare = () => {
    const params = compareAreas.map(encodeURIComponent).join(',');
    navigate(`/market?compare=${params}#compare`);
  };

  const { data: marketData, isLoading } = useQuery({
    queryKey: ['all-area-market-data'],
    queryFn: async () => {
      const { data, error } = await supabase.from('area_market_data').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: propertyCounts } = useQuery({
    queryKey: ['area-property-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('area');
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((p) => { counts[p.area] = (counts[p.area] || 0) + 1; });
      return counts;
    },
  });

  const sortedAreas = useMemo(() => {
    if (!marketData) return [];
    const areas = [...marketData];
    switch (sort) {
      case 'alphabetical': return areas.sort((a, b) => a.area.localeCompare(b.area));
      case 'price-high': return areas.sort((a, b) => b.avg_price_sqft - a.avg_price_sqft);
      case 'price-low': return areas.sort((a, b) => a.avg_price_sqft - b.avg_price_sqft);
      case 'growth': return areas.sort((a, b) => b.trend_percentage - a.trend_percentage);
      default: return areas;
    }
  }, [marketData, sort]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'growth', label: 'Strongest Growth' },
    { value: 'price-high', label: 'Price: High → Low' },
    { value: 'price-low', label: 'Price: Low → High' },
    { value: 'alphabetical', label: 'A → Z' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Dubai Neighborhood Guide — Area Intelligence"
        description="Explore Dubai's top neighborhoods for off-plan investment. Compare pricing, growth trends, and lifestyle across every major area."
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-border/30">
          <div className="container-wide">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="label-editorial mb-3">City Intelligence</p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                Neighborhood Guide
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                Compare Dubai's most investable neighborhoods side by side — pricing benchmarks, growth trajectories, and what makes each area unique.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Sort Bar */}
        <section className="py-4 border-b border-border/20 sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-sm">
          <div className="container-wide flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <SortAsc className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase whitespace-nowrap transition-colors ${
                  sort === opt.value
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground flex-shrink-0">
              {sortedAreas.length} areas
            </span>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12 md:py-16">
          <div className="container-wide">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-muted/30 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedAreas.map((area, index) => {
                  const slug = areaToSlug(area.area);
                  const description = areaDescriptions[area.area];
                  const tags = areaTags[area.area];
                  const count = propertyCounts?.[area.area] || 0;
                  const isPositive = area.trend_percentage >= 0;
                  const isSelected = compareAreas.includes(area.area);

                  return (
                    <motion.div
                      key={area.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03 }}
                      className="relative"
                    >
                      {/* Compare checkbox */}
                      <button
                        onClick={(e) => { e.preventDefault(); toggleCompare(area.area); }}
                        className={`absolute top-3 right-3 z-10 p-1 transition-colors ${
                          isSelected ? 'text-accent' : 'text-muted-foreground/40 hover:text-muted-foreground'
                        }`}
                        title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
                      >
                        {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      </button>
                      <Link
                        to={`/areas/${slug}`}
                        className="group block border border-border/30 hover:border-border/60 transition-all duration-300 p-6 h-full"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors">
                              {area.area}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {count} {count === 1 ? 'project' : 'projects'}
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent transition-colors" />
                        </div>

                        {/* Description */}
                        {description && (
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                            {description}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-end gap-6 mb-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 block mb-0.5">Avg / sqft</span>
                            <span className="text-lg font-serif text-foreground">{formatPrice(area.avg_price_sqft)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 block mb-0.5">12M Trend</span>
                            <div className="flex items-center gap-1">
                              {isPositive ? (
                                <TrendingUp className="w-3.5 h-3.5 text-accent" />
                              ) : (
                                <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                              )}
                              <span className={`text-lg font-serif ${isPositive ? 'text-accent' : 'text-destructive'}`}>
                                {isPositive ? '+' : ''}{area.trend_percentage}%
                              </span>
                            </div>
                          </div>
                          {area.offplan_vs_ready_delta != null && area.offplan_vs_ready_delta !== 0 && (
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 block mb-0.5">Off-Plan</span>
                              <span className="text-lg font-serif text-accent">{area.offplan_vs_ready_delta}%</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {tags && tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {tags.slice(0, 3).map((tag) => {
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
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* SEO Block */}
        <section className="py-12 md:py-16 border-t border-border/10">
          <div className="container-wide max-w-3xl">
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>
                Dubai's real estate market spans over 30 distinct neighborhoods, each with unique investment characteristics.
                From the ultra-premium waterfront of Palm Jumeirah to the high-yield potential of JVC, understanding area-level
                dynamics is critical for making informed investment decisions.
              </p>
              <p>
                All market data is sourced from DLD (Dubai Land Department) transaction records and RERA-registered
                developments. Pricing benchmarks are updated regularly to reflect current market conditions.
                <Link to="/contact" className="text-foreground underline underline-offset-4 hover:no-underline ml-1">
                  Speak with an advisor
                </Link> for personalised area recommendations.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Areas;
