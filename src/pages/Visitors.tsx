import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Search, Eye, Pencil, Trash2, Users, UserPlus, PhoneCall, ArrowRightLeft, ChevronLeft, ChevronRight, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { DepartmentProvider } from "@/components/departments/MockDepartmentDropdown";
import { visitorsApi, type Visitor, type VisitorStats, type VisitorFollowUpStatus, type CreateVisitorRequest } from "@/lib/api/visitorsApi";
import { toast } from "sonner";

const kanbanStages: VisitorFollowUpStatus[] = ["New Visitor", "Contacted", "Invited to Service", "Attended Again", "Converted to Member"];

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

type Tab = "table" | "pipeline";

// Phone number formatting and validation helpers
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // If starts with 0 and has 11 digits (Nigeria format), convert to international
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+234${cleaned.substring(1)}`;
  }
  
  // If starts with 234 and has 13 digits (already international), add +
  if (cleaned.startsWith('234') && cleaned.length === 13) {
    return `+${cleaned}`;
  }
  
  // If starts with country code (1-3 digits), add +
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    const firstDigits = cleaned.substring(0, 3);
    // Common country codes
    const countryCodes = ['1', '44', '234', '254', '27', '33', '49', '91', '86'];
    const matchedCode = countryCodes.find(code => cleaned.startsWith(code));
    if (matchedCode) {
      return `+${cleaned}`;
    }
  }
  
  // Default: add + if it looks like a number
  if (cleaned.length >= 10) {
    return `+${cleaned}`;
  }
  
  return value;
};

const validatePhoneNumber = (phone: string): boolean => {
  // Check if phone is in international format
  const internationalPhoneRegex = /^\+\d{10,15}$/;
  return internationalPhoneRegex.test(phone);
};

export default function VisitorsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("table");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  
  // API state
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Registration form state
  const [registrationForm, setRegistrationForm] = useState<CreateVisitorRequest>({
    name: "",
    phone: "",
    email: "",
    firstVisit: new Date().toISOString().split('T')[0], // Today's date
    invitedBy: "",
    prayerRequest: "",
    address: "",
    howDidYouHear: "",
  });

  const handleSaveMember = async () => {
    // Simple handler for visitor page - just close the dialog
    setAddMemberOpen(false);
  };

  // Visitor registration handler
  const handleRegisterVisitor = async (formData: CreateVisitorRequest) => {
    // Validate phone number before submission
    if (!validatePhoneNumber(formData.phone)) {
      setPhoneError("Phone number must be in international format (e.g., +2348000000000)");
      toast.error("Please enter a valid phone number in international format");
      return;
    }

    try {
      await visitorsApi.createVisitor(formData);
      toast.success("Visitor registered successfully!");
      setRegisterOpen(false);
      setPhoneError(""); // Clear phone error
      // Reset form
      setRegistrationForm({
        name: "",
        phone: "",
        email: "",
        firstVisit: new Date().toISOString().split('T')[0],
        invitedBy: "",
        prayerRequest: "",
        address: "",
        howDidYouHear: "",
      });
      loadVisitors(); // Reload visitors list
      loadVisitorStats(); // Reload statistics
    } catch (error) {
      console.error("Failed to register visitor:", error);
      toast.error("Failed to register visitor");
    }
  };

  // Load visitors data
  const loadVisitors = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Debug: Check authentication state and permissions
      const token = localStorage.getItem("churchos-access-token");
      const user = localStorage.getItem("churchos-user");
      const refreshToken = localStorage.getItem("churchos-refresh-token");
      
      console.log("=== AUTHENTICATION DEBUG ===");
      console.log("Token exists:", !!token);
      console.log("User exists:", !!user);
      console.log("Refresh token exists:", !!refreshToken);
      console.log("Token preview:", token ? `${token.substring(0, 20)}...` : "none");
      
      if (user) {
        try {
          const userObj = JSON.parse(user);
          console.log("User role:", userObj.role);
          console.log("User permissions:", userObj.permissions);
          console.log("User data:", userObj);
        } catch (e) {
          console.log("User data (raw):", user);
        }
      }
      console.log("=== END AUTH DEBUG ===");
      
      const response = await visitorsApi.getVisitors({
        page,
        size: 50,
        search: search || undefined,
      });
      setVisitors(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load visitors:", error);
      setError("Failed to load visitors");
      toast.error("Failed to load visitors");
    } finally {
      setIsLoading(false);
    }
  };

  // Load visitor statistics
  const loadVisitorStats = async () => {
    try {
      console.log("Debug - Loading visitor stats...");
      const stats = await visitorsApi.getVisitorStats();
      console.log("Debug - Visitor stats loaded:", stats);
      setVisitorStats(stats);
    } catch (error) {
      console.error("Failed to load visitor stats:", error);
      console.log("Stats error details:", error);
    }
  };

  // Load data on component mount and when search/page changes
  useEffect(() => {
    loadVisitors();
  }, [search, page]);

  useEffect(() => {
    loadVisitorStats();
  }, []);

  const filtered = visitors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = visitorStats ? [
    { label: "Total Visitors", value: visitorStats.totalVisitors, icon: Users, gradient: "stat-gradient-blue" },
    { label: "First-Time This Week", value: visitorStats.firstTimeThisWeek, icon: UserPlus, gradient: "stat-gradient-gold" },
    { label: "Follow-Ups Pending", value: visitorStats.followUpsPending, icon: PhoneCall, gradient: "stat-gradient-purple" },
    { label: "Converted to Members", value: visitorStats.convertedToMembers, icon: ArrowRightLeft, gradient: "stat-gradient-green" },
  ] : [
    { label: "Total Visitors", value: 0, icon: Users, gradient: "stat-gradient-blue" },
    { label: "First-Time This Week", value: 0, icon: UserPlus, gradient: "stat-gradient-gold" },
    { label: "Follow-Ups Pending", value: 0, icon: PhoneCall, gradient: "stat-gradient-purple" },
    { label: "Converted to Members", value: 0, icon: ArrowRightLeft, gradient: "stat-gradient-green" },
  ];

  return (
    <DepartmentProvider>
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
          {([["table", "Visitor Table"], ["pipeline", "Follow-Up Pipeline"]] as const).map(([key, label]) => (
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
                <p className="text-xs text-muted-foreground">Showing {filtered.length} of {visitors.length} visitors</p>
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
              const stageVisitors = visitors.filter((v) => v.followUp === stage);
              return (
                <div key={stage} className="rounded-xl bg-muted/50 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{stage}</h3>
                    <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground card-shadow">{stageVisitors.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageVisitors.map((v) => (
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
                    {stageVisitors.length === 0 && (
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
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                  placeholder="Enter full name"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone *</label>
                <input
                  type="tel"
                  value={registrationForm.phone}
                  onChange={(e) => {
                    const formattedPhone = formatPhoneNumber(e.target.value);
                    setRegistrationForm({ ...registrationForm, phone: formattedPhone });
                    
                    // Validate phone number
                    if (formattedPhone && !validatePhoneNumber(formattedPhone)) {
                      setPhoneError("Please enter an international phone number (e.g., +2348000000000)");
                    } else {
                      setPhoneError("");
                    }
                  }}
                  placeholder="+234 800 000 0000"
                  className={`h-10 w-full rounded-lg border px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 ${
                    phoneError 
                      ? "border-red-500 focus:ring-red-500/20" 
                      : "border-input"
                  }`}
                  required
                />
                {phoneError && (
                  <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                  placeholder="email@example.com"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Address</label>
                <input
                  type="text"
                  value={registrationForm.address}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, address: e.target.value })}
                  placeholder="Enter address"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">First Visit Date</label>
                <input
                  type="date"
                  value={registrationForm.firstVisit}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, firstVisit: e.target.value })}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">How did you hear about the church?</label>
                <select
                  value={registrationForm.howDidYouHear}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, howDidYouHear: e.target.value })}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
                >
                  <option value="">Select...</option>
                  <option value="Friend/Family">Friend/Family</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Walk-In">Walk-In</option>
                  <option value="Flyer/Banner">Flyer/Banner</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Invited By</label>
                <input
                  type="text"
                  value={registrationForm.invitedBy}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, invitedBy: e.target.value })}
                  placeholder="Who invited you?"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Prayer Request</label>
                <textarea
                  rows={3}
                  value={registrationForm.prayerRequest}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, prayerRequest: e.target.value })}
                  placeholder="Any prayer requests..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
              <button 
                onClick={() => setRegisterOpen(false)} 
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleRegisterVisitor(registrationForm)} 
                disabled={!registrationForm.name || !registrationForm.phone || phoneError !== ""}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
              >
                Register Visitor
              </button>
              <button
                onClick={() => {
                  handleRegisterVisitor(registrationForm);
                  setAddMemberOpen(true);
                }}
                disabled={!registrationForm.name || !registrationForm.phone || phoneError !== ""}
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent"
              >
                Register & Convert to Member
              </button>
            </div>
            {phoneError && (
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                <strong>Phone Format Required:</strong> Please enter an international phone number starting with + (e.g., +2348000000000)
              </div>
            )}
          </div>
        </div>
      )}

      <AddMemberDialog open={addMemberOpen} onOpenChange={setAddMemberOpen} onSave={handleSaveMember} initialType="New Member" />
    </DashboardLayout>
    </DepartmentProvider>
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
