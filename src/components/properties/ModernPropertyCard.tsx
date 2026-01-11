import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Calendar, Building, TrendingUp } from 'lucide-react';
import { ImageHoverCarousel } from './ImageHoverCarousel';
import { FloatingSaveButton } from './QuickActions';
import { DynamicBadges, StatusBadge } from './DynamicBadges';

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

interface ModernPropertyCardProps {
  property: Property;
  index: number;
  featured?: boolean;
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
    return bedrooms[0] === 0 ? 'Studio' : `${bedrooms[0]} BR`;
  }
  const min = Math.min(...bedrooms);
  const max = Math.max(...bedrooms);
  return min === 0 ? `Studio – ${max} BR` : `${min} – ${max} BR`;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
};

export const ModernPropertyCard = ({ property, index, featured = false }: ModernPropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Magnetic effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 350, damping: 25, mass: 0.5 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ['2deg', '-2deg']);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-2deg', '2deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const sortedImages = property.property_images?.sort((a, b) => a.display_order - b.display_order) || [];

  return (
    <Link to={`/properties/${property.slug}`} className="block group">
      <motion.article
        ref={cardRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ 
          duration: 0.7, 
          delay: Math.min(index * 0.08, 0.4), 
          ease: [0.22, 1, 0.36, 1] 
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`
          relative rounded-2xl overflow-hidden bg-card
          transition-shadow duration-500 ease-out
          ${featured ? 'col-span-full' : ''}
          ${isHovered ? 'shadow-2xl shadow-black/20' : 'shadow-lg shadow-black/10'}
        `}
      >
        {/* Image Container */}
        <div className={`relative overflow-hidden ${featured ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
          <ImageHoverCarousel 
            images={sortedImages} 
            className="w-full h-full"
            featured={featured}
          />
          
          {/* Save Button */}
          <FloatingSaveButton 
            propertyId={property.id} 
            className="absolute top-4 right-4 z-20"
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-20">
            <StatusBadge status={property.status} />
          </div>
          
          {/* Dynamic Badges - Bottom Left */}
          <div className="absolute bottom-4 left-4 z-20">
            <DynamicBadges
              status={property.status}
              roiEstimate={property.roi_estimate}
              completionDate={property.completion_date}
              goldenVisaEligible={property.golden_visa_eligible}
            />
          </div>

          {/* Hover Overlay with Quick Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
          />
        </div>

        {/* Content */}
        <motion.div 
          className="p-5 space-y-3"
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Developer */}
          {property.developer && (
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {property.developer.name}
            </p>
          )}
          
          {/* Property Name */}
          <h3 className={`font-serif leading-tight text-foreground transition-colors duration-300 group-hover:text-accent ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          }`}>
            {property.name}
          </h3>
          
          {/* Location with Icon */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{property.area}, {property.location}</span>
          </div>

          {/* Property Details Row */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building className="w-3.5 h-3.5" />
              <span>{formatBedrooms(property.bedrooms)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(property.completion_date)}</span>
            </div>
            {property.roi_estimate && (
              <div className="flex items-center gap-1.5 text-xs text-accent">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{property.roi_estimate.toFixed(1)}% ROI</span>
              </div>
            )}
          </div>

          {/* Price and Payment Plan */}
          <div className="flex items-end justify-between pt-3 border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Starting from</p>
              <p className="text-lg font-medium text-foreground">
                {formatPrice(property.price_from)}
              </p>
            </div>
            {property.payment_plan && (
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Payment Plan</p>
                <p className="text-sm font-medium text-foreground">
                  {property.payment_plan}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Hover Glow Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.5 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: 'radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.15), transparent 70%)',
          }}
        />
      </motion.article>
    </Link>
  );
};
