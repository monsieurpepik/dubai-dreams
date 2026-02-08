import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Landmark, Plane, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Landmark,
    stat: "0%",
    title: "Income Tax",
    description: "No income tax, no capital gains tax on property"
  },
  {
    icon: Shield,
    stat: "10yr",
    title: "Golden Visa",
    description: "Residency with AED 2M+ property investment"
  },
  {
    icon: Plane,
    stat: "5hr",
    title: "Global Hub",
    description: "Reach 60% of the world's population"
  },
  {
    icon: TrendingUp,
    stat: "#1",
    title: "Safe Haven",
    description: "World's safest city for expats and investors"
  }
];

export const WhyDubaiSection = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-28 md:py-36 lg:py-44 bg-secondary overflow-hidden">
      <div className="container-wide relative z-10">
        {/* Section Header — Apple: big heading, no subtitle clutter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20 md:mb-24"
        >
          <h2 className="font-serif text-foreground">
            Why Dubai
          </h2>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <div className="p-8 md:p-6 lg:p-8 bg-card border border-border/50 h-full transition-all duration-500 hover:border-foreground/20">
                {/* Icon */}
                <div className="mb-6">
                  <benefit.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                
                {/* Stat — Apple: massive number */}
                <div className="mb-4">
                  <motion.span 
                    className="font-serif text-5xl md:text-6xl text-foreground"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {benefit.stat}
                  </motion.span>
                </div>

                {/* Title & Description */}
                <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mt-20"
        >
          <a 
            href="/about" 
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Learn More
            <span className="text-lg">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
