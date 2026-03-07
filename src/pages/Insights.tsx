import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const categories = [
  { value: 'all', label: 'All' },
  { value: 'market_pulse', label: 'Market Pulse' },
  { value: 'project_analysis', label: 'Project Analysis' },
  { value: 'area_intelligence', label: 'Area Intelligence' },
  { value: 'investor_playbook', label: 'Investor Playbook' },
] as const;

const categoryLabels: Record<string, string> = {
  market_pulse: 'Market Pulse',
  project_analysis: 'Project Analysis',
  area_intelligence: 'Area Intelligence',
  investor_playbook: 'Investor Playbook',
};

export default function Insights() {
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles', activeCategory],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('*')
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });

      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const featured = articles.find((a: any) => a.is_featured);
  const rest = articles.filter((a: any) => a.id !== featured?.id);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Market Intelligence — OwningDubai" description="Weekly briefings, project deep-dives, and investor playbooks for Dubai off-plan real estate." />
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-border/10">
          <div className="container-wide">
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground mb-4">
              Intelligence
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg">
              Market briefings, project analysis, and investor playbooks — curated weekly by our research team.
            </p>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="border-b border-border/10">
          <div className="container-wide">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide py-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`text-xs tracking-[0.1em] whitespace-nowrap transition-colors duration-300 pb-1 border-b ${
                    activeCategory === cat.value
                      ? 'text-foreground border-foreground'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featured && (
          <section className="py-16 md:py-20 border-b border-border/10">
            <div className="container-wide">
              <Link to={`/insights/${featured.slug}`} className="group block">
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                  {featured.cover_image_url && (
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={featured.cover_image_url}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                      {categoryLabels[featured.category]} · Featured
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground mt-3 mb-4 group-hover:opacity-70 transition-opacity duration-300">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {featured.excerpt}
                      </p>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      {featured.published_at && format(new Date(featured.published_at), 'MMM d, yyyy')} · {featured.reading_time_min} min read
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Article Grid */}
        <section className="py-16 md:py-20">
          <div className="container-wide">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/2] bg-muted mb-4" />
                    <div className="h-3 bg-muted w-24 mb-3" />
                    <div className="h-5 bg-muted w-3/4 mb-2" />
                    <div className="h-3 bg-muted w-1/2" />
                  </div>
                ))}
              </div>
            ) : rest.length === 0 && !featured ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-sm">No articles published yet. Check back soon.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {rest.map((article: any, i: number) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                  >
                    <Link to={`/insights/${article.slug}`} className="group block">
                      {article.cover_image_url && (
                        <div className="aspect-[3/2] overflow-hidden bg-muted mb-4">
                          <img
                            src={article.cover_image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                          />
                        </div>
                      )}
                      <span className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                        {categoryLabels[article.category]}
                      </span>
                      <h3 className="font-serif text-lg text-foreground mt-2 mb-2 group-hover:opacity-70 transition-opacity duration-300">
                        {article.title}
                      </h3>
                      <span className="text-[11px] text-muted-foreground">
                        {article.published_at && format(new Date(article.published_at), 'MMM d, yyyy')} · {article.reading_time_min} min
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
