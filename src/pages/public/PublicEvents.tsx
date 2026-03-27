import { PublicLayout } from "@/components/public/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { events } from "@/data/events";
import { toast } from "sonner";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  Upcoming: "bg-primary/10 text-primary",
  Open: "bg-green-100 text-green-700",
  Planning: "bg-muted text-muted-foreground",
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function PublicEvents() {
  return (
    <PublicLayout>
      {/* Header */}
      <section className="stat-gradient-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            ChurchOS Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/80 max-w-lg mx-auto"
          >
            Stay connected with what's happening. Join us for worship, fellowship, and community events.
          </motion.p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Card className="card-shadow hover:card-shadow-hover transition-all overflow-hidden group hover:-translate-y-1 duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <Badge className={`absolute top-3 right-3 ${statusColors[event.status]}`}>{event.status}</Badge>
                </div>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-foreground text-lg">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  )}
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{event.date}</div>
                    <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{event.time}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{event.location}</div>
                    <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />{event.attendees} expected</div>
                  </div>
                  {event.registration ? (
                    <Button
                      className="w-full mt-2 hover:scale-[1.02] transition-transform active:scale-95"
                      onClick={() => toast.success(`Successfully registered for "${event.title}"! Check your email for confirmation.`)}
                    >
                      Register for Event
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full mt-2 hover:scale-[1.02] transition-transform active:scale-95"
                      onClick={() => toast.info(`Registration for "${event.title}" opens soon. Stay tuned!`)}
                    >
                      Notify Me
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
