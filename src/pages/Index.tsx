import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WebflowHero } from "@/components/sections/WebflowHero";
import { CategoryCards } from "@/components/sections/CategoryCards";
import { ValuePropositions } from "@/components/sections/ValuePropositions";
import { ExclusiveSelectionsSection } from "@/components/sections/ExclusiveSelectionsSection";
import { EditorialStatement } from "@/components/sections/EditorialStatement";
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
        <CategoryCards />
        <ValuePropositions />
        <ExclusiveSelectionsSection />
        <EditorialStatement />
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
