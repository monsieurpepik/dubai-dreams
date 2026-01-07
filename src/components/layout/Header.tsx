import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
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
  const [isDark, setIsDark] = useState(false);
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

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const stored = localStorage.getItem("theme");
    const shouldBeDark = stored ? stored === "dark" : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-background/80 backdrop-blur-2xl border-b border-border/50" 
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Progress Bar */}
        <motion.div 
          className="absolute bottom-0 left-0 h-[1px] bg-gold"
          style={{ width: progressWidth }}
        />

        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.a 
              href="/" 
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-xl md:text-2xl font-semibold tracking-tight">
                <span className="text-gold">Owning</span>
                <span>Dubai</span>
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    activeSection === link.href.replace("#", "")
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {activeSection === link.href.replace("#", "") && (
                    <motion.span
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-gold"
                      layoutId="activeSection"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                onClick={toggleTheme}
                className="p-2.5 rounded-full hover:bg-secondary transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
              <MagneticButton className="bg-gold text-gold-foreground hover:bg-gold/90 rounded-full px-6 py-2.5 text-sm font-medium shadow-[0_0_20px_hsl(var(--gold)/0.3)] hover:shadow-[0_0_30px_hsl(var(--gold)/0.5)] transition-shadow duration-300">
                Get Started
              </MagneticButton>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2"
              whileTap={{ scale: 0.9 }}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Menu Content */}
            <motion.div
              className="relative h-full flex flex-col items-center justify-center gap-8 p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2"
                whileTap={{ scale: 0.9 }}
                aria-label="Close menu"
              >
                <X className="w-8 h-8" />
              </motion.button>

              {/* Nav Links */}
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl md:text-5xl font-extralight hover:text-gold transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Actions */}
              <motion.div
                className="flex items-center gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-full border border-border hover:bg-secondary transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
                <MagneticButton className="bg-gold text-gold-foreground rounded-full px-8 py-4 text-lg font-medium">
                  Get Started
                </MagneticButton>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}