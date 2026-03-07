import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
      <Header />

      <main className="flex-1 flex items-center justify-center pt-20">
        <div className="container-custom text-center py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <p className="text-[10px] tracking-[0.3em] text-muted-foreground/50 uppercase">
              Page not found
            </p>

            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-foreground font-light">
              404
            </h1>

            <div className="w-12 h-px bg-border mx-auto" />

            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
              The page you're looking for has moved, been removed, or never existed.
              Let's get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link to="/properties" className="btn-primary inline-flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                Browse Properties
              </Link>
              <Link to="/" className="btn-outline inline-flex items-center gap-2">
                Back to Home
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
