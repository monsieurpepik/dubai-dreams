import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Calendar, Building2, Award, ChevronDown } from 'lucide-react';

interface PropertyHeroProps {
  image: string;
  name: string;
  developer?: string;
  location: string;
  area: string;
  tagline?: string | null;
  goldenVisaEligible?: boolean;
  priceFrom: number;
  bedrooms: number[];
  completionDate: string | null;
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
  return min === 0 ? `Studio – ${max} BR` : `${min} – ${max} BR`;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
};

export const PropertyHero = ({
  image,
  name,
  developer,
  location,
  area,
  tagline,
  goldenVisaEligible,
  priceFrom,
  bedrooms,
  completionDate,
}: PropertyHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  const scrollToContent = () => {
    const content = document.getElementById('property-content');
    content?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Ken Burns subtle animation */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* Content */}
      <motion.div 
        className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-28"
        style={{ opacity }}
      >
        <div className="container-wide">
          {/* Golden Visa Badge */}
          {goldenVisaEligible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/90 text-black text-xs font-medium uppercase tracking-luxury">
                <Award className="w-4 h-4" />
                Golden Visa Eligible
              </span>
            </motion.div>
          )}

          {/* Developer */}
          {developer && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="block text-xs md:text-sm font-medium text-white/60 uppercase tracking-luxury mb-4"
            >
              {developer}
            </motion.span>
          )}

          {/* Property Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-4 leading-[0.95]"
          >
            {name}
          </motion.h1>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 text-white/70 mb-6"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{area}, {location}</span>
          </motion.div>

          {/* Tagline */}
          {tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-white/50 text-lg md:text-xl italic max-w-2xl mb-8"
            >
              "{tagline}"
            </motion.p>
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/20"
          >
            <div>
              <span className="text-xs text-white/40 uppercase tracking-wider block mb-1">From</span>
              <span className="text-3xl md:text-4xl font-light text-white">{formatPrice(priceFrom)}</span>
            </div>
            
            <div className="hidden md:block w-px h-12 bg-white/20" />
            
            <div className="flex items-center gap-2 text-white/70">
              <Building2 className="w-5 h-5" />
              <span>{formatBedrooms(bedrooms)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/70">
              <Calendar className="w-5 h-5" />
              <span>Handover {formatDate(completionDate)}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.button>
    </div>
  );
};
