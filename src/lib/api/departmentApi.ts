import { PagedResult } from "@/types/userManagement";
import {
  DepartmentResponse,
  DepartmentDashboardResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentFilters,
  DepartmentMembersResponse,
  DepartmentMemberItemResponse,
  DepartmentMemberRequest,
  DepartmentMeetingResponse,
  DepartmentMeetingRequest,
  DepartmentActivityResponse,
  DepartmentActivityRequest,
  DepartmentGoalResponse,
  DepartmentGoalRequest,
  DepartmentBudgetResponse,
  DepartmentBudgetRequest,
  DepartmentStatsResponse,
  DepartmentReportRequest,
  DepartmentReportResponse,
  UpdateDepartmentStatusRequest,
  AssignDepartmentLeaderRequest,
  AssignDepartmentMembersRequest,
  DepartmentApiError
} from "@/types/department";

const BASE_URL = "/api/v1/departments";

class DepartmentApiServiceError extends Error {
  constructor(
    public message: string,
    public status: number,
    public error: string,
    public timestamp: string
  ) {
    super(message);
    this.name = "DepartmentApiServiceError";
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: DepartmentApiError = await response.json().catch(() => ({
      message: "Unknown error occurred",
      status: response.status,
      error: "UNKNOWN_ERROR",
      timestamp: new Date().toISOString()
    }));
    throw new DepartmentApiServiceError(
      errorData.message,
      errorData.status,
      errorData.error,
      errorData.timestamp
    );
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.blob() as Promise<T>;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("churchos-access-token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
};

// Core Department Endpoints
export const departmentApi = {
  // Get all departments with pagination
  async getDepartments(
    page: number = 0,
    size: number = 10,
    search?: string,
    status?: string
  ): Promise<PagedResult<DepartmentResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
      ...(status && { status })
    });

    const response = await fetch(`${BASE_URL}?${params}`, {
      headers: getAuthHeaders()
    });

