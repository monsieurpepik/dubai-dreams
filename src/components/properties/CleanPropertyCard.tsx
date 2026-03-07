import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
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
  viewCount?: number;
}

export const CleanPropertyCard = ({ property, variant = 'default', viewCount }: CleanPropertyCardProps) => {
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

  // Build badges
  const badges: { label: string; variant: 'gold' | 'default' | 'accent' }[] = [];
  if (property.golden_visa_eligible) {
    badges.push({ label: 'Golden Visa', variant: 'gold' });
  }
  if (property.roi_estimate && property.roi_estimate >= 7) {
    badges.push({ label: `${property.roi_estimate}% ROI`, variant: 'accent' });
  }
  if (property.completion_date) {
    const handoverYear = new Date(property.completion_date).getFullYear();
    const currentYear = new Date().getFullYear();
    if (handoverYear <= currentYear + 1) {
      const q = Math.ceil((new Date(property.completion_date).getMonth() + 1) / 3);
      badges.push({ label: `Q${q} ${handoverYear}`, variant: 'default' });
    }
  }
  if (isNew) {
    badges.push({ label: 'New', variant: 'default' });
  }

  const badgeStyles = {
    gold: 'bg-amber-500/90 text-white',
    accent: 'bg-emerald-600/90 text-white',
    default: 'bg-black/50 backdrop-blur-sm text-white',
  };

  return (
    <Link to={`/properties/${property.slug}`} className="group block">
      <article className="space-y-4">
        {/* Image with carousel */}
        <div className="relative rounded-lg overflow-hidden" data-cursor="view">
          <ImageHoverCarousel
            images={sortedImages}
            className={variant === 'compact' ? 'aspect-[4/3]' : 'aspect-[3/2]'}
          />

          {/* Pill badges — top-left */}
          {badges.length > 0 && (
            <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
              {badges.slice(0, 2).map((badge) => (
                <span
                  key={badge.label}
                  className={`px-2.5 py-1 text-[10px] font-medium tracking-wide rounded-full ${badgeStyles[badge.variant]}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}

          {/* Save / Heart icon — top-right */}
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
        <div className="space-y-1">
          {/* Developer */}
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
          </p>

          <h3 className="font-serif text-lg md:text-xl text-foreground leading-tight">
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

          {/* Price */}
          <p className="font-serif text-base text-foreground">
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
        </div>
      </article>
    </Link>
  );
};
