import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Choir", value: 320 },
  { name: "Ushers", value: 180 },
  { name: "Media", value: 150 },
  { name: "Youth", value: 420 },
  { name: "Children", value: 280 },
  { name: "Evangelism", value: 210 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(220 60% 50%)",
];

export function DepartmentPieChart() {
  return (
    <div className="rounded-xl bg-card p-5 card-shadow">
      <h3 className="font-display text-base font-semibold text-foreground mb-4">Members by Department</h3>
      <div className="h-40 sm:h-48 lg:h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" stroke="none">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
