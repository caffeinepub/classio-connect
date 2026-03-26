import { ConversationModule } from "@/components/modules/ConversationModule";
import { GrammarModule } from "@/components/modules/GrammarModule";
import { ListeningModule } from "@/components/modules/ListeningModule";
import { PronunciationModule } from "@/components/modules/PronunciationModule";
import { ReadingModule } from "@/components/modules/ReadingModule";
import { VocabularyModule } from "@/components/modules/VocabularyModule";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart2,
  ChevronRight,
  LogOut,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

type StudentRecord = {
  id: bigint | string;
  schoolName: string;
  studentName: string;
  mobileNumber: string;
  teacherId: bigint | string;
  createdAt: bigint | string;
};

type StudentProgress = {
  currentModule: string;
  currentLesson: number;
};

type Module = {
  name: string;
  icon: string;
  description: string;
  totalLessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
};

type LocalReport = {
  moduleName: string;
  score: number;
  total: number;
  percent: number;
  remark: string;
  completedAt: string;
};

const MODULES: Module[] = [
  {
    name: "Vocabulary Builder",
    icon: "📚",
    description: "Expand your word bank with 500+ essential English words",
    totalLessons: 3,
    level: "Beginner",
  },
  {
    name: "Grammar Essentials",
    icon: "✏️",
    description: "Master tenses, articles, and sentence structures",
    totalLessons: 2,
    level: "Intermediate",
  },
  {
    name: "Pronunciation Practice",
    icon: "🎤",
    description: "Sound like a native with phonetics and stress patterns",
    totalLessons: 2,
    level: "Beginner",
  },
  {
    name: "Listening Skills",
    icon: "🎧",
    description: "Understand accents and improve comprehension",
    totalLessons: 2,
    level: "Intermediate",
  },
  {
    name: "Conversation Practice",
    icon: "💬",
    description: "Real-world dialogues and speaking confidence with AI",
    totalLessons: 2,
    level: "Advanced",
  },
  {
    name: "Reading Comprehension",
    icon: "📖",
    description: "Articles, stories, and critical reading strategies",
    totalLessons: 2,
    level: "Intermediate",
  },
];

function generateRemark(moduleName: string, score: number): string {
  if (score >= 90)
    return `Excellent work on ${moduleName}! You have a strong grasp of this skill. Keep challenging yourself with advanced content!`;
  if (score >= 70)
    return `Good job on ${moduleName}! You understand the basics well. Review the areas where you hesitated to strengthen further.`;
  if (score >= 50)
    return `You're making progress in ${moduleName}. Focus on reviewing the concepts you found tricky - consistency is key!`;
  return `Keep practicing ${moduleName}! Every attempt builds your skills. Try reviewing the lesson content and attempt again.`;
}

const LEXI_RESPONSES = [
  "Great question! Keep practicing and you'll improve every day! 🌟",
  "Remember: the best way to learn English is to use it every day. Even 15 minutes helps!",
  "Try reading English books or watching English movies with subtitles - it really works! 📺",
  "Don't be afraid to make mistakes. Every mistake is a stepping stone to fluency!",
  "Tip: Keep a vocabulary journal and add 5 new words every day. Review them weekly!",
  "Practice speaking aloud, even when alone. Your confidence will grow quickly! 💪",
  "Listening to English podcasts during commutes is a fantastic way to improve!",
  "Try thinking in English instead of translating from your native language.",
];

type ChatMessage = { id: string; role: "user" | "lexi"; text: string };

