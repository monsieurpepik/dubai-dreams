import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-black">
      <div className="container-wide py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Brand */}
          <h3 className="text-[clamp(1.2rem,2.5vw,2rem)] font-bold tracking-[0.3em] text-white uppercase">
            OWNING DUBAI
          </h3>

          {/* Tagline */}
          <p className="mt-3 text-[14px] text-white/30">
            Dubai's property marketplace.
          </p>

          {/* Links — friendlier typography */}
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <Link to="/properties" className="text-[13px] text-white/30 hover:text-white transition-colors duration-200">
              Properties
            </Link>
            <Link to="/properties?status=off-plan" className="text-[13px] text-white/30 hover:text-white transition-colors duration-200">
              Off-Plan
            </Link>
            <Link to="/insights" className="text-[13px] text-white/30 hover:text-white transition-colors duration-200">
              Insights
            </Link>
            <Link to="/about" className="text-[13px] text-white/30 hover:text-white transition-colors duration-200">
              About
            </Link>
            <Link to="/contact" className="text-[13px] text-white/30 hover:text-white transition-colors duration-200">
              Contact
            </Link>
          </nav>

          {/* Social — pill style */}
          <div className="mt-10 flex items-center gap-3">
            <a href="#" className="px-4 py-2 text-[12px] text-white/30 bg-white/[0.04] border border-white/[0.06] rounded-full hover:bg-white/[0.08] hover:text-white/60 transition-all duration-200">Instagram</a>
            <a href="#" className="px-4 py-2 text-[12px] text-white/30 bg-white/[0.04] border border-white/[0.06] rounded-full hover:bg-white/[0.08] hover:text-white/60 transition-all duration-200">YouTube</a>
            <a href="#" className="px-4 py-2 text-[12px] text-white/30 bg-white/[0.04] border border-white/[0.06] rounded-full hover:bg-white/[0.08] hover:text-white/60 transition-all duration-200">LinkedIn</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] py-5">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-white/30">
          <span>&copy; {new Date().getFullYear()} Owning Dubai</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white/60 transition-colors duration-200">Privacy</Link>
            <Link to="/terms" className="hover:text-white/60 transition-colors duration-200">Terms</Link>
            <span className="text-white/[0.15]">Powered by OwningX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
