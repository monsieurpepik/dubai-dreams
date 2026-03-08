import { Link } from "react-router-dom";
import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { useTenant } from "@/hooks/useTenant";
import { toast } from "sonner";

const explore = [
  { label: 'Deal Finder', href: '/discover' },
  { label: 'All Properties', href: '/properties' },
  { label: 'Mortgage Calculator', href: '/calculator' },
  { label: 'Saved Properties', href: '/saved' },
];

const popularSearches = [
  { label: 'Studios under AED 1M', href: '/properties?priceRange=0-1000000&bedrooms=0' },
  { label: '3BR in Dubai Marina', href: '/properties?area=dubai-marina&bedrooms=3' },
  { label: 'Golden Visa Properties', href: '/properties?goldenVisa=true' },
  { label: 'Waterfront Apartments', href: '/properties?collection=waterfront' },
  { label: 'Handover 2025', href: '/properties?handover=2025' },
  { label: 'Off-plan under AED 2M', href: '/properties?priceRange=0-2000000' },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase mb-5 font-medium">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.href}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { tenant } = useTenant();
  const brandName = tenant?.brand_name || 'OwningDubai';
  const contactPhone = tenant?.phone;
  const contactEmail = tenant?.email || 'hello@owningdubai.com';
  const regulatoryBody = tenant?.regulatory_body;
  const regulatoryNumber = tenant?.regulatory_number;
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed successfully');
    setEmail('');
  };

  return (
    <footer className="bg-background border-t border-border/30">
      {/* Newsletter Row */}
      <div className="container-wide py-14 md:py-16 border-b border-border/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl md:text-2xl text-foreground font-light">
              Stay Informed
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Market intelligence and new launches, delivered weekly.
            </p>
          </div>
          <form onSubmit={handleNewsletter} className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 md:w-64 px-4 py-3 bg-secondary border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              required
            />
            <button type="submit" className="btn-primary !py-3 whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Contact Row */}
      <div className="container-wide py-8 border-b border-border/30">
        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          {contactPhone && (
            <a href={`tel:${contactPhone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
              <span>{contactPhone}</span>
            </a>
          )}
          <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="w-4 h-4" />
            <span>{contactEmail}</span>
          </a>
        </div>
      </div>

      {/* Columns */}
      <div className="container-wide py-14 md:py-16">
        <FooterColumn title="Explore" links={explore} />
      </div>

      {/* Popular Searches */}
      <div className="container-wide py-10 border-t border-border/30">
        <h4 className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase mb-5 font-medium">
          Popular Searches
        </h4>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((search) => (
            <Link
              key={search.label}
              to={search.href}
              className="px-3.5 py-1.5 text-[12px] text-muted-foreground border border-border/30 rounded-full hover:text-foreground hover:border-border/60 transition-colors duration-300"
            >
              {search.label}
            </Link>
          ))}
        </div>
      </div>

      {/* RERA Disclaimer */}
      <div className="container-wide py-4 border-t border-border/30">
        <p className="text-[11px] text-muted-foreground/30 leading-relaxed">
          Prices and availability are subject to change without notice. All off-plan purchases are regulated by the Dubai Land Department (DLD) and payments are made through DLD-approved escrow accounts. Regulated by the Real Estate Regulatory Agency (RERA).
        </p>
      </div>

      {/* Bottom Bar */}
      <div className="container-wide py-6 border-t border-border/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="font-serif text-sm text-foreground font-light tracking-[0.05em]">
              {brandName}
            </span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            {regulatoryBody && regulatoryNumber && (
              <span>{regulatoryBody} ORN: {regulatoryNumber}</span>
            )}
            <Link to="/privacy" className="hover:text-foreground transition-colors duration-300">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors duration-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
