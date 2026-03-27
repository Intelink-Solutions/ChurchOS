import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Church, GitBranch, Shield, Users, Bell, CreditCard, Save, Plus, Trash2, Edit, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrency, currencies, type CurrencyCode } from "@/contexts/CurrencyContext";
import { useDarkMode } from "@/contexts/DarkModeContext";

const branches = [
  { id: 1, name: "Main Campus", pastor: "Pastor James Adeyemi", location: "Lagos, Nigeria", members: 1250, status: "active" },
  { id: 2, name: "Abuja Branch", pastor: "Pastor Grace Okafor", location: "Abuja, Nigeria", members: 430, status: "active" },
  { id: 3, name: "Port Harcourt", pastor: "Pastor Samuel Eze", location: "PH, Nigeria", members: 280, status: "active" },
];

const roles = [
  { id: 1, name: "Super Admin", permissions: "Full Access", users: 2 },
  { id: 2, name: "Pastor", permissions: "View All, Edit Members", users: 3 },
  { id: 3, name: "Admin", permissions: "Manage Members, Finance", users: 5 },
  { id: 4, name: "Department Leader", permissions: "View Department", users: 12 },
  { id: 5, name: "Member", permissions: "View Only", users: 850 },
];

const paymentGateways = [
  { id: "paystack", name: "Paystack", description: "Popular in Nigeria & Africa", regions: "Africa" },
  { id: "flutterwave", name: "Flutterwave", description: "Pan-African payments", regions: "Africa" },
  { id: "stripe", name: "Stripe", description: "Global payment processing", regions: "Global" },
  { id: "paypal", name: "PayPal", description: "Worldwide digital payments", regions: "Global" },
];

const themeOptions = [
  { id: "default", label: "Default", color: "224 76% 48%" },
  { id: "ocean", label: "Ocean Blue", color: "190 79% 44%" },
  { id: "sunset", label: "Sunset Orange", color: "14 85% 55%" },
  { id: "forest", label: "Forest Green", color: "140 60% 34%" },
  { id: "fuchsia", label: "Fuchsia", color: "306 75% 53%" },
];

