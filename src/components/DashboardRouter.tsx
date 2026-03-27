import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Index from "../pages/Index";
import MemberDashboard from "../pages/MemberDashboard";

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.role === "admin") {
    return <Index />;
  } else {
    return <MemberDashboard />;
  }
};

export default DashboardRouter;
