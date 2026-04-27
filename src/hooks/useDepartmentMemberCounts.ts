import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { departmentService, DepartmentApiServiceError } from "@/lib/api/departmentApi";
import type { DepartmentResponse } from "@/types/department";

interface DepartmentMemberCount {
  departmentId: string;
  departmentName: string;
  totalMembers: number;
  activeMembers: number;
  memberGrowthRate: number;
  lastUpdated: string;
}

interface UseDepartmentMemberCountsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  departmentIds?: string[];
}

export const useDepartmentMemberCounts = (options: UseDepartmentMemberCountsOptions = {}) => {
  const [memberCounts, setMemberCounts] = useState<DepartmentMemberCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DepartmentApiServiceError | null>(null);
  const { hasPermission } = useAuth();

  const {
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
    departmentIds
  } = options;

  const fetchMemberCounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!hasPermission("members:read")) {
        throw new DepartmentApiServiceError(
          "Insufficient permissions to read member counts",
          403,
          "FORBIDDEN",
          new Date().toISOString()
        );
      }

      // If specific department IDs are provided, fetch only those
      if (departmentIds && departmentIds.length > 0) {
        const counts: DepartmentMemberCount[] = [];
        
        for (const deptId of departmentIds) {
          try {
            const department = await departmentService.getDepartment(deptId);
            counts.push({
              departmentId: department.id,
              departmentName: department.name,
              totalMembers: department.statistics.totalMembers,
              activeMembers: department.statistics.activeMembers,
              memberGrowthRate: department.statistics.memberGrowthRate,
              lastUpdated: department.updatedAt
            });
          } catch (err) {
            console.error(`Failed to fetch member count for department ${deptId}:`, err);
          }
        }
        
        setMemberCounts(counts);
      } else {
        // Fetch all departments and their member counts
        const departmentsResponse = await departmentService.getDepartments(0, 100);
        
        const counts: DepartmentMemberCount[] = departmentsResponse.items.map(dept => ({
          departmentId: dept.id,
          departmentName: dept.name,
          totalMembers: dept.statistics.totalMembers,
          activeMembers: dept.statistics.activeMembers,
          memberGrowthRate: dept.statistics.memberGrowthRate,
          lastUpdated: dept.updatedAt
        }));
        
        setMemberCounts(counts);
      }
    } catch (err) {
      setError(err as DepartmentApiServiceError);
    } finally {
      setLoading(false);
    }
  }, [departmentIds, hasPermission]);

  const updateMemberCount = useCallback(async (departmentId: string, change: number) => {
    try {
      // Optimistic update
      setMemberCounts(prev => 
        prev.map(count => 
          count.departmentId === departmentId 
            ? { 
                ...count, 
                totalMembers: Math.max(0, count.totalMembers + change),
                activeMembers: Math.max(0, count.activeMembers + change),
                lastUpdated: new Date().toISOString()
              }
            : count
        )
      );

      // Fetch fresh data from server
      await fetchMemberCounts();
    } catch (err) {
      console.error("Failed to update member count:", err);
      // Revert optimistic update on error
      await fetchMemberCounts();
    }
  }, [fetchMemberCounts]);

  const incrementMemberCount = useCallback(async (departmentId: string) => {
    await updateMemberCount(departmentId, 1);
  }, [updateMemberCount]);

  const decrementMemberCount = useCallback(async (departmentId: string) => {
    await updateMemberCount(departmentId, -1);
  }, [updateMemberCount]);

  const transferMember = useCallback(async (fromDepartmentId: string, toDepartmentId: string) => {
    try {
      // Optimistic update
      setMemberCounts(prev => 
        prev.map(count => {
          if (count.departmentId === fromDepartmentId) {
            return {
              ...count,
              totalMembers: Math.max(0, count.totalMembers - 1),
              activeMembers: Math.max(0, count.activeMembers - 1),
              lastUpdated: new Date().toISOString()
            };
          }
          if (count.departmentId === toDepartmentId) {
            return {
              ...count,
              totalMembers: count.totalMembers + 1,
              activeMembers: count.activeMembers + 1,
              lastUpdated: new Date().toISOString()
            };
          }
          return count;
        })
      );

      // Fetch fresh data from server
      await fetchMemberCounts();
    } catch (err) {
      console.error("Failed to transfer member:", err);
      // Revert optimistic update on error
      await fetchMemberCounts();
    }
  }, [fetchMemberCounts]);

  // Initial fetch
  useEffect(() => {
    fetchMemberCounts();
  }, [fetchMemberCounts]);

  // Auto refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchMemberCounts();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchMemberCounts]);

  return {
    memberCounts,
    loading,
    error,
    refetch: fetchMemberCounts,
    incrementMemberCount,
    decrementMemberCount,
    transferMember,
    updateMemberCount
  };
};

// Hook for real-time department member updates
export const useDepartmentMemberUpdates = () => {
  const { memberCounts, incrementMemberCount, decrementMemberCount, transferMember } = 
    useDepartmentMemberCounts({ autoRefresh: true });

  const handleMemberJoined = useCallback(async (departmentId: string) => {
    await incrementMemberCount(departmentId);
  }, [incrementMemberCount]);

  const handleMemberLeft = useCallback(async (departmentId: string) => {
    await decrementMemberCount(departmentId);
  }, [decrementMemberCount]);

  const handleMemberTransferred = useCallback(async (
    fromDepartmentId: string, 
    toDepartmentId: string
  ) => {
    await transferMember(fromDepartmentId, toDepartmentId);
  }, [transferMember]);

  const handleMemberStatusChanged = useCallback(async (
    departmentId: string, 
    fromStatus: string, 
    toStatus: string
  ) => {
    // Update active member count based on status change
    const isActiveChange = (fromStatus === "ACTIVE" && toStatus !== "ACTIVE") || 
                          (fromStatus !== "ACTIVE" && toStatus === "ACTIVE");
    
    if (isActiveChange) {
      await incrementMemberCount(departmentId); // This will trigger a refetch
    }
  }, [incrementMemberCount]);

  return {
    memberCounts,
    handleMemberJoined,
    handleMemberLeft,
    handleMemberTransferred,
    handleMemberStatusChanged
  };
};
