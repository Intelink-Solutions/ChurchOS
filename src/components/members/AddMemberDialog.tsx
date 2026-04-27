import { useEffect, useMemo, useState, type ChangeEventHandler } from "react";
import { X } from "lucide-react";
import type { MemberRecord } from "@/types/userManagement";
import { useDepartmentContext } from "@/components/departments/MockDepartmentDropdown";

type MemberSavePayload = Partial<MemberRecord> & {
  userId?: string | null;
  unlinkUser?: boolean;
};

type UserOption = {
  id: string;
  label: string;
  fullName: string;
  email: string;
  phone?: string;
};

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: MemberSavePayload) => Promise<void>;
  mode?: "create" | "edit";
  initialData?: Partial<MemberRecord>;
  initialType?: "New Member" | "Visitor" | "Member From Other Branch";
  userOptions?: UserOption[];
}

type Fields = {
  fullName: string;
  phone: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  nationality: string;
  occupation: string;
  membershipDate: string;
  memberStatus: string;
  baptismStatus: string;
  workerStatus: string;
  departments: string;
  maritalStatus: string;
  spouseName: string;
  numberOfChildren: string;
  emergencyContact: string;
  emergencyPhone: string;
  bornAgain: string;
  baptismDate: string;
  foundationClassCompleted: string;
  leadershipTrainingCompleted: string;
  invitedBy: string;
  firstVisitDate: string;
  howDidYouHearAboutUs: string;
  originalBranch: string;
  transferDate: string;
  transferReason: string;
  additionalNotes: string;
  prayerRequests: string;
  userId: string;
  unlinkUser: boolean;
};

const tabs = ["Personal", "Church Info", "Family", "Spiritual", "Notes"];

function toBoolean(value: string) {
  if (value === "Yes") return true;
  if (value === "No") return false;
  return undefined;
}

function buildPayload(memberType: string, fields: Fields): MemberSavePayload {
  const type: MemberRecord["type"] =
    memberType === "Visitor"
      ? "VISITOR"
      : memberType === "Member From Other Branch"
      ? "TRANSFER"
      : "NEW_MEMBER";

  const memberStatusInput = fields.memberStatus;
  const memberStatus: MemberRecord["memberStatus"] =
    memberStatusInput === "Inactive"
      ? "INACTIVE"
      : memberStatusInput === "Visitor"
      ? "VISITOR"
      : "ACTIVE";

  // Extract departments array for frontend type compatibility
  const departmentsArray = fields.departments ? fields.departments.split(",").map(d => {
    // Extract department name from formatted option (remove member count info)
    const cleanName = d.trim().replace(/\s*\(\d+\s*members\)\s*$/, '');
    return cleanName;
  }).filter(d => d && !d.startsWith('---')) : undefined;

  const payload: MemberSavePayload = {
    type,
    fullName: fields.fullName.trim(),
    phone: fields.phone.trim() || undefined,
    email: fields.email.trim() || undefined,
    gender: fields.gender ? (fields.gender.toUpperCase() as MemberRecord["gender"]) : undefined,
    dateOfBirth: fields.dateOfBirth || undefined,
    address: fields.address.trim() || undefined,
    nationality: fields.nationality.trim() || undefined,
    occupation: fields.occupation.trim() || undefined,
    membershipDate: fields.membershipDate || undefined,
    memberStatus,
    baptismStatus: fields.baptismStatus
      ? (fields.baptismStatus.replace(" ", "_").toUpperCase() as MemberRecord["baptismStatus"])
      : undefined,
    workerStatus: fields.workerStatus
      ? (fields.workerStatus.replace("-", "_").toUpperCase() as MemberRecord["workerStatus"])
      : undefined,
    departments: departmentsArray,
    maritalStatus: fields.maritalStatus
      ? (fields.maritalStatus.toUpperCase() as MemberRecord["maritalStatus"])
      : undefined,
    spouseName: fields.spouseName.trim() || undefined,
    numberOfChildren: fields.numberOfChildren ? Number(fields.numberOfChildren) : undefined,
    emergencyContact: fields.emergencyContact.trim() || undefined,
    emergencyPhone: fields.emergencyPhone.trim() || undefined,
    bornAgain: toBoolean(fields.bornAgain),
    baptismDate: fields.baptismDate || undefined,
    foundationClassCompleted: toBoolean(fields.foundationClassCompleted),
    leadershipTrainingCompleted: toBoolean(fields.leadershipTrainingCompleted),
    invitedBy: fields.invitedBy || undefined,
    firstVisitDate: fields.firstVisitDate || undefined,
    howDidYouHearAboutUs: fields.howDidYouHearAboutUs || undefined,
    originalBranch: fields.originalBranch.trim() || undefined,
    transferDate: fields.transferDate || undefined,
    transferReason: fields.transferReason || undefined,
    additionalNotes: fields.additionalNotes.trim() || undefined,
    prayerRequests: fields.prayerRequests.trim() || undefined,
  };

  if (fields.unlinkUser) {
    payload.unlinkUser = true;
  } else if (fields.userId) {
    payload.userId = fields.userId;
  }

  return payload;
}

