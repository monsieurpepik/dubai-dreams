import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import { TenantProvider } from "@/contexts/TenantContext";
import { DeveloperProvider } from "@/contexts/DeveloperContext";
import { usePageTracking } from "@/hooks/usePageTracking";
import { CustomCursor } from "@/components/ui/CustomCursor";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Calculator from "./pages/Calculator";
import Contact from "./pages/Contact";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import SavedProperties from "./pages/SavedProperties";
import Compare from "./pages/Compare";
import AreaGuide from "./pages/AreaGuide";
import Discover from "./pages/Discover";
import DeveloperLogin from "./pages/developer/Login";
import DeveloperDashboard from "./pages/developer/Dashboard";
import DeveloperProperties from "./pages/developer/Properties";
import DeveloperLeads from "./pages/developer/Leads";
import DeveloperSettings from "./pages/developer/Settings";

const queryClient = new QueryClient();

const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/properties" element={<PageTransition><Properties /></PageTransition>} />
        <Route path="/properties/:slug" element={<PageTransition><PropertyDetail /></PageTransition>} />
        <Route path="/calculator" element={<PageTransition><Calculator /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/how-it-works" element={<PageTransition><HowItWorks /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/saved" element={<PageTransition><SavedProperties /></PageTransition>} />
        <Route path="/compare" element={<PageTransition><Compare /></PageTransition>} />
        <Route path="/areas/:slug" element={<PageTransition><AreaGuide /></PageTransition>} />
        <Route path="/discover" element={<PageTransition><Discover /></PageTransition>} />
        
        {/* Developer Portal Routes */}
        <Route path="/developer/login" element={<PageTransition><DeveloperLogin /></PageTransition>} />
        <Route path="/developer/dashboard" element={<PageTransition><DeveloperDashboard /></PageTransition>} />
        <Route path="/developer/properties" element={<PageTransition><DeveloperProperties /></PageTransition>} />
        <Route path="/developer/leads" element={<PageTransition><DeveloperLeads /></PageTransition>} />
        <Route path="/developer/settings" element={<PageTransition><DeveloperSettings /></PageTransition>} />
        
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <DeveloperProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnalyticsWrapper>
                <CustomCursor />
                <AnimatedRoutes />
              </AnalyticsWrapper>
            </BrowserRouter>
          </TooltipProvider>
        </DeveloperProvider>
      </TenantProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
