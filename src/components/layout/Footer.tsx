import { Link } from "react-router-dom";
import { useTenant } from "@/hooks/useTenant";

export function Footer() {
  const { tenant } = useTenant();
  const brandName = tenant?.brand_name || 'OwningDubai';

  return (
    <footer className="bg-background border-t border-border/10">
      <div className="container-wide py-20 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-xs text-muted-foreground">
          <span className="font-serif text-sm text-foreground font-light tracking-[0.05em]">
            {brandName}
          </span>
          <span className="hidden md:inline text-border/30">·</span>
          <span>© {new Date().getFullYear()}</span>
          <span className="hidden md:inline text-border/30">·</span>
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
