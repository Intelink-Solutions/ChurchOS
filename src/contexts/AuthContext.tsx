import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "admin" | "user";

export type AuthUser = {
  name: string;
  role: Role;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (name: string, role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_STORAGE_KEY = "churchos-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const login = (name: string, role: Role) => {
    const authUser: AuthUser = { name, role };
    setUser(authUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
    // Navigate to appropriate dashboard based on role
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    navigate("/website");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
