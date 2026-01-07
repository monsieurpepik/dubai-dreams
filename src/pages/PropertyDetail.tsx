import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Building2, TrendingUp, Award, Share2, Heart, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PropertyGallery } from '@/components/properties/PropertyGallery';
import { PaymentPlanBreakdown } from '@/components/properties/PaymentPlanBreakdown';
import { PropertyMortgageCalculator } from '@/components/properties/PropertyMortgageCalculator';
import { FloorPlans } from '@/components/properties/FloorPlans';
import { PropertyInquiryForm } from '@/components/properties/PropertyInquiryForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(1)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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
            <Skeleton className="aspect-[16/9] rounded-xl mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
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
          <div className="container-wide text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/#off-plan">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
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
      <main className="pt-24 pb-20">
        <div className="container-wide">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/#off-plan"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Properties</span>
            </Link>
          </motion.div>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <PropertyGallery
              images={property.property_images || []}
              propertyName={property.name}
            />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.status === 'upcoming' && (
                    <Badge className="bg-amber-500/90 text-white border-0">
                      Coming Soon
                    </Badge>
                  )}
                  {property.golden_visa_eligible && (
                    <Badge className="bg-accent/90 text-accent-foreground border-0">
                      <Award className="w-3 h-3 mr-1" />
                      Golden Visa Eligible
                    </Badge>
                  )}
                  {property.roi_estimate && property.roi_estimate > 0 && (
                    <Badge className="bg-emerald-500/90 text-white border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {property.roi_estimate}% Est. ROI
                    </Badge>
                  )}
                </div>

                {/* Developer */}
                {property.developer && (
                  <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
                    {property.developer.name}
                  </p>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {property.name}
                </h1>

                {/* Location */}
                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{property.area}, {property.location}</span>
                  {property.community && (
                    <>
                      <span className="text-muted-foreground/50">•</span>
                      <span>{property.community}</span>
                    </>
                  )}
                </div>

                {/* Price & Quick Info */}
                <div className="flex flex-wrap items-end gap-6 pb-6 border-b border-border/50">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                    <p className="text-4xl font-bold text-foreground">
                      {formatPrice(property.price_from)}
                    </p>
                  </div>
                  {property.price_to && property.price_to > property.price_from && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Up to</p>
                      <p className="text-2xl font-semibold text-muted-foreground">
                        {formatPrice(property.price_to)}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-6 ml-auto">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-5 h-5" />
                      <span>
                        {property.bedrooms?.length > 1
                          ? `${Math.min(...property.bedrooms)}-${Math.max(...property.bedrooms)} BR`
                          : `${property.bedrooms?.[0] || 1} BR`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(property.completion_date)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6">
                  <Button size="lg" className="flex-1">
                    Request Information
                  </Button>
                  <Button size="lg" variant="outline">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>

              {/* Description */}
              {property.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card border border-border/50 rounded-xl p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">About This Property</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </motion.div>
              )}

              {/* Features */}
              {features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card border border-border/50 rounded-xl p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {features.map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>{feature}</span>
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

              {/* Developer Info */}
              {property.developer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card border border-border/50 rounded-xl p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Developer</h2>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{property.developer.name}</h3>
                      {property.developer.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {property.developer.description}
                        </p>
                      )}
                      <div className="flex gap-6 mt-3 text-sm text-muted-foreground">
                        {property.developer.total_projects > 0 && (
                          <span>{property.developer.total_projects}+ Projects</span>
                        )}
                        {property.developer.years_active > 0 && (
                          <span>{property.developer.years_active} Years Active</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Inquiry Form */}
              <PropertyInquiryForm
                propertyId={property.id}
                propertyName={property.name}
                goldenVisaEligible={property.golden_visa_eligible}
              />

              {/* Payment Plan */}
              <PaymentPlanBreakdown
                paymentPlan={property.payment_plan}
                priceFrom={property.price_from}
                completionDate={property.completion_date}
              />

              {/* Mortgage Calculator */}
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
