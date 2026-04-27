import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentResponse,
  DepartmentCategory,
  DepartmentStatus,
  MeetingDay,
  MeetingFrequency,
  DepartmentSettings,
  DepartmentSettingsRequest
} from "@/types/department";

interface DepartmentFormProps {
  department?: DepartmentResponse;
  onSubmit: (data: CreateDepartmentRequest | UpdateDepartmentRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
}

export function DepartmentForm({ 
  department, 
  onSubmit, 
  onCancel, 
  loading = false, 
  error 
}: DepartmentFormProps) {
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    name: department?.name || "",
    code: department?.code || "",
    description: department?.description || "",
    category: department?.category || "MINISTRY",
    leaderId: department?.leaderId || "",
    assistantLeaderIds: department?.assistantLeaderIds || [],
    meetingDay: department?.meetingDay,
    meetingTime: department?.meetingTime || "",
    meetingFrequency: department?.meetingFrequency || "WEEKLY",
    meetingLocation: department?.meetingLocation || "",
    parentDepartmentId: department?.parentDepartmentId,
    foundingDate: department?.foundingDate || "",
    visionStatement: department?.visionStatement || "",
    missionStatement: department?.missionStatement || "",
    coreValues: department?.coreValues || [],
    requirements: department?.requirements || [],
    responsibilities: department?.responsibilities || [],
    skills: department?.skills || [],
    tags: department?.tags || [],
    contactEmail: department?.contactEmail || "",
    contactPhone: department?.contactPhone || "",
    websiteUrl: department?.websiteUrl || "",
    socialMediaLinks: department?.socialMediaLinks || {},
    settings: {
      allowSelfJoin: department?.settings.allowSelfJoin || false,
      requireApproval: department?.settings.requireApproval || true,
      maxMembers: department?.settings.maxMembers,
      autoRemovalInactivityDays: department?.settings.autoRemovalInactivityDays,
      meetingRemindersEnabled: department?.settings.meetingRemindersEnabled || true,
      reminderLeadTimeHours: department?.settings.reminderLeadTimeHours || 24,
      attendanceTrackingEnabled: department?.settings.attendanceTrackingEnabled || true,
      budgetTrackingEnabled: department?.settings.budgetTrackingEnabled || true,
      publicVisibility: department?.settings.publicVisibility || true,
      allowGuestSpeakers: department?.settings.allowGuestSpeakers || false,
      requireBackgroundCheck: department?.settings.requireBackgroundCheck || false
    }
  });

  const [newCoreValue, setNewCoreValue] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (department) {
        // Update existing department
        const updateData: UpdateDepartmentRequest = {
          ...formData,
          status: department.status
        };
        await onSubmit(updateData);
      } else {
        // Create new department
        await onSubmit(formData);
      }
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const addCoreValue = () => {
    if (newCoreValue.trim()) {
      setFormData(prev => ({
        ...prev,
        coreValues: [...(prev.coreValues || []), newCoreValue.trim()]
      }));
      setNewCoreValue("");
    }
  };

  const removeCoreValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coreValues: prev.coreValues?.filter((_, i) => i !== index) || []
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index) || []
    }));
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...(prev.responsibilities || []), newResponsibility.trim()]
      }));
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities?.filter((_, i) => i !== index) || []
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index) || []
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {department ? "Edit Department" : "Create New Department"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Department Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Choir"
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Department Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g., CHOIR"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the department's purpose and activities"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as DepartmentCategory }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MINISTRY">Ministry</SelectItem>
                  <SelectItem value="SERVICE">Service</SelectItem>
                  <SelectItem value="ADMINISTRATION">Administration</SelectItem>
                  <SelectItem value="OUTREACH">Outreach</SelectItem>
                  <SelectItem value="WORSHIP">Worship</SelectItem>
                  <SelectItem value="DISCIPLESHIP">Discipleship</SelectItem>
                  <SelectItem value="SUPPORT">Support</SelectItem>
                  <SelectItem value="LEADERSHIP">Leadership</SelectItem>
                  <SelectItem value="PRAYER_WARRIOR">Prayer Warrior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="meetingFrequency">Meeting Frequency</Label>
              <Select 
                value={formData.meetingFrequency} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, meetingFrequency: value as MeetingFrequency }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="BI_WEEKLY">Bi-weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="AS_NEEDED">As Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Meeting Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Meeting Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="meetingDay">Meeting Day</Label>
                <Select 
                  value={formData.meetingDay || ""} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, meetingDay: value as MeetingDay }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONDAY">Monday</SelectItem>
                    <SelectItem value="TUESDAY">Tuesday</SelectItem>
                    <SelectItem value="WEDNESDAY">Wednesday</SelectItem>
                    <SelectItem value="THURSDAY">Thursday</SelectItem>
                    <SelectItem value="FRIDAY">Friday</SelectItem>
                    <SelectItem value="SATURDAY">Saturday</SelectItem>
                    <SelectItem value="SUNDAY">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="meetingTime">Meeting Time</Label>
                <Input
                  id="meetingTime"
                  value={formData.meetingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, meetingTime: e.target.value }))}
                  placeholder="e.g., 6:00 PM"
                />
              </div>
              <div>
                <Label htmlFor="meetingLocation">Meeting Location</Label>
                <Input
                  id="meetingLocation"
                  value={formData.meetingLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, meetingLocation: e.target.value }))}
                  placeholder="e.g., Main Sanctuary"
                />
              </div>
            </div>
          </div>

          {/* Department Identity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Department Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="visionStatement">Vision Statement</Label>
                <Textarea
                  id="visionStatement"
                  value={formData.visionStatement}
                  onChange={(e) => setFormData(prev => ({ ...prev, visionStatement: e.target.value }))}
                  placeholder="The department's vision and long-term goals"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="missionStatement">Mission Statement</Label>
                <Textarea
                  id="missionStatement"
                  value={formData.missionStatement}
                  onChange={(e) => setFormData(prev => ({ ...prev, missionStatement: e.target.value }))}
                  placeholder="The department's mission and purpose"
                  rows={2}
                />
              </div>
            </div>

            {/* Core Values */}
            <div>
              <Label>Core Values</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.coreValues?.map((value, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {value}
                    <button
                      type="button"
                      onClick={() => removeCoreValue(index)}
                      className="ml-1 text-xs hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newCoreValue}
                  onChange={(e) => setNewCoreValue(e.target.value)}
                  placeholder="Add core value"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCoreValue())}
                />
                <Button type="button" onClick={addCoreValue} variant="outline">
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Requirements and Responsibilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Requirements</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.requirements?.map((req, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {req}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-1 text-xs hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add requirement"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement} variant="outline">
                  Add
                </Button>
              </div>
            </div>

            <div>
              <Label>Responsibilities</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.responsibilities?.map((resp, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {resp}
                    <button
                      type="button"
                      onClick={() => removeResponsibility(index)}
                      className="ml-1 text-xs hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  placeholder="Add responsibility"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                />
                <Button type="button" onClick={addResponsibility} variant="outline">
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Skills and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-1 text-xs hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 text-xs hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="department@church.com"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                placeholder="https://church.com/department"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Department Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowSelfJoin"
                    checked={formData.settings?.allowSelfJoin}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings!, allowSelfJoin: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="allowSelfJoin">Allow Self Join</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requireApproval"
                    checked={formData.settings?.requireApproval}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings!, requireApproval: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="requireApproval">Require Approval</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="publicVisibility"
                    checked={formData.settings?.publicVisibility}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings!, publicVisibility: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="publicVisibility">Public Visibility</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="meetingRemindersEnabled"
                    checked={formData.settings?.meetingRemindersEnabled}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings!, meetingRemindersEnabled: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="meetingRemindersEnabled">Meeting Reminders</Label>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="attendanceTrackingEnabled"
                    checked={formData.settings?.attendanceTrackingEnabled}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings!, attendanceTrackingEnabled: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="attendanceTrackingEnabled">Attendance Tracking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="budgetTrackingEnabled"
                    checked={formData.settings?.budgetTrackingEnabled}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings!, budgetTrackingEnabled: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="budgetTrackingEnabled">Budget Tracking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowGuestSpeakers"
                    checked={formData.settings?.allowGuestSpeakers}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings!, allowGuestSpeakers: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="allowGuestSpeakers">Allow Guest Speakers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requireBackgroundCheck"
                    checked={formData.settings?.requireBackgroundCheck}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings!, requireBackgroundCheck: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="requireBackgroundCheck">Require Background Check</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : (department ? "Update Department" : "Create Department")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
