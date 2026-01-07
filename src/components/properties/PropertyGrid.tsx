import { motion } from 'framer-motion';
import { PropertyCard } from './PropertyCard';
import { Loader2 } from 'lucide-react';

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

interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
}

export const PropertyGrid = ({ properties, isLoading = false }: PropertyGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <p className="text-muted-foreground text-lg">No properties found matching your criteria</p>
        <p className="text-muted-foreground/70 text-sm mt-2">Try adjusting your filters</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <PropertyCard 
          key={property.id} 
          property={property} 
          index={index} 
        />
      ))}
    </div>
  );
};
