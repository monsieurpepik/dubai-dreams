import { motion } from 'framer-motion';
import { Calendar, Percent, CheckCircle2 } from 'lucide-react';

interface PaymentPlanBreakdownProps {
  paymentPlan: string | null;
  priceFrom: number;
  completionDate: string | null;
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(2)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const parsePaymentPlan = (plan: string | null) => {
  if (!plan || plan === '100% Ready') {
    return { type: 'ready', duringConstruction: 100, onHandover: 0 };
  }

  const match = plan.match(/(\d+)\/(\d+)/);
  if (match) {
    return {
      type: 'offplan',
      duringConstruction: parseInt(match[1]),
      onHandover: parseInt(match[2]),
    };
  }

  return { type: 'custom', duringConstruction: 50, onHandover: 50 };
};

export const PaymentPlanBreakdown = ({
  paymentPlan,
  priceFrom,
  completionDate,
}: PaymentPlanBreakdownProps) => {
  const plan = parsePaymentPlan(paymentPlan);
  const isReady = plan.type === 'ready';

  const duringConstructionAmount = priceFrom * (plan.duringConstruction / 100);
  const onHandoverAmount = priceFrom * (plan.onHandover / 100);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border/50 rounded-xl p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Percent className="w-5 h-5 text-accent" />
          Payment Plan
        </h3>
        {paymentPlan && (
          <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
            {paymentPlan}
          </span>
        )}
      </div>

      {isReady ? (
        <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-emerald-500">Ready to Move In</p>
          <p className="text-sm text-muted-foreground mt-1">
            Full payment required at purchase
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Visual Progress Bar */}
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${plan.duringConstruction}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute left-0 top-0 h-full bg-accent rounded-l-full"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${plan.onHandover}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute right-0 top-0 h-full bg-accent/40 rounded-r-full"
            />
          </div>

          {/* Payment Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-xs text-accent uppercase tracking-wider mb-1">
                During Construction
              </p>
              <p className="text-2xl font-bold text-foreground">
                {plan.duringConstruction}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatPrice(duringConstructionAmount)}
              </p>
            </div>
            <div className="p-4 bg-muted border border-border/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                On Handover
              </p>
              <p className="text-2xl font-bold text-foreground">
                {plan.onHandover}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatPrice(onHandoverAmount)}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Expected Handover</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(completionDate)}
              </p>
            </div>
          </div>

          {/* Payment Schedule Example */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Typical Payment Schedule
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Booking Fee</span>
                <span className="font-medium">10%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">During Construction</span>
                <span className="font-medium">{plan.duringConstruction - 10}%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">On Handover</span>
                <span className="font-medium">{plan.onHandover}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
