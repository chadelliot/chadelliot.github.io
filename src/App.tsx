import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import ApproachPage from "./pages/ApproachPage";
import CareerPage from "./pages/CareerPage";
import SkillsPage from "./pages/SkillsPage";
import ContactPage from "./pages/ContactPage";
import CompanyDirectoryPageV9 from "./pages/CompanyDirectoryPageV9";
import ProjectsPage from "./pages/ProjectsPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import SchedulePage from "./pages/SchedulePage";
import CompanyLandingPage from "./pages/CompanyLandingPage";
import ExecutiveDashboardPage from "./pages/ExecutiveDashboardPage";
import CommercialStrategyPage from "./pages/CommercialStrategyPage";
import SyneosMarketResearchPage from "./pages/SyneosMarketResearchPage";
import NotFound from "./pages/NotFound";
import ContactSlideout from "./components/ContactSlideout";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const HomeRoute = () => (
  window.location.search.includes("commercial-strategy") ? <CommercialStrategyPage /> : <Index />
);

// Supabase's invite/reset emails redirect to whatever "Site URL" is set to
// in the Dashboard - a global setting also used by /company's own auth
// flow, so it can't just be pointed at /projects for everyone. This runs on
// every route instead: if an invite/recovery link lands anywhere other than
// /projects with #access_token=... still in the hash, forward it on to
// /projects (preserving the hash) where hydrateSessionFromUrlFragment and
// the "set your password" screen already handle it correctly. A no-op if
// the link already lands on /projects, or if there's no token to find.
const AuthLinkRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.hash.includes("access_token") && window.location.pathname !== "/projects") {
      navigate(`/projects${window.location.hash}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthLinkRedirect />
        <ScrollToTop />
        <ContactSlideout />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/my-approach" element={<ApproachPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/company" element={<CompanyDirectoryPageV9 />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/company/:id" element={<CompanyDetailPage />} />
          <Route path="/schedule/:repId" element={<SchedulePage />} />
          <Route path="/company/:slug" element={<CompanyLandingPage />} />
          <Route path="/executive-dashboard" element={<ExecutiveDashboardPage />} />
          <Route path="/commercial-strategy" element={<CommercialStrategyPage />} />
          <Route path="/syneos-market-research" element={<SyneosMarketResearchPage />} />
          <Route path="/:slug" element={<CompanyLandingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
