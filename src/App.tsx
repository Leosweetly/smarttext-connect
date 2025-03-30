
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { OnboardingProvider } from "@/hooks/use-onboarding";

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Index";
import Conversations from "./pages/dashboard/Conversations";
import MissedCalls from "./pages/dashboard/MissedCalls";
import Settings from "./pages/dashboard/Settings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Onboarding Pages
import OnboardingIndex from "./pages/onboarding/Index";
import BusinessInfo from "./pages/onboarding/BusinessInfo";
import CommunicationSetup from "./pages/onboarding/CommunicationSetup";
import MessageTemplates from "./pages/onboarding/MessageTemplates";
import FeatureTour from "./pages/onboarding/FeatureTour";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <OnboardingProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* Onboarding routes */}
              <Route path="/onboarding" element={<OnboardingIndex />} />
              <Route path="/onboarding/business-info" element={<BusinessInfo />} />
              <Route path="/onboarding/communication-setup" element={<CommunicationSetup />} />
              <Route path="/onboarding/message-templates" element={<MessageTemplates />} />
              <Route path="/onboarding/feature-tour" element={<FeatureTour />} />
              
              {/* Dashboard routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/conversations" element={<Conversations />} />
              <Route path="/dashboard/missed-calls" element={<MissedCalls />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              
              {/* Fallback routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OnboardingProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
