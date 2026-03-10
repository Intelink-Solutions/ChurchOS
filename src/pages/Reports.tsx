import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Download, FileText, Users, DollarSign, ClipboardCheck, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";

const attendanceData = [
  { month: "Aug", attendance: 320 }, { month: "Sep", attendance: 350 },
  { month: "Oct", attendance: 380 }, { month: "Nov", attendance: 410 },
  { month: "Dec", attendance: 520 }, { month: "Jan", attendance: 450 },
];

const financeData = [
  { month: "Aug", income: 8500000, expenses: 3200000 },
  { month: "Sep", income: 9200000, expenses: 3500000 },
  { month: "Oct", income: 10100000, expenses: 3800000 },
  { month: "Nov", income: 11000000, expenses: 4000000 },
  { month: "Dec", income: 15200000, expenses: 5100000 },
  { month: "Jan", income: 12450000, expenses: 4230000 },
];

const membershipData = [
  { name: "Active", value: 450, color: "hsl(224, 76%, 33%)" },
  { name: "Inactive", value: 85, color: "hsl(220, 9%, 46%)" },
  { name: "New (This Month)", value: 23, color: "hsl(142, 76%, 36%)" },
  { name: "Visitors", value: 42, color: "hsl(43, 96%, 56%)" },
];

const recentReports = [
  { name: "Monthly Attendance Report", type: "Attendance", date: "Jan 2024", status: "Generated" },
  { name: "Financial Summary Q4 2023", type: "Finance", date: "Dec 2023", status: "Generated" },
  { name: "Membership Growth Report", type: "Growth", date: "Jan 2024", status: "Generated" },
  { name: "Department Activity Report", type: "Departments", date: "Jan 2024", status: "Pending" },
  { name: "Tithe & Offering Summary", type: "Finance", date: "Jan 2024", status: "Generated" },
];

const stats = [
  { title: "Reports Generated", value: "24", icon: FileText, gradient: "stat-gradient-blue" },
  { title: "Avg. Attendance", value: "405", icon: ClipboardCheck, gradient: "stat-gradient-green" },
  { title: "Total Members", value: "600", icon: Users, gradient: "stat-gradient-purple" },
  { title: "Monthly Income", value: "₦12.4M", icon: DollarSign, gradient: "stat-gradient-gold" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("6months");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">Generate detailed reports on attendance, finance, and growth metrics.</p>
          </div>
          <div className="flex gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export All</Button>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-shadow">
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Attendance Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="month" stroke="hsl(220, 9%, 46%)" />
                  <YAxis stroke="hsl(220, 9%, 46%)" />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="hsl(224, 76%, 33%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Income vs Expenses</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="month" stroke="hsl(220, 9%, 46%)" />
                  <YAxis stroke="hsl(220, 9%, 46%)" tickFormatter={v => `₦${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(v: number) => `₦${(v / 1000000).toFixed(1)}M`} />
                  <Line type="monotone" dataKey="income" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expenses" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="card-shadow">
            <CardHeader><CardTitle>Membership Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={membershipData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {membershipData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-shadow lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4" />Generate New</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-foreground">{r.name}</TableCell>
                      <TableCell className="text-muted-foreground">{r.type}</TableCell>
                      <TableCell className="text-muted-foreground">{r.date}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === "Generated" ? "default" : "secondary"}>{r.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

