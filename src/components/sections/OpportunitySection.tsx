import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function OpportunitySection() {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section
      id="opportunity"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Slow Zoom */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=2000&auto=format&fit=crop')`,
          }}
          animate={{
            scale: inView ? 1.1 : 1,
          }}
          transition={{
            duration: 20,
            ease: "linear",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <motion.p
            className="text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            In 1995, Dubai Marina was desert.
          </motion.p>

          <motion.p
            className="text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Today, it's worth{" "}
            <span className="text-gold font-normal">$50 billion</span>.
          </motion.p>

          <motion.p
            className="text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Tomorrow starts{" "}
            <span className="underline underline-offset-8 decoration-gold">today</span>.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
