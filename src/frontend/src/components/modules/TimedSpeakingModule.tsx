import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Timer } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  lesson?: number;
  grade?: number;
  onComplete: (score: number, total: number) => void;
};

const TOPICS_EASY = [
  "Talk about your favourite animal.",
  "Describe your home or bedroom.",
  "What is your favourite game to play?",
  "Tell us about your family members.",
  "Describe your favourite food.",
];

const TOPICS_MEDIUM = [
  "Talk about your favourite hobby and how you got started.",
  "Describe a memorable trip or outing you went on.",
  "What is your favourite subject in school and why?",
  "Talk about a person you admire and why they inspire you.",
  "Describe a challenge you overcame and what you learned.",
];

const TOPICS_HARD = [
  "Discuss the impact of technology on modern education.",
  "How can young people help solve environmental challenges?",
  "What qualities make a great leader? Give examples.",
  "Should schools have more practical classes? Argue your point.",
  "How does social media influence our self-perception and identity?",
];

const WAVE_BARS = [
  { key: "w1", h: 24 },
  { key: "w2", h: 40 },
  { key: "w3", h: 48 },
  { key: "w4", h: 40 },
  { key: "w5", h: 24 },
  { key: "w6", h: 36 },
  { key: "w7", h: 48 },
];

const DURATION = 30;

export function TimedSpeakingModule({
  lesson = 1,
  grade = 1,
  onComplete,
}: Props) {
  const topicsPool =
    grade <= 4 ? TOPICS_EASY : grade <= 7 ? TOPICS_MEDIUM : TOPICS_HARD;
  const topic = topicsPool[(lesson - 1) % topicsPool.length];

  const [phase, setPhase] = useState<"idle" | "countdown" | "results">("idle");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [wpm, setWpm] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  const startChallenge = () => {
    setPhase("countdown");
    setTimeLeft(DURATION);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          const words = Math.floor(Math.random() * 41) + 40;
          const speed = Math.round((words / DURATION) * 60);
          setWordCount(words);
          setWpm(speed);
          setPhase("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const score = wpm >= 60 ? 5 : wpm >= 40 ? 4 : wpm >= 25 ? 3 : 2;
  const scoreLabel =
    wpm >= 60
      ? "Excellent"
      : wpm >= 40
        ? "Good"
        : wpm >= 25
          ? "Fair"
          : "Needs Practice";
  const scoreColor =
    wpm >= 60
      ? "text-green-600"
      : wpm >= 40
        ? "text-blue-600"
        : wpm >= 25
          ? "text-yellow-600"
          : "text-red-600";
  const tip =
    wpm >= 60
      ? "Outstanding fluency! Try a more complex topic next time."
      : wpm >= 40
        ? "Good pace! Work on using more connectors and examples."
        : wpm >= 25
          ? "Decent start. Practice brainstorming before you speak."
          : "Tip: Prepare 3 key points mentally before starting the timer.";

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / DURATION) * circumference;

  return (
    <div className="space-y-5">
      <style>{`
        @keyframes waveBarRed {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .wave-bar-red { animation: waveBarRed 0.55s ease-in-out infinite; transform-origin: bottom; }
        .wave-bar-red:nth-child(1) { animation-delay: 0s; }
        .wave-bar-red:nth-child(2) { animation-delay: 0.08s; }
        .wave-bar-red:nth-child(3) { animation-delay: 0.16s; }
        .wave-bar-red:nth-child(4) { animation-delay: 0.24s; }
        .wave-bar-red:nth-child(5) { animation-delay: 0.16s; }
        .wave-bar-red:nth-child(6) { animation-delay: 0.08s; }
        .wave-bar-red:nth-child(7) { animation-delay: 0s; }
      `}</style>

      <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-red-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-rose-700 uppercase tracking-wide flex items-center gap-2">
              <Timer className="h-4 w-4" /> Timed Speaking Challenge
            </CardTitle>
            <Badge className="bg-rose-100 text-rose-700 border-rose-200 text-xs">
              30 seconds
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-xl bg-white border border-rose-100 p-4">
            <p className="text-base font-semibold text-center text-foreground leading-relaxed">
              🎯 {topic}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <p className="text-sm text-center text-muted-foreground">
                  When you tap Start, a 30-second timer begins. Speak about the
                  topic without stopping!
                </p>
                <Button
                  data-ocid="timed_speaking.start.button"
                  onClick={startChallenge}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white gap-2 py-6 text-base"
                >
                  <Mic className="h-5 w-5" /> Start Challenge
                </Button>
              </motion.div>
            )}

            {phase === "countdown" && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <div className="relative">
                    <svg
                      width="140"
                      height="140"
                      className="-rotate-90"
                      aria-label="Countdown timer"
                    >
                      <title>Countdown timer</title>
                      <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke="#fee2e2"
                        strokeWidth="8"
                      />
                      <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.9s linear" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-rose-600">
                        {timeLeft}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        seconds
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-center gap-1.5 h-12">
                  {WAVE_BARS.map((bar) => (
                    <div
                      key={bar.key}
                      className="wave-bar-red w-2.5 rounded-full bg-rose-500"
                      style={{ height: bar.h }}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-rose-600 animate-pulse font-medium">
                  🎙️ Recording — keep talking!
                </p>
              </motion.div>
            )}

            {phase === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-white border border-rose-100 p-3">
                    <div className="text-2xl font-bold text-foreground">
                      {wordCount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Words Spoken
                    </div>
                  </div>
                  <div className="rounded-xl bg-white border border-rose-100 p-3">
                    <div className={`text-2xl font-bold ${scoreColor}`}>
                      {wpm}
                    </div>
                    <div className="text-xs text-muted-foreground">WPM</div>
                  </div>
                  <div className="rounded-xl bg-white border border-rose-100 p-3">
                    <div className={`text-2xl font-bold ${scoreColor}`}>
                      {score}/5
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-rose-100 p-4">
                  <p className={`font-bold ${scoreColor} mb-1`}>
                    {scoreLabel}!
                  </p>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
                <Button
                  data-ocid="timed_speaking.complete.primary_button"
                  onClick={() => onComplete(score, 5)}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Complete Challenge ✓
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground">
        💡 Tip: Plan your 3 main points mentally before starting the timer.
      </p>
    </div>
  );
}
