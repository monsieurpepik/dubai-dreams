import { motion } from 'framer-motion';
import { Maximize2, Bed, Bath, Grid3X3 } from 'lucide-react';

interface FloorPlansProps {
  bedrooms: number[];
  propertyName: string;
}

// Sample floor plan data based on bedroom count
const getFloorPlanData = (bedrooms: number) => {
  const plans: Record<number, { sqft: number; baths: number; balcony: number }> = {
    1: { sqft: 750, baths: 1, balcony: 100 },
    2: { sqft: 1200, baths: 2, balcony: 150 },
    3: { sqft: 1800, baths: 3, balcony: 200 },
    4: { sqft: 2500, baths: 4, balcony: 300 },
    5: { sqft: 3500, baths: 5, balcony: 400 },
    6: { sqft: 5000, baths: 6, balcony: 500 },
  };
  return plans[bedrooms] || { sqft: 1000, baths: bedrooms, balcony: 120 };
};

export const FloorPlans = ({ bedrooms, propertyName }: FloorPlansProps) => {
  const sortedBedrooms = [...bedrooms].sort((a, b) => a - b);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card border border-border/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <Grid3X3 className="w-5 h-5 text-accent" />
        Available Floor Plans
      </h3>

      <div className="space-y-4">
        {sortedBedrooms.map((bedroom, index) => {
          const plan = getFloorPlanData(bedroom);
          return (
            <motion.div
              key={bedroom}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group p-4 bg-muted/50 hover:bg-muted border border-border/30 rounded-lg cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold group-hover:text-accent transition-colors">
                  {bedroom} Bedroom {bedroom === 1 ? 'Apartment' : 'Residence'}
                </h4>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-background rounded-md">
                  Type {String.fromCharCode(65 + index)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Maximize2 className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">
                    {plan.sqft.toLocaleString()} sqft
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bed className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">
                    {bedroom} {bedroom === 1 ? 'Bed' : 'Beds'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bath className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">
                    {plan.baths} {plan.baths === 1 ? 'Bath' : 'Baths'}
                  </span>
                </div>
              </div>

              {/* Floor Plan Visual Placeholder */}
              <div className="mt-4 aspect-[16/9] bg-background border border-border/30 rounded-lg overflow-hidden relative group-hover:border-accent/30 transition-colors">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Grid3X3 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground/50">
                      Floor plan visualization
                    </p>
                  </div>
                </div>
                {/* Simplified floor plan grid */}
                <div className="absolute inset-4 border border-dashed border-muted-foreground/20 rounded">
                  <div className="absolute top-2 left-2 w-1/3 h-2/5 border border-muted-foreground/20 rounded-sm flex items-center justify-center">
                    <span className="text-[8px] text-muted-foreground/40">Living</span>
                  </div>
                  <div className="absolute bottom-2 left-2 w-1/4 h-1/3 border border-muted-foreground/20 rounded-sm flex items-center justify-center">
                    <span className="text-[8px] text-muted-foreground/40">Kitchen</span>
                  </div>
                  <div className="absolute top-2 right-2 w-1/4 h-2/5 border border-muted-foreground/20 rounded-sm flex items-center justify-center">
                    <span className="text-[8px] text-muted-foreground/40">Master</span>
                  </div>
                  {bedroom >= 2 && (
                    <div className="absolute bottom-2 right-2 w-1/4 h-1/3 border border-muted-foreground/20 rounded-sm flex items-center justify-center">
                      <span className="text-[8px] text-muted-foreground/40">Bed 2</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Balcony: {plan.balcony} sqft
                </span>
                <span className="text-accent font-medium group-hover:underline">
                  Request floor plan →
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
