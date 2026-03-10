import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Search, Eye, Pencil, Trash2, Users, UserPlus, PhoneCall, ArrowRightLeft, ChevronLeft, ChevronRight, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";

const mockVisitors = [
  { id: "V001", name: "Rebecca Adamu", phone: "+234 810 111 2222", firstVisit: "2026-02-28", invitedBy: "Grace Adeyemi", followUp: "Contacted", prayerRequest: "Healing for family" },
  { id: "V002", name: "James Nkemelu", phone: "+234 811 222 3333", firstVisit: "2026-03-02", invitedBy: "Daniel Okafor", followUp: "New Visitor", prayerRequest: "" },
  { id: "V003", name: "Amara Obi", phone: "+234 812 333 4444", firstVisit: "2026-02-14", invitedBy: "—", followUp: "Invited to Service", prayerRequest: "Job search" },
  { id: "V004", name: "Samuel Bello", phone: "+234 813 444 5555", firstVisit: "2026-01-19", invitedBy: "Joy Nwosu", followUp: "Attended Again", prayerRequest: "" },
  { id: "V005", name: "Mercy Udo", phone: "+234 814 555 6666", firstVisit: "2026-01-05", invitedBy: "Esther Williams", followUp: "Converted to Member", prayerRequest: "Growth in faith" },
  { id: "V006", name: "Chidi Okeke", phone: "+234 815 666 7777", firstVisit: "2026-03-01", invitedBy: "—", followUp: "New Visitor", prayerRequest: "Family unity" },
];

const kanbanStages = ["New Visitor", "Contacted", "Invited to Service", "Attended Again", "Converted to Member"] as const;

const stageColors: Record<string, string> = {
  "New Visitor": "border-l-accent",
  "Contacted": "border-l-primary",
  "Invited to Service": "border-l-chart-4",
  "Attended Again": "border-l-success",
  "Converted to Member": "border-l-chart-3",
};

const stageBadgeColors: Record<string, string> = {
  "New Visitor": "bg-accent/15 text-accent-foreground",
  "Contacted": "bg-primary/10 text-primary",
  "Invited to Service": "bg-purple-100 text-purple-700",
  "Attended Again": "bg-success/10 text-success",
  "Converted to Member": "bg-success/15 text-success",
};

type Tab = "table" | "pipeline" | "register";

