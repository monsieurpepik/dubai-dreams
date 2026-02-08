import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { EditorialStatement } from "@/components/sections/EditorialStatement";
import { OffPlanProjectsSection } from "@/components/sections/OffPlanProjectsSection";
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
        <EditorialStatement />
        <OffPlanProjectsSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
