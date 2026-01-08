import { motion } from 'framer-motion';
import { Info, Wallet, Building2, Key, CreditCard } from 'lucide-react';

interface MortgageTimelineExplainerProps {
  priceFrom: number;
  paymentPlan: string | null;
  completionDate: string | null;
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `AED ${(value / 1000000).toFixed(2)}M`;
  }
  return `AED ${(value / 1000).toFixed(0)}K`;
};

const parsePaymentPlan = (plan: string | null) => {
  if (!plan) return { during: 50, handover: 50 };
  const match = plan.match(/(\d+)\/(\d+)/);
  if (match) {
    return { during: parseInt(match[1]), handover: parseInt(match[2]) };
  }
  return { during: 50, handover: 50 };
};

export const MortgageTimelineExplainer = ({
  priceFrom,
  paymentPlan,
  completionDate,
}: MortgageTimelineExplainerProps) => {
  const plan = parsePaymentPlan(paymentPlan);
  const cashRequired = priceFrom * (plan.during / 100);
  const mortgageAmount = priceFrom * (plan.handover / 100);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    return `Q${quarter} ${date.getFullYear()}`;
  };

  const timelineSteps = [
    {
      icon: Wallet,
      title: 'Booking',
      description: '10% deposit',
      amount: formatCurrency(priceFrom * 0.1),
      phase: 'cash',
    },
    {
      icon: Building2,
      title: 'Construction',
      description: `Pay ${plan.during - 10}% in installments`,
      amount: formatCurrency(priceFrom * ((plan.during - 10) / 100)),
      phase: 'cash',
    },
    {
      icon: Key,
      title: '50% Completion',
      description: 'Mortgage eligible',
      amount: 'Bank financing available',
      phase: 'milestone',
    },
    {
      icon: CreditCard,
      title: 'Handover',
      description: `${plan.handover}% via mortgage`,
      amount: formatCurrency(mortgageAmount),
      phase: 'mortgage',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border/50 p-6"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">Off-Plan Mortgage Timeline</h3>
          <p className="text-xs text-muted-foreground mt-1">
            UAE banks offer mortgages once construction reaches 50%
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 space-y-6">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

        {timelineSteps.map((step, index) => (
          <div key={index} className="relative flex gap-4">
            {/* Dot */}
            <div className={`absolute left-[-17px] w-3 h-3 rounded-full border-2 ${
              step.phase === 'cash' 
                ? 'bg-accent border-accent' 
                : step.phase === 'milestone'
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'bg-secondary border-muted-foreground'
            }`} />
            
            {/* Content */}
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <step.icon className={`w-4 h-4 ${
                  step.phase === 'cash' 
                    ? 'text-accent' 
                    : step.phase === 'milestone'
                      ? 'text-emerald-500'
                      : 'text-muted-foreground'
                }`} />
                <span className="text-sm font-medium text-foreground">{step.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">{step.description}</p>
              <p className={`text-xs mt-1 ${
                step.phase === 'milestone' ? 'text-emerald-500 font-medium' : 'text-muted-foreground'
              }`}>
                {step.amount}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-5 border-t border-border/30 grid grid-cols-2 gap-4">
        <div className="p-3 bg-accent/10">
          <p className="text-[10px] text-accent uppercase tracking-wider mb-1">Cash Required</p>
          <p className="text-lg font-medium text-foreground">{formatCurrency(cashRequired)}</p>
          <p className="text-[10px] text-muted-foreground">During construction</p>
        </div>
        <div className="p-3 bg-secondary">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Mortgage Amount</p>
          <p className="text-lg font-medium text-foreground">{formatCurrency(mortgageAmount)}</p>
          <p className="text-[10px] text-muted-foreground">At {formatDate(completionDate)}</p>
        </div>
      </div>
    </motion.div>
  );
};
