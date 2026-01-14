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

interface CleanPropertyCardProps {
  property: Property;
  index: number;
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
};

export const CleanPropertyCard = ({ property, index }: CleanPropertyCardProps) => {
  const primaryImage = property.property_images?.find(img => img.is_primary) 
    || property.property_images?.[0];

  return (
    <Link to={`/properties/${property.slug}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.4), ease: [0.22, 1, 0.36, 1] }}
        className="space-y-4"
      >
        {/* Image - Clean, no overlays */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt_text || property.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm text-muted-foreground">No image</span>
            </div>
          )}
          
          {/* Developer badge - subtle trust indicator */}
          {property.developer && (
            <div className="absolute bottom-4 left-4">
              <span className="inline-block px-3 py-1.5 bg-background/90 backdrop-blur-sm text-[10px] font-medium uppercase tracking-wider text-foreground">
                {property.developer.name}
              </span>
            </div>
          )}
        </div>

        {/* Content - Minimal, editorial */}
        <div className="space-y-2">
          {/* Property Name */}
          <h3 className="font-serif text-xl md:text-2xl text-foreground leading-tight group-hover:text-muted-foreground transition-colors duration-300">
            {property.name}
          </h3>
          
          {/* Location */}
          <p className="text-sm text-muted-foreground">
            {property.area}
          </p>

          {/* Key Details - Single line */}
          <div className="flex items-center gap-3 pt-2 text-sm">
            <span className="text-foreground font-medium">
              From {formatPrice(property.price_from)}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {formatDate(property.completion_date)}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};
