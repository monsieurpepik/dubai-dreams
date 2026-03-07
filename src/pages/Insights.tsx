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
      <main>
        {/* Cinematic Hero */}
        <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/hero-dubai-skyline.jpeg"
              alt="Dubai skyline"
              className="w-full h-full object-cover scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/20" />
          </div>

          <div className="relative container-wide pb-12 md:pb-16 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-background/50 mb-3">
                Research & Analysis
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background mb-3">
                Intelligence
              </h1>
              <p className="text-background/50 text-sm max-w-lg">
                Market briefings, project analysis, and investor playbooks — curated weekly by our research team.
              </p>
            </motion.div>

            {/* Category Tabs — glassmorphic bar */}
            <div className="mt-8 inline-flex gap-1 bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] rounded-sm p-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 text-[10px] tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-300 rounded-sm ${
                    activeCategory === cat.value
                      ? 'bg-background text-foreground'
                      : 'text-background/60 hover:text-background'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Article — Full-width cinematic card */}
        {featured && (
          <section className="py-16 md:py-20 border-b border-border/10">
            <div className="container-wide">
              <Link to={`/insights/${featured.slug}`} className="group block">
                <div className="relative aspect-[21/9] overflow-hidden bg-muted rounded-sm">
                  {featured.cover_image_url && (
                    <img
                      src={featured.cover_image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />

                  {/* Glassmorphic overlay card */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="max-w-2xl">
                      <span className="inline-block px-3 py-1 text-[10px] tracking-[0.15em] uppercase bg-white/[0.1] backdrop-blur-md border border-white/[0.1] text-background/80 rounded-sm mb-4">
                        {categoryLabels[featured.category]} · Featured
                      </span>
                      <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-background mb-3 group-hover:opacity-80 transition-opacity duration-300">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-background/60 text-sm leading-relaxed mb-4 max-w-xl">
                          {featured.excerpt}
                        </p>
                      )}
                      <span className="text-[11px] text-background/40">
                        {featured.published_at && format(new Date(featured.published_at), 'MMM d, yyyy')} · {featured.reading_time_min} min read
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Article Grid — image-forward with hover scale */}
        <section className="py-16 md:py-20">
          <div className="container-wide">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/2] bg-muted mb-4 rounded-sm" />
                    <div className="h-3 bg-muted w-24 mb-3 rounded-sm" />
                    <div className="h-5 bg-muted w-3/4 mb-2 rounded-sm" />
                    <div className="h-3 bg-muted w-1/2 rounded-sm" />
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
                        <div className="relative aspect-[3/2] overflow-hidden bg-muted mb-4 rounded-sm">
                          <img
                            src={article.cover_image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
