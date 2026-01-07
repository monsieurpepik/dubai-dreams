import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Building2, TrendingUp, Award } from 'lucide-react';
import { ImageCarousel } from './ImageCarousel';
import { Badge } from '@/components/ui/badge';

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
  description: string | null;
  property_images: PropertyImage[];
}

interface PropertyCardProps {
  property: Property;
  index: number;
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(1)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const formatBedrooms = (bedrooms: number[]): string => {
  if (bedrooms.length === 0) return 'Studio';
  if (bedrooms.length === 1) return `${bedrooms[0]} BR`;
  return `${Math.min(...bedrooms)}-${Math.max(...bedrooms)} BR`;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const PropertyCard = ({ property, index }: PropertyCardProps) => {
  return (
    <Link to={`/properties/${property.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3]">
          <ImageCarousel 
            images={property.property_images} 
            className="w-full h-full"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {property.status === 'upcoming' && (
              <Badge className="bg-amber-500/90 text-white border-0 text-xs">
                Coming Soon
              </Badge>
            )}
            {property.golden_visa_eligible && (
              <Badge className="bg-accent/90 text-accent-foreground border-0 text-xs">
                <Award className="w-3 h-3 mr-1" />
                Golden Visa
              </Badge>
            )}
            {property.payment_plan && property.payment_plan !== '100% Ready' && (
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                {property.payment_plan}
              </Badge>
            )}
          </div>

          {/* ROI Badge */}
          {property.roi_estimate && property.roi_estimate > 0 && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-emerald-500/90 text-white border-0 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                {property.roi_estimate}% ROI
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          {/* Developer */}
          {property.developer && (
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              {property.developer.name}
            </span>
          )}

          {/* Property Name */}
          <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
            {property.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{property.area}</span>
          </div>

          {/* Price */}
          <div className="pt-2">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(property.price_from)}
            </span>
            {property.price_to && property.price_to > property.price_from && (
              <span className="text-muted-foreground text-sm ml-1">
                - {formatPrice(property.price_to)}
              </span>
            )}
          </div>

          {/* Quick Info */}
          <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{formatBedrooms(property.bedrooms)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(property.completion_date)}</span>
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </motion.div>
    </Link>
  );
};
