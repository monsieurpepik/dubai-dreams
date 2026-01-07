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
      className="relative min-h-screen bg-secondary overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary to-secondary" />

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
                className="text-gold text-sm uppercase tracking-[0.3em] mb-4"
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
            
            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={prevSlide}
                className="w-14 h-14 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-14 h-14 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-muted-foreground ml-4 tabular-nums">
                {String(activeIndex + 1).padStart(2, '0')} / {String(properties.length).padStart(2, '0')}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Property Showcase - Full Width */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="container-wide"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center">
                {/* Image */}
                <div className="relative aspect-[4/3] lg:aspect-[16/12] rounded-[2rem] overflow-hidden">
                  <motion.img
                    src={properties[activeIndex].image}
                    alt={properties[activeIndex].name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Payment Plan Badge */}
                  <div className="absolute top-6 left-6 bg-gold text-gold-foreground text-sm font-medium px-4 py-2 rounded-full">
                    {properties[activeIndex].paymentPlan} Payment Plan
                  </div>

                  {/* ROI Badge */}
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl text-white text-sm font-medium px-4 py-2 rounded-full">
                    {properties[activeIndex].roi} ROI
                  </div>
                </div>

                {/* Content */}
                <div className="lg:pl-16 xl:pl-24">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <p className="text-muted-foreground text-sm mb-3">
                      {properties[activeIndex].developer}
                    </p>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
                      {properties[activeIndex].name}
                    </h3>
                    <p className="text-2xl text-muted-foreground font-light italic mb-8">
                      "{properties[activeIndex].description}"
                    </p>

                    <div className="flex flex-wrap gap-6 mb-10">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-5 h-5 text-gold" />
                        <span>{properties[activeIndex].location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-5 h-5 text-gold" />
                        <span>{properties[activeIndex].completion}</span>
                      </div>
                    </div>

                    <div className="mb-10">
                      <p className="text-muted-foreground text-sm mb-2">Starting from</p>
                      <p className="text-4xl md:text-5xl font-light text-gold">
                        AED {properties[activeIndex].price}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <MagneticButton className="btn-magnetic">
                        View Details
                        <ArrowRight className="w-5 h-5 ml-2 inline-block" />
                      </MagneticButton>
                      <button className="btn-outline-premium">
                        Schedule Tour
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Property Thumbnails */}
        <div className="container-custom mt-16">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {properties.map((property, index) => (
              <button
                key={property.id}
                onClick={() => setActiveIndex(index)}
                className={`relative flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                  index === activeIndex 
                    ? "ring-2 ring-gold ring-offset-2 ring-offset-secondary" 
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}