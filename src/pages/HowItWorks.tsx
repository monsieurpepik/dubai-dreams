import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  FileCheck, 
  Wallet, 
  Building2, 
  Key, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

const timelineSteps = [
  {
    number: '01',
    icon: Search,
    title: 'Discovery',
    duration: '1-2 weeks',
    description: 'Browse curated off-plan projects. We help you understand market dynamics, developer track records, and projected returns.',
    details: [
      'Define investment goals and budget',
      'Review curated project recommendations',
      'Understand payment plan options'
    ]
  },
  {
    number: '02',
    icon: FileCheck,
    title: 'Reservation',
    duration: '1-3 days',
    description: 'Secure your unit with a reservation fee. This takes the property off the market while paperwork is prepared.',
    details: [
      'Pay refundable reservation fee (AED 5-50K)',
      'Select specific unit and floor',
      'Receive reservation confirmation'
    ]
  },
  {
    number: '03',
    icon: Wallet,
    title: 'Booking & SPA',
    duration: '2-4 weeks',
    description: 'Sign the Sales Purchase Agreement and pay the booking deposit. This is your binding commitment.',
    details: [
      'Pay 10-20% booking deposit',
      'Sign Sales Purchase Agreement (SPA)',
      'SPA registered with Dubai Land Department'
    ]
  },
  {
    number: '04',
    icon: Building2,
    title: 'Construction Phase',
    duration: '2-4 years',
    description: 'Pay installments as construction progresses. Your property appreciates while you pay over time.',
    details: [
      'Payments linked to construction milestones',
      'Typically 30-50% paid during construction',
      'Track progress through developer updates'
    ]
  },
  {
    number: '05',
    icon: Key,
    title: 'Handover',
    duration: 'Upon completion',
    description: 'Pay the final amount and receive your keys. Many buyers arrange mortgages for this final payment.',
    details: [
      'Final inspection and snagging',
      'Pay remaining balance (or via mortgage)',
      'Receive title deed and keys'
    ]
  }
];

const faqs = [
  {
    question: 'Can foreigners buy property in Dubai?',
    answer: 'Yes. Non-UAE residents can purchase freehold property in designated areas, which includes most major developments. There are no restrictions on nationality, and the process is straightforward with proper documentation.'
  },
  {
    question: 'What are the typical payment plans?',
    answer: 'Most off-plan projects offer flexible payment plans spread over the construction period. Common structures include 60/40 (60% during construction, 40% on handover), 50/50, or extended post-handover plans where you continue paying after receiving keys.'
  },
  {
    question: 'Do I need to be in Dubai to buy?',
    answer: 'No. The entire process can be completed remotely through power of attorney. We can guide you through appointing a representative and handling documentation digitally.'
  },
  {
    question: 'What additional costs should I budget for?',
    answer: 'Budget for: 4% Dubai Land Department registration fee, approximately 2% for admin and service fees, and if using a mortgage, bank arrangement fees. No stamp duty or capital gains tax applies in Dubai.'
  },
  {
    question: 'Can I get a mortgage for off-plan property?',
    answer: 'Yes, but with conditions. UAE banks typically offer mortgages once construction reaches 50% completion. Until then, you pay from your own funds. On handover, you can finance the remaining balance (usually 50-80% of property value for residents, 50% for non-residents).'
  },
  {
    question: 'What happens if the developer delays completion?',
    answer: 'Reputable developers factor in reasonable buffers. If delays exceed the SPA terms, you may be entitled to compensation or cancellation with refund. Dubai\'s Real Estate Regulatory Authority (RERA) provides buyer protections.'
  },
  {
    question: 'Can I sell before handover?',
    answer: 'Yes. Most developers allow resale after a certain payment threshold (typically 30-40% paid). You can sell your contract to another buyer, often at a premium if the market has appreciated.'
  },
  {
    question: 'What is a Golden Visa and how do I qualify?',
    answer: 'The UAE Golden Visa grants 10-year residency to property investors. You qualify by purchasing property worth AED 2 million or more. Off-plan purchases count toward this threshold once the SPA is registered.'
  }
];

export default function HowItWorks() {
  return (
    <>
      <SEO 
        title="How It Works | Off-Plan Buying Process"
        description="Step-by-step guide to buying off-plan property in Dubai. Understand the timeline, payments, and what to expect at each stage."
      />
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="section-padding-lg bg-secondary/30">
          <div className="container-custom">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-6">
                The Process
              </p>
              <h1 className="mb-6">
                From Discovery to Keys
              </h1>
              <p className="text-muted-foreground text-lg font-light leading-relaxed">
                Buying off-plan in Dubai is straightforward when you understand the steps. 
                Here's exactly what happens, when payments are due, and what to expect.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section-padding-lg">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              {timelineSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className="relative"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Connector Line */}
                  {index < timelineSteps.length - 1 && (
                    <div className="absolute left-6 top-20 bottom-0 w-px bg-border md:left-12" />
                  )}
                  
                  <div className="flex gap-6 md:gap-10 pb-16 last:pb-0">
                    {/* Icon Circle */}
                    <div className="relative z-10 shrink-0">
                      <div className="w-12 h-12 md:w-24 md:h-24 bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <step.icon className="w-5 h-5 md:w-8 md:h-8 text-accent" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-1 md:pt-4">
                      <div className="flex items-baseline gap-4 mb-3">
                        <span className="text-accent text-xs font-medium tracking-wider">
                          STEP {step.number}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {step.duration}
                        </span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-light mb-3 tracking-wide">
                        {step.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-5 leading-relaxed">
                        {step.description}
                      </p>
                      
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <span className="w-1 h-1 bg-accent mt-2 shrink-0" />
                            <span className="text-foreground/80">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-accent/5 border-y border-accent/10">
          <div className="container-custom">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h3 className="text-xl md:text-2xl font-light mb-2">
                  Ready to see the numbers?
                </h3>
                <p className="text-muted-foreground">
                  Use our calculator to understand your investment potential.
                </p>
              </div>
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Calculate Returns
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding-lg">
          <div className="container-custom">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-10">
                <HelpCircle className="w-5 h-5 text-accent" />
                <h2 className="text-2xl md:text-3xl font-light">
                  Common Questions
                </h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-border/50 bg-card/30 px-6 data-[state=open]:bg-card/50 transition-colors"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5">
                      <span className="font-medium text-foreground pr-4">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <motion.div
              className="text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-light mb-4">
                Have more questions?
              </h2>
              <p className="text-muted-foreground mb-8">
                Our team is here to guide you through every step of your investment journey.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 text-sm font-medium hover:bg-foreground/5 transition-colors"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
