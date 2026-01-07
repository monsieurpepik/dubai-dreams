import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check, FileText, BookOpen, Calculator, Shield, MapPin, Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MagneticButton } from "@/components/ui/MagneticButton";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bookRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]);
  const bookRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);

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
    <section 
      id="guide" 
      ref={containerRef}
      className="relative section-padding-lg bg-background overflow-hidden"
    >
      {/* Spotlight effect - Electric blue */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.15) 0%, transparent 60%)" }}
      />

      <div ref={ref} className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Book Mockup - Chrome edges, floating */}
          <motion.div
            className="relative flex justify-center order-2 lg:order-1"
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <div className="relative" style={{ perspective: "1000px" }}>
              {/* Book Shadow */}
              <div className="absolute inset-0 bg-black/50 blur-[80px] translate-y-16 scale-90" />
              
              {/* Book Cover - Sharp edges, metallic */}
              <motion.div
                className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 p-10 lg:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
                style={{
                  rotateY: bookRotateY,
                  rotateX: bookRotateX,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Chrome edge effect */}
                <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px hsl(var(--accent) / 0.2)" }} />
                
                {/* Spine Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/30 to-transparent" />
                
                <div className="w-64 lg:w-80 text-background">
                  <div className="mb-10">
                    <span className="inline-block bg-accent text-accent-foreground text-xs font-medium px-3 py-1.5 uppercase tracking-widest">
                      Free Guide
                    </span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-extralight mb-6 leading-tight tracking-tight">
                    Dubai Off-Plan<br />Buyer's Guide
                  </h3>
                  <p className="text-background/40 text-sm mb-10 leading-relaxed font-light">
                    Everything you need to know before investing in Dubai real estate
                  </p>
                  <div className="flex items-center gap-3 text-xs text-background/30 uppercase tracking-widest">
                    <span>OwningDubai</span>
                    <span>·</span>
                    <span>2026</span>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-8 right-8 w-16 h-16">
                  <div className="absolute bottom-0 right-0 w-full h-px bg-background/10" />
                  <div className="absolute bottom-0 right-0 w-px h-full bg-background/10" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <motion.p
              className="text-accent text-xs uppercase tracking-[0.3em] mb-6"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Free Download
            </motion.p>
            
            <h2 className="mb-8">
              Dubai Off-Plan<br />
              <span className="text-muted-foreground">Buyer's Guide </span>
              <span className="text-accent">2026</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-10 max-w-lg font-light">
              Your comprehensive guide to navigating Dubai's off-plan property market.
            </p>

            {/* Features */}
            <ul className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <motion.li
                  key={feature.label}
                  className="flex items-center gap-4 group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                >
                  <div className="w-10 h-10 bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-500">
                    <feature.icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-foreground text-sm">{feature.label}</span>
                </motion.li>
              ))}
            </ul>

            {/* Form - Dark with metallic border */}
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-14 px-6 text-base bg-card/50 border-border/30 focus:border-accent focus:ring-accent/20 placeholder:text-muted-foreground/50"
                    disabled={isSubmitting}
                  />
                  <MagneticButton
                    className="btn-metallic h-14 px-8 whitespace-nowrap text-sm uppercase tracking-wider"
                    onClick={() => {}}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Download
                        <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                      </>
                    )}
                  </MagneticButton>
                </div>
                <p className="text-xs text-metallic">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <motion.div
                className="flex items-center gap-4 p-6 bg-green-500/10 border border-green-500/20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-12 h-12 bg-green-500 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-400">
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