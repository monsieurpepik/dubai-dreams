import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WebflowHero } from "@/components/sections/WebflowHero";
import { OffPlanSection } from "@/components/sections/OffPlanSection";
import { EditorialStatement } from "@/components/sections/EditorialStatement";
import { InsightsSection } from "@/components/sections/InsightsSection";
import { PrivateAdvisorSection } from "@/components/sections/PrivateAdvisorSection";
import { BackToTop } from "@/components/ui/BackToTop";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <SEO />
      <Header />
      <main>
        <WebflowHero />
        <OffPlanSection />
        <EditorialStatement />
        <InsightsSection />
        <div id="advisor-section">
          <PrivateAdvisorSection />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
