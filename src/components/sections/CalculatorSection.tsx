import { useState, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Slider } from "@/components/ui/slider";
import { Check, Home, Sparkles, Building2, Percent, Calendar, TrendingUp } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { supabase } from "@/integrations/supabase/client";

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

// UAE Bank rates (2025)
const UAE_BANKS = [
  { name: 'Emirates NBD', rate: 4.49, logo: '🏦' },
  { name: 'Mashreq Bank', rate: 4.74, logo: '🏛️' },
  { name: 'FAB', rate: 4.69, logo: '🏢' },
  { name: 'ADCB', rate: 4.99, logo: '🏦' },
  { name: 'RAK Bank', rate: 5.25, logo: '🏛️' },
];

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `AED ${(value / 1000000).toFixed(1)}M`;
  }
  return `AED ${(value / 1000).toFixed(0)}K`;
}

function calculateMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  
  if (monthlyRate === 0) return principal / numPayments;
  
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                  (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return Math.round(payment);
}

export function CalculatorSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [investment, setInvestment] = useState([400000]);
  const [monthly, setMonthly] = useState([15000]);
  const [isResident, setIsResident] = useState(true);
  const [termYears, setTermYears] = useState([25]);
  const [downPaymentPercent, setDownPaymentPercent] = useState([20]);
  const [selectedBank, setSelectedBank] = useState(UAE_BANKS[0]);

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

  // Calculate mortgage with real bank rates
  const calculations = useMemo(() => {
    const propertyPrice = matchedProperty.price;
    const maxLTV = isResident ? 80 : 75;
    const actualDownPayment = Math.max(downPaymentPercent[0], 100 - maxLTV);
    const downPayment = propertyPrice * (actualDownPayment / 100);
    const loanAmount = propertyPrice - downPayment;
    
    const monthlyMortgage = calculateMonthlyPayment(loanAmount, selectedBank.rate, termYears[0]);
    const totalPayment = monthlyMortgage * termYears[0] * 12;
    const totalInterest = totalPayment - loanAmount;

    // Calculate for all banks
    const bankComparison = UAE_BANKS.map(bank => ({
      ...bank,
      monthlyPayment: calculateMonthlyPayment(loanAmount, bank.rate, termYears[0]),
    })).sort((a, b) => a.monthlyPayment - b.monthlyPayment);

    return {
      propertyPrice,
      downPayment,
      loanAmount,
      monthlyMortgage,
      totalPayment,
      totalInterest,
      maxLTV,
      fitsbudget: investment[0] >= downPayment && monthly[0] >= monthlyMortgage,
      bankComparison,
      isGoldenVisaEligible: propertyPrice >= 2000000,
    };
  }, [matchedProperty, investment, monthly, isResident, termYears, downPaymentPercent, selectedBank]);

  return (
    <section 
      id="calculator" 
      ref={containerRef}
      className="relative section-padding-lg bg-background overflow-hidden"
    >
      {/* Ambient glow - Electric blue */}
      <motion.div 
        className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full opacity-30"
        style={{ 
          y: backgroundY,
          background: "radial-gradient(circle, hsl(var(--accent) / 0.1) 0%, transparent 70%)"
        }}
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
            className="text-accent text-xs uppercase tracking-[0.3em] mb-6"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Mortgage Calculator
          </motion.p>
          <h2 className="mb-6">
            Real UAE<br />
            <span className="text-muted-foreground">bank rates.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">
            Calculate your mortgage with live rates from Emirates NBD, Mashreq, FAB, and more.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-6xl mx-auto">
          {/* Calculator Inputs */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 1 }}
          >
            {/* Investment Slider */}
            <div className="space-y-6">
              <div className="flex items-baseline justify-between">
                <label className="text-lg font-light tracking-wide">Down Payment Available</label>
                <motion.span 
                  className="text-3xl md:text-4xl font-extralight text-foreground tabular-nums drop-shadow-[0_0_20px_hsl(var(--accent)/0.3)]"
                >
                  {formatCurrency(investment[0])}
                </motion.span>
              </div>
              <Slider
                value={investment}
                onValueChange={setInvestment}
                min={100000}
                max={2000000}
                step={50000}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-metallic uppercase tracking-widest">
                <span>AED 100K</span>
                <span>AED 2M</span>
              </div>
            </div>

            {/* Residency Status */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsResident(true)}
                className={`flex-1 py-3 px-4 border transition-all duration-300 ${
                  isResident 
                    ? 'border-accent bg-accent/10 text-accent' 
                    : 'border-border/30 text-muted-foreground hover:border-border'
                }`}
              >
                <span className="text-sm font-medium">UAE Resident</span>
                <span className="block text-xs opacity-60 mt-1">Max 80% LTV</span>
              </button>
              <button
                onClick={() => setIsResident(false)}
                className={`flex-1 py-3 px-4 border transition-all duration-300 ${
                  !isResident 
                    ? 'border-accent bg-accent/10 text-accent' 
                    : 'border-border/30 text-muted-foreground hover:border-border'
                }`}
              >
                <span className="text-sm font-medium">Non-Resident</span>
                <span className="block text-xs opacity-60 mt-1">Max 75% LTV</span>
              </button>
            </div>

            {/* Loan Term Slider */}
            <div className="space-y-6">
              <div className="flex items-baseline justify-between">
                <label className="text-lg font-light tracking-wide flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  Loan Term
                </label>
                <span className="text-2xl font-extralight text-foreground tabular-nums">
                  {termYears[0]} years
                </span>
              </div>
              <Slider
                value={termYears}
                onValueChange={setTermYears}
                min={10}
                max={25}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-metallic uppercase tracking-widest">
                <span>10 Years</span>
                <span>25 Years</span>
              </div>
            </div>

            {/* Down Payment % Slider */}
            <div className="space-y-6">
              <div className="flex items-baseline justify-between">
                <label className="text-lg font-light tracking-wide flex items-center gap-2">
                  <Percent className="w-4 h-4 text-accent" />
                  Down Payment
                </label>
                <span className="text-2xl font-extralight text-foreground tabular-nums">
                  {downPaymentPercent[0]}%
                </span>
              </div>
              <Slider
                value={downPaymentPercent}
                onValueChange={setDownPaymentPercent}
                min={isResident ? 20 : 25}
                max={50}
                step={5}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-metallic uppercase tracking-widest">
                <span>{isResident ? '20%' : '25%'} Min</span>
                <span>50%</span>
              </div>
            </div>

            {/* Monthly Budget */}
            <div className="space-y-6">
              <div className="flex items-baseline justify-between">
                <label className="text-lg font-light tracking-wide">Monthly Budget</label>
                <motion.span 
                  className="text-3xl md:text-4xl font-extralight text-foreground tabular-nums drop-shadow-[0_0_20px_hsl(var(--accent)/0.3)]"
                >
                  {formatCurrency(monthly[0])}
                </motion.span>
              </div>
              <Slider
                value={monthly}
                onValueChange={setMonthly}
                min={5000}
                max={50000}
                step={1000}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-metallic uppercase tracking-widest">
                <span>AED 5K</span>
                <span>AED 50K</span>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            className="relative bg-card/50 border border-border/30 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
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
                style={{ filter: "brightness(0.8)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              
              {/* Golden Visa Badge */}
              {calculations.isGoldenVisaEligible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4 px-3 py-1.5 bg-accent/90 text-background text-xs font-medium rounded-full flex items-center gap-1.5"
                >
                  <span>✦</span> Golden Visa Eligible
                </motion.div>
              )}
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs text-white/60 uppercase tracking-widest mb-1">You could own a</p>
                <motion.h3 
                  key={matchedProperty.type}
                  className="text-3xl font-extralight tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {matchedProperty.type}
                </motion.h3>
                <p className="text-white/50 text-sm">in {matchedProperty.area}</p>
              </div>
            </div>

            {/* Mortgage Breakdown */}
            <div className="p-6 lg:p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 border border-border/20">
                  <p className="text-xs text-metallic uppercase tracking-widest mb-1">Property Value</p>
                  <p className="text-xl font-light">
                    {formatCurrency(calculations.propertyPrice)}
                  </p>
                </div>
                <div className="p-4 bg-background/50 border border-border/20">
                  <p className="text-xs text-metallic uppercase tracking-widest mb-1">Down Payment</p>
                  <p className="text-xl font-light">
                    {formatCurrency(calculations.downPayment)}
                  </p>
                </div>
                <div className="p-4 bg-background/50 border border-border/20">
                  <p className="text-xs text-metallic uppercase tracking-widest mb-1">Loan Amount</p>
                  <p className="text-xl font-light">
                    {formatCurrency(calculations.loanAmount)}
                  </p>
                </div>
                <div className="p-4 bg-background/50 border border-border/20">
                  <p className="text-xs text-metallic uppercase tracking-widest mb-1">Total Interest</p>
                  <p className="text-xl font-light">
                    {formatCurrency(calculations.totalInterest)}
                  </p>
                </div>
              </div>

              {/* Monthly Payment Highlight */}
              <div className="p-5 bg-accent/10 border border-accent/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-accent uppercase tracking-widest">Monthly Payment</p>
                  <p className="text-xs text-muted-foreground">{selectedBank.name} @ {selectedBank.rate}%</p>
                </div>
                <p className="text-4xl font-extralight text-foreground">
                  {formatCurrency(calculations.monthlyMortgage)}
                  <span className="text-lg text-muted-foreground">/month</span>
                </p>
              </div>

              {/* Bank Comparison */}
              <div className="space-y-3">
                <p className="text-xs text-metallic uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-3 h-3" /> Compare UAE Banks
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {calculations.bankComparison.map((bank) => (
                    <button
                      key={bank.name}
                      onClick={() => setSelectedBank(bank)}
                      className={`w-full flex items-center justify-between p-3 border transition-all duration-300 ${
                        selectedBank.name === bank.name
                          ? 'border-accent bg-accent/5'
                          : 'border-border/20 hover:border-border/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{bank.logo}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium">{bank.name}</p>
                          <p className="text-xs text-muted-foreground">{bank.rate}% APR</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{formatCurrency(bank.monthlyPayment)}/mo</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Fit */}
              <motion.div
                className={`flex items-center gap-3 p-4 transition-colors duration-500 ${
                  calculations.fitsbudget
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                }`}
                layout
              >
                {calculations.fitsbudget ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="font-medium text-sm">This fits your budget perfectly</span>
                  </>
                ) : (
                  <>
                    <Home className="w-5 h-5" />
                    <span className="font-medium text-sm">Increase investment for this property</span>
                  </>
                )}
              </motion.div>

              {/* CTA */}
              <MagneticButton className="w-full btn-metallic text-sm uppercase tracking-wider">
                Get Pre-Approved
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
