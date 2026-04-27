import { useState, useEffect, createContext, useContext } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

// Mock departments data for testing without backend
const initialMockDepartments = [
  { 
    id: "1", 
    name: "Choir", 
    category: "WORSHIP", 
    totalMembers: 24,
    description: "Praise and worship ministry"
  },
  { 
    id: "2", 
    name: "Media Team", 
    category: "SERVICE", 
    totalMembers: 12,
    description: "Audio, visual, and streaming"
  },
  { 
    id: "3", 
    name: "Youth Ministry", 
    category: "DISCIPLESHIP", 
    totalMembers: 45,
    description: "Youth engagement and discipleship"
  },
  { 
    id: "4", 
    name: "Ushers", 
    category: "SERVICE", 
    totalMembers: 18,
    description: "Church hospitality and seating"
  },
  { 
    id: "5", 
    name: "Children Ministry", 
    category: "DISCIPLESHIP", 
    totalMembers: 15,
    description: "Children's church and Sunday school"
  },
  { 
    id: "6", 
    name: "Evangelism", 
    category: "OUTREACH", 
    totalMembers: 20,
    description: "Outreach and soul winning"
  },
  { 
    id: "7", 
    name: "Prayer Team", 
    category: "PRAYER_WARRIOR", 
    totalMembers: 0,
    description: "Intercessory prayer ministry"
  },
  { 
    id: "8", 
    name: "Protocol", 
    category: "SERVICE", 
    totalMembers: 10,
    description: "VIP reception and order"
  },
  { 
    id: "9", 
    name: "Pastoral Care", 
    category: "MINISTRY", 
    totalMembers: 8,
    description: "Pastoral support and counseling"
  },
  { 
    id: "10", 
    name: "Church Administration", 
    category: "ADMINISTRATION", 
    totalMembers: 5,
    description: "Church office and administration"
  },
  { 
    id: "11", 
    name: "Technical Support", 
    category: "SUPPORT", 
    totalMembers: 6,
    description: "IT and technical support"
  },
  { 
    id: "12", 
    name: "Leadership Team", 
    category: "LEADERSHIP", 
    totalMembers: 12,
    description: "Church leadership and governance"
  },
];

// Context for department member count management
interface DepartmentContextType {
  departments: typeof initialMockDepartments;
  updateDepartmentMemberCount: (departmentId: string, change: number) => void;
  getDepartmentMemberCount: (departmentId: string) => number;
}

const DepartmentContext = createContext<DepartmentContextType | null>(null);

export function useDepartmentContext() {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartmentContext must be used within DepartmentProvider');
  }
  return context;
}

export function DepartmentProvider({ children }: { children: React.ReactNode }) {
  const [departments, setDepartments] = useState(initialMockDepartments);

  const updateDepartmentMemberCount = (departmentId: string, change: number) => {
    setDepartments(prev => 
      prev.map(dept => 
        dept.id === departmentId 
          ? { ...dept, totalMembers: Math.max(0, dept.totalMembers + change) }
          : dept
      )
    );
  };

  const getDepartmentMemberCount = (departmentId: string) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept?.totalMembers || 0;
  };

  return (
    <DepartmentContext.Provider value={{
      departments,
      updateDepartmentMemberCount,
      getDepartmentMemberCount
    }}>
      {children}
    </DepartmentContext.Provider>
  );
}

interface MockDepartmentDropdownProps {
  value?: string;
  onChange: (departmentId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showMemberCount?: boolean;
  filterByStatus?: string;
  filterByCategory?: string;
  className?: string;
}

export function MockDepartmentDropdown({
  value,
  onChange,
  placeholder = "Select a department",
  disabled = false,
  showMemberCount = true,
  filterByStatus,
  filterByCategory,
  className
}: MockDepartmentDropdownProps) {
  const { departments, updateDepartmentMemberCount, getDepartmentMemberCount } = useDepartmentContext();

  // Apply filters if specified
  let filteredDepartments = departments;
  
  if (filterByStatus) {
    filteredDepartments = filteredDepartments.filter(dept => 
      dept.category === filterByStatus // Using category as status for mock
    );
  }
  
  if (filterByCategory) {
    filteredDepartments = filteredDepartments.filter(dept => 
      dept.category === filterByCategory
    );
  }

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
        disabled={disabled}
      >
        <SelectTrigger id="department-dropdown">
          <SelectValue placeholder={placeholder}>
            {selectedDepartment && (
              <div className="flex items-center gap-2">
                <span>{selectedDepartment.name}</span>
                {getCategoryBadge(selectedDepartment.category)}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {filteredDepartments.map((department) => (
            <SelectItem key={department.id} value={department.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span>{department.name}</span>
                  {getCategoryBadge(department.category)}
                </div>
                {showMemberCount && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {department.totalMembers} members
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
          {filteredDepartments.length === 0 && (
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

// Simple hook for department member management (mock version)
export function useMockDepartmentMemberManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateDepartmentMemberCount } = useDepartmentContext();

  const assignMemberToDepartment = async (
    userId: string,
    departmentId: string,
    role: string = "MEMBER"
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Mock API call - in real implementation this would call the backend
      console.log(`Assigning user ${userId} to department ${departmentId} with role ${role}`);
      
      // Update department member count
      updateDepartmentMemberCount(departmentId, 1);
      console.log(`Department ${departmentId} member count increased by 1`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success response
      return {
        id: "mock-member-id",
        userId,
        departmentId,
        role,
        joinDate: new Date().toISOString()
      };
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

      // Mock API call
      console.log(`Removing member ${memberId} from department ${departmentId}`);
      
      // Update department member count
      updateDepartmentMemberCount(departmentId, -1);
      console.log(`Department ${departmentId} member count decreased by 1`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

      console.log(`Updating member ${userId} department from ${oldDepartmentId} to ${newDepartmentId}`);
      
      // Handle department transfers
      if (oldDepartmentId && newDepartmentId && oldDepartmentId !== newDepartmentId) {
        // Remove from old department
        updateDepartmentMemberCount(oldDepartmentId, -1);
        console.log(`Department ${oldDepartmentId} member count decreased by 1 (member left)`);
        
        // Add to new department
        updateDepartmentMemberCount(newDepartmentId, 1);
        console.log(`Department ${newDepartmentId} member count increased by 1 (member joined)`);
      } else if (newDepartmentId && !oldDepartmentId) {
        // New assignment
        updateDepartmentMemberCount(newDepartmentId, 1);
        console.log(`Department ${newDepartmentId} member count increased by 1 (new member)`);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

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
