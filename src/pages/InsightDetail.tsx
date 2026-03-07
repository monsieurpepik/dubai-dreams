import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const categoryLabels: Record<string, string> = {
  market_pulse: 'Market Pulse',
  project_analysis: 'Project Analysis',
  area_intelligence: 'Area Intelligence',
  investor_playbook: 'Investor Playbook',
};

export default function InsightDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container-wide py-20 animate-pulse">
            <div className="h-4 bg-muted w-32 mb-8" />
            <div className="h-8 bg-muted w-2/3 mb-4" />
            <div className="h-4 bg-muted w-1/3 mb-12" />
            <div className="h-[50vh] bg-muted mb-12" />
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container-wide py-20 text-center">
            <p className="text-muted-foreground">Article not found.</p>
            <Link to="/insights" className="text-foreground text-sm mt-4 inline-block hover:opacity-70">
              ← Back to Intelligence
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={article.seo_title || `${article.title} — OwningDubai`}
        description={article.seo_description || article.excerpt || ''}
      />
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Back link */}
        <div className="container-wide pt-8">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Intelligence
          </Link>
        </div>

        {/* Article Header */}
        <section className="py-12 md:py-16">
          <div className="container-wide max-w-3xl mx-auto">
            <span className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
              {categoryLabels[article.category]}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mt-3 mb-3 leading-[1.15]">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-muted-foreground text-base md:text-lg mb-6">{article.subtitle}</p>
            )}
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span>{article.author_name}</span>
              <span>·</span>
              <span>{article.published_at && format(new Date(article.published_at), 'MMMM d, yyyy')}</span>
              <span>·</span>
              <span>{article.reading_time_min} min read</span>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {article.cover_image_url && (
          <section className="pb-12 md:pb-16">
            <div className="container-wide max-w-4xl mx-auto">
              <div className="aspect-[2/1] overflow-hidden bg-muted">
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="pb-20 md:pb-28">
          <div className="container-wide max-w-3xl mx-auto">
            <div className="prose prose-sm md:prose-base prose-neutral max-w-none
              prose-headings:font-serif prose-headings:font-normal prose-headings:text-foreground
              prose-p:text-muted-foreground prose-p:leading-[1.8]
              prose-a:text-foreground prose-a:underline-offset-4
              prose-strong:text-foreground prose-strong:font-medium
              prose-blockquote:border-l-border prose-blockquote:text-muted-foreground prose-blockquote:font-serif prose-blockquote:italic
              prose-li:text-muted-foreground
            ">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>

            {/* CTA */}
            <div className="mt-16 pt-12 border-t border-border/10 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                Want a private briefing tailored to your portfolio?
              </p>
              <Link
                to="/advisor"
                className="inline-block text-xs tracking-[0.1em] text-foreground border border-border px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                Request Private Brief
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
