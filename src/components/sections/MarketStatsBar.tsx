import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const stats = [
  { value: '8.2%', label: 'Avg Rental Yield' },
  { value: '0%', label: 'Income Tax' },
  { value: '10yr', label: 'Golden Visa' },
];

export const MarketStatsBar = () => {
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true });

  return (
    <section 
      ref={ref} 
      className="py-6 md:py-8 bg-foreground text-background"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="font-serif text-2xl md:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-luxury text-background/70">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
