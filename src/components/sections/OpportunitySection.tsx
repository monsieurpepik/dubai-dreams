import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function OpportunitySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section
      id="opportunity"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Pure black background - text is the hero */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Subtle top light leak - Electric blue */}
      <motion.div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ 
          background: "radial-gradient(circle, hsl(var(--accent) / 0.15) 0%, transparent 70%)",
          opacity 
        }}
      />

      {/* Content */}
      <div ref={ref} className="relative z-10 text-center text-foreground px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
          className="space-y-12 md:space-y-16"
        >
          {/* Stats Row - Glowing numbers (white with blue glow) */}
          <motion.div
            className="flex flex-wrap justify-center gap-12 md:gap-24 mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-extralight text-foreground mb-3 drop-shadow-[0_0_30px_hsl(var(--accent)/0.5)]">
                <AnimatedCounter value={1995} prefix="" />
              </div>
              <p className="text-metallic text-xs uppercase tracking-[0.3em]">Desert</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-extralight text-foreground mb-3 drop-shadow-[0_0_30px_hsl(var(--accent)/0.5)]">
                $<AnimatedCounter value={50} />B
              </div>
              <p className="text-metallic text-xs uppercase tracking-[0.3em]">Today</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-extralight text-foreground mb-3 drop-shadow-[0_0_30px_hsl(var(--accent)/0.5)]">
                ∞
              </div>
              <p className="text-metallic text-xs uppercase tracking-[0.3em]">Tomorrow</p>
            </div>
          </motion.div>

          {/* Main text - Pure typography, dramatic reveals */}
          <div className="space-y-6">
            <motion.p
              className="text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight tracking-tight"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 0.4, duration: 1 }}
            >
              In 1995, Dubai Marina was <span className="text-muted-foreground">desert</span>.
            </motion.p>

            <motion.p
              className="text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight tracking-tight"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 0.7, duration: 1 }}
            >
              Today, it's worth{" "}
              <span className="text-foreground font-light drop-shadow-[0_0_20px_hsl(var(--accent)/0.4)]">$50 billion</span>.
            </motion.p>

            <motion.p
              className="text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight tracking-tight"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 1, duration: 1 }}
            >
              Tomorrow starts{" "}
              <span className="relative inline-block">
                <span className="text-foreground font-light">today</span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={inView ? { scaleX: 1, opacity: 1 } : {}}
                  transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>.
            </motion.p>
          </div>

          {/* Serif tagline */}
          <motion.p
            className="font-serif italic text-xl md:text-2xl text-metallic mt-16"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.8, duration: 1 }}
          >
            "If comparable, it is no longer Dubai."
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}