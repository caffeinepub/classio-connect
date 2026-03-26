import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

export function StudentLoginPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [schoolName, setSchoolName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    schoolName: "",
    studentName: "",
    mobileNumber: "",
  });

  const validate = () => {
    const errors = { schoolName: "", studentName: "", mobileNumber: "" };
    let valid = true;
    if (!schoolName.trim()) {
      errors.schoolName = "School name is required";
      valid = false;
    }
    if (!studentName.trim()) {
      errors.studentName = "Student name is required";
      valid = false;
    }
    if (!mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required";
      valid = false;
    }
    setFieldErrors(errors);
    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!validate()) return;
    if (!actor) {
      setLoginError("Connecting to network, please wait...");
      return;
    }
    setIsLoading(true);
    try {
      const result = await (actor as any).studentLogin(
        schoolName.trim(),
        studentName.trim(),
        mobileNumber.trim(),
      );
      if (result) {
        localStorage.setItem("classio_role", "student");
        localStorage.setItem("classio_student", JSON.stringify(result));
        toast.success(`Welcome back, ${result.studentName}!`);
        navigate({ to: "/student" });
      } else {
        setLoginError(
          "Student not found. Check your details or contact your teacher.",
        );
      }
    } catch {
      setLoginError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            "linear-gradient(145deg, oklch(0.14 0.06 235) 0%, oklch(0.1 0.04 255) 50%, oklch(0.08 0.02 260) 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[-5%] left-[-10%] w-72 h-72 rounded-full"
            style={{
              background: "oklch(0.75 0.18 210 / 0.12)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute bottom-[10%] right-[-10%] w-80 h-80 rounded-full"
            style={{
              background: "oklch(0.65 0.2 230 / 0.1)",
              filter: "blur(100px)",
            }}
          />
          {/* Grid dots */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full opacity-[0.04]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="dot-grid"
                x="0"
                y="0"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="oklch(0.75 0.18 210)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <img
            src="/assets/uploads/classio_logo_reel_compressed-019d290d-aec1-724b-a11c-a9a7f8c9394d-1.jpeg"
            alt="Classio Connect"
            className="h-12 w-auto rounded-lg object-contain"
          />
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles
              className="w-5 h-5 text-cyan"
              style={{ color: "oklch(0.75 0.18 210)" }}
            />
            <span
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "oklch(0.75 0.18 210)" }}
            >
              Student Portal
            </span>
          </div>
          <h2 className="text-4xl font-display font-bold text-white leading-tight mb-5">
            Welcome Back,
            <br />
            <span style={{ color: "oklch(0.8 0.18 210)" }}>Learner</span>
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: "oklch(0.7 0.04 250)" }}
          >
            Pick up right where you left off. Your progress, your pace —
            adaptive learning designed for you.
          </p>

          {/* Stats bubbles */}
          <div className="mt-8 flex gap-4">
            {[
              { label: "Learners", value: "10K+" },
              { label: "Modules", value: "50+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl px-5 py-3"
                style={{
                  background: "oklch(0.75 0.18 210 / 0.1)",
                  border: "1px solid oklch(0.75 0.18 210 / 0.2)",
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: "oklch(0.75 0.18 210)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "oklch(0.65 0.04 250)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-xs" style={{ color: "oklch(0.5 0.03 250)" }}>
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
          {/* Back link */}
          <Link
            to="/"
            data-ocid="student_login.link"
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
              Student Login
            </h1>
            <p className="text-muted-foreground mb-8">
              Enter your school details to continue learning
            </p>

            {/* Error alert */}
            {loginError && (
              <motion.div
                data-ocid="student_login.error_state"
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
                <Label htmlFor="school-name">
                  School Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="school-name"
                  data-ocid="student_school.input"
                  placeholder="e.g. Delhi Public School"
                  value={schoolName}
                  onChange={(e) => {
                    setSchoolName(e.target.value);
                    setFieldErrors((p) => ({ ...p, schoolName: "" }));
                  }}
                  className="bg-secondary border-border h-11"
                />
                {fieldErrors.schoolName && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.2 25)" }}
                  >
                    {fieldErrors.schoolName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="student-name">
                  Student Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="student-name"
                  data-ocid="student_name.input"
                  placeholder="Your full name"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setFieldErrors((p) => ({ ...p, studentName: "" }));
                  }}
                  className="bg-secondary border-border h-11"
                />
                {fieldErrors.studentName && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.2 25)" }}
                  >
                    {fieldErrors.studentName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mobile-number">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile-number"
                  data-ocid="student_mobile.input"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    setFieldErrors((p) => ({ ...p, mobileNumber: "" }));
                  }}
                  className="bg-secondary border-border h-11"
                />
                {fieldErrors.mobileNumber && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.2 25)" }}
                  >
                    {fieldErrors.mobileNumber}
                  </p>
                )}
              </div>

              <Button
                data-ocid="student.submit_button"
                type="submit"
                disabled={isLoading || isFetching}
                className="w-full gradient-cyan text-primary-foreground font-semibold h-11 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isFetching
                  ? "Connecting..."
                  : isLoading
                    ? "Signing in..."
                    : "Start Learning"}
              </Button>
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
