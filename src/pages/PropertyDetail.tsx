import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImmersiveGallery } from '@/components/properties/ImmersiveGallery';
import { InquiryForm } from '@/components/properties/InquiryForm';
import { AffordabilityCTA } from '@/components/properties/AffordabilityCTA';
import { MarketContextCard } from '@/components/properties/MarketContextCard';
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

  const features = Array.isArray(property.features) ? property.features : [];

  return (
    <div className="min-h-screen bg-background">
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

        {/* Gallery */}
        <ImmersiveGallery
          images={property.property_images || []}
          propertyName={property.name}
        />

        {/* Content */}
        <div className="container-wide py-16 md:py-24">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {property.developer && (
                  <span className="text-xs font-medium text-accent uppercase tracking-luxury mb-4 block">
                    {property.developer.name}
                  </span>
                )}
                
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
                  {property.name}
                </h1>
                
                <p className="text-lg text-muted-foreground">
                  {property.area}, {property.location}
                </p>

                {/* Golden Visa - Subtle mention */}
                {property.golden_visa_eligible && (
                  <p className="text-sm text-accent mt-4">
                    Golden Visa Eligible
                  </p>
                )}
              </motion.div>

              {/* Specs Grid - Clean */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border/30"
              >
                <div>
                  <span className="text-xs uppercase tracking-luxury text-muted-foreground block mb-1">
                    Bedrooms
                  </span>
                  <span className="text-foreground font-medium">
                    {formatBedrooms(property.bedrooms || [])}
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-luxury text-muted-foreground block mb-1">
                    Completion
                  </span>
                  <span className="text-foreground font-medium">
                    {formatDate(property.completion_date)}
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-luxury text-muted-foreground block mb-1">
                    Price From
                  </span>
                  <span className="text-foreground font-medium">
                    {formatPrice(property.price_from)}
                  </span>
                </div>
                {property.payment_plan && (
                  <div>
                    <span className="text-xs uppercase tracking-luxury text-muted-foreground block mb-1">
                      Payment Plan
                    </span>
                    <span className="text-foreground font-medium">
                      {property.payment_plan}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Description - Editorial */}
              {(property.lifestyle_description || property.description) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-serif text-2xl text-foreground mb-6">
                    The Residence
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {property.lifestyle_description || property.description}
                  </p>
                </motion.div>
              )}

              {/* Features - Clean list */}
              {features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-serif text-2xl text-foreground mb-6">
                    Features
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {features.map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 py-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <InquiryForm
                propertyId={property.id}
                propertyName={property.name}
              />

              <MarketContextCard
                area={property.area}
                propertyPriceFrom={property.price_from}
              />

              <AffordabilityCTA priceFrom={property.price_from} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
