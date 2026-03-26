import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GraduationCap, Settings } from "lucide-react";
import { motion } from "motion/react";

export function RoleSelectPage() {
  const navigate = useNavigate();

  const roles = [
    {
      id: "student",
      icon: GraduationCap,
      title: "Student",
      description:
        "Access your personalized learning journey and resume where you left off.",
      path: "/login/student",
      accent: "cyan",
      gradient: "from-cyan-500/20 to-blue-600/20",
      border: "hover:border-cyan-500/60",
      glow: "0 0 30px oklch(0.75 0.18 210 / 0.2)",
      iconColor: "text-cyan-400",
      ocid: "portal.student.card",
    },
    {
      id: "teacher",
      icon: BookOpen,
      title: "Teacher",
      description:
        "Manage your students, track progress, and deliver engaging lessons.",
      path: "/login/teacher",
      accent: "indigo",
      gradient: "from-indigo-500/20 to-purple-600/20",
      border: "hover:border-indigo-400/60",
      glow: "0 0 30px oklch(0.55 0.22 280 / 0.2)",
      iconColor: "text-indigo-400",
      ocid: "portal.teacher.card",
    },
    {
      id: "admin",
      icon: Settings,
      title: "Admin",
      description:
        "Oversee the platform, manage teachers, and configure school settings.",
      path: "/login/admin",
      accent: "amber",
      gradient: "from-amber-500/20 to-orange-600/20",
      border: "hover:border-amber-400/60",
      glow: "0 0 30px oklch(0.75 0.18 65 / 0.2)",
      iconColor: "text-amber-400",
      ocid: "portal.admin.card",
    },
  ];

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "oklch(0.75 0.18 210)", filter: "blur(120px)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "oklch(0.55 0.22 280)", filter: "blur(100px)" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-[0.03]"
          style={{ background: "oklch(0.75 0.18 65)", filter: "blur(80px)" }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col items-center text-center"
      >
        <img
          src="/assets/uploads/classio_logo_reel_compressed-019d290d-aec1-724b-a11c-a9a7f8c9394d-1.jpeg"
          alt="Classio Connect"
          className="h-16 w-auto rounded-xl object-contain mb-5"
        />
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
          Welcome to <span className="text-cyan">Classio</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Choose your portal to access your personalized experience
        </p>
      </motion.div>

      {/* Role Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role, i) => {
          const Icon = role.icon;
          return (
            <motion.button
              key={role.id}
              data-ocid={role.ocid}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate({ to: role.path as any })}
              className={`group relative text-left rounded-2xl p-7 card-dark border border-border transition-all duration-300 cursor-pointer overflow-hidden ${role.border}`}
              style={{
                transition:
                  "border-color 0.3s, box-shadow 0.3s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  role.glow;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
              }}
            >
              {/* Gradient bg on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 bg-white/5 border border-white/10 ${role.iconColor}`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  {role.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {role.description}
                </p>
                <div
                  className={`flex items-center gap-2 text-sm font-semibold ${role.iconColor} group-hover:gap-3 transition-all duration-200`}
                >
                  <span>Sign In as {role.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-12 text-center text-xs text-muted-foreground"
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan hover:underline"
        >
          caffeine.ai
        </a>
      </motion.p>
    </div>
  );
}
