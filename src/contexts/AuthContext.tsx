import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hasAnyPermission as checkAnyPermission, hasPermission as checkPermission } from "@/lib/authz";
import type { Permission, PermissionScopeMap, SystemRole } from "@/types/userManagement";

type Role = "admin" | "user";

export type AuthUser = {
  name: string;
  role: Role;
  roleCode: SystemRole;
  permissions: Permission[];
  permissionScopes: PermissionScopeMap;
};

export type LoginSession = {
  name: string;
  role: Role;
  roleCode: SystemRole;
  permissions?: Permission[];
  permissionScopes?: PermissionScopeMap;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (session: LoginSession) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_STORAGE_KEY = "churchos-user";
const ACCESS_TOKEN_STORAGE_KEY = "churchos-access-token";
const REFRESH_TOKEN_STORAGE_KEY = "churchos-refresh-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as Partial<AuthUser>;
      if (!parsed.name || !parsed.role) {
        return null;
      }

      return {
        name: parsed.name,
        role: parsed.role,
        roleCode: parsed.roleCode ?? (parsed.role === "admin" ? "ADMIN" : "MEMBER"),
        permissions: Array.isArray(parsed.permissions) ? parsed.permissions : [],
        permissionScopes: parsed.permissionScopes ?? {},
      };
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const login = (session: LoginSession) => {
    const authUser: AuthUser = {
      name: session.name,
      role: session.role,
      roleCode: session.roleCode,
      permissions: session.permissions ?? [],
      permissionScopes: session.permissionScopes ?? {},
    };
    setUser(authUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    navigate("/website");
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      hasPermission: (permission: Permission) => checkPermission(user, permission),
      hasAnyPermission: (permissions: Permission[]) => checkAnyPermission(user, permissions),
    }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
