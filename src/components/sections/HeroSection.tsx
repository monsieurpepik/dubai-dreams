import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 15;
      const y = (clientY / innerHeight - 0.5) * 15;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[100svh] flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Single dramatic light source - top right (Electric blue chiaroscuro) */}
      <div 
        className="absolute -top-40 -right-40 w-[800px] h-[800px] pointer-events-none"
        style={{ 
          background: "radial-gradient(ellipse at center, hsl(216 100% 50% / 0.08) 0%, transparent 60%)" 
        }}
      />

      {/* Background Image with Parallax - Heavily darkened */}
      <motion.div 
        className="absolute inset-0"
        style={{ scale }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop')`,
            x: mouseX,
            y: mouseY,
          }}
        />
        {/* Heavy dark overlay - image barely visible */}
        <div className="absolute inset-0 bg-black/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      </motion.div>

      {/* Vignette - stronger */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 30%, hsl(0 0% 0% / 0.7) 100%)" 
        }} 
      />

      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Badge - minimal */}
      <motion.div
        className="absolute top-24 right-6 md:top-28 md:right-12 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span className="text-silver-muted text-[10px] tracking-[0.3em] uppercase">
          OwningDubai
        </span>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center text-foreground px-6"
        style={{ opacity, y }}
      >
        {/* Serif Taglines - Playfair Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          <motion.p
            className="font-serif text-xl md:text-2xl lg:text-3xl italic text-silver mb-2 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Not just a home.
          </motion.p>
          
          <motion.p
            className="font-serif text-xl md:text-2xl lg:text-3xl italic text-silver mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            A new horizon.
          </motion.p>
        </motion.div>
        
        {/* Main Title - Chrome/Metallic treatment */}
        <div className="overflow-hidden mb-8">
          <motion.h1
            className="text-chrome"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Dubai<span className="text-accent">.</span>
          </motion.h1>
        </div>

        <motion.p
          className="text-lg md:text-xl text-silver mb-14 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          Off-plan properties from <span className="text-foreground font-medium">AED 480,000</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
        >
          <MagneticButton
            className="btn-metallic"
            onClick={() => {
              document.getElementById('opportunity')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Discover
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Minimal */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-silver/50 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}