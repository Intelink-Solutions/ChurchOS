import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CalendarDays, Check, Save, Users, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const serviceTypes = ["Sunday Service", "Midweek Service", "Prayer Meeting", "Youth Service", "Special Service"];

const mockMembers = [
  { id: "M001", name: "Grace Adeyemi", department: "Choir" },
  { id: "M002", name: "Daniel Okafor", department: "Media Team" },
  { id: "M003", name: "Sarah Johnson", department: "Youth Ministry" },
  { id: "M004", name: "Michael Eze", department: "Ushers" },
  { id: "M005", name: "Esther Williams", department: "Children Ministry" },
  { id: "M006", name: "David Okonkwo", department: "Evangelism" },
  { id: "M007", name: "Joy Nwosu", department: "Prayer Team" },
  { id: "M008", name: "Emmanuel Balogun", department: "Protocol" },
  { id: "M009", name: "Blessing Adeola", department: "Choir" },
  { id: "M010", name: "Peter Chukwu", department: "Media Team" },
  { id: "M011", name: "Favour Ogunleye", department: "Youth Ministry" },
  { id: "M012", name: "Caleb Mensah", department: "Ushers" },
];

export default function AttendancePage() {
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [serviceType, setServiceType] = useState(serviceTypes[0]);
  const [attendance, setAttendance] = useState<Record<string, { present: boolean; timeIn: string; notes: string }>>({});
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const togglePresent = (id: string) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: {
        present: !prev[id]?.present,
        timeIn: !prev[id]?.present ? new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "",
        notes: prev[id]?.notes || "",
      },
    }));
    setSaved(false);
  };

  const updateNotes = (id: string, notes: string) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: { ...prev[id], present: prev[id]?.present || false, timeIn: prev[id]?.timeIn || "", notes },
    }));
  };

  const presentCount = Object.values(attendance).filter((a) => a.present).length;
  const absentCount = mockMembers.length - presentCount;
  const attendanceRate = mockMembers.length > 0 ? Math.round((presentCount / mockMembers.length) * 100) : 0;

  const filtered = mockMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    setSaved(true);
    // In production, this would save to the database
  };

  const markAllPresent = () => {
    const all: Record<string, { present: boolean; timeIn: string; notes: string }> = {};
    mockMembers.forEach((m) => {
      all[m.id] = {
        present: true,
        timeIn: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        notes: attendance[m.id]?.notes || "",
      };
    });
    setAttendance(all);
    setSaved(false);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Attendance</h1>
            <p className="text-sm text-muted-foreground">Record and track service attendance</p>
          </div>
          <button
            onClick={handleSave}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
              saved
                ? "bg-success text-success-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved!" : "Save Attendance"}
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl bg-card p-4 card-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockMembers.length}</p>
                <p className="text-xs text-muted-foreground">Total Members</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-4 card-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-4 card-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-4 card-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/15 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
                <p className="text-xs text-muted-foreground">Attendance Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-xl bg-card p-4 card-shadow mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Service Date</label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                {serviceTypes.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or department..."
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={markAllPresent}
                className="h-10 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors whitespace-nowrap"
              >
                Mark All Present
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="rounded-xl bg-card card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-12">Present</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Member</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Department</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time In</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const record = attendance[m.id];
                  const isPresent = record?.present || false;
                  return (
                    <tr key={m.id} className={cn("border-b border-border last:border-0 transition-colors", isPresent ? "bg-success/5" : "hover:bg-muted/30")}>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePresent(m.id)}
                          className={cn(
                            "h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all",
                            isPresent
                              ? "bg-success border-success text-success-foreground"
                              : "border-input hover:border-primary"
                          )}
                        >
                          {isPresent && <Check className="h-3.5 w-3.5" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {m.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="font-medium text-foreground">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{m.department}</td>
                      <td className="px-4 py-3">
                        {isPresent ? (
                          <div className="flex items-center gap-1.5 text-success">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-sm">{record?.timeIn}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={record?.notes || ""}
                          onChange={(e) => updateNotes(m.id, e.target.value)}
                          placeholder="Add note..."
                          className="h-8 w-full max-w-[200px] rounded-md border border-input bg-background px-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/20"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-foreground">
                <span className="text-success">{presentCount} present</span>
                <span className="text-muted-foreground mx-1">•</span>
                <span className="text-destructive">{absentCount} absent</span>
                <span className="text-muted-foreground mx-1">•</span>
                <span className="text-muted-foreground">{attendanceRate}% rate</span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{serviceType} — {serviceDate}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
