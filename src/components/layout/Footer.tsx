import { Link } from "react-router-dom";
import { useTenant } from "@/hooks/useTenant";

const areas = [
  { label: 'Dubai Marina', href: '/area-guide/dubai-marina' },
  { label: 'Palm Jumeirah', href: '/area-guide/palm-jumeirah' },
  { label: 'Downtown Dubai', href: '/area-guide/downtown-dubai' },
  { label: 'Business Bay', href: '/area-guide/business-bay' },
  { label: 'Dubai Hills', href: '/area-guide/dubai-hills' },
  { label: 'JVC', href: '/area-guide/jvc' },
  { label: 'Creek Harbour', href: '/area-guide/creek-harbour' },
  { label: 'Dubai South', href: '/area-guide/dubai-south' },
];

const developers = [
  { label: 'Emaar', href: '/properties?developer=emaar' },
  { label: 'DAMAC', href: '/properties?developer=damac' },
  { label: 'Nakheel', href: '/properties?developer=nakheel' },
  { label: 'Sobha', href: '/properties?developer=sobha' },
  { label: 'Meraas', href: '/properties?developer=meraas' },
  { label: 'Omniyat', href: '/properties?developer=omniyat' },
];

const Dot = () => <span className="text-border/20">·</span>;

export function Footer() {
  const { tenant } = useTenant();
  const brandName = tenant?.brand_name || 'OwningDubai';

  return (
    <footer className="bg-background border-t border-border/10">
      <div className="container-wide py-20 md:py-24 space-y-8">
        {/* Area links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground/40">
          {areas.map((area, i) => (
            <span key={area.label} className="flex items-center gap-4">
              <Link to={area.href} className="hover:text-foreground transition-colors duration-300">
                {area.label}
              </Link>
              {i < areas.length - 1 && <Dot />}
            </span>
          ))}
        </div>

        {/* Developer links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground/40">
          {developers.map((dev, i) => (
            <span key={dev.label} className="flex items-center gap-4">
              <Link to={dev.href} className="hover:text-foreground transition-colors duration-300">
                {dev.label}
              </Link>
              {i < developers.length - 1 && <Dot />}
            </span>
          ))}
        </div>

        {/* Brand line */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-xs text-muted-foreground">
          <span className="font-serif text-sm text-foreground font-light tracking-[0.05em]">
            {brandName}
          </span>
          <Dot />
          <span>© {new Date().getFullYear()}</span>
          <Dot />
          <Link to="/contact" className="hover:text-foreground transition-opacity duration-300">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-foreground transition-opacity duration-300">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground transition-opacity duration-300">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
