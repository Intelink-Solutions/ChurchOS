import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div className="max-w-md rounded-xl border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Not logged in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Please <Link to="/login" className="text-primary hover:underline">login</Link> first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-3xl mx-auto rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">{user.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
            <p className="text-sm text-muted-foreground">Role: {user.role}</p>
          </div>
        </div>
        <div className="mt-6 text-sm text-muted-foreground">
          <p>From here, you can access your profile details, recent activity, and navigate to the dashboard.</p>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={logout} variant="outline">Logout</Button>
          <Link to="/" className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
