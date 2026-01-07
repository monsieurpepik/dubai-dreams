import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const properties = [
  {
    id: 1,
    name: "Emaar Beachfront",
    developer: "Emaar Properties",
    location: "Dubai Harbour",
    price: "2,450,000",
    paymentPlan: "20/80",
    completion: "Q4 2026",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop",
    description: "Wake up to yachts. Sleep under stars.",
    roi: "8.2%",
  },
  {
    id: 2,
    name: "Dubai Hills Estate",
    developer: "Emaar Properties",
    location: "Mohammed Bin Rashid City",
    price: "1,200,000",
    paymentPlan: "40/60",
    completion: "Q2 2026",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000&auto=format&fit=crop",
    description: "Golf course views. City at your feet.",
    roi: "7.5%",
  },
  {
    id: 3,
    name: "Damac Hills 2",
    developer: "Damac Properties",
    location: "Dubai South",
    price: "650,000",
    paymentPlan: "20/80",
    completion: "Q1 2026",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    description: "Where every day feels like vacation.",
    roi: "9.1%",
  },
  {
    id: 4,
    name: "Palm Jumeirah Residences",
    developer: "Nakheel",
    location: "Palm Jumeirah",
    price: "3,800,000",
    paymentPlan: "30/70",
    completion: "Q3 2026",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2000&auto=format&fit=crop",
    description: "Iconic address. Unrivaled prestige.",
    roi: "6.8%",
  },
];

export function PropertiesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % properties.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + properties.length) % properties.length);

  return (
    <section 
      id="properties" 
      ref={containerRef}
      className="relative min-h-screen bg-background overflow-hidden"
    >
      {/* Gradient background - subtle shift */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div ref={ref} className="relative z-10 py-24 md:py-32">
        {/* Section Header */}
        <div className="container-custom mb-16 md:mb-24">
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <div>
              <motion.p
                className="text-accent text-xs uppercase tracking-[0.3em] mb-4"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Featured Properties
              </motion.p>
              <h2>
                Curated for<br />
                <span className="text-muted-foreground">discerning investors.</span>
              </h2>
            </div>
            
            {/* Navigation - Thin borders, minimal */}
            <div className="flex items-center gap-4">
              <button
                onClick={prevSlide}
                className="w-14 h-14 border border-border/50 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-14 h-14 border border-border/50 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-500"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-metallic ml-4 tabular-nums text-sm tracking-widest">
                {String(activeIndex + 1).padStart(2, '0')} / {String(properties.length).padStart(2, '0')}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Property Showcase - Floating in darkness */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="container-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center">
                {/* Image - Sharp corners, floating with shadow */}
                <div className="relative aspect-[4/3] lg:aspect-[16/12] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                  <motion.img
                    src={properties[activeIndex].image}
                    alt={properties[activeIndex].name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1, filter: "brightness(0.8)" }}
                    animate={{ scale: 1, filter: "brightness(0.9)" }}
                    transition={{ duration: 1 }}
                  />
                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent lg:hidden" />
                  
                  {/* Payment Plan Badge */}
                  <div className="absolute top-6 left-6 bg-accent text-accent-foreground text-xs font-medium px-4 py-2 uppercase tracking-wider">
                    {properties[activeIndex].paymentPlan} Plan
                  </div>

                  {/* ROI Badge */}
                  <div className="absolute top-6 right-6 bg-background/80 backdrop-blur-xl text-foreground text-xs font-medium px-4 py-2 border border-border/30">
                    {properties[activeIndex].roi} ROI
                  </div>

                  {/* Chrome border glow on active */}
                  <motion.div 
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      boxShadow: "inset 0 0 0 1px hsl(var(--accent) / 0.2)"
                    }}
                  />
                </div>

                {/* Content */}
                <div className="lg:pl-16 xl:pl-24">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <p className="text-metallic text-xs uppercase tracking-[0.2em] mb-3">
                      {properties[activeIndex].developer}
                    </p>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight mb-4">
                      {properties[activeIndex].name}
                    </h3>
                    <p className="text-2xl text-muted-foreground font-serif italic mb-8">
                      "{properties[activeIndex].description}"
                    </p>

                    <div className="flex flex-wrap gap-6 mb-10">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="text-sm">{properties[activeIndex].location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span className="text-sm">{properties[activeIndex].completion}</span>
                      </div>
                    </div>

                    <div className="mb-10">
                      <p className="text-metallic text-xs uppercase tracking-[0.2em] mb-2">Starting from</p>
                      <p className="text-4xl md:text-5xl font-extralight text-foreground drop-shadow-[0_0_20px_hsl(var(--accent)/0.3)]">
                        AED {properties[activeIndex].price}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <MagneticButton className="btn-metallic">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                      </MagneticButton>
                      <button className="px-8 py-3 border border-border/50 text-sm uppercase tracking-wider hover:border-accent hover:text-accent transition-all duration-500">
                        Schedule Tour
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Property Thumbnails - Minimal dots indicator */}
        <div className="container-custom mt-16">
          <div className="flex justify-center gap-3">
            {properties.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 transition-all duration-500 ${
                  index === activeIndex 
                    ? "bg-accent w-8" 
                    : "bg-border/50 hover:bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}