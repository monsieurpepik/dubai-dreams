import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, Phone, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';

const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email').max(255, 'Email is too long'),
  phone: z.string().trim().max(20, 'Phone number is too long').optional().or(z.literal('')),
  message: z.string().trim().max(1000, 'Message is too long').optional().or(z.literal('')),
  goldenVisaInterest: z.boolean(),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface PropertyInquiryFormProps {
  propertyId: string;
  propertyName: string;
  goldenVisaEligible: boolean;
}

export const PropertyInquiryForm = ({
  propertyId,
  propertyName,
  goldenVisaEligible,
}: PropertyInquiryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    goldenVisaInterest: false,
  });

  const handleInputChange = (field: keyof InquiryFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = inquirySchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
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
        property_id: propertyId,
        source: 'property_inquiry',
        golden_visa_interest: result.data.goldenVisaInterest,
        quiz_responses: {
          message: result.data.message,
          property_name: propertyName,
          submitted_at: new Date().toISOString(),
        },
      });

      if (error) throw error;

      // Send notification email
      try {
        await supabase.functions.invoke('send-lead-notification', {
          body: {
            leadName: result.data.name,
            leadEmail: result.data.email,
            leadPhone: result.data.phone || null,
            propertyName,
            propertyId,
            source: 'property_inquiry',
            message: result.data.message,
            goldenVisaInterest: result.data.goldenVisaInterest,
          },
        });
      } catch (notifyError) {
        console.error('Failed to send notification:', notifyError);
      }

      // Track analytics
      analytics.submitInquiry(propertyId, propertyName);
      if (result.data.goldenVisaInterest) {
        analytics.expressGoldenVisaInterest(propertyId);
      }

      setIsSubmitted(true);
      toast.success('Inquiry submitted successfully!');
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 rounded-xl p-6 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Your inquiry about <strong>{propertyName}</strong> has been received. Our team will contact you within 24 hours.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              message: '',
              goldenVisaInterest: false,
            });
          }}
        >
          Submit Another Inquiry
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card border border-border/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Interested in this property?</h3>
          <p className="text-sm text-muted-foreground">Get in touch with our team</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={errors.name ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Phone Number
          </Label>
          <PhoneInput
            id="phone"
            value={formData.phone || ''}
            onChange={(val) => handleInputChange('phone', val)}
            error={!!errors.phone}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium">
            Message (Optional)
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us about your requirements..."
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={3}
            className={errors.message ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="text-xs text-red-500">{errors.message}</p>
          )}
        </div>

        {/* Golden Visa Interest */}
        {goldenVisaEligible && (
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <Checkbox
              id="goldenVisa"
              checked={formData.goldenVisaInterest}
              onCheckedChange={(checked) => 
                handleInputChange('goldenVisaInterest', checked as boolean)
              }
              disabled={isSubmitting}
            />
            <div className="space-y-1">
              <Label htmlFor="goldenVisa" className="text-sm font-medium cursor-pointer">
                I'm interested in Golden Visa
              </Label>
              <p className="text-xs text-muted-foreground">
                This property qualifies for UAE Golden Visa. Check to get more info.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Inquiry
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By submitting, you agree to be contacted about this property.
        </p>
      </form>
    </motion.div>
  );
};
