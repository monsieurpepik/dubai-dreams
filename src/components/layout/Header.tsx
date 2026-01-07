import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const navLinks = [
  { label: "Market", href: "#opportunity" },
  { label: "Properties", href: "#properties" },
  { label: "Finance", href: "#calculator" },
  { label: "Guide", href: "#guide" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section
      const sections = navLinks.map(link => link.href.replace("#", ""));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled 
            ? "bg-background/60 backdrop-blur-2xl" 
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Subtle border when scrolled */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-px bg-border/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Progress Bar - Electric blue accent */}
        <motion.div 
          className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-accent via-accent to-accent/50"
          style={{ width: progressWidth }}
        />

        <div className="container-custom">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo - Minimal, all white with subtle shine */}
            <motion.a 
              href="/" 
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-xl md:text-2xl font-light tracking-wider uppercase">
                <span className="text-foreground">Owning</span>
                <span className="text-metallic">Dubai</span>
              </span>
            </motion.a>

            {/* Desktop Navigation - Wide tracking, uppercase */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 ${
                    activeSection === link.href.replace("#", "")
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {activeSection === link.href.replace("#", "") && (
                    <motion.span
                      className="absolute inset-0 bg-accent/5 -z-10"
                      layoutId="activeSection"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-6">
              <MagneticButton className="btn-metallic text-xs uppercase tracking-[0.15em] px-8 py-3">
                Discover
              </MagneticButton>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-foreground"
              whileTap={{ scale: 0.9 }}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay - Full screen dark */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop - Deep black */}
            <motion.div
              className="absolute inset-0 bg-background"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Decorative line */}
            <div className="absolute top-1/2 left-8 right-8 h-px bg-border/20 -translate-y-1/2" />

            {/* Menu Content */}
            <motion.div
              className="relative h-full flex flex-col items-center justify-center gap-10 p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label="Close menu"
              >
                <X className="w-8 h-8" />
              </motion.button>

              {/* Nav Links - Fade in from center */}
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl md:text-5xl font-extralight tracking-wider uppercase text-foreground hover:text-accent transition-colors duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {link.label}
                </motion.a>
              ))}

              {/* CTA */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <MagneticButton className="btn-metallic px-10 py-4 text-sm uppercase tracking-[0.2em]">
                  Discover
                </MagneticButton>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}