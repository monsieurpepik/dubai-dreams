import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { CleanPropertyCard } from '@/components/properties/CleanPropertyCard';
import { ArrowLeft } from 'lucide-react';

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
            <Link to="/properties" className="text-foreground text-sm mt-4 inline-block hover:opacity-70">
              ← Back to Properties
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = [
    { label: 'Years Active', value: developer.years_active || '—' },
    { label: 'Total Projects', value: developer.total_projects || '—' },
    { label: 'On Platform', value: properties.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${developer.name} — OwningDubai`} description={developer.description || `Projects by ${developer.name} on OwningDubai.`} />
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Back */}
        <div className="container-wide pt-8">
          <Link to="/properties" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Properties
          </Link>
        </div>

        {/* Hero */}
        <section className="py-12 md:py-20 border-b border-border/10">
          <div className="container-wide">
            <div className="flex items-center gap-6 mb-6">
              {developer.logo_url && (
                <img src={developer.logo_url} alt={developer.name} className="h-12 md:h-16 object-contain" />
              )}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
                {developer.name}
              </h1>
            </div>
            {developer.description && (
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed mb-8">
                {developer.description}
              </p>
            )}
            <div className="flex gap-10">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-2xl text-foreground">{s.value}</p>
                  <p className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
