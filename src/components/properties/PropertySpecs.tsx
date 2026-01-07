import { motion } from 'framer-motion';
import { Building2, Calendar, MapPin, Layers, TrendingUp, CreditCard } from 'lucide-react';

interface PropertySpecsProps {
  bedrooms: number[];
  priceFrom: number;
  priceTo?: number | null;
  completionDate: string | null;
  area: string;
  location: string;
  paymentPlan?: string | null;
  roiEstimate?: number | null;
  developer?: string;
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const formatBedrooms = (bedrooms: number[]): string => {
  if (!bedrooms || bedrooms.length === 0) return 'Studio';
  if (bedrooms.length === 1) {
    return bedrooms[0] === 0 ? 'Studio' : `${bedrooms[0]} Bedrooms`;
  }
  const min = Math.min(...bedrooms);
  const max = Math.max(...bedrooms);
  return min === 0 ? `Studio – ${max} Bedrooms` : `${min} – ${max} Bedrooms`;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'To Be Announced';
  const date = new Date(dateString);
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
};

export const PropertySpecs = ({
  bedrooms,
  priceFrom,
  priceTo,
  completionDate,
  area,
  location,
  paymentPlan,
  roiEstimate,
  developer,
}: PropertySpecsProps) => {
  const specs = [
    {
      icon: Building2,
      label: 'Bedrooms',
      value: formatBedrooms(bedrooms),
    },
    {
      icon: Layers,
      label: 'Price Range',
      value: priceTo && priceTo > priceFrom 
        ? `${formatPrice(priceFrom)} – ${formatPrice(priceTo)}`
        : formatPrice(priceFrom),
    },
    {
      icon: Calendar,
      label: 'Completion',
      value: formatDate(completionDate),
    },
    {
      icon: MapPin,
      label: 'Location',
      value: `${area}, ${location}`,
    },
    ...(paymentPlan ? [{
      icon: CreditCard,
      label: 'Payment Plan',
      value: paymentPlan,
    }] : []),
    ...(roiEstimate && roiEstimate > 0 ? [{
      icon: TrendingUp,
      label: 'Est. ROI',
      value: `${roiEstimate}%`,
    }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-champagne/50 border border-border/50"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-border/50">
        <h2 className="text-xs font-medium uppercase tracking-luxury text-muted-foreground">
          At a Glance
        </h2>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3">
        {specs.map((spec, index) => (
          <div
            key={spec.label}
            className={`px-8 py-6 ${
              index < specs.length - (specs.length % 3 || 3) ? 'border-b' : ''
            } ${
              (index + 1) % 3 !== 0 ? 'border-r' : ''
            } border-border/50`}
          >
            <div className="flex items-center gap-3 mb-3">
              <spec.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {spec.label}
              </span>
            </div>
            <p className="text-lg font-medium text-foreground">
              {spec.value}
            </p>
          </div>
        ))}
      </div>

      {/* Developer Footer */}
      {developer && (
        <div className="px-8 py-4 border-t border-border/50 bg-background/50">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Developed by{' '}
          </span>
          <span className="text-sm font-medium text-foreground">
            {developer}
          </span>
        </div>
      )}
    </motion.div>
  );
};
