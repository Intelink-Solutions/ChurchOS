import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MapPin, Plus, Users, Edit, Trash2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { events } from "@/data/events";

const statusColors: Record<string, string> = {
  Upcoming: "bg-primary/10 text-primary",
  Open: "bg-green-100 text-green-700",
  Planning: "bg-accent/10 text-accent-foreground",
};

export default function EventsPage() {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Events</h1>
            <p className="text-muted-foreground text-sm">Create and manage church events and registrations.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Event</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Create New Event</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div><Label>Event Title</Label><Input placeholder="e.g. Annual Thanksgiving" /></div>
                <div><Label>Description</Label><Textarea placeholder="Describe the event..." rows={3} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Date</Label><Input type="date" /></div>
                  <div><Label>Time</Label><Input type="time" /></div>
                </div>
                <div><Label>Location</Label><Input placeholder="e.g. Main Auditorium" /></div>
                <div><Label>Banner Image URL</Label><Input placeholder="https://..." /></div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Enable Registration</p>
                    <p className="text-xs text-muted-foreground">Allow members to register online</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={() => setOpen(false)}>Create Event</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {events.map((event) => (
            <Card key={event.id} className="card-shadow hover:card-shadow-hover transition-all overflow-hidden group">
              <div className="relative h-40 overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <Badge className={`absolute top-3 right-3 ${statusColors[event.status]}`}>{event.status}</Badge>
              </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-foreground text-base leading-tight">{event.title}</h3>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{event.date}</div>
                  <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{event.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{event.location}</div>
                  <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />{event.attendees} expected</div>
                </div>
                <div className="flex gap-2 pt-1">
                  {event.registration && <Button size="sm" className="flex-1">Register</Button>}
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
