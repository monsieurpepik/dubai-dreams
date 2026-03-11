import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';

// Real-looking placeholder projects shown when DB is empty
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

  // Use real data or placeholders
  const displayProperties = properties.length > 0 ? properties : placeholderProjects;
  const isPlaceholder = properties.length === 0;

  return (
    <section className="bg-black py-20 md:py-28 border-t border-white/[0.08]">
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
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
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={isPlaceholder ? '/properties' : `/properties/${property.slug}`} className="group block">
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
                      {isPlaceholder && (
                        <span className="px-2.5 py-1 text-[9px] tracking-[0.1em] font-medium bg-white/[0.15] text-white uppercase backdrop-blur-sm">
                          Coming Soon
                        </span>
                      )}
                      {property.golden_visa_eligible && !isPlaceholder && (
                        <span className="px-2.5 py-1 text-[9px] tracking-[0.1em] font-medium bg-white/90 text-black uppercase">
                          Golden Visa
                        </span>
                      )}
                      {property.roi_estimate && property.roi_estimate >= 7 && !isPlaceholder && (
                        <span className="px-2.5 py-1 text-[9px] tracking-[0.1em] font-medium bg-white/90 text-black uppercase">
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
                    <p className="text-[10px] tracking-[0.15em] text-white/30 uppercase">
                      {property.developer?.name || 'Developer'}
                    </p>
                    <h3 className="text-[16px] text-white font-normal leading-tight group-hover:text-white/60 transition-colors duration-300">
                      {property.name}
                    </h3>
                    <p className="text-[12px] text-white/30">
                      {property.area}
                    </p>

                    {/* Specs */}
                    <div className="flex items-center gap-3 pt-1">
                      {bedroomLabel && (
                        <span className="text-[11px] text-white/30">{bedroomLabel}</span>
                      )}
                      {bedroomLabel && handoverYear && (
                        <span className="text-white/[0.08]">·</span>
                      )}
                      {handoverYear && (
                        <span className="text-[11px] text-white/30">Handover {handoverYear}</span>
                      )}
                      {property.payment_plan && (
                        <>
                          <span className="text-white/[0.08]">·</span>
                          <span className="text-[11px] text-white/30">{property.payment_plan}</span>
                        </>
                      )}
                    </div>

                    <p className="text-[10px] tracking-[0.15em] text-white/30 uppercase pt-2 group-hover:text-white/60 transition-colors duration-300">
                      View Project &gt;
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

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
