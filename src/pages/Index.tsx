import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { OpportunitySection } from "@/components/sections/OpportunitySection";
import { MathematicsSection } from "@/components/sections/MathematicsSection";
import { PropertiesSection } from "@/components/sections/PropertiesSection";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { GuideSection } from "@/components/sections/GuideSection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const Index = () => {
  // Initialize smooth scroll
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <OpportunitySection />
        <MathematicsSection />
        <PropertiesSection />
        <CalculatorSection />
        <GuideSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;