import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Slider } from '@/components/ui/slider';

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `AED ${(value / 1000000).toFixed(1)}M`;
  }
  return `AED ${(value / 1000).toFixed(0)}K`;
};

const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  termYears: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
};

type AffordabilityVerdict = 'comfortable' | 'stretch' | 'risky';

const getVerdict = (monthlyPayment: number, downPayment: number): AffordabilityVerdict => {
  // Estimate income from down payment (assume down payment is ~6 months salary)
  const estimatedMonthlyIncome = downPayment / 6;
  const ratio = monthlyPayment / estimatedMonthlyIncome;
  
  if (ratio < 0.30) return 'comfortable';
  if (ratio < 0.45) return 'stretch';
  return 'risky';
};

const verdictConfig = {
  comfortable: {
    label: 'Comfortable',
    description: 'This payment fits well within typical budget guidelines.',
    color: 'text-[hsl(142_35%_55%)]',
    bgColor: 'bg-[hsl(142_35%_55%/0.08)]',
  },
  stretch: {
    label: 'Stretch',
    description: 'This payment is manageable but may limit other spending.',
    color: 'text-[hsl(38_45%_60%)]',
    bgColor: 'bg-[hsl(38_45%_60%/0.08)]',
  },
  risky: {
    label: 'Risky',
    description: 'This payment may be challenging. Consider a larger down payment.',
    color: 'text-[hsl(0_40%_55%)]',
    bgColor: 'bg-[hsl(0_40%_55%/0.08)]',
  },
};

const Calculator = () => {
  const [propertyPrice, setPropertyPrice] = useState(2000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [isResident, setIsResident] = useState(true);

  const calculations = useMemo(() => {
    const minDownPayment = isResident ? 20 : 25;
    const effectiveDownPayment = Math.max(downPaymentPercent, minDownPayment);
    const downPaymentAmount = propertyPrice * (effectiveDownPayment / 100);
    const loanAmount = propertyPrice - downPaymentAmount;
    const interestRate = 4.5; // Average UAE rate
    const termYears = 25;
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, termYears);
    const verdict = getVerdict(monthlyPayment, downPaymentAmount);

    return {
      downPaymentAmount,
      loanAmount,
      monthlyPayment,
      verdict,
      effectiveDownPayment,
    };
  }, [propertyPrice, downPaymentPercent, isResident]);

  const verdictInfo = verdictConfig[calculations.verdict];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container-wide max-w-2xl">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              Affordability
            </h1>
            <p className="text-muted-foreground">
              Estimate your monthly payment based on typical UAE mortgage terms.
            </p>
          </motion.div>

          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-10"
          >
            {/* Property Price */}
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <label className="text-xs uppercase tracking-luxury text-muted-foreground">
                  Property Price
                </label>
                <span className="font-serif text-2xl text-foreground">
                  {formatCurrency(propertyPrice)}
                </span>
              </div>
              <Slider
                value={[propertyPrice]}
                onValueChange={(value) => setPropertyPrice(value[0])}
                min={500000}
                max={20000000}
                step={100000}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>AED 500K</span>
                <span>AED 20M</span>
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <label className="text-xs uppercase tracking-luxury text-muted-foreground">
                  Down Payment
                </label>
                <span className="font-serif text-2xl text-foreground">
                  {calculations.effectiveDownPayment}%
                  <span className="text-base text-muted-foreground ml-2">
                    ({formatCurrency(calculations.downPaymentAmount)})
                  </span>
                </span>
              </div>
              <Slider
                value={[downPaymentPercent]}
                onValueChange={(value) => setDownPaymentPercent(value[0])}
                min={isResident ? 20 : 25}
                max={50}
                step={5}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{isResident ? '20%' : '25%'} min</span>
                <span>50%</span>
              </div>
            </div>

            {/* Residency Toggle */}
            <div>
              <label className="text-xs uppercase tracking-luxury text-muted-foreground block mb-4">
                Residency Status
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsResident(true)}
                  className={`flex-1 py-3 text-sm transition-all ${
                    isResident
                      ? 'bg-foreground text-background'
                      : 'border border-border/50 text-muted-foreground hover:border-foreground/50'
                  }`}
                >
                  UAE Resident
                </button>
                <button
                  onClick={() => setIsResident(false)}
                  className={`flex-1 py-3 text-sm transition-all ${
                    !isResident
                      ? 'bg-foreground text-background'
                      : 'border border-border/50 text-muted-foreground hover:border-foreground/50'
                  }`}
                >
                  Non-Resident
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/50" />

            {/* Result */}
            <div className="text-center py-8">
              <span className="text-xs uppercase tracking-luxury text-muted-foreground block mb-2">
                Estimated Monthly Payment
              </span>
              <span className="font-serif text-5xl md:text-6xl text-foreground">
                {formatCurrency(calculations.monthlyPayment)}
              </span>
              <span className="text-muted-foreground block mt-2">
                based on 25-year term at 4.5% avg rate
              </span>
            </div>

            {/* Verdict */}
            <div className={`p-6 ${verdictInfo.bgColor} border border-border/30`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-sm font-medium ${verdictInfo.color}`}>
                  {verdictInfo.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {verdictInfo.description}
              </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Loan Amount</span>
                <p className="text-foreground font-medium">{formatCurrency(calculations.loanAmount)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Down Payment</span>
                <p className="text-foreground font-medium">{formatCurrency(calculations.downPaymentAmount)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;
