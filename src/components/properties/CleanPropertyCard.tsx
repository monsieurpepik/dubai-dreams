import { Link } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenant';

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
}

export const CleanPropertyCard = ({ property }: CleanPropertyCardProps) => {
  const { formatPrice } = useTenant();

  const sortedImages = [...(property.property_images || [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.display_order || 0) - (b.display_order || 0);
  });
  const primaryImage = sortedImages[0];

  return (
    <Link to={`/properties/${property.slug}`} className="group block">
      <article className="space-y-5">
        {/* Image — clean, no overlays */}
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt_text || property.name}
              className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        {/* Content — name + area only, price on hover */}
        <div className="space-y-1">
          <h3 className="font-serif text-xl md:text-2xl text-foreground leading-tight">
            {property.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {property.area}
          </p>
          {/* Price — fades in on hover */}
          <p className="text-sm text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-500">
            From {formatPrice(property.price_from, { compact: true })}
          </p>
        </div>
      </article>
    </Link>
  );
};
