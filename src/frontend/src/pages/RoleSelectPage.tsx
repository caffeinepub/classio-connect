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
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      border: "border-cyan-100 hover:border-cyan-400",
      cta: "text-cyan-600",
      glow: "0 8px 30px rgba(8,145,178,0.15)",
      ocid: "portal.student.card",
    },
    {
      id: "teacher",
      icon: BookOpen,
      title: "Teacher",
      description:
        "Manage your students, track progress, and deliver engaging lessons.",
      path: "/login/teacher",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      border: "border-indigo-100 hover:border-indigo-400",
      cta: "text-indigo-600",
      glow: "0 8px 30px rgba(99,102,241,0.15)",
      ocid: "portal.teacher.card",
    },
    {
      id: "admin",
      icon: Settings,
      title: "Admin",
      description:
        "Oversee the platform, manage teachers, and configure school settings.",
      path: "/login/admin",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      border: "border-amber-100 hover:border-amber-400",
      cta: "text-amber-600",
      glow: "0 8px 30px rgba(217,119,6,0.15)",
      ocid: "portal.admin.card",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col items-center text-center"
      >
        <img
          src="/assets/classio_logo_reel_compressed-019d290d-aec1-724b-a11c-a9a7f8c9394d.jpeg"
          alt="Classio Connect"
          className="h-16 w-auto rounded-xl object-contain mb-5"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Welcome to <span style={{ color: "#0891b2" }}>Classio</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-md">
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
              className={`group relative text-left rounded-2xl p-7 bg-white border transition-all duration-300 cursor-pointer shadow-sm ${role.border}`}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  role.glow;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 1px 3px rgba(0,0,0,0.08)";
              }}
            >
              <div className="relative z-10">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 ${role.iconBg} ${role.iconColor}`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {role.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {role.description}
                </p>
                <div
                  className={`flex items-center gap-2 text-sm font-semibold ${role.cta} group-hover:gap-3 transition-all duration-200`}
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
        className="mt-12 text-center text-xs text-gray-400"
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 hover:underline"
        >
          caffeine.ai
        </a>
      </motion.p>
    </div>
  );
}
