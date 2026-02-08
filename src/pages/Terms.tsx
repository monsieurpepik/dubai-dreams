import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { useTenant } from '@/hooks/useTenant';

const Terms = () => {
  const { tenant } = useTenant();
  const brandName = tenant?.brand_name || 'OwningDubai';
  const email = tenant?.email || 'hello@owningdubai.com';
  const regulatoryBody = tenant?.regulatory_body || 'RERA';

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Terms of Service" description={`Terms of service for ${brandName}`} />
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-8">Terms of Service</h1>
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

              <h3 className="text-foreground text-lg">About {brandName}</h3>
              <p>{brandName} is a property marketplace platform that connects international investors with {regulatoryBody}-registered developers offering off-plan projects. We act as an information and connection platform, not as a real estate broker or financial advisor.</p>

              <h3 className="text-foreground text-lg">Investment Information</h3>
              <p>All ROI estimates, market data, and financial projections displayed on this platform are indicative only and based on historical market performance. They do not constitute financial advice. Past performance does not guarantee future returns. We strongly recommend consulting with a qualified financial advisor before making any investment decisions.</p>

              <h3 className="text-foreground text-lg">Property Listings</h3>
              <p>Property information, pricing, availability, and payment plans are provided by developers and are subject to change without notice. {brandName} makes reasonable efforts to ensure accuracy but does not guarantee the completeness or accuracy of listing information.</p>

              <h3 className="text-foreground text-lg">User Responsibilities</h3>
              <p>By using this platform, you agree to provide accurate information in inquiry forms, conduct your own due diligence on any property investment, and comply with applicable laws and regulations in your jurisdiction.</p>

              <h3 className="text-foreground text-lg">Limitation of Liability</h3>
              <p>{brandName} shall not be liable for any investment losses, inaccuracies in developer-provided information, or any damages arising from the use of this platform.</p>

              <h3 className="text-foreground text-lg">Governing Law</h3>
              <p>These terms are governed by the laws of the United Arab Emirates and the Emirate of Dubai.</p>

              <h3 className="text-foreground text-lg">Contact</h3>
              <p>For questions about these terms, contact us at {email}.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
