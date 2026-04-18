import { apiRequest } from "@/lib/api/httpClient";
import type {
  AuthResponse,
  LoginRequest,
  OtpSendRequest,
  OtpVerifyRequest,
  RegisterRequest,
} from "@/types/userManagement";

export type AuthRegisterResponse = {
  userId: string;
  status: "PENDING_VERIFICATION";
  otpRequired: boolean;
};

export type OtpSendResponse = {
  requestId: string;
  expiresAt: string;
  resendAvailableAt: string;
};

export type OtpVerifyResponse = {
  verified: boolean;
  verificationToken?: string;
};

export type ForgotPasswordResponse = {
  message: string;
  otpRequired: boolean;
};

export type ResetPasswordWithOtpRequest = {
  email: string;
  otpCode: string;
  newPassword: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
};

export async function registerUser(payload: RegisterRequest) {
  return apiRequest<AuthRegisterResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function loginUser(payload: LoginRequest) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function sendOtp(payload: OtpSendRequest) {
  return apiRequest<OtpSendResponse>("/auth/otp/send", {
    method: "POST",
    body: payload,
  });
}

export async function verifyOtp(payload: OtpVerifyRequest) {
  return apiRequest<OtpVerifyResponse>("/auth/otp/verify", {
    method: "POST",
    body: payload,
  });
}

export async function forgotPassword(email: string) {
  return apiRequest<ForgotPasswordResponse>("/auth/password/forgot", {
    method: "POST",
    body: { email },
  });
}

export async function resetPasswordWithOtp(payload: ResetPasswordWithOtpRequest) {
  return apiRequest<{ message: string; updatedAt: string }>("/auth/password/reset-with-otp", {
    method: "POST",
    body: payload,
  });
}

export async function refreshToken(refreshToken: string) {
  return apiRequest<RefreshTokenResponse>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
}

export async function logout(refreshToken: string) {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}
