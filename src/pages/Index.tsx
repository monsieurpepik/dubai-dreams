import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ExclusiveSelectionsSection } from "@/components/sections/ExclusiveSelectionsSection";
import { SearchEntry } from "@/components/properties/SearchEntry";
import { QuickCategories } from "@/components/sections/QuickCategories";
import { WhyDubaiStrip } from "@/components/sections/WhyDubaiStrip";
import { EditorialStatement } from "@/components/sections/EditorialStatement";
import { OffPlanProjectsSection } from "@/components/sections/OffPlanProjectsSection";
import { TrustedDevelopersStrip } from "@/components/sections/TrustedDevelopersStrip";
import { RecentlyAddedSection } from "@/components/sections/RecentlyAddedSection";
import { LatestInsightsSection } from "@/components/sections/LatestInsightsSection";
import { HowItWorksMini } from "@/components/sections/HowItWorksMini";
import { WhyOwningDubaiSection } from "@/components/sections/WhyOwningDubaiSection";
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
        <ExclusiveSelectionsSection />
        <SearchEntry />
        <QuickCategories />
        <WhyDubaiStrip />
        <EditorialStatement />
        <OffPlanProjectsSection />
        <TrustedDevelopersStrip />
        <RecentlyAddedSection />
        <LatestInsightsSection />
        <HowItWorksMini />
        <WhyOwningDubaiSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
