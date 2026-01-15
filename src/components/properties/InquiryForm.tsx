import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

interface InquiryFormProps {
  propertyId: string;
  propertyName: string;
}

export const InquiryForm = ({ propertyId, propertyName }: InquiryFormProps) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        email,
        phone: phone || null,
        property_id: propertyId,
        source: 'property_inquiry',
        quiz_responses: {
          property_name: propertyName,
        },
      });

      if (error) throw error;

      // Send notification email
      try {
        await supabase.functions.invoke('send-lead-notification', {
          body: {
            leadName: null,
            leadEmail: email,
            leadPhone: phone || null,
            propertyName,
            propertyId,
            source: 'property_inquiry',
          },
        });
      } catch (notifyError) {
        console.error('Failed to send notification:', notifyError);
        // Don't fail the submission if notification fails
      }

      // Track analytics
      analytics.submitInquiry(propertyId, propertyName);

      setIsSuccess(true);
      toast({
        title: 'Request received',
        description: 'We will contact you shortly.',
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

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 p-8 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-accent" />
        </div>
        <h3 className="font-serif text-xl text-foreground mb-2">
          Thank You
        </h3>
        <p className="text-sm text-muted-foreground">
          We'll respond shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border/50 p-8"
    >
      <h3 className="font-serif text-xl text-foreground mb-2">
        Inquire
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Get project details.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background border-border/50 focus:border-accent h-12"
          required
        />
        
        <Input
          type="tel"
          placeholder="Your phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-background border-border/50 focus:border-accent h-12"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-luxury"
        >
          {isSubmitting ? 'Sending...' : 'Request Details'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          We respect your privacy.
        </p>
      </form>
    </motion.div>
  );
};
