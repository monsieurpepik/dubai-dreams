import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const categoryLabels: Record<string, string> = {
  market_pulse: 'Market Pulse',
  project_analysis: 'Project Analysis',
  area_intelligence: 'Area Intelligence',
  investor_playbook: 'Investor Playbook',
};

const placeholderArticles = [
  {
    id: 'p1',
    slug: 'dubai-real-estate-market-2026',
    title: 'Dubai Real Estate Market Outlook 2026: What Investors Need to Know',
    category: 'market_pulse',
    published_at: new Date().toISOString(),
    reading_time_min: 6,
    cover_image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  },
  {
    id: 'p2',
    slug: 'golden-visa-guide-dubai',
    title: 'The Complete Golden Visa Guide: Property Investment Pathways in the UAE',
    category: 'investor_playbook',
    published_at: new Date().toISOString(),
    reading_time_min: 8,
    cover_image_url: 'https://images.unsplash.com/photo-1582407947092-50b8c1a1efad?w=800&q=80',
  },
  {
    id: 'p3',
    slug: 'downtown-vs-marina-investment',
    title: 'Downtown vs Marina: Where to Invest AED 2M for Maximum Yield',
    category: 'area_intelligence',
    published_at: new Date().toISOString(),
    reading_time_min: 5,
    cover_image_url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
  },
];

export function InsightsSection() {
  const { data: dbArticles = [] } = useQuery({
    queryKey: ['insights-homepage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, category, published_at, reading_time_min, cover_image_url')
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
  });

  const articles = dbArticles.length > 0 ? dbArticles : placeholderArticles;

  return (
    <section className="bg-black py-20 md:py-28">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-[-0.01em]">
              Market Insights
            </h2>
            <p className="mt-2 text-[15px] text-white/60">
              Data-driven intelligence for smart investors
            </p>
          </motion.div>

          <Link
            to="/insights"
            className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-medium text-white/60 hover:text-white transition-colors"
          >
            All articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Article grid — Airbnb card treatment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
          {articles.map((article: any, index: number) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/insights/${article.slug}`}
                className="group block rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(255,255,255,0.04)] overflow-hidden"
              >
                {/* Cover image */}
                {article.cover_image_url && (
                  <div className="overflow-hidden rounded-t-2xl" style={{ aspectRatio: '16/10' }}>
                    <img
                      src={article.cover_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                {/* Content — padded body */}
                <div className="p-5">
                  {/* Category pill */}
                  <span className="inline-block px-3 py-1 text-[11px] font-medium text-white/60 bg-white/[0.06] rounded-full mb-3">
                    {categoryLabels[article.category] || article.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-[16px] text-white font-semibold leading-snug group-hover:text-white/80 transition-colors duration-200">
                    {article.title}
                  </h3>

                  {/* Meta row */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 text-[12px] text-white/30">
                      <span>{article.published_at && format(new Date(article.published_at), 'MMM d, yyyy')}</span>
                      <span>·</span>
                      <span>{article.reading_time_min} min read</span>
                    </div>
                    <span className="text-[13px] font-medium text-white/60 group-hover:text-white transition-colors duration-200">
                      Read &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA — pill */}
        <div className="mt-10 text-center md:hidden">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium text-white bg-white/[0.08] border border-white/[0.1] rounded-full hover:bg-white/[0.14] transition-all"
          >
            All articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
