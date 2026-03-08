import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Target, Zap } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const features = [
  { icon: Target, label: 'AI-Scored Deals', desc: 'Every property rated 0–100' },
  { icon: BarChart3, label: 'Fair Value Analysis', desc: 'Know if the price is right' },
  { icon: Zap, label: 'Deal Radar Alerts', desc: 'Get notified on undervalued finds' },
];

export function DealFinderBanner() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-16 md:py-24 border-b border-border/30">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-xl bg-foreground text-primary-foreground p-8 md:p-12 lg:p-16">
          {/* Subtle grain texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')] pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16">
            {/* Left — Copy */}
            <div className="flex-1 max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-[10px] tracking-[0.3em] text-primary-foreground/40 uppercase mb-4"
              >
                New — AI Deal Matching
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.15] tracking-wide"
              >
                Stop browsing.
                <br />
                <span className="text-primary-foreground/50">Start finding deals.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 text-sm text-primary-foreground/50 leading-relaxed max-w-md"
              >
                Describe your ideal investment in 5 questions. Our AI scores every property
                by deal value, yield potential, and market positioning — so you see the
                opportunities before everyone else.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                <Link
                  to="/discover"
                  className="inline-flex items-center gap-2 mt-8 px-7 py-3 bg-primary-foreground text-foreground text-xs font-medium uppercase tracking-[0.15em] rounded-xl hover:opacity-90 transition-opacity"
                >
                  Find Your Deal
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>

            {/* Right — Feature pills */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col gap-3 lg:w-[280px] shrink-0"
            >
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: 15 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/[0.06] border border-primary-foreground/[0.08]"
                  >
                    <Icon className="w-4.5 h-4.5 text-primary-foreground/40 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-primary-foreground/90">{f.label}</p>
                      <p className="text-[11px] text-primary-foreground/40 mt-0.5">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
