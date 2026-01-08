import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Home, Calendar } from 'lucide-react';

interface InvestmentProjectionCardProps {
  priceFrom: number;
  roiEstimate: number | null;
  areaAppreciation: number;
  completionDate: string | null;
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `AED ${(value / 1000000).toFixed(2)}M`;
  }
  return `AED ${(value / 1000).toFixed(0)}K`;
};

const getYearsUntilHandover = (dateString: string | null): number => {
  if (!dateString) return 2;
  const handover = new Date(dateString);
  const now = new Date();
  const years = (handover.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return Math.max(0, Math.ceil(years));
};

export const InvestmentProjectionCard = ({
  priceFrom,
  roiEstimate,
  areaAppreciation,
  completionDate,
}: InvestmentProjectionCardProps) => {
  const yearsToHandover = getYearsUntilHandover(completionDate);
  const annualAppreciation = areaAppreciation > 0 ? areaAppreciation : 5; // Default 5% if no data
  
  // Calculate projections
  const projectedValueAtHandover = priceFrom * Math.pow(1 + annualAppreciation / 100, yearsToHandover);
  const capitalGrowth = projectedValueAtHandover - priceFrom;
  const fiveYearValue = priceFrom * Math.pow(1 + annualAppreciation / 100, 5);
  const fiveYearGrowth = fiveYearValue - priceFrom;
  
  // Rental yield calculation (using ROI estimate or default)
  const rentalYield = roiEstimate || 6;
  const annualRental = priceFrom * (rentalYield / 100);
  const monthlyRental = annualRental / 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border/50 p-6"
    >
      <h3 className="text-sm font-medium text-foreground mb-6 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-accent" />
        Investment Projection
      </h3>

      <div className="space-y-5">
        {/* Property Value at Handover */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-secondary flex items-center justify-center shrink-0">
            <Home className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Value at Handover ({yearsToHandover}yr)
            </p>
            <p className="text-lg font-medium text-foreground">
              {formatCurrency(projectedValueAtHandover)}
            </p>
            <p className="text-xs text-accent">
              +{formatCurrency(capitalGrowth)} ({(annualAppreciation * yearsToHandover).toFixed(0)}%)
            </p>
          </div>
        </div>

        {/* 5 Year Projection */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-secondary flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              5-Year Value
            </p>
            <p className="text-lg font-medium text-foreground">
              {formatCurrency(fiveYearValue)}
            </p>
            <p className="text-xs text-accent">
              +{formatCurrency(fiveYearGrowth)} capital growth
            </p>
          </div>
        </div>

        {/* Rental Income */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-secondary flex items-center justify-center shrink-0">
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Est. Rental Income
            </p>
            <p className="text-lg font-medium text-foreground">
              {formatCurrency(monthlyRental)}/mo
            </p>
            <p className="text-xs text-muted-foreground">
              {rentalYield.toFixed(1)}% gross yield • {formatCurrency(annualRental)}/yr
            </p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground mt-5 pt-4 border-t border-border/30">
        * Projections based on {annualAppreciation}% annual appreciation. Past performance does not guarantee future returns.
      </p>
    </motion.div>
  );
};
