import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Search, BedDouble, Banknote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import heroImage from '@/assets/hero-dubai-skyline.jpeg';

function HeroPropertyCard({
  properties,
  activeIndex,
  setActiveIndex,
  goNext,
  goPrev,
  formatPrice
}: {
  properties: any[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  goNext: () => void;
  goPrev: () => void;
  formatPrice: (price: number, opts?: any) => string;
}) {
  const activeProperty = properties[activeIndex] || null;
  if (!activeProperty) return null;

  const primaryImage = [...(activeProperty.property_images || [])]
    .sort((a: any, b: any) => (a.is_primary ? -1 : b.is_primary ? 1 : (a.display_order || 0) - (b.display_order || 0)))[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="w-full md:w-[380px] lg:w-[430px] shrink-0"
    >
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-lg overflow-hidden">
        <div className="flex gap-4 p-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProperty.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-[200px] shrink-0"
            >
              {primaryImage && (
                <img
                  src={primaryImage}
                  alt={activeProperty.name}
                  className="w-full h-[114px] object-cover rounded-md"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex-1 py-2">
            <p className="text-[14px] font-bold tracking-[0.05em] text-white">
              {formatPrice(activeProperty.price_from)}
            </p>
            <p className="text-[13px] text-white/80 mt-2 leading-tight">
              {activeProperty.name}
            </p>
            <Link
              to={`/properties/${activeProperty.slug}`}
              className="inline-flex items-center gap-3 mt-4 text-[12px] font-medium tracking-[0.05em] text-white/90 hover:text-white transition-colors uppercase"
            >
              SHOP NOW <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows + category tabs */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-8">
          {['Properties', 'Villas', 'Apartments'].map((cat, i) => (
            <button
              key={cat}
              className={`text-[12px] font-medium tracking-[0.05em] uppercase transition-colors ${
                i === 0 ? 'text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={goPrev}
            className="text-white/30 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goNext}
            className="text-white/30 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const bedroomOptions = [
  { label: 'Any Beds', value: '' },
  { label: 'Studio', value: '0' },
  { label: '1 BR', value: '1' },
  { label: '2 BR', value: '2' },
  { label: '3 BR', value: '3' },
  { label: '4+ BR', value: '4' },
];

const priceOptions = [
  { label: 'Any Budget', value: '' },
  { label: 'Under AED 1M', value: '0-1000000' },
  { label: 'AED 1M – 2M', value: '1000000-2000000' },
  { label: 'AED 2M – 5M', value: '2000000-5000000' },
  { label: 'AED 5M+', value: '5000000-' },
];

export function HeroSection() {
  const { tenant, formatPrice } = useTenant();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const cityName = tenant?.office_location?.city || 'Dubai';
  const backgroundImage = tenant?.theme?.hero_image_url || heroImage;

  const { data: featuredProperties = [] } = useQuery({
    queryKey: ['hero-featured-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id, name, slug, area, price_from,
          developer:developers(name),
          property_images(url, is_primary, display_order)
        `)
        .order('created_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data || [];
    },
  });

  const goNext = useCallback(() => {
    if (featuredProperties.length === 0) return;
    setActiveIndex((i) => (i + 1) % featuredProperties.length);
  }, [featuredProperties.length]);

  const goPrev = useCallback(() => {
    if (featuredProperties.length === 0) return;
    setActiveIndex((i) => (i === 0 ? featuredProperties.length - 1 : i - 1));
  }, [featuredProperties.length]);

  useEffect(() => {
    if (featuredProperties.length <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext, featuredProperties.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (priceRange) params.set('priceRange', priceRange);
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col">
      {/* Background — Ken Burns zoom */}
      <div className="absolute inset-0">
        <motion.img
          src={backgroundImage}
          alt={`${cityName} skyline`}
          className="h-full w-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 40, ease: 'linear' }}
        />
        {/* 4-directional gradient overlays to black — matching Figma */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" style={{ background: 'linear-gradient(to top, black 0%, rgba(0,0,0,0) 70%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 25%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, black 0%, rgba(0,0,0,0) 30%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 30%)' }} />
      </div>

      {/* Content — bottom-aligned */}
      <div className="relative z-10 flex-1 flex items-end">
        <div className="container-wide w-full pb-16 md:pb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
            {/* Left — Headline */}
            <div className="flex-1 max-w-[713px]">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl lg:text-[64px] text-white font-normal leading-[1.2]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Dubai's Own
                <br />
                Luxury Marketplace
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-6 text-[13px] text-white/70 font-normal max-w-lg leading-[22px]"
              >
                Explore {cityName}'s most exclusive off-plan properties, verified by top developers. From AED 500K with flexible payment plans.
              </motion.p>

              {/* Search Bar */}
              <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="mt-8 bg-black/40 backdrop-blur-xl border border-white/20 rounded-lg p-1.5 flex flex-col sm:flex-row gap-1.5"
              >
                <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-white/[0.06] rounded-md">
                  <Search className="w-4 h-4 text-white/40 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by area, developer, or project"
                    className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/30 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] rounded-md sm:w-32">
                  <BedDouble className="w-4 h-4 text-white/40 shrink-0" />
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="flex-1 bg-transparent text-[13px] text-white/70 focus:outline-none appearance-none cursor-pointer [&>option]:text-white [&>option]:bg-black"
                  >
                    {bedroomOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] rounded-md sm:w-40">
                  <Banknote className="w-4 h-4 text-white/40 shrink-0" />
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="flex-1 bg-transparent text-[13px] text-white/70 focus:outline-none appearance-none cursor-pointer [&>option]:text-white [&>option]:bg-black"
                  >
                    {priceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1127D2] text-white text-[12px] font-medium uppercase tracking-[0.05em] rounded-md hover:bg-[#0d1fb0] transition-colors duration-300 shrink-0"
                >
                  Search
                </button>
              </motion.form>
            </div>

            {/* Right — Property Card (hidden on mobile) */}
            <div className="hidden md:block">
              <HeroPropertyCard
                properties={featuredProperties}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                goNext={goNext}
                goPrev={goPrev}
                formatPrice={formatPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
