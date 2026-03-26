import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Mic, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
  onComplete: (score: number, total: number) => void;
};

type JournalEntry = {
  week: string;
  date: string;
  prompt: string;
  duration: string;
};

const WEEKLY_PROMPTS = [
  "What was the most interesting thing you learned this week?",
  "Describe a challenge you faced this week and how you handled it.",
  "What are you most proud of accomplishing this week?",
  "Talk about someone who made you smile this week.",
  "What new English word or phrase did you use this week?",
  "Describe the best conversation you had this week.",
  "What goal did you make progress on this week?",
  "Talk about something that surprised you this week.",
  "What is one thing you want to do better next week?",
  "Describe a moment this week when you felt confident speaking English.",
  "What book, movie, or song influenced you this week?",
  "Tell us about a place you visited or wish you could visit this week.",
];

const WAVE_BARS = [
  { key: "w1", h: 24 },
  { key: "w2", h: 40 },
  { key: "w3", h: 32 },
  { key: "w4", h: 48 },
  { key: "w5", h: 32 },
  { key: "w6", h: 40 },
  { key: "w7", h: 24 },
];

function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

export function WeeklyVoiceJournalModule({ onComplete }: Props) {
  const weekNum = getWeekNumber(new Date());
  const promptIdx = weekNum % WEEKLY_PROMPTS.length;
  const thisPrompt = WEEKLY_PROMPTS[promptIdx];
  const weekLabel = `Week ${weekNum}`;

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [phase, setPhase] = useState<"idle" | "recording" | "saved">("idle");
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("classio_voice_journal");
      if (saved) setEntries(JSON.parse(saved));
    } catch {}
  }, []);

  const startRecording = () => {
    setPhase("recording");
    setTimeout(() => {
      const newEntry: JournalEntry = {
        week: weekLabel,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        prompt: thisPrompt,
        duration: "~1 min",
      };
      const existing = entries.filter((e) => e.week !== weekLabel);
      const updated = [newEntry, ...existing];
      setEntries(updated);
      localStorage.setItem("classio_voice_journal", JSON.stringify(updated));
      setPhase("saved");
    }, 5000);
  };

  const playEntry = (idx: number) => {
    setPlayingIdx(idx);
    setTimeout(() => setPlayingIdx(null), 3000);
  };

  const hasThisWeek = entries.some((e) => e.week === weekLabel);

  return (
    <div className="space-y-5">
      <style>{`
        @keyframes waveBarIndigo {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .wave-bar-indigo { animation: waveBarIndigo 0.65s ease-in-out infinite; transform-origin: bottom; }
        .wave-bar-indigo:nth-child(1) { animation-delay: 0s; }
        .wave-bar-indigo:nth-child(2) { animation-delay: 0.09s; }
        .wave-bar-indigo:nth-child(3) { animation-delay: 0.18s; }
        .wave-bar-indigo:nth-child(4) { animation-delay: 0.27s; }
        .wave-bar-indigo:nth-child(5) { animation-delay: 0.18s; }
        .wave-bar-indigo:nth-child(6) { animation-delay: 0.09s; }
        .wave-bar-indigo:nth-child(7) { animation-delay: 0s; }
        @keyframes waveBarPlay {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        .wave-bar-play { animation: waveBarPlay 0.5s ease-in-out infinite; transform-origin: bottom; }
        .wave-bar-play:nth-child(odd) { animation-delay: 0.1s; }
      `}</style>

      <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-4 flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-indigo-500 shrink-0" />
        <div>
          <p className="font-bold text-indigo-700">Your Voice Journal</p>
          <p className="text-sm text-indigo-600/80">
            {entries.length > 0
              ? `${weekLabel} of your journal — you've come a long way! 🚀`
              : "Start recording your weekly free-talk entries!"}
          </p>
        </div>
        <Badge className="ml-auto bg-indigo-100 text-indigo-700 border-indigo-200">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </Badge>
      </div>

      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">
              {weekLabel}'s Prompt
            </CardTitle>
            {hasThisWeek && (
              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                ✓ Recorded
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base font-semibold text-foreground leading-relaxed">
            🎙️ {thisPrompt}
          </p>

          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Button
                  data-ocid="voice_journal.record.button"
                  onClick={startRecording}
                  disabled={hasThisWeek}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 py-6 text-base disabled:opacity-60"
                >
                  <Mic className="h-5 w-5" />
                  {hasThisWeek
                    ? "Already recorded this week ✓"
                    : "Record This Week's Entry (1 min)"}
                </Button>
              </motion.div>
            )}

            {phase === "recording" && (
              <motion.div
                key="recording"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="flex items-end justify-center gap-1.5 h-14">
                  {WAVE_BARS.map((bar) => (
                    <div
                      key={bar.key}
                      className="wave-bar-indigo w-2.5 rounded-full bg-indigo-500"
                      style={{ height: bar.h }}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-indigo-600 animate-pulse font-medium">
                  🎙️ Recording your journal entry... speak freely!
                </p>
              </motion.div>
            )}

            {phase === "saved" && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-3"
              >
                <p className="font-bold text-green-700 text-lg">
                  ✅ Entry Saved!
                </p>
                <p className="text-sm text-muted-foreground">
                  Your {weekLabel} entry has been added to your journal. Listen
                  back to your progress anytime!
                </p>
                <Button
                  data-ocid="voice_journal.complete.primary_button"
                  onClick={() => onComplete(1, 1)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Done ✓
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-500" />
            Past Entries ({entries.length})
          </h3>
          <div className="space-y-2" data-ocid="voice_journal.list">
            {entries.map((entry, i) => (
              <motion.div
                key={`${entry.week}-${entry.date}`}
                data-ocid={`voice_journal.item.${i + 1}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-indigo-100 bg-white p-4 flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-indigo-50">
                  <Mic className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-xs">
                      {entry.week}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {entry.date}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · {entry.duration}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {entry.prompt}
                  </p>
                  {playingIdx === i && (
                    <div className="flex items-end gap-1 mt-2 h-5">
                      {[1, 2, 3, 4, 5].map((k) => (
                        <div
                          key={k}
                          className="wave-bar-play w-1.5 rounded-full bg-indigo-400"
                          style={{ height: 16 }}
                        />
                      ))}
                      <span className="text-xs text-indigo-500 ml-1">
                        Playing...
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  data-ocid={`voice_journal.play.button.${i + 1}`}
                  size="sm"
                  variant="outline"
                  onClick={() => playEntry(i)}
                  disabled={playingIdx !== null}
                  className="shrink-0 border-indigo-200 text-indigo-600 hover:bg-indigo-50 gap-1"
                >
                  <Play className="h-3 w-3" /> Play
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {hasThisWeek && phase === "idle" && (
        <Button
          data-ocid="voice_journal.complete.secondary_button"
          onClick={() => onComplete(1, 1)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Continue ✓
        </Button>
      )}
    </div>
  );
}
