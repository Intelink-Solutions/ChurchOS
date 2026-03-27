import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please provide a valid email and password.");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 900));

    // Demo login: any credentials are accepted for members
    login(email.split("@")[0] || "Member", "user");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529421309314-703cfbf562b5?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"
        style={{ opacity: `var(--login-overlay-opacity, 0.35)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/70 to-slate-950/95" />

      <div className="relative flex items-center justify-center p-4 py-10">
        <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-950/70 p-1 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-center gap-4 bg-gradient-to-b from-primary to-violet-700 p-10 text-white">
            <h2 className="text-3xl font-bold">Member Portal</h2>
            <p className="text-sm text-slate-100/90">
              Welcome to ChurchOS — your hub for events, groups, giving, and ministry updates. Sign in and stay connected with your community.
            </p>
            <ul className="space-y-2 text-xs opacity-90">
              <li>• View attendance and event schedules</li>
              <li>• Track sermons and prayer requests</li>
              <li>• Update your member profile and permissions</li>
            </ul>
          </div>

          <div className="px-8 py-10 sm:px-10 sm:py-12">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
              <Shield className="h-4 w-4" />
              MEMBER LOGIN
            </div>

            <h1 className="text-2xl font-bold text-foreground" style={{ textShadow: "0 0 18px rgba(255,255,255,0.35), 0 0 8px rgba(0,0,0,0.45)" }}>Sign in</h1>
            <p className="mb-6 text-sm text-muted-foreground">Enter your church email and password to continue.</p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-400 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@church.com"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
                <span className="text-xs text-muted-foreground">Need help? Contact admin</span>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Continue"}
              </Button>
            </form>

            <div className="mt-5 border-t border-slate-800 pt-4 text-center text-xs text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register as member
              </Link>
            </div>

            <div className="mt-3 text-center">
              <button
                onClick={() => navigate("/admin/login")}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-primary hover:bg-slate-800"
              >
                <Shield className="h-3 w-3" />
                Switch to Admin login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

