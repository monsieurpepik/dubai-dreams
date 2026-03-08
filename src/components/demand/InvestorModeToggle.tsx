import { BarChart3, Eye } from 'lucide-react';

interface InvestorModeToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
}

export function InvestorModeToggle({ enabled, onChange }: InvestorModeToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs tracking-[0.1em] transition-all duration-300 ${
        enabled
          ? 'bg-foreground text-primary-foreground border-foreground'
          : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
      }`}
    >
      {enabled ? <BarChart3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      {enabled ? 'Investor Mode' : 'Explorer Mode'}
    </button>
  );
}
