import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ChevronRight, Mic, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  lesson?: number;
  grade?: number;
  onComplete: (score: number, total: number) => void;
  onBack?: () => void;
};

const SENTENCES_BY_GRADE: Record<string, string[]> = {
  easy: [
    "The cat sat on the mat.",
    "I like to play outside.",
    "She has a red ball.",
    "We eat lunch at noon.",
    "Dogs are friendly animals.",
  ],
  medium: [
    "The library has thousands of books.",
    "We should always be kind to others.",
    "She enjoys reading adventure stories.",
    "The weather changes every season.",
    "Learning English opens many doors.",
  ],
  hard: [
    "Effective communication requires both speaking and listening.",
    "The industrial revolution transformed modern society.",
    "Scientists are exploring renewable energy solutions.",
    "Literature reflects the values of its time.",
    "Critical thinking is essential for problem solving.",
  ],
};

const FEEDBACK_OPTIONS = [
  {
    label: "Excellent match!",
    accuracy: "96%",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
  },
  {
    label: "Great match!",
    accuracy: "92%",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
  },
  {
    label: "Good attempt!",
    accuracy: "85%",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  {
    label: "Nice try!",
    accuracy: "78%",
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
  },
  {
    label: "Keep practicing!",
    accuracy: "71%",
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
  },
];

const WAVE_BARS = [
  { key: "w1", height: 32 },
  { key: "w2", height: 48 },
  { key: "w3", height: 40 },
  { key: "w4", height: 48 },
  { key: "w5", height: 32 },
];

export function ShadowingModule({ grade = 1, onComplete }: Props) {
  const sentences =
    grade <= 4
      ? SENTENCES_BY_GRADE.easy
      : grade <= 7
        ? SENTENCES_BY_GRADE.medium
        : SENTENCES_BY_GRADE.hard;
  const total = sentences.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<
    "idle" | "playing" | "recording" | "feedback" | "done"
  >("idle");
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<
    (typeof FEEDBACK_OPTIONS)[number] | null
  >(null);
  const [scores, setScores] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const playAudio = () => {
    setPhase("playing");
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(sentences[currentIdx]);
      utter.rate = 0.85;
      utter.onend = () => setPhase("idle");
      window.speechSynthesis.speak(utter);
    } else {
      timerRef.current = setTimeout(() => setPhase("idle"), 2000);
    }
  };

  const startRecording = () => {
    setPhase("recording");
    setAttempts((prev) => ({
      ...prev,
      [currentIdx]: (prev[currentIdx] ?? 0) + 1,
    }));
    timerRef.current = setTimeout(() => {
      const fb =
        FEEDBACK_OPTIONS[Math.floor(Math.random() * FEEDBACK_OPTIONS.length)];
      setFeedback(fb);
      const accuracyNum = Number.parseInt(fb.accuracy);
      setScores((prev) => {
        const next = [...prev];
        next[currentIdx] = accuracyNum;
        return next;
      });
      setPhase("feedback");
    }, 3000);
  };

  const nextSentence = () => {
    if (currentIdx + 1 >= total) {
      setPhase("done");
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase("idle");
      setFeedback(null);
    }
  };

  const finalScore = scores.reduce((a, b) => a + b, 0);
  const avgAccuracy =
    scores.length > 0 ? Math.round(finalScore / scores.length) : 0;

  if (phase === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-bold text-green-700">
              Shadowing Complete!
            </h2>
            <p className="text-muted-foreground">
              You shadowed all {total} sentences this session
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {avgAccuracy}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Avg Accuracy
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{total}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Sentences
                </div>
              </div>
            </div>
            <Button
              data-ocid="shadowing.complete.primary_button"
              onClick={() => onComplete(avgAccuracy, 100)}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white"
            >
              Complete Lesson
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <style>{`
        @keyframes waveBar {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .wave-bar { animation: waveBar 0.6s ease-in-out infinite; transform-origin: bottom; }
        .wave-bar:nth-child(1) { animation-delay: 0s; }
        .wave-bar:nth-child(2) { animation-delay: 0.12s; }
        .wave-bar:nth-child(3) { animation-delay: 0.24s; }
        .wave-bar:nth-child(4) { animation-delay: 0.12s; }
        .wave-bar:nth-child(5) { animation-delay: 0s; }
      `}</style>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Sentence {currentIdx + 1} of {total}
        </span>
        <div className="flex gap-1">
          {sentences.map((sentence, i) => (
            <div
              key={sentence.slice(0, 10)}
              className={`w-6 h-1.5 rounded-full transition-colors ${
                i < currentIdx
                  ? "bg-green-500"
                  : i === currentIdx
                    ? "bg-amber-500"
                    : "bg-secondary"
              }`}
              aria-label={`Sentence ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
              Listen &amp; Shadow
            </CardTitle>
            {(attempts[currentIdx] ?? 0) > 0 && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                Attempt {attempts[currentIdx]}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-xl font-semibold text-center text-foreground leading-relaxed py-4 px-2">
            &ldquo;{sentences[currentIdx]}&rdquo;
          </p>

          <AnimatePresence>
            {phase === "recording" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-end justify-center gap-1.5 h-12"
              >
                {WAVE_BARS.map((bar) => (
                  <div
                    key={bar.key}
                    className="wave-bar w-3 rounded-full bg-red-500"
                    style={{ height: bar.height }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "feedback" && feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`rounded-xl border p-4 flex items-center gap-3 ${feedback.bg}`}
              >
                <CheckCircle className={`h-5 w-5 ${feedback.color}`} />
                <div>
                  <p className={`font-semibold ${feedback.color}`}>
                    {feedback.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Accuracy: {feedback.accuracy}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-3">
            {phase !== "recording" && phase !== "feedback" && (
              <Button
                data-ocid="shadowing.play.button"
                onClick={playAudio}
                disabled={phase === "playing"}
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 gap-2"
              >
                <Play className="h-4 w-4" />
                {phase === "playing" ? "Playing..." : "Play Audio"}
              </Button>
            )}

            {phase !== "recording" && phase !== "feedback" && (
              <Button
                data-ocid="shadowing.record.button"
                onClick={startRecording}
                className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 py-6 text-base"
              >
                <Mic className="h-5 w-5" />
                Tap to Record &amp; Shadow
              </Button>
            )}

            {phase === "recording" && (
              <div className="text-center">
                <p className="text-sm font-medium text-red-600 animate-pulse">
                  🎙️ Recording... speak now!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mimicking the sentence...
                </p>
              </div>
            )}

            {phase === "feedback" && (
              <Button
                data-ocid="shadowing.next.button"
                onClick={nextSentence}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white gap-2"
              >
                {currentIdx + 1 >= total ? "See Results" : "Next Sentence"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground">
        💡 Tip: Listen carefully first, then record yourself saying the same
        sentence with the same rhythm.
      </p>
    </div>
  );
}
