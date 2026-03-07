import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const categoryLabels: Record<string, string> = {
  market_pulse: 'Market Pulse',
  project_analysis: 'Project Analysis',
  area_intelligence: 'Area Intelligence',
  investor_playbook: 'Investor Playbook',
};

export function LatestInsightsSection() {
  const { data: articles = [] } = useQuery({
    queryKey: ['latest-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, category, published_at, reading_time_min')
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (articles.length === 0) return null;

  return (
    <section className="py-16 md:py-24 border-t border-border/10">
      <div className="container-wide">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-xl md:text-2xl text-foreground">
            Latest intelligence
          </h2>
          <Link
            to="/insights"
            className="text-[11px] tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-border/10">
          {articles.map((article: any) => (
            <Link
              key={article.id}
              to={`/insights/${article.slug}`}
              className="group bg-background p-6 md:p-8 hover:bg-secondary/30 transition-colors duration-300"
            >
              <span className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                {categoryLabels[article.category]}
              </span>
              <h3 className="font-serif text-base md:text-lg text-foreground mt-2 mb-4 group-hover:opacity-70 transition-opacity duration-300 leading-snug">
                {article.title}
              </h3>
              <span className="text-[11px] text-muted-foreground">
                {article.published_at && format(new Date(article.published_at), 'MMM d')} · {article.reading_time_min} min
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
