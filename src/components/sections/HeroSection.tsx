import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CharacterReveal } from "@/components/ui/SplitText";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 10]);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[100svh] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Ambient Glow Orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/20 blur-[120px] pointer-events-none"
        style={{ x: mouseX, y: mouseY }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/10 blur-[100px] pointer-events-none"
        style={{ x: useTransform(mouseX, v => -v * 0.5), y: useTransform(mouseY, v => -v * 0.5) }}
      />

      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ scale, filter: useTransform(blur, v => `blur(${v}px)`) }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop')`,
            x: mouseX,
            y: mouseY,
          }}
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" 
        style={{ background: "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.6) 100%)" }} 
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Badge */}
      <motion.div
        className="absolute top-24 right-6 md:top-28 md:right-12 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="text-white/40 text-xs md:text-sm tracking-widest uppercase">
          OwningDubai | Part of OwningX
        </span>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center text-white px-6"
        style={{ opacity, y }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl font-extralight mb-3 tracking-wide text-white/80"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Not just a home.
          </motion.p>
          
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl font-extralight mb-6 tracking-wide text-white/80"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            A new horizon.
          </motion.p>
        </motion.div>
        
        {/* Main Title - Huge */}
        <div className="overflow-hidden mb-8">
          <motion.h1
            className="text-[15vw] md:text-[12vw] lg:text-[10vw] font-extralight tracking-tighter leading-none"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-gradient-gold">Dubai</span>
            <span className="text-white/20">.</span>
          </motion.h1>
        </div>

        <motion.p
          className="text-lg md:text-xl lg:text-2xl text-white/60 mb-12 max-w-xl mx-auto font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          Off-plan properties from <span className="text-gold">AED 480,000</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
        >
          <MagneticButton
            className="btn-magnetic text-lg"
            onClick={() => {
              document.getElementById('opportunity')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Properties
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-3"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}