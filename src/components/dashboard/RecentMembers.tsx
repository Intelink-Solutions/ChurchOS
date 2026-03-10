const members = [
  { name: "Grace Adeyemi", dept: "Choir", joined: "2 days ago" },
  { name: "Daniel Okafor", dept: "Media Team", joined: "3 days ago" },
  { name: "Sarah Johnson", dept: "Youth Ministry", joined: "5 days ago" },
  { name: "Michael Eze", dept: "Ushers", joined: "1 week ago" },
];

export function RecentMembers() {
  return (
    <div className="rounded-xl bg-card p-5 card-shadow">
      <h3 className="font-display text-base font-semibold text-foreground mb-4">Recent Members</h3>
      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.name} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {m.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.dept}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{m.joined}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
