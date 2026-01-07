import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Coins, Building, ArrowDown, Check } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function MathematicsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section 
      ref={containerRef} 
      className="relative section-padding-lg bg-background overflow-hidden" 
      id="mathematics"
    >
      {/* Ambient Background */}
      <motion.div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[150px] pointer-events-none"
        style={{ y: backgroundY }}
      />

      <div ref={ref} className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20 md:mb-32"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <motion.p
            className="text-gold text-sm uppercase tracking-[0.3em] mb-6"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            The Mathematics
          </motion.p>
          <h2 className="mb-6">
            Own more.<br />
            <span className="text-muted-foreground">Pay less today.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Off-plan ownership spreads the cost over years, making premium property accessible without tying up all your capital.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Traditional Ownership */}
          <motion.div
            className="relative bg-secondary/50 rounded-[2rem] p-8 lg:p-12 backdrop-blur-sm"
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-muted-foreground/10 flex items-center justify-center">
                <Coins className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-light">Traditional</h3>
                <p className="text-muted-foreground">100% upfront</p>
              </div>
            </div>

            <div className="text-center py-16 mb-8 border-y border-border/50">
              <p className="text-muted-foreground text-sm mb-3 uppercase tracking-widest">Required today</p>
              <p className="text-6xl md:text-7xl font-extralight text-muted-foreground tracking-tight">
                AED <AnimatedCounter value={1500000} className="text-muted-foreground" suffix="" />
              </p>
              <p className="text-muted-foreground mt-3 text-sm">Full price on day one</p>
            </div>

            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                Ties up all your capital
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                No leverage opportunity
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                Limited portfolio growth
              </li>
            </ul>
          </motion.div>

          {/* Off-Plan Ownership */}
          <motion.div
            className="relative bg-card rounded-[2rem] p-8 lg:p-12 border-2 border-gold/30 overflow-hidden shadow-[0_0_80px_-20px_hsl(var(--gold)/0.3)]"
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {/* Glow Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/20 rounded-full blur-[80px]" />

            {/* Badge */}
            <div className="absolute top-6 right-6 bg-gold text-gold-foreground text-xs font-medium px-4 py-2 rounded-full">
              Recommended
            </div>

            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center">
                <Building className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-light">Off-Plan</h3>
                <p className="text-muted-foreground">Pay as it's built</p>
              </div>
            </div>

            {/* Payment Timeline */}
            <div className="space-y-4 mb-8">
              <motion.div 
                className="flex items-center justify-between p-5 bg-gold/10 rounded-2xl border border-gold/20"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Today</p>
                  <p className="text-3xl font-light text-gold">AED 150K</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">10% deposit</p>
                  <p className="text-gold text-sm font-medium">Start here</p>
                </div>
              </motion.div>

              <div className="flex justify-center py-2">
                <ArrowDown className="w-5 h-5 text-muted-foreground/40" />
              </div>

              <motion.div 
                className="flex items-center justify-between p-5 bg-secondary/50 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <div>
                  <p className="text-sm text-muted-foreground mb-1">During construction</p>
                  <p className="text-2xl font-light">AED 6,250<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                </div>
                <p className="text-xs text-muted-foreground">10% over 24mo</p>
              </motion.div>

              <div className="flex justify-center py-2">
                <ArrowDown className="w-5 h-5 text-muted-foreground/40" />
              </div>

              <motion.div 
                className="flex items-center justify-between p-5 bg-secondary/50 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div>
                  <p className="text-sm text-muted-foreground mb-1">On handover</p>
                  <p className="text-2xl font-light">AED 1.2M</p>
                </div>
                <p className="text-xs text-muted-foreground">Via mortgage</p>
              </motion.div>
            </div>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-gold" />
                Start with just 10%
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-gold" />
                Flexible payments over 2-3 years
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-gold" />
                Property appreciates during construction
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Message */}
        <motion.div
          className="text-center mt-20 md:mt-32"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <p className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight">
            Own <span className="text-gold font-light">100%</span>
            <span className="text-muted-foreground"> · </span>
            Pay <span className="text-gold font-light">20%</span> over 3 years
          </p>
        </motion.div>
      </div>
    </section>
  );
}