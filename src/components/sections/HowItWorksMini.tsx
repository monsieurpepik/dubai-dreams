import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, FileCheck, Key, ArrowRight } from 'lucide-react';

const steps = [
  { icon: Search, number: '01', title: 'Discover', description: 'Browse verified off-plan projects from Dubai\'s top developers' },
  { icon: FileCheck, number: '02', title: 'Reserve', description: 'Secure your unit with a small deposit — no mortgage required' },
  { icon: Key, number: '03', title: 'Own', description: 'Pay in installments during construction, receive keys at handover' },
];

export const HowItWorksMini = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section ref={ref} className="py-16 md:py-24 border-y border-border/10">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">For first-time buyers</p>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground">How off-plan works</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-16 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center"
            >
              <step.icon className="w-6 h-6 mx-auto mb-4 text-muted-foreground/50" strokeWidth={1.5} />
              <p className="text-[10px] tracking-[0.15em] text-muted-foreground/50 mb-2">{step.number}</p>
              <h3 className="font-serif text-lg text-foreground mb-2">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span>Read the full guide</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
