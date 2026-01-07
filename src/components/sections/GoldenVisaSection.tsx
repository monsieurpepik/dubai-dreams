import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import { Check, Crown, Users, Building, Briefcase, GraduationCap, Heart } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

const GOLDEN_VISA_THRESHOLD = 2000000; // AED 2M minimum

const benefits = [
  { icon: Crown, title: '10-Year Residency', description: 'Renewable long-term visa' },
  { icon: Users, title: 'Family Sponsorship', description: 'Include spouse and children' },
  { icon: Briefcase, title: 'Work Freedom', description: 'No sponsor required' },
  { icon: GraduationCap, title: 'Education Access', description: 'Study freely in UAE' },
  { icon: Building, title: 'Business Ownership', description: '100% company ownership' },
  { icon: Heart, title: 'Healthcare Access', description: 'Premium healthcare services' },
];

export const GoldenVisaSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [investmentAmount, setInvestmentAmount] = useState(1500000);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  
  const progress = useMemo(() => {
    return Math.min((investmentAmount / GOLDEN_VISA_THRESHOLD) * 100, 100);
  }, [investmentAmount]);
  
  const isEligible = investmentAmount >= GOLDEN_VISA_THRESHOLD;
  const remaining = Math.max(0, GOLDEN_VISA_THRESHOLD - investmentAmount);
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `AED ${(value / 1000000).toFixed(1)}M`;
    }
    return `AED ${(value / 1000).toFixed(0)}K`;
  };

  return (
    <motion.section
      ref={sectionRef}
      id="golden-visa"
      className="relative min-h-screen py-32 overflow-hidden"
      style={{ opacity }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-black/50" />
      
      {/* Accent glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
        }}
      />
      
      <motion.div 
        className="container mx-auto px-6 relative z-10"
        style={{ y }}
      >
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 mb-8"
          >
            <Crown className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium tracking-wide">UAE Golden Visa</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-6xl text-foreground mb-6"
          >
            Your Path to <span className="text-accent">Residency</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-silver max-w-2xl mx-auto text-lg"
          >
            Invest AED 2,000,000+ in Dubai property and qualify for the UAE Golden Visa — 
            a 10-year renewable residency for you and your family.
          </motion.p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Eligibility Checker */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-serif text-foreground mb-8">
                Check Your Eligibility
              </h3>
              
              {/* Investment Amount Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-silver text-sm">Investment Amount</span>
                  <span className="text-foreground font-medium">{formatCurrency(investmentAmount)}</span>
                </div>
                
                <input
                  type="range"
                  min={500000}
                  max={5000000}
                  step={100000}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-accent
                    [&::-webkit-slider-thumb]:shadow-[0_0_20px_hsl(var(--accent)/0.5)]
                    [&::-webkit-slider-thumb]:cursor-grab
                    [&::-webkit-slider-thumb]:active:cursor-grabbing
                    [&::-webkit-slider-thumb]:transition-shadow
                    [&::-webkit-slider-thumb]:hover:shadow-[0_0_30px_hsl(var(--accent)/0.7)]"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>AED 500K</span>
                  <span>AED 5M</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-silver text-sm">Progress to Golden Visa</span>
                  <span className={`text-sm font-medium ${isEligible ? 'text-accent' : 'text-silver'}`}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
                
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: isEligible 
                        ? 'linear-gradient(90deg, hsl(var(--accent)) 0%, hsl(var(--accent-glow)) 100%)'
                        : 'linear-gradient(90deg, hsl(var(--accent)/0.5) 0%, hsl(var(--accent)/0.7) 100%)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  
                  {/* Threshold marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-accent"
                    style={{ left: '100%', transform: 'translateX(-1px)' }}
                  />
                </div>
                
                <div className="text-right text-xs text-muted-foreground mt-2">
                  Threshold: AED 2M
                </div>
              </div>
              
              {/* Status */}
              <motion.div
                className={`p-6 rounded-xl border ${
                  isEligible 
                    ? 'bg-accent/10 border-accent/30' 
                    : 'bg-white/5 border-white/10'
                }`}
                animate={{
                  borderColor: isEligible ? 'hsl(var(--accent)/0.3)' : 'rgba(255,255,255,0.1)',
                }}
              >
                {isEligible ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">You're Eligible!</p>
                      <p className="text-silver text-sm">Qualify for 10-year Golden Visa</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-foreground font-medium mb-1">
                      {formatCurrency(remaining)} more to qualify
                    </p>
                    <p className="text-silver text-sm">
                      Increase your investment to unlock Golden Visa benefits
                    </p>
                  </div>
                )}
              </motion.div>
              
              <div className="mt-8">
                <MagneticButton>
                  <button className="w-full py-4 px-8 bg-accent text-background font-medium rounded-lg transition-all hover:bg-accent-glow">
                    Get Golden Visa Consultation
                  </button>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
          
          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-serif text-foreground mb-8">
              Golden Visa Benefits
            </h3>
            
            <div className="grid gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <benefit.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{benefit.title}</p>
                    <p className="text-silver text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};
