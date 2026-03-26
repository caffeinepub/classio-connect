import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState } from "react";

type PronLesson = { target: string; tip: string; boldWords: string[] };

const PRON_LESSONS: Record<number, PronLesson> = {
  1: {
    target: "She sells seashells by the seashore.",
    tip: "Focus on the /sh/ sound — lips slightly rounded, tongue behind teeth.",
    boldWords: ["She", "sells", "seashells", "seashore"],
  },
  2: {
    target: "The quick brown fox jumps over the lazy dog.",
    tip: "Stress content words: quick, brown, fox, jumps, lazy, dog.",
    boldWords: ["quick", "brown", "fox", "jumps", "lazy", "dog"],
  },
  3: {
    target: "Peter Piper picked a peck of pickled peppers.",
    tip: "Focus on /p/ sound — lips pressed together then released with a small puff of air. Repeat slowly at first, then speed up.",
    boldWords: ["Peter", "Piper", "picked", "peck", "pickled", "peppers"],
  },
  4: {
    target: "How much wood would a woodchuck chuck?",
    tip: "Practice the /w/ sound — round your lips before speaking. The /oo/ sound in 'wood' and 'would' is the same — a short /ʊ/ sound.",
    boldWords: ["wood", "would", "woodchuck", "chuck"],
  },
  5: {
    target: "Red lorry, yellow lorry, red lorry, yellow lorry.",
    tip: "Alternate /r/ and /l/ sounds clearly. For /r/, your tongue does not touch the roof of the mouth. For /l/, the tip of the tongue touches just behind the top teeth.",
    boldWords: ["Red", "lorry", "yellow"],
  },
  6: {
    target: "Can you can a can as a canner can can a can?",
    tip: "Focus on the clear /k/ sound at the start and the short /æ/ vowel in 'can'. Say each word distinctly — do not swallow the endings.",
    boldWords: ["Can", "can", "canner"],
  },
};

function highlightWords(sentence: string, boldWords: string[]) {
  const parts = sentence.split(" ");
  return parts.map((word, i) => {
    const clean = word.replace(/[.,!?]/g, "");
    const isBold = boldWords.some(
      (b) => b.toLowerCase() === clean.toLowerCase(),
    );
    return (
      <span key={`word-${i}-${word}`}>
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

interface Props {
  lesson: number;
  onComplete: (score: number, total: number) => void;
}

export function PronunciationModule({ lesson, onComplete }: Props) {
  const data = PRON_LESSONS[lesson] ?? PRON_LESSONS[1];
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSupported, setRecordingSupported] = useState(true);
  const [similarity, setSimilarity] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState("read");
  const [practiceCount, setPracticeCount] = useState(0);

  const speak = () => {
    try {
      const u = new SpeechSynthesisUtterance(data.target);
      u.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const startRecording = () => {
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
      setSimilarity(null);
      rec.onresult = (e: any) => {
        const t = e.results[0][0].transcript;
        setTranscript(t);
        const targetWords = data.target
          .toLowerCase()
          .replace(/[.,!?]/g, "")
          .split(" ");
        const spokenWords = t
          .toLowerCase()
          .replace(/[.,!?]/g, "")
          .split(" ");
        const hits = targetWords.filter((w: string) =>
          spokenWords.includes(w),
        ).length;
        const pct = hits / targetWords.length;
        if (pct >= 0.7) {
          setSimilarity("great");
          setScore(1);
        } else {
          setSimilarity("try");
        }
        setPracticeCount((p) => p + 1);
      };
      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
      rec.start();
    } catch {
      setRecordingSupported(false);
    }
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-4"
      >
        <div className="text-6xl">🎤</div>
        <h3 className="text-2xl font-bold">Pronunciation Done!</h3>
        <p className="text-muted-foreground">Great practice session!</p>
        <Button
          data-ocid="pronunciation.complete.primary_button"
          onClick={() => onComplete(score, 1)}
          className="gradient-cyan text-primary-foreground px-8 text-base py-3"
        >
          Complete Lesson 🎉
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5">
        <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-2">
          Target Sentence
        </p>
        <p className="text-xl font-bold text-cyan-900 leading-relaxed">
          {data.target}
        </p>
      </div>

      {/* Prominent Record Button at the top */}
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🎙️</span>
          <p className="font-bold text-red-800">Practice Recording</p>
          {practiceCount > 0 && (
            <Badge className="bg-green-100 text-green-700 border-green-300 ml-auto">
              {practiceCount} attempt{practiceCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <p className="text-sm text-red-700">
          Say the sentence above and get instant feedback on your pronunciation.
        </p>
        {!recordingSupported ? (
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 text-center">
            <p className="text-orange-700 font-medium">
              Recording not supported in this browser.
            </p>
            <p className="text-orange-600 text-sm mt-1">
              Please try on Chrome for full functionality.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              data-ocid="pronunciation.record.button"
              onClick={startRecording}
              disabled={isRecording}
              className={`w-full gap-2 py-3 text-base font-semibold ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {isRecording
                ? "🔴 Recording... Speak now!"
                : "🎤 Tap to Record Your Voice"}
            </Button>
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-white p-4 space-y-2"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Your Speech
                </p>
                <p className="text-foreground italic">"{transcript}"</p>
                {similarity && (
                  <Badge
                    className={
                      similarity === "great"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-orange-100 text-orange-700 border-orange-300"
                    }
                  >
                    {similarity === "great"
                      ? "🎉 Great match! Keep it up!"
                      : "🔄 Try again — you can do it!"}
                  </Badge>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="read" className="flex-1">
            📖 Read
          </TabsTrigger>
          <TabsTrigger value="listen" className="flex-1">
            🎹 Listen
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex-1">
            💡 Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="read" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Read aloud
            </p>
            <p className="text-lg leading-relaxed">
              {highlightWords(data.target, data.boldWords)}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="listen" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-border bg-white p-6 text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              Listen to the sentence and follow along
            </p>
            <p className="text-lg italic text-foreground">"{data.target}"</p>
            <Button
              data-ocid="pronunciation.play.button"
              onClick={speak}
              className="gap-2 gradient-cyan text-primary-foreground px-8"
            >
              ▶ Play Sentence
            </Button>
            <p className="text-xs text-muted-foreground">
              You can replay as many times as you need
            </p>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 space-y-2">
            <p className="text-sm font-bold text-yellow-800">
              💡 Pronunciation Tips
            </p>
            <p className="text-sm text-yellow-700 leading-relaxed">
              {data.tip}
            </p>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside mt-2">
              <li>Practice 3–5 times before recording</li>
              <li>Speak slowly and clearly</li>
              <li>Listen to the model sentence first</li>
              <li>Focus on highlighted words</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      <Button
        data-ocid="pronunciation.done.primary_button"
        onClick={() => setCompleted(true)}
        className="w-full gradient-cyan text-primary-foreground text-base py-3"
      >
        Complete Lesson ✓
      </Button>
    </div>
  );
}
