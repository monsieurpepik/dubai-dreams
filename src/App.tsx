import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import { TenantProvider } from "@/contexts/TenantContext";
import { usePageTracking } from "@/hooks/usePageTracking";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { FloatingCTA } from "@/components/properties/FloatingCTA";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense, lazy } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Eagerly load the homepage for fast initial paint
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-load all other routes for code splitting
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const Calculator = lazy(() => import("./pages/Calculator"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const SavedProperties = lazy(() => import("./pages/SavedProperties"));
const Discover = lazy(() => import("./pages/Discover"));
const Auth = lazy(() => import("./pages/Auth"));
const LeadAdmin = lazy(() => import("./pages/LeadAdmin"));
const Insights = lazy(() => import("./pages/Insights"));
const InsightDetail = lazy(() => import("./pages/InsightDetail"));
const Developers = lazy(() => import("./pages/Developers"));
const DeveloperProfile = lazy(() => import("./pages/DeveloperProfile"));
const Areas = lazy(() => import("./pages/Areas"));
const AreaGuide = lazy(() => import("./pages/AreaGuide"));
const Advisor = lazy(() => import("./pages/Advisor"));
const Market = lazy(() => import("./pages/Market"));
const About = lazy(() => import("./pages/About"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Compare = lazy(() => import("./pages/Compare"));

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

const RouteLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Suspense fallback={<RouteLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/properties" element={<PageTransition><Properties /></PageTransition>} />
          <Route path="/properties/:slug" element={<PageTransition><PropertyDetail /></PageTransition>} />
          <Route path="/discover" element={<PageTransition><Discover /></PageTransition>} />
          <Route path="/calculator" element={<PageTransition><Calculator /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/saved" element={<ProtectedRoute><PageTransition><SavedProperties /></PageTransition></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><PageTransition><LeadAdmin /></PageTransition></ProtectedRoute>} />
          <Route path="/insights" element={<PageTransition><Insights /></PageTransition>} />
          <Route path="/insights/:slug" element={<PageTransition><InsightDetail /></PageTransition>} />
          <Route path="/developers" element={<PageTransition><Developers /></PageTransition>} />
          <Route path="/developers/:slug" element={<PageTransition><DeveloperProfile /></PageTransition>} />
          <Route path="/areas" element={<PageTransition><Areas /></PageTransition>} />
          <Route path="/areas/:slug" element={<PageTransition><AreaGuide /></PageTransition>} />
          <Route path="/advisor" element={<PageTransition><Advisor /></PageTransition>} />
          <Route path="/market" element={<PageTransition><Market /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/how-it-works" element={<PageTransition><HowItWorks /></PageTransition>} />
          <Route path="/compare" element={<PageTransition><Compare /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TenantProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnalyticsWrapper>
                <AnimatedRoutes />
                <MobileTabBar />
                <FloatingCTA />
              </AnalyticsWrapper>
            </BrowserRouter>
          </TooltipProvider>
        </TenantProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
