import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, MessageSquare, Bell, Send, Plus, Search, Users, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const messages = [
  { id: 1, subject: "Sunday Service Reminder", recipients: "All Members", type: "SMS", status: "sent", date: "Jan 14, 2024", sentBy: "Admin" },
  { id: 2, subject: "Youth Conference Registration", recipients: "Youth Ministry", type: "Email", status: "sent", date: "Jan 13, 2024", sentBy: "Pastor Grace" },
  { id: 3, subject: "Midweek Service Update", recipients: "All Members", type: "SMS", status: "scheduled", date: "Jan 15, 2024", sentBy: "Admin" },
  { id: 4, subject: "Financial Report - December", recipients: "Board Members", type: "Email", status: "sent", date: "Jan 10, 2024", sentBy: "Finance Team" },
  { id: 5, subject: "New Year Fasting Guidelines", recipients: "All Members", type: "Email", status: "sent", date: "Jan 1, 2024", sentBy: "Pastor James" },
  { id: 6, subject: "Building Fund Update", recipients: "All Members", type: "SMS", status: "draft", date: "Jan 14, 2024", sentBy: "Admin" },
];

const announcements = [
  { id: 1, title: "Annual Thanksgiving Service", content: "Join us for our Annual Thanksgiving celebration this Sunday.", priority: "high", date: "Jan 14, 2024" },
  { id: 2, title: "Children's Ministry Volunteer Drive", content: "We need volunteers for children's church every Sunday.", priority: "medium", date: "Jan 12, 2024" },
  { id: 3, title: "Church Building Maintenance", content: "The church premises will undergo maintenance next week.", priority: "low", date: "Jan 10, 2024" },
];

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const statusColors: Record<string, string> = {
  sent: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  draft: "bg-muted text-muted-foreground",
};

export default function CommunicationsPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredMessages = messages.filter((m) =>
    m.subject.toLowerCase().includes(search.toLowerCase()) || m.recipients.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Communications</h1>
            <p className="text-muted-foreground text-sm">Send messages, announcements, and newsletters.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Message</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Compose Message</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label>Recipients</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Members</SelectItem>
                      <SelectItem value="youth">Youth Ministry</SelectItem>
                      <SelectItem value="women">Women Ministry</SelectItem>
                      <SelectItem value="men">Men Fellowship</SelectItem>
                      <SelectItem value="workers">Workers</SelectItem>
                      <SelectItem value="board">Board Members</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Channel</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select channel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="both">SMS & Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Subject</Label><Input placeholder="Message subject..." /></div>
                <div><Label>Message</Label><Textarea placeholder="Type your message..." rows={4} /></div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>Save Draft</Button>
                  <Button onClick={() => { setOpen(false); toast.success("Message sent!"); }}><Send className="h-4 w-4 mr-1" />Send</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Sent", value: "1,234", icon: Mail, gradient: "stat-gradient-blue" },
            { label: "SMS Sent", value: "856", icon: MessageSquare, gradient: "stat-gradient-green" },
            { label: "Emails Sent", value: "378", icon: Send, gradient: "stat-gradient-purple" },
            { label: "Scheduled", value: "5", icon: Clock, gradient: "stat-gradient-gold" },
          ].map((s) => (
            <Card key={s.label} className="card-shadow"><CardContent className="p-5 flex items-center gap-4">
              <div className={`h-11 w-11 rounded-xl ${s.gradient} flex items-center justify-center`}><s.icon className="h-5 w-5 text-white" /></div>
              <div><p className="text-xs font-medium text-muted-foreground uppercase">{s.label}</p><p className="text-2xl font-bold text-foreground">{s.value}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Card className="card-shadow">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Sent By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((m) => (
                      <TableRow key={m.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{m.subject}</TableCell>
                        <TableCell><div className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="h-3 w-3" />{m.recipients}</div></TableCell>
                        <TableCell><Badge variant="secondary">{m.type}</Badge></TableCell>
                        <TableCell><Badge variant="secondary" className={statusColors[m.status]}>{m.status === "sent" && <CheckCircle2 className="h-3 w-3 mr-1" />}{m.status}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{m.date}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{m.sentBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {announcements.map((a) => (
                <Card key={a.id} className="card-shadow hover:card-shadow-hover transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center"><Bell className="h-4 w-4 text-primary" /></div>
                        <Badge variant="secondary" className={priorityColors[a.priority]}>{a.priority}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{a.date}</span>
                    </div>
                    <h3 className="font-semibold text-foreground">{a.title}</h3>
                    <p className="text-sm text-muted-foreground">{a.content}</p>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                      <Button size="sm" className="flex-1">Publish</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
