import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { ImageHoverCarousel } from './ImageHoverCarousel';

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
  created_at?: string;
  property_images: PropertyImage[];
}

interface CleanPropertyCardProps {
  property: Property;
  index: number;
  variant?: 'default' | 'compact';
}

export const CleanPropertyCard = ({ property, variant = 'default' }: CleanPropertyCardProps) => {
  const { formatPrice } = useTenant();
  const { isSaved, toggleSave } = useSavedProperties();
  const saved = isSaved(property.id);

  const sortedImages = [...(property.property_images || [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.display_order || 0) - (b.display_order || 0);
  });

  const isNew = property.created_at
    ? Date.now() - new Date(property.created_at).getTime() < 14 * 24 * 60 * 60 * 1000
    : false;

  const bedroomLabel = property.bedrooms?.length
    ? property.bedrooms.length === 1
      ? `${property.bedrooms[0]} BR`
      : `${Math.min(...property.bedrooms)}–${Math.max(...property.bedrooms)} BR`
    : null;

  const areaSlug = property.area?.toLowerCase().replace(/\s+/g, '-');

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(property.id);
  };

  return (
    <Link to={`/properties/${property.slug}`} className="group block">
      <article className="space-y-5">
        {/* Image with hover carousel */}
        <div className="relative" data-cursor="view">
          <ImageHoverCarousel
            images={sortedImages}
            className={variant === 'compact' ? 'aspect-[4/3]' : 'aspect-[3/2]'}
          />

          {/* Save / Heart icon */}
          <button
            onClick={handleSave}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors"
            aria-label={saved ? 'Remove from saved' : 'Save property'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${saved ? 'fill-white text-white' : 'text-white/80 hover:text-white'}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          {/* Developer + New */}
          <p className="text-[11px] text-muted-foreground/60 tracking-wide">
            {property.developer ? (
              <Link
                to={`/properties?developer=${property.developer.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:text-foreground transition-colors"
              >
                {property.developer.name}
              </Link>
            ) : null}
            {isNew && (
              <span className="ml-2 text-foreground/50">New</span>
            )}
          </p>

          <h3 className="font-serif text-xl md:text-2xl text-foreground leading-tight">
            {property.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            <Link
              to={`/area-guide/${areaSlug}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-foreground transition-colors"
            >
              {property.area}
            </Link>
          </p>

          {/* Price — JamesEdition statement */}
          <p className="font-serif text-lg text-foreground">
            From {formatPrice(property.price_from, { compact: true })}
          </p>

          {/* Specs */}
          {(bedroomLabel || property.completion_date) && (
            <p className="text-xs text-muted-foreground/50">
              {bedroomLabel}
              {bedroomLabel && property.completion_date && ' · '}
              {property.completion_date && `Handover ${new Date(property.completion_date).getFullYear()}`}
            </p>
          )}

          {/* Hover CTA */}
          <p className="text-xs text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-1">
            View Project →
          </p>
        </div>
      </article>
    </Link>
  );
};
