import { Gift } from "lucide-react";

const birthdays = [
  { name: "Joy Nwosu", date: "Mar 8" },
  { name: "Emmanuel Balogun", date: "Mar 10" },
  { name: "Esther Williams", date: "Mar 12" },
  { name: "David Okonkwo", date: "Mar 15" },
];

export function UpcomingBirthdays() {
  return (
    <div className="rounded-xl bg-card p-5 card-shadow">
      <h3 className="font-display text-base font-semibold text-foreground mb-4">Upcoming Birthdays</h3>
      <div className="space-y-3">
        {birthdays.map((b) => (
          <div key={b.name} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center">
              <Gift className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{b.name}</p>
            </div>
            <span className="text-xs font-medium text-accent">{b.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
