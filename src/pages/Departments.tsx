import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Plus, Search, Users, UserCheck, Activity } from "lucide-react";

const initialDepartments = [
  { id: 1, name: "Choir", leader: "Grace Adeyemi", members: 24, status: "Active", meetingDay: "Saturday", description: "Praise and worship ministry" },
  { id: 2, name: "Media Team", leader: "Daniel Okafor", members: 12, status: "Active", meetingDay: "Friday", description: "Audio, visual, and streaming" },
  { id: 3, name: "Youth Ministry", leader: "Sarah Johnson", members: 45, status: "Active", meetingDay: "Saturday", description: "Youth engagement and discipleship" },
  { id: 4, name: "Ushers", leader: "Michael Eze", members: 18, status: "Active", meetingDay: "Sunday", description: "Church hospitality and seating" },
  { id: 5, name: "Children Ministry", leader: "Esther Williams", members: 15, status: "Active", meetingDay: "Sunday", description: "Children's church and Sunday school" },
  { id: 6, name: "Evangelism", leader: "David Okonkwo", members: 20, status: "Active", meetingDay: "Wednesday", description: "Outreach and soul winning" },
  { id: 7, name: "Prayer Team", leader: "Joy Nwosu", members: 30, status: "Active", meetingDay: "Tuesday", description: "Intercessory prayer ministry" },
  { id: 8, name: "Protocol", leader: "Emmanuel Balogun", members: 10, status: "Inactive", meetingDay: "Sunday", description: "VIP reception and order" },
];

const stats = [
  { title: "Total Departments", value: "8", icon: Building2, gradient: "stat-gradient-blue" },
  { title: "Active Departments", value: "7", icon: Activity, gradient: "stat-gradient-green" },
  { title: "Total Members", value: "174", icon: Users, gradient: "stat-gradient-purple" },
  { title: "Department Leaders", value: "8", icon: UserCheck, gradient: "stat-gradient-gold" },
];

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");
  const [departments] = useState(initialDepartments);

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.leader.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Departments</h1>
            <p className="text-muted-foreground">Manage church departments, assign leaders, and track activities.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Add Department</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Department</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div><Label>Department Name</Label><Input placeholder="e.g. Welfare" /></div>
                <div><Label>Leader</Label><Input placeholder="Leader name" /></div>
                <div><Label>Meeting Day</Label><Input placeholder="e.g. Saturday" /></div>
                <div><Label>Description</Label><Textarea placeholder="Brief description" /></div>
                <Button className="w-full">Create Department</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.title} className="card-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${s.gradient} flex items-center justify-center`}>
                  <s.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.title}</p>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Departments</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search departments..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Leader</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Meeting Day</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(d => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{d.leader}</TableCell>
                    <TableCell className="text-foreground">{d.members}</TableCell>
                    <TableCell className="text-foreground">{d.meetingDay}</TableCell>
                    <TableCell>
                      <Badge variant={d.status === "Active" ? "default" : "secondary"}>{d.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
