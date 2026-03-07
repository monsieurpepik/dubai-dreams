import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { CleanPropertyCard } from '@/components/properties/CleanPropertyCard';
import { ArrowLeft, Globe, MapPin, Calendar } from 'lucide-react';
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
        <main className="pt-20 md:pt-24">
          <div className="container-wide py-20 animate-pulse">
            <div className="h-8 bg-muted w-48 mb-4" />
            <div className="h-4 bg-muted w-96 mb-12" />
          </div>
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

  const stats = [
    { label: 'Years Active', value: developer.years_active ? `${developer.years_active}+` : '—' },
    { label: 'Total Projects', value: developer.total_projects || '—' },
    { label: 'On Platform', value: properties.length },
    ...(developer.founded_year ? [{ label: 'Founded', value: developer.founded_year }] : []),
  ];

  const dev = developer as any;

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${developer.name} — OwningDubai`} description={developer.description || `Projects by ${developer.name} on OwningDubai.`} />
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Back */}
        <div className="container-wide pt-8">
          <Link to="/developers" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3 h-3" />
            All Developers
          </Link>
        </div>

        {/* Banner */}
        {dev.banner_image_url && (
          <div className="container-wide mt-6">
            <div className="relative h-48 md:h-72 lg:h-80 overflow-hidden rounded-sm">
              <img
                src={dev.banner_image_url}
                alt={`${developer.name} banner`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </div>
        )}

        {/* Hero */}
        <section className={`${dev.banner_image_url ? 'pt-8' : 'pt-12'} pb-12 md:pb-20 border-b border-border/10`}>
          <div className="container-wide">
            <div className="flex items-center gap-6 mb-6">
              {developer.logo_url && (
                <img src={developer.logo_url} alt={developer.name} className="h-14 md:h-20 object-contain" />
              )}
              <div>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
                  {developer.name}
                </h1>
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  {dev.headquarters && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {dev.headquarters}
                    </span>
                  )}
                  {dev.founded_year && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" /> Est. {dev.founded_year}
                    </span>
                  )}
                  {dev.website_url && (
                    <a
                      href={dev.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="w-3 h-3" /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {developer.description && (
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed mb-10">
                {developer.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-10">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-2xl md:text-3xl text-foreground">{s.value}</p>
                  <p className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Track Record */}
        {dev.track_record_summary && (
          <section className="py-12 md:py-16 border-b border-border/10 bg-secondary/30">
            <div className="container-wide max-w-3xl">
              <h2 className="font-serif text-xl text-foreground mb-6">Track Record</h2>
              <div className="max-w-none text-sm text-foreground/70 leading-relaxed [&_strong]:text-foreground [&_h3]:text-foreground [&_h3]:font-serif [&_h3]:text-lg [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-4 [&_li]:text-foreground/70 [&_blockquote]:border-l-2 [&_blockquote]:border-border/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/60 [&_blockquote]:my-6 [&_p]:my-3">
                <ReactMarkdown>{dev.track_record_summary}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* Properties */}
        <section className="py-16 md:py-20">
          <div className="container-wide">
            <h2 className="font-serif text-xl text-foreground mb-10">
              Projects by {developer.name}
            </h2>
            {properties.length === 0 ? (
              <p className="text-muted-foreground text-sm">No properties listed yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((p: any, i: number) => (
                  <CleanPropertyCard key={p.id} property={p} index={i} />
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
