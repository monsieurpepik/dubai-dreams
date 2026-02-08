import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const collections = [
  {
    id: 'golden-visa',
    title: 'Golden Visa Eligible',
    description: '10-year UAE residency',
    filter: 'golden-visa',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  },
  {
    id: 'high-yield',
    title: 'High Yield Projects',
    description: '7%+ estimated returns',
    filter: 'high-yield',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
  },
  {
    id: 'handover-2025',
    title: 'Handover 2025',
    description: 'Ready for delivery',
    filter: 'handover-2025',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  },
  {
    id: 'waterfront',
    title: 'Waterfront Living',
    description: 'Beachfront & marina',
    filter: 'waterfront',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
  },
];

export const CollectionsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section ref={ref} className="py-28 md:py-36 lg:py-44 bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="font-serif text-foreground">
            Browse by Interest
          </h2>
        </motion.div>

        {/* Collection Cards — 2-column, full-bleed images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/properties?collection=${collection.filter}`}
                className="group block relative aspect-[16/10] overflow-hidden bg-muted"
              >
                {/* Background image with hover parallax */}
                <motion.img
                  src={collection.image}
                  alt={collection.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Text overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-1 group-hover:translate-y-[-2px] transition-transform duration-300">
                    {collection.title}
                  </h3>
                  <p className="text-sm text-white/60">
                    {collection.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="absolute top-6 right-6 text-white/40 group-hover:text-white/80 transition-colors duration-300">
                  <span className="text-xl">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
