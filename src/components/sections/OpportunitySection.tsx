import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function OpportunitySection() {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section
      id="about"
      className="relative flex min-h-[80vh] items-center justify-center bg-background py-32 md:py-40"
    >
      {/* Content */}
      <div ref={ref} className="container-custom text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
          className="mx-auto max-w-4xl space-y-12"
        >
          {/* Editorial Label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground"
          >
            The Opportunity
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto h-px w-12 bg-border"
          />

          {/* Main Statement - Editorial Typography */}
          <div className="space-y-4">
            <motion.p
              className="font-serif text-3xl font-light leading-relaxed tracking-tight text-foreground md:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 1 }}
            >
              In 1995, Dubai Marina was desert.
            </motion.p>

            <motion.p
              className="font-serif text-3xl font-light leading-relaxed tracking-tight text-foreground md:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Today, it anchors a $50B economy.
            </motion.p>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mx-auto h-px w-24 bg-border"
          />

          {/* Quote */}
          <motion.p
            className="font-serif text-lg italic text-muted-foreground md:text-xl"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 1 }}
          >
            "The next chapter begins now."
          </motion.p>
          
          <motion.p
            className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.8, duration: 1 }}
          >
            — Owning Dubai
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}