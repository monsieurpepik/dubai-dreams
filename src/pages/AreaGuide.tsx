import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { CleanPropertyGrid } from '@/components/properties/CleanPropertyGrid';
import { useTenant } from '@/hooks/useTenant';

// Area descriptions for SEO and context
const areaDescriptions: Record<string, string> = {
  'Palm Jumeirah': 'Dubai\'s iconic palm-shaped island, home to ultra-luxury residences, five-star hotels, and panoramic sea views. A perennial favourite for international investors seeking prestige and strong capital appreciation.',
  'Business Bay': 'The commercial heartbeat of Dubai, offering a mix of residential towers and office space with stunning Burj Khalifa views. Known for high rental yields and excellent connectivity.',
  'Dubai Marina': 'A vibrant waterfront community with a bustling promenade, yacht clubs, and a cosmopolitan lifestyle. One of Dubai\'s most popular areas for young professionals and investors.',
  'Dubai Creek Harbour': 'A visionary waterfront development by Emaar at the intersection of old and new Dubai. Home to the future Dubai Creek Tower, offering strong growth potential.',
  'Dubai Harbour': 'A premier maritime destination featuring the Dubai Harbour Lighthouse and cruise terminal. Positioned for significant appreciation as development completes.',
  'Downtown Dubai': 'The centre of it all — Burj Khalifa, Dubai Mall, and the Dubai Fountain. Premium positioning with consistently strong demand from both residents and tourists.',
  'Sobha Hartland': 'A green, master-planned community by Sobha Realty in MBR City. Known for high build quality, lush landscapes, and a family-friendly environment.',
  'DAMAC Hills': 'A sprawling golf community by DAMAC Properties offering villas and apartments around the Trump International Golf Club. Excellent value proposition with resort-style amenities.',
  'Al Barari': 'Dubai\'s most exclusive botanical community, offering ultra-private villas surrounded by themed gardens. A rare find for those seeking tranquility within the city.',
  'Mohammed Bin Rashid City': 'One of Dubai\'s largest mixed-use developments, featuring Crystal Lagoons, extensive retail, and diverse residential options from affordable to ultra-luxury.',
  'Dubai Hills Estate': 'A premium master-planned community by Emaar and Meraas, centred around an 18-hole championship golf course. Strong family appeal with excellent schools and parks.',
  'JVC': 'Jumeirah Village Circle offers affordable entry points with growing infrastructure. Popular with first-time investors seeking high rental yields in a developing community.',
  'Jumeirah Beach Residence': 'A beachfront community with a lively walk, dining, and direct beach access. Consistently high demand for short-term rentals and holiday homes.',
  'Dubai South': 'Strategically located near Al Maktoum International Airport and Expo City. An emerging area with long-term growth potential as the airport expansion progresses.',
  'La Mer': 'A trendy beachfront destination in Jumeirah with a creative, Riviera-inspired lifestyle. Premium positioning with a boutique, leisure-focused community feel.',
  'Bluewaters Island': 'Home to Ain Dubai (the world\'s largest observation wheel), this island offers exclusive residences with stunning Arabian Gulf views and a resort lifestyle.',
};

const slugToArea = (slug: string) => slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const AreaGuide = () => {
  const { slug } = useParams<{ slug: string }>();
  const areaName = slug ? slugToArea(slug) : '';
  const { formatPrice, tenant } = useTenant();
  const cityName = tenant?.office_location?.city || 'Dubai';

  const { data: marketData } = useQuery({
    queryKey: ['area-market', areaName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('area_market_data')
        .select('*')
        .eq('area', areaName)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!areaName,
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['area-properties', areaName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, developer:developers(*), property_images(*)')
        .eq('area', areaName)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!areaName,
  });

  const description = areaDescriptions[areaName] || `Discover off-plan investment opportunities in ${areaName}, ${cityName}.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${areaName} — Area Guide | ${cityName}`}
        description={description.slice(0, 155)}
        url={`https://owning${cityName.toLowerCase()}.com/areas/${slug}`}
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-border/30">
          <div className="container-wide">
            <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> All Areas
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="label-editorial mb-3">{cityName} Area Guide</p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">{areaName}</h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">{description}</p>
            </motion.div>
          </div>
        </section>

        {/* Market Stats */}
        {marketData && (
          <section className="py-12 md:py-16 border-b border-border/30">
            <div className="container-wide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
              >
                <div>
                  <span className="label-editorial block mb-2">Avg. Price / sqft</span>
                  <span className="text-2xl font-serif text-foreground">
                    {formatPrice(marketData.avg_price_sqft)}
                  </span>
                </div>
                <div>
                  <span className="label-editorial block mb-2">12-Month Trend</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-2xl font-serif text-foreground">
                      +{marketData.trend_percentage}%
                    </span>
                  </div>
                </div>
                {marketData.offplan_vs_ready_delta != null && (
                  <div>
                    <span className="label-editorial block mb-2">Off-Plan Discount</span>
                    <span className="text-2xl font-serif text-accent">
                      {marketData.offplan_vs_ready_delta}%
                    </span>
                    <span className="text-xs text-muted-foreground block mt-1">vs. ready market</span>
                  </div>
                )}
                <div>
                  <span className="label-editorial block mb-2">Market Direction</span>
                  <span className="text-2xl font-serif text-foreground capitalize">
                    {marketData.trend_12m}
                  </span>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Properties in this area */}
        <section className="py-12 md:py-16">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                Projects in {areaName}
              </h2>
              {properties && properties.length > 0 && (
                <span className="text-xs text-muted-foreground uppercase tracking-luxury">
                  {properties.length} {properties.length === 1 ? 'Project' : 'Projects'}
                </span>
              )}
            </div>

            {properties && properties.length === 0 && !propertiesLoading ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No projects currently listed in {areaName}.</p>
                <Link to="/properties" className="text-xs text-accent hover:underline flex items-center justify-center gap-1">
                  Browse all projects <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <CleanPropertyGrid properties={properties || []} isLoading={propertiesLoading} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AreaGuide;