export default function SettingsPage() {
  const { currency, setCurrencyCode } = useCurrency();
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [birthdayNotif, setBirthdayNotif] = useState(true);
  const [attendanceNotif, setAttendanceNotif] = useState(true);
  const [selectedGateway, setSelectedGateway] = useState("paystack");
  const [onlineGiving, setOnlineGiving] = useState(true);
  const [recurringGiving, setRecurringGiving] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [webhookUrl] = useState("https://graceassembly.org/api/webhooks/payments");

  const [themeId, setThemeId] = useState("default");
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const root = document.documentElement;
    const selected = themeOptions.find((t) => t.id === themeId);
    if (selected) {
      root.style.setProperty("--primary", selected.color);
      root.style.setProperty("--sidebar-primary", selected.color);
    }

    localStorage.setItem("churchos-theme", themeId);
  }, [themeId]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("churchos-theme");

    if (storedTheme) setThemeId(storedTheme);
  }, []);

  const handleCurrencyChange = (code: string) => {
    setCurrencyCode(code as CurrencyCode);
    const selected = currencies.find((c) => c.code === code);
    toast.success(`Currency changed to ${selected?.label}. All finance pages updated.`);
  };

  const handleSavePayment = () => {
    toast.success("Payment settings saved successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm">Configure church profile, branches, roles, and preferences.</p>
        </div>

        <Tabs defaultValue="church" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="church"><Church className="h-4 w-4 mr-1" />Church Profile</TabsTrigger>
            <TabsTrigger value="branches"><GitBranch className="h-4 w-4 mr-1" />Branches</TabsTrigger>
            <TabsTrigger value="roles"><Shield className="h-4 w-4 mr-1" />Roles</TabsTrigger>
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-1" />Users</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-1" />Notifications</TabsTrigger>
            <TabsTrigger value="appearance"><CheckCircle2 className="h-4 w-4 mr-1" />Appearance</TabsTrigger>
            <TabsTrigger value="payments"><CreditCard className="h-4 w-4 mr-1" />Payments</TabsTrigger>
          </TabsList>

          {/* Church Profile */}
          <TabsContent value="church">
            <Card className="card-shadow">
              <CardHeader><CardTitle>Church Profile</CardTitle><CardDescription>Update your church's basic information.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Church Name</Label><Input defaultValue="Grace Assembly International" /></div>
                  <div><Label>Denomination</Label><Input defaultValue="Non-Denominational" /></div>
                  <div><Label>Senior Pastor</Label><Input defaultValue="Pastor James Adeyemi" /></div>
                  <div><Label>Phone</Label><Input defaultValue="+234 801 234 5678" /></div>
                  <div><Label>Email</Label><Input defaultValue="info@graceassembly.org" /></div>
                  <div><Label>Website</Label><Input defaultValue="www.graceassembly.org" /></div>
                </div>
                <div><Label>Address</Label><Textarea defaultValue="123 Grace Avenue, Lekki, Lagos, Nigeria" rows={2} /></div>
                <div><Label>Church Logo</Label><Input type="file" accept="image/*" /></div>
                <Button onClick={() => toast.success("Church profile updated!")}><Save className="h-4 w-4 mr-1" />Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branches */}
          <TabsContent value="branches">
            <Card className="card-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Branch Management</CardTitle><CardDescription>Manage church branches and locations.</CardDescription></div>
                <Button size="sm" onClick={() => toast.info("Add branch form coming soon")}><Plus className="h-4 w-4 mr-1" />Add Branch</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Branch Name</TableHead><TableHead>Pastor</TableHead><TableHead>Location</TableHead><TableHead>Members</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {branches.map((b) => (
                      <TableRow key={b.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{b.name}</TableCell>
                        <TableCell className="text-muted-foreground">{b.pastor}</TableCell>
                        <TableCell className="text-muted-foreground">{b.location}</TableCell>
                        <TableCell>{b.members}</TableCell>
                        <TableCell><Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{b.status}</Badge></TableCell>
                        <TableCell><div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => toast.info("Edit branch")}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error("Branch deleted")}><Trash2 className="h-4 w-4" /></Button>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles */}
          <TabsContent value="roles">
            <Card className="card-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Role Management</CardTitle><CardDescription>Define user roles and permissions.</CardDescription></div>
                <Button size="sm" onClick={() => toast.info("Add role form coming soon")}><Plus className="h-4 w-4 mr-1" />Add Role</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Role</TableHead><TableHead>Permissions</TableHead><TableHead>Users</TableHead><TableHead>Actions</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {roles.map((r) => (
                      <TableRow key={r.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{r.permissions}</TableCell>
                        <TableCell><Badge variant="secondary">{r.users}</Badge></TableCell>
                        <TableCell><div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => toast.info("Edit role")}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error("Role deleted")}><Trash2 className="h-4 w-4" /></Button>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card className="card-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>User Management</CardTitle><CardDescription>Manage system users and access.</CardDescription></div>
                <Button size="sm" onClick={() => toast.info("Invite user form coming soon")}><Plus className="h-4 w-4 mr-1" />Invite User</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {[
                      { name: "James Adeyemi", email: "james@graceassembly.org", role: "Super Admin", status: "active" },
                      { name: "Grace Okafor", email: "grace@graceassembly.org", role: "Pastor", status: "active" },
                      { name: "Admin User", email: "admin@graceassembly.org", role: "Admin", status: "active" },
                    ].map((u, i) => (
                      <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell><Badge variant="secondary">{u.role}</Badge></TableCell>
                        <TableCell><Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{u.status}</Badge></TableCell>
                        <TableCell><div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => toast.info("Edit user")}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error("User removed")}><Trash2 className="h-4 w-4" /></Button>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="card-shadow">
              <CardHeader><CardTitle>Notification Settings</CardTitle><CardDescription>Configure how you receive notifications.</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Email Notifications", desc: "Receive updates via email", checked: emailNotif, onChange: setEmailNotif },
                  { label: "SMS Notifications", desc: "Receive updates via SMS", checked: smsNotif, onChange: setSmsNotif },
                  { label: "Push Notifications", desc: "Browser push notifications", checked: pushNotif, onChange: setPushNotif },
                  { label: "Birthday Reminders", desc: "Get notified of upcoming member birthdays", checked: birthdayNotif, onChange: setBirthdayNotif },
                  { label: "Attendance Alerts", desc: "Alert when attendance drops below threshold", checked: attendanceNotif, onChange: setAttendanceNotif },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between">
                    <div><p className="font-medium text-sm text-foreground">{n.label}</p><p className="text-xs text-muted-foreground">{n.desc}</p></div>
                    <Switch checked={n.checked} onCheckedChange={n.onChange} />
                  </div>
                ))}
                <Button onClick={() => toast.success("Notification settings saved!")}><Save className="h-4 w-4 mr-1" />Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize theme colors and background style.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setThemeId(option.id)}
                      className={`rounded-lg border p-3 text-left transition ${themeId === option.id ? "border-primary bg-primary/20" : "border-slate-600 bg-slate-900/50"}`}
                    >
                      <div className="text-sm font-semibold text-foreground">{option.label}</div>
                      <div className="mt-1 h-2 w-full rounded-md" style={{ background: `hsl(${option.color})` }} />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Logo/Overlay opacity</Label>
                    <input
                      type="range"
                      min={10}
                      max={95}
                      value={isDarkMode ? 85 : 45}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        document.documentElement.style.setProperty("--login-overlay-opacity", `${v}%`);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Dark mode</Label>
                    <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Theme selection is saved in browser storage and applies immediately. For global palette updates, you can modify sidebar and accent colors in this token.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments */}
          <TabsContent value="payments">
            <div className="space-y-6">
              {/* Payment Gateway Selection */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Payment Gateway</CardTitle>
                  <CardDescription>Choose and configure your preferred payment processor.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {paymentGateways.map((gw) => (
                      <button
                        key={gw.id}
                        onClick={() => {
                          setSelectedGateway(gw.id);
                          toast.success(`Switched to ${gw.name}`);
                        }}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                          selectedGateway === gw.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30 bg-card"
                        }`}
                      >
                        {selectedGateway === gw.id && (
                          <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                        )}
                        <p className="font-semibold text-foreground">{gw.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{gw.description}</p>
                        <Badge variant="secondary" className="mt-2 text-xs">{gw.regions}</Badge>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <Label>API Public Key</Label>
                      <Input
                        placeholder="pk_live_..."
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Your publishable/public API key</p>
                    </div>
                    <div>
                      <Label>API Secret Key</Label>
                      <Input
                        type="password"
                        placeholder="sk_live_..."
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Your secret API key (never shared)</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Webhook URL</Label>
                      <Input value={webhookUrl} readOnly className="bg-muted/50" />
                      <p className="text-xs text-muted-foreground mt-1">Add this URL to your payment gateway webhook settings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Currency Settings */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Currency Settings</CardTitle>
                  <CardDescription>Set the default currency for all financial transactions. This affects Finance, Tithes & Offerings pages.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Default Currency</Label>
                      <Select value={currency.code} onValueChange={handleCurrencyChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((c) => (
                            <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">Applied across all finance pages</p>
                    </div>
                    <div className="flex items-end">
                      <div className="rounded-xl border border-border bg-muted/30 p-4 w-full">
                        <p className="text-xs text-muted-foreground mb-1">Preview</p>
                        <p className="text-2xl font-bold text-foreground">{currency.symbol}1,250,000</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Online Giving Toggles */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Online Giving Options</CardTitle>
                  <CardDescription>Enable or disable giving features for your congregation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">Enable Online Giving</p>
                      <p className="text-xs text-muted-foreground">Allow members to give online via the public website</p>
                    </div>
                    <Switch checked={onlineGiving} onCheckedChange={setOnlineGiving} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">Recurring Giving</p>
                      <p className="text-xs text-muted-foreground">Allow members to set up automatic recurring donations</p>
                    </div>
                    <Switch checked={recurringGiving} onCheckedChange={setRecurringGiving} />
                  </div>
                  <Button onClick={handleSavePayment}><Save className="h-4 w-4 mr-1" />Save Payment Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
