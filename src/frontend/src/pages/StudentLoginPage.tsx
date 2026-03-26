import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

export function StudentLoginPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [waitingForActor, setWaitingForActor] = useState(false);

  const [schoolName, setSchoolName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    schoolName: "",
    studentName: "",
    mobileNumber: "",
  });

  // Store pending login data for retry when actor becomes available
  const pendingLogin = useRef<{
    school: string;
    student: string;
    mobile: string;
  } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-retry login once actor becomes available
  useEffect(() => {
    if (actor && pendingLogin.current && waitingForActor) {
      setWaitingForActor(false);
      const { school, student, mobile } = pendingLogin.current;
      pendingLogin.current = null;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      performLogin(school, student, mobile);
    }
  }, [actor, waitingForActor]);

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

  const performLogin = async (
    school: string,
    student: string,
    mobile: string,
  ) => {
    setIsLoading(true);
    setLoginError("");
    try {
      const result = await actor!.studentLogin(school, student, mobile);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!validate()) return;

    if (!actor) {
      // Store form data and wait for actor
      pendingLogin.current = {
        school: schoolName.trim(),
        student: studentName.trim(),
        mobile: mobileNumber.trim(),
      };
      setWaitingForActor(true);
      setLoginError("Connecting to server... Please wait.");
      // 10-second timeout
      timeoutRef.current = setTimeout(() => {
        if (pendingLogin.current) {
          pendingLogin.current = null;
          setWaitingForActor(false);
          setLoginError("Unable to connect. Please refresh and try again.");
        }
      }, 10000);
      return;
    }

    await performLogin(
      schoolName.trim(),
      studentName.trim(),
      mobileNumber.trim(),
    );
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
            src="/assets/classio_logo_reel_compressed-019d290d-aec1-724b-a11c-a9a7f8c9394d.jpeg"
            alt="Classio Connect"
            className="h-12 w-auto rounded-lg object-contain"
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-white opacity-90" />
            <span className="text-sm font-semibold tracking-widest uppercase text-white opacity-90">
              Student Portal
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Welcome Back,
            <br />
            <span className="text-cyan-200">Learner</span>
          </h2>
          <p className="text-base leading-relaxed text-white/80">
            Pick up right where you left off. Your progress, your pace —
            adaptive learning designed for you.
          </p>
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
              { label: "Learners", value: "10K+" },
              { label: "Modules", value: "50+" },
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

      {/* RIGHT TILE */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-white"
      >
        <div className="w-full max-w-md">
          <Link
            to="/"
            data-ocid="student_login.link"
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
              Student Login
            </h1>
            <p className="text-gray-600 mb-8">
              Enter your school details to continue learning
            </p>

            {loginError && (
              <motion.div
                data-ocid="student_login.error_state"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-5 flex items-start gap-3 rounded-lg px-4 py-3 text-sm border ${
                  waitingForActor
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {waitingForActor ? (
                  <Loader2 className="h-4 w-4 animate-spin mt-0.5 shrink-0" />
                ) : (
                  <span className="mt-0.5">⚠</span>
                )}
                <span>{loginError}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="school-name" className="text-gray-700">
                  School Name <span className="text-red-500">*</span>
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
                  className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-400"
                />
                {fieldErrors.schoolName && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.schoolName}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="student-name" className="text-gray-700">
                  Student Name <span className="text-red-500">*</span>
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
                  className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-400"
                />
                {fieldErrors.studentName && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.studentName}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mobile-number" className="text-gray-700">
                  Mobile Number <span className="text-red-500">*</span>
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
                  className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-400"
                />
                {fieldErrors.mobileNumber && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.mobileNumber}
                  </p>
                )}
              </div>
              <Button
                data-ocid="student.submit_button"
                type="submit"
                disabled={isLoading || waitingForActor}
                className="w-full font-semibold h-11 mt-2 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
                }}
              >
                {isLoading || waitingForActor ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {waitingForActor
                  ? "Connecting..."
                  : isLoading
                    ? "Signing in..."
                    : "Start Learning"}
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
