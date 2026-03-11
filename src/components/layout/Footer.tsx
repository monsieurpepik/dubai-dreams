import { Link } from "react-router-dom";
import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { useTenant } from "@/hooks/useTenant";
import { toast } from "sonner";

const explore = [
  { label: 'Properties', href: '/properties' },
  { label: 'Off-Plan', href: '/properties?status=off-plan' },
  { label: 'Deal Finder', href: '/discover' },
  { label: 'Saved', href: '/saved' },
];

const company = [
  { label: 'Insights', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const tools = [
  { label: 'Golden Visa Calculator', href: '/calculator' },
  { label: 'Market Pulse', href: '/market' },
  { label: 'AI Deal Finder', href: '/discover' },
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
      <h4 className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-5 font-medium">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.href}
              className="text-[13px] text-white/50 hover:text-white transition-colors duration-300"
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
  const brandName = tenant?.brand_name || 'OWNING DUBAI';
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
    <footer className="bg-black border-t border-white/10">
      {/* Newsletter Row */}
      <div className="container-wide py-14 md:py-16 border-b border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl text-white font-light">
              Stay Informed
            </h3>
            <p className="text-sm text-white/40 mt-1">
              Market intelligence and new launches, delivered weekly.
            </p>
          </div>
          <form onSubmit={handleNewsletter} className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 md:w-64 px-4 py-3 bg-transparent border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
              required
            />
            <button type="submit" className="bg-[#1127D2] text-white px-6 py-3 rounded-[4px] text-xs font-medium tracking-[0.1em] uppercase hover:opacity-90 transition-opacity whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Links grid */}
      <div className="container-wide py-14 md:py-16 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <FooterColumn title="Explore" links={explore} />
          <FooterColumn title="Company" links={company} />
          <FooterColumn title="Tools" links={tools} />

          {/* Contact column */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-5 font-medium">
              Contact
            </h4>
            <ul className="space-y-2.5">
              {contactPhone && (
                <li>
                  <a href={`tel:${contactPhone}`} className="flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{contactPhone}</span>
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{contactEmail}</span>
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-[11px] tracking-[0.1em] text-white/30 hover:text-white transition-colors uppercase">IG</a>
              <a href="#" className="text-[11px] tracking-[0.1em] text-white/30 hover:text-white transition-colors uppercase">YT</a>
              <a href="#" className="text-[11px] tracking-[0.1em] text-white/30 hover:text-white transition-colors uppercase">LI</a>
              <a href="#" className="text-[11px] tracking-[0.1em] text-white/30 hover:text-white transition-colors uppercase">X</a>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="container-wide py-10 border-b border-white/10">
        <h4 className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-5 font-medium">
          Popular Searches
        </h4>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((search) => (
            <Link
              key={search.label}
              to={search.href}
              className="px-3.5 py-1.5 text-[11px] text-white/40 border border-white/10 rounded-[4px] hover:text-white/80 hover:border-white/20 transition-colors duration-300"
            >
              {search.label}
            </Link>
          ))}
        </div>
      </div>

      {/* RERA Disclaimer */}
      <div className="container-wide py-4 border-b border-white/10">
        <p className="text-[11px] text-white/20 leading-relaxed">
          Prices and availability are subject to change without notice. All off-plan purchases are regulated by the Dubai Land Department (DLD) and payments are made through DLD-approved escrow accounts. Regulated by the Real Estate Regulatory Agency (RERA).
        </p>
      </div>

      {/* Bottom Bar */}
      <div className="container-wide py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/30">
          <div className="flex items-center gap-6">
            <span className="text-[14px] text-white font-semibold tracking-[0.25em] uppercase">
              {brandName}
            </span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            {regulatoryBody && regulatoryNumber && (
              <span>{regulatoryBody} ORN: {regulatoryNumber}</span>
            )}
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span className="text-white/15">Powered by OwningX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
