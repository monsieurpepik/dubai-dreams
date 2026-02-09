import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { ImmersiveGallery } from '@/components/properties/ImmersiveGallery';
import { InquiryForm } from '@/components/properties/InquiryForm';
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

  // Fetch area market data
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

  // Fetch similar properties (same area OR similar price range)
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

      // If not enough from same area, supplement with similar price
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

  const scrollToInquiry = () => {
    inquiryFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container-wide">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="aspect-[16/9] mb-12" />
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

  const primaryImage = property.property_images?.find((img: { is_primary?: boolean }) => img.is_primary)?.url || 
    property.property_images?.[0]?.url || 
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=630&fit=crop';

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${property.name} | ${property.area}`}
        description={`${property.name} in ${property.area}, ${property.location}. Starting from ${formatPrice(property.price_from, { compact: true })}. ${property.tagline || property.description?.slice(0, 100) || `Premium off-plan property in ${cityName}.`}`}
        image={primaryImage}
        url={`https://owning${cityName.toLowerCase()}.com/properties/${property.slug}`}
      />
      <Header />
      
      {/* Sticky Product Bar (Apple pattern) */}
      <StickyPropertyBar
        propertyName={property.name}
        price={formatPrice(property.price_from, { compact: true })}
        onRequestReport={scrollToInquiry}
      />

      <main className="pt-20 pb-20 md:pb-0">
        {/* Back Navigation + Share */}
        <div className="container-wide py-6 flex items-center justify-between">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Full-width cinematic hero image */}
        <div className="relative h-[60vh] overflow-hidden">
          <img
            src={primaryImage}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-0 container-wide">
            <h1 className="font-serif text-3xl md:text-5xl text-white mb-2">
              {property.name}
            </h1>
            <p className="text-white/70 text-sm">
              {property.area}, {property.location}
            </p>
          </div>
        </div>

        <ImmersiveGallery
          images={property.property_images || []}
          propertyName={property.name}
        />

        <div className="container-wide py-16 md:py-24">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
              {property.developer && (
                  <Link
                    to={`/properties?developer=${property.developer.slug}`}
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 block hover:text-foreground transition-colors"
                  >
                    {property.developer.name}
                  </Link>
                )}
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
                  {property.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {property.area}, {property.location}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border/30"
              >
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">Starting Price</span>
                  <span className="text-xl text-foreground font-medium">{formatPrice(property.price_from, { compact: true })}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">Bedrooms</span>
                  <span className="text-xl text-foreground font-medium">{formatBedrooms(property.bedrooms || [])}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">Completion</span>
                  <span className="text-xl text-foreground font-medium">{formatDate(property.completion_date)}</span>
                </div>
                {property.payment_plan && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">Payment Plan</span>
                    <span className="text-xl text-foreground font-medium">{property.payment_plan}</span>
                  </div>
                )}
              </motion.div>

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

              {/* Neighborhood Context */}
              <NeighborhoodContext
                area={property.area}
                areaData={areaData}
                propertyPriceFrom={property.price_from}
              />

              {/* Floor Plans */}
              {property.bedrooms && property.bedrooms.length > 0 && (
                <FloorPlans
                  bedrooms={property.bedrooms}
                  propertyName={property.name}
                />
              )}
            </div>

            <div className="space-y-6">
              {/* Why This Project */}
              <WhyThisProject
                roiEstimate={property.roi_estimate}
                goldenVisaEligible={property.golden_visa_eligible}
                completionDate={property.completion_date}
                paymentPlan={property.payment_plan}
                area={property.area}
                areaData={areaData}
              />

              <SimpleMarketContext area={property.area} propertyPriceFrom={property.price_from} />
              
              {/* Payment Plan Breakdown */}
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

              {/* Document Download */}
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
