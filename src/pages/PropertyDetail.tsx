import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
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
import { WhatsAppButton } from '@/components/properties/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(1)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

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
            <Link to="/#properties">
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
        description={`${property.name} in ${property.area}, ${property.location}. Starting from ${formatPrice(property.price_from)}. ${property.tagline || property.description?.slice(0, 100) || 'Premium off-plan property in Dubai.'}`}
        image={primaryImage}
        url={`https://owningdubai.com/properties/${property.slug}`}
      />
      <Header />
      <main className="pt-20">
        {/* Back Navigation */}
        <div className="container-wide py-6">
          <Link
            to="/#properties"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>

        {/* Gallery - Cinematic Hero */}
        <ImmersiveGallery
          images={property.property_images || []}
          propertyName={property.name}
        />

        {/* Content */}
        <div className="container-wide py-16 md:py-24">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main Content - Decisive, Clean */}
            <div className="lg:col-span-2 space-y-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {property.developer && (
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 block">
                    {property.developer.name}
                  </span>
                )}
                
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
                  {property.name}
                </h1>
                
                <p className="text-lg text-muted-foreground">
                  {property.area}, {property.location}
                </p>
              </motion.div>

              {/* Specs Grid - Minimal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border/30"
              >
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                    Starting Price
                  </span>
                  <span className="text-xl text-foreground font-medium">
                    {formatPrice(property.price_from)}
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                    Bedrooms
                  </span>
                  <span className="text-xl text-foreground font-medium">
                    {formatBedrooms(property.bedrooms || [])}
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                    Completion
                  </span>
                  <span className="text-xl text-foreground font-medium">
                    {formatDate(property.completion_date)}
                  </span>
                </div>
                {property.payment_plan && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                      Payment Plan
                    </span>
                    <span className="text-xl text-foreground font-medium">
                      {property.payment_plan}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Description - Editorial, 2-3 lines max */}
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

              {/* Construction Progress - Visual delivery timeline */}
              {property.status !== 'ready' && (
                <ConstructionProgress
                  stage={(property.construction_stage as 'pre-launch' | 'foundation' | 'structure' | 'finishing' | 'ready') || 'pre-launch'}
                  percentComplete={property.construction_percent || 0}
                  completionDate={property.completion_date}
                />
              )}
            </div>

            {/* Sidebar - Focused, no clutter */}
            <div className="space-y-6">
              {/* Market Context - Simple & Reassuring */}
              <SimpleMarketContext
                area={property.area}
                propertyPriceFrom={property.price_from}
              />

              {/* Developer Trust Card */}
              {property.developer && (
                <DeveloperTrustCard developer={property.developer} />
              )}

              {/* Affordability CTA - Primary action */}
              <AffordabilityCTA priceFrom={property.price_from} />

              {/* Inquiry Form */}
              <div ref={inquiryFormRef}>
                <InquiryForm
                  propertyId={property.id}
                  propertyName={property.name}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton propertyName={property.name} />
    </div>
  );
};

export default PropertyDetail;
