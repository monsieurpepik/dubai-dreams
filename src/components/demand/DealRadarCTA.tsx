import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DealRadarCTAProps {
  filters: {
    budget: [number, number];
    locations: string[];
    goal: string;
    risk: string;
    propertyTypes: string[];
  };
}

export function DealRadarCTA({ filters }: DealRadarCTAProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('saved_searches').insert({
        email: email.trim(),
        name: `Deal Radar — ${filters.goal}`,
        filters: filters as any,
        frequency: 'weekly',
      });
      if (error) throw error;
      setSaved(true);
      toast.success('Deal Radar activated! We\'ll notify you when matching deals appear.');
    } catch {
      toast.error('Failed to activate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (saved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-10 px-6"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/30 mb-4">
          <Check className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="font-serif text-xl text-foreground">Deal Radar Active</h3>
        <p className="text-sm text-muted-foreground mt-2">
          We'll email you when new properties match your investment criteria.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="text-center py-12 px-6">
      <Bell className="w-6 h-6 text-muted-foreground/40 mx-auto mb-4" />
      <h3 className="font-serif text-2xl text-foreground">Activate Deal Radar</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
        Get notified when properties below market price match your investment profile.
      </p>
      <form onSubmit={handleActivate} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-foreground text-primary-foreground text-xs font-medium uppercase tracking-[0.12em] rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          Activate
        </button>
      </form>
    </div>
  );
}
