import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import type { MemberRecord } from "@/types/userManagement";

type MemberSavePayload = Partial<MemberRecord> & {
  userId?: string | null;
  unlinkUser?: boolean;
};

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: MemberSavePayload) => Promise<void>;
  mode?: "create" | "edit";
  initialData?: Partial<MemberRecord>;
  initialType?: "New Member" | "Visitor" | "Member From Other Branch";
  userOptions?: Array<{ id: string; label: string }>;
}

const tabs = ["Personal", "Church Info", "Family", "Spiritual", "Notes"];

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value.trim();
}

function toBoolean(value: string) {
  if (!value) return undefined;
  if (value === "Yes") return true;
  if (value === "No") return false;
  return undefined;
}

function mapMemberPayload(memberType: string, formData: FormData): MemberSavePayload {
  const type: MemberRecord["type"] =
    memberType === "Visitor"
      ? "VISITOR"
      : memberType === "Member From Other Branch"
      ? "TRANSFER"
      : "NEW_MEMBER";

  const memberStatusInput = getText(formData, "memberStatus");
  const memberStatus: MemberRecord["memberStatus"] =
    memberStatusInput === "Inactive"
      ? "INACTIVE"
      : memberStatusInput === "Visitor"
      ? "VISITOR"
      : "ACTIVE";

  const genderInput = getText(formData, "gender");
  const baptismStatusInput = getText(formData, "baptismStatus");
  const workerStatusInput = getText(formData, "workerStatus");
  const maritalStatusInput = getText(formData, "maritalStatus");
  const selectedUserId = getText(formData, "userId");
  const unlinkUser = formData.get("unlinkUser") === "on";

  const payload: MemberSavePayload = {
    type,
    fullName: getText(formData, "fullName"),
    phone: getText(formData, "phone") || undefined,
    email: getText(formData, "email") || undefined,
    gender: genderInput ? (genderInput.toUpperCase() as MemberRecord["gender"]) : undefined,
    dateOfBirth: getText(formData, "dateOfBirth") || undefined,
    address: getText(formData, "address") || undefined,
    nationality: getText(formData, "nationality") || undefined,
    occupation: getText(formData, "occupation") || undefined,
    membershipDate: getText(formData, "membershipDate") || undefined,
    memberStatus,
    baptismStatus: baptismStatusInput
      ? (baptismStatusInput.replace(" ", "_").toUpperCase() as MemberRecord["baptismStatus"])
      : undefined,
    workerStatus: workerStatusInput
      ? (workerStatusInput.replace("-", "_").toUpperCase() as MemberRecord["workerStatus"])
      : undefined,
    departments: getText(formData, "departments")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    maritalStatus: maritalStatusInput
      ? (maritalStatusInput.toUpperCase() as MemberRecord["maritalStatus"])
      : undefined,
    spouseName: getText(formData, "spouseName") || undefined,
    numberOfChildren: getText(formData, "numberOfChildren")
      ? Number(getText(formData, "numberOfChildren"))
      : undefined,
    emergencyContact: getText(formData, "emergencyContact") || undefined,
    emergencyPhone: getText(formData, "emergencyPhone") || undefined,
    bornAgain: toBoolean(getText(formData, "bornAgain")),
    baptismDate: getText(formData, "baptismDate") || undefined,
    foundationClassCompleted: toBoolean(getText(formData, "foundationClassCompleted")),
    leadershipTrainingCompleted: toBoolean(getText(formData, "leadershipTrainingCompleted")),
    invitedBy: getText(formData, "invitedBy") || undefined,
    firstVisitDate: getText(formData, "firstVisitDate") || undefined,
    howDidYouHearAboutUs: getText(formData, "howDidYouHearAboutUs") || undefined,
    originalBranch: getText(formData, "originalBranch") || undefined,
    transferDate: getText(formData, "transferDate") || undefined,
    transferReason: getText(formData, "transferReason") || undefined,
    additionalNotes: getText(formData, "additionalNotes") || undefined,
    prayerRequests: getText(formData, "prayerRequests") || undefined,
  };

  if (unlinkUser) {
    payload.unlinkUser = true;
  } else if (selectedUserId) {
    payload.userId = selectedUserId;
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
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setActiveTab(0);
    setError("");
    setMemberType(memberTypeFromRecord(initialData?.type) ?? initialType);
  }, [open, initialData, initialType]);

  const initialValues = useMemo(() => {
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
    };
  }, [initialData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = mapMemberPayload(memberType, formData);

    if (!payload.fullName) {
      setError("Full name is required.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(payload);

      if (mode === "create" && submitMode === "another") {
        formRef.current?.reset();
        setActiveTab(0);
        return;
      }

      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save member.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <form
        key={open ? `${mode}-${initialData?.id ?? "new"}` : "closed"}
        ref={formRef}
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
            name="userId"
            label="Linked User (Optional)"
            type="select"
            options={userOptions.map((item) => `${item.id}::${item.label}`)}
            defaultValue={initialValues.userId}
            useOptionValue
          />
          {mode === "edit" && initialData?.userId ? (
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" name="unlinkUser" className="h-4 w-4" />
              Unlink current user from this member
            </label>
          ) : null}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
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
            <div className="text-sm text-muted-foreground mb-4">
              Quick Visitor Registration - Basic information only
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField name="fullName" label="Full Name" placeholder="Enter full name" required defaultValue={initialValues.fullName} />
              <FormField name="phone" label="Phone" placeholder="+234 800 000 0000" required defaultValue={initialValues.phone} />
              <FormField name="email" label="Email" placeholder="email@example.com" defaultValue={initialValues.email} />
              <FormField name="firstVisitDate" label="First Visit Date" type="date" required defaultValue={initialValues.firstVisitDate} />
              <FormField name="invitedBy" label="Invited By" placeholder="Who invited you?" defaultValue={initialValues.invitedBy} />
              <FormField name="howDidYouHearAboutUs" label="How did you hear about us?" type="select" options={["Friend/Family", "Social Media", "Online Search", "Flyer", "Other"]} defaultValue={initialValues.howDidYouHearAboutUs} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Prayer Requests</label>
              <textarea name="prayerRequests" rows={3} defaultValue={initialValues.prayerRequests} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" placeholder="Any prayer requests..." />
            </div>
          </div>
        ) : memberType === "Member From Other Branch" ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Transferring member from another branch
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField name="fullName" label="Full Name" placeholder="Enter full name" required defaultValue={initialValues.fullName} />
              <FormField name="phone" label="Phone" placeholder="+234 800 000 0000" required defaultValue={initialValues.phone} />
              <FormField name="email" label="Email" placeholder="email@example.com" defaultValue={initialValues.email} />
              <FormField name="originalBranch" label="Original Branch" placeholder="Previous branch name" required defaultValue={initialValues.originalBranch} />
              <FormField name="transferDate" label="Transfer Date" type="date" required defaultValue={initialValues.transferDate} />
              <FormField name="transferReason" label="Reason for Transfer" type="select" options={["Relocation", "Job Change", "Family Reasons", "Church Growth", "Other"]} defaultValue={initialValues.transferReason} />
              <FormField name="membershipDate" label="Membership Date" type="date" defaultValue={initialValues.membershipDate} />
              <FormField name="departments" label="Department(s)" placeholder="Current departments" defaultValue={initialValues.departments} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Transfer Notes</label>
              <textarea name="additionalNotes" rows={3} defaultValue={initialValues.additionalNotes} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" placeholder="Any notes about the transfer..." />
            </div>
          </div>
        ) : (
          <>
              {activeTab === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField name="fullName" label="Full Name" placeholder="Enter full name" className="sm:col-span-2" required defaultValue={initialValues.fullName} />
                <FormField name="gender" label="Gender" type="select" options={["Male", "Female"]} defaultValue={initialValues.gender} />
                <FormField name="dateOfBirth" label="Date of Birth" type="date" defaultValue={initialValues.dateOfBirth} />
                <FormField name="phone" label="Phone" placeholder="+234 800 000 0000" required defaultValue={initialValues.phone} />
                <FormField name="email" label="Email" placeholder="email@example.com" defaultValue={initialValues.email} />
                <FormField name="address" label="Address" placeholder="Enter address" className="sm:col-span-2" defaultValue={initialValues.address} />
                <FormField name="nationality" label="Nationality" placeholder="Nigerian" defaultValue={initialValues.nationality} />
                <FormField name="occupation" label="Occupation" placeholder="Engineer" defaultValue={initialValues.occupation} />
              </div>
            )}

            {activeTab === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField name="membershipDate" label="Membership Date" type="date" defaultValue={initialValues.membershipDate} />
                <FormField name="memberStatus" label="Member Status" type="select" options={["Active", "Inactive", "Visitor"]} defaultValue={initialValues.memberStatus} />
                <FormField name="baptismStatus" label="Baptism Status" type="select" options={["Baptized", "Not Baptized"]} defaultValue={initialValues.baptismStatus} />
                <FormField name="workerStatus" label="Worker Status" type="select" options={["Worker", "Non-Worker"]} defaultValue={initialValues.workerStatus} />
                <FormField name="departments" label="Department(s)" placeholder="Search departments..." className="sm:col-span-2" defaultValue={initialValues.departments} />
              </div>
            )}

            {activeTab === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField name="maritalStatus" label="Marital Status" type="select" options={["Single", "Married", "Divorced", "Widowed"]} defaultValue={initialValues.maritalStatus} />
                <FormField name="spouseName" label="Spouse Name" placeholder="Enter spouse name" defaultValue={initialValues.spouseName} />
                <FormField name="numberOfChildren" label="Number of Children" type="number" placeholder="0" defaultValue={initialValues.numberOfChildren} />
                <FormField name="emergencyContact" label="Emergency Contact" placeholder="Contact name" defaultValue={initialValues.emergencyContact} />
                <FormField name="emergencyPhone" label="Emergency Phone" placeholder="+234 800 000 0000" defaultValue={initialValues.emergencyPhone} />
              </div>
            )}

            {activeTab === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField name="bornAgain" label="Born Again" type="select" options={["Yes", "No"]} defaultValue={initialValues.bornAgain} />
                <FormField name="baptismDate" label="Baptism Date" type="date" defaultValue={initialValues.baptismDate} />
                <FormField name="foundationClassCompleted" label="Foundation Class Completed" type="select" options={["Yes", "No"]} defaultValue={initialValues.foundationClassCompleted} />
                <FormField name="leadershipTrainingCompleted" label="Leadership Training Completed" type="select" options={["Yes", "No"]} defaultValue={initialValues.leadershipTrainingCompleted} />
              </div>
            )}

            {activeTab === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Additional Notes</label>
                  <textarea name="additionalNotes" rows={3} defaultValue={initialValues.additionalNotes} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" placeholder="Any additional notes..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Prayer Requests</label>
                  <textarea name="prayerRequests" rows={3} defaultValue={initialValues.prayerRequests} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" placeholder="Prayer requests..." />
                </div>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
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
        </div>
      </form>
    </div>
  );
}

function FormField({
  name,
  label,
  placeholder,
  type = "text",
  options,
  className = "",
  required = false,
  defaultValue,
  useOptionValue = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  options?: string[];
  className?: string;
  required?: boolean;
  defaultValue?: string;
  useOptionValue?: boolean;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          <option value="">Select {label}</option>
          {options?.map((o) => {
            if (!useOptionValue) {
              return <option key={o}>{o}</option>;
            }

            const [value, optionLabel] = o.split("::");
            return (
              <option key={o} value={value}>
                {optionLabel ?? value}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      )}
    </div>
  );
}
