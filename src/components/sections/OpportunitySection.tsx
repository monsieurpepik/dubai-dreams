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

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      id="opportunity"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax Zoom */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=2000&auto=format&fit=crop')`,
            scale,
            y,
          }}
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" 
        style={{ background: "radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(0,0,0,0.5) 100%)" }} 
      />

      {/* Content */}
      <div ref={ref} className="relative z-10 text-center text-white px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
          className="space-y-6 md:space-y-8"
        >
          {/* Stats Row */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-extralight text-gold mb-2">
                <AnimatedCounter value={1995} prefix="" />
              </div>
              <p className="text-white/50 text-sm uppercase tracking-widest">Desert</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-extralight text-gold mb-2">
                $<AnimatedCounter value={50} />B
              </div>
              <p className="text-white/50 text-sm uppercase tracking-widest">Today</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-extralight text-gold mb-2">
                ∞
              </div>
              <p className="text-white/50 text-sm uppercase tracking-widest">Tomorrow</p>
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.p
              className="text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 0.4, duration: 1 }}
            >
              In 1995, Dubai Marina was <span className="text-white/40">desert</span>.
            </motion.p>

            <motion.p
              className="text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 0.7, duration: 1 }}
            >
              Today, it's worth{" "}
              <span className="text-gold font-light">$50 billion</span>.
            </motion.p>

            <motion.p
              className="text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 1, duration: 1 }}
            >
              Tomorrow starts{" "}
              <span className="relative inline-block">
                <span className="text-gold">today</span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gold"
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                />
              </span>.
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}