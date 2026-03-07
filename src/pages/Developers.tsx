import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Building2, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-dubai-skyline.jpeg';

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
      <main className="pt-20">
        {/* Cinematic Hero */}
        <section className="relative h-[45vh] md:h-[50vh] overflow-hidden">
          <motion.img
            src={heroImage}
            alt="Dubai skyline"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: 1.03 }}
            transition={{ duration: 30, ease: 'linear' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          <div className="relative z-10 h-full flex flex-col justify-end">
            <div className="container-wide pb-14 md:pb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-[10px] tracking-[0.3em] text-white/40 mb-4">TRUSTED PARTNERS</p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-light leading-[1.1] max-w-3xl">
                  Dubai's Leading Developers
                </h1>
                <p className="text-white/40 text-sm max-w-xl leading-relaxed mt-4 font-light">
                  Every project on OwningDubai comes from an established developer with a proven track record of delivery.
                </p>
              </motion.div>
            </div>
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

        {/* Image-Forward Grid */}
        <section className="py-16 md:py-20">
          <div className="container-wide">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-muted/30 animate-pulse rounded-sm" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((dev, index) => {
                  const propertyCount = (dev as any).properties?.[0]?.count ?? 0;
                  const hasBanner = !!dev.banner_image_url;

                  return (
                    <motion.div
                      key={dev.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Link
                        to={`/developers/${dev.slug}`}
                        className="group relative block aspect-[4/5] overflow-hidden rounded-sm"
                      >
                        {/* Background image or fallback */}
                        {hasBanner ? (
                          <img
                            src={dev.banner_image_url!}
                            alt={dev.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-muted/60 to-muted/30 flex items-center justify-center">
                            <Building2 className="w-16 h-16 text-muted-foreground/20" />
                          </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Logo at top */}
                        {dev.logo_url && (
                          <div className="absolute top-5 left-5 z-10">
                            <img
                              src={dev.logo_url}
                              alt={`${dev.name} logo`}
                              className="h-8 w-auto object-contain opacity-60 group-hover:opacity-90 transition-opacity"
                            />
                          </div>
                        )}

                        {/* Glassmorphic info overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                          <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-lg p-5">
                            <h2 className="font-serif text-xl text-white mb-1">{dev.name}</h2>
                            {dev.description && (
                              <p className="text-white/40 text-[11px] leading-relaxed line-clamp-2 mb-4">{dev.description}</p>
                            )}

                            <div className="flex gap-6 mb-4">
                              <div>
                                <p className="font-serif text-lg text-white">{dev.total_projects ?? 0}</p>
                                <p className="text-[9px] tracking-[0.15em] uppercase text-white/30">Projects</p>
                              </div>
                              {dev.years_active ? (
                                <div>
                                  <p className="font-serif text-lg text-white">{dev.years_active}+</p>
                                  <p className="text-[9px] tracking-[0.15em] uppercase text-white/30">Years</p>
                                </div>
                              ) : null}
                              <div>
                                <p className="font-serif text-lg text-white">{propertyCount}</p>
                                <p className="text-[9px] tracking-[0.15em] uppercase text-white/30">On Platform</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] text-white/40 group-hover:text-white/70 transition-colors">
                              <span>View Profile</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
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
