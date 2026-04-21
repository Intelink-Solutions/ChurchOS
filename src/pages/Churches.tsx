import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  approveChurch,
  assignChurchAdmin,
  createChurch,
  deactivateChurch,
  deleteChurch,
  getChurches,
  getUsers,
  updateChurch,
} from "@/lib/api/userManagementApi";
import type { ChurchRecord } from "@/types/userManagement";
import { getApiErrorMessage } from "@/lib/api/errorHandling";
import { CheckCircle2, Plus, Search, Trash2, UserCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const statusClasses: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600",
  PENDING_APPROVAL: "bg-amber-500/10 text-amber-600",
  DEACTIVATED: "bg-muted text-muted-foreground",
};

export default function ChurchesPage() {
  const { hasPermission } = useAuth();
  const [churches, setChurches] = useState<ChurchRecord[]>([]);
  const [selectedChurch, setSelectedChurch] = useState<ChurchRecord | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeChurchId, setActiveChurchId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingChurch, setEditingChurch] = useState<ChurchRecord | null>(null);
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [adminUserId, setAdminUserId] = useState("");
  const [userOptions, setUserOptions] = useState<Array<{ id: string; label: string }>>([]);

  const loadChurches = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getChurches();
      setChurches(response);
      if (!selectedChurch && response.length > 0) {
        setSelectedChurch(response[0]);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load churches."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChurches();
  }, []);

  useEffect(() => {
    const loadUserOptions = async () => {
      try {
        const response = await getUsers({ page: 1, size: 200 });
        setUserOptions(
          response.items.map((item) => ({
            id: item.id,
            label: `${item.fullName} (${item.email})`,
          })),
        );
      } catch {
        setUserOptions([]);
      }
    };

    loadUserOptions();
  }, []);

  const filteredChurches = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return churches;

    return churches.filter((church) => {
      return (
        church.name.toLowerCase().includes(needle) ||
        church.location.toLowerCase().includes(needle) ||
        (church.description ?? "").toLowerCase().includes(needle)
      );
    });
  }, [churches, search]);

  const openCreate = () => {
    setEditingChurch(null);
    setFormName("");
    setFormLocation("");
    setFormDescription("");
    setShowForm(true);
  };

  const openEdit = (church: ChurchRecord) => {
    setEditingChurch(church);
    setFormName(church.name);
    setFormLocation(church.location);
    setFormDescription(church.description ?? "");
    setShowForm(true);
  };

  const handleSaveChurch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formName.trim() || !formLocation.trim()) {
      toast.error("Church name and location are required.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingChurch) {
        await updateChurch(editingChurch.id, {
          name: formName.trim(),
          location: formLocation.trim(),
          description: formDescription.trim() || undefined,
        });
        toast.success("Church updated successfully.");
      } else {
        await createChurch({
          name: formName.trim(),
          location: formLocation.trim(),
          description: formDescription.trim() || undefined,
        });
        toast.success("Church created successfully.");
      }

      setShowForm(false);
      await loadChurches();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not save church."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteChurch = async (church: ChurchRecord) => {
    const confirmed = window.confirm(`Delete church ${church.name}?`);
    if (!confirmed) return;

    setActiveChurchId(church.id);
    try {
      await deleteChurch(church.id);
      toast.success("Church deleted.");
      if (selectedChurch?.id === church.id) {
        setSelectedChurch(null);
      }
      await loadChurches();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not delete church."));
    } finally {
      setActiveChurchId(null);
    }
  };

  const handleApprove = async (church: ChurchRecord) => {
    setActiveChurchId(church.id);
    try {
      await approveChurch(church.id);
      toast.success("Church approved.");
      await loadChurches();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not approve church."));
    } finally {
      setActiveChurchId(null);
    }
  };

  const handleDeactivate = async (church: ChurchRecord) => {
    setActiveChurchId(church.id);
    try {
      await deactivateChurch(church.id);
      toast.success("Church deactivated.");
      await loadChurches();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not deactivate church."));
    } finally {
      setActiveChurchId(null);
    }
  };

  const handleAssignAdmin = async () => {
    if (!selectedChurch || !adminUserId) {
      toast.error("Select a user to assign as church admin.");
      return;
    }

    setActiveChurchId(selectedChurch.id);
    try {
      await assignChurchAdmin(selectedChurch.id, adminUserId);
      toast.success("Church admin assigned.");
      setAdminUserId("");
      await loadChurches();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not assign church admin."));
    } finally {
      setActiveChurchId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Churches</h1>
            <p className="text-sm text-muted-foreground">Manage church records, approval status, and admin assignment.</p>
          </div>
          <button
            onClick={openCreate}
            disabled={!hasPermission("churches:create")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add Church
          </button>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-400 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search churches..."
                  className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Church</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Loading churches...</td>
                    </tr>
                  ) : filteredChurches.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No churches found.</td>
                    </tr>
                  ) : (
                    filteredChurches.map((church) => (
                      <tr
                        key={church.id}
                        className="cursor-pointer border-b border-border hover:bg-muted/30"
                        onClick={() => setSelectedChurch(church)}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{church.name}</p>
                          <p className="text-xs text-muted-foreground">{church.location}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[church.status] ?? "bg-muted text-muted-foreground"}`}>
                            {church.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                openEdit(church);
                              }}
                              disabled={!hasPermission("churches:update")}
                              className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-muted"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteChurch(church);
                              }}
                              disabled={activeChurchId === church.id || !hasPermission("churches:delete")}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            {!selectedChurch ? (
              <p className="text-sm text-muted-foreground">Select a church to see details.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{selectedChurch.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedChurch.location}</p>
                </div>

                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Description</p>
                  <p className="mt-1 text-sm text-foreground">{selectedChurch.description || "No description"}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-background/40 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                    <p className="mt-1 text-sm text-foreground">{selectedChurch.status.replace("_", " ")}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/40 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Members</p>
                    <p className="mt-1 text-sm text-foreground">{selectedChurch.memberCount ?? 0}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Assign Admin</label>
                  <div className="flex gap-2">
                    <select
                      value={adminUserId}
                      onChange={(event) => setAdminUserId(event.target.value)}
                      className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select user</option>
                      {userOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignAdmin}
                      disabled={!adminUserId || activeChurchId === selectedChurch.id || !hasPermission("churches:approve")}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs hover:bg-muted disabled:opacity-60"
                    >
                      <UserCheck className="h-4 w-4" /> Assign
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleApprove(selectedChurch)}
                    disabled={activeChurchId === selectedChurch.id || !hasPermission("churches:approve")}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleDeactivate(selectedChurch)}
                    disabled={activeChurchId === selectedChurch.id || !hasPermission("churches:approve")}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-600 hover:bg-amber-500/20 disabled:opacity-60"
                  >
                    <XCircle className="h-4 w-4" /> Deactivate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} aria-label="Close" />
          <form
            onSubmit={handleSaveChurch}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-foreground">{editingChurch ? "Edit Church" : "Create Church"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Fill in church details and save.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
                <input
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  placeholder="Church name"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Location</label>
                <input
                  value={formLocation}
                  onChange={(event) => setFormLocation(event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  placeholder="City, State"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(event) => setFormDescription(event.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : editingChurch ? "Save Changes" : "Create Church"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
