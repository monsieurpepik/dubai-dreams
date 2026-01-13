import { Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTenant } from "@/hooks/useTenant";

export function Footer() {
  const { tenant } = useTenant();

  // Brand name parts
  const brandName = tenant?.brand_name || 'OwningDubai';
  const brandParts = brandName.match(/^(Owning)(.*)$/);
  const brandPrefix = brandParts?.[1] || 'Owning';
  const brandLocation = brandParts?.[2] || '';

  // Location display
  const location = tenant?.office_location
    ? `${tenant.office_location.city}, ${tenant.office_location.country}`
    : 'Dubai, United Arab Emirates';

  // Email
  const email = tenant?.email || 'hello@owningdubai.com';

  // Regulatory info
  const regulatoryBody = tenant?.regulatory_body || 'RERA';
  const regulatoryNumber = tenant?.regulatory_number || 'Registered Broker';

  return (
    <footer className="bg-background border-t border-border/30">
      <div className="container-wide py-20">
        {/* Main Footer - Minimal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="text-xl font-light tracking-tight text-foreground">
                {brandPrefix}<span className="font-medium">{brandLocation}</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {tenant?.brand_tagline || `Curated off-plan properties in ${tenant?.office_location?.city || 'Dubai'}'s most sought-after locations.`}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-luxury mb-6 text-foreground">
              Resources
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/#properties"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/calculator"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Payment Estimator
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-luxury mb-6 text-foreground">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{location}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <span>© {new Date().getFullYear()} {brandName}. All rights reserved.</span>
              <span className="hidden md:inline text-border">·</span>
              <span>{regulatoryBody} {regulatoryNumber}</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}