import { Building2, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  market: {
    title: "Market Resources",
    links: [
      { label: "Area Guides", href: "#" },
      { label: "Market Data", href: "#" },
      { label: "Investment FAQ", href: "#" },
      { label: "Developer Reviews", href: "#" },
    ],
  },
  tools: {
    title: "Buyer Tools",
    links: [
      { label: "Mortgage Calculator", href: "#calculator" },
      { label: "Property Checklist", href: "#" },
      { label: "Timeline Guide", href: "#" },
      { label: "Cost Breakdown", href: "#" },
    ],
  },
  learning: {
    title: "Learning",
    links: [
      { label: "Blog", href: "#" },
      { label: "Video Guides", href: "#" },
      { label: "Webinars", href: "#" },
      { label: "Market Reports", href: "#" },
    ],
  },
  connect: {
    title: "Connect",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "WhatsApp", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom section-padding">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 mb-8 lg:mb-0">
            <a href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-2xl font-semibold">
                <span className="text-gold">Owning</span>
                <span>Dubai</span>
              </span>
            </a>
            <p className="text-background/60 text-sm mb-6 max-w-xs">
              Your gateway to premium Dubai real estate. Off-plan properties, 
              Golden Visa opportunities, and expert guidance.
            </p>
            <div className="space-y-3 text-sm text-background/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Dubai, United Arab Emirates</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+971 4 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@owningdubai.com</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-medium text-sm mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-background/60 hover:text-gold transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* OwningX Network */}
        <div className="mt-16 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Building2 className="w-8 h-8 text-gold" />
              <div>
                <p className="font-medium text-sm">Part of OwningX Global</p>
                <p className="text-xs text-background/60">500+ platforms, 190 countries</p>
              </div>
            </div>
            <a
              href="#"
              className="text-sm text-gold hover:underline"
            >
              Explore other markets →
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/40">
            <div className="flex items-center gap-6">
              <span>© 2025 OwningDubai. All rights reserved.</span>
              <a href="#" className="hover:text-background/60">Privacy Policy</a>
              <a href="#" className="hover:text-background/60">Terms of Service</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 border border-background/20 rounded text-[10px]">
                RERA Certified
              </span>
              <span className="px-2 py-1 border border-background/20 rounded text-[10px]">
                DLD Registered
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
