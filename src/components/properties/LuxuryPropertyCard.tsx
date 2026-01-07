import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    return bedrooms[0] === 0 ? 'Studio' : `${bedrooms[0]} BR`;
  }
  const min = Math.min(...bedrooms);
  const max = Math.max(...bedrooms);
  return min === 0 ? `Studio – ${max} BR` : `${min} – ${max} BR`;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
};

export const LuxuryPropertyCard = ({ property, index, featured = false }: LuxuryPropertyCardProps) => {
  const primaryImage = property.property_images?.find(img => img.is_primary) 
    || property.property_images?.[0];

  return (
    <Link to={`/properties/${property.slug}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`${featured ? 'col-span-full' : ''}`}
      >
        {/* Image Container - Clean, no overlay */}
        <div className={`relative mb-6 overflow-hidden bg-muted ${featured ? 'aspect-[21/9]' : 'aspect-[16/10]'}`}>
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt_text || property.name}
              className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        {/* Content - Below image, editorial layout */}
        <div className="space-y-3">
          {/* Developer Label */}
          {property.developer && (
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {property.developer.name}
            </p>
          )}
          
          {/* Property Name */}
          <h3 className={`font-serif leading-tight text-foreground ${
            featured ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
          }`}>
            {property.name}
          </h3>
          
          {/* Location */}
          <p className="text-sm text-muted-foreground">
            {property.area}, {property.location}
          </p>

          {/* Details Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm text-muted-foreground">
            <span>{formatBedrooms(property.bedrooms)}</span>
            <span className="text-border">·</span>
            <span>{formatDate(property.completion_date)}</span>
            <span className="text-border">·</span>
            <span className="text-foreground">From {formatPrice(property.price_from)}</span>
          </div>

          {/* Golden Visa - Subtle text */}
          {property.golden_visa_eligible && (
            <p className="pt-2 text-[10px] font-medium uppercase tracking-[0.15em] text-accent">
              Golden Visa Eligible
            </p>
          )}
        </div>
      </motion.article>
    </Link>
  );
};
