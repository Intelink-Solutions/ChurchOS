import { useState } from "react";
import { X } from "lucide-react";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tabs = ["Personal", "Church Info", "Family", "Spiritual", "Notes"];

export function AddMemberDialog({ open, onOpenChange }: AddMemberDialogProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-card p-6 card-shadow-hover animate-fade-in mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-foreground">Add New Member</h2>
          <button onClick={() => onOpenChange(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Member Type */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-foreground mb-1.5">Member Type</label>
          <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
            <option>New Member</option>
            <option>Visitor</option>
            <option>Member From Other Branch</option>
          </select>
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
        {activeTab === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" placeholder="Enter full name" className="sm:col-span-2" />
            <FormField label="Gender" type="select" options={["Male", "Female"]} />
            <FormField label="Date of Birth" type="date" />
            <FormField label="Phone" placeholder="+234 800 000 0000" />
            <FormField label="Email" placeholder="email@example.com" />
            <FormField label="Address" placeholder="Enter address" className="sm:col-span-2" />
            <FormField label="Nationality" placeholder="Nigerian" />
            <FormField label="Occupation" placeholder="Engineer" />
          </div>
        )}

        {activeTab === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Membership Date" type="date" />
            <FormField label="Member Status" type="select" options={["Active", "Inactive", "Visitor"]} />
            <FormField label="Baptism Status" type="select" options={["Baptized", "Not Baptized"]} />
            <FormField label="Worker Status" type="select" options={["Worker", "Non-Worker"]} />
            <FormField label="Department(s)" placeholder="Search departments..." className="sm:col-span-2" />
          </div>
        )}

        {activeTab === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Marital Status" type="select" options={["Single", "Married", "Divorced", "Widowed"]} />
            <FormField label="Spouse Name" placeholder="Enter spouse name" />
            <FormField label="Number of Children" placeholder="0" />
            <FormField label="Emergency Contact" placeholder="Contact name" />
            <FormField label="Emergency Phone" placeholder="+234 800 000 0000" />
          </div>
        )}

        {activeTab === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Born Again" type="select" options={["Yes", "No"]} />
            <FormField label="Baptism Date" type="date" />
            <FormField label="Foundation Class Completed" type="select" options={["Yes", "No"]} />
            <FormField label="Leadership Training Completed" type="select" options={["Yes", "No"]} />
          </div>
        )}

        {activeTab === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Additional Notes</label>
              <textarea rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" placeholder="Any additional notes..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Prayer Requests</label>
              <textarea rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" placeholder="Prayer requests..." />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
          <button onClick={() => onOpenChange(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
          <button className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Save & Add Another
          </button>
          <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Save Member
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label, placeholder, type = "text", options, className = "",
}: {
  label: string; placeholder?: string; type?: string; options?: string[]; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {type === "select" ? (
        <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20">
          <option value="">Select {label}</option>
          {options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      )}
    </div>
  );
}
