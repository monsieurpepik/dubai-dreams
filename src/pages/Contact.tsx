import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MapPin, Mail, Clock, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { analytics } from '@/lib/analytics';
import { useTenant } from '@/hooks/useTenant';

const intentOptions = [
  'Buying First Property',
  'Expanding Portfolio',
  'Just Researching',
  'Other',
];

const Contact = () => {
  const { tenant, formatPrice } = useTenant();
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState('');
  const [budget, setBudget] = useState(2000000);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const cityName = tenant?.office_location?.city || 'Dubai';
  const brandName = tenant?.brand_name || 'Owning';
  const officeArea = tenant?.office_location?.area || 'Dubai Marina';
  const officeCountry = tenant?.office_location?.country || 'United Arab Emirates';
  const contactEmail = tenant?.email || 'hello@owning.com';
  const workingHours = tenant?.working_hours;

  const canProceedStep2 = !!intent;
  const canSubmit = email.includes('@') && name.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name,
        email,
        phone: phone || null,
        source: 'contact_page',
        investment_capacity: budget,
        quiz_responses: { intent, budget },
      });
      if (error) throw error;

      try {
        await supabase.functions.invoke('send-lead-notification', {
          body: {
            leadName: name,
            leadEmail: email,
            leadPhone: phone || null,
            propertyName: null,
            propertyId: null,
            source: 'contact_page',
            message: `Intent: ${intent}, Budget: ${budget}`,
          },
        });
      } catch (notifyError) {
        console.error('Failed to send notification:', notifyError);
      }

      analytics.submitContactForm();
      setIsSuccess(true);
      toast({ title: 'Message sent', description: 'We will get back to you shortly.' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact Us"
        description={`Get in touch with ${brandName}. Our ${cityName} team is ready to help you find your perfect off-plan property investment.`}
        url={`https://owning${cityName.toLowerCase()}.com/contact`}
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <p className="text-xs font-medium uppercase tracking-luxury text-accent mb-4">Get in Touch</p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                Let's Talk
              </h1>
              <p className="text-lg text-muted-foreground">
                Tell us a little about yourself. We'll match you with the right advisor.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Conversational Form */}
              <div className="min-h-[400px]">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-muted/30 p-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground mb-3">Thank You</h2>
                    <p className="text-muted-foreground mb-2">
                      We've received your details and will be in touch within 24 hours.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      A dedicated advisor will review your preferences and prepare tailored recommendations.
                    </p>
                  </motion.div>
                ) : (
                  <div>
                    {/* Step indicator */}
                    <p className="text-xs text-muted-foreground mb-8 uppercase tracking-wider">
                      {step} of 3
                    </p>

                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 !text-2xl md:!text-3xl">
                            What brings you here?
                          </h2>
                          <div className="grid grid-cols-2 gap-3">
                            {intentOptions.map((option) => (
                              <button
                                key={option}
                                onClick={() => setIntent(option)}
                                className={`p-5 text-left text-sm transition-all border ${
                                  intent === option
                                    ? 'border-foreground bg-foreground/5 text-foreground'
                                    : 'border-border/50 text-muted-foreground hover:border-foreground/30'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                          <Button
                            onClick={() => setStep(2)}
                            disabled={!canProceedStep2}
                            className="mt-8 h-12 px-8 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-wider"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 !text-2xl md:!text-3xl">
                            What's your budget range?
                          </h2>
                          <div className="space-y-6">
                            <div className="text-center">
                              <span className="font-serif text-4xl text-foreground">
                                {formatPrice(budget, { compact: true })}
                              </span>
                            </div>
                            <Slider
                              value={[budget]}
                              onValueChange={(v) => setBudget(v[0])}
                              min={500000}
                              max={20000000}
                              step={250000}
                              className="py-4"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{formatPrice(500000, { compact: true })}</span>
                              <span>{formatPrice(20000000, { compact: true })}</span>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-8">
                            <Button
                              variant="outline"
                              onClick={() => setStep(1)}
                              className="h-12 px-6 text-xs uppercase tracking-wider"
                            >
                              Back
                            </Button>
                            <Button
                              onClick={() => setStep(3)}
                              className="h-12 px-8 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-wider"
                            >
                              Continue
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 !text-2xl md:!text-3xl">
                            How should we reach you?
                          </h2>
                          <div className="space-y-5">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">Full Name *</label>
                              <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Smith"
                                className="h-12 bg-background border-border/50 focus:border-accent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                              <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                className="h-12 bg-background border-border/50 focus:border-accent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                              <Input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+971 50 XXX XXXX"
                                className="h-12 bg-background border-border/50 focus:border-accent"
                              />
                            </div>
                          </div>
                          <div className="flex gap-3 mt-8">
                            <Button
                              variant="outline"
                              onClick={() => setStep(2)}
                              className="h-12 px-6 text-xs uppercase tracking-wider"
                            >
                              Back
                            </Button>
                            <Button
                              onClick={handleSubmit}
                              disabled={isSubmitting || !canSubmit}
                              className="h-12 px-8 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-wider"
                            >
                              {isSubmitting ? 'Sending...' : 'Send'}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-4">We respect your privacy.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Info — streamlined, no circles */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8 lg:pt-12"
              >
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-1">Location</h3>
                      <p className="text-sm text-muted-foreground">{officeArea}, {cityName}<br />{officeCountry}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground">{contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-1">Working Hours</h3>
                      <p className="text-sm text-muted-foreground">
                        {workingHours ? (
                          <>{workingHours.weekdays}<br />{workingHours.weekends}</>
                        ) : (
                          <>Sunday – Thursday: 9am – 6pm<br />Friday – Saturday: By appointment</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social proof */}
                <div className="border-t border-border/30 pt-6">
                  <p className="text-xs text-muted-foreground">
                    Average response time: <span className="text-foreground font-medium">2 hours</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
