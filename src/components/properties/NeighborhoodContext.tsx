import { motion } from 'framer-motion';
import { MapPin, Train, GraduationCap, Waves, ShoppingBag } from 'lucide-react';

interface NeighborhoodContextProps {
  area: string;
  areaData?: {
    avg_price_sqft: number;
    trend_percentage: number;
    trend_12m: string;
  } | null;
  propertyPriceFrom: number;
}

// Hardcoded neighborhood data per area
const neighborhoodData: Record<string, { metro: string; schools: string; beach: string; mall: string }> = {
  'Palm Jumeirah': { metro: '10 min drive', schools: 'GEMS Academy (5 min)', beach: 'Private beach access', mall: 'Nakheel Mall (2 min)' },
  'Business Bay': { metro: 'Business Bay Metro (5 min walk)', schools: 'South View School (10 min)', beach: 'La Mer Beach (15 min)', mall: 'Dubai Mall (5 min)' },
  'Dubai Marina': { metro: 'DMCC Metro (5 min walk)', schools: 'Dubai Int\'l Academy (10 min)', beach: 'JBR Beach (5 min walk)', mall: 'Marina Mall (2 min)' },
  'Dubai Creek Harbour': { metro: 'Creek Metro (10 min)', schools: 'Hartland Int\'l (5 min)', beach: 'Creek Beach (5 min walk)', mall: 'Festival City (10 min)' },
  'Dubai Harbour': { metro: 'Dubai Marina Metro (10 min)', schools: 'Kings School (15 min)', beach: 'Beachfront (2 min walk)', mall: 'Ibn Battuta Mall (15 min)' },
  'DAMAC Hills': { metro: '20 min drive to nearest', schools: 'GEMS Founders (5 min)', beach: '25 min to JBR Beach', mall: 'DAMAC Mall (on-site)' },
  'Sobha Hartland': { metro: 'Business Bay Metro (10 min)', schools: 'Hartland Int\'l (on-site)', beach: 'La Mer (12 min)', mall: 'Meydan One (10 min)' },
  'Mohammed Bin Rashid City': { metro: '15 min drive to nearest', schools: 'Meydan School (5 min)', beach: '20 min to La Mer', mall: 'Meydan One (5 min)' },
};

const defaultNeighborhood = { metro: 'Nearby metro access', schools: 'International schools nearby', beach: 'Beach access available', mall: 'Shopping nearby' };

export const NeighborhoodContext = ({ area, areaData, propertyPriceFrom }: NeighborhoodContextProps) => {
  const neighborhood = neighborhoodData[area] || defaultNeighborhood;

  const amenities = [
    { icon: Train, label: 'Metro', value: neighborhood.metro },
    { icon: GraduationCap, label: 'Schools', value: neighborhood.schools },
    { icon: Waves, label: 'Beach', value: neighborhood.beach },
    { icon: ShoppingBag, label: 'Shopping', value: neighborhood.mall },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        <MapPin className="w-4 h-4 text-accent" />
        Neighborhood — {area}
      </h3>

      {/* Area market comparison bar */}
      {areaData && (
        <div className="bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Area Average</span>
            <span className="text-foreground font-medium">AED {areaData.avg_price_sqft.toLocaleString()}/sqft</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">12-Month Trend</span>
            <span className={`font-medium ${areaData.trend_percentage >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {areaData.trend_percentage > 0 ? '+' : ''}{areaData.trend_percentage}%
            </span>
          </div>
        </div>
      )}

      {/* Proximity grid */}
      <div className="grid grid-cols-2 gap-3">
        {amenities.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-start gap-3 p-3 bg-secondary/50">
              <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{item.label}</p>
                <p className="text-xs text-foreground">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
