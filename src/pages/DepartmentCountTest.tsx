import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Users, Building2, ArrowRight } from "lucide-react";
import { DepartmentProvider } from "@/contexts/DepartmentContext";
import { MockDepartmentDropdown } from "@/components/departments/MockDepartmentDropdown";
import { useMemberDepartmentAssignment } from "@/hooks/useMemberDepartmentAssignment";
import { useDepartmentContext } from "@/contexts/DepartmentContext";

// Mock departments data
const mockDepartments = [
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
    id: "7", 
    name: "Prayer Team", 
    category: "PRAYER_WARRIOR", 
    totalMembers: 0, // Starting with 0 to test updates
    description: "Intercessory prayer ministry"
  },
];

function DepartmentCountTestContent() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [testMemberName, setTestMemberName] = useState("Test Member");
  const { departments, updateDepartmentMemberCount } = useDepartmentContext();
  const { assignMemberToDepartment, loading, error } = useMemberDepartmentAssignment();

  const handleTestAssignment = async () => {
    if (!selectedDepartment) {
      alert("Please select a department first");
      return;
    }

    try {
      await assignMemberToDepartment(
        "test-member-id",
        testMemberName,
        selectedDepartment,
        "MEMBER"
      );
      
      // Find the department for display
      const dept = mockDepartments.find(d => d.id === selectedDepartment);
      console.log(`✅ ${testMemberName} assigned to ${dept?.name}`);
      
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  const handleManualUpdate = (departmentId: string, change: number) => {
    updateDepartmentMemberCount(departmentId, change);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Department Member Count Test</h1>
          <p className="text-muted-foreground">
            Test real-time department member count updates when members are assigned.
          </p>
        </div>
      </div>

      {/* Test Instructions */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-800">
          <strong>How to test:</strong><br/>
          1. Select "Prayer Team" from the dropdown (starts with 0 members)<br/>
          2. Click "Assign Test Member" to add a member<br/>
          3. Watch the member count update from 0 to 1 in real-time<br/>
          4. Check the console for detailed logs
        </AlertDescription>
      </Alert>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Test Controls */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Test Member Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Member Name</label>
              <input
                type="text"
                value={testMemberName}
                onChange={(e) => setTestMemberName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter test member name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Select Department</label>
              <MockDepartmentDropdown
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                placeholder="Select department to test"
                showMemberCount={true}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleTestAssignment} 
            disabled={loading || !selectedDepartment}
            className="w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            {loading ? "Assigning..." : "Assign Test Member"}
          </Button>
        </CardContent>
      </Card>

      {/* Department List with Real-time Counts */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Department Member Counts (Real-time)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockDepartments.map((dept) => {
              const currentDept = departments.find(d => d.id === dept.id);
              const memberCount = currentDept?.statistics?.totalMembers || dept.totalMembers;
              
              return (
                <Card key={dept.id} className="border-2 border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{dept.name}</h3>
                      {getCategoryBadge(dept.category)}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-2xl font-bold text-blue-600">{memberCount}</span>
                      <span className="text-sm text-muted-foreground">members</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{dept.description}</p>
                    
                    {/* Manual Controls for Testing */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleManualUpdate(dept.id, 1)}
                      >
                        +1
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleManualUpdate(dept.id, -1)}
                      >
                        -1
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Assignment Flow Demo */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Assignment Flow Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <span>Member</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="h-4 w-4 text-green-600" />
              </div>
              <span>Department</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-purple-600">+1</span>
              </div>
              <span>Count Update</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            When a member is assigned to a department, the member count updates immediately in real-time across all components.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DepartmentCountTest() {
  return (
    <DepartmentProvider>
      <DashboardLayout>
        <DepartmentCountTestContent />
      </DashboardLayout>
    </DepartmentProvider>
  );
}
