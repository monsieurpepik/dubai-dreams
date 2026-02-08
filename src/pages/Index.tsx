import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarketStatsBar } from "@/components/sections/MarketStatsBar";
import { WhyDubaiSection } from "@/components/sections/WhyDubaiSection";
import { InvestmentMathSection } from "@/components/sections/InvestmentMathSection";
import { CollectionsSection } from "@/components/sections/CollectionsSection";
import { OffPlanProjectsSection } from "@/components/sections/OffPlanProjectsSection";
import { TrustedDevelopersStrip } from "@/components/sections/TrustedDevelopersStrip";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { InvestmentQuiz } from "@/components/lead-capture/InvestmentQuiz";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { SEO } from "@/components/SEO";
import { WhatsAppButton } from "@/components/properties/WhatsAppButton";

const Index = () => {
  // Initialize smooth scroll
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Header />
      <main>
        {/* 1. Hero - Transformational headline + dual CTAs */}
        <HeroSection />
        
        {/* 2. Trust Strip - Key market stats */}
        <MarketStatsBar />
        
        {/* 3. Why Dubai - Investment case */}
        <WhyDubaiSection />
        
        {/* 4. Investment Math - Visual growth projection */}
        <InvestmentMathSection />
        
        {/* 5. Collections - Curated discovery paths */}
        <CollectionsSection />
        
        {/* 6. Featured Properties - With ROI visible */}
        <OffPlanProjectsSection />
        
        {/* 7. Developer Logos - Trust layer */}
        <TrustedDevelopersStrip />

        {/* 8. Social Proof */}
        <TestimonialsSection />
        
        {/* 9. Investment Quiz CTA */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container-wide">
            <div className="text-center mb-12">
              <span className="label-editorial text-muted-foreground mb-4 block">
                Personalized For You
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
                Find Your Match
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Answer 3 quick questions. Get curated project recommendations.
              </p>
            </div>
            <InvestmentQuiz />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
