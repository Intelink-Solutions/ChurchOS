import { apiRequest } from "@/lib/api/httpClient";
import type { Branch, MemberRecord, PagedResult, RoleDefinition, UserProfile, UserStatus } from "@/types/userManagement";

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

export async function getUsers(query: UserListQuery = {}) {
  return apiRequest<PagedResult<UserProfile>>(`/users${toQuery(query)}`);
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
