import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Users, Target, Brain, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar } from "recharts";
import { useState } from "react";

const growthData = [
  { month: "Jun", members: 520, attendance: 310, giving: 7.2 },
  { month: "Jul", members: 535, attendance: 325, giving: 7.8 },
  { month: "Aug", members: 548, attendance: 340, giving: 8.5 },
  { month: "Sep", members: 560, attendance: 355, giving: 9.2 },
  { month: "Oct", members: 572, attendance: 380, giving: 10.1 },
  { month: "Nov", members: 585, attendance: 410, giving: 11.0 },
  { month: "Dec", members: 595, attendance: 520, giving: 15.2 },
  { month: "Jan", members: 600, attendance: 450, giving: 12.4 },
];

const healthMetrics = [
  { metric: "Attendance Rate", value: 75 },
  { metric: "Member Retention", value: 92 },
  { metric: "New Converts", value: 65 },
  { metric: "Giving Growth", value: 78 },
  { metric: "Volunteer Rate", value: 45 },
  { metric: "Event Participation", value: 60 },
];

const departmentGrowth = [
  { dept: "Choir", growth: 15 }, { dept: "Media", growth: 25 },
  { dept: "Youth", growth: 20 }, { dept: "Ushers", growth: 8 },
  { dept: "Children", growth: 12 }, { dept: "Prayer", growth: 18 },
];

const predictions = [
  { metric: "Projected Membership (Q2)", value: "650", trend: "up", change: "+8.3%", confidence: "High" },
  { metric: "Estimated Giving (Feb)", value: "₦13.8M", trend: "up", change: "+11.2%", confidence: "Medium" },
  { metric: "Expected Attendance (Feb)", value: "470", trend: "up", change: "+4.4%", confidence: "High" },
  { metric: "Churn Risk Members", value: "12", trend: "down", change: "-3 from last month", confidence: "Medium" },
];

const insights = [
  { title: "Youth Ministry Growing Fast", description: "20% growth in 6 months. Consider expanding leadership team.", type: "opportunity" },
  { title: "Wednesday Attendance Declining", description: "Midweek service attendance dropped 15%. Review service format.", type: "warning" },
  { title: "Giving Trend Positive", description: "Consistent month-over-month increase in tithes. Strong financial health.", type: "positive" },
  { title: "12 Members At Risk", description: "Haven't attended in 4+ weeks. Recommend pastoral follow-up.", type: "warning" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("8months");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Church Growth Intelligence</h1>
            <p className="text-muted-foreground">Advanced analytics with predictive insights for strategic decisions.</p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="8months">Last 8 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Predictions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {predictions.map(p => (
            <Card key={p.metric} className="card-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={p.confidence === "High" ? "default" : "secondary"} className="text-xs">{p.confidence} confidence</Badge>
                  {p.trend === "up" ? <ArrowUpRight className="h-4 w-4 text-success" /> : <ArrowDownRight className="h-4 w-4 text-destructive" />}
                </div>
                <p className="text-2xl font-bold text-foreground">{p.value}</p>
                <p className="text-xs text-muted-foreground">{p.metric}</p>
                <p className={`text-xs mt-1 ${p.trend === "up" ? "text-success" : "text-destructive"}`}>{p.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Growth Chart */}
        <Card className="card-shadow">
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Growth Trajectory</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" stroke="hsl(220, 9%, 46%)" />
                <YAxis stroke="hsl(220, 9%, 46%)" />
                <Tooltip />
                <Area type="monotone" dataKey="members" stroke="hsl(224, 76%, 33%)" fill="hsl(224, 76%, 33%)" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="attendance" stroke="hsl(142, 76%, 36%)" fill="hsl(142, 76%, 36%)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Church Health Radar */}
          <Card className="card-shadow">
            <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Church Health Score</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={healthMetrics}>
                  <PolarGrid stroke="hsl(220, 13%, 91%)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(220, 9%, 46%)" }} />
                  <Radar name="Score" dataKey="value" stroke="hsl(224, 76%, 33%)" fill="hsl(224, 76%, 33%)" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Growth */}
          <Card className="card-shadow">
            <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-accent" />Department Growth (%)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentGrowth} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis type="number" stroke="hsl(220, 9%, 46%)" />
                  <YAxis type="category" dataKey="dept" stroke="hsl(220, 9%, 46%)" width={80} />
                  <Tooltip />
                  <Bar dataKey="growth" fill="hsl(43, 96%, 56%)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="card-shadow">
          <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary" />AI-Powered Insights</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, i) => (
                <div key={i} className={`p-4 rounded-xl border ${
                  insight.type === "positive" ? "border-success/30 bg-success/5" :
                  insight.type === "warning" ? "border-accent/30 bg-accent/5" :
                  "border-primary/30 bg-primary/5"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {insight.type === "positive" ? <TrendingUp className="h-4 w-4 text-success" /> :
                     insight.type === "warning" ? <TrendingDown className="h-4 w-4 text-accent" /> :
                     <Zap className="h-4 w-4 text-primary" />}
                    <p className="font-semibold text-sm text-foreground">{insight.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
