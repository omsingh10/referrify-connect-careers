import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import StudentSettings from "./pages/StudentSettings";
import AlumniDashboard from "./pages/AlumniDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import JobOpportunities from "./pages/JobOpportunities";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Resources from "./pages/Resources";
import UserManagement from "./pages/UserManagement";
import JobManagement from "./pages/JobManagement";
import Analytics from "./pages/Analytics";
import JobPosting from "./pages/JobPosting";
import ReferralManagement from "./pages/ReferralManagement";
import AlumniNetworking from "./pages/AlumniNetworking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/settings" element={<StudentSettings />} />
            <Route path="/student/opportunities" element={<JobOpportunities />} />
            <Route path="/student/resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="/student/resources" element={<Resources />} />
            <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
            <Route path="/alumni/job-posting" element={<JobPosting />} />
            <Route path="/alumni/referral-management" element={<ReferralManagement />} />
            <Route path="/alumni/networking" element={<AlumniNetworking />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/jobs" element={<JobManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/settings" element={<StudentSettings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
