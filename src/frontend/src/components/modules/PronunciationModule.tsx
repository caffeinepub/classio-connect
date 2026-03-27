import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, Lock, Mic, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type DayTask = {
  id: string;
  title: string;
  instruction: string;
  target: string;
  tip: string;
  boldWords: string[];
  type:
    | "listen-repeat"
    | "tongue-twister"
    | "word-stress"
    | "minimal-pairs"
    | "sentence-flow";
};

type WeekPlan = {
  week: number;
  theme: string;
  color: string;
  days: DayTask[];
};

const WEEKLY_PLAN: WeekPlan[] = [
  {
    week: 1,
    theme: "Basic Sounds & Clarity",
    color: "cyan",
    days: [
      {
        id: "w1d1",
        title: "Day 1 — /sh/ vs /s/ Sound",
        instruction: "Read this sentence clearly, focusing on the /sh/ sound.",
        target: "She sells seashells by the seashore.",
        tip: "For /sh/: lips slightly rounded, tongue behind top teeth. For /s/: tongue touches the ridge behind top teeth.",
        boldWords: ["She", "sells", "seashells", "seashore"],
        type: "tongue-twister",
      },
      {
        id: "w1d2",
        title: "Day 2 — /p/ Plosive Sound",
        instruction: "Say each word with a clear puff of air on /p/ sounds.",
        target: "Peter Piper picked a peck of pickled peppers.",
        tip: "Press your lips firmly together, then release with a small burst of air. Say slowly first, then build speed.",
        boldWords: ["Peter", "Piper", "picked", "peck", "pickled", "peppers"],
        type: "tongue-twister",
      },
      {
        id: "w1d3",
        title: "Day 3 — Word Stress",
        instruction: "Stress the BOLD words louder and longer than the rest.",
        target: "The quick brown fox jumps over the lazy dog.",
        tip: "Content words (nouns, verbs, adjectives) are stressed. Function words (the, a, of) are unstressed and spoken quickly.",
        boldWords: ["quick", "brown", "fox", "jumps", "lazy", "dog"],
        type: "word-stress",
      },
      {
        id: "w1d4",
        title: "Day 4 — /w/ vs /v/ Sound",
        instruction:
          "Focus on the /w/ sound — round your lips before speaking.",
        target:
          "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
        tip: "For /w/: round your lips first, then open. The /oo/ in wood and would is a short /ʊ/ sound.",
        boldWords: ["wood", "would", "woodchuck", "chuck"],
        type: "tongue-twister",
      },
      {
        id: "w1d5",
        title: "Day 5 — /r/ vs /l/ Sound",
        instruction: "Alternate these sounds clearly in each repetition.",
        target: "Red lorry, yellow lorry, red lorry, yellow lorry.",
        tip: "For /r/: tongue does NOT touch the roof. For /l/: tip of tongue touches just behind the top teeth.",
        boldWords: ["Red", "lorry", "yellow"],
        type: "minimal-pairs",
      },
    ],
  },
  {
    week: 2,
    theme: "Sentence Rhythm & Flow",
    color: "blue",
    days: [
      {
        id: "w2d1",
        title: "Day 1 — Natural Contractions",
        instruction:
          "Speak naturally — merge words together as native speakers do.",
        target: "I would have gone if I had known about it earlier.",
        tip: "'I would have' sounds like 'I woulda' in natural speech. 'had known' sounds like 'hadn-own'. Practice blending.",
        boldWords: ["would have", "had known"],
        type: "sentence-flow",
      },
      {
        id: "w2d2",
        title: "Day 2 — Rising Intonation",
        instruction:
          "Your voice should RISE at the end — like asking a question.",
        target:
          "Are you coming to the party tonight? Did you finish your homework?",
        tip: "In yes/no questions, intonation rises at the end. Practice letting your voice go up on the last word.",
        boldWords: ["coming", "finish"],
        type: "sentence-flow",
      },
      {
        id: "w2d3",
        title: "Day 3 — Falling Intonation",
        instruction:
          "Your voice should FALL at the end — like making a statement.",
        target:
          "I went to the market. She bought a new book. They are very happy.",
        tip: "Statements end with a falling tone. Start high, let your voice drop naturally on the final syllable.",
        boldWords: ["market", "book", "happy"],
        type: "sentence-flow",
      },
      {
        id: "w2d4",
        title: "Day 4 — Linking Words",
        instruction: "Link the words smoothly — no breaks between words.",
        target: "Turn it off and put it away before you go out.",
        tip: "'Turn it' → 'Tur-nit'. 'put it' → 'pu-dit'. When a word ends in a consonant and next starts with a vowel, link them.",
        boldWords: ["Turn", "off", "put", "away"],
        type: "sentence-flow",
      },
      {
        id: "w2d5",
        title: "Day 5 — Sentence Rhythm Review",
        instruction:
          "Keep a natural beat — stressed syllables are evenly spaced.",
        target: "Can you can a can as a canner can can a can?",
        tip: "English has a stress-timed rhythm. Stressed syllables fall at regular intervals. Unstressed syllables squeeze in between.",
        boldWords: ["Can", "can", "canner"],
        type: "tongue-twister",
      },
    ],
  },
  {
    week: 3,
    theme: "Vowel Sounds Mastery",
    color: "purple",
    days: [
      {
        id: "w3d1",
        title: "Day 1 — Long /iː/ vs Short /ɪ/",
        instruction: "Feel the difference — LONG 'ee' vs SHORT 'ih'.",
        target: "I feel it is really simply the best meal of the week.",
        tip: "Long /iː/: mouth corners stretch, tongue high. Short /ɪ/: relaxed, tongue slightly lower. Feel and hear the difference.",
        boldWords: ["feel", "it", "is", "simply", "meal", "week"],
        type: "minimal-pairs",
      },
      {
        id: "w3d2",
        title: "Day 2 — /æ/ vs /ʌ/ Sound",
        instruction:
          "Say 'cat' and 'cut' — feel how your jaw moves differently.",
        target: "The cat sat on the mat and the man ran past the van.",
        tip: "For /æ/ (cat): jaw drops, mouth wide. For /ʌ/ (cut): jaw slightly raised, mouth more closed.",
        boldWords: ["cat", "sat", "mat", "man", "ran", "van"],
        type: "minimal-pairs",
      },
      {
        id: "w3d3",
        title: "Day 3 — /ɒ/ vs /ɔː/ Sound",
        instruction: "Short 'o' vs long 'aw' — hear the length difference.",
        target: "The dog saw a log near the door by the shore.",
        tip: "Short /ɒ/ (dog): quick, clipped. Long /ɔː/ (door): hold it longer, lips rounded.",
        boldWords: ["dog", "saw", "log", "door", "shore"],
        type: "minimal-pairs",
      },
      {
        id: "w3d4",
        title: "Day 4 — Diphthongs /eɪ/ and /aɪ/",
        instruction:
          "These vowels glide — start at one sound and move to another.",
        target: "I like to bake and make great cakes every day in May.",
        tip: "For /eɪ/ (bake): start with 'eh' then glide to 'ee'. For /aɪ/ (like): start with 'ah' then glide to 'ee'.",
        boldWords: ["like", "bake", "make", "great", "cakes", "day", "May"],
        type: "sentence-flow",
      },
      {
        id: "w3d5",
        title: "Day 5 — Schwa /ə/ Sound",
        instruction:
          "The schwa is the most common vowel in English — unstressed and relaxed.",
        target:
          "About a quarter of the words in spoken English contain a schwa.",
        tip: "The schwa is like a lazy 'uh'. In 'about' → 'uh-BOUT'. In 'the' → 'thuh'. Unstressed syllables usually use schwa.",
        boldWords: ["About", "quarter", "of", "the", "a"],
        type: "sentence-flow",
      },
    ],
  },
  {
    week: 4,
    theme: "Real Conversations",
    color: "green",
    days: [
      {
        id: "w4d1",
        title: "Day 1 — Greetings & Small Talk",
        instruction: "Say this naturally, with a warm, friendly tone.",
        target: "Good morning! How are you doing today? I hope you are well.",
        tip: "Greetings should sound warm and genuine. Raise your pitch slightly on 'morning' and 'doing'.",
        boldWords: ["morning", "doing", "hope", "well"],
        type: "sentence-flow",
      },
      {
        id: "w4d2",
        title: "Day 2 — Asking for Help",
        instruction: "Speak politely — soft tone, clear words.",
        target:
          "Excuse me, could you please help me find the nearest bus stop?",
        tip: "'Could you please' is polite phrasing. Stress 'help', 'find', and 'bus stop'. Speak slowly and clearly.",
        boldWords: ["Excuse", "help", "find", "nearest", "bus stop"],
        type: "sentence-flow",
      },
      {
        id: "w4d3",
        title: "Day 3 — Expressing Opinion",
        instruction: "Use a confident, clear tone when sharing your view.",
        target:
          "In my opinion, learning English every day is the best way to improve quickly.",
        tip: "'In my opinion' sets up your view — say it with a slight pause after. Stress 'best' and 'quickly'.",
        boldWords: ["opinion", "learning", "every", "best", "quickly"],
        type: "sentence-flow",
      },
      {
        id: "w4d4",
        title: "Day 4 — Describing Something",
        instruction: "Paint a picture with words — be expressive and clear.",
        target:
          "It was a beautiful, sunny day with a gentle breeze and bright blue sky.",
        tip: "Use adjectives expressively. Slow down on 'beautiful' and 'gentle' to let the listener visualize.",
        boldWords: ["beautiful", "sunny", "gentle", "breeze", "bright", "blue"],
        type: "sentence-flow",
      },
      {
        id: "w4d5",
        title: "Day 5 — Week 4 Challenge",
        instruction: "Combine everything — speak fluently and confidently!",
        target:
          "Every day I practise English pronunciation for at least fifteen minutes and I can feel myself improving.",
        tip: "Natural pace, clear stress, smooth linking. This is your confidence builder — speak like you mean it!",
        boldWords: [
          "Every",
          "practise",
          "pronunciation",
          "fifteen",
          "improving",
        ],
        type: "sentence-flow",
      },
    ],
  },
];

