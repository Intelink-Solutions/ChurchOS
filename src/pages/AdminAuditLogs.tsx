import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getAdminAuditLogs } from "@/lib/api/userManagementApi";
import type { AuditLogRecord } from "@/types/userManagement";
import { getApiErrorMessage } from "@/lib/api/errorHandling";
import { ChevronLeft, ChevronRight, Filter, RefreshCcw } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [items, setItems] = useState<AuditLogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [actorUserId, setActorUserId] = useState("");
  const [action, setAction] = useState("");
  const [resourceType, setResourceType] = useState("");

  const loadLogs = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getAdminAuditLogs({
        page,
        size,
        actorUserId: actorUserId.trim() || undefined,
        action: action.trim() || undefined,
        resourceType: resourceType.trim() || undefined,
      });

      setItems(response.items);
      setTotalItems(response.totalItems);
      setTotalPages(Math.max(1, response.totalPages));
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load audit logs."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page]);

  const handleApplyFilters = () => {
    setPage(0);
    loadLogs();
  };

  const handleResetFilters = () => {
    setActorUserId("");
    setAction("");
    setResourceType("");
    setPage(0);
    setTimeout(() => {
      loadLogs();
    }, 0);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Audit Logs</h1>
          <p className="text-sm text-muted-foreground">Track admin operations with combined filters and newest-first records.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Actor User ID</label>
              <input
                value={actorUserId}
                onChange={(event) => setActorUserId(event.target.value)}
                placeholder="e.g. 1"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Action</label>
              <input
                value={action}
                onChange={(event) => setAction(event.target.value)}
                placeholder="e.g. CHURCH_APPROVE"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Resource Type</label>
              <input
                value={resourceType}
                onChange={(event) => setResourceType(event.target.value)}
                placeholder="e.g. CHURCH"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleApplyFilters}
                className="inline-flex h-10 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Filter className="h-4 w-4" /> Apply
              </button>
              <button
                onClick={handleResetFilters}
                className="inline-flex h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm hover:bg-muted"
              >
                <RefreshCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-400 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</div>
        ) : null}

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">When</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actor</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Resource</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading audit logs...</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No audit records found.</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3 text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{item.actorUserId}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{item.action}</span>
                      </td>
                      <td className="px-4 py-3 text-foreground">{item.resourceType}{item.resourceId ? `:${item.resourceId}` : ""}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.details || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">Showing {items.length} of {totalItems} records</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={page <= 0 || isLoading}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">{page + 1}</span>
              <button
                onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                disabled={page >= totalPages - 1 || isLoading}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
