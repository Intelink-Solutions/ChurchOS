import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { departmentService } from "@/lib/api/departmentApi";
import type { DepartmentResponse } from "@/types/department";

interface DepartmentContextType {
  departments: DepartmentResponse[];
  updateDepartmentMemberCount: (departmentId: string, change: number) => void;
  refreshDepartments: () => Promise<void>;
  getDepartmentMemberCount: (departmentId: string) => number;
  loading: boolean;
  error: string | null;
}

const DepartmentContext = createContext<DepartmentContextType | null>(null);

export function useDepartmentContext() {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartmentContext must be used within DepartmentProvider');
  }
  return context;
}

interface DepartmentProviderProps {
  children: ReactNode;
}

export function DepartmentProvider({ children }: DepartmentProviderProps) {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await departmentService.getDepartments(0, 100);
      setDepartments(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const updateDepartmentMemberCount = (departmentId: string, change: number) => {
    setDepartments(prev => 
      prev.map(dept => 
        dept.id === departmentId 
          ? { 
              ...dept, 
              statistics: {
                ...dept.statistics,
                totalMembers: Math.max(0, dept.statistics.totalMembers + change),
                activeMembers: Math.max(0, dept.statistics.activeMembers + (change > 0 ? change : 0))
              }
            }
          : dept
      )
    );

    // Also update the backend (in real implementation)
    // This would be an API call to update the department statistics
    console.log(`Department ${departmentId} member count updated by ${change}`);
  };

  const getDepartmentMemberCount = (departmentId: string) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept?.statistics.totalMembers || 0;
  };

  useEffect(() => {
    refreshDepartments();
  }, []);

  return (
    <DepartmentContext.Provider value={{
      departments,
      updateDepartmentMemberCount,
      refreshDepartments,
      getDepartmentMemberCount,
      loading,
      error
    }}>
      {children}
    </DepartmentContext.Provider>
  );
}
