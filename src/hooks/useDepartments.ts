import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { departmentService, DepartmentApiServiceError } from "@/lib/api/departmentApi";
import { PagedResult } from "@/types/userManagement";
import type {
  DepartmentResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentFilters,
  DepartmentDashboardResponse,
  DepartmentMembersResponse,
  DepartmentMemberRequest,
  DepartmentMeetingResponse,
  DepartmentMeetingRequest,
  DepartmentActivityResponse,
  DepartmentActivityRequest,
  DepartmentGoalResponse,
  DepartmentGoalRequest,
  DepartmentBudgetResponse,
  DepartmentBudgetRequest,
  DepartmentStatsResponse
} from "@/types/department";

interface UseDepartmentsOptions {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseDepartmentsReturn {
  departments: PagedResult<DepartmentResponse> | null;
  loading: boolean;
  error: DepartmentApiServiceError | null;
  refetch: () => Promise<void>;
  createDepartment: (data: CreateDepartmentRequest) => Promise<DepartmentResponse>;
  updateDepartment: (id: string, data: UpdateDepartmentRequest) => Promise<DepartmentResponse>;
  deleteDepartment: (id: string, force?: boolean) => Promise<void>;
  updateDepartmentStatus: (id: string, status: string) => Promise<DepartmentResponse>;
  getFilteredDepartments: (filters: DepartmentFilters) => Promise<PagedResult<DepartmentResponse>>;
}

export const useDepartments = (options: UseDepartmentsOptions = {}): UseDepartmentsReturn => {
  const [departments, setDepartments] = useState<PagedResult<DepartmentResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DepartmentApiServiceError | null>(null);
  const { hasPermission } = useAuth();

  const {
    page = 0,
    size = 10,
    search,
    status,
    autoRefresh = false,
    refreshInterval = 30000 // 30 seconds
  } = options;

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Temporarily disable permission check
      // if (!hasPermission("settings:read")) {
      //   throw new DepartmentApiServiceError(
      //     "Insufficient permissions",
      //     403,
      //     "FORBIDDEN",
      //     new Date().toISOString()
      //   );
      // }

      const result = await departmentService.getDepartments(page, size, search, status);
      setDepartments(result);
    } catch (err) {
      setError(err as DepartmentApiServiceError);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, status, hasPermission]);

  const refetch = useCallback(async () => {
    await fetchDepartments();
  }, [fetchDepartments]);

  const createDepartment = useCallback(async (data: CreateDepartmentRequest): Promise<DepartmentResponse> => {
    try {
      if (!hasPermission("settings:write")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to create department",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      const result = await departmentService.createDepartment(data);
      await refetch(); // Refresh the list
      return result;
    } catch (err) {
      setError(err as DepartmentApiServiceError);
      throw err;
    }
  }, [hasPermission, refetch]);

  const updateDepartment = useCallback(async (id: string, data: UpdateDepartmentRequest): Promise<DepartmentResponse> => {
    try {
      if (!hasPermission("settings:write")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to update department",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      const result = await departmentService.updateDepartment(id, data);
      await refetch(); // Refresh the list
      return result;
    } catch (err) {
      setError(err as DepartmentApiServiceError);
      throw err;
    }
  }, [hasPermission, refetch]);

  const deleteDepartment = useCallback(async (id: string, force: boolean = false): Promise<void> => {
    try {
      if (!hasPermission("churches:delete")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to delete department",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      await departmentService.deleteDepartment(id, force);
      await refetch(); // Refresh the list
    } catch (err) {
      setError(err as DepartmentApiServiceError);
      throw err;
    }
  }, [hasPermission, refetch]);

  const updateDepartmentStatus = useCallback(async (id: string, status: string): Promise<DepartmentResponse> => {
    try {
      if (!hasPermission("settings:write")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to update department status",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      const result = await departmentService.updateDepartmentStatus(id, { status: status as any });
      await refetch(); // Refresh the list
      return result;
    } catch (err) {
      setError(err as DepartmentApiServiceError);
      throw err;
    }
  }, [hasPermission, refetch]);

  const getFilteredDepartments = useCallback(async (filters: DepartmentFilters): Promise<PagedResult<DepartmentResponse>> => {
    try {
      if (!hasPermission("settings:read")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to read departments",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      return await departmentService.getFilteredDepartments(page, size, filters);
    } catch (err) {
      setError(err as DepartmentApiServiceError);
      throw err;
    }
  }, [page, size, hasPermission]);

  // Initial fetch
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Auto refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDepartments();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchDepartments]);

  return {
    departments,
    loading,
    error,
    refetch,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    updateDepartmentStatus,
    getFilteredDepartments
  };
};

// Hook for single department
interface UseDepartmentReturn {
  department: DepartmentResponse | null;
  loading: boolean;
  error: DepartmentApiServiceError | null;
  refetch: () => Promise<void>;
  updateDepartment: (data: UpdateDepartmentRequest) => Promise<DepartmentResponse>;
  deleteDepartment: (force?: boolean) => Promise<void>;
}

export const useDepartment = (id: string): UseDepartmentReturn => {
  const [department, setDepartment] = useState<DepartmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DepartmentApiServiceError | null>(null);
  const { hasPermission } = useAuth();

  const fetchDepartment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!hasPermission("settings:read")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to read department",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      const result = await departmentService.getDepartment(id);
      setDepartment(result);
    } catch (err) {
      setError(err as DepartmentApiServiceError);
    } finally {
      setLoading(false);
    }
  }, [id, hasPermission]);

  const refetch = useCallback(async () => {
    await fetchDepartment();
  }, [fetchDepartment]);

  const updateDepartment = useCallback(async (data: UpdateDepartmentRequest): Promise<DepartmentResponse> => {
    try {
      if (!hasPermission("settings:write")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to update department",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      const result = await departmentService.updateDepartment(id, data);
      setDepartment(result);
      return result;
    } catch (err) {
      setError(err as DepartmentApiServiceError);
      throw err;
    }
  }, [id, hasPermission]);

  const deleteDepartment = useCallback(async (force: boolean = false): Promise<void> => {
    try {
      if (!hasPermission("churches:delete")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to delete department",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      await departmentService.deleteDepartment(id, force);
      setDepartment(null);
    } catch (err) {
      setError(err as DepartmentApiServiceError);
      throw err;
    }
  }, [id, hasPermission]);

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  return {
    department,
    loading,
    error,
    refetch,
    updateDepartment,
    deleteDepartment
  };
};

// Hook for department dashboard
export const useDepartmentDashboard = (id: string) => {
  const [dashboard, setDashboard] = useState<DepartmentDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DepartmentApiServiceError | null>(null);
  const { hasPermission } = useAuth();

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!hasPermission("settings:read")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to read department dashboard",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      const result = await departmentService.getDepartmentDashboard(id);
      setDashboard(result);
    } catch (err) {
      setError(err as DepartmentApiServiceError);
    } finally {
      setLoading(false);
    }
  }, [id, hasPermission]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refetch: fetchDashboard };
};

// Hook for department members
export const useDepartmentMembers = (id: string) => {
  const [members, setMembers] = useState<DepartmentMembersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DepartmentApiServiceError | null>(null);
  const { hasPermission } = useAuth();

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!hasPermission("members:read")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to read department members",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      const result = await departmentService.getDepartmentMembers(id);
      setMembers(result);
    } catch (err) {
      setError(err as DepartmentApiServiceError);
    } finally {
      setLoading(false);
    }
  }, [id, hasPermission]);

  const addMember = useCallback(async (member: DepartmentMemberRequest) => {
    try {
      if (!hasPermission("members:write")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to add department member",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      await departmentService.addDepartmentMember(id, member);
      await fetchMembers(); // Refresh the list
    } catch (err) {
      setError(err as DepartmentApiServiceError);
      throw err;
    }
  }, [id, hasPermission, fetchMembers]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, error, refetch: fetchMembers, addMember };
};
