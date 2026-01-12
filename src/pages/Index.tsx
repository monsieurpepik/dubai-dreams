import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyDubaiSection } from "@/components/sections/WhyDubaiSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { OffPlanProjectsSection } from "@/components/sections/OffPlanProjectsSection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { SEO } from "@/components/SEO";
import { TrustSignals } from "@/components/properties/TrustSignals";
import { WhatsAppButton } from "@/components/properties/WhatsAppButton";

const Index = () => {
  // Initialize smooth scroll
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Header />
      <main>
        <HeroSection />
        {/* Trust Signals - Social Proof */}
        <section className="py-12 bg-muted/30 border-y border-border/30">
          <div className="container-wide">
            <TrustSignals variant="full" />
          </div>
        </section>
        <WhyDubaiSection />
        <TestimonialsSection />
        <OffPlanProjectsSection />
        <NewsletterSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
