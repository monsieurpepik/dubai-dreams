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
    <footer className="bg-black text-white border-t border-white/10">
      <div className="container-custom section-padding">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 mb-10 lg:mb-0">
            <a href="/" className="inline-flex items-center gap-2 mb-8">
              <span className="text-2xl font-light tracking-tight">
                Owning<span className="font-medium">Dubai</span>
              </span>
            </a>
            <p className="text-silver text-sm mb-8 max-w-xs font-light leading-relaxed">
              Your gateway to premium Dubai real estate. Off-plan properties, 
              Golden Visa opportunities, and expert guidance.
            </p>
            <div className="space-y-4 text-sm text-silver">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Dubai, United Arab Emirates</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold" />
                <span>+971 4 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold" />
                <span>hello@owningdubai.com</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-xs font-medium uppercase tracking-[0.2em] mb-6 text-white">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-silver hover:text-gold transition-colors duration-300"
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
        <div className="mt-20 pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 border border-gold/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-medium text-sm">Part of OwningX Global</p>
                <p className="text-xs text-silver">500+ platforms, 190 countries</p>
              </div>
            </div>
            <a
              href="#"
              className="text-sm text-gold hover:underline transition-all"
            >
              Explore other markets →
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-silver">
            <div className="flex items-center gap-8">
              <span>© 2026 OwningDubai. All rights reserved.</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 border border-white/20 text-[10px] uppercase tracking-wider">
                RERA Certified
              </span>
              <span className="px-3 py-1.5 border border-white/20 text-[10px] uppercase tracking-wider">
                DLD Registered
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}