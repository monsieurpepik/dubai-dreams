import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
    <section ref={ref} className="relative bg-black border-t border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left — Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-black px-8 py-16 md:px-16 md:py-24 lg:px-20 flex items-center border-r border-white/10"
        >
          <div className="w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-[0.05em] uppercase text-white mb-4">
              Private Property
              <br />
              Advisor
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-10 max-w-md">
              Share your investment goals and our advisors will curate a personalized selection of Dubai's finest opportunities — delivered privately to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-transparent border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30 h-12"
                  required
                  maxLength={100}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-transparent border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30 h-12"
                  required
                  maxLength={255}
                />
              </div>

              {/* Phone */}
              <div>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  className="[&_select]:bg-transparent [&_select]:border-white/20 [&_select]:text-white [&_input]:bg-transparent [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/40 [&_input]:h-12 [&_select]:h-12"
                  placeholder="50 123 4567"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.05em] text-white/50 mb-4">
                  Investment Interest
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {interests.map(interest => (
                    <label
                      key={interest.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <Checkbox
                        checked={selectedInterests.includes(interest.id)}
                        onCheckedChange={() => toggleInterest(interest.id)}
                        className="border-white/30 data-[state=checked]:bg-[#1127D2] data-[state=checked]:text-white"
                      />
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">
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
                className="bg-transparent border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30 min-h-[80px] resize-none"
                maxLength={1000}
              />

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-[#1127D2] text-white hover:opacity-90 tracking-[0.05em] uppercase text-xs"
              >
                {submitting ? 'Submitting…' : 'Start Your Personalized Search'}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Right — Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative min-h-[400px] lg:min-h-0"
        >
          <img
            src="/hero-dubai-skyline.jpeg"
            alt="Dubai skyline at sunset"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};
