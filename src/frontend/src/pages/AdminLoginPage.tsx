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
    if (email === "junae@classio.com" && password === "classio") {
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
      {/* LEFT TILE — Cyan gradient with illustration */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden md:flex md:w-[42%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #0891b2 0%, #0e7490 50%, #164e63 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[-5%] left-[-10%] w-72 h-72 rounded-full"
            style={{
              background: "rgba(255,255,255,0.08)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute bottom-[10%] right-[-10%] w-80 h-80 rounded-full"
            style={{
              background: "rgba(255,255,255,0.06)",
              filter: "blur(100px)",
            }}
          />
        </div>

        <div className="relative z-10">
          <img
            src="/assets/uploads/classio_logo_reel_compressed-019d30f8-ddb7-741d-bf46-362f4478c78e-1.jpeg"
            alt="Classio Connect"
            className="h-12 w-auto rounded-lg object-contain"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-white opacity-90" />
            <span className="text-sm font-semibold tracking-widest uppercase text-white opacity-90">
              Admin Portal
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage Your
            <br />
            <span className="text-cyan-200">Platform</span>
          </h2>
          <p className="text-base leading-relaxed text-white/80">
            Full control over teachers, students, and school settings. One
            dashboard, endless possibilities.
          </p>

          {/* Illustration */}
          <div className="mt-6 flex justify-center">
            <img
              src="/assets/generated/login-communication-illustration.dim_600x700.png"
              alt="Communication platform"
              className="w-full object-contain"
              style={{ maxHeight: "280px" }}
            />
          </div>

          <div className="mt-4 flex gap-4">
            {[
              { label: "Teachers", value: "1K+" },
              { label: "Schools", value: "50+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl px-5 py-3"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Classio Connect
          </p>
        </div>
      </motion.div>

      {/* RIGHT TILE — White background */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-white"
      >
        <div className="w-full max-w-md">
          <Link
            to="/"
            data-ocid="admin_login.link"
            className="inline-flex items-center gap-1.5 text-sm mb-8 text-cyan-600 hover:text-cyan-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Admin Login
            </h1>
            <p className="text-gray-600 mb-8">
              Access the administrator control panel
            </p>

            {loginError && (
              <motion.div
                data-ocid="admin_login.error_state"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-start gap-3 rounded-lg px-4 py-3 text-sm bg-red-50 border border-red-200 text-red-700"
              >
                <span className="mt-0.5">⚠</span>
                <span>{loginError}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="admin-email"
                  data-ocid="admin.input"
                  type="email"
                  placeholder="junae@classio.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((p) => ({ ...p, email: "" }));
                  }}
                  className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-400"
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="text-gray-700">
                  Password <span className="text-red-500">*</span>
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
                  className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-400"
                />
                {fieldErrors.password && (
                  <p className="text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>

              <Button
                data-ocid="admin.submit_button"
                type="submit"
                disabled={isLoading}
                className="w-full font-semibold h-11 mt-2 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                }}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Signing in..." : "Sign In as Admin"}
              </Button>
            </form>
          </motion.div>

          <p className="mt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
