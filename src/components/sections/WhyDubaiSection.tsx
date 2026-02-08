import { motion, useScroll, useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useEffect } from 'react';

const benefits = [
  {
    stat: "0%",
    title: "Income Tax",
    description: "No income tax. No capital gains tax. Keep everything you earn.",
    gradient: "from-background via-secondary to-background",
  },
  {
    stat: "10yr",
    title: "Golden Visa",
    description: "Full UAE residency with a AED 2M+ property investment.",
    gradient: "from-background via-muted to-background",
  },
  {
    stat: "5hr",
    title: "Global Hub",
    description: "Reach 60% of the world's population within a 5-hour flight.",
    gradient: "from-background via-secondary to-background",
  },
  {
    stat: "#1",
    title: "Safe Haven",
    description: "Ranked the world's safest city for expats and investors.",
    gradient: "from-background via-muted to-background",
  }
];

function AnimatedStat({ value }: { value: string }) {
  const isNumeric = /^\d+/.test(value);
  const num = isNumeric ? parseInt(value) : 0;
  const suffix = isNumeric ? value.replace(/^\d+/, '') : '';
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [statRef, statInView] = useInView({ triggerOnce: true, threshold: 0.5 });
  
  useEffect(() => {
    if (statInView && isNumeric) {
      animate(count, num, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
    }
  }, [statInView, isNumeric, num, count]);

  if (!isNumeric) {
    return <span>{value}</span>;
  }
  
  return <span ref={statRef}><motion.span>{rounded}</motion.span>{suffix}</span>;
}

export const WhyDubaiSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative bg-background">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 pt-32 pb-8 pointer-events-none">
        <div className="container-wide">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground"
          >
            Why Dubai
          </motion.p>
        </div>
      </div>

      {/* Each benefit = sticky full-viewport reveal */}
      {benefits.map((benefit, index) => (
        <div key={benefit.title} className="min-h-screen flex items-center relative">
          <div className={`absolute inset-0 bg-gradient-to-b ${benefit.gradient} opacity-50`} />
          <div className="container-wide relative z-10 py-20">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-30%' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Massive stat */}
                <span className="font-serif text-[8rem] md:text-[12rem] lg:text-[16rem] text-foreground leading-none block">
                  <AnimatedStat value={benefit.stat} />
                </span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 md:mt-0"
              >
                <h3 className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">
                  {benefit.title}
                </h3>
                <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-lg leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      ))}

      {/* Bottom CTA */}
      <div className="py-20 text-center">
        <motion.a
          href="/about"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Learn More
          <span className="text-lg">→</span>
        </motion.a>
      </div>
    </section>
  );
};
