import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface RiskSignalsProps {
  completionDate: string | null;
  constructionPercent: number | null;
  constructionStage: string | null;
  developerName: string | null;
  developerYearsActive: number | null;
  developerTotalProjects: number | null;
}

interface Risk {
  text: string;
  level: 'note' | 'caution';
}

export const RiskSignals = ({
  completionDate,
  constructionPercent,
  constructionStage,
  developerName,
  developerYearsActive,
  developerTotalProjects,
}: RiskSignalsProps) => {
  const risks: Risk[] = [];

  // Long completion timeline
  if (completionDate) {
    const months = Math.ceil(
      (new Date(completionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
    );
    if (months > 36) {
      risks.push({
        text: `Estimated ${Math.round(months / 12)}+ years to completion — longer horizon carries market cycle exposure.`,
        level: 'note',
      });
    }
  }

  // Early construction stage
  if (constructionStage === 'pre-launch' || (constructionPercent !== null && constructionPercent < 10)) {
    risks.push({
      text: 'Early-stage project — construction has not materially begun. Timeline may shift.',
      level: 'caution',
    });
  }

  // Newer developer
  if (developerYearsActive !== null && developerYearsActive < 5) {
    risks.push({
      text: `${developerName || 'Developer'} has ${developerYearsActive} years in market — a newer entrant. Review track record carefully.`,
      level: 'note',
    });
  }

  // Small portfolio developer
  if (developerTotalProjects !== null && developerTotalProjects < 3) {
    risks.push({
      text: `${developerName || 'Developer'} has ${developerTotalProjects} completed project${developerTotalProjects === 1 ? '' : 's'}. Limited delivery history.`,
      level: 'note',
    });
  }

  // Off-plan general disclaimer (always shown)
  risks.push({
    text: 'Off-plan purchases carry inherent risks including construction delays, market fluctuation, and developer performance. Independent due diligence is recommended.',
    level: 'note',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-t border-border/30 pt-10"
    >
      <h3 className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-6 flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5" />
        Transparency Notes
      </h3>
      <ul className="space-y-3">
        {risks.map((risk, i) => (
          <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-5 relative">
            <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            {risk.text}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
