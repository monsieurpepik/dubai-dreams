import { useState, useMemo, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Slider } from "@/components/ui/slider";
import { Check, Home, Sparkles, Building } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const propertyMatches = [
  { 
    min: 100000, 
    max: 300000, 
    type: "Studio",
    area: "Jumeirah Village Circle",
    price: 450000,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop"
  },
  { 
    min: 300000, 
    max: 500000, 
    type: "1BR Apartment",
    area: "Dubai Marina",
    price: 950000,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop"
  },
  { 
    min: 500000, 
    max: 800000, 
    type: "2BR Apartment",
    area: "Dubai Marina",
    price: 1450000,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop"
  },
  { 
    min: 800000, 
    max: 1200000, 
    type: "3BR Apartment",
    area: "Downtown Dubai",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
  },
  { 
    min: 1200000, 
    max: 2000000, 
    type: "Penthouse",
    area: "Palm Jumeirah",
    price: 4500000,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop"
  },
];

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `AED ${(value / 1000000).toFixed(1)}M`;
  }
  return `AED ${(value / 1000).toFixed(0)}K`;
}

export function CalculatorSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [investment, setInvestment] = useState([400000]);
  const [monthly, setMonthly] = useState([15000]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const matchedProperty = useMemo(() => {
    return propertyMatches.find(
      (p) => investment[0] >= p.min && investment[0] < p.max
    ) || propertyMatches[propertyMatches.length - 1];
  }, [investment]);

  const calculations = useMemo(() => {
    const propertyPrice = matchedProperty.price;
    const downPayment = propertyPrice * 0.2;
    const mortgage = propertyPrice * 0.8;
    const monthlyMortgage = Math.round((mortgage * 0.045) / 12 + mortgage / 300);

    return {
      propertyPrice,
      downPayment,
      mortgage,
      monthlyMortgage,
      fitsbudget: investment[0] >= downPayment && monthly[0] >= monthlyMortgage,
    };
  }, [matchedProperty, investment, monthly]);

  // Animated spring values
  const springInvestment = useSpring(investment[0], { stiffness: 100, damping: 30 });
  const springMonthly = useSpring(monthly[0], { stiffness: 100, damping: 30 });

  return (
    <section 
      id="calculator" 
      ref={containerRef}
      className="relative section-padding-lg bg-background overflow-hidden"
    >
      {/* Ambient Background */}
      <motion.div 
        className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full bg-gold/5 blur-[200px] pointer-events-none"
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
            Investment Calculator
          </motion.p>
          <h2 className="mb-6">
            See what you<br />
            <span className="text-muted-foreground">can afford.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real-time matching based on your investment capacity. Find properties that fit your budget.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-6xl mx-auto">
          {/* Calculator Inputs */}
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 1 }}
          >
            {/* Investment Slider */}
            <div className="space-y-8">
              <div className="flex items-baseline justify-between">
                <label className="text-xl font-light">Investment today</label>
                <motion.span 
                  className="text-4xl md:text-5xl font-extralight text-gold tabular-nums"
                >
                  {formatCurrency(investment[0])}
                </motion.span>
              </div>
              <div className="relative py-4">
                <Slider
                  value={investment}
                  onValueChange={setInvestment}
                  min={100000}
                  max={2000000}
                  step={50000}
                  className="py-4"
                />
                {/* Gradient track overlay */}
                <div 
                  className="absolute top-1/2 left-0 h-2 rounded-full bg-gradient-to-r from-gold/50 to-gold pointer-events-none -translate-y-1/2"
                  style={{ width: `${((investment[0] - 100000) / (2000000 - 100000)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>AED 100K</span>
                <span>AED 2M</span>
              </div>
            </div>

            {/* Monthly Slider */}
            <div className="space-y-8">
              <div className="flex items-baseline justify-between">
                <label className="text-xl font-light">Monthly comfort</label>
                <motion.span 
                  className="text-4xl md:text-5xl font-extralight text-gold tabular-nums"
                >
                  {formatCurrency(monthly[0])}
                </motion.span>
              </div>
              <div className="relative py-4">
                <Slider
                  value={monthly}
                  onValueChange={setMonthly}
                  min={5000}
                  max={50000}
                  step={1000}
                  className="py-4"
                />
                <div 
                  className="absolute top-1/2 left-0 h-2 rounded-full bg-gradient-to-r from-gold/50 to-gold pointer-events-none -translate-y-1/2"
                  style={{ width: `${((monthly[0] - 5000) / (50000 - 5000)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>AED 5K</span>
                <span>AED 50K</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-4 p-6 bg-secondary/50 rounded-2xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium mb-1">Smart Matching</p>
                <p className="text-sm text-muted-foreground">
                  We analyze payment plans to match your down payment and post-handover mortgage capacity.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            className="relative bg-card rounded-[2rem] border border-border overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {/* Property Preview */}
            <div className="relative aspect-[16/10]">
              <motion.img
                key={matchedProperty.type}
                src={matchedProperty.image}
                alt={matchedProperty.type}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-sm text-white/70 mb-1">You could own a</p>
                <motion.h3 
                  key={matchedProperty.type}
                  className="text-3xl font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {matchedProperty.type}
                </motion.h3>
                <p className="text-white/60">in {matchedProperty.area}</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-6 lg:p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Property Value</p>
                  <p className="text-2xl font-light">
                    {formatCurrency(calculations.propertyPrice)}
                  </p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Down Payment</p>
                  <p className="text-2xl font-light">
                    {formatCurrency(calculations.downPayment)}
                  </p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Mortgage</p>
                  <p className="text-2xl font-light">
                    {formatCurrency(calculations.mortgage)}
                  </p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Monthly Est.</p>
                  <p className="text-2xl font-light">
                    {formatCurrency(calculations.monthlyMortgage)}
                  </p>
                </div>
              </div>

              {/* Budget Fit */}
              <motion.div
                className={`flex items-center gap-3 p-4 rounded-xl transition-colors duration-500 ${
                  calculations.fitsbudget
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
                layout
              >
                {calculations.fitsbudget ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="font-medium">This fits your budget perfectly</span>
                  </>
                ) : (
                  <>
                    <Home className="w-5 h-5" />
                    <span className="font-medium">Increase investment for this property</span>
                  </>
                )}
              </motion.div>

              {/* CTA */}
              <MagneticButton className="w-full btn-magnetic text-lg">
                View Matching Properties
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}