export default function VisitorsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("table");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const filtered = mockVisitors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    { label: "Total Visitors", value: mockVisitors.length, icon: Users, gradient: "stat-gradient-blue" },
    { label: "First-Time This Week", value: 2, icon: UserPlus, gradient: "stat-gradient-gold" },
    { label: "Follow-Ups Pending", value: 3, icon: PhoneCall, gradient: "stat-gradient-purple" },
    { label: "Converted to Members", value: 1, icon: ArrowRightLeft, gradient: "stat-gradient-green" },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Visitors</h1>
            <p className="text-sm text-muted-foreground">Track and follow up with first-time visitors</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRegisterOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Plus className="h-4 w-4" /> Register Visitor
            </button>
            <button
              onClick={() => setAddMemberOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ArrowRightLeft className="h-4 w-4" /> Convert to Member
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <div key={card.label} className={cn("rounded-xl p-4 text-white", card.gradient)}>
              <div className="flex items-center justify-between mb-2">
                <card.icon className="h-5 w-5 opacity-80" />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs opacity-80">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 w-fit">
          {([["table", "Visitor Table"], ["pipeline", "Follow-Up Pipeline"], ["register", "Registration Form"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as Tab)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                activeTab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table View */}
        {activeTab === "table" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search visitors..."
                  className="h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <select className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground">
                <option>All Stages</option>
                {kanbanStages.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="rounded-xl bg-card card-shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">First Visit</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invited By</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Follow-Up</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((v) => (
                      <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-semibold text-accent-foreground">
                              {v.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="font-medium text-foreground">{v.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{v.phone}</td>
                        <td className="px-4 py-3 text-muted-foreground">{v.firstVisit}</td>
                        <td className="px-4 py-3 text-muted-foreground">{v.invitedBy}</td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", stageBadgeColors[v.followUp])}>
                            {v.followUp}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Eye className="h-4 w-4" /></button>
                            <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Pencil className="h-4 w-4" /></button>
                            <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <p className="text-xs text-muted-foreground">Showing {filtered.length} of {mockVisitors.length} visitors</p>
                <div className="flex items-center gap-1">
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                  <button className="rounded-lg px-3 py-1 text-sm font-medium bg-primary text-primary-foreground">1</button>
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Pipeline / Kanban View */}
        {activeTab === "pipeline" && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {kanbanStages.map((stage) => {
              const visitors = mockVisitors.filter((v) => v.followUp === stage);
              return (
                <div key={stage} className="rounded-xl bg-muted/50 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{stage}</h3>
                    <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground card-shadow">{visitors.length}</span>
                  </div>
                  <div className="space-y-2">
                    {visitors.map((v) => (
                      <div key={v.id} className={cn("rounded-lg bg-card p-3 card-shadow hover:card-shadow-hover transition-shadow cursor-grab border-l-4", stageColors[stage])}>
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
                            <span className="text-sm font-medium text-foreground">{v.name}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground ml-5.5">{v.phone}</p>
                        <p className="text-xs text-muted-foreground mt-1 ml-5.5">Visit: {v.firstVisit}</p>
                        {v.prayerRequest && (
                          <p className="text-xs text-accent-foreground bg-accent/10 rounded px-1.5 py-0.5 mt-2 ml-5.5 truncate">🙏 {v.prayerRequest}</p>
                        )}
                        {stage !== "Converted to Member" && (
                          <button
                            onClick={() => setAddMemberOpen(true)}
                            className="mt-2 ml-5.5 text-xs font-medium text-primary hover:underline"
                          >
                            Convert to Member →
                          </button>
                        )}
                      </div>
                    ))}
                    {visitors.length === 0 && (
                      <div className="rounded-lg border-2 border-dashed border-border p-4 text-center">
                        <p className="text-xs text-muted-foreground">No visitors</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Registration Form */}
        {activeTab === "register" && (
          <div className="max-w-2xl">
            <div className="rounded-xl bg-card p-6 card-shadow">
              <h2 className="font-display text-lg font-bold text-foreground mb-5">Visitor Registration</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RegField label="Full Name" placeholder="Enter full name" className="sm:col-span-2" />
                <RegField label="Phone" placeholder="+234 800 000 0000" />
                <RegField label="Email" placeholder="email@example.com" />
                <RegField label="Address" placeholder="Enter address" className="sm:col-span-2" />
                <RegField label="First Visit Date" type="date" />
                <RegField label="How did you hear about the church?" type="select" options={["Friend/Family", "Social Media", "Walk-In", "Flyer/Banner", "Other"]} />
                <RegField label="Interested Department" type="select" options={["Choir", "Youth Ministry", "Media Team", "Ushers", "Children Ministry", "Evangelism", "None"]} />
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Prayer Request</label>
                  <textarea rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" placeholder="Any prayer requests..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
                <button className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Register Visitor</button>
                <button
                  onClick={() => setAddMemberOpen(true)}
                  className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                  Register & Convert to Member
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Register Visitor Modal */}
      {registerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setRegisterOpen(false)} />
          <div className="relative z-50 w-full max-w-lg rounded-2xl bg-card p-6 card-shadow-hover animate-fade-in mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-foreground">Quick Visitor Registration</h2>
              <button onClick={() => setRegisterOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RegField label="Full Name" placeholder="Enter full name" className="sm:col-span-2" />
              <RegField label="Phone" placeholder="+234 800 000 0000" />
              <RegField label="Email" placeholder="email@example.com" />
              <RegField label="How did you hear about us?" type="select" options={["Friend/Family", "Social Media", "Walk-In", "Other"]} className="sm:col-span-2" />
            </div>
            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-border">
              <button onClick={() => setRegisterOpen(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
              <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Save Visitor</button>
            </div>
          </div>
        </div>
      )}

      <AddMemberDialog open={addMemberOpen} onOpenChange={setAddMemberOpen} />
    </DashboardLayout>
  );
}

function RegField({ label, placeholder, type = "text", options, className = "" }: { label: string; placeholder?: string; type?: string; options?: string[]; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {type === "select" ? (
        <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20">
          <option value="">Select {label}</option>
          {options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
      )}
    </div>
  );
}
