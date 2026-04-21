export type SystemRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "PASTOR"
  | "FINANCE_OFFICER"
  | "DEPARTMENT_LEAD"
  | "MEMBER";

export type UserStatus = "ACTIVE" | "INVITED" | "SUSPENDED" | "LOCKED" | "DISABLED";

export type OtpPurpose =
  | "EMAIL_VERIFICATION"
  | "PASSWORD_RESET"
  | "TWO_FACTOR_AUTH"
  | "PHONE_VERIFICATION";

export type Permission =
  | "members:read"
  | "members:write"
  | "members:delete"
  | "users:read"
  | "users:write"
  | "roles:read"
  | "roles:write"
  | "finance:read"
  | "finance:write"
  | "settings:read"
  | "settings:write"
  | "attendance:read"
  | "attendance:write"
  | "events:read"
  | "events:write"
  | "communications:send"
  | "reports:read"
  | "churches:read"
  | "churches:create"
  | "churches:update"
  | "churches:delete"
  | "churches:approve"
  | "auditlogs:read";

export type PermissionScope = "GLOBAL" | "BRANCH" | "SELF";

export type PermissionScopeMap = Partial<Record<Permission, PermissionScope[]>>;

export type RoleDefinition = {
  id: string;
  name: string;
  code: SystemRole;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
  userCount: number;
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  branchId?: string;
  roleCode: SystemRole;
  status: UserStatus;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  memberId?: string | null;
};

export type Branch = {
  id: string;
  name: string;
  pastorName?: string;
  location: string;
  status: "ACTIVE" | "INACTIVE";
  memberCount: number;
};

export type MemberType = "MEMBER" | "NEW_MEMBER" | "VISITOR" | "TRANSFER";

export type MemberRecord = {
  id: string;
  type: MemberType;
  fullName: string;
  userId?: string | null;
  gender?: "MALE" | "FEMALE";
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  nationality?: string;
  occupation?: string;
  membershipDate?: string;
  memberStatus?: "ACTIVE" | "INACTIVE" | "VISITOR";
  baptismStatus?: "BAPTIZED" | "NOT_BAPTIZED";
  workerStatus?: "WORKER" | "NON_WORKER";
  departments?: string[];
  maritalStatus?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  spouseName?: string;
  numberOfChildren?: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  bornAgain?: boolean;
  baptismDate?: string;
  foundationClassCompleted?: boolean;
  leadershipTrainingCompleted?: boolean;
  invitedBy?: string;
  firstVisitDate?: string;
  howDidYouHearAboutUs?: string;
  originalBranch?: string;
  transferDate?: string;
  transferReason?: string;
  additionalNotes?: string;
  prayerRequests?: string;
  createdAt: string;
  updatedAt: string;
};

export type ChurchStatus = "PENDING_APPROVAL" | "ACTIVE" | "DEACTIVATED";

export type ChurchRecord = {
  id: string;
  name: string;
  location: string;
  description?: string;
  status: ChurchStatus;
  adminUserId?: string | null;
  memberCount?: number;
};

export type AuditLogRecord = {
  id: string;
  actorUserId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type OtpSendRequest = {
  channel: "EMAIL" | "SMS";
  destination: string;
  purpose: OtpPurpose;
};

export type OtpVerifyRequest = {
  destination: string;
  purpose: OtpPurpose;
  otpCode: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  otpCode?: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresInSeconds: number;
  user: UserProfile;
  permissions?: Permission[];
  permissionScopes?: PermissionScopeMap;
};

export type ApiErrorResponse = {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  validationErrors?: Record<string, string | string[]>;
};
