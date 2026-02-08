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
      className="py-8 md:py-10 bg-foreground text-background"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <span className="font-serif text-3xl md:text-4xl">
                {stat.value}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-background/60">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
