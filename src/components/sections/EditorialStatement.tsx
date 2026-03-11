import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
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
    <section className="py-24 md:py-36 bg-black border-t border-white/10">
      <div className="container-wide flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-12 h-px bg-white/30 mb-10 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(1.5rem,4vw,3.5rem)] font-light leading-[1.3] text-white"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          We don't sell property.{' '}
          <span className="text-white/40">
            We advise on wealth positioned in real estate — tax-free, in the world's fastest-growing market.
          </span>
        </motion.p>

        {/* Email capture */}
        <motion.form
          onSubmit={handleSubscribe}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex w-full max-w-md gap-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="flex-1 px-4 py-3 bg-transparent border border-white/15 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-white text-black text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-white/90 transition-all disabled:opacity-60"
          >
            {submitting ? 'Joining…' : 'Get Brief'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
