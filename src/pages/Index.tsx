import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { DealFinderBanner } from "@/components/sections/DealFinderBanner";
import { MarketStatsBar } from "@/components/sections/MarketStatsBar";
import { ExclusiveSelectionsSection } from "@/components/sections/ExclusiveSelectionsSection";
import { WhyDubaiSection } from "@/components/sections/WhyDubaiSection";
import { RecentlyAddedSection } from "@/components/sections/RecentlyAddedSection";
import { MarketPulseSection } from "@/components/sections/MarketPulseSection";
import { EditorialStatement } from "@/components/sections/EditorialStatement";
import { PrivateAdvisorSection } from "@/components/sections/PrivateAdvisorSection";
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
        <DealFinderBanner />
        <MarketStatsBar />
        <ExclusiveSelectionsSection />
        <WhyDubaiSection />
        <RecentlyAddedSection />
        <MarketPulseSection />
        <EditorialStatement />
        <div id="advisor-section">
          <PrivateAdvisorSection />
        </div>
      </main>
      <Footer />
      <BackToTop />
      <HomeMobileCTA />
    </div>
  );
};

export default Index;
