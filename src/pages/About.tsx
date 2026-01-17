import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';

const principles = [
  {
    title: 'Transparency Over Tactics',
    description: 'Every price, timeline, and projection comes from verified sources. No hidden fees, no pressure.',
  },
  {
    title: 'Data Over Hype',
    description: 'Market intelligence replaces marketing speak. Decisions informed by facts, not feelings.',
  },
  {
    title: 'Guidance Over Pressure',
    description: 'Information flows freely. Contact happens when you are ready, not when we are.',
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="About"
        description="Owning is a real estate intelligence platform. We help international investors discover, evaluate, and understand off-plan property opportunities."
        url="https://owningdubai.com/about"
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 md:py-32">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <p className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-4">
                About
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                Real Estate Intelligence
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A platform for discovering and understanding off-plan property opportunities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Platform Vision */}
        <section className="py-16 md:py-24 border-t border-border/30">
          <div className="container-wide">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
                  What We're Building
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Buying property in a new market is difficult. Information is fragmented, pricing is opaque, and most platforms are designed to capture leads rather than inform decisions.
                  </p>
                  <p>
                    Owning exists to change that. We curate verified off-plan projects, provide market context that matters, and offer tools to evaluate affordability—all before any contact is required.
                  </p>
                  <p>
                    The goal is simple: enable confident property decisions through transparency, data, and calm presentation.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                How It Works
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: '01',
                  title: 'Discover',
                  description: 'Browse curated off-plan projects. Each listing includes verified pricing, delivery timelines, and developer information.',
                },
                {
                  step: '02',
                  title: 'Evaluate',
                  description: 'Understand market context for each area. See price trends, compare to similar properties, and estimate monthly payments.',
                },
                {
                  step: '03',
                  title: 'Connect',
                  description: 'When ready, request project details or schedule a consultation. No pressure, no obligation.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <span className="text-xs text-muted-foreground tracking-luxury">
                    {item.step}
                  </span>
                  <h3 className="font-serif text-xl text-foreground mt-2 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Platform Principles
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border-t border-border/50 pt-6"
                >
                  <h3 className="font-serif text-xl text-foreground mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 border-t border-border/30">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
                Explore Current Projects
              </h2>
              <p className="text-muted-foreground mb-8">
                Browse verified off-plan opportunities across premium locations.
              </p>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm transition-opacity hover:opacity-90"
              >
                View Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
