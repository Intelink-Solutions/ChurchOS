import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useDepartments } from "@/hooks/useDepartments";
import type { DepartmentResponse } from "@/types/department";

interface DepartmentDropdownProps {
  value?: string;
  onChange: (departmentId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showMemberCount?: boolean;
  filterByStatus?: string;
  filterByCategory?: string;
  className?: string;
}

export function DepartmentDropdown({
  value,
  onChange,
  placeholder = "Select a department",
  disabled = false,
  showMemberCount = true,
  filterByStatus,
  filterByCategory,
  className
}: DepartmentDropdownProps) {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch departments for dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        // Get all departments without pagination for dropdown
        const response = await fetch("/api/v1/departments?size=100", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("churchos-access-token")}`,
            "Content-Type": "application/json"
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          let departmentsList = data.items || [];
          
          // Apply filters if specified
          if (filterByStatus) {
            departmentsList = departmentsList.filter((dept: DepartmentResponse) => 
              dept.status === filterByStatus
            );
          }
          
          if (filterByCategory) {
            departmentsList = departmentsList.filter((dept: DepartmentResponse) => 
              dept.category === filterByCategory
            );
          }
          
          setDepartments(departmentsList);
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [filterByStatus, filterByCategory]);

  const getCategoryBadge = (category: string) => {
    const colors = {
      MINISTRY: "bg-purple-600",
      SERVICE: "bg-blue-600",
      ADMINISTRATION: "bg-green-600",
      OUTREACH: "bg-orange-600",
      WORSHIP: "bg-pink-600",
      DISCIPLESHIP: "bg-indigo-600",
      SUPPORT: "bg-gray-600",
      LEADERSHIP: "bg-red-600",
      PRAYER_WARRIOR: "bg-yellow-600"
    };

    return (
      <Badge className={colors[category as keyof typeof colors] || "bg-gray-600"}>
        {category.replace('_', ' ')}
      </Badge>
    );
  };

  const selectedDepartment = departments.find(dept => dept.id === value);

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="department-dropdown">Department</Label>
      <Select 
        value={value} 
        onValueChange={onChange} 
        disabled={disabled || loading}
      >
        <SelectTrigger id="department-dropdown">
          <SelectValue placeholder={loading ? "Loading departments..." : placeholder}>
            {selectedDepartment && (
              <div className="flex items-center gap-2">
                <span>{selectedDepartment.name}</span>
                {getCategoryBadge(selectedDepartment.category)}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {departments.map((department) => (
            <SelectItem key={department.id} value={department.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span>{department.name}</span>
                  {getCategoryBadge(department.category)}
                </div>
                {showMemberCount && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {department.statistics.totalMembers} members
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
          {departments.length === 0 && !loading && (
            <SelectItem value="" disabled>
              No departments available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {selectedDepartment && (
        <p className="text-xs text-muted-foreground">
          {selectedDepartment.description}
        </p>
      )}
    </div>
  );
}

// Hook for department member management
export function useDepartmentMemberManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignMemberToDepartment = async (
    userId: string,
    departmentId: string,
    role: string = "MEMBER"
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/departments/${departmentId}/members`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("churchos-access-token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          role,
          joinDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to assign member to department");
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMemberFromDepartment = async (
    departmentId: string,
    memberId: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/departments/${departmentId}/members/${memberId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("churchos-access-token")}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove member from department");
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMemberDepartment = async (
    userId: string,
    oldDepartmentId?: string,
    newDepartmentId?: string,
    role: string = "MEMBER"
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Remove from old department if exists
      if (oldDepartmentId) {
        await removeMemberFromDepartment(oldDepartmentId, userId);
      }

      // Add to new department if specified
      if (newDepartmentId) {
        await assignMemberToDepartment(userId, newDepartmentId, role);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignMemberToDepartment,
    removeMemberFromDepartment,
    updateMemberDepartment,
    loading,
    error,
    setError
  };
}