    return handleResponse<PagedResult<DepartmentResponse>>(response);
  },

  // Get filtered departments
  async getFilteredDepartments(
    page: number = 0,
    size: number = 10,
    filters: DepartmentFilters
  ): Promise<PagedResult<DepartmentResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    const response = await fetch(`${BASE_URL}/filter?${params}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(filters)
    });

    return handleResponse<PagedResult<DepartmentResponse>>(response);
  },

  // Get department by ID
  async getDepartment(id: string): Promise<DepartmentResponse> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });

    return handleResponse<DepartmentResponse>(response);
  },

  // Get department dashboard
  async getDepartmentDashboard(id: string): Promise<DepartmentDashboardResponse> {
    const response = await fetch(`${BASE_URL}/${id}/dashboard`, {
      headers: getAuthHeaders()
    });

    return handleResponse<DepartmentDashboardResponse>(response);
  },

  // Create department
  async createDepartment(department: CreateDepartmentRequest): Promise<DepartmentResponse> {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(department)
    });

    return handleResponse<DepartmentResponse>(response);
  },

  // Update department
  async updateDepartment(
    id: string,
    department: UpdateDepartmentRequest
  ): Promise<DepartmentResponse> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(department)
    });

    return handleResponse<DepartmentResponse>(response);
  },

  // Update department status
  async updateDepartmentStatus(
    id: string,
    status: UpdateDepartmentStatusRequest
  ): Promise<DepartmentResponse> {
    const response = await fetch(`${BASE_URL}/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(status)
    });

    return handleResponse<DepartmentResponse>(response);
  },

  // Delete department
  async deleteDepartment(id: string, force: boolean = false): Promise<void> {
    const params = new URLSearchParams({ force: force.toString() });
    const response = await fetch(`${BASE_URL}/${id}?${params}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    return handleResponse<void>(response);
  },

  // Get department statistics
  async getDepartmentStats(id: string): Promise<DepartmentStatsResponse> {
    const response = await fetch(`${BASE_URL}/${id}/stats`, {
      headers: getAuthHeaders()
    });

    return handleResponse<DepartmentStatsResponse>(response);
  }
};

// Department Members Endpoints
export const departmentMembersApi = {
  // Get department members
  async getDepartmentMembers(id: string): Promise<DepartmentMembersResponse> {
    const response = await fetch(`${BASE_URL}/${id}/members`, {
      headers: getAuthHeaders()
    });

    return handleResponse<DepartmentMembersResponse>(response);
  },

  // Add department member
  async addDepartmentMember(
    id: string,
    member: DepartmentMemberRequest
  ): Promise<DepartmentMemberItemResponse> {
    const response = await fetch(`${BASE_URL}/${id}/members`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(member)
    });

    return handleResponse<any>(response);
  },

  // Update department member
  async updateDepartmentMember(
    id: string,
    memberId: string,
    member: DepartmentMemberRequest
  ): Promise<DepartmentMemberItemResponse> {
    const response = await fetch(`${BASE_URL}/${id}/members/${memberId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(member)
    });

    return handleResponse<any>(response);
  },

  // Remove department member
  async removeDepartmentMember(id: string, memberId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}/members/${memberId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    return handleResponse<void>(response);
  },

  // Assign department leader
  async assignDepartmentLeader(
    id: string,
    leader: AssignDepartmentLeaderRequest
  ): Promise<DepartmentResponse> {
    const response = await fetch(`${BASE_URL}/${id}/leader`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(leader)
    });

    return handleResponse<DepartmentResponse>(response);
  },

  // Batch assign department members
  async batchAssignDepartmentMembers(
    id: string,
    members: AssignDepartmentMembersRequest
  ): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}/members/batch`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(members)
    });

    return handleResponse<void>(response);
  }
};

// Department Meetings Endpoints
export const departmentMeetingsApi = {
  // Get department meetings
  async getDepartmentMeetings(id: string): Promise<DepartmentMeetingResponse[]> {
    const response = await fetch(`${BASE_URL}/${id}/meetings`, {
      headers: getAuthHeaders()
    });

    return handleResponse<DepartmentMeetingResponse[]>(response);
  },

  // Create department meeting
  async createDepartmentMeeting(
    id: string,
    meeting: DepartmentMeetingRequest
  ): Promise<DepartmentMeetingResponse> {
    const response = await fetch(`${BASE_URL}/${id}/meetings`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(meeting)
    });

    return handleResponse<DepartmentMeetingResponse>(response);
  }
};

// Department Activities Endpoints
export const departmentActivitiesApi = {
  // Get department activities
  async getDepartmentActivities(id: string): Promise<DepartmentActivityResponse[]> {
    const response = await fetch(`${BASE_URL}/${id}/activities`, {
      headers: getAuthHeaders()
    });

    return handleResponse<DepartmentActivityResponse[]>(response);
  },

  // Create department activity
  async createDepartmentActivity(
    id: string,
    activity: DepartmentActivityRequest
  ): Promise<DepartmentActivityResponse> {
    const response = await fetch(`${BASE_URL}/${id}/activities`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(activity)
    });

    return handleResponse<DepartmentActivityResponse>(response);
  }
};

// Department Goals Endpoints
export const departmentGoalsApi = {
  // Get department goals
  async getDepartmentGoals(id: string): Promise<DepartmentGoalResponse[]> {
    const response = await fetch(`${BASE_URL}/${id}/goals`, {
      headers: getAuthHeaders()
    });

    return handleResponse<DepartmentGoalResponse[]>(response);
  },

  // Create department goal
  async createDepartmentGoal(
    id: string,
    goal: DepartmentGoalRequest
  ): Promise<DepartmentGoalResponse> {
    const response = await fetch(`${BASE_URL}/${id}/goals`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(goal)
    });

    return handleResponse<DepartmentGoalResponse>(response);
  }
};

// Department Budget Endpoints
export const departmentBudgetsApi = {
  // Get department budgets
  async getDepartmentBudgets(id: string): Promise<DepartmentBudgetResponse[]> {
    const response = await fetch(`${BASE_URL}/${id}/budgets`, {
      headers: getAuthHeaders()
    });

    return handleResponse<DepartmentBudgetResponse[]>(response);
  },

  // Create department budget
  async createDepartmentBudget(
    id: string,
    budget: DepartmentBudgetRequest
  ): Promise<DepartmentBudgetResponse> {
    const response = await fetch(`${BASE_URL}/${id}/budgets`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(budget)
    });

    return handleResponse<DepartmentBudgetResponse>(response);
  }
};

// Reports Endpoints
export const departmentReportsApi = {
  // Generate department report
  async generateDepartmentReport(
    report: DepartmentReportRequest
  ): Promise<DepartmentReportResponse> {
    const response = await fetch(`${BASE_URL}/reports`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(report)
    });

    return handleResponse<DepartmentReportResponse>(response);
  }
};

// Export all APIs for easy import
export const departmentService = {
  ...departmentApi,
  ...departmentMembersApi,
  ...departmentMeetingsApi,
  ...departmentActivitiesApi,
  ...departmentGoalsApi,
  ...departmentBudgetsApi,
  ...departmentReportsApi
};

export { DepartmentApiServiceError };
export type { DepartmentApiError };
