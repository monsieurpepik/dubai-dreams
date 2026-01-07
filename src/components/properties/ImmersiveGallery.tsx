import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Grid3X3, Images } from 'lucide-react';

interface PropertyImage {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
}

interface ImmersiveGalleryProps {
  images: PropertyImage[];
  propertyName: string;
}

export const ImmersiveGallery = ({ images, propertyName }: ImmersiveGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(false);

  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.display_order - b.display_order;
  });

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActiveIndex((prev) => (prev + 1) % sortedImages.length);
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, sortedImages.length]);

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-[16/9] bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  const goNext = () => setActiveIndex((prev) => (prev + 1) % sortedImages.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);

  return (
    <>
      {/* Main Gallery Layout */}
      <div className="relative">
        {/* Desktop: Bento Grid Layout */}
        <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-2 h-[70vh] max-h-[700px]">
          {/* Main large image */}
          <div 
            className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group"
            onClick={() => { setActiveIndex(0); setIsLightboxOpen(true); }}
          >
            <motion.img
              src={sortedImages[0].url}
              alt={sortedImages[0].alt_text || propertyName}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
          </div>
          
          {/* Secondary images */}
          {sortedImages.slice(1, 5).map((image, idx) => (
            <div 
              key={image.id}
              className="relative overflow-hidden cursor-pointer group"
              onClick={() => { setActiveIndex(idx + 1); setIsLightboxOpen(true); }}
            >
              <motion.img
                src={image.url}
                alt={image.alt_text || `${propertyName} ${idx + 2}`}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              
              {/* Show count on last visible image if more exist */}
              {idx === 3 && sortedImages.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-lg font-light">
                    +{sortedImages.length - 5} more
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: Single image with swipe */}
        <div className="lg:hidden relative aspect-[4/3] overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={sortedImages[activeIndex].url}
              alt={sortedImages[activeIndex].alt_text || propertyName}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsLightboxOpen(true)}
            />
          </AnimatePresence>
          
          {/* Mobile Navigation */}
          {sortedImages.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground transition-transform hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground transition-transform hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          
          {/* Mobile Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
            {activeIndex + 1} / {sortedImages.length}
          </div>
        </div>

        {/* View All Photos Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-6 right-6 px-5 py-3 bg-white/95 backdrop-blur-sm text-foreground text-sm font-medium flex items-center gap-2 hover:bg-white transition-colors shadow-lg"
        >
          <Images className="w-4 h-4" />
          View All {sortedImages.length} Photos
        </button>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6">
              <span className="text-white/80 text-sm">
                {activeIndex + 1} of {sortedImages.length}
              </span>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsGridView(!isGridView)}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {isGridView ? (
              /* Grid View */
              <div className="h-full pt-20 pb-6 px-6 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {sortedImages.map((image, idx) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="aspect-[4/3] cursor-pointer overflow-hidden"
                      onClick={() => { setActiveIndex(idx); setIsGridView(false); }}
                    >
                      <img
                        src={image.url}
                        alt={image.alt_text || `${propertyName} ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              /* Single Image View */
              <>
                {/* Navigation Arrows */}
                {sortedImages.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                    >
                      <ChevronLeft className="w-7 h-7" />
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                    >
                      <ChevronRight className="w-7 h-7" />
                    </button>
                  </>
                )}

                {/* Main Image */}
                <div className="h-full flex items-center justify-center p-20">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeIndex}
                      src={sortedImages[activeIndex].url}
                      alt={sortedImages[activeIndex].alt_text || propertyName}
                      className="max-w-full max-h-full object-contain"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                </div>

                {/* Thumbnail Strip */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2 scrollbar-hide">
                  {sortedImages.map((image, idx) => (
                    <button
                      key={image.id}
                      onClick={() => setActiveIndex(idx)}
                      className={`flex-shrink-0 w-16 h-12 overflow-hidden transition-all ${
                        idx === activeIndex
                          ? 'ring-2 ring-white opacity-100'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
