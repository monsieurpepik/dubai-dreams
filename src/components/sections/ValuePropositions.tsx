import { motion } from 'framer-motion';

const propositions = [
  {
    title: 'The Taste of Luxury',
    description: 'Experience the pinnacle of luxury, handpicked from the most prestigious sources in Dubai.',
    number: '01',
  },
  {
    title: 'Verified by the Best',
    description: 'Every property is carefully vetted through trusted luxury partners and top-tier developers.',
    number: '02',
  },
  {
    title: 'Unmatched Value',
    description: 'We work exclusively with top real estate agencies to bring you only the finest offerings at the best terms.',
    number: '03',
  },
  {
    title: 'Curated for You',
    description: 'Tailored to your desires, sourced directly from leading developers and agencies to exceed your expectations.',
    number: '04',
  },
];

export function ValuePropositions() {
  return (
    <section className="bg-black py-20 md:py-28 border-t border-white/10">
      <div className="container-wide">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-16 md:mb-20"
        >
          Why Owning Dubai
        </motion.p>

        {/* Propositions — GSAP line-up animation style */}
        <div className="space-y-0">
          {propositions.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-white/10 py-10 md:py-14 group"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-16">
                {/* Number */}
                <span className="text-[11px] tracking-[0.2em] text-white/20 font-medium shrink-0 w-12">
                  {prop.number}
                </span>

                {/* Title */}
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-light text-white leading-tight flex-1 group-hover:text-white/80 transition-colors duration-500"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                  {prop.title}
                </h3>

                {/* Description */}
                <p className="text-[14px] text-white/40 font-light leading-relaxed max-w-sm md:text-right group-hover:text-white/60 transition-colors duration-500">
                  {prop.description}
                </p>
              </div>
            </motion.div>
          ))}
          {/* Final border */}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  );
}