const TYPE_LABELS: Record<string, string> = {
  "tongue-twister": "Tongue Twister",
  "word-stress": "Word Stress",
  "minimal-pairs": "Minimal Pairs",
  "sentence-flow": "Sentence Flow",
  "listen-repeat": "Listen & Repeat",
};

function highlightWords(sentence: string, boldWords: string[]) {
  const parts = sentence.split(" ");
  return parts.map((word, i) => {
    const clean = word.replace(/[.,!?]/g, "");
    const isBold = boldWords.some(
      (b) => b.toLowerCase() === clean.toLowerCase(),
    );
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: word fragments need positional keys
      <span key={`w-${word}-${i}`}>
        {i > 0 ? " " : ""}
        {isBold ? (
          <strong className="text-primary underline decoration-dotted">
            {word}
          </strong>
        ) : (
          word
        )}
      </span>
    );
  });
}

function scoreSpeech(target: string, spoken: string): number {
  const targetWords = target
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .split(" ");
  const spokenWords = spoken
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .split(" ");
  const hits = targetWords.filter((w) => spokenWords.includes(w)).length;
  return Math.round((hits / targetWords.length) * 100);
}

interface Props {
  lesson: number;
  onComplete: (score: number, total: number) => void;
}

export function PronunciationModule({ onComplete }: Props) {
  const STORAGE_KEY = "classio_pronunciation_progress";
  const [completedTasks, setCompletedTasks] = useState<Record<string, number>>(
    () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
      } catch {
        return {};
      }
    },
  );

  const allWeeks = WEEKLY_PLAN;
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState<DayTask | null>(null);

  // Task execution state
  const [phase, setPhase] = useState<"intro" | "practice" | "done">("intro");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [taskScore, setTaskScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [recordingSupported, setRecordingSupported] = useState(true);

  const week = allWeeks[selectedWeek];

  const isTaskDone = (taskId: string) => (completedTasks[taskId] ?? 0) > 0;
  const getTaskScore = (taskId: string) => completedTasks[taskId] ?? 0;

  const totalDone = Object.keys(completedTasks).length;
  const totalTasks = allWeeks.reduce((a, w) => a + w.days.length, 0);
  const overallPct = Math.round((totalDone / totalTasks) * 100);

  const getWeekProgress = (w: WeekPlan) => {
    const done = w.days.filter((d) => isTaskDone(d.id)).length;
    return Math.round((done / w.days.length) * 100);
  };

  const isWeekUnlocked = (weekIdx: number) => {
    if (weekIdx === 0) return true;
    return getWeekProgress(allWeeks[weekIdx - 1]) >= 60;
  };

  const isDayUnlocked = (dayIdx: number) => {
    if (dayIdx === 0) return true;
    const prevDay = week.days[dayIdx - 1];
    return isTaskDone(prevDay.id);
  };

  const openTask = (task: DayTask) => {
    setSelectedDay(task);
    setPhase("intro");
    setTranscript("");
    setTaskScore(null);
    setAttempts(0);
  };

  const speak = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const startRecording = () => {
    if (!selectedDay) return;
    try {
      const SR =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SR) {
        setRecordingSupported(false);
        return;
      }
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";
      setIsRecording(true);
      setTranscript("");
      setTaskScore(null);
      rec.onresult = (e: any) => {
        const t = e.results[0][0].transcript;
        setTranscript(t);
        const score = scoreSpeech(selectedDay.target, t);
        setTaskScore(score);
        setAttempts((a) => a + 1);
      };
      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
      rec.start();
    } catch {
      setRecordingSupported(false);
    }
  };

  const completeTask = () => {
    if (!selectedDay) return;
    const finalScore = taskScore ?? 50;
    const updated = { ...completedTasks, [selectedDay.id]: finalScore };
    setCompletedTasks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setPhase("done");
  };

  const finishAndReturn = () => {
    const scores = Object.values(completedTasks);
    const avg =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 50;
    onComplete(avg, 100);
    setSelectedDay(null);
    setPhase("intro");
  };

  // ---- Task Detail View ----
  if (selectedDay) {
    const colorMap: Record<string, string> = {
      cyan: "bg-cyan-50 border-cyan-200 text-cyan-800",
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      purple: "bg-purple-50 border-purple-200 text-purple-800",
      green: "bg-green-50 border-green-200 text-green-800",
    };
    const accent = colorMap[week.color] ?? colorMap.cyan;

    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => setSelectedDay(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Week {week.week}
        </button>

        <div className={`rounded-2xl border p-4 ${accent}`}>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="text-xs bg-white/60 text-current border-current/30">
              {TYPE_LABELS[selectedDay.type]}
            </Badge>
          </div>
          <h2 className="font-bold text-lg">{selectedDay.title}</h2>
          <p className="text-sm mt-1 opacity-80">{selectedDay.instruction}</p>
        </div>

        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-5">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  Target Sentence
                </p>
                <p className="text-xl font-bold text-foreground leading-relaxed">
                  {highlightWords(selectedDay.target, selectedDay.boldWords)}
                </p>
              </div>

              <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">
                <p className="text-xs font-bold text-yellow-800 mb-1">💡 Tip</p>
                <p className="text-sm text-yellow-700">{selectedDay.tip}</p>
              </div>

              <Button
                onClick={() => {
                  speak(selectedDay.target);
                }}
                variant="outline"
                className="w-full gap-2"
              >
                <Play className="h-4 w-4" /> Listen to Model Pronunciation
              </Button>

              <Button
                onClick={() => setPhase("practice")}
                className="w-full gradient-cyan text-primary-foreground py-3 text-base"
              >
                Start Practice →
              </Button>
            </motion.div>
          )}

          {phase === "practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4">
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {selectedDay.target}
                </p>
              </div>

              <Button
                onClick={() => speak(selectedDay.target)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Play className="h-3.5 w-3.5" /> Hear it again
              </Button>

              {!recordingSupported ? (
                <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 text-center">
                  <p className="text-orange-700 font-medium">
                    Recording not supported in this browser.
                  </p>
                  <p className="text-orange-600 text-sm mt-1">
                    Use Chrome for full functionality. You can still mark this
                    task done.
                  </p>
                  <Button
                    onClick={completeTask}
                    className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Mark as Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={startRecording}
                    disabled={isRecording}
                    className={`w-full gap-2 py-4 text-base font-semibold ${
                      isRecording
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                    {isRecording
                      ? "🔴 Recording... Speak now!"
                      : "🎤 Tap to Record Your Voice"}
                  </Button>

                  {attempts > 0 && (
                    <Badge className="bg-secondary text-muted-foreground">
                      {attempts} attempt{attempts > 1 ? "s" : ""}
                    </Badge>
                  )}

                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-border bg-white p-4 space-y-2"
                    >
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Your Speech
                      </p>
                      <p className="text-foreground italic">"{transcript}"</p>
                      {taskScore !== null && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${taskScore}%`,
                                background:
                                  taskScore >= 70
                                    ? "#22c55e"
                                    : taskScore >= 45
                                      ? "#f59e0b"
                                      : "#ef4444",
                              }}
                            />
                          </div>
                          <Badge
                            className={
                              taskScore >= 70
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-orange-100 text-orange-700 border-orange-300"
                            }
                          >
                            {taskScore}% match
                          </Badge>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {taskScore !== null && (
                    <div className="flex gap-2">
                      <Button
                        onClick={startRecording}
                        variant="outline"
                        className="flex-1"
                      >
                        Try Again
                      </Button>
                      <Button
                        onClick={completeTask}
                        className={`flex-1 ${taskScore >= 70 ? "bg-green-600 hover:bg-green-700 text-white" : "gradient-cyan text-primary-foreground"}`}
                      >
                        {taskScore >= 70
                          ? "✓ Complete Task"
                          : "Mark Done & Continue"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="rounded-2xl bg-green-50 border border-green-200 p-6 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold text-green-800">
                  {selectedDay.title} — Done!
                </h3>
                {taskScore !== null && (
                  <p className="text-green-700 text-sm">
                    Your pronunciation match: <strong>{taskScore}%</strong>
                  </p>
                )}
              </div>

              <Button
                onClick={() => setSelectedDay(null)}
                className="w-full gradient-cyan text-primary-foreground"
              >
                Back to Week Plan
              </Button>

              <Button
                onClick={finishAndReturn}
                variant="outline"
                className="w-full"
              >
                Save Progress & Exit Module
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ---- Weekly Plan View ----
  const weekColorClasses: Record<
    string,
    { header: string; ring: string; progress: string; badge: string }
  > = {
    cyan: {
      header: "from-cyan-500 to-cyan-600",
      ring: "ring-cyan-300",
      progress: "bg-cyan-500",
      badge: "bg-cyan-100 text-cyan-700 border-cyan-300",
    },
    blue: {
      header: "from-blue-500 to-blue-600",
      ring: "ring-blue-300",
      progress: "bg-blue-500",
      badge: "bg-blue-100 text-blue-700 border-blue-300",
    },
    purple: {
      header: "from-purple-500 to-purple-600",
      ring: "ring-purple-300",
      progress: "bg-purple-500",
      badge: "bg-purple-100 text-purple-700 border-purple-300",
    },
    green: {
      header: "from-green-500 to-green-600",
      ring: "ring-green-300",
      progress: "bg-green-500",
      badge: "bg-green-100 text-green-700 border-green-300",
    },
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-bold text-foreground">
              Pronunciation Scoring Engine
            </p>
            <p className="text-sm text-muted-foreground">
              4-Week Daily Practice Program
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{overallPct}%</p>
            <p className="text-xs text-muted-foreground">
              {totalDone}/{totalTasks} tasks done
            </p>
          </div>
        </div>
        <div className="w-full bg-white rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            className="h-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
          />
        </div>
      </div>

      {/* Week Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {allWeeks.map((w, idx) => {
          const locked = !isWeekUnlocked(idx);
          const pct = getWeekProgress(w);
          const colors = weekColorClasses[w.color];
          return (
            <button
              key={w.week}
              type="button"
              disabled={locked}
              onClick={() => setSelectedWeek(idx)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                selectedWeek === idx
                  ? `bg-gradient-to-r ${colors.header} text-white border-transparent ring-2 ${colors.ring}`
                  : locked
                    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-foreground border-border hover:border-primary"
              }`}
            >
              {locked ? <Lock className="h-3.5 w-3.5 inline mr-1" /> : null}
              Week {w.week}
              {pct === 100 && (
                <CheckCircle2 className="h-3.5 w-3.5 inline ml-1 text-green-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Week Header */}
      <div
        className={`rounded-2xl bg-gradient-to-r ${weekColorClasses[week.color].header} p-5 text-white`}
      >
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
          Week {week.week}
        </p>
        <h2 className="text-xl font-bold mt-0.5">{week.theme}</h2>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 bg-white/20 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-white transition-all"
              style={{ width: `${getWeekProgress(week)}%` }}
            />
          </div>
          <span className="text-sm font-semibold">
            {getWeekProgress(week)}%
          </span>
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="space-y-3">
        {week.days.map((task, dayIdx) => {
          const done = isTaskDone(task.id);
          const locked = !isDayUnlocked(dayIdx);
          const score = getTaskScore(task.id);
          const colors = weekColorClasses[week.color];

          return (
            <motion.button
              key={task.id}
              type="button"
              disabled={locked}
              onClick={() => !locked && openTask(task)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: dayIdx * 0.07 }}
              className={`w-full text-left rounded-2xl border p-4 transition-all ${
                done
                  ? "bg-green-50 border-green-200"
                  : locked
                    ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                    : "bg-white border-border hover:border-primary hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    done
                      ? "bg-green-100"
                      : locked
                        ? "bg-gray-100"
                        : `bg-gradient-to-br ${colors.header}`
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : locked ? (
                    <Lock className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Mic className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm ${locked ? "text-gray-400" : done ? "text-green-800" : "text-foreground"}`}
                  >
                    {task.title}
                  </p>
                  <p
                    className={`text-xs mt-0.5 truncate ${locked ? "text-gray-400" : "text-muted-foreground"}`}
                  >
                    {task.instruction}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {done && (
                    <Badge className={`text-xs ${colors.badge}`}>
                      {score}%
                    </Badge>
                  )}
                  {!locked && !done && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {done && (
                <div className="mt-2 ml-13 pl-13">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                    <div
                      className="h-1.5 rounded-full bg-green-400"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {getWeekProgress(week) === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-green-50 border border-green-200 p-5 text-center space-y-3"
        >
          <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
          <p className="font-bold text-green-800">Week {week.week} Complete!</p>
          {selectedWeek < allWeeks.length - 1 ? (
            <Button
              onClick={() => setSelectedWeek(selectedWeek + 1)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Go to Week {week.week + 1} →
            </Button>
          ) : (
            <Button
              onClick={finishAndReturn}
              className="gradient-cyan text-primary-foreground"
            >
              Complete Pronunciation Module 🎉
            </Button>
          )}
        </motion.div>
      )}

      <Button onClick={finishAndReturn} variant="outline" className="w-full">
        Save Progress & Exit
      </Button>
    </div>
  );
}
