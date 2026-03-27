import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Network, Plus, Search, Users, MapPin, Calendar } from "lucide-react";

const cellGroups = [
  { id: 1, name: "Grace Fellowship", leader: "Pastor James Adeola", location: "Ikeja, Lagos", members: 18, meetingDay: "Wednesday", time: "6:00 PM", avgAttendance: 14, status: "Active" },
  { id: 2, name: "Faith House", leader: "Deacon Samuel Eze", location: "Lekki, Lagos", members: 12, meetingDay: "Thursday", time: "7:00 PM", avgAttendance: 10, status: "Active" },
  { id: 3, name: "Hope Cell", leader: "Sister Mary Obi", location: "Surulere, Lagos", members: 15, meetingDay: "Tuesday", time: "6:30 PM", avgAttendance: 12, status: "Active" },
  { id: 4, name: "Joy Fellowship", leader: "Brother Peter Nwosu", location: "Yaba, Lagos", members: 20, meetingDay: "Wednesday", time: "6:00 PM", avgAttendance: 16, status: "Active" },
  { id: 5, name: "Peace House", leader: "Sister Ruth Mensah", location: "VI, Lagos", members: 8, meetingDay: "Friday", time: "7:00 PM", avgAttendance: 6, status: "Active" },
  { id: 6, name: "Love Cell", leader: "Deacon John Balogun", location: "Ajah, Lagos", members: 14, meetingDay: "Thursday", time: "6:30 PM", avgAttendance: 11, status: "Inactive" },
];

const stats = [
  { title: "Total Cell Groups", value: "6", icon: Network, gradient: "stat-gradient-blue" },
  { title: "Total Members", value: "87", icon: Users, gradient: "stat-gradient-green" },
  { title: "Avg. Attendance", value: "78%", icon: Calendar, gradient: "stat-gradient-purple" },
  { title: "Locations", value: "6", icon: MapPin, gradient: "stat-gradient-gold" },
];

export default function CellGroupsPage() {
  const [search, setSearch] = useState("");

  const filtered = cellGroups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.leader.toLowerCase().includes(search.toLowerCase()) ||
    g.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cell Groups</h1>
            <p className="text-muted-foreground">Manage house fellowship groups, leaders, and weekly meeting attendance.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Add Cell Group</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Cell Group</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div><Label>Group Name</Label><Input placeholder="e.g. Grace Fellowship" /></div>
                <div><Label>Leader</Label><Input placeholder="Leader name" /></div>
                <div><Label>Location</Label><Input placeholder="e.g. Ikeja, Lagos" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Meeting Day</Label><Input placeholder="e.g. Wednesday" /></div>
                  <div><Label>Time</Label><Input placeholder="e.g. 6:00 PM" /></div>
                </div>
                <Button className="w-full">Create Cell Group</Button>
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
            <CardTitle>All Cell Groups</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search groups..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Leader</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Meeting</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Avg. Attendance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(g => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium text-foreground">{g.name}</TableCell>
                    <TableCell className="text-foreground">{g.leader}</TableCell>
                    <TableCell className="text-muted-foreground">{g.location}</TableCell>
                    <TableCell className="text-foreground">{g.meetingDay}, {g.time}</TableCell>
                    <TableCell className="text-foreground">{g.members}</TableCell>
                    <TableCell className="text-foreground">{g.avgAttendance} ({Math.round(g.avgAttendance / g.members * 100)}%)</TableCell>
                    <TableCell>
                      <Badge variant={g.status === "Active" ? "default" : "secondary"}>{g.status}</Badge>
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
