import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Building2, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users, value: '2,400+', label: 'Investors from 47 countries' },
  { icon: TrendingUp, value: 'AED 1.2B+', label: 'In property matched' },
  { icon: Building2, value: '50+', label: 'Verified developers' },
];

export function TrustBar() {
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true });

  return (
    <section ref={ref} className="py-8 md:py-10 border-b border-border/10 bg-muted/30">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <stat.icon className="w-4 h-4 text-muted-foreground/60" strokeWidth={1.5} />
              <span className="font-serif text-lg text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
