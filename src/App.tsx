import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ApproachPage from "./pages/ApproachPage";
import CareerPage from "./pages/CareerPage";
import SkillsPage from "./pages/SkillsPage";
import ContactPage from "./pages/ContactPage";
import CompanyDirectoryPageV7 from "./pages/CompanyDirectoryPageV7";
import CompanyDirectoryGate from "./pages/CompanyDirectoryGate";
import CompanyLandingPage from "./pages/CompanyLandingPage";
import NotFound from "./pages/NotFound";
import ContactSlideout from "./components/ContactSlideout";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ContactSlideout />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/approach" element={<ApproachPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/company" element={<CompanyDirectoryGate><CompanyDirectoryPageV7 /></CompanyDirectoryGate>} />
          <Route path="/company/:slug" element={<CompanyLandingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;