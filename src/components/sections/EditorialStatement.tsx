import { motion } from 'framer-motion';

export function EditorialStatement() {
  return (
    <section className="py-24 md:py-36 bg-black border-t border-white/[0.08]">
      <div className="container-wide flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-12 h-px bg-white/30 mb-10 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(1.4rem,3.5vw,3rem)] font-light leading-[1.35] text-white"
        >
          We don't sell property.{' '}
          <span className="text-white/30">
            We advise on wealth positioned in real estate — tax-free, in the world's fastest-growing market.
          </span>
        </motion.p>
      </div>
    </section>
  );
}
