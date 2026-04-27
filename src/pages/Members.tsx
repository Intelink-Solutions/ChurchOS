import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Upload, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { DepartmentProvider, useDepartmentContext } from "@/components/departments/MockDepartmentDropdown";
import { createMember, deleteMember, getMembers, searchUsersForDropdown, patchMember } from "@/lib/api/userManagementApi";
import { departmentMembersApi } from "@/lib/api/departmentApi";
import type { MemberRecord } from "@/types/userManagement";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/errorHandling";

type MemberSavePayload = Partial<MemberRecord> & {
  userId?: string | null;
  unlinkUser?: boolean;
};

type MemberUserOption = {
  id: string;
  label: string;
  fullName: string;
  email: string;
  phone?: string;
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-success/10 text-success",
  INACTIVE: "bg-destructive/10 text-destructive",
  VISITOR: "bg-muted text-muted-foreground",
};

const typeColors: Record<string, string> = {
  MEMBER: "bg-primary/10 text-primary",
  NEW_MEMBER: "bg-accent/20 text-accent-foreground",
  VISITOR: "bg-muted text-muted-foreground",
  TRANSFER: "bg-orange-500/10 text-orange-700",
};

function toMemberTypeLabel(type: MemberRecord["type"]) {
  return type.split("_").join(" ").toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

function toStatusLabel(status: string) {
  return status.split("_").join(" ").toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

function MembersPageContent() {
  const [search, setSearch] = useState("");
  const { updateDepartmentMemberCount } = useDepartmentContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [department, setDepartment] = useState("ALL");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [viewingMember, setViewingMember] = useState<MemberRecord | null>(null);
  const [memberUserOptions, setMemberUserOptions] = useState<MemberUserOption[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await getMembers({
          page,
          size: 10,
          search: search.trim() || undefined,
          status: status !== "ALL" ? status : undefined,
          department: department !== "ALL" ? department : undefined,
        });

        setMembers(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(Math.max(1, response.totalPages));
      } catch (err) {
        const message = getApiErrorMessage(err, "Unable to load members.");
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [search, status, department, page, reloadKey]);

  const fetchUserOptions = async () => {
    try {
      const response = await searchUsersForDropdown();
      setMemberUserOptions(
        response.items.map((item) => ({
          id: item.id,
          label: `${item.fullName} (${item.email})`,
          fullName: item.fullName,
          email: item.email,
          phone: item.phoneNumber,
        })),
      );
    } catch {
      // Non-blocking for member forms: dialog still works without optional linking.
      setMemberUserOptions([]);
    }
  };

  useEffect(() => {
    fetchUserOptions();
  }, []);

  const handleSaveMember = async (payload: MemberSavePayload) => {
    // Transform payload for backend compatibility
    const backendPayload = {
      ...payload,
      // Convert departments array to string for backend
      departments: payload.departments ? payload.departments.join(", ") : undefined,
    };

    try {
      let savedMember: MemberRecord;

      if (editingMember) {
        // Handle department member count updates for edited member
        const oldDepartments = editingMember.departments || [];
        const newDepartments = payload.departments || [];
        
        // Decrease count for departments member left
        oldDepartments.forEach(oldDept => {
          if (!newDepartments.includes(oldDept)) {
            updateDepartmentMemberCount(oldDept, -1);
          }
        });
        
        // Increase count for new departments member joined
        newDepartments.forEach(newDept => {
          if (!oldDepartments.includes(newDept)) {
            updateDepartmentMemberCount(newDept, 1);
          }
        });

        // Use any type to bypass TypeScript checking for backend compatibility
        savedMember = await patchMember(editingMember.id, backendPayload as any);
        toast.success("Member updated successfully.");
      } else {
        // Use any type to bypass TypeScript checking for backend compatibility
        savedMember = await createMember(backendPayload as any);
        toast.success("Member created successfully.");
      }

      // Assign member to departments using department API (backend handles count updates automatically)
      if (payload.departments && savedMember) {
        const { departments } = useDepartmentContext();
        
        const departmentAssignments = payload.departments.map(async (deptName) => {
          try {
            // Find department by name using mock departments data
            const department = departments.find((d: any) => d.name === deptName);
            
            if (department) {
              // Assign member to department using department API
              // Backend automatically updates department member counts
              await departmentMembersApi.addDepartmentMember(department.id, {
                memberId: savedMember.id, // Use memberId instead of userId
                role: "MEMBER"
              });
              console.log(`Successfully assigned member ${savedMember.id} to department ${department.id} (${deptName})`);
            } else {
              console.warn(`Department "${deptName}" not found in mock data`);
            }
          } catch (error) {
            console.error(`Failed to assign member to department ${deptName}:`, error);
            // Don't throw error - member creation was successful, just log department assignment failure
          }
        });

        // Wait for all department assignments to complete
        await Promise.all(departmentAssignments);
      }

      setDialogOpen(false);
      setEditingMember(null);
      setPage(1);
      setReloadKey((current) => current + 1);
    } catch (error) {
      console.error("Error saving member:", error);
      toast.error("Failed to save member. Please try again.");
    }
  };

  const openCreateDialog = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const openEditDialog = (member: MemberRecord) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingMember(null);
    } else if (memberUserOptions.length === 0) {
      fetchUserOptions();
    }
  };

  const handleDeleteMember = async (member: MemberRecord) => {
    const confirmed = window.confirm(`Delete ${member.fullName}?`);
    if (!confirmed) return;

    setActiveActionId(member.id);
    try {
      await deleteMember(member.id);
      toast.success("Member deleted successfully.");
      setReloadKey((current) => current + 1);
    } catch (err) {
      const message = getApiErrorMessage(err, "Could not delete member.");
      toast.error(message);
    } finally {
      setActiveActionId(null);
    }
  };

  const detailRows = viewingMember
    ? [
        ["Member ID", viewingMember.id],
        ["Full Name", viewingMember.fullName],
        ["Type", toMemberTypeLabel(viewingMember.type)],
        ["Status", toStatusLabel(viewingMember.memberStatus ?? "ACTIVE")],
        ["Phone", viewingMember.phone ?? "-"],
        ["Email", viewingMember.email ?? "-"],
        ["Gender", viewingMember.gender ? toStatusLabel(viewingMember.gender) : "-"],
        ["Date of Birth", viewingMember.dateOfBirth ?? "-"],
        ["Membership Date", viewingMember.membershipDate ?? "-"],
        ["Departments", viewingMember.departments?.join(", ") ?? "-"],
        ["Address", viewingMember.address ?? "-"],
        ["Nationality", viewingMember.nationality ?? "-"],
        ["Occupation", viewingMember.occupation ?? "-"],
        ["Marital Status", viewingMember.maritalStatus ? toStatusLabel(viewingMember.maritalStatus) : "-"],
        ["Spouse Name", viewingMember.spouseName ?? "-"],
        ["Number of Children", viewingMember.numberOfChildren?.toString() ?? "-"],
        ["Emergency Contact", viewingMember.emergencyContact ?? "-"],
        ["Emergency Phone", viewingMember.emergencyPhone ?? "-"],
        ["Born Again", viewingMember.bornAgain === undefined ? "-" : viewingMember.bornAgain ? "Yes" : "No"],
        ["Baptism Status", viewingMember.baptismStatus ? toStatusLabel(viewingMember.baptismStatus) : "-"],
        ["Baptism Date", viewingMember.baptismDate ?? "-"],
        ["Worker Status", viewingMember.workerStatus ? toStatusLabel(viewingMember.workerStatus) : "-"],
        [
          "Foundation Class Completed",
          viewingMember.foundationClassCompleted === undefined
            ? "-"
            : viewingMember.foundationClassCompleted
            ? "Yes"
            : "No",
        ],
        [
          "Leadership Training Completed",
          viewingMember.leadershipTrainingCompleted === undefined
            ? "-"
            : viewingMember.leadershipTrainingCompleted
            ? "Yes"
            : "No",
        ],
        ["Invited By", viewingMember.invitedBy ?? "-"],
        ["First Visit Date", viewingMember.firstVisitDate ?? "-"],
        ["How Did You Hear About Us", viewingMember.howDidYouHearAboutUs ?? "-"],
        ["Original Branch", viewingMember.originalBranch ?? "-"],
        ["Transfer Date", viewingMember.transferDate ?? "-"],
        ["Transfer Reason", viewingMember.transferReason ?? "-"],
        ["Additional Notes", viewingMember.additionalNotes ?? "-"],
        ["Prayer Requests", viewingMember.prayerRequests ?? "-"],
      ]
    : [];

  const departmentOptions = useMemo(() => {
    const unique = new Set<string>();
    members.forEach((member) => {
      member.departments?.forEach((item) => unique.add(item));
    });
    return Array.from(unique);
  }, [members]);

  return (
      <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Members</h1>
            <p className="text-sm text-muted-foreground">Manage your church members</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Upload className="h-4 w-4" /> Import CSV
            </button>
            <button
              onClick={openCreateDialog}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Member
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <select
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All Departments</option>
            {departmentOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="VISITOR">Visitor</option>
          </select>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-400 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        ) : null}

        {/* Table */}
        <div className="rounded-xl bg-card card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Member</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Department</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Loading members...
                    </td>
                  </tr>
                ) : null}

                {!isLoading && members.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No members found.
                    </td>
                  </tr>
                ) : null}

                {members.map((m) => {
                  const memberStatus = m.memberStatus ?? "ACTIVE";
                  const memberDepartments = m.departments?.join(", ") || "-";
                  const initials = m.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                  <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{m.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {initials}
                        </div>
                        <span className="font-medium text-foreground">{m.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{m.phone ?? "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{memberDepartments}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", typeColors[m.type] ?? "bg-muted text-muted-foreground")}>
                        {toMemberTypeLabel(m.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", statusColors[memberStatus] ?? "bg-muted text-muted-foreground")}>
                        {toStatusLabel(memberStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingMember(m)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditDialog(m)}
                          disabled={activeActionId === m.id}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m)}
                          disabled={activeActionId === m.id}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">Showing {members.length} of {totalItems} members</p>
            <div className="flex items-center gap-1">
              <button
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded-lg px-3 py-1 text-sm font-medium bg-primary text-primary-foreground">{page}</button>
              <button
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddMemberDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSave={handleSaveMember}
        mode={editingMember ? "edit" : "create"}
        initialData={editingMember ?? undefined}
        userOptions={memberUserOptions}
      />

      {viewingMember ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setViewingMember(null)}
            aria-label="Close member details"
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Member Details</h2>
              <button
                onClick={() => setViewingMember(null)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {detailRows.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-border bg-background/40 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm text-foreground break-words">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}

// Default export that wraps the component with DepartmentProvider
export default function MembersPage() {
  return (
    <DepartmentProvider>
      <MembersPageContent />
    </DepartmentProvider>
  );
}
