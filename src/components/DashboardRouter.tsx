import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Index from "../pages/Index";
import MemberDashboard from "../pages/MemberDashboard";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.roleCode === "SUPER_ADMIN") {
    return <SuperAdminDashboard />;
  } else if (user.role === "admin") {
    return <Index />;
  } else {
    return <MemberDashboard />;
  }
};

export default DashboardRouter;
