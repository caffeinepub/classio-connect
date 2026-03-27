import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Flame,
  Lock,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type DayEntry = {
  day: number;
  module: string;
  task: string;
  xp: number;
  type: "practice" | "challenge" | "review" | "journal" | "discovery";
};

type WeekEntry = {
  week: number;
  focus: string;
  color: string;
  days: DayEntry[];
};

const WEEKLY_PLAN: WeekEntry[] = [
  {
    week: 1,
    focus: "Build the Habit",
    color: "cyan",
    days: [
      {
        day: 1,
        module: "Vocabulary Builder",
        task: "Learn 10 new words — Animals & Nature",
        xp: 20,
        type: "practice",
      },
      {
        day: 2,
        module: "Pronunciation Practice",
        task: "Week 1 Day 1 — /sh/ vs /s/ Sound",
        xp: 25,
        type: "practice",
      },
      {
        day: 3,
        module: "Grammar Essentials",
        task: "Present Tense — Lesson 1",
        xp: 20,
        type: "practice",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "Describe your morning routine",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Pronunciation Practice",
        task: "Week 1 Day 2 — /p/ Plosive Sound",
        xp: 25,
        type: "practice",
      },
      {
        day: 6,
        module: "Listening Skills",
        task: "Passage 1 — Comprehension",
        xp: 20,
        type: "review",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Free talk — Introduce yourself",
        xp: 40,
        type: "journal",
      },
    ],
  },
  {
    week: 2,
    focus: "Sound Like a Speaker",
    color: "blue",
    days: [
      {
        day: 1,
        module: "Pronunciation Practice",
        task: "Week 1 Day 3 — Word Stress Patterns",
        xp: 25,
        type: "practice",
      },
      {
        day: 2,
        module: "Shadowing Practice",
        task: "Shadow Sentence 1 — Daily Life",
        xp: 30,
        type: "practice",
      },
      {
        day: 3,
        module: "Vocabulary Builder",
        task: "Learn 10 words — Food & Drink",
        xp: 20,
        type: "practice",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "Talk about your favourite food",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Pronunciation Practice",
        task: "Week 1 Day 4 — /w/ vs /v/ Sound",
        xp: 25,
        type: "practice",
      },
      {
        day: 6,
        module: "Reading Comprehension",
        task: "Read Passage 1 — School Life",
        xp: 20,
        type: "review",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Talk about your favourite food",
        xp: 40,
        type: "journal",
      },
    ],
  },
  {
    week: 3,
    focus: "Listen & Understand",
    color: "purple",
    days: [
      {
        day: 1,
        module: "Pronunciation Practice",
        task: "Week 1 Day 5 — /r/ vs /l/ Sound",
        xp: 25,
        type: "practice",
      },
      {
        day: 2,
        module: "Listening Skills",
        task: "Passage 2 — In the Market",
        xp: 20,
        type: "practice",
      },
      {
        day: 3,
        module: "Grammar Essentials",
        task: "Past Tense — Lesson 2",
        xp: 20,
        type: "practice",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "Describe what you see outside",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Pronunciation Practice",
        task: "Week 2 Day 1 — Natural Contractions",
        xp: 25,
        type: "practice",
      },
      {
        day: 6,
        module: "Word of the Day",
        task: "Learn + Use: Eloquent",
        xp: 20,
        type: "review",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Talk about your school or work",
        xp: 40,
        type: "journal",
      },
    ],
  },
  {
    week: 4,
    focus: "Build Vocabulary",
    color: "amber",
    days: [
      {
        day: 1,
        module: "Vocabulary Builder",
        task: "Learn 10 words — Travel & Places",
        xp: 20,
        type: "practice",
      },
      {
        day: 2,
        module: "Pronunciation Practice",
        task: "Week 2 Day 2 — Rising Intonation",
        xp: 25,
        type: "practice",
      },
      {
        day: 3,
        module: "Shadowing Practice",
        task: "Shadow Sentence 2 — At the Shop",
        xp: 30,
        type: "practice",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "Tell us about your best friend",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Pronunciation Practice",
        task: "Week 2 Day 3 — Falling Intonation",
        xp: 25,
        type: "practice",
      },
      {
        day: 6,
        module: "Word of the Day",
        task: "Learn + Use: Persistent",
        xp: 20,
        type: "review",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Describe a place you love",
        xp: 40,
        type: "journal",
      },
    ],
  },
  {
    week: 5,
    focus: "Real Conversations",
    color: "green",
    days: [
      {
        day: 1,
        module: "Conversation Practice",
        task: "Chat with AI Avatar — Greetings",
        xp: 35,
        type: "challenge",
      },
      {
        day: 2,
        module: "Pronunciation Practice",
        task: "Week 2 Day 4 — Linking Words",
        xp: 25,
        type: "practice",
      },
      {
        day: 3,
        module: "Fill-in-the-Conversation",
        task: "Dialogue: At the Doctor",
        xp: 30,
        type: "practice",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "What did you do yesterday?",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Pronunciation Practice",
        task: "Week 2 Day 5 — Sentence Rhythm Review",
        xp: 25,
        type: "practice",
      },
      {
        day: 6,
        module: "Reading Comprehension",
        task: "Read Passage 2 — Market Day",
        xp: 20,
        type: "review",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Talk about a hobby you enjoy",
        xp: 40,
        type: "journal",
      },
    ],
  },
  {
    week: 6,
    focus: "Picture & Describe",
    color: "rose",
    days: [
      {
        day: 1,
        module: "Picture Speaking",
        task: "Describe: Busy Classroom Scene",
        xp: 30,
        type: "practice",
      },
      {
        day: 2,
        module: "Pronunciation Practice",
        task: "Week 3 Day 1 — Long /iː/ vs Short /ɪ/",
        xp: 25,
        type: "practice",
      },
      {
        day: 3,
        module: "Vocabulary Builder",
        task: "Learn 10 words — Emotions & Feelings",
        xp: 20,
        type: "practice",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "Describe your favourite season",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Pronunciation Practice",
        task: "Week 3 Day 2 — /æ/ vs /ʌ/ Sound",
        xp: 25,
        type: "practice",
      },
      {
        day: 6,
        module: "AI Roleplay",
        task: "Roleplay: Ordering Food at a Restaurant",
        xp: 35,
        type: "challenge",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Describe your dream job",
        xp: 40,
        type: "journal",
      },
    ],
  },
  {
    week: 7,
    focus: "Grammar in Use",
    color: "teal",
    days: [
      {
        day: 1,
        module: "Grammar Essentials",
        task: "Future Tense — Lesson 1",
        xp: 20,
        type: "practice",
      },
      {
        day: 2,
        module: "Pronunciation Practice",
        task: "Week 3 Day 3 — /ɒ/ vs /ɔː/ Sound",
        xp: 25,
        type: "practice",
      },
      {
        day: 3,
        module: "Fill-in-the-Conversation",
        task: "Dialogue: Job Interview",
        xp: 30,
        type: "practice",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "Talk about a challenge you faced",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Pronunciation Practice",
        task: "Week 3 Day 4 — Diphthongs /eɪ/ and /aɪ/",
        xp: 25,
        type: "practice",
      },
      {
        day: 6,
        module: "Listening Skills",
        task: "Passage 3 — At the Airport",
        xp: 20,
        type: "review",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Talk about someone who inspires you",
        xp: 40,
        type: "journal",
      },
    ],
  },
  {
    week: 8,
    focus: "Fluency & Confidence",
    color: "indigo",
    days: [
      {
        day: 1,
        module: "Timed Speaking Challenge",
        task: "Speak 30s: Your School or Workplace",
        xp: 35,
        type: "challenge",
      },
      {
        day: 2,
        module: "Pronunciation Practice",
        task: "Week 3 Day 5 — Schwa /ə/ Sound",
        xp: 25,
        type: "practice",
      },
      {
        day: 3,
        module: "Shadowing Practice",
        task: "Shadow Sentence 3 — Travel Story",
        xp: 30,
        type: "practice",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "What is your perfect day like?",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Pronunciation Practice",
        task: "Week 4 Day 1 — Greetings & Small Talk",
        xp: 25,
        type: "practice",
      },
      {
        day: 6,
        module: "Word of the Day",
        task: "Learn + Use: Ambitious",
        xp: 20,
        type: "review",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Talk about a place you have visited",
        xp: 40,
        type: "journal",
      },
    ],
  },
  {
    week: 9,
    focus: "AI & Discovery",
    color: "violet",
    days: [
      {
        day: 1,
        module: "AI Content Discovery",
        task: "Search: Daily conversation phrases",
        xp: 25,
        type: "discovery",
      },
      {
        day: 2,
        module: "Pronunciation Practice",
        task: "Week 4 Day 2 — Asking for Help",
        xp: 25,
        type: "practice",
      },
      {
        day: 3,
        module: "Conversation Practice",
        task: "Chat with AI Avatar — Making Plans",
        xp: 35,
        type: "challenge",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "Talk about a tradition in your family",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Pronunciation Practice",
        task: "Week 4 Day 3 — Expressing Opinion",
        xp: 25,
        type: "practice",
      },
      {
        day: 6,
        module: "Reading Comprehension",
        task: "Read Passage 3 — Technology Today",
        xp: 20,
        type: "review",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Talk about what you want to learn",
        xp: 40,
        type: "journal",
      },
    ],
  },
  {
    week: 10,
    focus: "Advanced Speaking",
    color: "orange",
    days: [
      {
        day: 1,
        module: "Picture Speaking",
        task: "Describe: City Market Scene",
        xp: 30,
        type: "practice",
      },
      {
        day: 2,
        module: "Pronunciation Practice",
        task: "Week 4 Day 4 — Describing Something",
        xp: 25,
        type: "practice",
      },
      {
        day: 3,
        module: "Timed Speaking Challenge",
        task: "Speak 45s: Your Favourite Hobby",
        xp: 35,
        type: "challenge",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "Describe time when you helped someone",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Pronunciation Practice",
        task: "Week 4 Day 5 — Final Challenge Sentence",
        xp: 30,
        type: "practice",
      },
      {
        day: 6,
        module: "Vocabulary Builder",
        task: "Learn 10 words — Technology & Work",
        xp: 20,
        type: "practice",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Talk about your favourite sport",
        xp: 40,
        type: "journal",
      },
    ],
  },
  {
    week: 11,
    focus: "Full Immersion",
    color: "lime",
    days: [
      {
        day: 1,
        module: "AI Roleplay",
        task: "Roleplay: At the Doctor's Office",
        xp: 35,
        type: "challenge",
      },
      {
        day: 2,
        module: "Fill-in-the-Conversation",
        task: "Dialogue: Planning a Trip",
        xp: 30,
        type: "practice",
      },
      {
        day: 3,
        module: "Shadowing Practice",
        task: "Shadow Sentence 4 — News Report",
        xp: 30,
        type: "practice",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "The most interesting thing this week",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Conversation Practice",
        task: "Chat with AI Avatar — Problem Solving",
        xp: 35,
        type: "challenge",
      },
      {
        day: 6,
        module: "Word of the Day",
        task: "Learn + Use: Resilient",
        xp: 20,
        type: "review",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Talk about a book or movie you liked",
        xp: 40,
        type: "journal",
      },
    ],
  },
  {
    week: 12,
    focus: "Fluency Finale",
    color: "gold",
    days: [
      {
        day: 1,
        module: "Timed Speaking Challenge",
        task: "Speak 60s: Describe your life goals",
        xp: 40,
        type: "challenge",
      },
      {
        day: 2,
        module: "Picture Speaking",
        task: "Describe: Celebration Scene",
        xp: 30,
        type: "practice",
      },
      {
        day: 3,
        module: "AI Roleplay",
        task: "Roleplay: Final Job Interview",
        xp: 40,
        type: "challenge",
      },
      {
        day: 4,
        module: "Daily Speaking Streak",
        task: "Your plans for the next 3 months",
        xp: 30,
        type: "challenge",
      },
      {
        day: 5,
        module: "Conversation Practice",
        task: "Chat with AI Avatar — Free Conversation",
        xp: 35,
        type: "challenge",
      },
      {
        day: 6,
        module: "AI Content Discovery",
        task: "Search: Advanced English idioms",
        xp: 25,
        type: "discovery",
      },
      {
        day: 7,
        module: "Weekly Voice Journal",
        task: "Final reflection — Your 3-month journey",
        xp: 50,
        type: "journal",
      },
    ],
  },
];

