import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AdminManagement } from "@/components/superadmin/AdminManagement";
import type { SystemRole, UserStatus } from "@/types/userManagement";
import { 
  Users, 
  Shield, 
  Building2, 
  Activity, 
  Settings, 
  CheckCircle,
  Clock,
  Globe,
  Database,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  DollarSign,
  X,
  Plus
} from "lucide-react";

// Mock data for demonstration
const systemStats = [
  { title: "Total Churches", value: "24", change: "+3", icon: Building2, gradient: "stat-gradient-blue" },
  { title: "Total Users", value: "8,547", change: "+12%", icon: Users, gradient: "stat-gradient-green" },
  { title: "Active Admins", value: "142", change: "+5", icon: Shield, gradient: "stat-gradient-purple" },
  { title: "System Health", value: "98%", change: "+2%", icon: Activity, gradient: "stat-gradient-gold" },
  { title: "Pending Approvals", value: "7", change: "-2", icon: Clock, gradient: "stat-gradient-red" },
  { title: "Storage Used", value: "67%", change: "+5%", icon: Database, gradient: "stat-gradient-indigo" },
];

const mockAdmins = [
  { 
    id: "1", 
    name: "John Smith", 
    email: "john@church1.com", 
    roleCode: "ADMIN" as SystemRole, 
    church: "First Baptist Church", 
    status: "ACTIVE" as UserStatus, 
    lastLoginAt: "2024-01-15T10:30:00Z",
    createdAt: "2023-06-15T00:00:00Z",
    permissions: ["users:read", "members:write", "finance:read"],
    twoFactorEnabled: true
  },
  { 
    id: "2", 
    name: "Sarah Johnson", 
    email: "sarah@church2.com", 
    roleCode: "PASTOR" as SystemRole, 
    church: "Grace Community", 
    status: "ACTIVE" as UserStatus, 
    lastLoginAt: "2024-01-14T15:45:00Z",
    createdAt: "2023-08-20T00:00:00Z",
    permissions: ["members:read", "members:write", "events:write"],
    twoFactorEnabled: false
  },
  { 
    id: "3", 
    name: "Michael Brown", 
    email: "michael@church3.com", 
    roleCode: "FINANCE_OFFICER" as SystemRole, 
    church: "Victory Chapel", 
    status: "SUSPENDED" as UserStatus, 
    lastLoginAt: "2024-01-10T09:15:00Z",
    createdAt: "2023-09-10T00:00:00Z",
    permissions: ["finance:read", "finance:write"],
    twoFactorEnabled: true
  },
];

const mockChurches = [
  { 
    id: "1", 
    name: "First Baptist Church", 
    location: "New York, NY", 
    pastor: "John Smith", 
    members: 1250,
    status: "ACTIVE", 
    createdAt: "2023-06-15T00:00:00Z"
  },
  { 
    id: "2", 
    name: "Grace Community", 
    location: "Los Angeles, CA", 
    pastor: "Sarah Johnson", 
    members: 890,
    status: "ACTIVE", 
    createdAt: "2023-08-20T00:00:00Z"
  },
  { 
    id: "3", 
    name: "Victory Chapel", 
    location: "Chicago, IL", 
    pastor: "Michael Brown", 
    members: 567,
    status: "PENDING_APPROVAL", 
    createdAt: "2024-01-10T00:00:00Z"
  },
];

const mockAuditLogs = [
  {
    id: "1",
    action: "CREATE_ADMIN",
    user: "Super Admin",
    resource: "Admin User",
    details: "Created new admin for First Baptist Church",
    timestamp: "2024-01-15T14:30:00Z",
    ipAddress: "192.168.1.100"
  },
  {
    id: "2",
    action: "SUSPEND_USER",
    user: "Super Admin",
    resource: "User Account",
    details: "Suspended user michael@church3.com",
    timestamp: "2024-01-15T12:15:00Z",
    ipAddress: "192.168.1.100"
  },
  {
    id: "3",
    action: "APPROVE_CHURCH",
    user: "Super Admin",
    resource: "Church Registration",
    details: "Approved Victory Chapel registration",
    timestamp: "2024-01-14T16:45:00Z",
    ipAddress: "192.168.1.100"
  },
];

