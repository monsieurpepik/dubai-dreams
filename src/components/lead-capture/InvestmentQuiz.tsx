import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/hooks/useTenant';

interface InvestmentQuizProps {
  onComplete?: () => void;
}

const budgetOptions = [
  { label: 'AED 500K – 1M', value: 500000 },
  { label: 'AED 1M – 2M', value: 1000000 },
  { label: 'AED 2M – 5M', value: 2000000 },
  { label: 'AED 5M+', value: 5000000 },
];

const priorityOptions = [
  { label: 'Rental Yield', value: 'yield', description: 'Maximize recurring income' },
  { label: 'Capital Growth', value: 'appreciation', description: 'Long-term value increase' },
];

export const InvestmentQuiz = ({ onComplete }: InvestmentQuizProps) => {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState<number | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useTenant();

  const handleSubmit = async () => {
    if (!email || !budget || !priority) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        email,
        investment_capacity: budget,
        source: 'investment_quiz',
        quiz_responses: { budget, priority },
      });

      if (error) throw error;
      setIsComplete(true);
      onComplete?.();
      
      toast({
        title: 'Recommendations sent',
        description: 'Check your inbox for personalized projects.',
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-secondary p-10 md:p-14 text-center max-w-md mx-auto"
      >
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-accent" />
        </div>
        <h3 className="font-serif text-2xl text-foreground mb-2">
          Recommendations Sent
        </h3>
        <p className="text-muted-foreground text-sm">
          Check your inbox for curated projects matching your criteria.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-secondary p-8 md:p-12 max-w-lg mx-auto">
      {/* Fraction indicator */}
      <div className="flex items-center justify-between mb-10">
        <span className="text-xs text-muted-foreground tracking-[0.15em] uppercase">
          {step} of 3
        </span>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-0.5 transition-colors duration-300 ${
                s <= step ? 'bg-foreground' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Budget */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="font-serif text-2xl text-foreground mb-2">
              Your Investment Budget
            </h3>
            <p className="text-sm text-muted-foreground mb-8">
              Select your comfortable range
            </p>

            <div className="space-y-3">
              {budgetOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setBudget(option.value);
                    setStep(2);
                  }}
                  className={`w-full p-5 text-left border transition-all duration-200 hover:border-foreground/50 ${
                    budget === option.value
                      ? 'border-foreground bg-background'
                      : 'border-border/30 hover:bg-background/50'
                  }`}
                >
                  <span className="text-foreground font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Priority */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="font-serif text-2xl text-foreground mb-2">
              Investment Priority
            </h3>
            <p className="text-sm text-muted-foreground mb-8">
              What matters most?
            </p>

            <div className="space-y-3">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setPriority(option.value);
                    setStep(3);
                  }}
                  className={`w-full p-5 text-left border transition-all duration-200 hover:border-foreground/50 ${
                    priority === option.value
                      ? 'border-foreground bg-background'
                      : 'border-border/30 hover:bg-background/50'
                  }`}
                >
                  <span className="text-foreground font-medium block">{option.label}</span>
                  <span className="text-xs text-muted-foreground mt-1 block">{option.description}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 mt-8 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.15em]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </motion.div>
        )}

        {/* Step 3: Email */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="font-serif text-2xl text-foreground mb-2">
              Get Your Recommendations
            </h3>
            <p className="text-sm text-muted-foreground mb-8">
              Curated projects matching your criteria
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border/30 focus:border-foreground h-13"
                required
              />

              <Button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full h-13 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-[0.2em]"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    See Recommendations
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 mt-8 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.15em]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            <p className="text-[10px] text-center text-muted-foreground mt-8">
              We respect your privacy. No spam.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
