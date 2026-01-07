import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Coins, Calendar, Building, ArrowRight } from "lucide-react";

export function MathematicsSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="section-padding-lg bg-background" id="mathematics">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4">The mathematics of ownership</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Traditional ownership requires everything upfront. Off-plan ownership spreads the cost, making premium property accessible.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Traditional Ownership */}
          <motion.div
            className="bg-secondary rounded-3xl p-8 lg:p-12"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-muted-foreground/20 flex items-center justify-center">
                <Coins className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-medium">Traditional ownership</h3>
                <p className="text-sm text-muted-foreground">Pay everything upfront</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm mb-2">Required today</p>
                <p className="text-5xl md:text-6xl font-light text-muted-foreground">
                  AED 1.5M
                </p>
                <p className="text-muted-foreground mt-2">100% upfront</p>
              </div>

              <div className="border-t border-border pt-6">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    Full price on day one
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    Ties up all capital
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    Limited opportunity for growth
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Off-Plan Ownership */}
          <motion.div
            className="bg-card rounded-3xl p-8 lg:p-12 border-2 border-gold relative overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Recommended Badge */}
            <div className="absolute top-0 right-0 bg-gold text-gold-foreground text-xs font-medium px-4 py-1.5 rounded-bl-2xl">
              Recommended
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center">
                <Building className="w-7 h-7 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-medium">Off-plan ownership</h3>
                <p className="text-sm text-muted-foreground">Pay as it's built</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Payment Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gold/10 rounded-2xl">
                  <div>
                    <p className="text-sm text-muted-foreground">Today</p>
                    <p className="text-2xl font-medium text-gold">AED 150K</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">10% deposit</p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary rounded-2xl">
                  <div>
                    <p className="text-sm text-muted-foreground">During construction</p>
                    <p className="text-2xl font-medium">AED 6,250<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">10% over 24mo</p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary rounded-2xl">
                  <div>
                    <p className="text-sm text-muted-foreground">On handover</p>
                    <p className="text-2xl font-medium">AED 1.2M</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Via mortgage</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    Start with just 10%
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    Flexible payment over 2-3 years
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    Property value grows during construction
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Message */}
        <motion.div
          className="text-center mt-16 md:mt-24"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-light">
            Own <span className="text-gold font-normal">100%</span>. Pay{" "}
            <span className="text-gold font-normal">20%</span> over 3 years.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
