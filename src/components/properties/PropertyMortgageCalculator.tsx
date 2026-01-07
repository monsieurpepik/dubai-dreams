import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, Percent, Calendar, TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface PropertyMortgageCalculatorProps {
  propertyPrice: number;
  goldenVisaEligible: boolean;
}

const UAE_BANKS = [
  { name: 'Emirates NBD', rate: 4.49, logo: '🏦' },
  { name: 'Mashreq Bank', rate: 4.74, logo: '🏛️' },
  { name: 'FAB', rate: 4.69, logo: '🏢' },
  { name: 'ADCB', rate: 4.99, logo: '🏦' },
  { name: 'RAK Bank', rate: 5.25, logo: '🏛️' },
];

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(2)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  termYears: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) return principal / numPayments;

  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return Math.round(payment);
};

export const PropertyMortgageCalculator = ({
  propertyPrice,
  goldenVisaEligible,
}: PropertyMortgageCalculatorProps) => {
  const [isResident, setIsResident] = useState(true);
  const [termYears, setTermYears] = useState([25]);
  const [downPaymentPercent, setDownPaymentPercent] = useState([20]);
  const [selectedBank, setSelectedBank] = useState(UAE_BANKS[0]);

  const calculations = useMemo(() => {
    const maxLTV = isResident ? 80 : 75;
    const actualDownPayment = Math.max(downPaymentPercent[0], 100 - maxLTV);
    const downPayment = propertyPrice * (actualDownPayment / 100);
    const loanAmount = propertyPrice - downPayment;

    const monthlyMortgage = calculateMonthlyPayment(
      loanAmount,
      selectedBank.rate,
      termYears[0]
    );
    const totalPayment = monthlyMortgage * termYears[0] * 12;
    const totalInterest = totalPayment - loanAmount;

    const bankComparison = UAE_BANKS.map((bank) => ({
      ...bank,
      monthlyPayment: calculateMonthlyPayment(loanAmount, bank.rate, termYears[0]),
    })).sort((a, b) => a.monthlyPayment - b.monthlyPayment);

    return {
      downPayment,
      loanAmount,
      monthlyMortgage,
      totalPayment,
      totalInterest,
      maxLTV,
      bankComparison,
    };
  }, [propertyPrice, isResident, termYears, downPaymentPercent, selectedBank]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card border border-border/50 rounded-xl p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-accent" />
          Mortgage Calculator
        </h3>
        {goldenVisaEligible && (
          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-medium rounded-full">
            ✦ Golden Visa Eligible
          </span>
        )}
      </div>

      {/* Property Price Display */}
      <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
        <p className="text-xs text-accent uppercase tracking-wider mb-1">
          Property Price
        </p>
        <p className="text-3xl font-bold text-foreground">
          {formatPrice(propertyPrice)}
        </p>
      </div>

      {/* Residency Status */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsResident(true)}
          className={`flex-1 py-3 px-4 border rounded-lg transition-all duration-300 ${
            isResident
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border/50 text-muted-foreground hover:border-border'
          }`}
        >
          <span className="text-sm font-medium">UAE Resident</span>
          <span className="block text-xs opacity-60 mt-0.5">Max 80% LTV</span>
        </button>
        <button
          onClick={() => setIsResident(false)}
          className={`flex-1 py-3 px-4 border rounded-lg transition-all duration-300 ${
            !isResident
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border/50 text-muted-foreground hover:border-border'
          }`}
        >
          <span className="text-sm font-medium">Non-Resident</span>
          <span className="block text-xs opacity-60 mt-0.5">Max 75% LTV</span>
        </button>
      </div>

      {/* Down Payment Slider */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <Percent className="w-4 h-4 text-accent" />
            Down Payment
          </label>
          <span className="text-lg font-semibold tabular-nums">
            {downPaymentPercent[0]}%
          </span>
        </div>
        <Slider
          value={downPaymentPercent}
          onValueChange={setDownPaymentPercent}
          min={isResident ? 20 : 25}
          max={50}
          step={5}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{isResident ? '20%' : '25%'} Min</span>
          <span>50%</span>
        </div>
      </div>

      {/* Loan Term Slider */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            Loan Term
          </label>
          <span className="text-lg font-semibold tabular-nums">
            {termYears[0]} years
          </span>
        </div>
        <Slider
          value={termYears}
          onValueChange={setTermYears}
          min={10}
          max={25}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>10 Years</span>
          <span>25 Years</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Down Payment</p>
          <p className="text-lg font-semibold">{formatPrice(calculations.downPayment)}</p>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
          <p className="text-lg font-semibold">{formatPrice(calculations.loanAmount)}</p>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
          <p className="text-lg font-semibold">{formatPrice(calculations.totalInterest)}</p>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Total Payment</p>
          <p className="text-lg font-semibold">{formatPrice(calculations.totalPayment)}</p>
        </div>
      </div>

      {/* Monthly Payment */}
      <div className="p-5 bg-accent/10 border border-accent/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-accent uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Monthly Payment
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedBank.name} @ {selectedBank.rate}%
          </p>
        </div>
        <p className="text-4xl font-bold text-foreground">
          {formatPrice(calculations.monthlyMortgage)}
          <span className="text-lg font-normal text-muted-foreground">/month</span>
        </p>
      </div>

      {/* Bank Comparison */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Compare UAE Banks
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
          {calculations.bankComparison.map((bank) => (
            <button
              key={bank.name}
              onClick={() => setSelectedBank(bank)}
              className={`w-full flex items-center justify-between p-3 border rounded-lg transition-all duration-300 ${
                selectedBank.name === bank.name
                  ? 'border-accent bg-accent/5'
                  : 'border-border/30 hover:border-border/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{bank.logo}</span>
                <div className="text-left">
                  <p className="text-sm font-medium">{bank.name}</p>
                  <p className="text-xs text-muted-foreground">{bank.rate}% APR</p>
                </div>
              </div>
              <p className="text-sm font-semibold">
                {formatPrice(bank.monthlyPayment)}/mo
              </p>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
