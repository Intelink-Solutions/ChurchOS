import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import type { Permission } from "@/types/userManagement";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  requiredPermission?: Permission;
}

const ProtectedRoute = ({ children, requireAdmin = false, requireSuperAdmin = false, requiredPermission }: ProtectedRouteProps) => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperAdmin && user.roleCode !== "SUPER_ADMIN") {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.roleCode !== "ADMIN") {
    return <Navigate to="/profile" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
