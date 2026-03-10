import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, TrendingUp, TrendingDown, Clock, Plus, Search, Download, Filter } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

const rawOverviewCards = [
  { title: "Total Income", amount: 12450000, change: "+12.5%", up: true, icon: DollarSign, gradient: "stat-gradient-green" },
  { title: "Total Expenses", amount: 4230000, change: "+3.2%", up: false, icon: TrendingDown, gradient: "stat-gradient-purple" },
  { title: "Net Balance", amount: 8220000, change: "+18.1%", up: true, icon: TrendingUp, gradient: "stat-gradient-blue" },
  { title: "Pending Pledges", amount: 2150000, change: "23 pending", up: true, icon: Clock, gradient: "stat-gradient-gold" },
];

const rawOfferings = [
  { id: "RCT-001", member: "John Adeyemi", amount: 150000, category: "Tithe", method: "Bank Transfer", date: "2024-01-14" },
  { id: "RCT-002", member: "Grace Okafor", amount: 50000, category: "Offering", method: "Cash", date: "2024-01-14" },
  { id: "RCT-003", member: "Samuel Eze", amount: 200000, category: "Tithe", method: "POS", date: "2024-01-13" },
  { id: "RCT-004", member: "Mary Johnson", amount: 75000, category: "Seed", method: "Bank Transfer", date: "2024-01-13" },
  { id: "RCT-005", member: "David Nwosu", amount: 100000, category: "Offering", method: "Online", date: "2024-01-12" },
  { id: "RCT-006", member: "Esther Williams", amount: 250000, category: "Tithe", method: "Cash", date: "2024-01-12" },
  { id: "RCT-007", member: "Peter Obi", amount: 30000, category: "Offering", method: "POS", date: "2024-01-11" },
  { id: "RCT-008", member: "Ruth Balogun", amount: 180000, category: "Building Fund", method: "Bank Transfer", date: "2024-01-11" },
];

const categoryColors: Record<string, string> = {
  Tithe: "bg-primary/10 text-primary",
  Offering: "bg-accent/10 text-accent-foreground",
  Seed: "bg-green-100 text-green-700",
  "Building Fund": "bg-purple-100 text-purple-700",
};

export default function FinancePage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { formatAmount } = useCurrency();

  const filtered = rawOfferings.filter(
    (o) => o.member.toLowerCase().includes(search.toLowerCase()) || o.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finance</h1>
            <p className="text-muted-foreground text-sm">Track income, expenses, and financial reports.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Offering</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Record New Offering</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                  <div><Label>Member</Label><Input placeholder="Search member..." /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Amount</Label><Input type="number" placeholder="0.00" /></div>
                    <div>
                      <Label>Category</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tithe">Tithe</SelectItem>
                          <SelectItem value="offering">Offering</SelectItem>
                          <SelectItem value="seed">Seed</SelectItem>
                          <SelectItem value="building">Building Fund</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="transfer">Bank Transfer</SelectItem>
                        <SelectItem value="pos">POS</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Notes</Label><Textarea placeholder="Optional notes..." rows={2} /></div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => setOpen(false)}>Save Offering</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rawOverviewCards.map((card) => (
            <Card key={card.title} className="card-shadow hover:card-shadow-hover transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{formatAmount(card.amount)}</p>
                    <p className={`text-xs mt-1 ${card.up ? "text-green-600" : "text-red-500"}`}>{card.change}</p>
                  </div>
                  <div className={`h-11 w-11 rounded-xl ${card.gradient} flex items-center justify-center`}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-lg">Tithes & Offerings</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-8 h-9 w-52" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant="outline" size="sm"><Filter className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">{o.id}</TableCell>
                    <TableCell className="font-medium">{o.member}</TableCell>
                    <TableCell className="font-semibold">{formatAmount(o.amount)}</TableCell>
                    <TableCell><Badge variant="secondary" className={categoryColors[o.category]}>{o.category}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{o.method}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{o.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
