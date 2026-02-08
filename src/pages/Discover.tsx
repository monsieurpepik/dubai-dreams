import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InvestmentQuiz } from "@/components/lead-capture/InvestmentQuiz";
import { SEO } from "@/components/SEO";

const Discover = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Header />
      <main className="pt-20 md:pt-24">
        <section className="py-20 md:py-32 lg:py-40">
          <div className="container-wide">
            <div className="text-center mb-16 md:mb-20">
              <h1 className="font-serif text-foreground mb-4">Find your match</h1>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                Three questions. Curated recommendations.
              </p>
            </div>
            <InvestmentQuiz />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Discover;
