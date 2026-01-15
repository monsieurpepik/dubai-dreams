import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Mail, Clock } from 'lucide-react';
import { z } from 'zod';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { analytics } from '@/lib/analytics';
import { useTenant } from '@/hooks/useTenant';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  phone: z.string().trim().max(20, 'Phone must be less than 20 characters').optional(),
  message: z.string().trim().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { tenant } = useTenant();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Tenant-aware values
  const cityName = tenant?.office_location?.city || 'Dubai';
  const brandName = tenant?.brand_name || 'Owning';
  const officeArea = tenant?.office_location?.area || 'Dubai Marina';
  const officeCountry = tenant?.office_location?.country || 'United Arab Emirates';
  const contactEmail = tenant?.email || 'hello@owning.com';
  const workingHours = tenant?.working_hours;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        source: 'contact_page',
        quiz_responses: {
          message: result.data.message,
        },
      });

      if (error) throw error;

      try {
        await supabase.functions.invoke('send-lead-notification', {
          body: {
            leadName: result.data.name,
            leadEmail: result.data.email,
            leadPhone: result.data.phone || null,
            propertyName: null,
            propertyId: null,
            source: 'contact_page',
            message: result.data.message,
          },
        });
      } catch (notifyError) {
        console.error('Failed to send notification:', notifyError);
      }

      analytics.submitContactForm();

      setIsSuccess(true);
      toast({
        title: 'Message sent',
        description: 'We will get back to you shortly.',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <p className="text-xs font-medium uppercase tracking-luxury text-accent mb-4">
                Get in Touch
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                Contact Us
              </h1>
              <p className="text-lg text-muted-foreground">
                Have questions about {cityName} off-plan properties? Our team is here to help.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {isSuccess ? (
                  <div className="bg-card border border-border/50 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="font-serif text-2xl text-foreground mb-3">
                      Thank You
                    </h2>
                    <p className="text-muted-foreground">
                      We've received your message and will respond shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className={`h-12 bg-background border-border/50 focus:border-accent ${errors.name ? 'border-destructive' : ''}`}
                      />
                      {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`h-12 bg-background border-border/50 focus:border-accent ${errors.email ? 'border-destructive' : ''}`}
                      />
                      {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+971 50 XXX XXXX"
                        className="h-12 bg-background border-border/50 focus:border-accent"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your property interests..."
                        rows={5}
                        className={`bg-background border-border/50 focus:border-accent resize-none ${errors.message ? 'border-destructive' : ''}`}
                      />
                      {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-luxury"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      We respect your privacy.
                    </p>
                  </form>
                )}
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Contact Info */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Location</h3>
                      <p className="text-muted-foreground">
                        {officeArea}, {cityName}<br />
                        {officeCountry}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        {contactEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Working Hours</h3>
                      <p className="text-muted-foreground">
                        {workingHours ? (
                          <>
                            {workingHours.weekdays}<br />
                            {workingHours.weekends}
                          </>
                        ) : (
                          <>
                            Sunday – Thursday: 9am – 6pm<br />
                            Friday – Saturday: By appointment
                          </>
                        )}
                      </p>
                    </div>
                  </div>
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
