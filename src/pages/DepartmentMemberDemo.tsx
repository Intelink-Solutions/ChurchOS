import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Users, Building2 } from "lucide-react";
import { SimpleMemberForm } from "@/components/members/SimpleMemberForm";
import { DepartmentProvider } from "@/components/departments/MockDepartmentDropdown";
import type { MemberRecord } from "@/types/userManagement";

// Mock members data for demonstration
const mockMembers: MemberRecord[] = [
  {
    id: "1",
    type: "MEMBER",
    fullName: "John Smith",
    gender: "MALE",
    dateOfBirth: "1985-05-15",
    phone: "(555) 123-4567",
    email: "john.smith@example.com",
    address: "123 Main St, New York, NY",
    nationality: "American",
    occupation: "Software Engineer",
    membershipDate: "2020-01-15",
    memberStatus: "ACTIVE",
    baptismStatus: "BAPTIZED",
    workerStatus: "WORKER",
    departments: ["1"], // Choir department
    maritalStatus: "MARRIED",
    emergencyContact: "Jane Smith",
    emergencyPhone: "(555) 123-4568",
    bornAgain: true,
    baptismDate: "2018-06-15",
    foundationClassCompleted: true,
    leadershipTrainingCompleted: false,
    createdAt: "2020-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "2",
    type: "MEMBER",
    fullName: "Sarah Johnson",
    gender: "FEMALE",
    dateOfBirth: "1990-08-22",
    phone: "(555) 987-6543",
    email: "sarah.johnson@example.com",
    address: "456 Oak Ave, Brooklyn, NY",
    nationality: "American",
    occupation: "Teacher",
    membershipDate: "2021-03-20",
    memberStatus: "ACTIVE",
    baptismStatus: "BAPTIZED",
    workerStatus: "WORKER",
    departments: ["3"], // Youth Ministry department
    maritalStatus: "SINGLE",
    emergencyContact: "Robert Johnson",
    emergencyPhone: "(555) 987-6544",
    bornAgain: true,
    baptismDate: "2019-09-10",
    foundationClassCompleted: true,
    leadershipTrainingCompleted: true,
    createdAt: "2021-03-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  {
    id: "3",
    type: "MEMBER",
    fullName: "Michael Brown",
    gender: "MALE",
    dateOfBirth: "1978-12-10",
    phone: "(555) 456-7890",
    email: "michael.brown@example.com",
    address: "789 Pine St, Queens, NY",
    nationality: "American",
    occupation: "Accountant",
    membershipDate: "2019-06-10",
    memberStatus: "ACTIVE",
    baptismStatus: "BAPTIZED",
    workerStatus: "WORKER",
    departments: ["7"], // Prayer Team department
    maritalStatus: "MARRIED",
    emergencyContact: "Lisa Brown",
    emergencyPhone: "(555) 456-7891",
    bornAgain: true,
    baptismDate: "2017-04-20",
    foundationClassCompleted: true,
    leadershipTrainingCompleted: false,
    createdAt: "2019-06-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z"
  }
];

// Mock department names for display
const departmentNames: Record<string, string> = {
  "1": "Choir",
  "2": "Media Team", 
  "3": "Youth Ministry",
  "4": "Ushers",
  "5": "Children Ministry",
  "6": "Evangelism",
  "7": "Prayer Team",
  "8": "Protocol"
};

export default function DepartmentMemberDemo() {
  const [members, setMembers] = useState<MemberRecord[]>(mockMembers);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateMember = async (memberData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMember: MemberRecord = {
        id: (members.length + 1).toString(),
        type: "MEMBER",
        fullName: memberData.fullName,
        gender: memberData.gender,
        dateOfBirth: memberData.dateOfBirth,
        phone: memberData.phone,
        email: memberData.email,
        address: memberData.address,
        nationality: "American",
        occupation: memberData.occupation,
        membershipDate: new Date().toISOString().split('T')[0],
        memberStatus: memberData.memberStatus,
        baptismStatus: "BAPTIZED",
        workerStatus: "WORKER",
        departments: memberData.departmentId ? [memberData.departmentId] : [],
        maritalStatus: "SINGLE",
        emergencyContact: "",
        emergencyPhone: "",
        bornAgain: true,
        baptismDate: "",
        foundationClassCompleted: true,
        leadershipTrainingCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setMembers(prev => [...prev, newMember]);
      setShowCreateForm(false);
      
      console.log("Member created:", newMember);
      if (memberData.departmentId) {
        console.log(`Member assigned to department ${memberData.departmentId} - department member count should update`);
      }
    } catch (err) {
      setError("Failed to create member");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMember = async (memberData: any) => {
    if (!editingMember) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedMember: MemberRecord = {
        ...editingMember,
        fullName: memberData.fullName,
        gender: memberData.gender,
        dateOfBirth: memberData.dateOfBirth,
        phone: memberData.phone,
        email: memberData.email,
        address: memberData.address,
        occupation: memberData.occupation,
        memberStatus: memberData.memberStatus,
        departments: memberData.departmentId ? [memberData.departmentId] : [],
        updatedAt: new Date().toISOString()
      };

      setMembers(prev => prev.map(m => m.id === editingMember.id ? updatedMember : m));
      setEditingMember(null);
      
      console.log("Member updated:", updatedMember);
      if (memberData.departmentId !== editingMember.departments?.[0]) {
        console.log(`Member transferred from department ${editingMember.departments?.[0]} to ${memberData.departmentId} - counts should update`);
      }
    } catch (err) {
      setError("Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: "default",
      INACTIVE: "secondary",
      VISITOR: "outline"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const getDepartmentName = (departmentIds: string[]) => {
    if (!departmentIds || departmentIds.length === 0) return "No Department";
    return departmentNames[departmentIds[0]] || "Unknown Department";
  };

  return (
    <DepartmentProvider>
      <DashboardLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Department Member Management</h1>
            <p className="text-muted-foreground">
              Manage member department assignments and see real-time member count updates.
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />Add Member
          </Button>
        </div>

        {/* Info Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            <strong>Demo Mode:</strong> This is a demonstration of department dropdown functionality without backend integration. 
            The department field shows as a dropdown with mock data. Check the console to see department assignment/transfer logs.
          </AlertDescription>
        </Alert>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-foreground">{members.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Members in Departments</p>
                <p className="text-2xl font-bold text-foreground">
                  {members.filter(m => m.departments && m.departments.length > 0).length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department Assignments</p>
                <p className="text-2xl font-bold text-foreground">
                  {members.reduce((sum, m) => sum + (m.departments?.length || 0), 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Members Table */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Members with Department Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{member.fullName}</p>
                        <p className="text-xs text-muted-foreground">{member.occupation}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{member.email}</p>
                        <p className="text-xs text-muted-foreground">{member.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getDepartmentName(member.departments)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(member.memberStatus)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingMember(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Member Dialog */}
        <Dialog open={showCreateForm || !!editingMember} onOpenChange={(open) => {
          if (!open) {
            setShowCreateForm(false);
            setEditingMember(null);
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Edit Member" : "Create New Member"}
              </DialogTitle>
            </DialogHeader>
            <SimpleMemberForm
              member={editingMember || undefined}
              onSubmit={editingMember ? handleUpdateMember : handleCreateMember}
              onCancel={() => {
                setShowCreateForm(false);
                setEditingMember(null);
              }}
              loading={loading}
              error={error}
            />
          </DialogContent>
        </Dialog>
        </div>
      </DashboardLayout>
    </DepartmentProvider>
  );
}
