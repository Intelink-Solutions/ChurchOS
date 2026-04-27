import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import SettingsPage from "../pages/Settings";
import ReportsPage from "../pages/Reports";
import AnalyticsPage from "../pages/Analytics";
import NotFound from "../pages/NotFound";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const SuperAdminRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only allow SUPER_ADMIN role
  if (user.roleCode !== "SUPER_ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      {/* Super Admin Dashboard - System Level Control */}
      <Route path="/" element={<SuperAdminDashboard />} />
      
      {/* Super Admin Only Routes - System Level Features */}
      <Route path="/settings" element={<ProtectedRoute requireSuperAdmin><SettingsPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute requireSuperAdmin><ReportsPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute requireSuperAdmin><AnalyticsPage /></ProtectedRoute>} />
      
      {/* Redirect church-specific routes to dashboard */}
      <Route path="/members" element={<Navigate to="/" replace />} />
      <Route path="/visitors" element={<Navigate to="/" replace />} />
      <Route path="/attendance" element={<Navigate to="/" replace />} />
      <Route path="/events" element={<Navigate to="/" replace />} />
      <Route path="/finance" element={<Navigate to="/" replace />} />
      <Route path="/tithes" element={<Navigate to="/" replace />} />
      <Route path="/sermons" element={<Navigate to="/" replace />} />
      <Route path="/prayer-requests" element={<Navigate to="/" replace />} />
      <Route path="/communications" element={<Navigate to="/" replace />} />
      <Route path="/departments" element={<Navigate to="/" replace />} />
      <Route path="/cell-groups" element={<Navigate to="/" replace />} />
      
      {/* 404 for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default SuperAdminRouter;
