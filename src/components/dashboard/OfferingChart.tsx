import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", amount: 32000 },
  { month: "Feb", amount: 35000 },
  { month: "Mar", amount: 28000 },
  { month: "Apr", amount: 42000 },
  { month: "May", amount: 38000 },
  { month: "Jun", amount: 45000 },
  { month: "Jul", amount: 41000 },
  { month: "Aug", amount: 48000 },
  { month: "Sep", amount: 44000 },
  { month: "Oct", amount: 52000 },
  { month: "Nov", amount: 49000 },
  { month: "Dec", amount: 55000 },
];

export function OfferingChart() {
  return (
    <div className="rounded-xl bg-card p-5 card-shadow">
      <h3 className="font-display text-base font-semibold text-foreground mb-4">Monthly Offering Trend</h3>
      <div className="h-48 sm:h-64 lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                fontSize: 13,
              }}
            />
            <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
