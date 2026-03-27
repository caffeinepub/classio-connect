import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

export function TeacherLoginPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [waitingForActor, setWaitingForActor] = useState(false);

  const [teacherId, setTeacherId] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    teacherId: "",
    teacherEmail: "",
  });

  const pendingLogin = useRef<{ id: string; email: string } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (actor && pendingLogin.current && waitingForActor) {
      setWaitingForActor(false);
      const { id, email } = pendingLogin.current;
      pendingLogin.current = null;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      performLogin(id, email);
    }
  }, [actor, waitingForActor]);

  const validate = () => {
    const errors = { teacherId: "", teacherEmail: "" };
    let valid = true;
    if (!teacherId.trim()) {
      errors.teacherId = "Teacher ID is required";
      valid = false;
    }
    if (!teacherEmail.trim()) {
      errors.teacherEmail = "Email address is required";
      valid = false;
    }
    setFieldErrors(errors);
    return valid;
  };

  const performLogin = async (id: string, email: string) => {
    setIsLoading(true);
    setLoginError("");
    try {
      const result = await (actor as any).getTeacherById(BigInt(id));
      if (result && result.email === email) {
        localStorage.setItem("classio_role", "teacher");
        localStorage.setItem("classio_teacher_id", id);
        localStorage.setItem("classio_teacher_name", result.name);
        toast.success(`Welcome back, ${result.name}!`);
        navigate({ to: "/teacher" });
      } else {
        setLoginError(
          "Invalid Teacher ID or email address. Please check your credentials.",
        );
      }
    } catch {
      setLoginError(
        "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!validate()) return;

    if (!actor) {
      pendingLogin.current = {
        id: teacherId.trim(),
        email: teacherEmail.trim(),
      };
      setWaitingForActor(true);
      setLoginError("Connecting to server... Please wait.");
      timeoutRef.current = setTimeout(() => {
        if (pendingLogin.current) {
          pendingLogin.current = null;
          setWaitingForActor(false);
          setLoginError("Unable to connect. Please refresh and try again.");
        }
      }, 10000);
      return;
    }

    await performLogin(teacherId.trim(), teacherEmail.trim());
  };

  return (
    <div className="min-h-screen flex">
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
            src="/assets/uploads/whatsapp_image_2026-03-26_at_21.57.49-019d2de3-2709-728a-a238-de560718a29b-1.jpeg"
            alt="Classio Connect"
            className="h-12 w-auto rounded-lg object-contain"
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-white opacity-90" />
            <span className="text-sm font-semibold tracking-widest uppercase text-white opacity-90">
              Teacher Portal
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Empower Your
            <br />
            <span className="text-cyan-200">Students</span>
          </h2>
          <p className="text-base leading-relaxed text-white/80">
            Manage classrooms, create student accounts, and track learning
            progress — all in one place.
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
              { label: "Schools", value: "200+" },
              { label: "Students", value: "5K+" },
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

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-white"
      >
        <div className="w-full max-w-md">
          <Link
            to="/"
            data-ocid="teacher_login.link"
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
              Teacher Login
            </h1>
            <p className="text-gray-600 mb-8">
              Enter your credentials from your administrator
            </p>

            {loginError && (
              <motion.div
                data-ocid="teacher_login.error_state"
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
                <Label htmlFor="teacher-id" className="text-gray-700">
                  Teacher ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="teacher-id"
                  data-ocid="teacher_id.input"
                  type="number"
                  placeholder="e.g. 1001"
                  value={teacherId}
                  onChange={(e) => {
                    setTeacherId(e.target.value);
                    setFieldErrors((p) => ({ ...p, teacherId: "" }));
                  }}
                  className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-400"
                />
                {fieldErrors.teacherId && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.teacherId}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="teacher-email" className="text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="teacher-email"
                  data-ocid="teacher_email.input"
                  type="email"
                  placeholder="your@email.com"
                  value={teacherEmail}
                  onChange={(e) => {
                    setTeacherEmail(e.target.value);
                    setFieldErrors((p) => ({ ...p, teacherEmail: "" }));
                  }}
                  className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-400"
                />
                {fieldErrors.teacherEmail && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.teacherEmail}
                  </p>
                )}
              </div>
              <Button
                data-ocid="teacher.submit_button"
                type="submit"
                disabled={isLoading || isFetching || waitingForActor}
                className="w-full font-semibold h-11 mt-2 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
                }}
              >
                {isLoading || waitingForActor ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {waitingForActor
                  ? "Connecting..."
                  : isFetching
                    ? "Connecting..."
                    : isLoading
                      ? "Verifying..."
                      : "Sign In as Teacher"}
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
