import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AffordabilityCTAProps {
  priceFrom: number;
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `AED ${(value / 1000000).toFixed(1)}M`;
  }
  return `AED ${(value / 1000).toFixed(0)}K`;
};

const calculateMonthlyEstimate = (price: number): number => {
  const downPayment = price * 0.2;
  const loanAmount = price - downPayment;
  const monthlyRate = 4.5 / 100 / 12;
  const numPayments = 25 * 12;
  return (
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
};

export const AffordabilityCTA = ({ priceFrom }: AffordabilityCTAProps) => {
  const monthlyEstimate = calculateMonthlyEstimate(priceFrom);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border/50 p-8"
    >
      <h3 className="font-serif text-xl text-foreground mb-2">
        Affordability
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Estimate your monthly payment.
      </p>

      <div className="mb-6 pb-6 border-b border-border/30">
        <span className="text-xs uppercase tracking-luxury text-muted-foreground block mb-1">
          Monthly from
        </span>
        <span className="font-serif text-2xl text-foreground">
          {formatCurrency(monthlyEstimate)}
        </span>
        <span className="text-xs text-muted-foreground block mt-1">
          Based on 20% down, 25 years
        </span>
      </div>

      <Link
        to="/calculator"
        className="block w-full py-3 text-center border border-foreground/30 text-foreground text-xs uppercase tracking-luxury hover:bg-foreground hover:text-background transition-all duration-300"
      >
        Calculate Your Payment
      </Link>
    </motion.div>
  );
};
