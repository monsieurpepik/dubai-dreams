import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check, FileText, BookOpen, Calculator, Shield, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const features = [
  { icon: FileText, label: "Complete payment plan comparison" },
  { icon: BookOpen, label: "Developer track records" },
  { icon: Calculator, label: "Mortgage process walkthrough" },
  { icon: MapPin, label: "Area-by-area analysis" },
  { icon: Shield, label: "Legal checklist" },
];

export function GuideSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        email,
        source: "guide_download",
      });

      if (error) {
        if (error.code === "23505") {
          // Duplicate email
          toast({
            title: "Already subscribed",
            description: "You've already downloaded the guide. Check your email!",
          });
          setIsSuccess(true);
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast({
          title: "Success!",
          description: "Check your email for the guide.",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guide" ref={ref} className="section-padding-lg bg-secondary">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Book Mockup */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="relative">
              {/* Book Shadow */}
              <div className="absolute inset-0 bg-black/20 blur-3xl translate-y-8 scale-90" />
              
              {/* Book Cover */}
              <div
                className="relative bg-gradient-to-br from-foreground to-foreground/80 rounded-lg p-8 lg:p-12 shadow-2xl"
                style={{
                  transform: "perspective(1000px) rotateY(-5deg) rotateX(5deg)",
                }}
              >
                <div className="w-56 lg:w-72 text-background">
                  <div className="mb-8">
                    <span className="text-gold text-sm font-medium">FREE GUIDE</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-light mb-4 leading-tight">
                    Dubai Off-Plan Buyer's Guide
                  </h3>
                  <p className="text-background/60 text-sm mb-8">
                    Everything you need to know before investing in Dubai real estate
                  </p>
                  <div className="flex items-center gap-2 text-xs text-background/40">
                    <span>OwningDubai</span>
                    <span>•</span>
                    <span>2025 Edition</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h2 className="mb-6">
              Dubai Off-Plan Buyer's Guide{" "}
              <span className="text-gold">2025</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Your comprehensive guide to navigating Dubai's off-plan property market. 
              From choosing the right developer to understanding payment plans.
            </p>

            {/* Features */}
            <ul className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <motion.li
                  key={feature.label}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-foreground">{feature.label}</span>
                </motion.li>
              ))}
            </ul>

            {/* Form */}
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-14 rounded-full px-6 text-lg"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    className="bg-gold text-gold-foreground hover:bg-gold/90 rounded-full h-14 px-8 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Download Free Guide"
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center sm:text-left">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <motion.div
                className="flex items-center gap-4 p-6 bg-green-500/10 rounded-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    Check your email!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We've sent your free guide to {email}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
