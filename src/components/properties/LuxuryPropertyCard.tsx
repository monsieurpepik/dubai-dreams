import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Award } from 'lucide-react';

interface PropertyImage {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
}

interface Developer {
  id: string;
  name: string;
  slug: string;
}

interface Property {
  id: string;
  name: string;
  slug: string;
  developer: Developer | null;
  location: string;
  area: string;
  community: string | null;
  price_from: number;
  price_to: number | null;
  bedrooms: number[];
  completion_date: string | null;
  payment_plan: string | null;
  roi_estimate: number | null;
  golden_visa_eligible: boolean;
  status: string;
  tagline?: string | null;
  property_images: PropertyImage[];
}

interface LuxuryPropertyCardProps {
  property: Property;
  index: number;
  featured?: boolean;
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const formatBedrooms = (bedrooms: number[]): string => {
  if (!bedrooms || bedrooms.length === 0) return 'Studio';
  if (bedrooms.length === 1) {
    return bedrooms[0] === 0 ? 'Studio' : `${bedrooms[0]} Bedrooms`;
  }
  const min = Math.min(...bedrooms);
  const max = Math.max(...bedrooms);
  return min === 0 ? `Studio – ${max} Bedrooms` : `${min} – ${max} Bedrooms`;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Handover TBA';
  const date = new Date(dateString);
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Handover Q${quarter} ${date.getFullYear()}`;
};

export const LuxuryPropertyCard = ({ property, index, featured = false }: LuxuryPropertyCardProps) => {
  const primaryImage = property.property_images?.find(img => img.is_primary) 
    || property.property_images?.[0];

  return (
    <Link to={`/properties/${property.slug}`} className="block group">
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden ${featured ? 'col-span-full' : ''}`}
      >
        {/* Image Container - Cinematic 16:9 */}
        <div className={`relative overflow-hidden ${featured ? 'aspect-[21/9]' : 'aspect-[16/9]'}`}>
          {primaryImage ? (
            <motion.img
              src={primaryImage.url}
              alt={primaryImage.alt_text || property.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Golden Visa Badge */}
          {property.golden_visa_eligible && (
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gold/90 backdrop-blur-sm text-black text-xs font-medium uppercase tracking-luxury">
                <Award className="w-3.5 h-3.5" />
                Golden Visa
              </div>
            </div>
          )}

          {/* Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
            {/* Developer Label */}
            {property.developer && (
              <span className="inline-block text-[10px] md:text-xs font-medium text-white/70 uppercase tracking-luxury mb-3">
                {property.developer.name}
              </span>
            )}
            
            {/* Property Name - Serif Typography */}
            <h3 className={`font-serif text-white mb-3 leading-tight ${
              featured 
                ? 'text-3xl md:text-4xl lg:text-5xl' 
                : 'text-2xl md:text-3xl lg:text-4xl'
            }`}>
              {property.name}
            </h3>
            
            {/* Location */}
            <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span>{property.area}, {property.location}</span>
            </div>
            
            {/* Tagline if available */}
            {property.tagline && (
              <p className="text-white/60 text-sm md:text-base italic mb-4 max-w-2xl">
                "{property.tagline}"
              </p>
            )}

            {/* Bottom Row - Price and Details */}
            <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-white/20">
              <div className="space-y-1">
                <span className="text-xs text-white/50 uppercase tracking-wider">From</span>
                <p className="text-2xl md:text-3xl font-light text-white">
                  {formatPrice(property.price_from)}
                </p>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-white/70">
                <span>{formatBedrooms(property.bedrooms)}</span>
                <span className="text-white/30">|</span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(property.completion_date)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Hover Effect - Subtle border */}
          <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 transition-colors duration-500 pointer-events-none" />
        </div>

        {/* View Property Link - Appears on hover */}
        <div className="absolute bottom-6 md:bottom-8 lg:bottom-10 right-6 md:right-8 lg:right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-sm font-medium text-white uppercase tracking-wider border-b border-white/50 pb-1 hover:border-white transition-colors">
            View Property
          </span>
        </div>
      </motion.article>
    </Link>
  );
};
