import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { HandHeart, Plus, Search, Filter, CheckCircle2, Clock, Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { initialRequests, categoryColors, type PrayerRequest } from "@/data/prayerRequests";

export default function PrayerRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const filtered = requests.filter((r) => {
    const matchesSearch = r.member.toLowerCase().includes(search.toLowerCase()) || r.request.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pending = requests.filter((r) => r.status === "pending").length;
  const answered = requests.filter((r) => r.status === "answered").length;

  const markAsAnswered = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "answered" as const } : r)));
    toast.success("Prayer request marked as answered!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Prayer Requests</h1>
            <p className="text-muted-foreground text-sm">Manage prayer requests with privacy controls.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Request</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Submit Prayer Request</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div><Label>Member Name</Label><Input placeholder="Enter name..." /></div>
                <div>
                  <Label>Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healing">Healing</SelectItem>
                      <SelectItem value="guidance">Guidance</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="comfort">Comfort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Prayer Request</Label><Textarea placeholder="Describe the prayer request..." rows={3} /></div>
                <div className="flex items-center justify-between">
                  <Label>Make Public</Label>
                  <Switch />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={() => { setOpen(false); toast.success("Prayer request submitted!"); }}>Submit</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="card-shadow"><CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl stat-gradient-blue flex items-center justify-center"><HandHeart className="h-5 w-5 text-white" /></div>
            <div><p className="text-xs font-medium text-muted-foreground uppercase">Total Requests</p><p className="text-2xl font-bold text-foreground">{requests.length}</p></div>
          </CardContent></Card>
          <Card className="card-shadow"><CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl stat-gradient-gold flex items-center justify-center"><Clock className="h-5 w-5 text-white" /></div>
            <div><p className="text-xs font-medium text-muted-foreground uppercase">Pending</p><p className="text-2xl font-bold text-foreground">{pending}</p></div>
          </CardContent></Card>
          <Card className="card-shadow"><CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl stat-gradient-green flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-white" /></div>
            <div><p className="text-xs font-medium text-muted-foreground uppercase">Answered</p><p className="text-2xl font-bold text-foreground">{answered}</p></div>
          </CardContent></Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search requests..." className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 h-9"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="answered">Answered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Request Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <Card key={r.id} className="card-shadow hover:card-shadow-hover transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{r.member}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge variant="secondary" className={r.isPublic ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-muted text-muted-foreground"}>
                      {r.isPublic ? <><Eye className="h-3 w-3 mr-1" />Public</> : <><EyeOff className="h-3 w-3 mr-1" />Private</>}
                    </Badge>
                    <Badge variant="secondary" className={categoryColors[r.category] || ""}>{r.category}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.request}</p>
                <div className="flex items-center justify-between pt-1">
                  <Badge variant={r.status === "answered" ? "default" : "secondary"} className={r.status === "answered" ? "bg-green-600 text-white" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}>
                    {r.status === "answered" ? <><CheckCircle2 className="h-3 w-3 mr-1" />Answered</> : <><Clock className="h-3 w-3 mr-1" />Pending</>}
                  </Badge>
                  {r.status === "pending" && (
                    <Button size="sm" variant="outline" onClick={() => markAsAnswered(r.id)}>
                      <CheckCircle2 className="h-4 w-4 mr-1" />Mark Answered
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
