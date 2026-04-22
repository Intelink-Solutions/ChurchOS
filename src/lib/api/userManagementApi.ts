import { apiRequest } from "@/lib/api/httpClient";
import type {
  AuditLogRecord,
  Branch,
  ChurchRecord,
  MemberRecord,
  PagedResult,
  RoleDefinition,
  UserProfile,
  UserStatus,
} from "@/types/userManagement";

export type UserListQuery = {
  page?: number;
  size?: number;
  search?: string;
  status?: UserStatus;
  role?: string;
  branchId?: string;
};

export type MemberListQuery = {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  memberType?: string;
  department?: string;
};

export type AuditLogQuery = {
  page?: number;
  size?: number;
  actorUserId?: string;
  action?: string;
  resourceType?: string;
};

function toQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

const ACCESS_TOKEN_STORAGE_KEY = "churchos-access-token";

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payloadPart] = token.split(".");
    if (!payloadPart) return null;

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function resolveCurrentUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (!token) return null;

  const payload = parseJwtPayload(token);
  if (!payload) return null;

  const candidates = [payload.userId, payload.uid, payload.id, payload.sub];

  for (const candidate of candidates) {
    if (typeof candidate === "number") return String(candidate);
    if (typeof candidate === "string" && /^\d+$/.test(candidate)) return candidate;
  }

  return null;
}

export async function getUsers(query: UserListQuery = {}) {
  return apiRequest<PagedResult<UserProfile>>(`/users${toQuery(query)}`);
}

export async function getCurrentUserProfile() {
  const userId = resolveCurrentUserIdFromToken();
  if (userId) {
    return getUserById(userId);
  }

  return apiRequest<UserProfile>("/users/me");
}

export async function searchUsersForDropdown(search?: string) {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest<PagedResult<UserProfile>>(`/users/search${params}`);
}

export async function getUserById(id: string) {
  return apiRequest<UserProfile>(`/users/${id}`);
}

export async function createUser(payload: Partial<UserProfile>) {
  return apiRequest<UserProfile>("/users", {
    method: "POST",
    body: payload,
  });
}

export async function updateUser(id: string, payload: Partial<UserProfile>) {
  return apiRequest<UserProfile>(`/users/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function updateUserStatus(id: string, status: UserStatus) {
  return apiRequest<UserProfile>(`/users/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deleteUser(id: string) {
  return apiRequest<{ message: string }>(`/users/${id}`, {
    method: "DELETE",
  });
}

export async function resendUserInvite(id: string) {
  return apiRequest<{ message: string }>(`/users/${id}/resend-invite`, {
    method: "POST",
  });
}

export async function getRoles() {
  return apiRequest<RoleDefinition[]>("/roles");
}

export async function createRole(payload: Partial<RoleDefinition>) {
  return apiRequest<RoleDefinition>("/roles", {
    method: "POST",
    body: payload,
  });
}

export async function updateRole(id: string, payload: Partial<RoleDefinition>) {
  return apiRequest<RoleDefinition>(`/roles/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteRole(id: string) {
  return apiRequest<{ message: string }>(`/roles/${id}`, {
    method: "DELETE",
  });
}

export async function getMembers(query: MemberListQuery = {}) {
  return apiRequest<PagedResult<MemberRecord>>(`/members${toQuery(query)}`);
}

export async function getMemberById(id: string) {
  return apiRequest<MemberRecord>(`/members/${id}`);
}

export async function createMember(payload: Partial<MemberRecord>) {
  return apiRequest<MemberRecord>("/members", {
    method: "POST",
    body: payload,
  });
}

export async function updateMember(id: string, payload: Partial<MemberRecord>) {
  return apiRequest<MemberRecord>(`/members/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export type PatchMemberPayload = Partial<MemberRecord> & {
  userId?: string | null;
  unlinkUser?: boolean;
};

export async function patchMember(id: string, payload: PatchMemberPayload) {
  return apiRequest<MemberRecord>(`/members/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteMember(id: string) {
  return apiRequest<{ message: string }>(`/members/${id}`, {
    method: "DELETE",
  });
}

export async function getBranches() {
  return apiRequest<Branch[]>("/branches");
}

export async function createBranch(payload: Partial<Branch>) {
  return apiRequest<Branch>("/branches", {
    method: "POST",
    body: payload,
  });
}

export async function updateBranch(id: string, payload: Partial<Branch>) {
  return apiRequest<Branch>(`/branches/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteBranch(id: string) {
  return apiRequest<{ message: string }>(`/branches/${id}`, {
    method: "DELETE",
  });
}

export async function getChurches() {
  return apiRequest<ChurchRecord[]>("/churches");
}

export async function getChurchById(id: string) {
  return apiRequest<ChurchRecord>(`/churches/${id}`);
}

export async function createChurch(payload: Pick<ChurchRecord, "name" | "location"> & Partial<Pick<ChurchRecord, "description">>) {
  return apiRequest<ChurchRecord>("/churches", {
    method: "POST",
    body: payload,
  });
}

export async function updateChurch(id: string, payload: Partial<ChurchRecord>) {
  return apiRequest<ChurchRecord>(`/churches/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteChurch(id: string) {
  return apiRequest<{ message: string }>(`/churches/${id}`, {
    method: "DELETE",
  });
}

export async function approveChurch(id: string) {
  return apiRequest<ChurchRecord>(`/churches/${id}/approve`, {
    method: "POST",
  });
}

export async function deactivateChurch(id: string) {
  return apiRequest<ChurchRecord>(`/churches/${id}/deactivate`, {
    method: "POST",
  });
}

export async function assignChurchAdmin(id: string, userId: string) {
  return apiRequest<ChurchRecord>(`/churches/${id}/assign-admin/${userId}`, {
    method: "POST",
  });
}

export async function getAdminAuditLogs(query: AuditLogQuery = {}) {
  return apiRequest<PagedResult<AuditLogRecord>>(`/admin/audit-logs${toQuery(query)}`);
}
