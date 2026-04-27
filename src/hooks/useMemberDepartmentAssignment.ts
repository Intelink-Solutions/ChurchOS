import { useState } from "react";
import { departmentEvents } from "@/utils/departmentEvents";

export interface MemberDepartmentAssignmentOptions {
  memberId: string;
  memberName: string;
}

export function useMemberDepartmentAssignment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignMemberToDepartment = async (
    memberId: string,
    memberName: string,
    departmentId: string,
    role: string = "MEMBER"
  ) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🎯 Assigning ${memberName} (${memberId}) to department ${departmentId} as ${role}`);
      
      // Emit department update event
      departmentEvents.emit(departmentId, 1);
      
      // In a real implementation, this would be an API call
      // await memberApi.assignToDepartment(memberId, departmentId, role);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`✅ Successfully assigned ${memberName} to department ${departmentId}`);
      console.log(`📊 Department ${departmentId} member count increased by 1`);
      
      return {
        success: true,
        memberId,
        departmentId,
        role,
        message: `${memberName} has been assigned to the department`
      };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to assign member to department";
      setError(errorMessage);
      console.error(`❌ Failed to assign ${memberName} to department ${departmentId}:`, err);
      
      // Revert the optimistic update on error
      departmentEvents.emit(departmentId, -1);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMemberFromDepartment = async (
    memberId: string,
    memberName: string,
    departmentId: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🗑️ Removing ${memberName} (${memberId}) from department ${departmentId}`);
      
      // Update department member count immediately (optimistic update)
      departmentEvents.emit(departmentId, -1);
      
      // In a real implementation, this would be an API call
      // await memberApi.removeFromDepartment(memberId, departmentId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
            
      console.log(`✅ Successfully removed ${memberName} from department ${departmentId}`);
      console.log(`📊 Department ${departmentId} member count decreased by 1`);
      
      return {
        success: true,
        memberId,
        departmentId,
        message: `${memberName} has been removed from the department`
      };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove member from department";
      setError(errorMessage);
      console.error(`❌ Failed to remove ${memberName} from department ${departmentId}:`, err);
      
      // Revert the optimistic update on error
      departmentEvents.emit(departmentId, 1);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transferMemberBetweenDepartments = async (
    memberId: string,
    memberName: string,
    fromDepartmentId: string | undefined,
    toDepartmentId: string | undefined,
    role: string = "MEMBER"
  ) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Transferring ${memberName} (${memberId}) from department ${fromDepartmentId} to ${toDepartmentId}`);
      
      // Handle department transfers
      if (fromDepartmentId && toDepartmentId && fromDepartmentId !== toDepartmentId) {
        // Remove from old department
        departmentEvents.emit(fromDepartmentId, -1);
        console.log(`📊 Department ${fromDepartmentId} member count decreased by 1 (member left)`);
        
        // Add to new department
        departmentEvents.emit(toDepartmentId, 1);
        console.log(`📊 Department ${toDepartmentId} member count increased by 1 (member joined)`);
      } else if (toDepartmentId && !fromDepartmentId) {
        // New assignment
        departmentEvents.emit(toDepartmentId, 1);
        console.log(`📊 Department ${toDepartmentId} member count increased by 1 (new member)`);
      } else if (fromDepartmentId && !toDepartmentId) {
        // Member removed from all departments
        departmentEvents.emit(fromDepartmentId, -1);
        console.log(`📊 Department ${fromDepartmentId} member count decreased by 1 (member removed)`);
      }
      
      // In a real implementation, this would be an API call
      // await memberApi.updateDepartmentAssignment(memberId, toDepartmentId, role);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
            
      console.log(`✅ Successfully transferred ${memberName} between departments`);
      
      return {
        success: true,
        memberId,
        fromDepartmentId,
        toDepartmentId,
        role,
        message: `${memberName} has been transferred between departments`
      };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to transfer member between departments";
      setError(errorMessage);
      console.error(`❌ Failed to transfer ${memberName} between departments:`, err);
      
      // Revert optimistic updates on error
      if (fromDepartmentId && toDepartmentId && fromDepartmentId !== toDepartmentId) {
        departmentEvents.emit(fromDepartmentId, 1);
        departmentEvents.emit(toDepartmentId, -1);
      } else if (toDepartmentId && !fromDepartmentId) {
        departmentEvents.emit(toDepartmentId, -1);
      } else if (fromDepartmentId && !toDepartmentId) {
        departmentEvents.emit(fromDepartmentId, 1);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignMemberToDepartment,
    removeMemberFromDepartment,
    transferMemberBetweenDepartments,
    loading,
    error,
    setError
  };
}
