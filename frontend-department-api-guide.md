# Frontend Department API Guide

This guide provides comprehensive department details that the frontend can use to communicate with the backend for ChurchOS department management.

## Department Data Structure

### Core Department Information

```typescript
interface Department {
  // Basic Information
  id: string;                    // Unique identifier
  name: string;                  // Department name (e.g., "Choir")
  code: string;                  // Short code (e.g., "CHOIR")
  description: string;           // Detailed description
  
  // Classification
  category: DepartmentCategory;  // Type of department
  status: DepartmentStatus;      // Current status
  
  // Leadership
  leaderId?: string;             // User ID of department leader
  leaderName?: string;           // Display name of leader
  assistantLeaderIds?: string[]; // Assistant leader IDs
  
  // Meeting Information
  meetingDay?: MeetingDay;       // Primary meeting day
  meetingTime?: string;          // Meeting time (e.g., "10:00 AM")
  meetingFrequency: MeetingFrequency; // How often meetings occur
  meetingLocation?: string;      // Where meetings are held
  
  // Organizational Structure
  parentDepartmentId?: string;   // For sub-departments
  subDepartmentIds?: string[];   // Child departments
  
  // Department Identity
  foundingDate?: string;         // When department was established
  visionStatement?: string;      // Department vision
  missionStatement?: string;     // Department mission
  coreValues?: string[];         // Core values array
  requirements?: string[];        // Requirements to join
  responsibilities?: string[];    // Member responsibilities
  skills?: string[];             // Desired skills
  tags?: string[];               // Searchable tags
  
  // Contact & Branding
  avatarUrl?: string;            // Department logo/image
  bannerUrl?: string;            // Department banner image
  contactEmail?: string;         // Department contact email
  contactPhone?: string;         // Department contact phone
  websiteUrl?: string;           // Department website
  socialMediaLinks?: Record<string, string>; // Social media URLs
  
  // Configuration
  settings: DepartmentSettings;   // Department-specific settings
  statistics: DepartmentStatistics; // Department statistics
  
  // Dynamic Data
  members: DepartmentMember[];   // All department members
  meetings: DepartmentMeeting[]; // Scheduled meetings
  activities: DepartmentActivity[]; // Department activities
  goals: DepartmentGoal[];       // Department goals
  budgets: DepartmentBudget[];   // Budget information
  
  // Metadata
  createdAt: string;             // Creation timestamp
  updatedAt: string;             // Last update timestamp
  createdBy: string;             // User who created department
  updatedBy?: string;            // User who last updated
}
```

### Department Categories

```typescript
type DepartmentCategory = 
  | "MINISTRY"        // Worship, prayer, discipleship
  | "SERVICE"         // Ushers, security, parking
  | "ADMINISTRATION"  // Office, finance, HR
  | "OUTREACH"        // Evangelism, community service
  | "WORSHIP"         // Music, choir, instruments
  | "DISCIPLESHIP"    // Teaching, mentoring, training
  | "SUPPORT"         // Technical, maintenance, media
  | "LEADERSHIP";     // Pastoral, elders, deacons
```

### Department Status

```typescript
type DepartmentStatus = 
  | "ACTIVE"     // Department is fully operational
  | "INACTIVE"   // Department temporarily paused
  | "SUSPENDED"; // Department suspended due to issues
```

## Frontend API Operations

### 1. Get All Departments

```typescript
// Request
GET /api/departments?status=ACTIVE&category=MINISTRY&search=choir

// Response
{
  "items": Department[],
  "page": 1,
  "size": 20,
  "totalItems": 50,
  "totalPages": 3
}
```

### 2. Create Department

```typescript
// Request
POST /api/departments
{
  "name": "Youth Ministry",
  "code": "YOUTH",
  "description": "Engaging and discipling young people",
  "category": "DISCIPLESHIP",
  "meetingDay": "SATURDAY",
  "meetingTime": "4:00 PM",
  "meetingFrequency": "WEEKLY",
  "meetingLocation": "Youth Hall",
  "visionStatement": "To raise godly youth who impact their generation",
  "requirements": ["Age 13-25", "Committed to spiritual growth"],
  "leaderId": "user-123"
}

// Response
{
  "success": true,
  "data": Department
}
```

### 3. Update Department

```typescript
// Request
PUT /api/departments/{id}
{
  "description": "Updated description",
  "meetingTime": "5:00 PM",
  "status": "ACTIVE"
}

// Response
{
  "success": true,
  "data": Department
}
```

### 4. Department Members Management

```typescript
// Add member
POST /api/departments/{id}/members
{
  "userId": "user-456",
  "role": "MEMBER",
  "notes": "Skilled in guitar playing"
}

// Remove member
DELETE /api/departments/{id}/members/{memberId}

// Update member role
PUT /api/departments/{id}/members/{memberId}
{
  "role": "ASSISTANT_LEADER"
}
```

### 5. Department Meetings

```typescript
// Schedule meeting
POST /api/departments/{id}/meetings
{
  "title": "Weekly Practice",
  "description": "Regular choir practice",
  "scheduledDate": "2024-05-15",
  "startTime": "18:00",
  "endTime": "20:00",
  "location": "Sanctuary",
  "meetingType": "REGULAR",
  "isRecurring": true,
  "recurrencePattern": "weekly"
}

// Get upcoming meetings
GET /api/departments/{id}/meetings?upcoming=true&limit=10
```

