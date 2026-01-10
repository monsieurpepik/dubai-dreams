import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyDubaiSection } from "@/components/sections/WhyDubaiSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { OffPlanProjectsSection } from "@/components/sections/OffPlanProjectsSection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { SEO } from "@/components/SEO";

const Index = () => {
  // Initialize smooth scroll
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Header />
      <main>
        <HeroSection />
        <WhyDubaiSection />
        <TestimonialsSection />
        <OffPlanProjectsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
