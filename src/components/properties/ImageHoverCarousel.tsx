import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertyImage {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
}

interface ImageHoverCarouselProps {
  images: PropertyImage[];
  className?: string;
  featured?: boolean;
}

export const ImageHoverCarousel = ({ images, className = '', featured = false }: ImageHoverCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);
  const maxImages = Math.min(sortedImages.length, 5);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || sortedImages.length <= 1) return;
    
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const percentage = x / width;
    const newIndex = Math.min(Math.floor(percentage * maxImages), maxImages - 1);
    
    if (newIndex !== currentIndex && newIndex >= 0) {
      setCurrentIndex(newIndex);
    }
  };

  const handleMouseLeave = () => {
    setCurrentIndex(0);
  };

  if (sortedImages.length === 0) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">No images</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Image with Parallax Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={sortedImages[currentIndex].url}
            alt={sortedImages[currentIndex].alt_text || 'Property image'}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

      {/* Progress Dots - Modern Airbnb Style */}
      {sortedImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {sortedImages.slice(0, maxImages).map((_, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={false}
            >
              <motion.div
                className="h-1 rounded-full bg-white/40"
                animate={{
                  width: index === currentIndex ? 24 : 6,
                  backgroundColor: index === currentIndex ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Image Count Badge */}
      {sortedImages.length > maxImages && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium z-10"
        >
          +{sortedImages.length - maxImages} more
        </motion.div>
      )}

      {/* Hover Zone Indicators (subtle) */}
      {sortedImages.length > 1 && (
        <div className="absolute inset-0 flex opacity-0 hover:opacity-100 transition-opacity duration-300">
          {sortedImages.slice(0, maxImages).map((_, index) => (
            <div
              key={index}
              className="flex-1 cursor-pointer"
              style={{ width: `${100 / maxImages}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
