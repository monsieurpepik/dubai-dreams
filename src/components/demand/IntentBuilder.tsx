import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, Building2, Home, Palmtree, Crown, TrendingUp, Shield, Zap, Target } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';

export interface InvestorIntent {
  budget: [number, number];
  locations: string[];
  goal: string;
  risk: string;
  propertyTypes: string[];
}

interface IntentBuilderProps {
  onComplete: (intent: InvestorIntent) => void;
}

const goals = [
  { id: 'highest_yield', label: 'Highest Yield', desc: 'Maximize rental income', icon: TrendingUp },
  { id: 'capital_growth', label: 'Capital Growth', desc: 'Long-term value appreciation', icon: Target },
  { id: 'holiday_home', label: 'Holiday Home', desc: 'Personal use + rental', icon: Palmtree },
  { id: 'primary_residence', label: 'Primary Residence', desc: 'Your new home in Dubai', icon: Home },
];

const risks = [
  { id: 'conservative', label: 'Conservative', desc: 'Ready or near-completion projects, established areas', icon: Shield },
  { id: 'balanced', label: 'Balanced', desc: 'Mix of off-plan and ready, growing areas', icon: Target },
  { id: 'aggressive', label: 'Aggressive', desc: 'Early off-plan, emerging areas, higher potential', icon: Zap },
];

const propertyTypes = [
  { id: 'apartment', label: 'Apartment', icon: Building2 },
  { id: 'villa', label: 'Villa', icon: Home },
  { id: 'townhouse', label: 'Townhouse', icon: Home },
  { id: 'branded_residence', label: 'Branded Residence', icon: Crown },
];

const STEPS = ['Budget', 'Location', 'Goal', 'Risk', 'Type'];

export function IntentBuilder({ onComplete }: IntentBuilderProps) {
  const { formatPrice } = useTenant();
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState<[number, number]>([500000, 5000000]);
  const [locations, setLocations] = useState<string[]>([]);
  const [goal, setGoal] = useState('');
  const [risk, setRisk] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const { data: areas = [] } = useQuery({
    queryKey: ['intent-areas'],
    queryFn: async () => {
      const { data } = await supabase.from('area_market_data').select('area').order('area');
      return data?.map((d) => d.area) || [];
    },
  });

  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return true; // locations optional
    if (step === 2) return !!goal;
    if (step === 3) return !!risk;
    if (step === 4) return true; // types optional
    return false;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete({ budget, locations, goal, risk, propertyTypes: selectedTypes });
  };

  const toggleLocation = (area: string) => {
    setLocations((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => { setDirection(1); handleNext(); };
  const goBack = () => { setDirection(-1); setStep(step - 1); };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-12">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
            <div className={`h-[2px] w-full rounded-full transition-all duration-500 ${
              i <= step ? 'bg-foreground' : 'bg-border'
            }`} />
            <span className={`text-[9px] tracking-[0.2em] uppercase transition-colors duration-300 ${
              i <= step ? 'text-foreground' : 'text-muted-foreground/40'
            }`}>
              {s}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[320px] relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">What's your budget?</h2>
                <p className="text-sm text-muted-foreground mb-10">Drag the handles to set your investment range.</p>
                <div className="px-4">
                  <Slider
                    value={budget}
                    onValueChange={(v) => setBudget(v as [number, number])}
                    min={300000}
                    max={15000000}
                    step={100000}
                    className="mb-6"
                  />
                  <div className="flex justify-between text-sm text-foreground font-medium">
                    <span>{formatPrice(budget[0], { compact: true })}</span>
                    <span>{formatPrice(budget[1], { compact: true })}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Where do you want to invest?</h2>
                <p className="text-sm text-muted-foreground mb-8">Select one or more areas, or skip for all.</p>
                <div className="flex flex-wrap gap-2">
                  {areas.map((area) => (
                    <button
                      key={area}
                      onClick={() => toggleLocation(area)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 border ${
                        locations.includes(area)
                          ? 'bg-foreground text-primary-foreground border-foreground'
                          : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">What's your investment goal?</h2>
                <p className="text-sm text-muted-foreground mb-8">This shapes how we rank properties for you.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {goals.map((g) => {
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={`flex items-center gap-4 p-5 rounded-xl border text-left transition-all duration-200 ${
                          goal === g.id
                            ? 'bg-foreground text-primary-foreground border-foreground'
                            : 'bg-card text-foreground border-border hover:border-foreground/30'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0 opacity-60" />
                        <div>
                          <p className="text-sm font-medium">{g.label}</p>
                          <p className={`text-xs mt-0.5 ${goal === g.id ? 'opacity-70' : 'text-muted-foreground'}`}>{g.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Your risk appetite?</h2>
                <p className="text-sm text-muted-foreground mb-8">We'll prioritize properties that match your comfort level.</p>
                <div className="grid grid-cols-1 gap-3">
                  {risks.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setRisk(r.id)}
                        className={`flex items-center gap-4 p-5 rounded-xl border text-left transition-all duration-200 ${
                          risk === r.id
                            ? 'bg-foreground text-primary-foreground border-foreground'
                            : 'bg-card text-foreground border-border hover:border-foreground/30'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0 opacity-60" />
                        <div>
                          <p className="text-sm font-medium">{r.label}</p>
                          <p className={`text-xs mt-0.5 ${risk === r.id ? 'opacity-70' : 'text-muted-foreground'}`}>{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Property type preference?</h2>
                <p className="text-sm text-muted-foreground mb-8">Select all that interest you, or skip for all types.</p>
                <div className="grid grid-cols-2 gap-3">
                  {propertyTypes.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleType(t.id)}
                        className={`flex items-center gap-3 p-5 rounded-xl border text-left transition-all duration-200 ${
                          selectedTypes.includes(t.id)
                            ? 'bg-foreground text-primary-foreground border-foreground'
                            : 'bg-card text-foreground border-border hover:border-foreground/30'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0 opacity-60" />
                        <span className="text-sm font-medium">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10">
        <button
          onClick={goBack}
          disabled={step === 0}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={goNext}
          disabled={!canNext()}
          className="flex items-center gap-2 px-8 py-3 bg-foreground text-primary-foreground text-xs font-medium uppercase tracking-[0.15em] rounded-xl hover:opacity-90 transition-opacity disabled:opacity-30"
        >
          {step === 4 ? 'Find Deals' : 'Continue'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
