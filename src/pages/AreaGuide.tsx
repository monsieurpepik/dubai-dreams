import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, ArrowUpRight, BarChart3, Users, Palmtree, Briefcase, GraduationCap, PartyPopper } from 'lucide-react';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

// Best-for tags per area
const areaTags: Record<string, { label: string; icon: React.ElementType }[]> = {
  'Palm Jumeirah': [
    { label: 'Luxury Investors', icon: Briefcase },
    { label: 'Families', icon: Users },
    { label: 'Beach Lifestyle', icon: Palmtree },
  ],
  'Business Bay': [
    { label: 'Investors', icon: Briefcase },
    { label: 'Young Professionals', icon: Users },
  ],
  'Dubai Marina': [
    { label: 'Young Professionals', icon: Users },
    { label: 'Nightlife', icon: PartyPopper },
    { label: 'Investors', icon: Briefcase },
  ],
  'Dubai Creek Harbour': [
    { label: 'Families', icon: Users },
    { label: 'Long-Term Growth', icon: TrendingUp },
  ],
  'DAMAC Hills': [
    { label: 'Families', icon: Users },
    { label: 'Value Investors', icon: Briefcase },
  ],
  'Sobha Hartland': [
    { label: 'Families', icon: Users },
    { label: 'Schools', icon: GraduationCap },
  ],
  'Downtown Dubai': [
    { label: 'Luxury Investors', icon: Briefcase },
    { label: 'Nightlife', icon: PartyPopper },
  ],
};

// Approximate coordinates for area map centering
const areaCoordinates: Record<string, [number, number]> = {
  'Palm Jumeirah': [25.1124, 55.1390],
  'Business Bay': [25.1865, 55.2665],
  'Dubai Marina': [25.0800, 55.1400],
  'Dubai Creek Harbour': [25.1970, 55.3430],
  'Dubai Harbour': [25.0930, 55.1320],
  'Downtown Dubai': [25.1972, 55.2744],
  'Sobha Hartland': [25.1750, 55.3100],
  'DAMAC Hills': [25.0250, 55.2450],
  'Al Barari': [25.0830, 55.2840],
  'Mohammed Bin Rashid City': [25.1600, 55.3000],
  'Dubai Hills Estate': [25.1290, 55.2420],
  'JVC': [25.0650, 55.2100],
  'Jumeirah Beach Residence': [25.0780, 55.1340],
  'Dubai South': [24.9300, 55.1700],
  'La Mer': [25.2300, 55.2500],
  'Bluewaters Island': [25.0810, 55.1250],
};

const slugToArea = (slug: string) => slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const AreaGuide = () => {
  const { slug } = useParams<{ slug: string }>();
  const areaName = slug ? slugToArea(slug) : '';
  const { formatPrice, tenant } = useTenant();
  const cityName = tenant?.office_location?.city || 'Dubai';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

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

  // Fetch all areas for comparison
  const { data: allAreasData } = useQuery({
    queryKey: ['all-area-market-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('area_market_data')
        .select('area, avg_price_sqft, trend_percentage');
      if (error) throw error;
      return data;
    },
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
  const tags = areaTags[areaName] || [{ label: 'Investors', icon: Briefcase }];
  const coords = areaCoordinates[areaName];

  // City average for comparison
  const cityAvgPriceSqft = allAreasData
    ? Math.round(allAreasData.reduce((s, a) => s + Number(a.avg_price_sqft), 0) / allAreasData.length)
    : 0;

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || !coords) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current).setView(coords, 14);
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    const defaultIcon = new L.Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    L.marker(coords, { icon: defaultIcon }).addTo(map).bindPopup(`<b>${areaName}</b>`);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coords, areaName]);

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
              
              {/* Best For tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {tags.map((tag) => {
                  const Icon = tag.icon;
                  return (
                    <span key={tag.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-xs font-medium uppercase tracking-wider">
                      <Icon className="w-3.5 h-3.5" />
                      {tag.label}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Area Map */}
        {coords && (
          <section className="border-b border-border/30">
            <div ref={mapContainerRef} className="h-[300px] md:h-[400px] w-full" />
          </section>
        )}

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

        {/* How this area compares */}
        {marketData && cityAvgPriceSqft > 0 && (
          <section className="py-12 md:py-16 border-b border-border/30">
            <div className="container-wide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  How {areaName} Compares
                </h2>
                <div className="max-w-lg space-y-6">
                  {/* Price bar comparison */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>{areaName}</span>
                      <span>{formatPrice(marketData.avg_price_sqft)}/sqft</span>
                    </div>
                    <div className="h-2 bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min((marketData.avg_price_sqft / 3500) * 100, 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>{cityName} Average</span>
                      <span>{formatPrice(cityAvgPriceSqft)}/sqft</span>
                    </div>
                    <div className="h-2 bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min((cityAvgPriceSqft / 3500) * 100, 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-muted-foreground/30"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {marketData.avg_price_sqft > cityAvgPriceSqft
                      ? `${areaName} is ${Math.round(((marketData.avg_price_sqft - cityAvgPriceSqft) / cityAvgPriceSqft) * 100)}% above the ${cityName} average — a premium market.`
                      : `${areaName} is ${Math.round(((cityAvgPriceSqft - marketData.avg_price_sqft) / cityAvgPriceSqft) * 100)}% below the ${cityName} average — strong value potential.`
                    }
                  </p>
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

        {/* SEO Content Block */}
        <section className="py-12 md:py-16 border-t border-border/10">
          <div className="container-wide max-w-3xl">
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>
                {areaName} is one of {cityName}'s most sought-after destinations for off-plan property investment.
                {description} Whether you're a first-time buyer exploring affordable entry points or a seasoned investor
                seeking premium returns, {areaName} offers a range of projects from {cityName}'s most reputable developers.
              </p>
              <p>
                All properties listed on this page are RERA-registered and DLD-compliant. Our advisory team can guide you
                through payment plans, Golden Visa eligibility, and projected returns tailored to {areaName}'s specific
                market dynamics. <Link to="/contact" className="text-foreground underline underline-offset-4 hover:no-underline">Schedule a consultation</Link> to
                discuss your investment strategy.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AreaGuide;
