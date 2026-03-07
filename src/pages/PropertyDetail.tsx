import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { ImmersiveGallery } from '@/components/properties/ImmersiveGallery';
import { PropertyInquiryForm } from '@/components/properties/PropertyInquiryForm';
import { AffordabilityCTA } from '@/components/properties/AffordabilityCTA';
import { SimpleMarketContext } from '@/components/properties/SimpleMarketContext';
import { DeveloperTrustCard } from '@/components/properties/DeveloperTrustCard';
import { ConstructionProgress } from '@/components/properties/ConstructionProgress';
import { StickyPropertyBar } from '@/components/properties/StickyPropertyBar';
import { MobileCTABar } from '@/components/properties/MobileCTABar';
import { FloorPlans } from '@/components/properties/FloorPlans';
import { DocumentDownload } from '@/components/properties/DocumentDownload';
import { PaymentPlanBreakdown } from '@/components/properties/PaymentPlanBreakdown';
import { WhyThisProject } from '@/components/properties/WhyThisProject';
import { NeighborhoodContext } from '@/components/properties/NeighborhoodContext';
import { InvestorProfile } from '@/components/properties/InvestorProfile';
import { RiskSignals } from '@/components/properties/RiskSignals';
import { CleanPropertyCard } from '@/components/properties/CleanPropertyCard';
import { BackToTop } from '@/components/ui/BackToTop';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTenant } from '@/hooks/useTenant';
import { useTrackView } from '@/hooks/useTrackView';

const formatBedrooms = (bedrooms: number[]): string => {
  if (!bedrooms || bedrooms.length === 0) return 'TBA';
  if (bedrooms.length === 1) {
    return bedrooms[0] === 0 ? 'Studio' : `${bedrooms[0]} BR`;
  }
  const min = Math.min(...bedrooms);
  const max = Math.max(...bedrooms);
  return `${min === 0 ? 'Studio' : min} – ${max} BR`;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
};

const PropertyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const inquiryFormRef = useRef<HTMLDivElement>(null);
  const { formatPrice, tenant } = useTenant();
  const cityName = tenant?.office_location?.city || 'Dubai';

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          developer:developers(*),
          property_images(*)
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  useTrackView(property?.id);

  const { data: areaData } = useQuery({
    queryKey: ['area-market-data', property?.area],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('area_market_data')
        .select('*')
        .eq('area', property!.area)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!property?.area,
  });

  const { data: similarProperties } = useQuery({
    queryKey: ['similar-properties', property?.id, property?.area, property?.price_from],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, developer:developers(*), property_images(*)')
        .neq('id', property!.id)
        .eq('area', property!.area)
        .limit(6);

      if (error) throw error;

      if ((data?.length || 0) < 4) {
        const priceMin = property!.price_from * 0.7;
        const priceMax = property!.price_from * 1.3;
        const existingIds = [property!.id, ...(data || []).map(p => p.id)];
        const { data: priceData } = await supabase
          .from('properties')
          .select('*, developer:developers(*), property_images(*)')
          .not('id', 'in', `(${existingIds.join(',')})`)
          .gte('price_from', priceMin)
          .lte('price_from', priceMax)
          .limit(6 - (data?.length || 0));

        return [...(data || []), ...(priceData || [])];
      }
      return data || [];
    },
    enabled: !!property?.id,
  });

  const allImages = (property?.property_images || [])
    .sort((a: any, b: any) => (a.is_primary ? -1 : b.is_primary ? 1 : (a.display_order || 0) - (b.display_order || 0)))
    .map((img: any) => img.url)
    .filter(Boolean);

  const primaryImage = allImages[0] || 
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=630&fit=crop';

  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const nextHeroImage = useCallback(() => {
    if (allImages.length <= 1) return;
    setHeroImageIndex((i) => (i + 1) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    if (allImages.length <= 1) return;
    const timer = setInterval(nextHeroImage, 6000);
    return () => clearInterval(timer);
  }, [nextHeroImage, allImages.length]);

  const scrollToInquiry = () => {
    inquiryFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <Skeleton className="h-[70vh] w-full" />
          <div className="container-wide py-16">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-40" />
              </div>
              <Skeleton className="h-96" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container-wide text-center py-32">
            <h1 className="font-serif text-4xl mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The property you're looking for doesn't exist.
            </p>
            <Link to="/properties">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Properties
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${property.name} | ${property.area}`}
        description={`${property.name} in ${property.area}, ${property.location}. Starting from ${formatPrice(property.price_from, { compact: true })}. ${property.tagline || property.description?.slice(0, 100) || `Premium off-plan property in ${cityName}.`}`}
        image={primaryImage}
        url={`https://owning${cityName.toLowerCase()}.com/properties/${property.slug}`}
      />
      <Header />
      
      <StickyPropertyBar
        propertyName={property.name}
        price={formatPrice(property.price_from, { compact: true })}
        onRequestReport={scrollToInquiry}
      />

      <main className="pt-20 pb-20 md:pb-0">
        {/* Full-Bleed Cinematic Hero Gallery */}
        <section className="relative h-[70vh] md:h-[75vh] overflow-hidden">
          {/* Crossfading image layers */}
          {allImages.length > 0 ? (
            allImages.map((src: string, i: number) => (
              <motion.img
                key={src}
                src={src}
                alt={`${property.name} ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={false}
                animate={{
                  opacity: i === heroImageIndex ? 1 : 0,
                  scale: i === heroImageIndex ? 1.02 : 1,
                }}
                transition={{ opacity: { duration: 1.5, ease: 'easeInOut' }, scale: { duration: 20, ease: 'linear' } }}
              />
            ))
          ) : (
            <img src={primaryImage} alt={property.name} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

          {/* Back + Share overlay */}
          <div className="absolute top-6 left-0 right-0 z-20 container-wide flex items-center justify-between">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: property.name, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Floating Glassmorphic Info Card */}
          <div className="absolute bottom-8 left-0 right-0 z-10">
            <div className="container-wide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
              >
                {/* Left: Title */}
                <div>
                  {property.developer && (
                    <p className="text-[10px] tracking-[0.25em] text-white/40 mb-2">
                      {property.developer.name}
                    </p>
                  )}
                  <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white font-light leading-[1.1]">
                    {property.name}
                  </h1>
                  <p className="text-white/50 text-sm mt-2 font-light">
                    {property.area}, {property.location}
                  </p>
                </div>

                {/* Right: Glassmorphic specs card */}
                <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] rounded-lg px-6 py-5 flex gap-8 shrink-0">
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-white/30 mb-1">From</p>
                    <p className="font-serif text-lg text-white">{formatPrice(property.price_from, { compact: true })}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-white/30 mb-1">Bedrooms</p>
                    <p className="font-serif text-lg text-white">{formatBedrooms(property.bedrooms || [])}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-white/30 mb-1">Handover</p>
                    <p className="font-serif text-lg text-white">{formatDate(property.completion_date)}</p>
                  </div>
                  {property.payment_plan && (
                    <div className="hidden md:block">
                      <p className="text-[9px] tracking-[0.15em] uppercase text-white/30 mb-1">Plan</p>
                      <p className="font-serif text-lg text-white">{property.payment_plan}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <ImmersiveGallery
          images={property.property_images || []}
          propertyName={property.name}
        />

        <div className="container-wide py-16 md:py-24">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-16">
              {(property.lifestyle_description || property.description) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl">
                    {property.lifestyle_description || property.description}
                  </p>
                </motion.div>
              )}

              {property.status !== 'ready' && (
                <ConstructionProgress
                  stage={(property.construction_stage as 'pre-launch' | 'foundation' | 'structure' | 'finishing' | 'ready') || 'pre-launch'}
                  percentComplete={property.construction_percent || 0}
                  completionDate={property.completion_date}
                />
              )}

              <NeighborhoodContext
                area={property.area}
                areaData={areaData}
                propertyPriceFrom={property.price_from}
              />

              {property.bedrooms && property.bedrooms.length > 0 && (
                <FloorPlans
                  bedrooms={property.bedrooms}
                  propertyName={property.name}
                />
              )}

              <InvestorProfile
                priceFrom={property.price_from}
                roiEstimate={property.roi_estimate}
                goldenVisaEligible={property.golden_visa_eligible}
                completionDate={property.completion_date}
              />

              <RiskSignals
                completionDate={property.completion_date}
                constructionPercent={property.construction_percent}
                constructionStage={property.construction_stage}
                developerName={property.developer?.name || null}
                developerYearsActive={property.developer?.years_active || null}
                developerTotalProjects={property.developer?.total_projects || null}
              />
            </div>

            <div className="space-y-8">
              <WhyThisProject
                roiEstimate={property.roi_estimate}
                goldenVisaEligible={property.golden_visa_eligible}
                completionDate={property.completion_date}
                paymentPlan={property.payment_plan}
                area={property.area}
                areaData={areaData}
              />

              <SimpleMarketContext area={property.area} propertyPriceFrom={property.price_from} />
              
              {property.payment_plan && (
                <PaymentPlanBreakdown
                  paymentPlan={property.payment_plan}
                  priceFrom={property.price_from}
                  completionDate={property.completion_date}
                  postHandoverYears={property.post_handover_years}
                  postHandoverPercent={property.post_handover_percent}
                />
              )}

              {property.developer && <DeveloperTrustCard developer={property.developer} />}

              <DocumentDownload
                propertyId={property.id}
                propertyName={property.name}
                brochureUrl={property.brochure_url}
              />

              <AffordabilityCTA priceFrom={property.price_from} />
              <div ref={inquiryFormRef}>
                <InquiryForm propertyId={property.id} propertyName={property.name} />
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties && similarProperties.length > 0 && (
          <section className="border-t border-border/30 py-16 md:py-24">
            <div className="container-wide">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-10">
                Similar Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {similarProperties.slice(0, 3).map((p: any, i: number) => (
                  <CleanPropertyCard key={p.id} property={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <MobileCTABar
        propertyName={property.name}
        priceFrom={property.price_from}
        onInquireClick={scrollToInquiry}
      />
      <BackToTop />
    </div>
  );
};

export default PropertyDetail;
