import { motion } from 'framer-motion';

const propositions = [
  {
    title: 'Exclusive Territory',
    description: 'One agency. One domain. Complete market ownership on a premium exact-match domain.',
    number: '01',
  },
  {
    title: 'Verified Listings',
    description: 'Every property vetted through trusted developers and RERA-regulated agencies.',
    number: '02',
  },
  {
    title: 'Market Intelligence',
    description: 'AI-powered insights on pricing, yields, and growth across every Dubai neighbourhood.',
    number: '03',
  },
  {
    title: 'Personal Shopper',
    description: 'Tell us your criteria. Our advisors curate a private selection matched to your investment goals.',
    number: '04',
  },
];

export function ValuePropositions() {
  return (
    <section className="bg-black py-20 md:py-28 border-t border-white/[0.06]">
      <div className="container-wide">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-16 md:mb-20"
        >
          Why Owning Dubai
        </motion.p>

        {/* Rows */}
        <div className="space-y-0">
          {propositions.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-white/[0.06] py-10 md:py-14 group"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-16">
                <span className="text-[11px] tracking-[0.2em] text-white/15 font-medium shrink-0 w-12">
                  {prop.number}
                </span>
                <h3 className="text-2xl md:text-4xl lg:text-[3.2rem] font-light text-white/80 leading-tight flex-1 group-hover:text-white transition-colors duration-500"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                  {prop.title}
                </h3>
                <p className="text-[13px] text-white/30 font-light leading-relaxed max-w-xs md:text-right group-hover:text-white/50 transition-colors duration-500">
                  {prop.description}
                </p>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-white/[0.06]" />
        </div>
      </div>
    </section>
  );
}
