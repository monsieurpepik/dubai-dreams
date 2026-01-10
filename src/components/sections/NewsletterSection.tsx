import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight, Bell, TrendingUp, Building2 } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

const emailSchema = z.string().trim().email('Please enter a valid email').max(255);

interface Interest {
  id: string;
  label: string;
  icon: React.ElementType;
}

const interests: Interest[] = [
  { id: 'new_launches', label: 'New Project Launches', icon: Building2 },
  { id: 'market_updates', label: 'Market Updates', icon: TrendingUp },
  { id: 'price_alerts', label: 'Price Drop Alerts', icon: Bell },
];

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['new_launches', 'market_updates']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0]?.message || 'Invalid email');
      return;
    }

    if (selectedInterests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: result.data,
          interests: selectedInterests,
          source: 'homepage_newsletter',
        });

      if (insertError) {
        // Check if it's a duplicate email error
        if (insertError.code === '23505') {
          toast({
            title: 'Already subscribed',
            description: 'This email is already on our list!',
          });
          setIsSuccess(true);
          return;
        }
        throw insertError;
      }

      // Track analytics
      analytics.newsletterSignup(selectedInterests);

      setIsSuccess(true);
      toast({
        title: 'Welcome aboard!',
        description: 'You\'ll receive our latest property updates.',
      });
    } catch (err) {
      console.error('Newsletter signup error:', err);
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-foreground text-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-medium uppercase tracking-luxury text-accent mb-4">
              Stay Informed
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              Get exclusive
              <br />
              <span className="text-background/70">market insights</span>
            </h2>
            <p className="text-background/70 text-lg mb-8 max-w-md">
              Join 2,000+ investors receiving weekly updates on Dubai's hottest off-plan opportunities, market trends, and exclusive early-bird access.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                'Early access to new project launches',
                'Weekly market analysis & ROI insights',
                'Exclusive off-market opportunities',
              ].map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-sm text-background/80">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background/10 backdrop-blur-sm border border-background/20 p-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-serif text-2xl mb-3">You're on the list!</h3>
                <p className="text-background/70">
                  Check your inbox for a welcome email with your first market report.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-background/10 backdrop-blur-sm border border-background/20 p-8 md:p-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Subscribe to Updates</h3>
                    <p className="text-sm text-background/60">Free weekly insights</p>
                  </div>
                </div>

                {/* Interests */}
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-wider text-background/50 mb-3">
                    I'm interested in
                  </p>
                  <div className="space-y-2">
                    {interests.map(({ id, label, icon: Icon }) => (
                      <label
                        key={id}
                        className={`flex items-center gap-3 p-3 border cursor-pointer transition-all ${
                          selectedInterests.includes(id)
                            ? 'border-accent/50 bg-accent/10'
                            : 'border-background/20 hover:border-background/30'
                        }`}
                      >
                        <Checkbox
                          checked={selectedInterests.includes(id)}
                          onCheckedChange={() => handleInterestToggle(id)}
                          className="border-background/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                        <Icon className="w-4 h-4 text-background/60" />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Email input */}
                <div className="mb-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`h-12 bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-accent ${
                      error ? 'border-red-400' : ''
                    }`}
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="text-xs text-red-400 mt-1">{error}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-accent text-foreground hover:bg-accent/90 text-xs uppercase tracking-wider font-medium"
                >
                  {isSubmitting ? (
                    'Subscribing...'
                  ) : (
                    <>
                      Subscribe Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-background/50 mt-4">
                  No spam, unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
