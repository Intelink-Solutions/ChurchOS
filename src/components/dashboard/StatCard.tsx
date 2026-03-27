import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  gradient: "blue" | "gold" | "green" | "purple";
}

const gradientMap = {
  blue: "stat-gradient-blue",
  gold: "stat-gradient-gold",
  green: "stat-gradient-green",
  purple: "stat-gradient-purple",
};

export function StatCard({ title, value, change, icon: Icon, gradient }: StatCardProps) {
  return (
    <div className="rounded-xl bg-card p-5 card-shadow hover:card-shadow-hover transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground", gradientMap[gradient])}>
          <Icon className="h-5 w-5" />
        </div>
        {change && (
          <span className="flex items-center gap-1 text-xs font-medium text-success">
            <TrendingUp className="h-3 w-3" />
            {change}
          </span>
        )}
      </div>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{title}</p>
    </div>
  );
}
