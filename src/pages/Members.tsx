import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Upload, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";

const mockMembers = [
  { id: "M001", name: "Grace Adeyemi", phone: "+234 801 234 5678", department: "Choir", type: "Member", status: "Active" },
  { id: "M002", name: "Daniel Okafor", phone: "+234 802 345 6789", department: "Media Team", type: "Member", status: "Active" },
  { id: "M003", name: "Sarah Johnson", phone: "+1 555 123 4567", department: "Youth Ministry", type: "New Member", status: "Active" },
  { id: "M004", name: "Michael Eze", phone: "+234 803 456 7890", department: "Ushers", type: "Member", status: "Inactive" },
  { id: "M005", name: "Esther Williams", phone: "+234 804 567 8901", department: "Children Ministry", type: "Visitor", status: "Active" },
  { id: "M006", name: "David Okonkwo", phone: "+234 805 678 9012", department: "Evangelism", type: "Member", status: "Active" },
  { id: "M007", name: "Joy Nwosu", phone: "+234 806 789 0123", department: "Prayer Team", type: "Member", status: "Active" },
  { id: "M008", name: "Emmanuel Balogun", phone: "+234 807 890 1234", department: "Protocol", type: "Member", status: "Active" },
];

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Inactive: "bg-destructive/10 text-destructive",
};

const typeColors: Record<string, string> = {
  Member: "bg-primary/10 text-primary",
  "New Member": "bg-accent/20 text-accent-foreground",
  Visitor: "bg-muted text-muted-foreground",
};

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = mockMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

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
              onClick={() => setDialogOpen(true)}
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
          <select className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground">
            <option>All Departments</option>
            <option>Choir</option>
            <option>Media Team</option>
            <option>Youth Ministry</option>
          </select>
          <select className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

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
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{m.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {m.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="font-medium text-foreground">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{m.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.department}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", typeColors[m.type])}>
                        {m.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", statusColors[m.status])}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {mockMembers.length} members</p>
            <div className="flex items-center gap-1">
              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded-lg px-3 py-1 text-sm font-medium bg-primary text-primary-foreground">1</button>
              <button className="rounded-lg px-3 py-1 text-sm text-muted-foreground hover:bg-muted transition-colors">2</button>
              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddMemberDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </DashboardLayout>
  );
}
