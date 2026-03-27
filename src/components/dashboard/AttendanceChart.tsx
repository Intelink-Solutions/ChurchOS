import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Sun", count: 850 },
  { day: "Mon", count: 120 },
  { day: "Tue", count: 200 },
  { day: "Wed", count: 450 },
  { day: "Thu", count: 180 },
  { day: "Fri", count: 320 },
  { day: "Sat", count: 280 },
];

export function AttendanceChart() {
  return (
    <div className="rounded-xl bg-card p-5 card-shadow">
      <h3 className="font-display text-base font-semibold text-foreground mb-4">Weekly Attendance</h3>
      <div className="h-48 sm:h-64 lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                fontSize: 13,
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
