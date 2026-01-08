import { motion } from 'framer-motion';
import { Calendar, Percent, CheckCircle2, CreditCard } from 'lucide-react';

interface PaymentPlanBreakdownProps {
  paymentPlan: string | null;
  priceFrom: number;
  completionDate: string | null;
  postHandoverYears?: number | null;
  postHandoverPercent?: number | null;
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(2)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const parsePaymentPlan = (plan: string | null, postHandoverPercent: number | null) => {
  if (!plan || plan === '100% Ready') {
    return { type: 'ready', duringConstruction: 100, onHandover: 0, postHandover: 0 };
  }

  const match = plan.match(/(\d+)\/(\d+)/);
  if (match) {
    const during = parseInt(match[1]);
    const handover = parseInt(match[2]);
    return {
      type: 'offplan',
      duringConstruction: during,
      onHandover: postHandoverPercent ? handover - postHandoverPercent : handover,
      postHandover: postHandoverPercent || 0,
    };
  }

  return { type: 'custom', duringConstruction: 50, onHandover: 50, postHandover: 0 };
};

export const PaymentPlanBreakdown = ({
  paymentPlan,
  priceFrom,
  completionDate,
  postHandoverYears,
  postHandoverPercent,
}: PaymentPlanBreakdownProps) => {
  const plan = parsePaymentPlan(paymentPlan, postHandoverPercent || null);
  const isReady = plan.type === 'ready';
  const hasPostHandover = plan.postHandover > 0;

  const duringConstructionAmount = priceFrom * (plan.duringConstruction / 100);
  const onHandoverAmount = priceFrom * (plan.onHandover / 100);
  const postHandoverAmount = priceFrom * (plan.postHandover / 100);
  const monthlyPostHandover = postHandoverYears ? postHandoverAmount / (postHandoverYears * 12) : 0;

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
      className="bg-card border border-border/50 p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Percent className="w-4 h-4 text-accent" />
          Payment Plan
        </h3>
        {paymentPlan && (
          <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium uppercase tracking-wider">
            {paymentPlan}
          </span>
        )}
      </div>

      {isReady ? (
        <div className="p-5 bg-emerald-500/10 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-emerald-500">Ready to Move In</p>
          <p className="text-xs text-muted-foreground mt-1">
            Full payment required at purchase
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Visual Progress Bar - Multi-segment */}
          <div className="relative h-2 bg-secondary overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${plan.duringConstruction}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-full bg-accent"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${plan.onHandover}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-full bg-accent/60"
            />
            {hasPostHandover && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${plan.postHandover}%` }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="h-full bg-accent/30"
              />
            )}
          </div>

          {/* Payment Breakdown */}
          <div className={`grid gap-3 ${hasPostHandover ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <div className="p-3 bg-accent/10">
              <p className="text-[10px] text-accent uppercase tracking-wider mb-1">
                During Construction
              </p>
              <p className="text-lg font-medium text-foreground">
                {plan.duringConstruction}%
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(duringConstructionAmount)}
              </p>
            </div>
            <div className="p-3 bg-secondary">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                On Handover
              </p>
              <p className="text-lg font-medium text-foreground">
                {plan.onHandover}%
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(onHandoverAmount)}
              </p>
            </div>
            {hasPostHandover && (
              <div className="p-3 bg-secondary/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Post-Handover
                </p>
                <p className="text-lg font-medium text-foreground">
                  {plan.postHandover}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(postHandoverAmount)}
                </p>
              </div>
            )}
          </div>

          {/* Post-Handover Monthly Payment */}
          {hasPostHandover && postHandoverYears && (
            <div className="flex items-center gap-3 p-3 bg-accent/5 border border-accent/20">
              <CreditCard className="w-4 h-4 text-accent flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  {formatPrice(monthlyPostHandover)}/month
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  for {postHandoverYears} years after handover
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="flex items-center gap-3 p-3 bg-secondary/50">
            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs font-medium">Expected Handover</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {formatDate(completionDate)}
              </p>
            </div>
          </div>

          {/* Payment Schedule */}
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Payment Schedule
            </p>
            <div className="space-y-0 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Booking Fee</span>
                <span className="font-medium">10%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">During Construction</span>
                <span className="font-medium">{plan.duringConstruction - 10}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">On Handover</span>
                <span className="font-medium">{plan.onHandover}%</span>
              </div>
              {hasPostHandover && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Post-Handover ({postHandoverYears}yr)</span>
                  <span className="font-medium">{plan.postHandover}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
