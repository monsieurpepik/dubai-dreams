import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Building2, ArrowRight } from 'lucide-react';

type SortOption = 'projects' | 'name' | 'years';

export default function Developers() {
  const [sort, setSort] = useState<SortOption>('projects');

  const { data: developers = [], isLoading } = useQuery({
    queryKey: ['developers-index'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('*, properties(count)')
        .order('total_projects', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const sorted = [...developers].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'years') return (b.years_active ?? 0) - (a.years_active ?? 0);
    return (b.total_projects ?? 0) - (a.total_projects ?? 0);
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Developers — OwningDubai" description="Browse Dubai's most established real estate developers. View track records, project portfolios, and find your trusted development partner." />
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-border/10">
          <div className="container-wide">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Trusted Partners</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground max-w-3xl mb-6">
              Dubai's Leading Developers
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
              Every project on OwningDubai comes from an established developer with a proven track record of delivery. Browse their portfolios and histories.
            </p>
          </div>
        </section>

        {/* Sort bar */}
        <div className="border-b border-border/10">
          <div className="container-wide py-4 flex items-center gap-6">
            <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">Sort by</span>
            {(['projects', 'name', 'years'] as SortOption[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setSort(opt)}
                className={`text-xs transition-colors duration-200 ${sort === opt ? 'text-foreground' : 'text-muted-foreground/50 hover:text-foreground'}`}
              >
                {opt === 'projects' ? 'Most Projects' : opt === 'name' ? 'A–Z' : 'Experience'}
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">{developers.length} developers</span>
          </div>
        </div>

        {/* Grid */}
        <section className="py-16 md:py-20">
          <div className="container-wide">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-muted/30 animate-pulse rounded-sm" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((dev) => {
                  const propertyCount = (dev as any).properties?.[0]?.count ?? 0;
                  return (
                    <Link
                      key={dev.id}
                      to={`/developers/${dev.slug}`}
                      className="group border border-border/20 hover:border-border/50 transition-all duration-500 p-8 flex flex-col"
                    >
                      {/* Logo or icon */}
                      <div className="h-12 mb-8 flex items-center">
                        {dev.logo_url ? (
                          <img src={dev.logo_url} alt={dev.name} className="h-10 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <Building2 className="w-8 h-8 text-muted-foreground/40" />
                        )}
                      </div>

                      {/* Name */}
                      <h2 className="font-serif text-xl text-foreground mb-2">{dev.name}</h2>

                      {/* Description */}
                      {dev.description && (
                        <p className="text-muted-foreground text-xs leading-relaxed mb-6 line-clamp-2">{dev.description}</p>
                      )}

                      <div className="mt-auto">
                        {/* Stats */}
                        <div className="flex gap-8 mb-6">
                          <div>
                            <p className="font-serif text-lg text-foreground">{dev.total_projects ?? 0}</p>
                            <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground">Projects</p>
                          </div>
                          {dev.years_active ? (
                            <div>
                              <p className="font-serif text-lg text-foreground">{dev.years_active}+</p>
                              <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground">Years</p>
                            </div>
                          ) : null}
                          <div>
                            <p className="font-serif text-lg text-foreground">{propertyCount}</p>
                            <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground">On Platform</p>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                          <span>View Profile</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
