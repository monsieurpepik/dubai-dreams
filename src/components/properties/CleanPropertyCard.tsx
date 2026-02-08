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
  created_at?: string;
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

const isNew = (createdAt?: string): boolean => {
  if (!createdAt) return false;
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  return new Date(createdAt) > twoWeeksAgo;
};

const isNearHandover = (completionDate: string | null): boolean => {
  if (!completionDate) return false;
  const sixMonths = new Date();
  sixMonths.setMonth(sixMonths.getMonth() + 6);
  return new Date(completionDate) <= sixMonths;
};

const estimateMonthly = (price: number): string => {
  // Simple estimate: 25yr mortgage, ~4.5% rate
  const monthlyRate = 0.045 / 12;
  const months = 25 * 12;
  const payment = price * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  if (payment >= 1000) return `${Math.round(payment / 1000)}K`;
  return `${Math.round(payment)}`;
};

export const CleanPropertyCard = ({ property, index }: CleanPropertyCardProps) => {
  const { formatPrice } = useTenant();
  const { isSaved, toggleSave } = useSavedProperties();
  const { isComparing, toggleCompare, canAdd } = useCompare();
  const saved = isSaved(property.id);
  const comparing = isComparing(property.id);
  const isLuxury = property.price_from >= 5000000;
  
  const sortedImages = [...(property.property_images || [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.display_order || 0) - (b.display_order || 0);
  });
  const primaryImage = sortedImages[0];
  const imageCount = sortedImages.length;

  const differentiator = property.roi_estimate && property.roi_estimate > 0
    ? `${property.roi_estimate}% Est. Yield`
    : formatDate(property.completion_date);

  // Smart badges
  const badges: { label: string; variant: 'accent' | 'default' }[] = [];
  if (isNew(property.created_at)) badges.push({ label: 'New', variant: 'accent' });
  if (property.golden_visa_eligible) badges.push({ label: 'Golden Visa', variant: 'default' });
  if (isNearHandover(property.completion_date)) badges.push({ label: 'Near Handover', variant: 'default' });

  return (
    <Link to={`/properties/${property.slug}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: Math.min(index * 0.1, 0.4), ease: [0.22, 1, 0.36, 1] }}
        whileTap={{ scale: 0.985 }}
        className="space-y-4"
      >
        {/* Image */}
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

          {/* Smart Badges */}
          {badges.length > 0 && (
            <div className="absolute top-4 left-4 flex gap-1.5 z-10">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm rounded-sm ${
                    badge.variant === 'accent'
                      ? 'bg-accent/90 text-accent-foreground'
                      : 'bg-background/70 text-foreground'
                  }`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}

          {/* Heart */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(property.id); }}
            className="absolute top-4 right-4 p-2 bg-background/60 backdrop-blur-sm rounded-full transition-colors hover:bg-background/80"
            aria-label={saved ? 'Remove from shortlist' : 'Save to shortlist'}
          >
            <Heart className={`w-4 h-4 transition-colors ${saved ? 'fill-accent text-accent' : 'text-foreground/70'}`} />
          </button>

          {/* Compare — hover only */}
          <div className={`absolute ${badges.length > 0 ? 'bottom-4 left-4' : 'top-4 left-4'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(property.id); }}
              className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                comparing ? 'bg-accent text-accent-foreground' : 'bg-background/60 text-foreground/70 hover:bg-background/80'
              } ${!canAdd && !comparing ? 'opacity-40 cursor-not-allowed' : ''}`}
              aria-label={comparing ? 'Remove from comparison' : 'Add to comparison'}
              disabled={!canAdd && !comparing}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>

          {/* Dot indicators */}
          {imageCount > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {sortedImages.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === 0 ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
              {imageCount > 5 && (
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="font-serif text-xl md:text-2xl text-foreground leading-tight group-hover:text-muted-foreground transition-colors duration-300">
            {property.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {property.developer ? `${property.developer.name} · ` : ''}{property.area}
          </p>
          <div className="flex items-center gap-3 pt-1 text-sm">
            <span className={`text-foreground font-medium ${isLuxury ? 'font-serif text-base' : ''}`}>
              From {formatPrice(property.price_from, { compact: true })}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {differentiator}
            </span>
          </div>
          {/* Estimated monthly */}
          <p className="text-[11px] text-muted-foreground/60">
            from AED {estimateMonthly(property.price_from)}/mo est.
          </p>
        </div>
      </motion.article>
    </Link>
  );
};
