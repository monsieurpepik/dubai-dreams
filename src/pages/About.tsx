import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { useTenant } from '@/hooks/useTenant';

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

const steps = [
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
];

const About = () => {
  const { tenant } = useTenant();
  const regulatoryBody = tenant?.regulatory_body;
  const regulatoryNumber = tenant?.regulatory_number;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About"
        description="Owning is a real estate intelligence platform. We help international investors discover, evaluate, and understand off-plan property opportunities."
        url="https://owningdubai.com/about"
      />
      <Header />
      <main>
        {/* Cinematic Hero */}
        <section className="relative h-[60vh] min-h-[450px] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/hero-dubai-skyline.jpeg"
              alt="Dubai skyline at dusk"
              className="w-full h-full object-cover scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/20" />
          </div>

          <div className="relative container-wide pb-14 md:pb-20 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-background/50 mb-3">
                About
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background mb-4">
                Real Estate
                <br />
                Intelligence
              </h1>
              <p className="text-background/50 text-sm leading-relaxed max-w-lg">
                A platform for discovering and understanding off-plan property opportunities — built on transparency, data, and calm presentation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Platform Vision — editorial split */}
        <section className="py-20 md:py-32">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                  What We're Building
                </h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="space-y-6 text-muted-foreground leading-relaxed"
              >
                <p>
                  Buying property in a new market is difficult. Information is fragmented, pricing is opaque, and most platforms are designed to capture leads rather than inform decisions.
                </p>
                <p>
                  Owning exists to change that. We curate verified off-plan projects, provide market context that matters, and offer tools to evaluate affordability — all before any contact is required.
                </p>
                <p>
                  The goal is simple: enable confident property decisions through transparency, data, and calm presentation.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works — glassmorphic cards on dark background */}
        <section className="py-20 md:py-28 bg-foreground">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14"
            >
              <h2 className="font-serif text-3xl md:text-4xl text-background">
                How It Works
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-sm p-8 md:p-10"
                >
                  <span className="text-xs text-background/30 tracking-[0.2em] font-serif">
                    {item.step}
                  </span>
                  <h3 className="font-serif text-xl text-background mt-3 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm text-background/50 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-20 md:py-28">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14"
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
                  className="border-t border-border/30 pt-8"
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

        {/* CTA — cinematic band */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/hero-dubai-skyline.jpeg"
              alt="Dubai"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/85" />
          </div>
          <div className="relative container-wide z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <h2 className="font-serif text-3xl md:text-4xl text-background mb-6">
                Explore Current Projects
              </h2>
              <p className="text-background/50 mb-8 text-sm leading-relaxed">
                Browse verified off-plan opportunities across premium locations.
              </p>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-background text-foreground text-xs font-serif tracking-widest uppercase transition-opacity hover:opacity-90"
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
