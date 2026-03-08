import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Landmark, BadgePercent, Globe } from 'lucide-react';

const facts = [
  { icon: BadgePercent, stat: '0%', label: 'Income Tax', detail: 'No capital gains, no property tax on purchase' },
  { icon: Landmark, stat: '100%', label: 'Freehold Ownership', detail: 'Full foreign ownership in designated zones' },
  { icon: Shield, stat: 'RERA', label: 'Escrow Protected', detail: 'Developer funds held in regulated escrow accounts' },
  { icon: Globe, stat: '10yr', label: 'Golden Visa', detail: 'Residency visa with AED 2M+ property investment' },
];

export const WhyDubaiStrip = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section ref={ref} className="py-14 md:py-20 border-y border-border/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-10 text-center">
            Why global investors choose Dubai
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <fact.icon className="w-5 h-5 mx-auto mb-4 text-muted-foreground/60" strokeWidth={1.5} />
                <p className="font-serif text-2xl md:text-3xl text-foreground mb-1">{fact.stat}</p>
                <p className="text-xs font-medium text-foreground mb-1">{fact.label}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{fact.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
