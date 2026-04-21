import type { AuthUser } from "@/contexts/AuthContext";
import type { Permission } from "@/types/userManagement";

export function isSuperAdmin(user: AuthUser | null | undefined) {
  return user?.roleCode === "SUPER_ADMIN";
}

export function hasPermission(user: AuthUser | null | undefined, permission?: Permission) {
  if (!permission) return true;
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  const permissions = Array.isArray(user.permissions) ? user.permissions : [];
  return permissions.includes(permission);
}

export function hasAnyPermission(user: AuthUser | null | undefined, permissions: Permission[]) {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
  return permissions.some((permission) => userPermissions.includes(permission));
}
