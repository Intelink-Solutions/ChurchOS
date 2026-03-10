import { PublicLayout } from "@/components/public/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BookOpen, HandHeart, ArrowRight, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { events } from "@/data/events";
import { sermons } from "@/data/sermons";
import { toast } from "sonner";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function PublicHome() {
  const upcomingEvents = events.filter((e) => e.status === "Upcoming").slice(0, 3);
  const latestSermons = sermons.slice(0, 3);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 stat-gradient-blue opacity-95" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&h=800&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Welcome to Grace<br />Community Church
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8"
          >
            Building faith, transforming lives, and impacting communities for Christ. Join us every Sunday for worship and fellowship.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/website/events">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5 mr-2" />
                View Events
              </Button>
            </Link>
            <Link to="/website/sermons">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5 mr-2" />
                Watch Sermons
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
            <p className="text-sm text-muted-foreground mt-1">Don't miss what's happening at our church</p>
          </div>
          <Link to="/website/events">
            <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </Link>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {upcomingEvents.map((event, i) => (
            <motion.div key={event.id} variants={fadeUp} custom={i}>
              <Card className="card-shadow hover:card-shadow-hover transition-all overflow-hidden group hover:-translate-y-1 duration-300">
                <div className="relative h-44 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <CardContent className="p-5 space-y-2">
                  <h3 className="font-semibold text-foreground">{event.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{event.date}</div>
                    <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{event.time}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{event.location}</div>
                  </div>
                  {event.registration && (
                    <Button
                      size="sm"
                      className="w-full mt-2 hover:scale-[1.02] transition-transform active:scale-95"
                      onClick={() => toast.success(`Registered for ${event.title}!`)}
                    >
                      Register Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Latest Sermons */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground">Latest Sermons</h2>
              <p className="text-sm text-muted-foreground mt-1">Catch up on recent messages from our pastors</p>
            </div>
            <Link to="/website/sermons">
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {latestSermons.map((s, i) => (
              <motion.div key={s.id} variants={fadeUp} custom={i}>
                <Card className="card-shadow hover:card-shadow-hover transition-all overflow-hidden group hover:-translate-y-1 duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <CardContent className="p-5 space-y-2">
                    <h3 className="font-semibold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.preacher}</p>
                    <p className="text-xs text-muted-foreground">{s.bibleText} · {s.date}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2 hover:scale-[1.02] transition-transform active:scale-95"
                      onClick={() => toast.info(`Now playing: "${s.title}" by ${s.preacher}`)}
                    >
                      Listen Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Prayer CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="card-shadow overflow-hidden">
            <div className="relative p-8 sm:p-12 text-center stat-gradient-blue">
              <HandHeart className="h-12 w-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Need Prayer?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto mb-6">
                We believe in the power of prayer. Submit your prayer request and our prayer team will intercede on your behalf.
              </p>
              <Link to="/website/prayer-requests">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold hover:scale-105 transition-transform active:scale-95">
                  Submit Prayer Request
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>
    </PublicLayout>
  );
}
