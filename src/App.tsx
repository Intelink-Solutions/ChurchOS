import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Index from "./pages/Index";
import MembersPage from "./pages/Members";
import VisitorsPage from "./pages/Visitors";
import AttendancePage from "./pages/Attendance";
import FinancePage from "./pages/Finance";
import EventsPage from "./pages/Events";
import SermonsPage from "./pages/Sermons";
import PrayerRequestsPage from "./pages/PrayerRequests";
import CommunicationsPage from "./pages/Communications";
import SettingsPage from "./pages/Settings";
import DepartmentsPage from "./pages/Departments";
import CellGroupsPage from "./pages/CellGroups";
import ReportsPage from "./pages/Reports";
import AnalyticsPage from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import PublicHome from "./pages/public/PublicHome";
import PublicEvents from "./pages/public/PublicEvents";
import PublicSermons from "./pages/public/PublicSermons";
import PublicPrayerRequests from "./pages/public/PublicPrayerRequests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/visitors" element={<VisitorsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/cell-groups" element={<CellGroupsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/tithes" element={<FinancePage />} />
            <Route path="/sermons" element={<SermonsPage />} />
            <Route path="/prayer-requests" element={<PrayerRequestsPage />} />
            <Route path="/communications" element={<CommunicationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Public Website */}
            <Route path="/website" element={<PublicHome />} />
            <Route path="/website/events" element={<PublicEvents />} />
            <Route path="/website/sermons" element={<PublicSermons />} />
            <Route path="/website/prayer-requests" element={<PublicPrayerRequests />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
