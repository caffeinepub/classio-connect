import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const GEAR_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function StudentIcon() {
  return (
    <svg
      role="img"
      aria-label="Student graduation cap icon"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      <title>Student</title>
      <defs>
        <radialGradient id="studentGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <ellipse
        cx="28"
        cy="28"
        rx="22"
        ry="22"
        fill="url(#studentGlow)"
        opacity="0.18"
      />
      <rect
        x="14"
        y="30"
        width="28"
        height="5"
        rx="2"
        fill="#0891b2"
        opacity="0.85"
      />
      <polygon
        points="28,14 44,26 28,30 12,26"
        fill="#06b6d4"
        stroke="#e0f2fe"
        strokeWidth="1"
        opacity="0.95"
      />
      <line
        x1="44"
        y1="26"
        x2="44"
        y2="34"
        stroke="#67e8f9"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="44" cy="35" r="2" fill="#67e8f9" />
      <polygon points="28,14 38,20 28,23" fill="white" opacity="0.25" />
      <circle cx="28" cy="42" r="4" fill="#0891b2" opacity="0.5" />
      <path
        d="M20 50 Q28 44 36 50"
        stroke="#0891b2"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

function TeacherIcon() {
  return (
    <svg
      role="img"
      aria-label="Teacher open book icon"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      <title>Teacher</title>
      <defs>
        <radialGradient id="teacherGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <ellipse
        cx="28"
        cy="28"
        rx="22"
        ry="22"
        fill="url(#teacherGlow)"
        opacity="0.18"
      />
      <path
        d="M12 16 Q20 14 28 17 L28 42 Q20 39 12 41 Z"
        fill="#6366f1"
        opacity="0.85"
        stroke="#c7d2fe"
        strokeWidth="0.8"
      />
      <path
        d="M44 16 Q36 14 28 17 L28 42 Q36 39 44 41 Z"
        fill="#818cf8"
        opacity="0.85"
        stroke="#c7d2fe"
        strokeWidth="0.8"
      />
      <line
        x1="28"
        y1="17"
        x2="28"
        y2="42"
        stroke="#e0e7ff"
        strokeWidth="1.5"
      />
      <line
        x1="15"
        y1="23"
        x2="25"
        y2="21"
        stroke="#e0e7ff"
        strokeWidth="1"
        opacity="0.7"
      />
      <line
        x1="15"
        y1="27"
        x2="25"
        y2="25"
        stroke="#e0e7ff"
        strokeWidth="1"
        opacity="0.7"
      />
      <line
        x1="15"
        y1="31"
        x2="25"
        y2="29"
        stroke="#e0e7ff"
        strokeWidth="1"
        opacity="0.7"
      />
      <line
        x1="31"
        y1="21"
        x2="41"
        y2="23"
        stroke="#e0e7ff"
        strokeWidth="1"
        opacity="0.7"
      />
      <line
        x1="31"
        y1="25"
        x2="41"
        y2="27"
        stroke="#e0e7ff"
        strokeWidth="1"
        opacity="0.7"
      />
      <line
        x1="31"
        y1="29"
        x2="41"
        y2="31"
        stroke="#e0e7ff"
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M12 16 Q16 15 20 15 L20 22 Q16 22 12 23 Z"
        fill="white"
        opacity="0.2"
      />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg
      role="img"
      aria-label="Admin gear settings icon"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      <title>Admin</title>
      <defs>
        <radialGradient id="adminGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <ellipse
        cx="28"
        cy="28"
        rx="22"
        ry="22"
        fill="url(#adminGlow)"
        opacity="0.18"
      />
      <circle
        cx="28"
        cy="28"
        r="14"
        fill="none"
        stroke="#d97706"
        strokeWidth="3"
        opacity="0.9"
      />
      <circle cx="28" cy="28" r="7" fill="#fbbf24" opacity="0.9" />
      <circle cx="28" cy="28" r="4" fill="#fffbeb" opacity="0.8" />
      {GEAR_ANGLES.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 28 + 14 * Math.cos(rad);
        const y1 = 28 + 14 * Math.sin(rad);
        const x2 = 28 + 19 * Math.cos(rad);
        const y2 = 28 + 19 * Math.sin(rad);
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="24" cy="24" r="3" fill="white" opacity="0.25" />
    </svg>
  );
}

export function RoleSelectPage() {
  const navigate = useNavigate();

  const roles = [
    {
      id: "student",
      IconComponent: StudentIcon,
      title: "Student",
      description:
        "Access your personalized learning journey and resume where you left off.",
      path: "/login/student",
      glowBg:
        "radial-gradient(circle at 40% 40%, rgba(6,182,212,0.18) 0%, rgba(8,145,178,0.08) 100%)",
      iconShadow: "0 0 18px 4px rgba(6,182,212,0.35)",
      border: "border-cyan-100 hover:border-cyan-400",
      cta: "text-cyan-600",
      glow: "0 8px 30px rgba(8,145,178,0.15)",
      ocid: "portal.student.card",
    },
    {
      id: "teacher",
      IconComponent: TeacherIcon,
      title: "Teacher",
      description:
        "Manage your students, track progress, and deliver engaging lessons.",
      path: "/login/teacher",
      glowBg:
        "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.18) 0%, rgba(79,70,229,0.08) 100%)",
      iconShadow: "0 0 18px 4px rgba(99,102,241,0.35)",
      border: "border-indigo-100 hover:border-indigo-400",
      cta: "text-indigo-600",
      glow: "0 8px 30px rgba(99,102,241,0.15)",
      ocid: "portal.teacher.card",
    },
    {
      id: "admin",
      IconComponent: AdminIcon,
      title: "Admin",
      description:
        "Oversee the platform, manage teachers, and configure school settings.",
      path: "/login/admin",
      glowBg:
        "radial-gradient(circle at 40% 40%, rgba(251,191,36,0.18) 0%, rgba(217,119,6,0.08) 100%)",
      iconShadow: "0 0 18px 4px rgba(251,191,36,0.4)",
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
          src="/assets/uploads/whatsapp_image_2026-03-26_at_21.57.49-019d2de3-2709-728a-a238-de560718a29b-1.jpeg"
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
          const { IconComponent } = role;
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
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5"
                  style={{
                    background: role.glowBg,
                    boxShadow: role.iconShadow,
                  }}
                >
                  <IconComponent />
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
