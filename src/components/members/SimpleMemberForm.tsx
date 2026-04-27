import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MockDepartmentDropdown, useMockDepartmentMemberManagement } from "@/components/departments/MockDepartmentDropdown";
import { useMemberDepartmentAssignment } from "@/hooks/useMemberDepartmentAssignment";
import type { MemberRecord } from "@/types/userManagement";

interface SimpleMemberFormProps {
  member?: MemberRecord;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
}

export function SimpleMemberForm({ 
  member, 
  onSubmit, 
  onCancel, 
  loading = false, 
  error 
}: SimpleMemberFormProps) {
  const [formData, setFormData] = useState({
    fullName: member?.fullName || "",
    email: member?.email || "",
    phone: member?.phone || "",
    address: member?.address || "",
    gender: member?.gender || "",
    dateOfBirth: member?.dateOfBirth || "",
    occupation: member?.occupation || "",
    departmentId: member?.departments?.[0] || "",
    departmentRole: "MEMBER",
    memberStatus: member?.memberStatus || "ACTIVE"
  });

  const [previousDepartmentId, setPreviousDepartmentId] = useState<string | undefined>(member?.departments?.[0]);

  const { updateMemberDepartment, loading: mockDepartmentLoading, error: mockDepartmentError } = useMockDepartmentMemberManagement();
  const { 
    assignMemberToDepartment, 
    transferMemberBetweenDepartments, 
    loading: assignmentLoading, 
    error: assignmentError 
  } = useMemberDepartmentAssignment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Submit member data
      await onSubmit(formData);

      // Handle department assignment/update with real-time count updates
      if (member?.id) {
        // Existing member - handle department transfer
        if (formData.departmentId !== previousDepartmentId) {
          console.log("Department changed, updating assignment...");
          await transferMemberBetweenDepartments(
            member.id,
            formData.fullName,
            previousDepartmentId,
            formData.departmentId,
            formData.departmentRole
          );
        }
      } else {
        // New member - handle department assignment
        if (formData.departmentId) {
          console.log("Assigning new member to department...");
          await assignMemberToDepartment(
            "new-member-id", // This would be the actual member ID after creation
            formData.fullName,
            formData.departmentId,
            formData.departmentRole
          );
        }
      }

    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleDepartmentChange = (departmentId: string) => {
    setFormData(prev => ({
      ...prev,
      departmentId: departmentId || ""
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {member ? "Edit Member" : "Add New Member"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(error || mockDepartmentError || assignmentError) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error || mockDepartmentError || assignmentError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender || ""} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main St, City, State"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  placeholder="Software Engineer"
                />
              </div>
            </div>
          </div>

          {/* Department Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Department Assignment</h3>
            <MockDepartmentDropdown
              value={formData.departmentId}
              onChange={handleDepartmentChange}
              placeholder="Select a department (optional)"
              filterByStatus="ACTIVE"
            />
            
            {formData.departmentId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departmentRole">Department Role</Label>
                  <Select 
                    value={formData.departmentRole} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, departmentRole: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="ASSISTANT_LEADER">Assistant Leader</SelectItem>
                      <SelectItem value="LEADER">Leader</SelectItem>
                      <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="memberStatus">Member Status</Label>
                  <Select 
                    value={formData.memberStatus} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, memberStatus: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="VISITOR">Visitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || mockDepartmentLoading || assignmentLoading}>
              {loading || mockDepartmentLoading || assignmentLoading ? "Saving..." : (member ? "Update Member" : "Add Member")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