### 6. Department Activities

```typescript
// Create activity
POST /api/departments/{id}/activities
{
  "title": "Summer Music Workshop",
  "description": "Training for choir members",
  "activityType": "TRAINING",
  "startDate": "2024-06-01",
  "endDate": "2024-06-03",
  "location": "Church Hall",
  "participants": ["user-123", "user-456"],
  "budget": 500
}
```

### 7. Department Goals

```typescript
// Set goal
POST /api/departments/{id}/goals
{
  "title": "Increase Membership",
  "description": "Grow department to 50 members",
  "category": "MEMBERSHIP",
  "targetValue": 50,
  "unit": "members",
  "deadline": "2024-12-31",
  "priority": "HIGH"
}

// Update goal progress
PUT /api/departments/{id}/goals/{goalId}
{
  "currentValue": 35,
  "status": "IN_PROGRESS"
}
```

### 8. Department Budget

```typescript
// Create budget
POST /api/departments/{id}/budgets
{
  "fiscalYear": "2024",
  "allocatedAmount": 5000,
  "budgetCategories": [
    {
      "category": "Equipment",
      "allocatedAmount": 2000,
      "description": "Musical instruments"
    },
    {
      "category": "Events",
      "allocatedAmount": 3000,
      "description": "Concerts and workshops"
    }
  ]
}
```

## Frontend Implementation Examples

### Department Form Component

```typescript
interface DepartmentFormProps {
  department?: Department;
  onSubmit: (data: CreateDepartmentRequest | UpdateDepartmentRequest) => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ department, onSubmit }) => {
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    name: department?.name || '',
    code: department?.code || '',
    description: department?.description || '',
    category: department?.category || 'MINISTRY',
    meetingFrequency: department?.meetingFrequency || 'WEEKLY',
    // ... other fields
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Department Name"
        required
      />
      <select
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value as DepartmentCategory})}
      >
        <option value="MINISTRY">Ministry</option>
        <option value="SERVICE">Service</option>
        <option value="ADMINISTRATION">Administration</option>
        {/* ... other options */}
      </select>
      {/* ... other form fields */}
      <button type="submit">
        {department ? 'Update Department' : 'Create Department'}
      </button>
    </form>
  );
};
```

### Department Dashboard Component

```typescript
const DepartmentDashboard: React.FC<{departmentId: string}> = ({ departmentId }) => {
  const [dashboard, setDashboard] = useState<DepartmentDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(`/api/departments/${departmentId}/dashboard`);
        setDashboard(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [departmentId]);

  if (loading) return <div>Loading...</div>;
  if (!dashboard) return <div>Department not found</div>;

  return (
    <div>
      <h1>{dashboard.department.name}</h1>
      <p>{dashboard.department.description}</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Members</h3>
          <p>{dashboard.department.statistics.totalMembers}</p>
        </div>
        <div className="stat-card">
          <h3>Active Members</h3>
          <p>{dashboard.department.statistics.activeMembers}</p>
        </div>
        {/* ... other stats */}
      </div>

      <div className="upcoming-meetings">
        <h2>Upcoming Meetings</h2>
        {dashboard.upcomingMeetings.map(meeting => (
          <div key={meeting.id}>
            <h3>{meeting.title}</h3>
            <p>{meeting.scheduledDate} at {meeting.startTime}</p>
            <p>{meeting.location}</p>
          </div>
        ))}
      </div>

      <div className="recent-activities">
        <h2>Recent Activities</h2>
        {dashboard.recentActivities.map(activity => (
          <div key={activity.id}>
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
            <p>Status: {activity.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## API Response Format

### Success Response

```typescript
{
  "success": true,
  "data": Department | Department[] | PagedResult<Department>,
  "message": "Operation completed successfully"
}
```

### Error Response

```typescript
{
  "success": false,
  "error": {
    "code": "DEPARTMENT_NOT_FOUND",
    "message": "Department with ID '123' not found",
    "details": {
      "field": "id",
      "value": "123"
    }
  }
}
```

## Best Practices

1. **Validation**: Always validate department data on both frontend and backend
2. **Error Handling**: Implement proper error handling for all API calls
3. **Loading States**: Show loading indicators during API operations
4. **Caching**: Cache frequently accessed department data
5. **Real-time Updates**: Consider WebSocket for real-time department updates
6. **Permissions**: Check user permissions before allowing department operations
7. **Audit Trail**: Log all department changes for accountability

## Common Use Cases

1. **Department Directory**: Display all departments with filtering and search
2. **Department Management**: CRUD operations for administrators
3. **Member Management**: Add/remove members, assign roles
4. **Meeting Scheduling**: Schedule and manage department meetings
5. **Activity Tracking**: Track department activities and events
6. **Goal Setting**: Set and track department goals
7. **Budget Management**: Manage department budgets and expenses
8. **Reporting**: Generate department reports and analytics
9. **Notifications**: Send department notifications and reminders
10. **Dashboard**: Department overview with statistics and recent activity
