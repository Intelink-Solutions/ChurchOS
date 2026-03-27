import { AppSidebar } from "@/components/AppSidebar";
import { TopNavbar } from "@/components/TopNavbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64 transition-all duration-300" id="main-content">
        <TopNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
