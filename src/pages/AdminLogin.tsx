import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { loginUser } from "@/lib/api/authApi";
import { getApiErrorMessage } from "@/lib/api/errorHandling";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    try {
      const response = await loginUser({
        email: email.trim(),
        password,
      });

      const isAdminRole = response.user.roleCode === "ADMIN" || response.user.roleCode === "SUPER_ADMIN";
      if (!isAdminRole) {
        setError("This account does not have administrator access.");
        return;
      }

      const displayName = response.user.fullName || `${response.user.firstName} ${response.user.lastName}`.trim() || "Admin";

      localStorage.setItem("churchos-access-token", response.accessToken);
      localStorage.setItem("churchos-refresh-token", response.refreshToken);
      login({
        name: displayName,
        role: "admin",
        roleCode: response.user.roleCode,
        permissions: response.permissions,
        permissionScopes: response.permissionScopes,
      });
    } catch (err) {
      const message = getApiErrorMessage(err, "Admin login failed. Please try again.");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Admin login</p>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mt-2">Admin Dashboard Access</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your administrator credentials.</p>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-400 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Admin Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="admin@church.com"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter admin password"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In as Admin"}
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t border-border text-center">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Member Login
          </button>
        </div>

        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Use your administrator account credentials
          </p>
        </div>
      </div>
    </div>
  );
}
