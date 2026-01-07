import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const properties = [
  {
    id: 1,
    name: "Emaar Beachfront",
    developer: "Emaar Properties",
    location: "Dubai Harbour",
    price: "From AED 2,450,000",
    paymentPlan: "20/80",
    completion: "Q4 2026",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop",
    description: "Wake up to yachts. Sleep under stars.",
  },
  {
    id: 2,
    name: "Dubai Hills Estate",
    developer: "Emaar Properties",
    location: "Mohammed Bin Rashid City",
    price: "From AED 1,200,000",
    paymentPlan: "40/60",
    completion: "Q2 2026",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000&auto=format&fit=crop",
    description: "Golf course views. City at your feet.",
  },
  {
    id: 3,
    name: "Damac Hills 2",
    developer: "Damac Properties",
    location: "Dubai South",
    price: "From AED 650,000",
    paymentPlan: "20/80",
    completion: "Q1 2026",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    description: "Where every day feels like vacation.",
  },
  {
    id: 4,
    name: "Arabian Ranches 3",
    developer: "Emaar Properties",
    location: "Arabian Ranches",
    price: "From AED 1,800,000",
    paymentPlan: "30/70",
    completion: "Q3 2026",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2000&auto=format&fit=crop",
    description: "Space to grow. Room to breathe.",
  },
];

export function PropertiesSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="properties" ref={ref} className="section-padding-lg bg-secondary">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4">Featured properties</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked developments from Dubai's most trusted developers. Premium locations, 
            flexible payment plans, exceptional returns.
          </p>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              className="group relative bg-card rounded-3xl overflow-hidden card-hover"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.8 }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="image-overlay" />

                {/* Payment Plan Badge */}
                <div className="absolute top-4 right-4 bg-gold text-gold-foreground text-xs font-medium px-3 py-1.5 rounded-full">
                  {property.paymentPlan} Plan
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl lg:text-2xl font-medium mb-1">
                      {property.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{property.developer}</p>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground mb-6 italic">
                  "{property.description}"
                </p>

                <div className="flex items-center gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{property.completion}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Starting from</p>
                    <p className="text-xl lg:text-2xl font-medium text-gold">
                      {property.price.replace("From ", "")}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="rounded-full px-5"
                    >
                      Details
                    </Button>
                    <Button
                      className="bg-gold text-gold-foreground hover:bg-gold/90 rounded-full px-5 group/btn"
                    >
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Button
            variant="outline"
            className="rounded-full px-8 py-6 text-lg"
          >
            View all properties
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
