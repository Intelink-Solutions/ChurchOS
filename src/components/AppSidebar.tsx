import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserPlus, Building2, Network, ClipboardCheck,
  Calendar, DollarSign, Heart, BookOpen, MessageSquare, BarChart3,
  TrendingUp, Settings, ChevronLeft, ChevronRight, Church, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Members", icon: Users, path: "/members" },
  { title: "Visitors", icon: UserPlus, path: "/visitors" },
  { title: "Departments", icon: Building2, path: "/departments" },
  { title: "Cell Groups", icon: Network, path: "/cell-groups" },
  { title: "Attendance", icon: ClipboardCheck, path: "/attendance" },
  { title: "Events", icon: Calendar, path: "/events" },
  { title: "Finance", icon: DollarSign, path: "/finance" },
  { title: "Tithes & Offerings", icon: Heart, path: "/tithes" },
  { title: "Sermons", icon: BookOpen, path: "/sermons" },
  { title: "Prayer Requests", icon: MessageSquare, path: "/prayer-requests" },
  { title: "Communications", icon: MessageSquare, path: "/communications" },
  { title: "Reports", icon: BarChart3, path: "/reports" },
  { title: "Analytics", icon: TrendingUp, path: "/analytics" },
  { title: "Settings", icon: Settings, path: "/settings" },
  { title: "Public Website", icon: Globe, path: "/website" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
          <Church className="h-5 w-5 text-accent-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display text-lg font-bold text-sidebar-primary truncate">
            ChurchOS
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-primary transition-colors"
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </aside>
  );
}
