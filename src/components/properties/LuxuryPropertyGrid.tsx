import { motion } from 'framer-motion';
import { LuxuryPropertyCard } from './LuxuryPropertyCard';
import { Skeleton } from '@/components/ui/skeleton';

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

interface LuxuryPropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
}

export const LuxuryPropertyGrid = ({ properties, isLoading }: LuxuryPropertyGridProps) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Featured skeleton */}
        <Skeleton className="aspect-[21/9] w-full" />
        
        {/* Grid skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-[16/9]" />
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-24"
      >
        <p className="text-muted-foreground text-lg">
          No properties match your current filters.
        </p>
        <p className="text-muted-foreground/70 mt-2">
          Try adjusting your search criteria.
        </p>
      </motion.div>
    );
  }

  // Magazine-style layout: first property is featured, then alternating 2-column grid
  // Every 5th property (after first) gets featured treatment
  const getIsFeatured = (index: number): boolean => {
    if (index === 0) return true;
    return (index - 1) % 4 === 3; // Every 5th property (positions 0, 4, 8, 12...)
  };

  return (
    <div className="space-y-10">
      {properties.map((property, index) => {
        const isFeatured = getIsFeatured(index);
        
        // If this is a featured card, render it solo
        if (isFeatured) {
          return (
            <LuxuryPropertyCard
              key={property.id}
              property={property}
              index={index}
              featured
            />
          );
        }
        
        // For non-featured, we need to group them in pairs
        // Check if this is the start of a pair (odd position after first featured)
        const adjustedIndex = index > 0 ? index - 1 : index;
        const positionInGroup = adjustedIndex % 4;
        
        // Only render at the start of each pair
        if (positionInGroup === 0 || positionInGroup === 2) {
          const nextProperty = properties[index + 1];
          const nextIsFeatured = nextProperty ? getIsFeatured(index + 1) : true;
          
          return (
            <div key={property.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LuxuryPropertyCard
                property={property}
                index={index}
              />
              {nextProperty && !nextIsFeatured && (
                <LuxuryPropertyCard
                  property={nextProperty}
                  index={index + 1}
                />
              )}
            </div>
          );
        }
        
        // Skip properties that are the second in a pair (already rendered above)
        return null;
      })}
    </div>
  );
};
