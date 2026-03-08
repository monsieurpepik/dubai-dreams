import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { EditorialStatement } from "@/components/sections/EditorialStatement";
import { HowItWorksMini } from "@/components/sections/HowItWorksMini";
import { ExclusiveSelectionsSection } from "@/components/sections/ExclusiveSelectionsSection";
import { WhyDubaiStrip } from "@/components/sections/WhyDubaiStrip";
import { ThemedCollections } from "@/components/sections/ThemedCollections";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PrivateAdvisorSection } from "@/components/sections/PrivateAdvisorSection";
import { LatestInsightsSection } from "@/components/sections/LatestInsightsSection";
import { TrustedDevelopersStrip } from "@/components/sections/TrustedDevelopersStrip";
import { BackToTop } from "@/components/ui/BackToTop";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { SEO } from "@/components/SEO";

const Index = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <EditorialStatement />
        <HowItWorksMini />
        <ExclusiveSelectionsSection />
        <WhyDubaiStrip />
        <ThemedCollections />
        <TrustedDevelopersStrip />
        <TestimonialsSection />
        <PrivateAdvisorSection />
        <LatestInsightsSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
