import { motion } from 'framer-motion';
import { Star, Quote, MapPin } from 'lucide-react';
import { useRef, useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  quote: string;
  rating: number;
  investmentType: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Alexander Petrov',
    location: 'Moscow, Russia',
    role: 'Tech Entrepreneur',
    quote: 'The team at OwningDubai made my first international property investment seamless. From property selection to Golden Visa processing, they handled everything. My Dubai Marina apartment has appreciated 18% in just two years.',
    rating: 5,
    investmentType: 'Golden Visa Property',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    location: 'Singapore',
    role: 'Investment Banker',
    quote: "I was skeptical about off-plan investments, but the 60/40 payment plan made it accessible. The construction updates were regular and transparent. Now I'm seeing 8% rental yields – better than any REIT in my portfolio.",
    rating: 5,
    investmentType: 'Off-Plan Investment',
  },
  {
    id: '3',
    name: 'James & Emma Thompson',
    location: 'London, UK',
    role: 'Expat Family',
    quote: 'We relocated to Dubai and needed a family home quickly. OwningDubai found us a stunning villa in Arabian Ranches with a flexible post-handover plan. The kids love it, and we secured our residency.',
    rating: 5,
    investmentType: 'Family Residence',
  },
  {
    id: '4',
    name: 'Raj Malhotra',
    location: 'Mumbai, India',
    role: 'Serial Investor',
    quote: "This is my fourth property through OwningDubai. Their market insights are exceptional – they identified Business Bay before the boom. My portfolio has grown 40% across all holdings. Can't recommend them enough.",
    rating: 5,
    investmentType: 'Portfolio Investor',
  },
  {
    id: '5',
    name: 'Lisa van der Berg',
    location: 'Amsterdam, Netherlands',
    role: 'Architect',
    quote: 'As an architect, I appreciate quality construction. The Emaar development they recommended exceeded my expectations. The finishes are world-class, and the resale value speaks for itself.',
    rating: 5,
    investmentType: 'Premium Property',
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
        }`}
      />
    ))}
  </div>
);

export const TestimonialsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <section className="py-24 md:py-32 bg-muted/30 overflow-hidden">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <p className="text-xs font-medium uppercase tracking-luxury text-accent mb-4">
            Client Success Stories
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Trusted by investors
            <br />
            <span className="text-muted-foreground">across the globe</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join over 500 satisfied clients who have successfully invested in Dubai real estate through our platform.
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-6 mb-12"
        >
          <div className="flex items-center gap-3 bg-background/50 border border-border/50 px-5 py-3 rounded-full">
            <div className="flex -space-x-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-sm font-medium">4.9/5 Average Rating</span>
          </div>
          
          <div className="flex items-center gap-2 bg-background/50 border border-border/50 px-5 py-3 rounded-full">
            <span className="text-sm font-medium">500+ Properties Sold</span>
          </div>
          
          <div className="flex items-center gap-2 bg-background/50 border border-border/50 px-5 py-3 rounded-full">
            <span className="text-sm font-medium">AED 2B+ Transaction Value</span>
          </div>
        </motion.div>

        {/* Testimonials carousel */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[350px] md:w-[420px] bg-background border border-border/50 p-8"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-accent/20 mb-6" />

              {/* Rating */}
              <StarRating rating={testimonial.rating} />

              {/* Quote */}
              <blockquote className="text-foreground/90 leading-relaxed mt-4 mb-8 text-sm">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-lg font-serif text-accent">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              </div>

              {/* Investment type tag */}
              <div className="mt-4">
                <span className="inline-block text-xs uppercase tracking-wider text-accent/80 bg-accent/5 px-3 py-1.5 border border-accent/20">
                  {testimonial.investmentType}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll hint */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          ← Drag to explore more stories →
        </p>
      </div>
    </section>
  );
};
