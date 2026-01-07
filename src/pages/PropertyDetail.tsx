import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Heart, CheckCircle2, Waves, Utensils, Sparkles, ConciergeBell, Car, Theater } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImmersiveGallery } from '@/components/properties/ImmersiveGallery';
import { PropertySpecs } from '@/components/properties/PropertySpecs';
import { PaymentPlanBreakdown } from '@/components/properties/PaymentPlanBreakdown';
import { PropertyMortgageCalculator } from '@/components/properties/PropertyMortgageCalculator';
import { FloorPlans } from '@/components/properties/FloorPlans';
import { PrivateConsultationForm } from '@/components/properties/PrivateConsultationForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ExclusiveAmenity {
  icon: string;
  title: string;
  description: string;
}

// Simple icon mapping for amenities
const getAmenityIcon = (iconName: string) => {
  const iconMap: Record<string, React.ElementType> = {
    waves: Waves,
    utensils: Utensils,
    spa: Sparkles,
    'concierge-bell': ConciergeBell,
    car: Car,
    theater: Theater,
  };
  return iconMap[iconName] || CheckCircle2;
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
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/#off-plan">
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
            to="/#off-plan"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Properties</span>
          </Link>
        </div>

        {/* Immersive Gallery */}
        <ImmersiveGallery
          images={property.property_images || []}
          propertyName={property.name}
        />

        {/* Content */}
        <div id="property-content" className="container-wide py-16 md:py-24">
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
                
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                  {property.name}
                </h1>
                
                {/* Tagline */}
                {property.tagline && (
                  <p className="text-xl md:text-2xl text-muted-foreground italic mb-4">
                    "{property.tagline}"
                  </p>
                )}
                
                <p className="text-lg text-muted-foreground">
                  {property.area}, {property.location}
                  {property.architect && (
                    <span className="text-muted-foreground/70"> · Designed by {property.architect}</span>
                  )}
                </p>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Heart className="w-4 h-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </motion.div>

              {/* At a Glance Specs */}
              <PropertySpecs
                bedrooms={property.bedrooms || []}
                priceFrom={property.price_from}
                priceTo={property.price_to}
                completionDate={property.completion_date}
                area={property.area}
                location={property.location}
                paymentPlan={property.payment_plan}
                roiEstimate={property.roi_estimate}
                developer={property.developer?.name}
              />

              {/* Lifestyle Description */}
              {property.lifestyle_description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
                    The Residence
                  </h2>
                  <div className="pl-6 border-l-2 border-accent/30">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {property.lifestyle_description}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Standard Description (fallback) */}
              {!property.lifestyle_description && property.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
                    The Residence
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {property.description}
                  </p>
                </motion.div>
              )}

              {/* Exclusive Amenities */}
              {property.exclusive_amenities && Array.isArray(property.exclusive_amenities) && property.exclusive_amenities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
                    Exclusive Amenities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(property.exclusive_amenities as unknown as ExclusiveAmenity[]).map((amenity, index) => {
                      const IconComponent = getAmenityIcon(amenity.icon);
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4 p-5 bg-champagne/30 border border-border/30"
                        >
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground mb-1">{amenity.title}</h3>
                            <p className="text-sm text-muted-foreground">{amenity.description}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Features */}
              {features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {features.map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 py-3 border-b border-border/50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Floor Plans */}
              {property.bedrooms && property.bedrooms.length > 0 && (
                <FloorPlans
                  bedrooms={property.bedrooms}
                  propertyName={property.name}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <PrivateConsultationForm
                propertyId={property.id}
                propertyName={property.name}
                goldenVisaEligible={property.golden_visa_eligible}
              />

              <PaymentPlanBreakdown
                paymentPlan={property.payment_plan}
                priceFrom={property.price_from}
                completionDate={property.completion_date}
              />

              <PropertyMortgageCalculator
                propertyPrice={property.price_from}
                goldenVisaEligible={property.golden_visa_eligible}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
