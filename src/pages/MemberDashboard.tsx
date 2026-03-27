import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentMembers } from "@/components/dashboard/RecentMembers";
import { UpcomingBirthdays } from "@/components/dashboard/UpcomingBirthdays";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Heart, MessageSquare, BookOpen, Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { events } from "@/data/events";
import { sermons } from "@/data/sermons";

const MemberDashboard = () => {
  const { user } = useAuth();

  // Get upcoming events (next 3)
  const upcomingEvents = events
    .filter((e) => e.status === "Upcoming")
    .slice(0, 3);

  // Get recent sermons (next 3)
  const recentSermons = sermons.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's your personal dashboard and church updates.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="card-shadow hover:card-shadow-hover transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Submit Prayer</h3>
                  <p className="text-xs text-muted-foreground">Share your prayer needs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow hover:card-shadow-hover transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">View Events</h3>
                  <p className="text-xs text-muted-foreground">Upcoming church events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow hover:card-shadow-hover transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Watch Sermons</h3>
                  <p className="text-xs text-muted-foreground">Latest messages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow hover:card-shadow-hover transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Contact Us</h3>
                  <p className="text-xs text-muted-foreground">Get in touch</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium">New Member Welcome</p>
                  <p className="text-xs text-muted-foreground">Sarah Johnson joined our community this week!</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium">Youth Group Meeting</p>
                  <p className="text-xs text-muted-foreground">Next meeting: Friday 7 PM in the fellowship hall</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium">Prayer Chain Update</p>
                  <p className="text-xs text-muted-foreground">12 new prayer requests added this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg">My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                    {user?.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user?.name}</h3>
                    <p className="text-sm text-muted-foreground">Active Member</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Member Since</span>
                    <span>January 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Department</span>
                    <span>Worship Team</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cell Group</span>
                    <span>Grace Group</span>
                  </div>
                </div>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard;
