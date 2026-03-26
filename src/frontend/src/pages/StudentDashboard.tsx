import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, LogOut, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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

const MODULES: Module[] = [
  {
    name: "Vocabulary Builder",
    icon: "📚",
    description: "Expand your word bank with 500+ essential English words",
    totalLessons: 10,
    level: "Beginner",
  },
  {
    name: "Grammar Essentials",
    icon: "✏️",
    description: "Master tenses, articles, and sentence structures",
    totalLessons: 12,
    level: "Intermediate",
  },
  {
    name: "Pronunciation Practice",
    icon: "🎤",
    description: "Sound like a native with phonetics and stress patterns",
    totalLessons: 8,
    level: "Beginner",
  },
  {
    name: "Listening Skills",
    icon: "🎧",
    description: "Understand accents and improve comprehension",
    totalLessons: 10,
    level: "Intermediate",
  },
  {
    name: "Conversation Practice",
    icon: "💬",
    description: "Real-world dialogues and speaking confidence",
    totalLessons: 15,
    level: "Advanced",
  },
  {
    name: "Reading Comprehension",
    icon: "📖",
    description: "Articles, stories, and critical reading strategies",
    totalLessons: 10,
    level: "Intermediate",
  },
];

const LESSON_CONTENT: Record<
  string,
  Record<number, { title: string; content: string; exercise: string }>
