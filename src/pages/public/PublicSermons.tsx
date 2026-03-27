import { PublicLayout } from "@/components/public/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Download, BookOpen, Calendar, User, Video, Search, Share2 } from "lucide-react";
import { sermons } from "@/data/sermons";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function PublicSermons() {
  const [search, setSearch] = useState("");

  const filtered = sermons.filter(
    (s) => s.title.toLowerCase().includes(search.toLowerCase()) || s.preacher.toLowerCase().includes(search.toLowerCase())
  );

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
            Sermon Library
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/80 max-w-lg mx-auto"
          >
            Listen to and download messages from our pastors. Be inspired and grow in your faith.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative max-w-md mx-auto mb-10"
        >
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sermons by title or preacher..."
            className="pl-9 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Card className="card-shadow hover:card-shadow-hover transition-all overflow-hidden group hover:-translate-y-1 duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full h-14 w-14 p-0 hover:scale-110 transition-transform"
                      onClick={() => toast.info(`Now playing: "${s.title}" by ${s.preacher}`)}
                    >
                      <Play className="h-6 w-6 ml-0.5" />
                    </Button>
                  </div>
                  {s.hasVideo && (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs">
                      <Video className="h-3 w-3 mr-1" />Video
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-foreground text-lg line-clamp-1">{s.title}</h3>
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><User className="h-3.5 w-3.5" />{s.preacher}</div>
                    <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{s.bibleText}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{s.date} · {s.duration}</div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 hover:scale-[1.02] transition-transform active:scale-95"
                      onClick={() => toast.info(`Now playing: "${s.title}" by ${s.preacher}`)}
                    >
                      <Play className="h-3.5 w-3.5 mr-1" />Play
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 hover:scale-[1.02] transition-transform active:scale-95"
                      onClick={() => toast.success(`Downloading "${s.title}"...`)}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />Download
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:scale-105 transition-transform active:scale-95"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }}
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No sermons found matching your search.</p>
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
