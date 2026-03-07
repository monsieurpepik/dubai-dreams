import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { CleanPropertyCard } from '@/components/properties/CleanPropertyCard';
import { ArrowLeft, Globe, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function DeveloperProfile() {
  const { slug } = useParams<{ slug: string }>();

  const { data: developer, isLoading: devLoading } = useQuery({
    queryKey: ['developer', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('*')
        .eq('slug', slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['developer-properties', developer?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, developer:developers(*), property_images(*)')
        .eq('developer_id', developer!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!developer?.id,
  });

  if (devLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <div className="h-[60vh] bg-muted animate-pulse" />
        </main>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container-wide py-20 text-center">
            <p className="text-muted-foreground">Developer not found.</p>
            <Link to="/developers" className="text-foreground text-sm mt-4 inline-block hover:opacity-70">
              ← Back to Developers
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const dev = developer as any;

  const stats = [
    { label: 'Years Active', value: developer.years_active ? `${developer.years_active}+` : '—' },
    { label: 'Total Projects', value: developer.total_projects || '—' },
    { label: 'On Platform', value: properties.length },
    ...(developer.founded_year ? [{ label: 'Founded', value: developer.founded_year }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${developer.name} — OwningDubai`} description={developer.description || `Projects by ${developer.name} on OwningDubai.`} />
      <Header />
      <main>
        {/* Full-bleed cinematic banner */}
        <section className="relative h-[60vh] min-h-[450px] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            {dev.banner_image_url ? (
              <img
                src={dev.banner_image_url}
                alt={`${developer.name} banner`}
                className="w-full h-full object-cover scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate]"
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />
          </div>

          {/* Back button — glassmorphic pill */}
          <div className="absolute top-24 md:top-28 left-0 z-20 container-wide">
            <Link
              to="/developers"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs text-background/70 hover:text-background bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] rounded-sm transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              All Developers
            </Link>
          </div>

          {/* Glassmorphic info card overlaid on banner */}
          <div className="relative container-wide pb-12 md:pb-16 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-end gap-6"
            >
              {developer.logo_url && (
                <div className="hidden md:flex items-center justify-center h-20 w-20 bg-white/[0.1] backdrop-blur-xl border border-white/[0.1] rounded-sm p-3 flex-shrink-0">
                  <img
                    src={developer.logo_url}
                    alt={developer.name}
                    className="h-full w-full object-contain brightness-0 invert"
                  />
                </div>
              )}
              <div>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background mb-2">
                  {developer.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  {dev.headquarters && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-background/50">
                      <MapPin className="w-3 h-3" /> {dev.headquarters}
                    </span>
                  )}
                  {dev.founded_year && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-background/50">
                      <Calendar className="w-3 h-3" /> Est. {dev.founded_year}
                    </span>
                  )}
                  {dev.website_url && (
                    <a
                      href={dev.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-background/50 hover:text-background transition-colors"
                    >
                      <Globe className="w-3 h-3" /> Website
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats bar — glassmorphic strip */}
        <section className="relative z-10 -mt-1 bg-foreground">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-10 md:gap-16 py-8 md:py-10 border-b border-background/10"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-2xl md:text-3xl text-background">{s.value}</p>
                  <p className="text-[10px] tracking-[0.15em] text-background/40 uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Description */}
        {developer.description && (
          <section className="py-16 md:py-20 border-b border-border/10">
            <div className="container-wide max-w-3xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-muted-foreground text-base leading-relaxed"
              >
                {developer.description}
              </motion.p>
            </div>
          </section>
        )}

        {/* Track Record */}
        {dev.track_record_summary && (
          <section className="py-16 md:py-20 border-b border-border/10">
            <div className="container-wide max-w-3xl">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">Track Record</h2>
              <div className="max-w-none text-sm text-foreground/70 leading-relaxed [&_strong]:text-foreground [&_h3]:text-foreground [&_h3]:font-serif [&_h3]:text-lg [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-4 [&_li]:text-foreground/70 [&_blockquote]:border-l-2 [&_blockquote]:border-border/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/60 [&_blockquote]:my-6 [&_p]:my-3">
                <ReactMarkdown>{dev.track_record_summary}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* Properties — horizontal scroll carousel on larger screens */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-10">
              Projects by {developer.name}
            </h2>
            {properties.length === 0 ? (
              <p className="text-muted-foreground text-sm">No properties listed yet.</p>
            ) : (
              <>
                {/* Horizontal scroll carousel */}
                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
                  {properties.map((p: any, i: number) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      className="flex-shrink-0 w-[320px] md:w-[380px] snap-start"
                    >
                      <CleanPropertyCard property={p} index={i} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