const TYPE_META: Record<string, { label: string; color: string }> = {
  practice: {
    label: "Practice",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  challenge: {
    label: "Challenge",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  review: {
    label: "Review",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  journal: {
    label: "Journal",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  discovery: {
    label: "Discovery",
    color: "bg-violet-100 text-violet-700 border-violet-200",
  },
};

const WEEK_COLORS: Record<
  string,
  { gradient: string; light: string; text: string; badge: string }
> = {
  cyan: {
    gradient: "from-cyan-500 to-cyan-600",
    light: "from-cyan-50 to-blue-50",
    text: "text-cyan-700",
    badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  blue: {
    gradient: "from-blue-500 to-blue-600",
    light: "from-blue-50 to-indigo-50",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  purple: {
    gradient: "from-purple-500 to-purple-600",
    light: "from-purple-50 to-pink-50",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
  },
  amber: {
    gradient: "from-amber-500 to-orange-500",
    light: "from-amber-50 to-orange-50",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  green: {
    gradient: "from-green-500 to-emerald-500",
    light: "from-green-50 to-emerald-50",
    text: "text-green-700",
    badge: "bg-green-100 text-green-700 border-green-200",
  },
  rose: {
    gradient: "from-rose-500 to-pink-500",
    light: "from-rose-50 to-pink-50",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
  },
  teal: {
    gradient: "from-teal-500 to-cyan-600",
    light: "from-teal-50 to-cyan-50",
    text: "text-teal-700",
    badge: "bg-teal-100 text-teal-700 border-teal-200",
  },
  indigo: {
    gradient: "from-indigo-500 to-purple-500",
    light: "from-indigo-50 to-purple-50",
    text: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  violet: {
    gradient: "from-violet-500 to-purple-600",
    light: "from-violet-50 to-purple-50",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
  },
  orange: {
    gradient: "from-orange-500 to-red-500",
    light: "from-orange-50 to-red-50",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
  },
  lime: {
    gradient: "from-lime-500 to-green-500",
    light: "from-lime-50 to-green-50",
    text: "text-lime-700",
    badge: "bg-lime-100 text-lime-700 border-lime-200",
  },
  gold: {
    gradient: "from-yellow-500 to-amber-500",
    light: "from-yellow-50 to-amber-50",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
};

const STORAGE_KEY = "classio_weekly_plan_progress";

function loadProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

type Props = { onOpenModule?: (moduleName: string) => void };

export function WeeklyLearningPlan({ onOpenModule }: Props) {
  const [completedTasks, setCompletedTasks] =
    useState<Record<string, boolean>>(loadProgress);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([0]));

  const totalTasks = WEEKLY_PLAN.reduce((a, w) => a + w.days.length, 0);
  const totalDone = Object.values(completedTasks).filter(Boolean).length;
  const totalXP = WEEKLY_PLAN.reduce(
    (a, w) =>
      a +
      w.days.reduce(
        (b, d) => b + (completedTasks[`w${w.week}d${d.day}`] ? d.xp : 0),
        0,
      ),
    0,
  );
  const maxXP = WEEKLY_PLAN.reduce(
    (a, w) => a + w.days.reduce((b, d) => b + d.xp, 0),
    0,
  );
  const overallPct = Math.round((totalDone / totalTasks) * 100);

  const getTaskKey = (week: number, day: number) => `w${week}d${day}`;

  const getWeekDone = (w: WeekEntry) =>
    w.days.filter((d) => completedTasks[getTaskKey(w.week, d.day)]).length;
  const getWeekPct = (w: WeekEntry) =>
    Math.round((getWeekDone(w) / w.days.length) * 100);
  const isWeekUnlocked = (idx: number) =>
    idx === 0 || getWeekPct(WEEKLY_PLAN[idx - 1]) >= 60;
  const isDayUnlocked = (w: WeekEntry, dayIdx: number) =>
    dayIdx === 0 || completedTasks[getTaskKey(w.week, w.days[dayIdx - 1].day)];

  const toggleTask = (week: number, day: number) => {
    const key = getTaskKey(week, day);
    const updated = { ...completedTasks, [key]: !completedTasks[key] };
    setCompletedTasks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const _toggleWeekExpand = (idx: number) => {
    const updated = new Set(expandedWeeks);
    if (updated.has(idx)) updated.delete(idx);
    else updated.add(idx);
    setExpandedWeeks(updated);
  };

  const weekInView = WEEKLY_PLAN[selectedWeek];
  const c = WEEK_COLORS[weekInView.color] ?? WEEK_COLORS.cyan;

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 p-4 text-center">
          <p className="text-2xl font-bold text-primary">{overallPct}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">Complete</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <p className="text-2xl font-bold text-orange-600">{totalDone}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Days Done</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Target className="h-4 w-4 text-purple-500" />
            <p className="text-2xl font-bold text-purple-600">{totalXP}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">XP Earned</p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="rounded-2xl bg-white border border-border p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold">12-Week Fluency Program</span>
          <span className="text-muted-foreground">
            {totalDone}/{totalTasks} tasks
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 0.8 }}
            className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          XP: {totalXP} / {maxXP} total
        </p>
      </div>

      {/* Week Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {WEEKLY_PLAN.map((w, idx) => {
          const locked = !isWeekUnlocked(idx);
          const pct = getWeekPct(w);
          const wc = WEEK_COLORS[w.color] ?? WEEK_COLORS.cyan;
          return (
            <button
              key={w.week}
              type="button"
              disabled={locked}
              onClick={() => {
                setSelectedWeek(idx);
                setExpandedWeeks(new Set([idx]));
              }}
              className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                selectedWeek === idx
                  ? `bg-gradient-to-br ${wc.gradient} text-white border-transparent shadow-md`
                  : locked
                    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-foreground border-border hover:border-primary"
              }`}
            >
              {locked ? (
                <Lock className="h-3 w-3" />
              ) : pct === 100 ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <CalendarDays className="h-3 w-3" />
              )}
              <span>W{w.week}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Week Detail */}
      <div className="space-y-4">
        <div
          className={`rounded-2xl bg-gradient-to-r ${c.gradient} p-5 text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Week {weekInView.week} of 12
              </p>
              <h2 className="text-xl font-bold mt-0.5">{weekInView.focus}</h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{getWeekPct(weekInView)}%</p>
              <p className="text-xs opacity-80">
                {getWeekDone(weekInView)}/{weekInView.days.length} days
              </p>
            </div>
          </div>
          <div className="mt-3 bg-white/20 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-white transition-all"
              style={{ width: `${getWeekPct(weekInView)}%` }}
            />
          </div>
        </div>

        {/* Daily task list */}
        <div className="space-y-2">
          {weekInView.days.map((dayEntry, dayIdx) => {
            const key = getTaskKey(weekInView.week, dayEntry.day);
            const done = completedTasks[key] ?? false;
            const locked =
              !isDayUnlocked(weekInView, dayIdx) &&
              !isWeekUnlocked(selectedWeek);
            const meta = TYPE_META[dayEntry.type];

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dayIdx * 0.06 }}
                className={`rounded-2xl border p-4 transition-all ${
                  done
                    ? "bg-green-50 border-green-200"
                    : locked
                      ? "bg-gray-50 border-gray-200 opacity-60"
                      : "bg-white border-border hover:border-primary"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Day number */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      done
                        ? "bg-green-500 text-white"
                        : locked
                          ? "bg-gray-200 text-gray-400"
                          : `bg-gradient-to-br ${c.gradient} text-white`
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : locked ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      `D${dayEntry.day}`
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-xs font-bold ${c.text}`}>
                        {dayEntry.module}
                      </p>
                      <Badge
                        className={`text-[10px] px-1.5 py-0 ${meta.color}`}
                      >
                        {meta.label}
                      </Badge>
                    </div>
                    <p
                      className={`text-sm mt-0.5 ${done ? "text-green-800 font-medium" : locked ? "text-gray-400" : "text-foreground"}`}
                    >
                      {dayEntry.task}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs font-semibold ${done ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      +{dayEntry.xp} XP
                    </span>
                    {!locked && (
                      <div className="flex gap-1">
                        {onOpenModule && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={() => onOpenModule(dayEntry.module)}
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            toggleTask(weekInView.week, dayEntry.day)
                          }
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            done
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 hover:border-primary"
                          }`}
                        >
                          {done && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {getWeekPct(weekInView) === 100 &&
          selectedWeek < WEEKLY_PLAN.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-green-50 border border-green-200 p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-green-800">
                  Week {weekInView.week} Complete!
                </p>
                <p className="text-sm text-green-700">
                  You've unlocked Week {weekInView.week + 1}
                </p>
              </div>
              <Button
                onClick={() => {
                  setSelectedWeek(selectedWeek + 1);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Week {weekInView.week + 1} →
              </Button>
            </motion.div>
          )}
      </div>
    </div>
  );
}
