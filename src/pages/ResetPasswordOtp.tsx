import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { resetPasswordWithOtp } from "@/lib/api/authApi";

type ResetLocationState = {
  email?: string;
  otpCode?: string;
};

export default function ResetPasswordOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ResetLocationState | null) ?? null;

  const email = state?.email ?? "";
  const otpCode = state?.otpCode ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email || otpCode.length !== 6) {
      setError("OTP verification context is missing. Restart forgot password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPasswordWithOtp({
        email,
        otpCode,
        newPassword: password,
      });

      toast.success(response.message || "Password reset successful. Sign in with your new password.");
      navigate("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not reset password. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Set New Password</p>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mt-2">Create a new password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {email ? `Resetting password for ${email}` : "Complete password reset with OTP verification."}
          </p>
        </div>

        {error ? (
          <div className="mb-3 rounded-lg border border-red-300 bg-red-100/50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">New Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Create a password"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Confirm Password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-3 w-3" />
            Back to Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
}
