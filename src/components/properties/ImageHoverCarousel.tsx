import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

export const ImageHoverCarousel = ({ images, className = '' }: ImageHoverCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.display_order || 0) - (b.display_order || 0);
  });
  const maxImages = Math.min(sortedImages.length, 5);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxImages - 1)));
  }, [maxImages]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goTo(currentIndex - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goTo(currentIndex + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setCurrentIndex(0); }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={sortedImages[currentIndex].url}
          alt={sortedImages[currentIndex].alt_text || 'Property image'}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
      </AnimatePresence>

      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Left/Right arrow buttons — Airbnb style */}
      {sortedImages.length > 1 && isHovered && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/90 border border-border/50 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
          )}
          {currentIndex < maxImages - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/90 border border-border/50 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          )}
        </>
      )}

      {/* Dot indicators — Airbnb round dots */}
      {sortedImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[5px] z-10">
          {sortedImages.slice(0, maxImages).map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(index); }}
              className={`w-[6px] h-[6px] rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Count Badge */}
      {sortedImages.length > maxImages && (
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] z-10">
          +{sortedImages.length - maxImages}
        </div>
      )}
    </div>
  );
};
