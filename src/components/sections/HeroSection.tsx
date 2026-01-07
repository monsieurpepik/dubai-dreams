import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Badge */}
      <motion.div
        className="absolute top-24 right-6 md:top-28 md:right-12"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span className="text-white/60 text-xs md:text-sm">
          OwningDubai | Part of OwningX
        </span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <motion.p
          className="text-lg md:text-xl lg:text-2xl font-light mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Not just a home.
        </motion.p>
        
        <motion.p
          className="text-lg md:text-xl lg:text-2xl font-light mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          A new horizon.
        </motion.p>
        
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-gold mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Dubai.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Discover off-plan properties from AED 480,000
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black rounded-full px-10 py-6 text-lg transition-all duration-300"
            onClick={() => {
              document.getElementById('opportunity')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.div
          className="text-white/60 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
