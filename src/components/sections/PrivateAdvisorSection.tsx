import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().optional(),
  message: z.string().trim().max(1000).optional(),
});

const interests = [
  { id: 'off-plan', label: 'Off-Plan' },
  { id: 'ready', label: 'Ready Properties' },
  { id: 'golden-visa', label: 'Golden Visa' },
  { id: 'rental-yield', label: 'Rental Yield' },
];

export const PrivateAdvisorSection = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+971 ');
  const [message, setMessage] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = formSchema.safeParse({ name, email, phone: phone.trim() || undefined, message: message || undefined });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        source: 'private_advisor',
        quiz_responses: { interests: selectedInterests, message: parsed.data.message },
        golden_visa_interest: selectedInterests.includes('golden-visa'),
      });

      if (error) throw error;

      supabase.functions.invoke('send-lead-notification', {
        body: {
          leadName: parsed.data.name,
          leadEmail: parsed.data.email,
          leadPhone: parsed.data.phone || null,
          propertyName: null,
          propertyId: null,
          source: 'private_advisor',
          message: parsed.data.message,
          goldenVisaInterest: selectedInterests.includes('golden-visa'),
        },
      });

      toast.success('Thank you. Our advisor will be in touch shortly.');
      setName('');
      setEmail('');
      setPhone('+971 ');
      setMessage('');
      setSelectedInterests([]);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="relative bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left — Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-black px-8 py-16 md:px-16 md:py-24 lg:px-20 flex items-center"
        >
          <div className="w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-[-0.01em]">
                Get Matched
              </h2>
              <p className="mt-3 text-[15px] text-white/60 leading-relaxed max-w-md">
                Tell us what you're looking for. Our advisors curate a private selection matched to your investment goals.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-white/20 focus-visible:bg-white/[0.08] h-12 rounded-xl transition-all"
                  required
                  maxLength={100}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-white/20 focus-visible:bg-white/[0.08] h-12 rounded-xl transition-all"
                  required
                  maxLength={255}
                />
              </div>

              <PhoneInput
                value={phone}
                onChange={setPhone}
                className="[&_select]:bg-white/[0.06] [&_select]:border-white/[0.08] [&_select]:text-white [&_select]:rounded-xl [&_input]:bg-white/[0.06] [&_input]:border-white/[0.08] [&_input]:text-white [&_input]:placeholder:text-white/30 [&_input]:h-12 [&_input]:rounded-xl [&_select]:h-12"
                placeholder="50 123 4567"
              />

              <div>
                <p className="text-[13px] text-white/60 mb-3 font-medium">
                  I'm interested in
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {interests.map(interest => (
                    <label
                      key={interest.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                        selectedInterests.includes(interest.id)
                          ? 'bg-white/[0.1] border-white/[0.2]'
                          : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07]'
                      }`}
                    >
                      <Checkbox
                        checked={selectedInterests.includes(interest.id)}
                        onCheckedChange={() => toggleInterest(interest.id)}
                        className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black rounded"
                      />
                      <span className="text-[13px] text-white/60">
                        {interest.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="Tell us about your ideal property (optional)"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-white/20 focus-visible:bg-white/[0.08] min-h-[80px] resize-none rounded-xl transition-all"
                maxLength={1000}
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-13 py-3.5 bg-white text-black text-[14px] font-semibold rounded-full hover:bg-white/90 hover:shadow-[0_4px_20px_rgba(255,255,255,0.12)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:active:scale-100"
              >
                {submitting ? 'Sending...' : 'Get Matched'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Right — Image with rounded inner corners */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative min-h-[400px] lg:min-h-0 overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
            alt="Luxury villa interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};
