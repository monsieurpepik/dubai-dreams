import { motion } from 'framer-motion';

export function EditorialStatement() {
  return (
    <section className="py-32 md:py-44 lg:py-56 bg-background">
      <div className="container-wide">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-3xl md:text-5xl lg:text-6xl font-light leading-[1.25] text-foreground max-w-4xl"
        >
          We do not sell property.{' '}
          <span className="text-muted-foreground">
            We advise on wealth positioned in real estate — tax-free, in the world's fastest-growing market.
          </span>
        </motion.p>
      </div>
    </section>
  );
}
