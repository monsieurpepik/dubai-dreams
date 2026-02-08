import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenant';
import { useEffect } from 'react';

function AnimatedNumber({ value, inView }: { value: number; inView: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
    }
  }, [inView, value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export const InvestmentMathSection = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  const { formatPrice } = useTenant();

  const initialInvestment = 500000;
  const projectedValue = 850000;
  const years = 5;
  const growthPercent = Math.round(((projectedValue - initialInvestment) / initialInvestment) * 100);

  return (
    <section ref={ref} className="relative py-28 md:py-36 lg:py-44 bg-background overflow-hidden">
      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <span className="font-serif text-8xl md:text-[10rem] lg:text-[12rem] text-foreground leading-none">
              +<AnimatedNumber value={growthPercent} inView={inView} />%
            </span>
          </motion.div>

          {/* Supporting detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6"
          >
            <span className="text-sm text-muted-foreground">
              {formatPrice(initialInvestment, { compact: true })} → {formatPrice(projectedValue, { compact: true })} in {years} years
            </span>
          </motion.div>

          {/* Comparison context — trust layer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8"
          >
            <span className="text-xs text-muted-foreground/70 border border-border/50 px-3 py-1.5">
              vs. S&P 500: +62%
            </span>
            <span className="text-xs text-muted-foreground/70 border border-border/50 px-3 py-1.5">
              vs. London RE: +18%
            </span>
            <span className="text-xs text-muted-foreground/70 border border-border/50 px-3 py-1.5">
              vs. Singapore: +34%
            </span>
          </motion.div>

          {/* One-liner */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-muted-foreground max-w-md mx-auto mb-4 text-lg"
          >
            Off-plan capital appreciation combined with 6-8% rental yields.
          </motion.p>

          {/* Source citation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-[10px] text-muted-foreground/50 mb-12"
          >
            Based on Dubai Land Department data, 2020–2025. Past performance does not guarantee future results.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.65 }}
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
