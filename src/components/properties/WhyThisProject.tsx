import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Shield, Clock, Percent } from 'lucide-react';

interface WhyThisProjectProps {
  roiEstimate: number | null;
  goldenVisaEligible: boolean | null;
  completionDate: string | null;
  paymentPlan: string | null;
  area: string;
  areaData?: { trend_percentage: number; avg_price_sqft: number } | null;
}

interface Reason {
  icon: React.ElementType;
  text: string;
}

export const WhyThisProject = ({
  roiEstimate,
  goldenVisaEligible,
  completionDate,
  paymentPlan,
  area,
  areaData,
}: WhyThisProjectProps) => {
  const reasons: Reason[] = [];

  if (roiEstimate && roiEstimate >= 7) {
    reasons.push({
      icon: TrendingUp,
      text: `Above-average projected yield of ${roiEstimate}%`,
    });
  }

  if (goldenVisaEligible) {
    reasons.push({
      icon: Shield,
      text: 'Qualifies for 10-year UAE Golden Visa residency',
    });
  }

  if (completionDate) {
    const months = Math.ceil(
      (new Date(completionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
    );
    if (months > 0 && months <= 12) {
      reasons.push({
        icon: Clock,
        text: `Near handover — estimated ${months} months remaining`,
      });
    }
  }

  if (areaData && areaData.trend_percentage > 10) {
    reasons.push({
      icon: TrendingUp,
      text: `Located in ${area}, up ${areaData.trend_percentage}% in 12 months`,
    });
  }

  if (paymentPlan && paymentPlan !== '100% Ready') {
    const match = paymentPlan.match(/(\d+)\/(\d+)/);
    if (match) {
      const duringConstruction = parseInt(match[1]);
      if (duringConstruction <= 40) {
        reasons.push({
          icon: Percent,
          text: `Low entry — only ${duringConstruction}% during construction`,
        });
      }
    }
  }

  if (reasons.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-accent/5 border border-accent/20 p-6"
    >
      <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" />
        Why This Project
      </h3>
      <ul className="space-y-3">
        {reasons.slice(0, 3).map((reason, i) => {
          const Icon = reason.icon;
          return (
            <li key={i} className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{reason.text}</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};
