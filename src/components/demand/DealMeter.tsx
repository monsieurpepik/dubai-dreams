import { motion } from 'framer-motion';

interface DealMeterProps {
  score: number;
  size?: number;
}

export function DealMeter({ score, size = 80 }: DealMeterProps) {
  const radius = (size - 8) / 2;
  const circumference = Math.PI * radius; // half circle
  const progress = (score / 100) * circumference;

  const color = score >= 70
    ? 'hsl(142 70% 45%)'
    : score >= 40
    ? 'hsl(42 90% 55%)'
    : 'hsl(0 70% 55%)';

  const label = score >= 70 ? 'Great Deal' : score >= 40 ? 'Fair' : 'Premium';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size / 2 + 8} viewBox={`0 0 ${size} ${size / 2 + 8}`}>
        {/* Background arc */}
        <path
          d={`M 4 ${size / 2 + 4} A ${radius} ${radius} 0 0 1 ${size - 4} ${size / 2 + 4}`}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Score arc */}
        <motion.path
          d={`M 4 ${size / 2 + 4} A ${radius} ${radius} 0 0 1 ${size - 4} ${size / 2 + 4}`}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Score text */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          className="fill-foreground font-serif text-lg font-medium"
          fontSize={size * 0.25}
        >
          {score}
        </text>
      </svg>
      <span className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}
