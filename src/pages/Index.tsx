import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { DealFinderBanner } from "@/components/sections/DealFinderBanner";
import { ExclusiveSelectionsSection } from "@/components/sections/ExclusiveSelectionsSection";
import { RecentlyAddedSection } from "@/components/sections/RecentlyAddedSection";
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
        <ExclusiveSelectionsSection />
        <RecentlyAddedSection />
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
