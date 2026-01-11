import { motion } from 'framer-motion';
import { ModernPropertyCard } from './ModernPropertyCard';
import { PropertyGridSkeleton } from './PropertyCardSkeleton';

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
    return <PropertyGridSkeleton />;
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

  // Modern grid layout: First property featured, then 2-3 column responsive grid
  return (
    <div className="space-y-8">
      {/* Featured First Property */}
      {properties.length > 0 && (
        <ModernPropertyCard
          property={properties[0]}
          index={0}
          featured
        />
      )}

      {/* Responsive Grid for Remaining Properties */}
      {properties.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(1).map((property, index) => (
            <ModernPropertyCard
              key={property.id}
              property={property}
              index={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
