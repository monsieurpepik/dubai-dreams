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

interface GalleryMosaicProps {
  images: PropertyImage[];
  propertyName: string;
}

export const GalleryMosaic = ({ images, propertyName }: GalleryMosaicProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const sorted = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActiveIndex(i => (i + 1) % sorted.length);
      if (e.key === 'ArrowLeft') setActiveIndex(i => (i - 1 + sorted.length) % sorted.length);
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, sorted.length]);

  if (sorted.length === 0) return null;

  const openAt = (idx: number) => { setActiveIndex(idx); setLightboxOpen(true); };

  return (
    <>
      {/* Mosaic: 1 large + 4 small */}
      <section className="container-wide py-2">
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-[320px] md:h-[420px] rounded-lg overflow-hidden">
          {/* Main large image */}
          <div
            className="col-span-2 row-span-2 relative cursor-pointer group"
            onClick={() => openAt(0)}
          >
            <img
              src={sorted[0].url}
              alt={sorted[0].alt_text || propertyName}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* 4 smaller tiles */}
          {sorted.slice(1, 5).map((img, idx) => (
            <div
              key={img.id}
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => openAt(idx + 1)}
            >
              <img
                src={img.url}
                alt={img.alt_text || `${propertyName} ${idx + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              {/* Show "+N more" on last tile */}
              {idx === 3 && sorted.length > 5 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-sm font-light">+{sorted.length - 5} more</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All button */}
        {sorted.length > 1 && (
          <button
            onClick={() => openAt(0)}
            className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Images className="w-3.5 h-3.5" />
            View all {sorted.length} photos
          </button>
        )}
      </section>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 shrink-0">
              <span className="text-white/60 text-sm">{activeIndex + 1} / {sorted.length}</span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center px-16 relative">
              {sorted.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIndex(i => (i - 1 + sorted.length) % sorted.length)}
                    className="absolute left-4 md:left-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setActiveIndex(i => (i + 1) % sorted.length)}
                    className="absolute right-4 md:right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={sorted[activeIndex].url}
                  alt={sorted[activeIndex].alt_text || propertyName}
                  className="max-w-full max-h-full object-contain"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-1.5 justify-center p-4 overflow-x-auto scrollbar-hide shrink-0">
              {sorted.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-shrink-0 w-14 h-10 overflow-hidden transition-all ${
                    idx === activeIndex ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
