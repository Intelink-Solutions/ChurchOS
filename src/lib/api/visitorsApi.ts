import { PagedResult } from "@/types/userManagement";
import { apiRequest } from "@/lib/api/httpClient";

// Visitor Types
export type VisitorFollowUpStatus = 
  | "New Visitor"
  | "Contacted"
  | "Invited to Service"
  | "Attended Again"
  | "Converted to Member";

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  firstVisit: string;
  invitedBy: string;
  followUp: VisitorFollowUpStatus;
  prayerRequest?: string;
  address?: string;
  age?: number;
  gender?: "MALE" | "FEMALE";
  maritalStatus?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  occupation?: string;
  howDidYouHear?: string;
  notes?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export interface CreateVisitorRequest {
  name: string;
  phone: string;
  email?: string;
  firstVisit?: string;
  invitedBy?: string;
  prayerRequest?: string;
  address?: string;
  age?: number;
  gender?: "MALE" | "FEMALE";
  maritalStatus?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  occupation?: string;
  howDidYouHear?: string;
  notes?: string;
}

export interface UpdateVisitorRequest {
  name?: string;
  phone?: string;
  email?: string;
  invitedBy?: string;
  followUp?: VisitorFollowUpStatus;
  prayerRequest?: string;
  address?: string;
  age?: number;
  gender?: "MALE" | "FEMALE";
  maritalStatus?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  occupation?: string;
  howDidYouHear?: string;
  notes?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface VisitorStats {
  totalVisitors: number;
  firstTimeThisWeek: number;
  followUpsPending: number;
  convertedToMembers: number;
  conversionRate: number;
  averageVisitsBeforeConversion: number;
  period: string;
}

export interface VisitorKanbanResponse {
  [stage: string]: Visitor[];
}

export interface UpdateFollowUpRequest {
  followUp: VisitorFollowUpStatus;
  notes?: string;
}

export interface BulkUpdateFollowUpRequest {
  visitorIds: string[];
  followUp: VisitorFollowUpStatus;
  notes?: string;
}

export interface ConvertVisitorToMemberRequest {
  memberData: {
    fullName: string;
    phone: string;
    email?: string;
    gender?: "MALE" | "FEMALE";
    dateOfBirth?: string;
    address?: string;
    maritalStatus?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
    occupation?: string;
    departments?: string[];
    membershipDate?: string;
  };
}

export interface ConvertVisitorToMemberResponse {
  visitorId: string;
  memberId: string;
  message: string;
  member: {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    membershipDate: string;
    memberStatus: string;
    createdAt: string;
  };
  timestamp: string;
}

// API Error Types
export interface VisitorApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}

class VisitorApiServiceError extends Error {
  constructor(
    public message: string,
    public status: number,
    public error: string,
    public timestamp: string
  ) {
    super(message);
    this.name = "VisitorApiServiceError";
  }
}

// Using centralized apiRequest from httpClient for proper authentication

export const visitorsApi = {
  // Get all visitors (paginated)
  async getVisitors(params: {
    page?: number;
    size?: number;
    search?: string;
    status?: "ACTIVE" | "INACTIVE";
    followUp?: VisitorFollowUpStatus;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
  } = {}): Promise<PagedResult<Visitor>> {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append("page", params.page.toString());
    if (params.size !== undefined) queryParams.append("size", params.size.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);
    if (params.followUp) queryParams.append("followUp", params.followUp);
    if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
    if (params.dateTo) queryParams.append("dateTo", params.dateTo);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortDirection) queryParams.append("sortDirection", params.sortDirection);

    const url = queryParams.toString() ? `/visitors?${queryParams.toString()}` : "/visitors";
    return apiRequest<PagedResult<Visitor>>(url);
  },

  // Get visitor by ID
  async getVisitor(id: string): Promise<Visitor> {
    return apiRequest<Visitor>(`/visitors/${id}`);
  },

  // Create new visitor
  async createVisitor(visitor: CreateVisitorRequest): Promise<Visitor> {
    return apiRequest<Visitor>(`/visitors`, {
      method: "POST",
      body: visitor,
    });
  },

  // Update visitor
  async updateVisitor(id: string, visitor: UpdateVisitorRequest): Promise<Visitor> {
    return apiRequest<Visitor>(`/visitors/${id}`, {
      method: "PUT",
      body: visitor,
    });
  },

  // Update visitor follow-up status
  async updateFollowUpStatus(id: string, request: UpdateFollowUpRequest): Promise<Visitor> {
    return apiRequest<Visitor>(`/visitors/${id}/follow-up`, {
      method: "PATCH",
      body: request,
    });
  },

  // Delete visitor
  async deleteVisitor(id: string): Promise<{ message: string; timestamp: string }> {
    return apiRequest<{ message: string; timestamp: string }>(`/visitors/${id}`, {
      method: "DELETE",
    });
  },

  // Get visitor statistics
  async getVisitorStats(period: "week" | "month" | "year" = "month"): Promise<VisitorStats> {
    return apiRequest<VisitorStats>(`/visitors/statistics?period=${period}`);
  },

  // Convert visitor to member
  async convertVisitorToMember(
    id: string, 
    request: ConvertVisitorToMemberRequest
  ): Promise<ConvertVisitorToMemberResponse> {
    return apiRequest<ConvertVisitorToMemberResponse>(`/visitors/${id}/convert-to-member`, {
      method: "POST",
      body: request,
    });
  },

  // Get kanban view
  async getKanbanView(): Promise<VisitorKanbanResponse> {
    return apiRequest<VisitorKanbanResponse>(`/visitors/kanban`);
  },

  // Bulk update follow-up status
  async bulkUpdateFollowUpStatus(request: BulkUpdateFollowUpRequest): Promise<{
    updatedCount: number;
    message: string;
    timestamp: string;
  }> {
    return apiRequest<{
      updatedCount: number;
      message: string;
      timestamp: string;
    }>(`/visitors/bulk-follow-up`, {
      method: "PATCH",
      body: request,
    });
  },
};

// Export types for use in components
// VisitorApiError is already exported above