export function StudentDashboard() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [savedProgress, setSavedProgress] = useState<StudentProgress | null>(
    null,
  );
  const [assignedGrade, setAssignedGrade] = useState<number | null>(null);
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>(
    {},
  );
  const [activeModuleLesson, setActiveModuleLesson] = useState<{
    module: Module;
    lesson: number;
  } | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "lexi",
      text: "Hi there! I'm Lexi 🦩 Your English learning companion! Ask me anything about English or learning tips!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [reports, setReports] = useState<LocalReport[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const role = localStorage.getItem("classio_role");
    if (role !== "student") {
      navigate({ to: "/" });
      return;
    }
    const storedStudent = localStorage.getItem("classio_student");
    if (storedStudent) {
      try {
        setStudent(JSON.parse(storedStudent));
      } catch {
        navigate({ to: "/" });
      }
    }
    const storedProgress = localStorage.getItem("classio_student_progress");
    if (storedProgress) {
      try {
        setSavedProgress(JSON.parse(storedProgress));
      } catch {}
    }
    const mp: Record<string, number> = {};
    for (const m of MODULES) {
      const val = localStorage.getItem(`classio_mod_${m.name}`);
      if (val) mp[m.name] = Number(val);
    }
    setModuleProgress(mp);

    // Load assigned grade
    const storedStudent2 = localStorage.getItem("classio_student");
    if (storedStudent2) {
      try {
        const s2 = JSON.parse(storedStudent2);
        const g = localStorage.getItem(`classio_grade_${s2.id}`);
        if (g) setAssignedGrade(Number(g));
      } catch {}
    }
  }, [navigate]);

  useEffect(() => {
    const storedStudent = localStorage.getItem("classio_student");
    if (!storedStudent) return;
    try {
      const s = JSON.parse(storedStudent);
      const key = `classio_reports_${s.id}`;
      const saved = localStorage.getItem(key);
      if (saved) setReports(JSON.parse(saved));
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("classio_role");
    localStorage.removeItem("classio_student");
    navigate({ to: "/" });
  };

  const openModule = (module: Module) => {
    const currentLesson = moduleProgress[module.name] ?? 0;
    const base = currentLesson >= module.totalLessons ? 1 : currentLesson + 1;
    const lesson = Math.max(base, assignedGrade ?? 1);
    const clampedLesson = Math.min(lesson, module.totalLessons);
    setActiveModuleLesson({ module, lesson: clampedLesson });
  };

  const handleModuleComplete = async (score: number, total: number) => {
    if (!activeModuleLesson || !student) return;
    const { module, lesson } = activeModuleLesson;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    const remark = generateRemark(module.name, percent);

    // Save to backend
    if (actor) {
      (actor as any)
        .saveActivityReport(
          BigInt(String(student.id)),
          module.name,
          BigInt(score),
          BigInt(total),
          remark,
        )
        .catch(() => {});
    }

    // Save to localStorage
    const newReport: LocalReport = {
      moduleName: module.name,
      score: percent,
      total,
      percent,
      remark,
      completedAt: new Date().toLocaleDateString(),
    };
    const key = `classio_reports_${String(student.id)}`;
    const existing = localStorage.getItem(key);
    let existing_reports: LocalReport[] = [];
    try {
      existing_reports = existing ? JSON.parse(existing) : [];
    } catch {}
    // Replace existing report for same module
    const filtered = existing_reports.filter(
      (r) => r.moduleName !== module.name,
    );
    const updated = [...filtered, newReport];
    localStorage.setItem(key, JSON.stringify(updated));
    setReports(updated);

    // Adaptive lesson advancement based on performance
    let nextLesson: number;
    const minLesson = assignedGrade ?? 1;
    if (percent >= 80) {
      nextLesson = Math.min(lesson + 1, module.totalLessons);
      toast.success(
        `${module.name} completed! Score: ${percent}% 🎉 Moving to a harder lesson!`,
      );
    } else if (percent < 50) {
      nextLesson = Math.max(lesson - 1, minLesson, 1);
      toast.info(
        `Score: ${percent}%. Let's try this lesson again for more practice.`,
      );
    } else {
      nextLesson = Math.min(lesson, module.totalLessons);
      toast.success(`${module.name} completed! Score: ${percent}% 🎉`);
    }
    const newProgress = { ...moduleProgress, [module.name]: nextLesson };
    setModuleProgress(newProgress);
    localStorage.setItem(`classio_mod_${module.name}`, String(nextLesson));

    const progressData: StudentProgress = {
      currentModule: module.name,
      currentLesson: nextLesson,
    };
    setSavedProgress(progressData);
    localStorage.setItem(
      "classio_student_progress",
      JSON.stringify(progressData),
    );

    if (actor) {
      actor
        .updateStudentProgress(
          BigInt(String(student.id)),
          module.name,
          BigInt(nextLesson),
        )
        .catch(() => {});
    }

    setActiveModuleLesson(null);
  };

  const getModuleProgressPercent = (module: Module) => {
    const done = moduleProgress[module.name] ?? 0;
    return Math.round((done / module.totalLessons) * 100);
  };

  const getLevelColor = (level: string) => {
    if (level === "Beginner")
      return "bg-success/20 text-success border-success/30";
    if (level === "Intermediate")
      return "bg-primary/20 text-primary border-primary/30";
    return "bg-purple-500/20 text-purple-600 border-purple-500/30";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-700 border-green-300";
    if (score >= 70) return "bg-blue-100 text-blue-700 border-blue-300";
    if (score >= 50) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-red-100 text-red-700 border-red-300";
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: chatInput.trim(),
    };
    const lexiMsg: ChatMessage = {
      id: `l-${Date.now() + 1}`,
      role: "lexi",
      text: LEXI_RESPONSES[Math.floor(Math.random() * LEXI_RESPONSES.length)],
    };
    setChatMessages((prev) => [...prev, userMsg, lexiMsg]);
    setChatInput("");
    setTimeout(
      () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const avgScore =
    reports.length > 0
      ? Math.round(reports.reduce((a, r) => a + r.percent, 0) / reports.length)
      : null;

  // Module lesson view
  if (activeModuleLesson) {
    const { module, lesson } = activeModuleLesson;
    const progressPct = Math.round((lesson / module.totalLessons) * 100);

    const renderModule = () => {
      const props = { lesson, onComplete: handleModuleComplete };
      switch (module.name) {
        case "Vocabulary Builder":
          return <VocabularyModule {...props} />;
        case "Grammar Essentials":
          return <GrammarModule {...props} />;
        case "Pronunciation Practice":
          return <PronunciationModule {...props} />;
        case "Listening Skills":
          return <ListeningModule {...props} />;
        case "Conversation Practice":
          return <ConversationModule {...props} />;
        case "Reading Comprehension":
          return <ReadingModule {...props} />;
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            data-ocid="lesson.back.button"
            onClick={() => setActiveModuleLesson(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Lesson {lesson} of {module.totalLessons}
            </span>
            <div className="w-32 bg-secondary rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-8">
          <motion.div
            key={`${module.name}-${lesson}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{module.icon}</span>
              <div>
                <h1 className="text-xl font-bold">{module.name}</h1>
                <p className="text-sm text-muted-foreground">Lesson {lesson}</p>
              </div>
              <Badge
                className={`ml-auto text-xs ${getLevelColor(module.level)}`}
              >
                {module.level}
              </Badge>
            </div>
            {renderModule()}
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <img
          src="/assets/classio_logo_reel_compressed-019d290d-aec1-724b-a11c-a9a7f8c9394d.jpeg"
          alt="Classio"
          className="h-9 w-auto rounded object-contain"
        />
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{student?.studentName}</p>
            <p className="text-xs text-muted-foreground">
              {student?.schoolName}
            </p>
          </div>
          <button
            type="button"
            data-ocid="student.logout_button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {savedProgress?.currentModule && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            data-ocid="student.resume.card"
            className="mb-8 rounded-2xl p-5 bg-primary/10 border border-primary/25 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm text-primary font-semibold">
                👋 Welcome back, {student?.studentName}!
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Resume from{" "}
                <span className="text-foreground font-medium">
                  {savedProgress.currentModule}
                </span>{" "}
                — Lesson{" "}
                <span className="text-foreground font-medium">
                  {savedProgress.currentLesson}
                </span>
              </p>
            </div>
            <Button
              data-ocid="student.resume.primary_button"
              size="sm"
              className="gradient-cyan text-primary-foreground shrink-0"
              onClick={() => {
                const mod = MODULES.find(
                  (m) => m.name === savedProgress.currentModule,
                );
                if (mod)
                  setActiveModuleLesson({
                    module: mod,
                    lesson: savedProgress.currentLesson,
                  });
              }}
            >
              Resume
            </Button>
          </motion.div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Learning Path</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Adaptive English course tailored for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((module, i) => {
            const pct = getModuleProgressPercent(module);
            const isStarted = pct > 0;
            const isCompleted = pct === 100;
            const hasReport = reports.find((r) => r.moduleName === module.name);
            return (
              <motion.div
                key={module.name}
                data-ocid={`student.module.item.${i + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-5 flex flex-col gap-4 bg-white border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{module.icon}</span>
                  <Badge className={`text-xs ${getLevelColor(module.level)}`}>
                    {module.level}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">
                    {module.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {module.description}
                  </p>
                </div>
                {hasReport && (
                  <div
                    className={`text-xs px-2 py-1 rounded-lg border ${getScoreColor(hasReport.percent)}`}
                  >
                    Last score: {hasReport.percent}%
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {module.totalLessons} lessons
                    </span>
                    <span
                      className={
                        pct === 100 ? "text-green-600" : "text-primary"
                      }
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.07 + 0.3 }}
                      className="bg-primary h-1.5 rounded-full"
                    />
                  </div>
                </div>
                <Button
                  data-ocid={`student.module.button.${i + 1}`}
                  onClick={() => openModule(module)}
                  size="sm"
                  className={
                    isCompleted
                      ? "w-full bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                      : "w-full gradient-cyan text-primary-foreground"
                  }
                >
                  {isCompleted
                    ? "✓ Completed"
                    : isStarted
                      ? "Continue"
                      : "Start"}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Reports Section */}
        {reports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-6"
            data-ocid="student.reports.section"
          >
            <div className="flex items-center gap-3">
              <BarChart2 className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">📊 My Learning Report Card</h2>
            </div>

            {avgScore !== null && (
              <div className="rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 p-6 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary">
                    {avgScore}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Overall Average
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    Overall Performance
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {reports.length} module{reports.length > 1 ? "s" : ""}{" "}
                    completed
                  </p>
                  <p className="text-sm text-cyan-700 mt-2">
                    {generateRemark("your overall performance", avgScore)}
                  </p>
                </div>
              </div>
            )}

            {/* Bar Chart */}
            <div className="rounded-2xl border border-border bg-white p-6">
              <h3 className="font-semibold text-sm text-gray-700 mb-4">
                📈 Score by Module
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={reports.map((r) => ({
                    name: r.moduleName.split(" ")[0],
                    score: r.percent,
                    fill:
                      r.percent >= 80
                        ? "#22c55e"
                        : r.percent >= 50
                          ? "#f59e0b"
                          : "#ef4444",
                  }))}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Score"]}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {reports.map((r) => (
                      <Cell
                        key={`cell-${r.moduleName}`}
                        fill={
                          r.percent >= 80
                            ? "#22c55e"
                            : r.percent >= 50
                              ? "#f59e0b"
                              : "#ef4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            {reports.length > 1 && (
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-4">
                  🥧 Performance Distribution
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={reports.map((r) => ({
                          name: r.moduleName.split(" ")[0],
                          value: r.percent,
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {reports.map((r) => (
                          <Cell
                            key={`pie-${r.moduleName}`}
                            fill={
                              r.percent >= 80
                                ? "#22c55e"
                                : r.percent >= 50
                                  ? "#f59e0b"
                                  : "#ef4444"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, "Score"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />{" "}
                      Excellent ≥80%:{" "}
                      {reports.filter((r) => r.percent >= 80).length} modules
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />{" "}
                      Good 50–79%:{" "}
                      {
                        reports.filter((r) => r.percent >= 50 && r.percent < 80)
                          .length
                      }{" "}
                      modules
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />{" "}
                      Needs Work &lt;50%:{" "}
                      {reports.filter((r) => r.percent < 50).length} modules
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reports.map((report, i) => {
                const mod = MODULES.find((m) => m.name === report.moduleName);
                return (
                  <motion.div
                    key={report.moduleName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    data-ocid={`student.report.item.${i + 1}`}
                    className="rounded-2xl border border-border bg-white p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{mod?.icon ?? "📚"}</span>
                        <span className="font-semibold text-sm">
                          {report.moduleName}
                        </span>
                      </div>
                      <Badge
                        className={`text-xs ${getScoreColor(report.percent)}`}
                      >
                        {report.percent}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${report.percent}%`,
                          background:
                            report.percent >= 80
                              ? "#22c55e"
                              : report.percent >= 50
                                ? "#f59e0b"
                                : "#ef4444",
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {report.remark}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📅 {report.completedAt}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="mt-12 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </main>

      {/* Lexi floating button */}
      <motion.button
        type="button"
        data-ocid="student.ai_tutor.open_modal_button"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full gradient-cyan flex items-center justify-center text-2xl shadow-lg"
      >
        🦩
      </motion.button>

      {/* Lexi Chat */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            data-ocid="student.ai_tutor.modal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-80 max-h-[480px] flex flex-col bg-white rounded-2xl shadow-xl border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border gradient-cyan">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦩</span>
                <div>
                  <p className="text-sm font-bold text-primary-foreground">
                    Lexi
                  </p>
                  <p className="text-xs text-primary-foreground/70">
                    Your AI English Tutor
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-ocid="student.ai_tutor.close_button"
                onClick={() => setChatOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-primary-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "lexi" && (
                    <span className="text-xl shrink-0 mt-1">🦩</span>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "gradient-cyan text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input
                data-ocid="student.ai_tutor.input"
                type="text"
                placeholder="Ask Lexi anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary border border-border placeholder:text-muted-foreground"
              />
              <button
                type="button"
                data-ocid="student.ai_tutor.submit_button"
                onClick={sendChatMessage}
                className="p-2 rounded-lg gradient-cyan text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
