import { motion } from 'framer-motion';
import { User, TrendingUp, Landmark } from 'lucide-react';

interface InvestorProfileProps {
  priceFrom: number;
  roiEstimate: number | null;
  goldenVisaEligible: boolean | null;
  completionDate: string | null;
}

interface Profile {
  icon: React.ElementType;
  label: string;
  description: string;
}

export const InvestorProfile = ({
  priceFrom,
  roiEstimate,
  goldenVisaEligible,
  completionDate,
}: InvestorProfileProps) => {
  const profiles: Profile[] = [];

  // End-user: lower price, near completion
  const monthsToCompletion = completionDate
    ? Math.ceil((new Date(completionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))
    : null;

  if (monthsToCompletion && monthsToCompletion <= 18) {
    profiles.push({
      icon: User,
      label: 'End-User Buyer',
      description: 'Near handover — suitable for buyers planning to move in or furnish for short-term rental.',
    });
  }

  if (roiEstimate && roiEstimate >= 6) {
    profiles.push({
      icon: TrendingUp,
      label: 'Yield Investor',
      description: `Projected ${roiEstimate}% rental yield makes this attractive for income-focused investors.`,
    });
  }

  if (goldenVisaEligible || priceFrom >= 2000000) {
    profiles.push({
      icon: Landmark,
      label: 'Residency & Legacy Buyer',
      description: 'Qualifies for UAE Golden Visa — a strategic asset for families seeking long-term residency.',
    });
  }

  // Fallback if no profiles match
  if (profiles.length === 0) {
    profiles.push({
      icon: TrendingUp,
      label: 'Capital Growth Investor',
      description: 'Off-plan pricing with payment flexibility — positioned for appreciation through construction.',
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-t border-border/30 pt-10"
    >
      <h3 className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-6">
        Who This Is For
      </h3>
      <div className="space-y-5">
        {profiles.map((profile) => {
          const Icon = profile.icon;
          return (
            <div key={profile.label} className="flex items-start gap-4">
              <div className="w-9 h-9 bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground block mb-1">
                  {profile.label}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
