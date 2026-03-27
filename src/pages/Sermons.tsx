import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Play, Download, BookOpen, Calendar, User, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sermons } from "@/data/sermons";

export default function SermonsPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = sermons.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) || s.preacher.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sermons</h1>
            <p className="text-muted-foreground text-sm">Upload and organize sermon recordings and resources.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Sermon</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Add New Sermon</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div><Label>Title</Label><Input placeholder="Sermon title..." /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Preacher</Label><Input placeholder="Preacher name..." /></div>
                  <div><Label>Date</Label><Input type="date" /></div>
                </div>
                <div><Label>Bible Text</Label><Input placeholder="e.g. John 3:16" /></div>
                <div><Label>Audio Upload</Label><Input type="file" accept="audio/*" /></div>
                <div><Label>Video Link</Label><Input placeholder="YouTube or video URL..." /></div>
                <div><Label>Notes</Label><Textarea placeholder="Sermon notes..." rows={3} /></div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={() => { setOpen(false); toast.success("Sermon added!"); }}>Save Sermon</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search sermons..." className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Sermon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <Card key={s.id} className="card-shadow hover:card-shadow-hover transition-all overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="secondary" className="rounded-full h-12 w-12 p-0">
                    <Play className="h-5 w-5 ml-0.5" />
                  </Button>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  {s.hasVideo && <Badge className="bg-primary text-primary-foreground text-xs"><Video className="h-3 w-3 mr-0.5" />Video</Badge>}
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-foreground line-clamp-1">{s.title}</h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><User className="h-3 w-3" />{s.preacher}</div>
                  <div className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{s.bibleText}</div>
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{s.date} · {s.duration}</div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1"><Play className="h-3.5 w-3.5 mr-1" />Play</Button>
                  <Button size="sm" variant="outline" className="flex-1"><Download className="h-3.5 w-3.5 mr-1" />Download</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
