import { motion } from 'framer-motion';
import { Shield, Award, Users, Globe } from 'lucide-react';

interface TrustSignalsProps {
  className?: string;
  variant?: 'compact' | 'full';
}

const stats = [
  { icon: Users, value: '2,500+', label: 'Happy Investors' },
  { icon: Globe, value: '45+', label: 'Countries' },
  { icon: Award, value: '8+', label: 'Years Experience' },
  { icon: Shield, value: '100%', label: 'Verified Properties' },
];

export const TrustSignals = ({ className = '', variant = 'full' }: TrustSignalsProps) => {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-4 text-sm ${className}`}
      >
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Verified Property</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="w-4 h-4 text-accent" />
          <span>2,500+ investors trust us</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border/50"
        >
          <stat.icon className="w-5 h-5 text-accent" />
          <span className="text-2xl font-bold text-foreground">{stat.value}</span>
          <span className="text-xs text-muted-foreground text-center">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Inline verified badge
export const VerifiedBadge = ({ className = '' }: { className?: string }) => (
  <div className={`inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 ${className}`}>
    <Shield className="w-3.5 h-3.5" />
    <span className="text-xs font-medium">Verified</span>
  </div>
);

// Developer trust badge
export const DeveloperBadge = ({ 
  developerName, 
  yearsActive 
}: { 
  developerName: string; 
  yearsActive?: number;
}) => (
  <div className="flex items-center gap-2 text-sm">
    <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-full">
      <Award className="w-3.5 h-3.5 text-accent" />
      <span className="text-muted-foreground">by</span>
      <span className="font-medium text-foreground">{developerName}</span>
      {yearsActive && (
        <span className="text-muted-foreground">• {yearsActive}+ years</span>
      )}
    </div>
  </div>
);
