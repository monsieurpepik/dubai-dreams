import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TenantProvider } from "@/contexts/TenantContext";
import { DeveloperProvider } from "@/contexts/DeveloperContext";
import { usePageTracking } from "@/hooks/usePageTracking";
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
import DeveloperLogin from "./pages/developer/Login";
import DeveloperDashboard from "./pages/developer/Dashboard";
import DeveloperProperties from "./pages/developer/Properties";
import DeveloperLeads from "./pages/developer/Leads";
import DeveloperSettings from "./pages/developer/Settings";

const queryClient = new QueryClient();

// Analytics wrapper component
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
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
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:slug" element={<PropertyDetail />} />
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/saved" element={<SavedProperties />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/areas/:slug" element={<AreaGuide />} />
                  
                  {/* Developer Portal Routes */}
                  <Route path="/developer/login" element={<DeveloperLogin />} />
                  <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
                  <Route path="/developer/properties" element={<DeveloperProperties />} />
                  <Route path="/developer/leads" element={<DeveloperLeads />} />
                  <Route path="/developer/settings" element={<DeveloperSettings />} />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnalyticsWrapper>
            </BrowserRouter>
          </TooltipProvider>
        </DeveloperProvider>
      </TenantProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;