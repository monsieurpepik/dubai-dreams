import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.08]">
      <div className="container-wide py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Brand */}
          <h3 className="text-[clamp(1.2rem,2.5vw,2rem)] font-bold tracking-[0.3em] text-white uppercase">
            OWNING DUBAI
          </h3>

          {/* Tagline */}
          <p className="mt-3 text-[13px] text-white/30 font-light">
            Dubai's property marketplace.
          </p>

          {/* Links */}
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-8">
            <Link to="/properties" className="text-[11px] tracking-[0.15em] text-white/30 hover:text-white transition-colors uppercase">
              Properties
            </Link>
            <Link to="/properties?status=off-plan" className="text-[11px] tracking-[0.15em] text-white/30 hover:text-white transition-colors uppercase">
              Off-Plan
            </Link>
            <Link to="/insights" className="text-[11px] tracking-[0.15em] text-white/30 hover:text-white transition-colors uppercase">
              Insights
            </Link>
            <Link to="/about" className="text-[11px] tracking-[0.15em] text-white/30 hover:text-white transition-colors uppercase">
              About
            </Link>
            <Link to="/contact" className="text-[11px] tracking-[0.15em] text-white/30 hover:text-white transition-colors uppercase">
              Contact
            </Link>
          </nav>

          {/* Social */}
          <div className="mt-10 flex items-center gap-6">
            <a href="#" className="text-[10px] tracking-[0.15em] text-white/30 hover:text-white/60 transition-colors uppercase">Instagram</a>
            <span className="text-white/[0.08]">·</span>
            <a href="#" className="text-[10px] tracking-[0.15em] text-white/30 hover:text-white/60 transition-colors uppercase">YouTube</a>
            <span className="text-white/[0.08]">·</span>
            <a href="#" className="text-[10px] tracking-[0.15em] text-white/30 hover:text-white/60 transition-colors uppercase">LinkedIn</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] py-5">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-white/30">
          <span>&copy; {new Date().getFullYear()} Owning Dubai</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <span className="text-white/[0.15]">Powered by OwningX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