function memberTypeFromRecord(type?: MemberRecord["type"]): "New Member" | "Visitor" | "Member From Other Branch" {
  if (type === "VISITOR") return "Visitor";
  if (type === "TRANSFER") return "Member From Other Branch";
  return "New Member";
}

function toYesNo(value?: boolean) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "";
}

function toReadable(value?: string) {
  if (!value) return "";
  return value.split("_").join(" ").toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

function makeInitialFields(initialData?: Partial<MemberRecord>): Fields {
  return {
    fullName: initialData?.fullName ?? "",
    phone: initialData?.phone ?? "",
    email: initialData?.email ?? "",
    gender: toReadable(initialData?.gender),
    dateOfBirth: initialData?.dateOfBirth ?? "",
    address: initialData?.address ?? "",
    nationality: initialData?.nationality ?? "",
    occupation: initialData?.occupation ?? "",
    membershipDate: initialData?.membershipDate ?? "",
    memberStatus: toReadable(initialData?.memberStatus),
    baptismStatus: toReadable(initialData?.baptismStatus),
    workerStatus: toReadable(initialData?.workerStatus),
    departments: initialData?.departments?.join(", ") ?? "",
    maritalStatus: toReadable(initialData?.maritalStatus),
    spouseName: initialData?.spouseName ?? "",
    numberOfChildren: initialData?.numberOfChildren?.toString() ?? "",
    emergencyContact: initialData?.emergencyContact ?? "",
    emergencyPhone: initialData?.emergencyPhone ?? "",
    bornAgain: toYesNo(initialData?.bornAgain),
    baptismDate: initialData?.baptismDate ?? "",
    foundationClassCompleted: toYesNo(initialData?.foundationClassCompleted),
    leadershipTrainingCompleted: toYesNo(initialData?.leadershipTrainingCompleted),
    invitedBy: initialData?.invitedBy ?? "",
    firstVisitDate: initialData?.firstVisitDate ?? "",
    howDidYouHearAboutUs: initialData?.howDidYouHearAboutUs ?? "",
    originalBranch: initialData?.originalBranch ?? "",
    transferDate: initialData?.transferDate ?? "",
    transferReason: initialData?.transferReason ?? "",
    additionalNotes: initialData?.additionalNotes ?? "",
    prayerRequests: initialData?.prayerRequests ?? "",
    userId: initialData?.userId ?? "",
    unlinkUser: false,
  };
}

const emptyFields = makeInitialFields();

export function AddMemberDialog({
  open,
  onOpenChange,
  onSave,
  mode = "create",
  initialData,
  initialType = "New Member",
  userOptions = [],
}: AddMemberDialogProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [memberType, setMemberType] = useState(memberTypeFromRecord(initialData?.type) ?? initialType);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitMode, setSubmitMode] = useState<"close" | "another">("close");
  const [fields, setFields] = useState<Fields>(() => makeInitialFields(initialData));
  
  // Fetch departments for dropdown
  const { departments } = useDepartmentContext();

  // Group departments by category for better organization
  const departmentsByCategory = useMemo(() => {
    const grouped: Record<string, typeof departments> = {};
    
    departments.forEach(dept => {
      if (!grouped[dept.category]) {
        grouped[dept.category] = [];
      }
      grouped[dept.category].push(dept);
    });
    
    return grouped;
  }, [departments]);

  // Create formatted options with category grouping
  const departmentOptions = useMemo(() => {
    const options: string[] = [];
    
    Object.entries(departmentsByCategory).forEach(([category, depts]) => {
      // Add category header
      options.push(`--- ${category.replace('_', ' ').toUpperCase()} ---`);
      // Add departments in this category
      depts.forEach(dept => {
        options.push(dept.name);
      });
    });
    
    return options;
  }, [departmentsByCategory]);

  const userOptionsById = useMemo(
    () => new Map(userOptions.map((option) => [option.id, option])),
    [userOptions],
  );

  useEffect(() => {
    if (!open) return;
    setActiveTab(0);
    setError("");
    setMemberType(memberTypeFromRecord(initialData?.type) ?? initialType);
    setFields(makeInitialFields(initialData));
  }, [open, initialData, initialType]);

  const setField = (name: keyof Fields, value: string | boolean) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const payload = buildPayload(memberType, fields);

    if (!payload.fullName) {
      setError("Full name is required.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(payload);

      if (mode === "create" && submitMode === "another") {
        setFields(emptyFields);
        setActiveTab(0);
      } else {
        onOpenChange(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save member.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkedUserChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const id = event.target.value;
    if (mode !== "create") {
      setField("userId", id);
      return;
    }
    const selectedUser = userOptionsById.get(id);
    if (selectedUser) {
      setFields((prev) => ({
        ...prev,
        userId: id,
        fullName: selectedUser.fullName,
        email: selectedUser.email,
        phone: selectedUser.phone ?? "",
      }));
    } else {
      setField("userId", id);
    }
  };

  if (!open) return null;

  const f = (name: keyof Fields) => fields[name] as string;
  const onChange = (name: keyof Fields): ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> =>
    (e) => setField(name, e.target.value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <form
        onSubmit={handleSubmit}
        className="relative z-50 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-card p-6 card-shadow-hover animate-fade-in mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-foreground">{mode === "edit" ? "Edit Member" : "Add New Member"}</h2>
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-400 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        ) : null}

        {/* Member Type */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-foreground mb-1.5">Member Type</label>
          <select
            value={memberType}
            onChange={(e) => setMemberType(e.target.value as typeof memberType)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option>New Member</option>
            <option>Visitor</option>
            <option>Member From Other Branch</option>
          </select>
        </div>

        <div className="mb-5 space-y-2">
          <FormField
            label="Linked User (Optional)"
            type="select"
            options={userOptions.map((item) => `${item.id}::${item.label}`)}
            value={f("userId")}
            useOptionValue
            onChange={handleLinkedUserChange}
          />
          {mode === "edit" && initialData?.userId ? (
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={fields.unlinkUser}
                onChange={(e) => setField("unlinkUser", e.target.checked)}
              />
              Unlink current user from this member
            </label>
          ) : null}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === i
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {memberType === "Visitor" ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">Quick Visitor Registration - Basic information only</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Full Name" placeholder="Enter full name" required value={f("fullName")} onChange={onChange("fullName")} />
              <FormField label="Phone" placeholder="+234 800 000 0000" required value={f("phone")} onChange={onChange("phone")} />
              <FormField label="Email" placeholder="email@example.com" value={f("email")} onChange={onChange("email")} />
              <FormField label="First Visit Date" type="date" required value={f("firstVisitDate")} onChange={onChange("firstVisitDate")} />
              <FormField label="Invited By" placeholder="Who invited you?" value={f("invitedBy")} onChange={onChange("invitedBy")} />
              <FormField label="How did you hear about us?" type="select" options={["Friend/Family", "Social Media", "Online Search", "Flyer", "Other"]} value={f("howDidYouHearAboutUs")} onChange={onChange("howDidYouHearAboutUs")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Prayer Requests</label>
              <textarea rows={3} value={f("prayerRequests")} onChange={onChange("prayerRequests")} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" placeholder="Any prayer requests..." />
            </div>
          </div>
        ) : memberType === "Member From Other Branch" ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">Transferring member from another branch</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Full Name" placeholder="Enter full name" required value={f("fullName")} onChange={onChange("fullName")} />
              <FormField label="Phone" placeholder="+234 800 000 0000" required value={f("phone")} onChange={onChange("phone")} />
              <FormField label="Email" placeholder="email@example.com" value={f("email")} onChange={onChange("email")} />
              <FormField label="Original Branch" placeholder="Previous branch name" required value={f("originalBranch")} onChange={onChange("originalBranch")} />
              <FormField label="Transfer Date" type="date" required value={f("transferDate")} onChange={onChange("transferDate")} />
              <FormField label="Reason for Transfer" type="select" options={["Relocation", "Job Change", "Family Reasons", "Church Growth", "Other"]} value={f("transferReason")} onChange={onChange("transferReason")} />
              <FormField label="Membership Date" type="date" value={f("membershipDate")} onChange={onChange("membershipDate")} />
              <FormField 
                  label="Department(s)" 
                  type="select" 
                  options={departmentOptions}
                  placeholder="Select departments"
                  value={f("departments")} 
                  onChange={onChange("departments")} 
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Transfer Notes</label>
              <textarea rows={3} value={f("additionalNotes")} onChange={onChange("additionalNotes")} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" placeholder="Any notes about the transfer..." />
            </div>
          </div>
        ) : (
          <>
            {activeTab === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name" placeholder="Enter full name" className="sm:col-span-2" required value={f("fullName")} onChange={onChange("fullName")} />
                <FormField label="Gender" type="select" options={["Male", "Female"]} value={f("gender")} onChange={onChange("gender")} />
                <FormField label="Date of Birth" type="date" value={f("dateOfBirth")} onChange={onChange("dateOfBirth")} />
                <FormField label="Phone" placeholder="+234 800 000 0000" required value={f("phone")} onChange={onChange("phone")} />
                <FormField label="Email" placeholder="email@example.com" value={f("email")} onChange={onChange("email")} />
                <FormField label="Address" placeholder="Enter address" className="sm:col-span-2" value={f("address")} onChange={onChange("address")} />
                <FormField label="Nationality" placeholder="Nigerian" value={f("nationality")} onChange={onChange("nationality")} />
                <FormField label="Occupation" placeholder="Engineer" value={f("occupation")} onChange={onChange("occupation")} />
              </div>
            )}

            {activeTab === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Membership Date" type="date" value={f("membershipDate")} onChange={onChange("membershipDate")} />
                <FormField label="Member Status" type="select" options={["Active", "Inactive", "Visitor"]} value={f("memberStatus")} onChange={onChange("memberStatus")} />
                <FormField label="Baptism Status" type="select" options={["Baptized", "Not Baptized"]} value={f("baptismStatus")} onChange={onChange("baptismStatus")} />
                <FormField label="Worker Status" type="select" options={["Worker", "Non-Worker"]} value={f("workerStatus")} onChange={onChange("workerStatus")} />
                <FormField 
                  label="Department(s)" 
                  type="select" 
                  options={departmentOptions}
                  placeholder="Select departments"
                  className="sm:col-span-2"
                  value={f("departments")} 
                  onChange={onChange("departments")} 
                />
              </div>
            )}

            {activeTab === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Marital Status" type="select" options={["Single", "Married", "Divorced", "Widowed"]} value={f("maritalStatus")} onChange={onChange("maritalStatus")} />
                <FormField label="Spouse Name" placeholder="Enter spouse name" value={f("spouseName")} onChange={onChange("spouseName")} />
                <FormField label="Number of Children" type="number" placeholder="0" value={f("numberOfChildren")} onChange={onChange("numberOfChildren")} />
                <FormField label="Emergency Contact" placeholder="Contact name" value={f("emergencyContact")} onChange={onChange("emergencyContact")} />
                <FormField label="Emergency Phone" placeholder="+234 800 000 0000" value={f("emergencyPhone")} onChange={onChange("emergencyPhone")} />
              </div>
            )}

            {activeTab === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Born Again" type="select" options={["Yes", "No"]} value={f("bornAgain")} onChange={onChange("bornAgain")} />
                <FormField label="Baptism Date" type="date" value={f("baptismDate")} onChange={onChange("baptismDate")} />
                <FormField label="Foundation Class Completed" type="select" options={["Yes", "No"]} value={f("foundationClassCompleted")} onChange={onChange("foundationClassCompleted")} />
                <FormField label="Leadership Training Completed" type="select" options={["Yes", "No"]} value={f("leadershipTrainingCompleted")} onChange={onChange("leadershipTrainingCompleted")} />
              </div>
            )}

            {activeTab === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Additional Notes</label>
                  <textarea rows={3} value={f("additionalNotes")} onChange={onChange("additionalNotes")} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" placeholder="Any additional notes..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Prayer Requests</label>
                  <textarea rows={3} value={f("prayerRequests")} onChange={onChange("prayerRequests")} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" placeholder="Prayer requests..." />
                </div>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        {(() => {
          const isTabbed = mode === "create" && memberType === "New Member";
          const isLastTab = activeTab === tabs.length - 1;
          const showSave = !isTabbed || isLastTab;

          return (
            <div className="flex justify-between gap-2 mt-6 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>

              <div className="flex gap-2">
                {isTabbed && activeTab > 0 ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab((t) => t - 1)}
                    className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Previous
                  </button>
                ) : null}

                {isTabbed && !isLastTab ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab((t) => t + 1)}
                    className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Next
                  </button>
                ) : null}

                {showSave ? (
                  <>
                    {mode === "create" ? (
                      <button
                        type="submit"
                        onClick={() => setSubmitMode("another")}
                        disabled={isSaving}
                        className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-60"
                      >
                        {isSaving ? "Saving..." : "Save & Add Another"}
                      </button>
                    ) : null}
                    <button
                      type="submit"
                      onClick={() => setSubmitMode("close")}
                      disabled={isSaving}
                      className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {isSaving ? "Saving..." : mode === "edit" ? "Save Changes" : "Save Member"}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          );
        })()}
      </form>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  type = "text",
  options,
  className = "",
  required = false,
  value,
  onChange,
  useOptionValue = false,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  options?: string[];
  className?: string;
  required?: boolean;
  value: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  useOptionValue?: boolean;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {type === "select" ? (
        <select
          value={value}
          onChange={onChange}
          required={required}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          <option value="">Select {label}</option>
          {options?.map((o) => {
            // Check if this is a category header (starts with ---)
            const isCategoryHeader = o.startsWith("---") && o.endsWith("---");
            
            if (isCategoryHeader) {
              return (
                <option key={o} value="" disabled style={{ fontWeight: 'bold', color: '#666' }}>
                  {o}
                </option>
              );
            }
            
            if (!useOptionValue) {
              return <option key={o} value={o}>{o}</option>;
            }
            const [optValue, optionLabel] = o.split("::");
            return (
              <option key={o} value={optValue}>
                {optionLabel ?? optValue}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      )}
    </div>
  );
}
