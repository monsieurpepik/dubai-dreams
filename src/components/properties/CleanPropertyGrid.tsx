import { motion } from 'framer-motion';
import { CleanPropertyCard } from './CleanPropertyCard';
import { PropertyGridSkeleton } from './PropertyCardSkeleton';
import { usePropertyViewCounts } from '@/hooks/usePropertyPopularity';

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

interface CleanPropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
}

export const CleanPropertyGrid = ({ properties, isLoading }: CleanPropertyGridProps) => {
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
          No properties available.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property, index) => (
        <CleanPropertyCard
          key={property.id}
          property={property}
          index={index}
        />
      ))}
    </div>
  );
};
