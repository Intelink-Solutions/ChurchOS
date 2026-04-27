import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Plus, Search, Users, UserCheck, Activity, Edit, Trash2, Eye } from "lucide-react";
import { useDepartments } from "@/hooks/useDepartments";
import { DepartmentForm } from "@/components/departments/DepartmentForm";
import type { DepartmentResponse, CreateDepartmentRequest, UpdateDepartmentRequest, DepartmentCategory, DepartmentStatus } from "@/types/department";

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const {
    departments,
    loading,
    error,
    refetch,
    createDepartment,
    updateDepartment,
    deleteDepartment
  } = useDepartments({
    page: currentPage,
    size: pageSize,
    search: search || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    autoRefresh: true
  });

  
  const handleCreateDepartment = async (data: CreateDepartmentRequest) => {
    try {
      await createDepartment(data);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create department:", error);
    }
  };

  const handleUpdateDepartment = async (data: UpdateDepartmentRequest) => {
    if (!editingDepartment) return;
    
    try {
      await updateDepartment(editingDepartment.id, data);
      setEditingDepartment(null);
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteDepartment(id);
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  };

  const getStatusBadge = (status: DepartmentStatus) => {
    const variants = {
      ACTIVE: "default",
      INACTIVE: "secondary",
      SUSPENDED: "destructive"
    } as const;

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getCategoryBadge = (category: DepartmentCategory) => {
    const colors = {
      MINISTRY: "bg-purple-600",
      SERVICE: "bg-blue-600",
      ADMINISTRATION: "bg-green-600",
      OUTREACH: "bg-orange-600",
      WORSHIP: "bg-pink-600",
      DISCIPLESHIP: "bg-indigo-600",
      SUPPORT: "bg-gray-600",
      LEADERSHIP: "bg-red-600",
      PRAYER_WARRIOR: "bg-yellow-600"
    };

    return (
      <Badge className={colors[category] || "bg-gray-600"}>
        {category.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredDepartments = departments?.items || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Departments</h1>
            <p className="text-muted-foreground">Manage church departments, assign leaders, and track activities.</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />Add Department
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl stat-gradient-blue flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Departments</p>
                <p className="text-2xl font-bold text-foreground">{departments?.totalItems || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl stat-gradient-green flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Departments</p>
                <p className="text-2xl font-bold text-foreground">
                  {filteredDepartments.filter(d => d.status === "ACTIVE").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl stat-gradient-purple flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-foreground">
                  {filteredDepartments.reduce((sum, d) => sum + d.statistics.totalMembers, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl stat-gradient-gold flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department Leaders</p>
                <p className="text-2xl font-bold text-foreground">
                  {filteredDepartments.filter(d => d.leaderId).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              Error loading departments: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search departments..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(0); // Reset to first page when searching
                  }}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="MINISTRY">Ministry</SelectItem>
                  <SelectItem value="SERVICE">Service</SelectItem>
                  <SelectItem value="ADMINISTRATION">Administration</SelectItem>
                  <SelectItem value="OUTREACH">Outreach</SelectItem>
                  <SelectItem value="WORSHIP">Worship</SelectItem>
                  <SelectItem value="DISCIPLESHIP">Discipleship</SelectItem>
                  <SelectItem value="SUPPORT">Support</SelectItem>
                  <SelectItem value="LEADERSHIP">Leadership</SelectItem>
                  <SelectItem value="PRAYER_WARRIOR">Prayer Warrior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Departments Table */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>All Departments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading departments...</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Leader</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.map((department) => (
                      <TableRow key={department.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{department.name}</p>
                            <p className="text-xs text-muted-foreground">{department.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getCategoryBadge(department.category)}</TableCell>
                        <TableCell className="text-foreground">{department.leaderName || "Not assigned"}</TableCell>
                        <TableCell className="text-foreground">{department.statistics.totalMembers}</TableCell>
                        <TableCell>{getStatusBadge(department.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingDepartment(department)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteDepartment(department.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {departments && departments.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage + 1} of {departments.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(departments.totalPages - 1, prev + 1))}
                      disabled={currentPage >= departments.totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Department Dialog */}
        <Dialog open={showCreateForm || !!editingDepartment} onOpenChange={(open) => {
          if (!open) {
            setShowCreateForm(false);
            setEditingDepartment(null);
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? "Edit Department" : "Create New Department"}
              </DialogTitle>
            </DialogHeader>
            <DepartmentForm
              department={editingDepartment || undefined}
              onSubmit={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
              onCancel={() => {
                setShowCreateForm(false);
                setEditingDepartment(null);
              }}
              loading={loading}
              error={error?.message}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
