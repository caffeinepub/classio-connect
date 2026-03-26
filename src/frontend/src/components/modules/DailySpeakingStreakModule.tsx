import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Mic } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  lesson?: number;
  grade?: number;
  onComplete: (score: number, total: number) => void;
};

const DAILY_SENTENCES = [
  "Describe your morning routine in 3 sentences.",
  "Talk about your favourite food and why you love it.",
  "Describe what you see outside your window right now.",
  "Tell us about your best friend and what you like about them.",
  "What did you do yesterday? Describe it in detail.",
  "Talk about a hobby you enjoy and how you learned it.",
  "Describe your school and one thing you love about it.",
  "Tell us about a book or movie you enjoyed recently.",
  "What are your plans for the weekend? Describe them.",
  "Talk about a challenge you faced and how you handled it.",
  "Describe your favourite season and what makes it special.",
  "What is your dream job and why do you want it?",
  "Talk about someone who inspires you and why.",
  "Describe a place you have visited that you loved.",
  "What is one thing you want to learn this year?",
  "Talk about a tradition in your family that you enjoy.",
  "Describe a time when you helped someone.",
  "What does a perfect day look like for you?",
  "Talk about your favourite sport and how it is played.",
  "Describe the most interesting thing you learned this week.",
];

const FEEDBACK_TIPS = [
  "Speak slowly and clearly — clarity beats speed every time.",
  "Try to use transition words: first, then, finally, however.",
  "Great attempt! Expand your sentences with 'because' and 'so'.",
  "Remember to pause naturally between ideas.",
  "Use adjectives to make your descriptions more vivid.",
  "You're improving! Try to speak for a full 30 seconds next time.",
];

const WAVE_BARS = [
  { key: "w1", height: 28 },
  { key: "w2", height: 44 },
  { key: "w3", height: 36 },
  { key: "w4", height: 44 },
  { key: "w5", height: 28 },
];

export function DailySpeakingStreakModule({ onComplete }: Props) {
  const todayIdx = new Date().getDate() % DAILY_SENTENCES.length;
  const todaySentence = DAILY_SENTENCES[todayIdx];

  const [streak, setStreak] = useState(0);
  const [phase, setPhase] = useState<"idle" | "countdown" | "done">("idle");
  const [countdown, setCountdown] = useState(3);
  const [tip, setTip] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const savedStreak = Number(
      localStorage.getItem("classio_streak_count") ?? 0,
    );
    setStreak(savedStreak);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const startRecording = () => {
    setPhase("countdown");
    setCountdown(3);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          const randomTip =
            FEEDBACK_TIPS[Math.floor(Math.random() * FEEDBACK_TIPS.length)];
          setTip(randomTip);
          const today = new Date().toDateString();
          const lastDate = localStorage.getItem("classio_streak_date") ?? "";
          let newStreak = Number(
            localStorage.getItem("classio_streak_count") ?? 0,
          );
          if (lastDate !== today) {
            newStreak += 1;
            localStorage.setItem("classio_streak_count", String(newStreak));
            localStorage.setItem("classio_streak_date", today);
            setStreak(newStreak);
          }
          setPhase("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const streakMsg =
    streak >= 30
      ? `${streak}-day streak! 👑 Champion!`
      : streak >= 7
        ? `${streak}-day streak! 🚀 Outstanding!`
        : streak >= 3
          ? `${streak}-day streak! 🔥 You're on fire!`
          : streak >= 1
            ? `${streak} day — keep going! 💪`
            : "Start your streak today! 🌱";

  return (
    <div className="space-y-5">
      <style>{`
        @keyframes waveBarOrange {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .wave-bar-orange { animation: waveBarOrange 0.6s ease-in-out infinite; transform-origin: bottom; }
        .wave-bar-orange:nth-child(1) { animation-delay: 0s; }
        .wave-bar-orange:nth-child(2) { animation-delay: 0.12s; }
        .wave-bar-orange:nth-child(3) { animation-delay: 0.24s; }
        .wave-bar-orange:nth-child(4) { animation-delay: 0.12s; }
        .wave-bar-orange:nth-child(5) { animation-delay: 0s; }
      `}</style>

      <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 flex items-center gap-4">
        <div className="p-3 bg-orange-100 rounded-xl">
          <Flame className="h-7 w-7 text-orange-500" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-orange-700 text-lg">
            {streak} Day Streak
          </p>
          <p className="text-sm text-orange-600/80">{streakMsg}</p>
        </div>
        <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-sm font-bold px-3">
          🔥 {streak}
        </Badge>
      </div>

      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-orange-700 uppercase tracking-wide">
            Today's Speaking Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-lg font-semibold text-center text-foreground leading-relaxed py-3 px-2">
            🎯 {todaySentence}
          </p>

          <AnimatePresence mode="wait">
            {phase === "countdown" && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-end justify-center gap-1.5 h-12">
                  {WAVE_BARS.map((bar) => (
                    <div
                      key={bar.key}
                      className="wave-bar-orange w-3 rounded-full bg-orange-500"
                      style={{ height: bar.height }}
                    />
                  ))}
                </div>
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center text-5xl font-bold text-orange-600"
                >
                  {countdown}
                </motion.div>
                <p className="text-center text-sm text-orange-600 animate-pulse font-medium">
                  🎙️ Recording... speak clearly!
                </p>
              </motion.div>
            )}

            {phase === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-2"
              >
                <p className="font-bold text-green-700">
                  ✅ Great job speaking today!
                </p>
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> {tip}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {phase === "idle" && (
            <Button
              data-ocid="daily_streak.record.button"
              onClick={startRecording}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2 py-6 text-base"
            >
              <Mic className="h-5 w-5" />
              Tap to Record Your Response
            </Button>
          )}

          {phase === "done" && (
            <Button
              data-ocid="daily_streak.complete.primary_button"
              onClick={() => onComplete(1, 1)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Complete Today's Challenge ✓
            </Button>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground">
        💡 Come back every day to build your speaking streak!
      </p>
    </div>
  );
}
