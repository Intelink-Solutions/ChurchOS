export type DepartmentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type DepartmentCategory = 
  | "MINISTRY"
  | "SERVICE"
  | "ADMINISTRATION"
  | "OUTREACH"
  | "WORSHIP"
  | "DISCIPLESHIP"
  | "SUPPORT"
  | "LEADERSHIP"
  | "PRAYER_WARRIOR";

export type MeetingFrequency = 
  | "WEEKLY"
  | "BI_WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "AS_NEEDED";

export type MeetingDay = 
  | "MONDAY" 
  | "TUESDAY" 
  | "WEDNESDAY" 
  | "THURSDAY" 
  | "FRIDAY" 
  | "SATURDAY" 
  | "SUNDAY";

export type DepartmentRole = "LEADER" | "ASSISTANT_LEADER" | "MEMBER" | "VOLUNTEER";

export type DepartmentMember = {
  id: string;
  userId?: string;
  memberId?: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role: DepartmentRole;
  joinDate: string;
  status: "ACTIVE" | "INACTIVE";
  avatarUrl?: string;
  skills?: string[];
  notes?: string;
};

export type DepartmentMeeting = {
  id: string;
  title: string;
  description?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  location: string;
  meetingType: "REGULAR" | "SPECIAL" | "TRAINING" | "PLANNING";
  isRecurring: boolean;
  recurrencePattern?: string;
  attendanceRequired: boolean;
  maxAttendees?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentActivity = {
  id: string;
  title: string;
  description: string;
  activityType: "MEETING" | "EVENT" | "PROJECT" | "TRAINING" | "OUTREACH";
  startDate: string;
  endDate?: string;
  location?: string;
  status: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  participants: string[];
  budget?: number;
  actualCost?: number;
  outcomes?: string;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentBudget = {
  id: string;
  fiscalYear: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  budgetCategories: BudgetCategory[];
  lastUpdated: string;
};

export type BudgetCategory = {
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  description?: string;
};

export type DepartmentGoal = {
  id: string;
  title: string;
  description: string;
  category: "MEMBERSHIP" | "OUTREACH" | "TRAINING" | "FINANCIAL" | "SPIRITUAL";
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "ACHIEVED" | "OVERDUE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentSettings = {
  allowSelfJoin: boolean;
  requireApproval: boolean;
  maxMembers?: number;
  autoRemovalInactivityDays?: number;
  meetingRemindersEnabled: boolean;
  reminderLeadTimeHours: number;
  attendanceTrackingEnabled: boolean;
  budgetTrackingEnabled: boolean;
  publicVisibility: boolean;
  allowGuestSpeakers: boolean;
  requireBackgroundCheck: boolean;
};

export type DepartmentStatistics = {
  totalMembers: number;
  activeMembers: number;
  averageAttendance: number;
  meetingFrequency: number;
  budgetUtilization: number;
  goalsCompleted: number;
  totalGoals: number;
  memberGrowthRate: number;
  lastMeetingDate?: string;
  nextMeetingDate?: string;
};

export type Department = {
  id: string;
  name: string;
  code: string;
  description: string;
  category: DepartmentCategory;
  status: DepartmentStatus;
  leaderId?: string;
  leaderName?: string;
  assistantLeaderIds?: string[];
  meetingDay?: MeetingDay;
  meetingTime?: string;
  meetingFrequency: MeetingFrequency;
  meetingLocation?: string;
  parentDepartmentId?: string;
  subDepartmentIds?: string[];
  foundingDate?: string;
  visionStatement?: string;
  missionStatement?: string;
  coreValues?: string[];
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  tags?: string[];
  avatarUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  socialMediaLinks?: Record<string, string>;
  settings: DepartmentSettings;
  statistics: DepartmentStatistics;
  members: DepartmentMember[];
  meetings: DepartmentMeeting[];
  activities: DepartmentActivity[];
  goals: DepartmentGoal[];
  budgets: DepartmentBudget[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
};

export type CreateDepartmentRequest = {
  name: string;
  code: string;
  description: string;
  category: DepartmentCategory;
  meetingDay?: MeetingDay;
  meetingTime?: string;
  meetingFrequency: MeetingFrequency;
  meetingLocation?: string;
  parentDepartmentId?: string;
  foundingDate?: string;
  visionStatement?: string;
  missionStatement?: string;
  coreValues?: string[];
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  tags?: string[];
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  socialMediaLinks?: Record<string, string>;
  settings?: Partial<DepartmentSettings>;
  leaderId?: string;
  assistantLeaderIds?: string[];
};

export type UpdateDepartmentRequest = Partial<CreateDepartmentRequest> & {
  status?: DepartmentStatus;
  settings?: Partial<DepartmentSettings>;
};

export type DepartmentMemberRequest = {
  userId?: string;
  memberId?: string;
  role: DepartmentRole;
  notes?: string;
};

export type DepartmentMeetingRequest = {
  title: string;
  description?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  location: string;
  meetingType: "REGULAR" | "SPECIAL" | "TRAINING" | "PLANNING";
  isRecurring: boolean;
  recurrencePattern?: string;
  attendanceRequired: boolean;
  maxAttendees?: number;
  notes?: string;
};

export type DepartmentActivityRequest = {
  title: string;
  description: string;
  activityType: "MEETING" | "EVENT" | "PROJECT" | "TRAINING" | "OUTREACH";
  startDate: string;
  endDate?: string;
  location?: string;
  participants: string[];
  budget?: number;
};

export type DepartmentGoalRequest = {
  title: string;
  description: string;
  category: "MEMBERSHIP" | "OUTREACH" | "TRAINING" | "FINANCIAL" | "SPIRITUAL";
  targetValue?: number;
  unit?: string;
  deadline: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

export type DepartmentFilters = {
  status?: DepartmentStatus[];
  category?: DepartmentCategory[];
  leaderId?: string[];
  meetingDay?: MeetingDay[];
  hasVacancies?: boolean;
  parentDepartmentId?: string;
  search?: string;
  sortBy?: "name" | "createdAt" | "memberCount" | "status";
  sortOrder?: "asc" | "desc";
};

export type DepartmentMemberFilters = {
  role?: DepartmentRole[];
  status?: "ACTIVE" | "INACTIVE"[];
  search?: string;
  sortBy?: "fullName" | "joinDate" | "role";
  sortOrder?: "asc" | "desc";
};

export type DepartmentDashboard = {
  department: Department;
  recentActivities: DepartmentActivity[];
  upcomingMeetings: DepartmentMeeting[];
  memberActivity: {
    newMembers: number;
    activeMembers: number;
    recentJoins: DepartmentMember[];
  };
  goalProgress: DepartmentGoal[];
  budgetOverview: DepartmentBudget;
  attendanceTrends: {
    period: string;
    attendance: number;
  }[];
};

export type DepartmentReport = {
  id: string;
  departmentId: string;
  reportType: "MEMBERSHIP" | "FINANCIAL" | "ACTIVITY" | "GOALS" | "COMPREHENSIVE";
  title: string;
  description?: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  data: Record<string, any>;
  generatedBy: string;
};

export type DepartmentNotification = {
  id: string;
  departmentId: string;
  type: "MEETING_REMINDER" | "ACTIVITY_ANNOUNCEMENT" | "MEMBER_JOIN" | "GOAL_UPDATE" | "BUDGET_ALERT";
  title: string;
  message: string;
  scheduledFor?: string;
  sentAt?: string;
  recipients: string[];
  channels: ("EMAIL" | "SMS" | "PUSH" | "IN_APP")[];
  status: "PENDING" | "SENT" | "FAILED";
  createdAt: string;
};

// Backend API Response Types
export type DepartmentResponse = {
  id: string;
  name: string;
  code: string;
  description?: string;
  category: DepartmentCategory;
  status: DepartmentStatus;
  leaderId?: string;
  leaderName?: string;
  assistantLeaderIds?: string[];
  meetingDay?: MeetingDay;
  meetingTime?: string;
  meetingFrequency: MeetingFrequency;
  meetingLocation?: string;
  parentDepartmentId?: string;
  subDepartmentIds?: string[];
  foundingDate?: string;
  visionStatement?: string;
  missionStatement?: string;
  coreValues?: string[];
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  tags?: string[];
  avatarUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  socialMediaLinks?: Record<string, string>;
  settings: DepartmentSettings;
  statistics: DepartmentStatistics;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
};

export type DepartmentMemberItemResponse = {
  id: string;
  userId?: string;
  memberId?: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role: DepartmentRole;
  joinDate: string;
  status: "ACTIVE" | "INACTIVE";
  avatarUrl?: string;
  skills?: string[];
  notes?: string;
};

export type DepartmentMembersResponse = {
  items: DepartmentMemberItemResponse[];
  totalItems: number;
};

export type DepartmentMeetingResponse = {
  id: string;
  title: string;
  description?: string;
  scheduledDate: string;
  startTime: string;
  endTime?: string;
  location?: string;
  meetingType: "REGULAR" | "SPECIAL" | "TRAINING" | "PLANNING";
  isRecurring?: boolean;
  recurrencePattern?: string;
  attendanceRequired?: boolean;
  maxAttendees?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentActivityResponse = {
  id: string;
  title: string;
  description: string;
  activityType: "MEETING" | "EVENT" | "PROJECT" | "TRAINING" | "OUTREACH";
  startDate: string;
  endDate?: string;
  location?: string;
  status: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  participants: string[];
  budget?: number;
  actualCost?: number;
  outcomes?: string;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentGoalResponse = {
  id: string;
  title: string;
  description: string;
  category: "MEMBERSHIP" | "OUTREACH" | "TRAINING" | "FINANCIAL" | "SPIRITUAL";
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "ACHIEVED" | "OVERDUE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentBudgetResponse = {
  id: string;
  fiscalYear: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  budgetCategories: BudgetCategory[];
  lastUpdated: string;
};

export type MemberActivityResponse = {
  newMembers: number;
  activeMembers: number;
  recentJoins: DepartmentMemberItemResponse[];
};

export type AttendanceTrendResponse = {
  period: string;
  attendance: number;
};

export type DepartmentDashboardResponse = {
  department: DepartmentResponse;
  recentActivities: DepartmentActivityResponse[];
  upcomingMeetings: DepartmentMeetingResponse[];
  memberActivity: MemberActivityResponse;
  goalProgress: DepartmentGoalResponse[];
  budgetOverview: DepartmentBudgetResponse;
  attendanceTrends: AttendanceTrendResponse[];
};

export type DepartmentStatsResponse = {
  totalDepartments: number;
  activeDepartments: number;
  totalDepartmentMembers: number;
  departmentLeaders: number;
};

// Backend Request Types
export type DepartmentSettingsRequest = {
  allowSelfJoin?: boolean;
  requireApproval?: boolean;
  maxMembers?: number;
  autoRemovalInactivityDays?: number;
  meetingRemindersEnabled?: boolean;
  reminderLeadTimeHours?: number;
  attendanceTrackingEnabled?: boolean;
  budgetTrackingEnabled?: boolean;
  publicVisibility?: boolean;
  allowGuestSpeakers?: boolean;
  requireBackgroundCheck?: boolean;
};

export type UpdateDepartmentStatusRequest = {
  status: DepartmentStatus;
};

export type AssignDepartmentLeaderRequest = {
  leaderUserId: string;
};

export type AssignDepartmentMembersRequest = {
  memberIds: string[];
};

export type BudgetCategoryRequest = {
  category: string;
  allocatedAmount: number;
  description?: string;
};

export type DepartmentBudgetRequest = {
  fiscalYear: string;
  allocatedAmount: number;
  budgetCategories: BudgetCategoryRequest[];
};

export type DepartmentReportRequest = {
  category?: DepartmentCategory;
  startDate?: Date;
  endDate?: Date;
  reportType?: string;
  format?: string;
  includeMembers?: boolean;
  includeMeetings?: boolean;
  includeActivities?: boolean;
  includeGoals?: boolean;
  includeBudgets?: boolean;
};

export type DepartmentReportResponse = {
  reportId: string;
  reportType: string;
  reportData: ArrayBuffer;
  fileName: string;
  generatedAt: Date;
  generatedBy: string;
};

// API Error Response
export type DepartmentApiError = {
  message: string;
  timestamp: string;
  status: number;
  error: string;
};
