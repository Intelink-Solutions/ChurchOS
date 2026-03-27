import { Link, useLocation } from "react-router-dom";
import { Church, Calendar, BookOpen, HandHeart, Home, Menu, X, User, ChevronDown, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";

const navLinks = [
  { to: "/website", label: "Home", icon: Home },
  { to: "/website/events", label: "Events", icon: Calendar },
  { to: "/website/sermons", label: "Sermons", icon: BookOpen },
  { to: "/website/prayer-requests", label: "Prayer Requests", icon: HandHeart },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/website" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg stat-gradient-blue flex items-center justify-center">
                <Church className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ChurchOS
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Admin / Profile Link */}
            <div className="hidden md:flex items-center gap-3 relative">
              <button
                onClick={toggleDarkMode}
                className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              {!user ? (
                <Link to="/login">
                  <Button variant="outline" size="sm">Member Login</Button>
                </Link>
              ) : (
                <>
                  <button
                    className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted transition-colors"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-12 z-50 w-40 rounded-xl border border-border bg-card p-1.5 card-shadow-hover">
                      <Link to="/profile" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border">
              {!user ? (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Member Login</Button>
                </Link>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-muted">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-lg border border-destructive px-3 py-2 text-sm text-destructive hover:bg-destructive/10">Logout</button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg stat-gradient-blue flex items-center justify-center">
                  <Church className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-foreground">ChurchOS</span>
              </div>
              <p className="text-sm text-muted-foreground">Building faith, transforming lives, and impacting communities for Christ.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3">Quick Links</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>123 Faith Avenue, Lagos</p>
                <p>info@gracecommunity.church</p>
                <p>+234 800 123 4567</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © 2024 ChurchOS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
