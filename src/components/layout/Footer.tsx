import { Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { useTenant } from "@/hooks/useTenant";

export function Footer() {
  const { tenant } = useTenant();

  const brandName = tenant?.brand_name || 'OwningDubai';
  const brandParts = brandName.match(/^(Owning)(.*)$/);
  const brandPrefix = brandParts?.[1] || 'Owning';
  const brandLocation = brandParts?.[2] || '';

  const location = tenant?.office_location
    ? `${tenant.office_location.city}, ${tenant.office_location.country}`
    : 'Dubai, United Arab Emirates';

  const email = tenant?.email || 'hello@owningdubai.com';

  const regulatoryBody = tenant?.regulatory_body || 'RERA';
  const regulatoryNumber = tenant?.regulatory_number || 'Registered Broker';

  const socialLinks = tenant?.social_links;

  return (
    <footer className="bg-background border-t border-border/30">
      <div className="container-wide py-16 md:py-20">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-sm font-light tracking-tight text-foreground">
                {brandPrefix}<span className="font-medium">{brandLocation}</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              {tenant?.brand_tagline || `Curated off-plan properties in ${tenant?.office_location?.city || 'Dubai'}.`}
            </p>
          </div>

          {/* Invest */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] mb-5 text-foreground">
              Invest
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Properties', href: '/properties' },
                { label: 'Calculator', href: '/calculator' },
                { label: 'Area Guides', href: '/area-guide' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] mb-5 text-foreground">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Contact', href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] mb-5 text-foreground">
              Contact
            </h4>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{location}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>© {new Date().getFullYear()} {brandName}</span>
              <span className="text-border">·</span>
              <span>{regulatoryBody} {regulatoryNumber}</span>
            </div>
            <div className="flex items-center gap-5">
              {socialLinks?.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
