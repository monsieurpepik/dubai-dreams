import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';

const placeholderProjects = [
  {
    id: 'ph1',
    name: 'The Residences at Marina',
    slug: '#',
    area: 'Dubai Marina',
    price_from: 1850000,
    bedrooms: [1, 2, 3],
    completion_date: '2027-06-01',
    golden_visa_eligible: true,
    roi_estimate: 8.2,
    developer: { name: 'Emaar Properties' },
    property_images: [{ url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', is_primary: true }],
  },
  {
    id: 'ph2',
    name: 'Palm Villas Collection',
    slug: '#',
    area: 'Palm Jumeirah',
    price_from: 5200000,
    bedrooms: [3, 4, 5],
    completion_date: '2026-12-01',
    golden_visa_eligible: true,
    roi_estimate: null,
    developer: { name: 'Nakheel' },
    property_images: [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', is_primary: true }],
  },
  {
    id: 'ph3',
    name: 'Downtown Heights Tower',
    slug: '#',
    area: 'Downtown Dubai',
    price_from: 2400000,
    bedrooms: [1, 2],
    completion_date: '2027-03-01',
    golden_visa_eligible: true,
    roi_estimate: 7.5,
    developer: { name: 'Damac Properties' },
    property_images: [{ url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', is_primary: true }],
  },
];

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

  const displayProperties = properties.length > 0 ? properties : placeholderProjects;
  const isPlaceholder = properties.length === 0;

  return (
    <section className="bg-black py-20 md:py-28">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-[-0.01em]">
              Off-Plan Developments
            </h2>
            <p className="mt-2 text-[15px] text-white/60">
              New projects from Dubai's top developers
            </p>
          </motion.div>

          <Link
            to="/properties?status=off-plan"
            className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-medium text-white/60 hover:text-white transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid — Airbnb card style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {displayProperties.map((property: any, index: number) => {
            const image = property.property_images?.[0]?.url || getPrimaryImage(property.property_images);
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
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={isPlaceholder ? '/properties' : `/properties/${property.slug}`}
                  className="group block rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(255,255,255,0.04)] overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-t-2xl" style={{ aspectRatio: '16/11' }}>
                    {image ? (
                      <img
                        src={image}
                        alt={property.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/[0.03]" />
                    )}

                    {/* Badges — pill shaped */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {isPlaceholder && (
                        <span className="px-3 py-1 text-[11px] font-medium bg-black/50 text-white rounded-full backdrop-blur-md">
                          Coming Soon
                        </span>
                      )}
                      {property.golden_visa_eligible && !isPlaceholder && (
                        <span className="px-3 py-1 text-[11px] font-medium bg-white text-black rounded-full">
                          Golden Visa
                        </span>
                      )}
                      {property.roi_estimate && property.roi_estimate >= 7 && !isPlaceholder && (
                        <span className="px-3 py-1 text-[11px] font-medium bg-white text-black rounded-full">
                          {property.roi_estimate}% ROI
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details — padded card body */}
                  <div className="p-5">
                    {/* Developer */}
                    <p className="text-[12px] text-white/30 font-medium">
                      {property.developer?.name || 'Developer'}
                    </p>

                    {/* Name */}
                    <h3 className="mt-1.5 text-[17px] text-white font-semibold leading-snug">
                      {property.name}
                    </h3>

                    {/* Area with pin */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" />
                      <p className="text-[13px] text-white/60">
                        {property.area}
                      </p>
                    </div>

                    {/* Specs row — pills */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {bedroomLabel && (
                        <span className="px-2.5 py-1 text-[11px] text-white/60 bg-white/[0.06] rounded-full">
                          {bedroomLabel}
                        </span>
                      )}
                      {handoverYear && (
                        <span className="px-2.5 py-1 text-[11px] text-white/60 bg-white/[0.06] rounded-full">
                          Handover {handoverYear}
                        </span>
                      )}
                      {property.payment_plan && (
                        <span className="px-2.5 py-1 text-[11px] text-white/60 bg-white/[0.06] rounded-full">
                          {property.payment_plan}
                        </span>
                      )}
                    </div>

                    {/* Price + CTA row */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                      <p className="text-[16px] font-semibold text-white">
                        From {formatPrice(property.price_from, { compact: true })}
                      </p>
                      <span className="text-[13px] font-medium text-white/60 group-hover:text-white transition-colors duration-200">
                        View &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile CTA — pill button */}
        <div className="mt-10 text-center md:hidden">
          <Link
            to="/properties?status=off-plan"
            className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium text-white bg-white/[0.08] border border-white/[0.1] rounded-full hover:bg-white/[0.14] transition-all"
          >
            View all projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
