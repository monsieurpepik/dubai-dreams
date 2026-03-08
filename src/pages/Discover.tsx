import { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { IntentBuilder, type InvestorIntent } from '@/components/demand/IntentBuilder';
import { DealDashboard } from '@/components/demand/DealDashboard';

const Discover = () => {
  const [intent, setIntent] = useState<InvestorIntent | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Deal Finder — AI-Powered Property Matching | OwningDubai"
        description="Describe your ideal investment and let AI find the best property deals in Dubai. Scored by deal value, yield, and market intelligence."
      />
      <Header />
      <main className="pt-20 md:pt-24">
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container-wide">
            {!intent ? (
              <>
                <div className="text-center mb-16">
                  <p className="text-[10px] tracking-[0.35em] text-muted-foreground/60 mb-4 uppercase">
                    AI-Powered Deal Matching
                  </p>
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-light mb-4">
                    Find your perfect deal
                  </h1>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Five questions. AI-scored results. The best investment opportunities in Dubai.
                  </p>
                </div>
                <IntentBuilder onComplete={setIntent} />
              </>
            ) : (
              <DealDashboard intent={intent} onBack={() => setIntent(null)} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Discover;
