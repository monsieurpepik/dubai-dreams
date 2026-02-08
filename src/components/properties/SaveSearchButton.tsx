import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SaveSearchButtonProps {
  filters: Record<string, any>;
  hasActiveFilters: boolean;
}

export const SaveSearchButton = ({ filters, hasActiveFilters }: SaveSearchButtonProps) => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!hasActiveFilters) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('saved_searches' as any).insert({
        email,
        name: name || null,
        filters,
        frequency: 'weekly',
      } as any);

      if (error) throw error;

      setIsSaved(true);
      setShowForm(false);
      toast.success('Search saved! We\'ll email you when new matches appear.');
    } catch (err) {
      console.error('Error saving search:', err);
      toast.error('Failed to save search. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSaved) {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-accent">
        <Check className="w-3.5 h-3.5" />
        Search saved
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowForm(!showForm)}
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxury text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell className="w-4 h-4" />
        Save Search
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-3 w-80 bg-background border border-border/50 shadow-lg p-5 z-40"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-foreground">Get notified</h4>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              We'll email you when new properties matching your filters are listed.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 bg-secondary border-border/50 text-sm"
              />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 bg-secondary border-border/50 text-sm"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-wider"
              >
                {isSubmitting ? 'Saving...' : 'Save & Notify Me'}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
