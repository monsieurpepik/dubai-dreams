import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyDubaiSection } from "@/components/sections/WhyDubaiSection";
import { OffPlanProjectsSection } from "@/components/sections/OffPlanProjectsSection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const Index = () => {
  // Initialize smooth scroll
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <WhyDubaiSection />
        <OffPlanProjectsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
