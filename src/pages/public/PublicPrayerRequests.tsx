import { PublicLayout } from "@/components/public/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HandHeart, CheckCircle2, Clock, User, Send, Heart } from "lucide-react";
import { initialRequests, categoryColors, type PrayerRequest } from "@/data/prayerRequests";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function PublicPrayerRequests() {
  const [requests, setRequests] = useState<PrayerRequest[]>(initialRequests);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [requestText, setRequestText] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [prayedFor, setPrayedFor] = useState<Set<string>>(new Set());

  const publicRequests = requests.filter((r) => r.isPublic);

  const handleSubmit = () => {
    if (!name.trim() || !requestText.trim() || !category) {
      toast.error("Please fill in all fields.");
      return;
    }

    const newRequest: PrayerRequest = {
      id: `PR-${String(requests.length + 1).padStart(3, "0")}`,
      member: name.trim(),
      request: requestText.trim(),
      isPublic,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      category,
    };

    setRequests((prev) => [newRequest, ...prev]);
    setName("");
    setCategory("");
    setRequestText("");
    setIsPublic(true);
    toast.success("Prayer request submitted! Our prayer team will intercede for you.");
  };

  const handlePrayFor = (id: string, member: string) => {
    setPrayedFor((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("Prayer removed");
      } else {
        next.add(id);
        toast.success(`Praying for ${member}. God bless you!`);
      }
      return next;
    });
  };

  return (
    <PublicLayout>
      {/* Header */}
      <section className="stat-gradient-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HandHeart className="h-12 w-12 text-white/80 mx-auto mb-4" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Prayer Requests
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 max-w-lg mx-auto"
          >
            Share your prayer needs with our church community. Together, we stand in faith.
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Submit Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="card-shadow sticky top-24">
              <CardContent className="p-6 space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Submit a Prayer Request</h2>
                  <p className="text-sm text-muted-foreground">Your request will be shared with our prayer team.</p>
                </div>
                <div>
                  <Label>Your Name</Label>
                  <Input placeholder="Enter your name..." value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Healing">Healing</SelectItem>
                      <SelectItem value="Guidance">Guidance</SelectItem>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Comfort">Comfort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Prayer Request</Label>
                  <Textarea
                    placeholder="Describe your prayer need..."
                    rows={4}
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Make Public</p>
                    <p className="text-xs text-muted-foreground">Allow others to see and pray along</p>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
                <Button
                  className="w-full hover:scale-[1.02] transition-transform active:scale-95"
                  onClick={handleSubmit}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Prayer Request
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Public Prayer Wall */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-2"
            >
              <h2 className="text-xl font-bold text-foreground">Community Prayer Wall</h2>
              <p className="text-sm text-muted-foreground">{publicRequests.length} public prayer requests</p>
            </motion.div>
            {publicRequests.map((r, i) => (
              <motion.div
                key={r.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Card className="card-shadow hover:card-shadow-hover transition-all hover:-translate-y-0.5 duration-300">
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
                      <Badge variant="secondary" className={categoryColors[r.category] || ""}>{r.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.request}</p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={r.status === "answered" ? "default" : "secondary"}
                        className={r.status === "answered" ? "bg-green-600 text-white" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}
                      >
                        {r.status === "answered" ? <><CheckCircle2 className="h-3 w-3 mr-1" />Answered</> : <><Clock className="h-3 w-3 mr-1" />Pending</>}
                      </Badge>
                      <Button
                        size="sm"
                        variant={prayedFor.has(r.id) ? "default" : "outline"}
                        className="hover:scale-105 transition-transform active:scale-95"
                        onClick={() => handlePrayFor(r.id, r.member)}
                      >
                        <Heart className={`h-3.5 w-3.5 mr-1 ${prayedFor.has(r.id) ? "fill-current" : ""}`} />
                        {prayedFor.has(r.id) ? "Praying" : "Pray for this"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
