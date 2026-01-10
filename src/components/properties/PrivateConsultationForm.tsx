import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, Phone, Mail, Clock, CheckCircle2, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  message: z.string().optional(),
  goldenVisaInterest: z.boolean().default(false),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).default('email'),
});

type FormData = z.infer<typeof formSchema>;

interface PrivateConsultationFormProps {
  propertyId: string;
  propertyName: string;
  goldenVisaEligible?: boolean;
}

export const PrivateConsultationForm = ({
  propertyId,
  propertyName,
  goldenVisaEligible = false,
}: PrivateConsultationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      goldenVisaInterest: false,
      preferredContact: 'email',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        property_id: propertyId,
        source: 'private_consultation',
        golden_visa_interest: data.goldenVisaInterest,
        quiz_responses: {
          message: data.message,
          preferred_contact: data.preferredContact,
          property_name: propertyName,
        },
      });

      if (error) throw error;

      // Send notification email
      try {
        await supabase.functions.invoke('send-lead-notification', {
          body: {
            leadName: data.name,
            leadEmail: data.email,
            leadPhone: data.phone || null,
            propertyName,
            propertyId,
            source: 'private_consultation',
            message: data.message,
            goldenVisaInterest: data.goldenVisaInterest,
          },
        });
      } catch (notifyError) {
        console.error('Failed to send notification:', notifyError);
      }

      // Track analytics
      analytics.submitInquiry(propertyId, propertyName);
      if (data.goldenVisaInterest) {
        analytics.expressGoldenVisaInterest(propertyId);
      }

      setIsSuccess(true);
      toast({
        title: 'Consultation Request Received',
        description: 'Our property advisors will contact you within 24 hours.',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h3 className="font-serif text-2xl text-foreground mb-3">
          Thank You
        </h3>
        <p className="text-muted-foreground mb-6">
          Your consultation request has been received. One of our property advisors 
          will reach out to you within 24 hours.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Typical response time: 2-4 hours</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border/50"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-border/50">
        <h3 className="font-serif text-2xl text-foreground mb-2">
          Private Consultation
        </h3>
        <p className="text-sm text-muted-foreground">
          Our team of property advisors is available for a private consultation at your convenience.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    className="bg-background border-border/50 focus:border-accent h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="bg-background border-border/50 focus:border-accent h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                    Phone (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+971 XX XXX XXXX"
                      className="bg-background border-border/50 focus:border-accent h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Preferred Contact Method */}
          <FormField
            control={form.control}
            name="preferredContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                  Preferred Contact Method
                </FormLabel>
                <div className="flex gap-2 mt-2">
                  {[
                    { value: 'email', label: 'Email', icon: Mail },
                    { value: 'phone', label: 'Phone', icon: Phone },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 border transition-all ${
                        field.value === value
                          ? 'border-accent bg-accent/5 text-accent'
                          : 'border-border/50 text-muted-foreground hover:border-border'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                  Message (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your requirements..."
                    className="bg-background border-border/50 focus:border-accent min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Golden Visa Interest */}
          {goldenVisaEligible && (
            <FormField
              control={form.control}
              name="goldenVisaInterest"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 p-4 bg-gold/5 border border-gold/20">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5 border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gold" />
                      <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
                        I'm interested in Golden Visa eligibility
                      </FormLabel>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Receive information about UAE residency through property investment.
                    </p>
                  </div>
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 text-sm uppercase tracking-wider"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Request Consultation
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By submitting, you agree to our privacy policy and terms of service.
          </p>
        </form>
      </Form>
    </motion.div>
  );
};
