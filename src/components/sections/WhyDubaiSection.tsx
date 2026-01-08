import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Landmark, Plane, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Landmark,
    stat: "0%",
    title: "Income Tax",
    description: "Keep what you earn. No income tax, no capital gains tax on property"
  },
  {
    icon: Shield,
    stat: "10yr",
    title: "Golden Visa",
    description: "Secure residency with AED 2M+ property investment"
  },
  {
    icon: Plane,
    stat: "5hr",
    title: "Global Hub",
    description: "Reach 60% of the world's population within 5 hours"
  },
  {
    icon: TrendingUp,
    stat: "#1",
    title: "Safe Haven",
    description: "Ranked world's safest city for expats and investors"
  }
];

export const WhyDubaiSection = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-secondary overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.1),transparent_70%)]" />
      </div>

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="label-editorial text-muted-foreground mb-4 block">
            For Global Investors
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Why Dubai
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            The world's most dynamic investment destination, where vision becomes reality
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="p-8 md:p-6 lg:p-8 bg-card border border-border/50 h-full transition-all duration-500 hover:border-foreground/30">
                {/* Icon */}
                <div className="mb-6">
                  <benefit.icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                </div>
                
                {/* Stat */}
                <div className="mb-4">
                  <span className="font-serif text-4xl md:text-5xl text-foreground">
                    {benefit.stat}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-foreground mb-3">
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
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <a 
            href="/about" 
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Learn More About Investing in Dubai
            <span className="text-lg">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