export default function SuperAdminDashboard() {
  const [searchChurch, setSearchChurch] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  const filteredChurches = mockChurches.filter(church =>
    church.name.toLowerCase().includes(searchChurch.toLowerCase()) ||
    church.location.toLowerCase().includes(searchChurch.toLowerCase()) ||
    church.pastor.toLowerCase().includes(searchChurch.toLowerCase())
  );

  // System-level handlers
  const handleCreateChurch = (churchData: any) => {
    console.log("Creating church account:", churchData);
    // API call to create new church tenant
  };

  const handleActivateChurch = (churchId: string) => {
    console.log("Activating church:", churchId);
    // API call to activate church
  };

  const handleDeactivateChurch = (churchId: string) => {
    console.log("Deactivating church:", churchId);
    // API call to deactivate church
  };

  const handleCreateUser = (userData: any) => {
    console.log("Creating system user:", userData);
    // API call to create system user
  };

  const handleUpdatePermissions = (userId: string, permissions: string[]) => {
    console.log("Updating user permissions:", userId, permissions);
    // API call to update user permissions
  };

  const handleSuspendUser = (userId: string) => {
    console.log("Suspending user:", userId);
    // API call to suspend user
  };

  const handleSystemConfig = (config: any) => {
    console.log("Updating system config:", config);
    // API call to update system configuration
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform-wide system administration and oversight</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleCreateChurch({})}>
              <Building2 className="mr-2 h-4 w-4" />Add Church
            </Button>
            <Button onClick={() => handleCreateUser({})}>
              <UserPlus className="mr-2 h-4 w-4" />Add User
            </Button>
            <Button variant="outline" onClick={() => handleSystemConfig({})}>
              <Settings className="mr-2 h-4 w-4" />System Config
            </Button>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="card-shadow">
            <CardContent className="p-4 text-center">
              <Building2 className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-foreground">24</div>
              <div className="text-sm text-muted-foreground">Total Churches</div>
              <div className="text-xs text-green-600">+3 this month</div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-foreground">8,547</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-xs text-green-600">+12% growth</div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-foreground">$2.4M</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="text-xs text-green-600">+18% this month</div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">System Health</div>
              <div className="text-xs text-green-600">Stable</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="churches" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="churches">🏗️ Churches</TabsTrigger>
            <TabsTrigger value="users">👥 Users</TabsTrigger>
            <TabsTrigger value="financial">💰 Financial</TabsTrigger>
            <TabsTrigger value="config">⚙️ Configuration</TabsTrigger>
            <TabsTrigger value="reports">📊 Reports</TabsTrigger>
            <TabsTrigger value="security">🔐 Security</TabsTrigger>
            <TabsTrigger value="audit">📋 Audit</TabsTrigger>
          </TabsList>

          {/* Church Account Management */}
          <TabsContent value="churches" className="space-y-4">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Church Account Management
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Search churches..." 
                    value={searchChurch}
                    onChange={(e) => setSearchChurch(e.target.value)}
                    className="max-w-sm"
                  />
                  <Button onClick={() => handleCreateChurch({})}>
                    <Plus className="h-4 w-4 mr-2" />Create Church
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Church Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Pastor</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChurches.map((church) => (
                      <TableRow key={church.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{church.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>{church.location}</TableCell>
                        <TableCell>{church.pastor}</TableCell>
                        <TableCell>{church.members.toLocaleString()}</TableCell>
                        <TableCell>$45,678</TableCell>
                        <TableCell>
                          <Badge 
                            variant={church.status === "ACTIVE" ? "default" : "secondary"}
                            className={church.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {church.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {church.status === "PENDING_APPROVAL" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleActivateChurch(church.id)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Activate
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleDeactivateChurch(church.id)}>
                              <X className="h-4 w-4 mr-1" />
                              Deactivate
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User & Role Management */}
          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => handleCreateUser({})} className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />Create System User
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />Manage Permissions
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />Bulk Operations
                  </Button>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">8,547</div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">7,234</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-xl font-bold text-orange-600">142</div>
                      <div className="text-sm text-muted-foreground">Admin Users</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">1,171</div>
                      <div className="text-sm text-muted-foreground">New (30 days)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Oversight */}
          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Revenue</span>
                      <span className="font-bold text-green-600">$2.4M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="font-bold text-blue-600">$458K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Growth</span>
                      <span className="font-bold text-green-600">+18%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Payment Gateway</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Paystack</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Transactions</span>
                      <span className="font-bold">12,456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Success Rate</span>
                      <span className="font-bold text-green-600">98.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Top Churches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">First Baptist</span>
                      <span className="font-bold">$125K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Grace Community</span>
                      <span className="font-bold">$98K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Victory Chapel</span>
                      <span className="font-bold">$67K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Configuration */}
          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Feature Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Events Module</Label>
                      <Select defaultValue="enabled">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Attendance Tracking</Label>
                      <Select defaultValue="enabled">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Donation System</Label>
                      <Select defaultValue="enabled">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Default Settings</Label>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Email Service</Label>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>SMS Gateway</Label>
                      <Button variant="outline" size="sm">Setup</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Payment Gateways</Label>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>API Keys</Label>
                      <Button variant="outline" size="sm">Generate</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports & Analytics */}
          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">User Growth</span>
                      <span className="font-bold text-green-600">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Church Growth</span>
                      <span className="font-bold text-green-600">+15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue Growth</span>
                      <span className="font-bold text-green-600">+18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Sessions</span>
                      <span className="font-bold">2,456</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Revenue</span>
                      <span className="font-bold text-green-600">$2.4M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Donations</span>
                      <span className="font-bold">$1.8M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Tithes</span>
                      <span className="font-bold">$600K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Platform Fees</span>
                      <span className="font-bold text-blue-600">$120K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security & Compliance */}
          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Failed Logins (24h)</span>
                      <Badge className="bg-red-600">12</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Blocked IPs</span>
                      <Badge className="bg-orange-600">3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Security Status</span>
                      <Badge className="bg-green-600">Secure</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Password Policy</span>
                      <Badge className="bg-green-600">Enforced</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">2FA Required</span>
                      <Badge className="bg-blue-600">Admins Only</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Data Backup</span>
                      <Badge className="bg-green-600">Current</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Encryption</span>
                      <Badge className="bg-green-600">AES-256</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">GDPR Compliant</span>
                      <Badge className="bg-green-600">Yes</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Audit</span>
                      <span className="text-sm">2 weeks ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit Logs */}
          <TabsContent value="audit" className="space-y-4">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>System Audit Logs</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAuditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{log.ipAddress}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-600">Success</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
