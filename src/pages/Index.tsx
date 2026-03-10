import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { OfferingChart } from "@/components/dashboard/OfferingChart";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { DepartmentPieChart } from "@/components/dashboard/DepartmentPieChart";
import { RecentMembers } from "@/components/dashboard/RecentMembers";
import { UpcomingBirthdays } from "@/components/dashboard/UpcomingBirthdays";
import { Users, UserCheck, DollarSign, Calendar, ClipboardCheck, Building2 } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's your church overview.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <StatCard title="Total Members" value="2,847" change="+12%" icon={Users} gradient="blue" />
          <StatCard title="Active Members" value="2,156" change="+5%" icon={UserCheck} gradient="green" />
          <StatCard title="Visitors This Week" value="34" change="+18%" icon={Users} gradient="purple" />
          <StatCard title="This Month Offering" value="$45,230" change="+8%" icon={DollarSign} gradient="gold" />
          <StatCard title="Upcoming Events" value="7" change="" icon={Calendar} gradient="blue" />
          <StatCard title="Departments" value="14" change="" icon={Building2} gradient="green" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <OfferingChart />
          <AttendanceChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DepartmentPieChart />
          <RecentMembers />
          <UpcomingBirthdays />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
