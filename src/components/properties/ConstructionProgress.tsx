import { motion } from 'framer-motion';
import { Building2, CheckCircle2 } from 'lucide-react';

type ConstructionStage = 'pre-launch' | 'foundation' | 'structure' | 'finishing' | 'ready';

interface ConstructionProgressProps {
  stage: ConstructionStage;
  percentComplete: number;
  completionDate: string | null;
}

const stages: { key: ConstructionStage; label: string }[] = [
  { key: 'pre-launch', label: 'Pre-Launch' },
  { key: 'foundation', label: 'Foundation' },
  { key: 'structure', label: 'Structure' },
  { key: 'finishing', label: 'Finishing' },
  { key: 'ready', label: 'Ready' },
];

const stageIndex = (stage: ConstructionStage) => stages.findIndex(s => s.key === stage);

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
};

export const ConstructionProgress = ({ stage, percentComplete, completionDate }: ConstructionProgressProps) => {
  const currentIndex = stageIndex(stage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border/50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Construction Progress</h3>
            <p className="text-xs text-muted-foreground">Expected {formatDate(completionDate)}</p>
          </div>
        </div>
        <span className="text-2xl font-medium text-foreground">{percentComplete}%</span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-secondary mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentComplete}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 h-full bg-accent"
        />
      </div>

      {/* Stages */}
      <div className="flex justify-between">
        {stages.map((s, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={s.key} className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 transition-colors ${
                isCompleted 
                  ? 'bg-accent text-accent-foreground' 
                  : isCurrent 
                    ? 'bg-accent/20 border-2 border-accent text-accent'
                    : 'bg-secondary text-muted-foreground'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className={`text-[10px] uppercase tracking-wider text-center ${
                isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
