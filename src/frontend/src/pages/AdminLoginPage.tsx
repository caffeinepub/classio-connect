import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const validate = () => {
    const errors = { email: "", password: "" };
    let valid = true;
    if (!email.trim()) {
      errors.email = "Email address is required";
      valid = false;
    }
    if (!password.trim()) {
      errors.password = "Password is required";
      valid = false;
    }
    setFieldErrors(errors);
    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    if (email === "admin@classio.com" && password === "admin123") {
      localStorage.setItem("classio_role", "admin");
      toast.success("Welcome, Admin!");
      navigate({ to: "/admin" });
    } else {
      setLoginError("Invalid email or password. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT TILE */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden md:flex md:w-[42%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, oklch(0.14 0.05 60) 0%, oklch(0.10 0.03 50) 50%, oklch(0.08 0.02 45) 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[-5%] left-[-10%] w-72 h-72 rounded-full"
            style={{
              background: "oklch(0.75 0.18 65 / 0.15)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute bottom-[10%] right-[-10%] w-80 h-80 rounded-full"
            style={{
              background: "oklch(0.65 0.2 40 / 0.12)",
              filter: "blur(100px)",
            }}
          />
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full opacity-[0.04]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="dot-grid-admin"
                x="0"
                y="0"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="oklch(0.75 0.18 65)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid-admin)" />
          </svg>
        </div>

        <div className="relative z-10">
          <img
            src="/assets/uploads/classio_logo_reel_compressed-019d290d-aec1-724b-a11c-a9a7f8c9394d-1.jpeg"
            alt="Classio Connect"
            className="h-12 w-auto rounded-lg object-contain"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Settings
              className="w-5 h-5"
              style={{ color: "oklch(0.78 0.18 65)" }}
            />
            <span
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "oklch(0.78 0.18 65)" }}
            >
              Admin Portal
            </span>
          </div>
          <h2 className="text-4xl font-display font-bold text-white leading-tight mb-5">
            Manage Your
            <br />
            <span style={{ color: "oklch(0.82 0.18 65)" }}>Platform</span>
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: "oklch(0.65 0.04 50)" }}
          >
            Full control over teachers, students, and school settings. One
            dashboard, endless possibilities.
          </p>

          <div className="mt-8 flex gap-4">
            {[
              { label: "Teachers", value: "1K+" },
              { label: "Schools", value: "50+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl px-5 py-3"
                style={{
                  background: "oklch(0.75 0.18 65 / 0.1)",
                  border: "1px solid oklch(0.75 0.18 65 / 0.2)",
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: "oklch(0.78 0.18 65)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.04 50)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs" style={{ color: "oklch(0.5 0.03 50)" }}>
            © {new Date().getFullYear()} Classio Connect
          </p>
        </div>
      </motion.div>

      {/* RIGHT TILE */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center p-8 md:p-12"
        style={{ background: "oklch(0.09 0.015 255)" }}
      >
        <div className="w-full max-w-md">
          <Link
            to="/"
            data-ocid="admin_login.link"
            className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
            style={{ color: "oklch(0.6 0.03 250)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-display font-bold text-foreground mb-1">
              Admin Login
            </h1>
            <p className="text-muted-foreground mb-8">
              Access the administrator control panel
            </p>

            {loginError && (
              <motion.div
                data-ocid="admin_login.error_state"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-start gap-3 rounded-lg px-4 py-3 text-sm"
                style={{
                  background: "oklch(0.6 0.22 25 / 0.12)",
                  border: "1px solid oklch(0.6 0.22 25 / 0.35)",
                  color: "oklch(0.75 0.18 25)",
                }}
              >
                <span className="mt-0.5">⚠</span>
                <span>{loginError}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="admin-email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="admin-email"
                  data-ocid="admin.input"
                  type="email"
                  placeholder="admin@classio.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((p) => ({ ...p, email: "" }));
                  }}
                  className="bg-secondary border-border h-11"
                />
                {fieldErrors.email && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.2 25)" }}
                  >
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="admin-password"
                  data-ocid="admin_password.input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((p) => ({ ...p, password: "" }));
                  }}
                  className="bg-secondary border-border h-11"
                />
                {fieldErrors.password && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.2 25)" }}
                  >
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <Button
                data-ocid="admin.submit_button"
                type="submit"
                disabled={isLoading}
                className="w-full font-semibold h-11 mt-2"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.18 55), oklch(0.62 0.2 35))",
                  color: "white",
                }}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Signing in..." : "Sign In as Admin"}
              </Button>

              <p className="text-center text-xs text-muted-foreground pt-1">
                Demo credentials: admin@classio.com / admin123
              </p>
            </form>
          </motion.div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
