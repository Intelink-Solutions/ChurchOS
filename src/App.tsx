import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MembersPage from "./pages/Members";
import VisitorsPage from "./pages/Visitors";
import AttendancePage from "./pages/Attendance";
import FinancePage from "./pages/Finance";
import EventsPage from "./pages/Events";
import SermonsPage from "./pages/Sermons";
import PrayerRequestsPage from "./pages/PrayerRequests";
import CommunicationsPage from "./pages/Communications";
import SettingsPage from "./pages/Settings";
import ChurchesPage from "./pages/Churches";
import AdminAuditLogsPage from "./pages/AdminAuditLogs";
import DepartmentsPage from "./pages/Departments";
import CellGroupsPage from "./pages/CellGroups";
import ReportsPage from "./pages/Reports";
import AnalyticsPage from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import PublicHome from "./pages/public/PublicHome";
import PublicEvents from "./pages/public/PublicEvents";
import PublicSermons from "./pages/public/PublicSermons";
import PublicPrayerRequests from "./pages/public/PublicPrayerRequests";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
import AdminLoginPage from "./pages/AdminLogin";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import OtpVerificationPage from "./pages/OtpVerification";
import ResetPasswordOtpPage from "./pages/ResetPasswordOtp";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Index from "./pages/Index";
import MemberDashboard from "./pages/MemberDashboard";

const queryClient = new QueryClient();

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "admin" ? <Index /> : <MemberDashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <DarkModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
            <Routes>
              <Route path="/" element={<DashboardRouter />} />
              <Route path="/members" element={<ProtectedRoute requireAdmin requiredPermission="members:read"><MembersPage /></ProtectedRoute>} />
              <Route path="/visitors" element={<ProtectedRoute requireAdmin><VisitorsPage /></ProtectedRoute>} />
              <Route path="/departments" element={<ProtectedRoute requireAdmin><DepartmentsPage /></ProtectedRoute>} />
              <Route path="/cell-groups" element={<ProtectedRoute requireAdmin><CellGroupsPage /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute requireAdmin requiredPermission="attendance:read"><AttendancePage /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute requireAdmin requiredPermission="events:read"><EventsPage /></ProtectedRoute>} />
              <Route path="/finance" element={<ProtectedRoute requireAdmin requiredPermission="finance:read"><FinancePage /></ProtectedRoute>} />
              <Route path="/tithes" element={<ProtectedRoute requireAdmin requiredPermission="finance:read"><FinancePage /></ProtectedRoute>} />
              <Route path="/sermons" element={<ProtectedRoute requireAdmin><SermonsPage /></ProtectedRoute>} />
              <Route path="/prayer-requests" element={<ProtectedRoute requireAdmin requiredPermission="members:read"><PrayerRequestsPage /></ProtectedRoute>} />
              <Route path="/communications" element={<ProtectedRoute requireAdmin requiredPermission="communications:send"><CommunicationsPage /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute requireAdmin requiredPermission="reports:read"><ReportsPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute requireAdmin><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute requireAdmin requiredPermission="settings:read"><SettingsPage /></ProtectedRoute>} />
              <Route path="/churches" element={<ProtectedRoute requireAdmin requiredPermission="churches:read"><ChurchesPage /></ProtectedRoute>} />
              <Route path="/admin/audit-logs" element={<ProtectedRoute requireAdmin requiredPermission="auditlogs:read"><AdminAuditLogsPage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/otp" element={<OtpVerificationPage />} />
              <Route path="/reset-password" element={<ResetPasswordOtpPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              {/* Public Website */}
              <Route path="/website" element={<PublicHome />} />
              <Route path="/website/events" element={<PublicEvents />} />
              <Route path="/website/sermons" element={<PublicSermons />} />
              <Route path="/website/prayer-requests" element={<PublicPrayerRequests />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
      </DarkModeProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
