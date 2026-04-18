import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import type { OtpPurpose } from "@/types/userManagement";

type OtpLocationState = {
  email?: string;
  fullName?: string;
  purpose?: OtpPurpose;
};

const RESEND_INTERVAL = 30;

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as OtpLocationState | null) ?? null;

  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_INTERVAL);
  const [error, setError] = useState("");

  const email = state?.email ?? "";
  const purpose: OtpPurpose = state?.purpose ?? "EMAIL_VERIFICATION";

  const heading = useMemo(() => {
    if (purpose === "PASSWORD_RESET") return "Reset Password OTP";
    if (purpose === "EMAIL_VERIFICATION") return "Verify Your Email";
    if (purpose === "TWO_FACTOR_AUTH") return "Two-Factor Authentication";
    return "Phone Verification";
  }, [purpose]);

  const helperText = useMemo(() => {
    if (purpose === "PASSWORD_RESET") {
      return "Enter the six-digit code sent to your email to continue password reset.";
    }

    if (purpose === "EMAIL_VERIFICATION") {
      return "Enter the six-digit code sent to your email to activate your account.";
    }

    if (purpose === "TWO_FACTOR_AUTH") {
      return "Enter the six-digit code to complete sign in.";
    }

    return "Enter the six-digit one-time passcode to continue.";
  }, [purpose]);

  useEffect(() => {
    if (countdown === 0) return;

    const timer = window.setInterval(() => {
      setCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Missing email context. Start from login or register page.");
      return;
    }

    if (otpCode.length !== 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    // Replace with API call: POST /api/auth/otp/verify
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (purpose === "PASSWORD_RESET") {
      navigate("/reset-password", {
        state: {
          email,
          otpCode,
        },
      });
      setIsLoading(false);
      return;
    }

    if (purpose === "EMAIL_VERIFICATION") {
      toast.success("Email verified successfully. You can now sign in.");
      navigate("/login");
      setIsLoading(false);
      return;
    }

    toast.success("OTP verified successfully.");
    navigate("/login");
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (!email.trim() || countdown > 0) return;

    setIsLoading(true);
    // Replace with API call: POST /api/auth/otp/send
    await new Promise((resolve) => setTimeout(resolve, 700));
    setCountdown(RESEND_INTERVAL);
    setIsLoading(false);
    toast.success("A new OTP has been sent.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.2em] text-primary">OTP Required</p>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mt-2">{heading}</h1>
          <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
          {email ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Code sent to <span className="font-medium text-foreground">{email}</span>
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="mb-3 rounded-lg border border-red-300 bg-red-100/50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            disabled={isLoading || countdown > 0}
            className="text-xs text-primary disabled:text-muted-foreground hover:underline disabled:no-underline"
          >
            {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-3 w-3" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
