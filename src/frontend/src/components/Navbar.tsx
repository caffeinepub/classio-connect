import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_LINKS = [
  { label: "Courses", href: "/courses" },
  { label: "AI Tutor", href: "/ai-tutor" },
  { label: "Community", href: "/#community" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/#about" },
];

export function Navbar() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => currentPath === href;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          data-ocid="nav.link"
        >
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-foreground tracking-tight">
              Classio
            </div>
            <div
              className="text-xs font-medium text-primary"
              style={{ marginTop: "-2px" }}
            >
              Connect
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              data-ocid="nav.link"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {identity ? (
            <>
              <Link to="/profile" data-ocid="nav.link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium"
                >
                  My Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clear()}
                className="text-sm font-medium"
                data-ocid="nav.button"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="text-sm font-medium"
                data-ocid="nav.link"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="gradient-primary text-white border-0 text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                data-ocid="nav.primary_button"
              >
                Start Learning FREE
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
          data-ocid="nav.toggle"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-white"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border flex flex-col gap-2">
                {identity ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="sm"
                        data-ocid="nav.link"
                      >
                        My Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clear();
                        setMobileOpen(false);
                      }}
                      data-ocid="nav.button"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    className="gradient-primary text-white border-0 font-semibold"
                    data-ocid="nav.primary_button"
                  >
                    Start Learning FREE
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
