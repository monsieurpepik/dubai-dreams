import { motion } from 'framer-motion';
import { Target, Users, Award, TrendingUp } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const teamMembers = [
  {
    name: 'Sarah Al-Rashid',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Former investment banker with 15 years in Dubai real estate.',
  },
  {
    name: 'James Mitchell',
    role: 'Head of Sales',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialist in luxury off-plan investments and Golden Visa properties.',
  },
  {
    name: 'Fatima Hassan',
    role: 'Client Relations',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    bio: 'Dedicated to ensuring seamless experiences for international buyers.',
  },
];

const stats = [
  { value: 'AED 2B+', label: 'Properties Sold' },
  { value: '500+', label: 'Happy Clients' },
  { value: '12', label: 'Years Experience' },
  { value: '50+', label: 'Developer Partners' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <p className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-4">
                About Us
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                Your Trusted Partner in Dubai Real Estate
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We help discerning investors navigate Dubai&apos;s dynamic off-plan market with expertise, transparency, and personalized service.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Target className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-luxury text-muted-foreground">
                    Our Mission
                  </span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
                  Empowering Smart Property Investment
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  At OwningDubai, we believe everyone deserves access to premium real estate opportunities. Our mission is to demystify Dubai&apos;s off-plan market, providing clear insights and curated selections that match your investment goals.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We combine deep market knowledge with genuine care for our clients, ensuring every transaction is not just successful but truly transformative.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[4/3] overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80"
                  alt="Dubai skyline"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-muted/30">
          <div className="container-wide">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="font-serif text-3xl md:text-4xl text-foreground mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-foreground" />
                </div>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded in 2012, OwningDubai began with a simple observation: international investors struggled to navigate Dubai&apos;s complex off-plan market. Too many agencies prioritized commissions over client success.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We set out to change that. Starting with just three properties and a commitment to transparency, we built relationships with Dubai&apos;s most reputable developers. Today, we represent over 50 developer partners and have helped more than 500 clients secure their ideal investments.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our approach remains unchanged: listen first, educate always, and only recommend properties we would invest in ourselves.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                What We Stand For
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Award,
                  title: 'Integrity',
                  description: 'We only recommend properties we believe in. No hidden fees, no pressure tactics.',
                },
                {
                  icon: Users,
                  title: 'Client First',
                  description: 'Your goals drive our recommendations. We succeed when you succeed.',
                },
                {
                  icon: Target,
                  title: 'Expertise',
                  description: 'Deep market knowledge backed by data, not speculation.',
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-background border border-border/50 p-8"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-6">
                    <value.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-4">
                The Team
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Meet Our Experts
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="aspect-[3/4] overflow-hidden mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
