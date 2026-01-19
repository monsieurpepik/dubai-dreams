import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenant';

export const InvestmentMathSection = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const { formatPrice } = useTenant();

  // Investment projection data
  const initialInvestment = 500000;
  const projectedValue = 850000;
  const years = 5;
  const growthPercent = Math.round(((projectedValue - initialInvestment) / initialInvestment) * 100);

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--accent)/0.05),transparent_70%)]" />
      </div>

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Label */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="label-editorial text-muted-foreground mb-6 block"
          >
            The Investment Case
          </motion.span>

          {/* Main Visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
              {/* Initial Investment */}
              <div className="text-center">
                <span className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground">
                  {formatPrice(initialInvestment, { compact: true })}
                </span>
                <p className="text-sm text-muted-foreground mt-2">Today</p>
              </div>

              {/* Arrow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-muted-foreground"
              >
                <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </motion.div>

              {/* Projected Value */}
              <div className="text-center">
                <span className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground">
                  {formatPrice(projectedValue, { compact: true })}
                </span>
                <p className="text-sm text-muted-foreground mt-2">In {years} years</p>
              </div>
            </div>
          </motion.div>

          {/* Growth Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent text-sm font-medium">
              +{growthPercent}% projected growth
            </span>
          </motion.div>

          {/* Explanation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg"
          >
            Off-plan properties in Dubai offer capital appreciation potential 
            combined with rental yields averaging 6-8% annually.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              to="/calculator"
              className="inline-block px-10 py-4 bg-foreground text-background text-xs font-medium uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors duration-300"
            >
              Calculate Your Returns
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
