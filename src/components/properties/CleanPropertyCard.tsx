import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, BarChart3 } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { useCompare } from '@/hooks/useCompare';

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

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
};

export const CleanPropertyCard = ({ property, index }: CleanPropertyCardProps) => {
  const { formatPrice } = useTenant();
  const { isSaved, toggleSave } = useSavedProperties();
  const { isComparing, toggleCompare, canAdd } = useCompare();
  const saved = isSaved(property.id);
  const comparing = isComparing(property.id);
  const primaryImage = property.property_images?.find(img => img.is_primary) 
    || property.property_images?.[0];

  // Pick one differentiator: yield if available, else completion date
  const differentiator = property.roi_estimate && property.roi_estimate > 0
    ? `${property.roi_estimate}% Est. Yield`
    : formatDate(property.completion_date);

  return (
    <Link to={`/properties/${property.slug}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: Math.min(index * 0.1, 0.4), ease: [0.22, 1, 0.36, 1] }}
        className="space-y-4"
      >
        {/* Image — cinematic 3:2 aspect */}
        <div className="relative aspect-[3/2] overflow-hidden bg-muted rounded-sm">
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

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(property.id); }}
              className={`p-2 backdrop-blur-sm rounded-sm transition-colors ${
                comparing ? 'bg-accent text-accent-foreground' : 'bg-background/80 text-foreground hover:bg-background'
              } ${!canAdd && !comparing ? 'opacity-40 cursor-not-allowed' : ''}`}
              aria-label={comparing ? 'Remove from comparison' : 'Add to comparison'}
              disabled={!canAdd && !comparing}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(property.id); }}
              className="p-2 bg-background/80 backdrop-blur-sm rounded-sm transition-colors hover:bg-background"
              aria-label={saved ? 'Remove from shortlist' : 'Save to shortlist'}
            >
              <Heart className={`w-4 h-4 transition-colors ${saved ? 'fill-accent text-accent' : 'text-foreground'}`} />
            </button>
          </div>
        </div>

        {/* Content — Apple minimal */}
        <div className="space-y-1.5">
          <h3 className="font-serif text-xl md:text-2xl text-foreground leading-tight group-hover:text-muted-foreground transition-colors duration-300">
            {property.name}
          </h3>
          
          {/* Developer + Area */}
          <p className="text-sm text-muted-foreground">
            {property.developer ? `${property.developer.name} · ` : ''}{property.area}
          </p>

          {/* Price + one differentiator */}
          <div className="flex items-center gap-3 pt-1 text-sm">
            <span className="text-foreground font-medium">
              From {formatPrice(property.price_from, { compact: true })}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {differentiator}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};
