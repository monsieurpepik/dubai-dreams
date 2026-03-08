import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { DealFinderBanner } from "@/components/sections/DealFinderBanner";
import { EditorialStatement } from "@/components/sections/EditorialStatement";
import { HowItWorksMini } from "@/components/sections/HowItWorksMini";
import { ExclusiveSelectionsSection } from "@/components/sections/ExclusiveSelectionsSection";
import { RecentlyAddedSection } from "@/components/sections/RecentlyAddedSection";
import { WhyDubaiStrip } from "@/components/sections/WhyDubaiStrip";
import { MarketPulseSection } from "@/components/sections/MarketPulseSection";
import { ThemedCollections } from "@/components/sections/ThemedCollections";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PrivateAdvisorSection } from "@/components/sections/PrivateAdvisorSection";
import { LatestInsightsSection } from "@/components/sections/LatestInsightsSection";
import { TrustedDevelopersStrip } from "@/components/sections/TrustedDevelopersStrip";
import { HomeSEOContent } from "@/components/sections/HomeSEOContent";
import { HomeMobileCTA } from "@/components/sections/HomeMobileCTA";
import { BackToTop } from "@/components/ui/BackToTop";
import { SEO } from "@/components/SEO";

const Index = () => {

  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <DealFinderBanner />
        <EditorialStatement />
        <HowItWorksMini />
        <ExclusiveSelectionsSection />
        <RecentlyAddedSection />
        <WhyDubaiStrip />
        <MarketPulseSection />
        <ThemedCollections />
        <TrustedDevelopersStrip />
        <TestimonialsSection />
        <div id="advisor-section">
          <PrivateAdvisorSection />
        </div>
        <LatestInsightsSection />
        <HomeSEOContent />
      </main>
      <Footer />
      <BackToTop />
      <HomeMobileCTA />
    </div>
  );
};

export default Index;
