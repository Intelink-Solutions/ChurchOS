# ChurchOS Frontend Integration Contract

This document defines how the Spring Boot backend should support authentication, OTP, roles, and user management for this frontend.

## OTP-First Authentication Requirement

The frontend now uses OTP for verification-sensitive flows.

Supported OTP purposes:
- `EMAIL_VERIFICATION`
- `PASSWORD_RESET`
- `TWO_FACTOR_AUTH`
- `PHONE_VERIFICATION`

Rules:
- One OTP service should handle all OTP purposes.
- OTP must be short-lived (recommended 5 to 10 minutes).
- OTP must be single-use.
- Resend should be rate limited.
- Backend should track attempts and lock temporarily after too many failed tries.

## Frontend Auth Flows

### Register + Email Verification OTP
1. User submits register form.
2. Backend creates pending user and sends OTP.
3. User enters OTP in `/otp`.
4. Backend verifies OTP and marks email as verified.
5. User can log in.

### Forgot Password with OTP
1. User submits email in `/forgot-password`.
2. Backend sends `PASSWORD_RESET` OTP.
3. User enters OTP in `/otp`.
4. User is redirected to `/reset-password`.
5. Backend resets password after OTP validation.

### Login (Optional 2FA OTP)
1. User submits email + password.
2. Backend may require `TWO_FACTOR_AUTH` OTP based on policy.
3. User verifies OTP.
4. Backend returns tokens.

## Required Auth Endpoints

### POST `/api/v1/auth/register`
Request fields:
- `firstName` string required
- `lastName` string required
- `email` string required
- `password` string required
- `phoneNumber` string optional

Response fields:
- `userId`
- `status` (`PENDING_VERIFICATION`)
- `otpRequired` boolean

### POST `/api/v1/auth/login`
Request fields:
- `email`
- `password`
- `otpCode` optional

Response fields:
- `accessToken`
- `refreshToken`
- `tokenType` (`Bearer`)
- `expiresInSeconds`
- `user`

### POST `/api/v1/auth/otp/send`
Request fields:
- `channel` (`EMAIL` or `SMS`)
- `destination` (email or phone)
- `purpose` (one of the OTP purposes above)

Response fields:
- `requestId`
- `expiresAt`
- `resendAvailableAt`

### POST `/api/v1/auth/otp/verify`
Request fields:
- `destination`
- `purpose`
- `otpCode`

Response fields:
- `verified` boolean
- `verificationToken` string optional (for chained actions like password reset)

### POST `/api/v1/auth/password/forgot`
Request fields:
- `email`

Response fields:
- `message`
- `otpRequired` true

### POST `/api/v1/auth/password/reset-with-otp`
Request fields:
- `email`
- `otpCode`
- `newPassword`

Response fields:
- `message`
- `updatedAt`

### POST `/api/v1/auth/refresh`
Request fields:
- `refreshToken`

Response fields:
- `accessToken`
- `refreshToken`
- `expiresInSeconds`

### POST `/api/v1/auth/logout`
Request fields:
- `refreshToken` or server-side session key

Response fields:
- `message`

## Role and Permission Model

Recommended system roles:
- `SUPER_ADMIN`
- `ADMIN`
- `PASTOR`
- `FINANCE_OFFICER`
- `DEPARTMENT_LEAD`
- `MEMBER`

Recommended permission keys:
- `members:read`
- `members:write`
- `members:delete`
- `users:read`
- `users:write`
- `roles:read`
- `roles:write`
- `finance:read`
- `finance:write`
- `settings:read`
- `settings:write`
- `attendance:read`
- `attendance:write`
- `events:read`
- `events:write`
- `communications:send`
- `reports:read`

## User Management Endpoints

### GET `/api/v1/users`
Supports query params:
- `page`
- `size`
- `search`
- `status`
- `role`
- `branchId`

### GET `/api/v1/users/{id}`
Returns a single user profile.

### POST `/api/v1/users`
Creates a system user and optionally sends invite/OTP.

### PUT `/api/v1/users/{id}`
Updates profile and role assignments.

### PATCH `/api/v1/users/{id}/status`
Changes user status (`ACTIVE`, `SUSPENDED`, `LOCKED`, `DISABLED`).

### DELETE `/api/v1/users/{id}`
Soft delete preferred.

### POST `/api/v1/users/{id}/resend-invite`
Resends invite OTP/email.

## Role Management Endpoints

### GET `/api/v1/roles`
Returns role catalog and permission mapping.

### POST `/api/v1/roles`
Creates custom role.

### PUT `/api/v1/roles/{id}`
Updates role metadata and permissions.

### DELETE `/api/v1/roles/{id}`
Deletes custom role if no protected dependency.

## Member Management Endpoints

### GET `/api/v1/members`
Supports query params:
- `page`
- `size`
- `search`
- `status`
- `memberType`
- `department`

### GET `/api/v1/members/{id}`

### POST `/api/v1/members`

### PUT `/api/v1/members/{id}`

### DELETE `/api/v1/members/{id}`

### POST `/api/v1/members/import`
CSV import endpoint used by Members page import action.

## Required User Profile Fields

- `id`
- `firstName`
- `lastName`
- `fullName`
- `email`
- `phoneNumber`
- `avatarUrl`
- `branchId`
- `roleCode`
- `status`
- `emailVerified`
- `twoFactorEnabled`
- `lastLoginAt`
- `createdAt`
- `updatedAt`

## Required Member Fields

These fields reflect existing frontend forms and should be supported in backend DTOs.

- `id`
- `type` (`MEMBER`, `NEW_MEMBER`, `VISITOR`, `TRANSFER`)
- `fullName`
- `gender`
- `dateOfBirth`
- `phone`
- `email`
- `address`
- `nationality`
- `occupation`
- `membershipDate`
- `memberStatus`
- `baptismStatus`
- `workerStatus`
- `departments`
- `maritalStatus`
- `spouseName`
- `numberOfChildren`
- `emergencyContact`
- `emergencyPhone`
- `bornAgain`
- `baptismDate`
- `foundationClassCompleted`
- `leadershipTrainingCompleted`
- `invitedBy`
- `firstVisitDate`
- `howDidYouHearAboutUs`
- `originalBranch`
- `transferDate`
- `transferReason`
- `additionalNotes`
- `prayerRequests`
- `createdAt`
- `updatedAt`

## Branch Management Endpoints

### GET `/api/v1/branches`

### POST `/api/v1/branches`

### PUT `/api/v1/branches/{id}`

### DELETE `/api/v1/branches/{id}`

## Security and Backend Implementation Notes

- Use Spring Security with JWT access and refresh tokens.
- Never trust frontend role checks alone; enforce authorization server-side.
- Hash passwords with BCrypt.
- Add audit fields for create/update/status-change actions.
- Add CORS for frontend host.
- Add request validation and a consistent error response shape.

## Frontend Files Updated For OTP

- OTP screen: `src/pages/OtpVerification.tsx`
- OTP password reset screen: `src/pages/ResetPasswordOtp.tsx`
- Register flow sends email verification OTP: `src/pages/Register.tsx`
- Forgot password now sends OTP: `src/pages/ForgotPassword.tsx`
- Router paths: `src/App.tsx`
- Shared types for backend contracts: `src/types/userManagement.ts`
