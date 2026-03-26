import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

type RoleTab = "admin" | "teacher" | "student";

export function LoginPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [activeTab, setActiveTab] = useState<RoleTab>("student");
  const [isLoading, setIsLoading] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [teacherId, setTeacherId] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");

  const [schoolName, setSchoolName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === "admin@classio.com" && adminPassword === "admin123") {
      localStorage.setItem("classio_role", "admin");
      toast.success("Welcome, Admin!");
      navigate({ to: "/admin" });
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !teacherEmail) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!actor) {
      toast.error("Connecting to network, please wait...");
      return;
    }
    setIsLoading(true);
    try {
      const result = await (actor as any).getTeacherById(BigInt(teacherId));
      if (result && result.email === teacherEmail) {
        localStorage.setItem("classio_role", "teacher");
        localStorage.setItem("classio_teacher_id", teacherId);
        localStorage.setItem("classio_teacher_name", result.name);
        toast.success(`Welcome back, ${result.name}!`);
        navigate({ to: "/teacher" });
      } else {
        toast.error("Invalid Teacher ID or email");
      }
    } catch {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !studentName || !mobileNumber) {
      toast.error("All fields are required");
      return;
    }
    if (!actor) {
      toast.error("Connecting to network, please wait...");
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
        toast.success(`Welcome, ${result.studentName}!`);
        navigate({ to: "/student" });
      } else {
        toast.error(
          "Student not found. Check your details or contact your teacher.",
        );
      }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: { id: RoleTab; label: string; emoji: string }[] = [
    { id: "student", label: "Student", emoji: "🎓" },
    { id: "teacher", label: "Teacher", emoji: "📋" },
    { id: "admin", label: "Admin", emoji: "⚙️" },
  ];

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: "oklch(0.75 0.18 210)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5"
          style={{ background: "oklch(0.65 0.2 230)", filter: "blur(60px)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col items-center"
      >
        <img
          src="/assets/uploads/classio_logo_reel_compressed-019d290d-aec1-724b-a11c-a9a7f8c9394d-1.jpeg"
          alt="Classio Connect"
          className="h-16 w-auto rounded-lg object-contain"
        />
        <p className="mt-3 text-muted-foreground text-sm tracking-widest uppercase">
          Adaptive Learning Platform
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <div className="card-dark rounded-2xl p-8 shadow-card">
          <div className="flex gap-1 mb-8 bg-secondary/50 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                data-ocid={`login.${tab.id}.tab`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground cyan-glow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === "admin" && (
            <motion.form
              key="admin"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleAdminLogin}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Admin Login</h2>
                <p className="text-muted-foreground text-sm">
                  Access the admin control panel
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email Address</Label>
                <Input
                  id="admin-email"
                  data-ocid="admin.input"
                  type="email"
                  placeholder="admin@classio.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="bg-secondary border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  data-ocid="admin_password.input"
                  type="password"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="bg-secondary border-border focus:border-primary"
                />
              </div>
              <Button
                data-ocid="admin.submit_button"
                type="submit"
                className="w-full gradient-cyan text-primary-foreground font-semibold h-11"
              >
                Sign In as Admin
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Demo: admin@classio.com / admin123
              </p>
            </motion.form>
          )}

          {activeTab === "teacher" && (
            <motion.form
              key="teacher"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleTeacherLogin}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Teacher Login</h2>
                <p className="text-muted-foreground text-sm">
                  Enter your credentials from your admin
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-id">Teacher ID</Label>
                <Input
                  id="teacher-id"
                  data-ocid="teacher_id.input"
                  type="number"
                  placeholder="e.g. 1001"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="bg-secondary border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-email">Email Address</Label>
                <Input
                  id="teacher-email"
                  data-ocid="teacher_email.input"
                  type="email"
                  placeholder="your@email.com"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  className="bg-secondary border-border focus:border-primary"
                />
              </div>
              <Button
                data-ocid="teacher.submit_button"
                type="submit"
                disabled={isLoading}
                className="w-full gradient-cyan text-primary-foreground font-semibold h-11"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Verifying..." : "Sign In as Teacher"}
              </Button>
            </motion.form>
          )}

          {activeTab === "student" && (
            <motion.form
              key="student"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleStudentLogin}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Student Login</h2>
                <p className="text-muted-foreground text-sm">
                  Enter your school details to continue learning
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-name">
                  School Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="school-name"
                  data-ocid="student_school.input"
                  placeholder="e.g. Delhi Public School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="bg-secondary border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-name">
                  Student Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="student-name"
                  data-ocid="student_name.input"
                  placeholder="Your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="bg-secondary border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile-number">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile-number"
                  data-ocid="student_mobile.input"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="bg-secondary border-border focus:border-primary"
                />
              </div>
              <Button
                data-ocid="student.submit_button"
                type="submit"
                disabled={isLoading}
                className="w-full gradient-cyan text-primary-foreground font-semibold h-11"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Signing in..." : "Start Learning"}
              </Button>
            </motion.form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
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
      </motion.div>
    </div>
  );
}
