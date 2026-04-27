import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  UserPlus, 
  Eye, 
  Edit, 
  Trash2,
  Shield,
  Mail,
  Lock,
  Unlock,
  CheckCircle,
  XCircle
} from "lucide-react";
import type { SystemRole, UserStatus } from "@/types/userManagement";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleCode: SystemRole;
  church: string;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt: string;
  permissions: string[];
  twoFactorEnabled: boolean;
}

interface AdminManagementProps {
  admins: AdminUser[];
  onAddAdmin: (adminData: CreateAdminData) => void;
  onUpdateAdmin: (id: string, updates: Partial<AdminUser>) => void;
  onDeleteAdmin: (id: string) => void;
  onSuspendAdmin: (id: string) => void;
  onActivateAdmin: (id: string) => void;
}

interface CreateAdminData {
  name: string;
  email: string;
  roleCode: SystemRole;
  church: string;
  permissions: string[];
}

export function AdminManagement({ 
  admins, 
  onAddAdmin, 
  onUpdateAdmin, 
  onDeleteAdmin, 
  onSuspendAdmin, 
  onActivateAdmin 
}: AdminManagementProps) {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<SystemRole | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "ALL">("ALL");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  const [formData, setFormData] = useState<CreateAdminData>({
    name: "",
    email: "",
    roleCode: "ADMIN",
    church: "",
    permissions: []
  });

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(search.toLowerCase()) ||
                         admin.email.toLowerCase().includes(search.toLowerCase()) ||
                         admin.church.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === "ALL" || admin.roleCode === selectedRole;
    const matchesStatus = selectedStatus === "ALL" || admin.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateAdmin = () => {
    onAddAdmin(formData);
    setFormData({
      name: "",
      email: "",
      roleCode: "ADMIN",
      church: "",
      permissions: []
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      roleCode: admin.roleCode,
      church: admin.church,
      permissions: admin.permissions
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAdmin = () => {
    if (selectedAdmin) {
      onUpdateAdmin(selectedAdmin.id, {
        ...selectedAdmin,
        ...formData
      });
      setIsEditDialogOpen(false);
      setSelectedAdmin(null);
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const variants = {
      ACTIVE: "default",
      INACTIVE: "secondary",
      SUSPENDED: "destructive",
      LOCKED: "destructive",
      DISABLED: "secondary"
    } as const;

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getRoleBadge = (roleCode: SystemRole) => {
    const colors = {
      SUPER_ADMIN: "bg-purple-600",
      ADMIN: "bg-blue-600",
      PASTOR: "bg-green-600",
      FINANCE_OFFICER: "bg-yellow-600",
      DEPARTMENT_LEAD: "bg-orange-600",
      MEMBER: "bg-gray-600"
    };

    return (
      <Badge className={colors[roleCode] || "bg-gray-600"}>
        {roleCode.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Admins</p>
                <p className="text-2xl font-bold">{admins.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {admins.filter(a => a.status === "ACTIVE").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">2FA Enabled</p>
                <p className="text-2xl font-bold">
                  {admins.filter(a => a.twoFactorEnabled).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold">
                  {admins.filter(a => a.status === "SUSPENDED").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Administrator Accounts</CardTitle>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Input 
                placeholder="Search admins..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as SystemRole | "ALL")}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="PASTOR">Pastor</SelectItem>
                <SelectItem value="FINANCE_OFFICER">Finance Officer</SelectItem>
                <SelectItem value="DEPARTMENT_LEAD">Department Lead</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as UserStatus | "ALL")}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="LOCKED">Locked</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button><UserPlus className="mr-2 h-4 w-4" />Add Admin</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Add New Administrator</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input 
                      placeholder="Enter admin name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input 
                      type="email" 
                      placeholder="admin@church.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Church</Label>
                    <Input 
                      placeholder="Church name" 
                      value={formData.church}
                      onChange={(e) => setFormData({...formData, church: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select value={formData.roleCode} onValueChange={(value) => setFormData({...formData, roleCode: value as SystemRole})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="PASTOR">Pastor</SelectItem>
                        <SelectItem value="FINANCE_OFFICER">Finance Officer</SelectItem>
                        <SelectItem value="DEPARTMENT_LEAD">Department Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={handleCreateAdmin}>Create Admin Account</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Church</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map(admin => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {admin.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{admin.church}</TableCell>
                  <TableCell>{getRoleBadge(admin.roleCode)}</TableCell>
                  <TableCell>{getStatusBadge(admin.status)}</TableCell>
                  <TableCell>
                    {admin.twoFactorEnabled ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditAdmin(admin)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {admin.status === "ACTIVE" ? (
                        <Button size="sm" variant="destructive" onClick={() => onSuspendAdmin(admin.id)}>
                          <Lock className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="default" onClick={() => onActivateAdmin(admin.id)}>
                          <Unlock className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => onDeleteAdmin(admin.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Administrator</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Full Name</Label>
              <Input 
                placeholder="Enter admin name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input 
                type="email" 
                placeholder="admin@church.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <Label>Church</Label>
              <Input 
                placeholder="Church name" 
                value={formData.church}
                onChange={(e) => setFormData({...formData, church: e.target.value})}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={formData.roleCode} onValueChange={(value) => setFormData({...formData, roleCode: value as SystemRole})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="PASTOR">Pastor</SelectItem>
                  <SelectItem value="FINANCE_OFFICER">Finance Officer</SelectItem>
                  <SelectItem value="DEPARTMENT_LEAD">Department Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleUpdateAdmin}>Update Admin</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
