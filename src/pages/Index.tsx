import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { SearchEntry } from "@/components/properties/SearchEntry";
import { QuickCategories } from "@/components/sections/QuickCategories";
import { EditorialStatement } from "@/components/sections/EditorialStatement";
import { OffPlanProjectsSection } from "@/components/sections/OffPlanProjectsSection";
import { RecentlyAddedSection } from "@/components/sections/RecentlyAddedSection";
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
        <SearchEntry />
        <QuickCategories />
        <EditorialStatement />
        <OffPlanProjectsSection />
        <RecentlyAddedSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
