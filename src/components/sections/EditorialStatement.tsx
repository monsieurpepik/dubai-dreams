import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function EditorialStatement() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: email.trim(),
        source: 'editorial_cta',
        interests: ['market_brief'],
      });
      if (error) throw error;
      toast.success('You\'re in. Watch your inbox.');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container-wide">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-light leading-[1.25] text-white max-w-4xl"
        >
          We do not sell property.{' '}
          <span className="text-white/70">
            We advise on wealth positioned in real estate — tax-free, in the world's fastest-growing market.
          </span>
        </motion.p>

        {/* Mid-funnel email capture */}
        <motion.form
          onSubmit={handleSubscribe}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="flex-1 h-12 px-4 bg-transparent border border-white/20 rounded-md text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#1127D2] text-white text-xs font-medium uppercase tracking-[0.05em] rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting ? 'Joining…' : 'Get Weekly Brief'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
