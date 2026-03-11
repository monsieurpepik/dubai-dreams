import { Link } from "react-router-dom";
import { useState } from "react";
import { useTenant } from "@/hooks/useTenant";
import { toast } from "sonner";

export function Footer() {
  const { tenant } = useTenant();
  const contactEmail = tenant?.email || 'hello@owningdubai.com';
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Welcome to the list.');
    setEmail('');
  };

  return (
    <footer className="bg-black border-t border-white/10">
      {/* Main footer — centered, Webflow style */}
      <div className="container-wide py-20 md:py-28">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          {/* Brand */}
          <h3 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold tracking-[0.3em] text-white uppercase">
            OWNING DUBAI
          </h3>

          {/* Tagline — from Webflow */}
          <p className="mt-4 text-[14px] text-white/30 font-light italic">
            Inspired by the best city in the world.
          </p>

          {/* Links — horizontal like Webflow */}
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-8">
            <Link to="/properties" className="text-[11px] tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase">
              Properties
            </Link>
            <Link to="/discover" className="text-[11px] tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase">
              Deal Finder
            </Link>
            <Link to="/blog" className="text-[11px] tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase">
              Insights
            </Link>
            <Link to="/about" className="text-[11px] tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase">
              About
            </Link>
            <Link to="/contact" className="text-[11px] tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase">
              Contact
            </Link>
          </nav>

          {/* Email signup — minimal */}
          <form onSubmit={handleNewsletter} className="mt-10 flex w-full max-w-md gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-transparent border border-white/15 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
              required
            />
            <button type="submit" className="px-6 py-3 bg-white text-black text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-white/90 transition-all">
              Join
            </button>
          </form>

          {/* Social — Webflow style */}
          <div className="mt-10 flex items-center gap-6">
            <a href="#" className="text-[11px] tracking-[0.15em] text-white/25 hover:text-white/60 transition-colors uppercase">Instagram</a>
            <span className="text-white/10">·</span>
            <a href="#" className="text-[11px] tracking-[0.15em] text-white/25 hover:text-white/60 transition-colors uppercase">YouTube</a>
            <span className="text-white/10">·</span>
            <a href="#" className="text-[11px] tracking-[0.15em] text-white/25 hover:text-white/60 transition-colors uppercase">LinkedIn</a>
            <span className="text-white/10">·</span>
            <a href="#" className="text-[11px] tracking-[0.15em] text-white/25 hover:text-white/60 transition-colors uppercase">X</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] py-5">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-white/20">
          <span>&copy; {new Date().getFullYear()} Owning Dubai. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white/40 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/40 transition-colors">Terms</Link>
            <span className="text-white/10">Powered by OwningX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