> = {
  "Vocabulary Builder": {
    1: {
      title: "Everyday Objects",
      content:
        "Learn words for items you use daily. Today we cover: book, pen, table, chair, window, door, phone, bag, clock, water.",
      exercise: "Fill in the blank: The _____ is on the table. (book/phone)",
    },
    2: {
      title: "Action Words",
      content:
        "Verbs bring sentences to life! Master: run, walk, eat, drink, sleep, read, write, speak, listen, learn.",
      exercise: "Form a sentence using the word 'listen'.",
    },
    3: {
      title: "Describing Words",
      content:
        "Adjectives: big, small, fast, slow, happy, sad, beautiful, strong, quiet, loud. Use them to paint vivid pictures!",
      exercise: "Describe your home using 3 adjectives.",
    },
  },
  "Grammar Essentials": {
    1: {
      title: "Present Simple Tense",
      content:
        "Use Present Simple for habits and facts. Structure: Subject + Verb (+ s/es for he/she/it). Examples: 'She reads every day.' 'They play cricket.'",
      exercise: "Write 3 sentences about your daily routine.",
    },
    2: {
      title: "Articles: A, An, The",
      content:
        "A/An for indefinite nouns (first mention). The for specific nouns (known). 'I saw a dog. The dog was friendly.'",
      exercise: "Fill: ___ apple a day keeps ___ doctor away.",
    },
    3: {
      title: "Question Formation",
      content:
        "Questions use auxiliary verbs: Do/Does/Did/Is/Are/Was/Were. 'Do you like tea?' 'Is she coming?' 'Did they arrive?'",
      exercise: "Convert to a question: 'He speaks English well.'",
    },
  },
  "Pronunciation Practice": {
    1: {
      title: "Vowel Sounds",
      content:
        "English has 5 vowels (A, E, I, O, U) but 12+ sounds. Key pairs: /i:/ (see) vs /I/ (sit), /u:/ (food) vs /U/ (foot).",
      exercise: "Practice: 'She sees the sea' - identify all vowel sounds.",
    },
    2: {
      title: "Silent Letters",
      content:
        "Many English words have silent letters: knife (k silent), know (k silent), who (w silent), write (w silent).",
      exercise: "Find the silent letter: knight, psychology, honest, island.",
    },
  },
  "Listening Skills": {
    1: {
      title: "Active Listening",
      content:
        "Active listening means focusing fully on the speaker. Tips: maintain eye contact, nod, don't interrupt, paraphrase back. 'So what you're saying is...'",
      exercise: "Listen to a 2-minute news clip and write 5 key points.",
    },
    2: {
      title: "Accents & Dialects",
      content:
        "English has many accents: British RP, American General, Australian, Indian English. Each has unique stress patterns and vocabulary.",
      exercise:
        "Watch a short video in British and American English. Note 3 pronunciation differences.",
    },
  },
  "Conversation Practice": {
    1: {
      title: "Greetings & Introductions",
      content:
        "Formal: 'Good morning, I'm [Name]. It's a pleasure to meet you.' Informal: 'Hey! I'm [Name]. Nice to meet you!' Practice transitions from formal to casual.",
      exercise: "Role-play: Introduce yourself to a new classmate.",
    },
    2: {
      title: "Asking for Directions",
      content:
        "Key phrases: 'Excuse me, could you tell me how to get to...?' 'Turn left/right at...' 'It's next to / opposite / across from...'",
      exercise: "Write directions from your school to the nearest market.",
    },
  },
  "Reading Comprehension": {
    1: {
      title: "Finding the Main Idea",
      content:
        "The main idea is what a paragraph is mostly about. It's usually in the topic sentence (first or last sentence). Supporting details explain or prove the main idea.",
      exercise:
        "Read: 'Dogs are loyal pets. They protect homes, comfort owners, and learn commands easily.' What's the main idea?",
    },
    2: {
      title: "Making Inferences",
      content:
        "Inferences = reading between the lines. Use context clues + your knowledge. 'She grabbed an umbrella before leaving.' We infer it might rain.",
      exercise:
        "Infer: 'Tom stared at the menu for 10 minutes.' What is Tom doing?",
    },
  },
};

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
      text: "Hi there! I'm Lexi 🦉 Your English learning companion! Ask me anything about English or learning tips!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
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
      } catch {
        /* ignore */
      }
    }
    const mp: Record<string, number> = {};
    for (const m of MODULES) {
      const val = localStorage.getItem(`classio_mod_${m.name}`);
      if (val) mp[m.name] = Number(val);
    }
    setModuleProgress(mp);
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []); // intentionally empty - runs after each render when messages update

  const handleLogout = () => {
    localStorage.removeItem("classio_role");
    localStorage.removeItem("classio_student");
    navigate({ to: "/" });
  };

  const openModule = (module: Module) => {
    const currentLesson = moduleProgress[module.name] ?? 0;
    const lesson = currentLesson >= module.totalLessons ? 1 : currentLesson + 1;
    setActiveModuleLesson({ module, lesson });
  };

  const handleMarkComplete = async () => {
    if (!activeModuleLesson || !student) return;
    const { module, lesson } = activeModuleLesson;
    const nextLesson = Math.min(lesson, module.totalLessons);

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

    toast.success("Lesson completed! Great work! 🎉");

    if (lesson < module.totalLessons) {
      setActiveModuleLesson({ module, lesson: lesson + 1 });
    } else {
      toast.success(`You completed ${module.name}! 🏆`);
      setActiveModuleLesson(null);
    }
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
    return "bg-purple-500/20 text-purple-300 border-purple-500/30";
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
  };

  const getLessonContent = (moduleName: string, lessonNum: number) => {
    const moduleContent = LESSON_CONTENT[moduleName];
    if (!moduleContent)
      return {
        title: `Lesson ${lessonNum}`,
        content: "Engaging lesson content coming soon!",
        exercise: "Practice what you've learned today.",
      };
    return (
      moduleContent[lessonNum] ||
      moduleContent[1] || {
        title: `Lesson ${lessonNum}`,
        content: "Keep up the great work!",
        exercise: "Review previous lessons.",
      }
    );
  };

  // Lesson View
  if (activeModuleLesson) {
    const { module, lesson } = activeModuleLesson;
    const lessonData = getLessonContent(module.name, lesson);
    const progressPct = Math.round((lesson / module.totalLessons) * 100);

    return (
      <div className="min-h-screen bg-background gradient-bg">
        <header className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
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
                className="progress-bar-cyan h-1.5 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-10">
          <motion.div
            key={`${module.name}-${lesson}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{module.icon}</span>
                <Badge className={`text-xs ${getLevelColor(module.level)}`}>
                  {module.level}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold font-display">{module.name}</h1>
              <h2 className="text-lg text-primary mt-1">{lessonData.title}</h2>
            </div>

            <div className="card-dark rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Lesson Content
              </h3>
              <p className="text-foreground leading-relaxed">
                {lessonData.content}
              </p>
            </div>

            <div className="card-dark rounded-2xl p-6 border border-primary/20">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                📝 Practice Exercise
              </h3>
              <p className="text-foreground">{lessonData.exercise}</p>
            </div>

            <Button
              data-ocid="lesson.complete.primary_button"
              onClick={handleMarkComplete}
              className="w-full gradient-cyan text-primary-foreground font-semibold h-12 text-base"
            >
              {lesson < module.totalLessons ? (
                <>
                  <span>Mark Complete &amp; Next</span>{" "}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                "Complete Module 🏆"
              )}
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background gradient-bg">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
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
          <h1 className="text-2xl font-bold font-display">
            Your Learning Path
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Adaptive English course tailored for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((module, i) => {
            const pct = getModuleProgressPercent(module);
            const isStarted = pct > 0;
            const isCompleted = pct === 100;
            return (
              <motion.div
                key={module.name}
                data-ocid={`student.module.item.${i + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card-dark-hover rounded-2xl p-5 flex flex-col gap-4"
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {module.totalLessons} lessons
                    </span>
                    <span
                      className={pct === 100 ? "text-success" : "text-primary"}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.07 + 0.3 }}
                      className="progress-bar-cyan h-1.5 rounded-full"
                    />
                  </div>
                </div>
                <Button
                  data-ocid={`student.module.button.${i + 1}`}
                  onClick={() => openModule(module)}
                  size="sm"
                  className={
                    isCompleted
                      ? "w-full bg-success/20 text-success border border-success/30 hover:bg-success/30"
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

        <div className="mt-12 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </main>

      {/* Lexi AI Tutor Button */}
      <motion.button
        type="button"
        data-ocid="student.ai_tutor.open_modal_button"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full gradient-cyan flex items-center justify-center text-2xl shadow-cyan-md animate-pulse-cyan"
      >
        🦉
      </motion.button>

      {/* Lexi Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            data-ocid="student.ai_tutor.modal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-80 max-h-[480px] flex flex-col card-dark rounded-2xl shadow-cyan-md border border-primary/20 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border gradient-cyan">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦉</span>
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

            <div className="flex-1 overflow-y-auto scrollbar-dark p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {msg.role === "lexi" && (
                    <span className="text-xl shrink-0 mt-1">🦉</span>
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
