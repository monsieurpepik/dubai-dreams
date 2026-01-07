import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Slider } from "@/components/ui/slider";
import { Check, Home, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [investment, setInvestment] = useState([400000]);
  const [monthly, setMonthly] = useState([15000]);

  const matchedProperty = useMemo(() => {
    return propertyMatches.find(
      (p) => investment[0] >= p.min && investment[0] < p.max
    ) || propertyMatches[propertyMatches.length - 1];
  }, [investment]);

  const calculations = useMemo(() => {
    const propertyPrice = matchedProperty.price;
    const downPayment = propertyPrice * 0.2; // 20% down payment
    const mortgage = propertyPrice * 0.8;
    const monthlyMortgage = Math.round((mortgage * 0.045) / 12 + mortgage / 300); // Rough estimate

    return {
      propertyPrice,
      downPayment,
      mortgage,
      monthlyMortgage,
      fitsbudget: investment[0] >= downPayment && monthly[0] >= monthlyMortgage,
    };
  }, [matchedProperty, investment, monthly]);

  return (
    <section id="calculator" ref={ref} className="section-padding-lg bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4">See what you can afford</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Use our calculator to find properties that match your budget. 
            Real-time matching based on your investment capacity.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Calculator Inputs */}
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Investment Slider */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-lg font-medium">Investment today</label>
                <span className="text-2xl font-light text-gold">
                  {formatCurrency(investment[0])}
                </span>
              </div>
              <Slider
                value={investment}
                onValueChange={setInvestment}
                min={100000}
                max={2000000}
                step={50000}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>AED 100K</span>
                <span>AED 2M</span>
              </div>
            </div>

            {/* Monthly Slider */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-lg font-medium">Monthly comfort</label>
                <span className="text-2xl font-light text-gold">
                  {formatCurrency(monthly[0])}
                </span>
              </div>
              <Slider
                value={monthly}
                onValueChange={setMonthly}
                min={5000}
                max={50000}
                step={1000}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>AED 5K</span>
                <span>AED 50K</span>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-4 p-6 bg-secondary rounded-2xl">
              <Calculator className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium mb-1">How it works</p>
                <p className="text-sm text-muted-foreground">
                  Your investment today covers the down payment and construction installments. 
                  The monthly amount helps us match properties to your post-handover mortgage comfort.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            className="bg-card rounded-3xl border border-border overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Property Preview */}
            <div className="relative aspect-video">
              <img
                src={matchedProperty.image}
                alt={matchedProperty.type}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm text-white/70 mb-1">You could own a</p>
                <h3 className="text-2xl font-medium">
                  {matchedProperty.type} in {matchedProperty.area}
                </h3>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-6 lg:p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Property</p>
                  <p className="text-xl font-medium">
                    {formatCurrency(calculations.propertyPrice)}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Down payment</p>
                  <p className="text-xl font-medium">
                    {formatCurrency(calculations.downPayment)}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Mortgage</p>
                  <p className="text-xl font-medium">
                    {formatCurrency(calculations.mortgage)}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Monthly</p>
                  <p className="text-xl font-medium">
                    {formatCurrency(calculations.monthlyMortgage)}
                  </p>
                </div>
              </div>

              {/* Budget Fit Indicator */}
              <div
                className={`flex items-center gap-3 p-4 rounded-xl ${
                  calculations.fitsbudget
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                {calculations.fitsbudget ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="font-medium">This fits your budget</span>
                  </>
                ) : (
                  <>
                    <Home className="w-5 h-5" />
                    <span className="font-medium">Increase investment for this property</span>
                  </>
                )}
              </div>

              {/* CTA */}
              <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 rounded-full py-6 text-lg">
                See properties I can afford
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
