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
    cover_image_url: 'https://images.unsplash.com/photo-1518684079-3c03-d61d57808b2c?w=800&q=80',
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
    <section className="bg-black py-20 md:py-28 border-t border-white/[0.08]">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-3">
              Intelligence
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white">
              Market Insights
            </h2>
          </motion.div>

          <Link
            to="/insights"
            className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.15em] text-white/30 hover:text-white/60 transition-colors uppercase"
          >
            All Articles <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {articles.map((article: any, index: number) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/insights/${article.slug}`} className="group block">
                {/* Cover image */}
                {article.cover_image_url && (
                  <div className="overflow-hidden" style={{ aspectRatio: '16/10' }}>
                    <img
                      src={article.cover_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] tracking-[0.2em] text-white/30 uppercase">
                      {categoryLabels[article.category] || article.category}
                    </span>
                    <span className="text-white/[0.08]">·</span>
                    <span className="text-[10px] text-white/30">
                      {article.published_at && format(new Date(article.published_at), 'MMM d, yyyy')}
                    </span>
                  </div>

                  <h3 className="text-[15px] text-white/60 font-normal leading-snug group-hover:text-white transition-colors duration-300">
                    {article.title}
                  </h3>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-white/30">
                      {article.reading_time_min} min read
                    </span>
                    <span className="text-[10px] tracking-[0.15em] text-white/30 uppercase group-hover:text-white/60 transition-colors duration-300">
                      Read &gt;
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] text-white/30 hover:text-white/60 transition-colors uppercase"
          >
            All Articles <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
