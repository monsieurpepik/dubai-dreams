import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { useTenant } from '@/hooks/useTenant';

const Privacy = () => {
  const { tenant } = useTenant();
  const brandName = tenant?.brand_name || 'OwningDubai';
  const email = tenant?.email || 'hello@owningdubai.com';

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Privacy Policy" description={`Privacy policy for ${brandName}`} />
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-8">Privacy Policy</h1>
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              
              <h3 className="text-foreground text-lg">Information We Collect</h3>
              <p>We collect information you provide directly, such as your name, email address, phone number, and investment preferences when you submit inquiry forms, use our calculator tools, or subscribe to our newsletter.</p>

              <h3 className="text-foreground text-lg">How We Use Your Information</h3>
              <p>Your information is used to connect you with relevant property developers, provide personalized investment recommendations, send market updates you've opted into, and improve our services.</p>

              <h3 className="text-foreground text-lg">Data Sharing</h3>
              <p>We share your inquiry details only with the specific developer whose property you've expressed interest in. We do not sell your personal data to third parties.</p>

              <h3 className="text-foreground text-lg">Data Security</h3>
              <p>We use industry-standard encryption and security measures to protect your personal information. All data is stored on secure, encrypted servers.</p>

              <h3 className="text-foreground text-lg">Your Rights</h3>
              <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at {email}.</p>

              <h3 className="text-foreground text-lg">Cookies</h3>
              <p>We use essential cookies for site functionality and analytics cookies to understand how visitors use our platform. You can disable cookies in your browser settings.</p>

              <h3 className="text-foreground text-lg">Contact</h3>
              <p>For privacy-related inquiries, please contact us at {email}.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
