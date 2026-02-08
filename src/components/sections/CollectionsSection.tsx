import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const collections = [
  {
    id: 'golden-visa',
    title: 'Golden Visa Eligible',
    stat: '10yr',
    statLabel: 'Residency',
    description: 'Secure long-term UAE residency with qualifying investments',
    filter: 'golden-visa',
    accent: 'border-accent/30',
  },
  {
    id: 'high-yield',
    title: 'High Yield Projects',
    stat: '7%+',
    statLabel: 'Est. Returns',
    description: 'Top-performing developments by projected rental yield',
    filter: 'high-yield',
    accent: 'border-border/50',
  },
  {
    id: 'handover-2025',
    title: 'Handover 2025–26',
    stat: 'Q4',
    statLabel: 'Delivery',
    description: 'Move-in ready or near completion — no more waiting',
    filter: 'handover-2025',
    accent: 'border-border/50',
  },
  {
    id: 'waterfront',
    title: 'Waterfront Living',
    stat: '12+',
    statLabel: 'Projects',
    description: 'Beachfront, marina, and canal-side residences',
    filter: 'waterfront',
    accent: 'border-border/50',
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

        {/* Bento Grid — 1 large hero + 3 smaller */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Hero Card — Golden Visa */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="md:row-span-2"
          >
            <Link
              to={`/properties?collection=${collections[0].filter}`}
              className={`group block h-full border ${collections[0].accent} bg-card p-8 md:p-10 transition-all duration-500 hover:border-foreground/30 hover:bg-secondary/50`}
            >
              <div className="flex flex-col justify-between h-full min-h-[300px] md:min-h-full">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
                    Featured Collection
                  </span>
                </div>
                
                <div className="my-auto py-10">
                  <span className="font-serif text-8xl md:text-9xl lg:text-[10rem] text-foreground leading-none block">
                    {collections[0].stat}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mt-2 block">
                    {collections[0].statLabel}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    {collections[0].title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {collections[0].description}
                  </p>
                  <span className="inline-block mt-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground group-hover:text-foreground transition-colors">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Smaller cards */}
          {collections.slice(1).map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: (index + 1) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/properties?collection=${collection.filter}`}
                className={`group block border ${collection.accent} bg-card p-7 md:p-8 transition-all duration-500 hover:border-foreground/30 hover:bg-secondary/50 h-full`}
              >
                <div className="flex flex-col justify-between h-full min-h-[180px]">
                  <div>
                    <span className="font-serif text-4xl md:text-5xl text-foreground leading-none">
                      {collection.stat}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-3">
                      {collection.statLabel}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-6">
                    <h3 className="font-serif text-xl text-foreground mb-1 group-hover:translate-x-1 transition-transform duration-300">
                      {collection.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
