import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';

export function OffPlanSection() {
  const { formatPrice } = useTenant();

  const { data: properties = [] } = useQuery({
    queryKey: ['offplan-homepage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id, name, slug, area, price_from, price_to, completion_date, payment_plan,
          bedrooms, roi_estimate, golden_visa_eligible, tagline,
          developer:developers(name, slug),
          property_images(url, is_primary, display_order)
        `)
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data || [];
    },
  });

  const getPrimaryImage = (images: any[]) =>
    [...(images || [])]
      .sort((a, b) => (a.is_primary ? -1 : b.is_primary ? 1 : (a.display_order || 0) - (b.display_order || 0)))[0]?.url;

  const getBedroomLabel = (bedrooms: number[] | null) => {
    if (!bedrooms?.length) return null;
    return bedrooms.length === 1
      ? `${bedrooms[0]} BR`
      : `${Math.min(...bedrooms)}–${Math.max(...bedrooms)} BR`;
  };

  // Show section even with no data — placeholder cards
  const hasData = properties.length > 0;

  return (
    <section className="bg-black py-20 md:py-28 border-t border-white/[0.06]">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-3">
              Featured Projects
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white"
                style={{ fontFamily: "'Inter', sans-serif" }}>
              Off-Plan Developments
            </h2>
          </motion.div>

          <Link
            to="/properties?status=off-plan"
            className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.15em] text-white/30 hover:text-white/60 transition-colors uppercase"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Grid */}
        {hasData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {properties.map((property: any, index: number) => {
              const image = getPrimaryImage(property.property_images);
              const bedroomLabel = getBedroomLabel(property.bedrooms);
              const handoverYear = property.completion_date
                ? new Date(property.completion_date).getFullYear()
                : null;

              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={`/properties/${property.slug}`} className="group block">
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                      {image ? (
                        <img
                          src={image}
                          alt={property.name}
                          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/[0.03]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {property.golden_visa_eligible && (
                          <span className="px-2.5 py-1 text-[9px] tracking-[0.1em] font-medium bg-amber-500/90 text-white uppercase">
                            Golden Visa
                          </span>
                        )}
                        {property.roi_estimate && property.roi_estimate >= 7 && (
                          <span className="px-2.5 py-1 text-[9px] tracking-[0.1em] font-medium bg-emerald-600/90 text-white uppercase">
                            {property.roi_estimate}% ROI
                          </span>
                        )}
                      </div>

                      {/* Price overlay */}
                      <div className="absolute bottom-3 left-3">
                        <p className="text-[15px] font-medium text-white">
                          From {formatPrice(property.price_from, { compact: true })}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-4 space-y-1.5">
                      {/* Developer */}
                      <p className="text-[10px] tracking-[0.15em] text-white/25 uppercase">
                        {property.developer?.name || 'Developer'}
                      </p>

                      {/* Name */}
                      <h3 className="text-[16px] text-white font-normal leading-tight group-hover:text-white/70 transition-colors duration-300">
                        {property.name}
                      </h3>

                      {/* Area */}
                      <p className="text-[12px] text-white/40">
                        {property.area}
                      </p>

                      {/* Specs row */}
                      <div className="flex items-center gap-3 pt-1">
                        {bedroomLabel && (
                          <span className="text-[11px] text-white/30">{bedroomLabel}</span>
                        )}
                        {bedroomLabel && handoverYear && (
                          <span className="text-white/10">·</span>
                        )}
                        {handoverYear && (
                          <span className="text-[11px] text-white/30">Handover {handoverYear}</span>
                        )}
                        {property.payment_plan && (
                          <>
                            <span className="text-white/10">·</span>
                            <span className="text-[11px] text-white/30">{property.payment_plan}</span>
                          </>
                        )}
                      </div>

                      {/* CTA */}
                      <p className="text-[10px] tracking-[0.15em] text-white/20 uppercase pt-2 group-hover:text-white/50 transition-colors duration-300">
                        View Project &gt;
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty state — placeholder cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="bg-white/[0.03] animate-pulse" style={{ aspectRatio: '4/3' }} />
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-white/[0.05] rounded" />
                  <div className="h-5 w-48 bg-white/[0.05] rounded" />
                  <div className="h-3 w-32 bg-white/[0.03] rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link
            to="/properties?status=off-plan"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] text-white/30 hover:text-white/60 transition-colors uppercase"
          >
            View All Projects <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
