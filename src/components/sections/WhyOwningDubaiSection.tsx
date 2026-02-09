import { motion } from 'framer-motion';

const pillars = [
  {
    title: 'Curated, Not Listed',
    body: "Every project on this platform has passed a credibility and design threshold. We don't list — we select.",
  },
  {
    title: 'Data Without Noise',
    body: 'Market intelligence presented like an investment memo. No hype, no urgency — just the numbers that matter.',
  },
  {
    title: 'Discretion First',
    body: 'No popups, no spam, no agents calling at midnight. Your privacy is not negotiable.',
  },
];

export const WhyOwningDubaiSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background border-t border-border/20">
      <div className="container-wide">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-16"
        >
          Why OwningDubai
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h3 className="font-serif text-lg text-foreground mb-3">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
