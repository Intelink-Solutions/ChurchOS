import { Link, useLocation } from "react-router-dom";
import { Church, Calendar, BookOpen, HandHeart, Home, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navLinks = [
  { to: "/website", label: "Home", icon: Home },
  { to: "/website/events", label: "Events", icon: Calendar },
  { to: "/website/sermons", label: "Sermons", icon: BookOpen },
  { to: "/website/prayer-requests", label: "Prayer Requests", icon: HandHeart },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
                Grace Community Church
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

            {/* Admin Link */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" size="sm">Admin Dashboard</Button>
              </Link>
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
              <Link to="/" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Admin Dashboard</Button>
              </Link>
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
                <span className="font-bold text-foreground">Grace Community Church</span>
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
            © 2024 Grace Community Church. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
