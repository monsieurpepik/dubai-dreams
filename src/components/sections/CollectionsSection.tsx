import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Landmark, TrendingUp, Calendar, Waves } from 'lucide-react';

const collections = [
  {
    id: 'golden-visa',
    icon: Landmark,
    title: 'Golden Visa Eligible',
    description: 'Properties qualifying for 10-year UAE residency',
    filter: 'golden-visa',
  },
  {
    id: 'high-yield',
    icon: TrendingUp,
    title: 'High Yield Projects',
    description: 'Estimated rental returns of 7%+',
    filter: 'high-yield',
  },
  {
    id: 'handover-2025',
    icon: Calendar,
    title: 'Handover 2025',
    description: 'Ready for delivery this year',
    filter: 'handover-2025',
  },
  {
    id: 'waterfront',
    icon: Waves,
    title: 'Waterfront Living',
    description: 'Beachfront and marina properties',
    filter: 'waterfront',
  },
];

export const CollectionsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="label-editorial text-muted-foreground mb-4 block">
            Curated For You
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
            Browse by Interest
          </h2>
        </motion.div>

        {/* Collection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={`/properties?collection=${collection.filter}`}
                className="group block p-8 bg-card border border-border/50 h-full transition-all duration-500 hover:border-foreground/30 hover:bg-accent/5"
              >
                {/* Icon */}
                <div className="mb-6">
                  <collection.icon 
                    className="w-8 h-8 text-foreground transition-transform duration-300 group-hover:scale-110" 
                    strokeWidth={1.5} 
                  />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                  {collection.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {collection.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  <span className="text-lg">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
