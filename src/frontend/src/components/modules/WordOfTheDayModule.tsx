import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
  lesson?: number;
  grade?: number;
  onComplete: (score: number, total: number) => void;
};

type Word = {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  examples: [string, string];
};

const WORDS_BASIC: Word[] = [
  {
    word: "happy",
    pronunciation: "/ˈhæpi/",
    partOfSpeech: "adjective",
    definition: "Feeling or showing pleasure or contentment.",
    examples: [
      "She was happy to see her friends.",
      "The happy child laughed all day.",
    ],
  },
  {
    word: "brave",
    pronunciation: "/breɪv/",
    partOfSpeech: "adjective",
    definition: "Ready to face danger with courage.",
    examples: [
      "The brave firefighter saved the cat.",
      "Be brave and try new things.",
    ],
  },
  {
    word: "gentle",
    pronunciation: "/ˈdʒɛntl/",
    partOfSpeech: "adjective",
    definition: "Mild in temperament; kind or tender.",
    examples: ["She has a gentle voice.", "Be gentle with the baby animals."],
  },
  {
    word: "curious",
    pronunciation: "/ˈkjʊəriəs/",
    partOfSpeech: "adjective",
    definition: "Eager to know or learn something.",
    examples: [
      "The curious student asked many questions.",
      "I am curious about how planes fly.",
    ],
  },
  {
    word: "clever",
    pronunciation: "/ˈklɛvər/",
    partOfSpeech: "adjective",
    definition: "Quick to understand and apply ideas.",
    examples: [
      "The clever boy solved the puzzle.",
      "That was a very clever idea!",
    ],
  },
];

const WORDS_INTERMEDIATE: Word[] = [
  {
    word: "accomplish",
    pronunciation: "/əˈkɒmplɪʃ/",
    partOfSpeech: "verb",
    definition: "Achieve or complete successfully.",
    examples: [
      "She worked hard to accomplish her goals.",
      "We can accomplish great things together.",
    ],
  },
  {
    word: "persevere",
    pronunciation: "/ˌ pɜːsɪˈvɪər/",
    partOfSpeech: "verb",
    definition: "Continue in a course of action despite difficulty.",
    examples: [
      "You must persevere to become fluent.",
      "Great athletes persevere through pain.",
    ],
  },
  {
    word: "collaborate",
    pronunciation: "/kəˈlæbəreɪt/",
    partOfSpeech: "verb",
    definition: "Work jointly on an activity or project.",
    examples: [
      "Students collaborate on group assignments.",
      "We collaborate to find better solutions.",
    ],
  },
  {
    word: "diligent",
    pronunciation: "/ˈdɪlɪdʒənt/",
    partOfSpeech: "adjective",
    definition: "Showing care and conscientiousness in work.",
    examples: [
      "A diligent student always does their homework.",
      "Her diligent efforts paid off in the exams.",
    ],
  },
  {
    word: "eloquent",
    pronunciation: "/ˈɛləkwənt/",
    partOfSpeech: "adjective",
    definition: "Fluent and persuasive in speaking or writing.",
    examples: [
      "She gave an eloquent speech at the ceremony.",
      "His eloquent words moved everyone present.",
    ],
  },
];

const WORDS_ACADEMIC: Word[] = [
  {
    word: "meticulous",
    pronunciation: "/mɪˈtɪkjʊləs/",
    partOfSpeech: "adjective",
    definition: "Showing great attention to detail; very careful.",
    examples: [
      "The scientist was meticulous in her research.",
      "Meticulous planning ensures project success.",
    ],
  },
  {
    word: "resilient",
    pronunciation: "/rɪˈzɪliənt/",
    partOfSpeech: "adjective",
    definition: "Able to recover quickly from difficult conditions.",
    examples: [
      "Resilient communities rebuild after disaster.",
      "She is a resilient person who never gives up.",
    ],
  },
  {
    word: "ambiguous",
    pronunciation: "/æmˈbɪgjʊəs/",
    partOfSpeech: "adjective",
    definition: "Open to more than one interpretation.",
    examples: [
      "The instructions were ambiguous and confusing.",
      "His ambiguous response left us wondering.",
    ],
  },
  {
    word: "perpetuate",
    pronunciation: "/pəˈpɛtʃʊeɪt/",
    partOfSpeech: "verb",
    definition: "Make something continue indefinitely.",
    examples: [
      "Education helps perpetuate culture.",
      "We must not perpetuate harmful stereotypes.",
    ],
  },
  {
    word: "circumspect",
    pronunciation: "/ˈsɜːkəmspɛkt/",
    partOfSpeech: "adjective",
    definition: "Wary and unwilling to take risks; cautious.",
    examples: [
      "A good leader is circumspect before deciding.",
      "Be circumspect when investing your money.",
    ],
  },
];

const WAVE_BARS = [
  { key: "w1", h: 20 },
  { key: "w2", h: 36 },
  { key: "w3", h: 28 },
  { key: "w4", h: 36 },
  { key: "w5", h: 20 },
];

export function WordOfTheDayModule({ grade = 1, onComplete }: Props) {
  const pool =
    grade <= 4 ? WORDS_BASIC : grade <= 7 ? WORDS_INTERMEDIATE : WORDS_ACADEMIC;
  const startOfYear = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - startOfYear.getTime()) / 86400000);
  const todayWord = pool[dayOfYear % pool.length];

  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [recording, setRecording] = useState(false);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const s = Number(localStorage.getItem("classio_wotd_streak") ?? 0);
    setStreak(s);
  }, []);

  const handleSubmit = () => {
    if (!sentence.trim()) return;
    const words = sentence.trim().split(/\s+/);
    const containsWord = sentence
      .toLowerCase()
      .includes(todayWord.word.toLowerCase());
    const longEnough = words.length >= 5;
    let pts = 0;
    if (containsWord) pts++;
    if (longEnough) pts++;
    if (recorded) pts++;
    setScore(pts);
    setSubmitted(true);
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem("classio_wotd_date") ?? "";
    if (lastDate !== today) {
      const newStreak = streak + 1;
      localStorage.setItem("classio_wotd_streak", String(newStreak));
      localStorage.setItem("classio_wotd_date", today);
      setStreak(newStreak);
    }
  };

  const simulateRecord = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setRecorded(true);
    }, 2000);
  };

  const containsWord = sentence
    .toLowerCase()
    .includes(todayWord.word.toLowerCase());
  const wordCount = sentence.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <style>{`
        @keyframes waveBarGold {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .wave-bar-gold { animation: waveBarGold 0.6s ease-in-out infinite; transform-origin: bottom; }
        .wave-bar-gold:nth-child(1) { animation-delay: 0s; }
        .wave-bar-gold:nth-child(2) { animation-delay: 0.12s; }
        .wave-bar-gold:nth-child(3) { animation-delay: 0.24s; }
        .wave-bar-gold:nth-child(4) { animation-delay: 0.12s; }
        .wave-bar-gold:nth-child(5) { animation-delay: 0s; }
      `}</style>

      <div className="flex items-center gap-3 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3">
        <Star className="h-5 w-5 text-yellow-500 fill-yellow-300" />
        <p className="text-sm font-semibold text-yellow-700">
          {streak > 0
            ? `${streak}-day word streak! ⭐`
            : "Start your word streak today!"}
        </p>
      </div>

      <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">
              Word of the Day
            </CardTitle>
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs capitalize">
              {todayWord.partOfSpeech}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-3">
            <h2 className="text-4xl font-bold text-yellow-800 mb-1">
              {todayWord.word}
            </h2>
            <p className="text-sm text-muted-foreground font-mono">
              {todayWord.pronunciation}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-yellow-100 p-4">
            <p className="text-sm font-semibold text-foreground mb-3">
              📖 {todayWord.definition}
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Example sentences:
              </p>
              <p className="text-sm text-foreground italic">
                "{todayWord.examples[0]}"
              </p>
              <p className="text-sm text-foreground italic">
                "{todayWord.examples[1]}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-amber-700">
            ✍️ Your Turn — Use it in a Sentence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!submitted ? (
            <>
              <textarea
                data-ocid="word_of_day.textarea"
                rows={3}
                placeholder={`Write a sentence using the word "${todayWord.word}"...`}
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm border border-amber-200 bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-muted-foreground resize-none"
              />
              {sentence.length > 0 && (
                <div className="flex gap-2 text-xs">
                  <span
                    className={containsWord ? "text-green-600" : "text-red-500"}
                  >
                    {containsWord
                      ? "✅ Contains the word"
                      : "❌ Must include the word"}
                  </span>
                  <span
                    className={
                      wordCount >= 5
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }
                  >
                    · {wordCount} words {wordCount >= 5 ? "✅" : "(need 5+)"}
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                {!recorded ? (
                  <Button
                    data-ocid="word_of_day.record.button"
                    onClick={simulateRecord}
                    disabled={recording}
                    variant="outline"
                    className="flex-1 border-yellow-300 text-yellow-700 hover:bg-yellow-50 gap-2"
                  >
                    {recording ? (
                      <div className="flex items-end gap-1 h-5">
                        {WAVE_BARS.map((b) => (
                          <div
                            key={b.key}
                            className="wave-bar-gold w-1.5 rounded-full bg-yellow-500"
                            style={{ height: b.h }}
                          />
                        ))}
                      </div>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" /> Speak it!
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex-1 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
                    ✅ Voice recorded!
                  </div>
                )}
                <Button
                  data-ocid="word_of_day.submit.primary_button"
                  onClick={handleSubmit}
                  disabled={!containsWord || wordCount < 5}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Submit
                </Button>
              </div>
            </>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-2">
                  <p className="font-bold text-green-700">
                    {score === 3
                      ? "🌟 Perfect score!"
                      : score === 2
                        ? "✅ Well done!"
                        : "👍 Good effort!"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your sentence:{" "}
                    <em className="text-foreground">"{sentence}"</em>
                  </p>
                  <div className="flex gap-3 text-xs mt-1">
                    <span className="text-green-600">Word used ✅</span>
                    {wordCount >= 5 && (
                      <span className="text-green-600">5+ words ✅</span>
                    )}
                    {recorded && (
                      <span className="text-green-600">Spoken ✅</span>
                    )}
                  </div>
                </div>
                <Button
                  data-ocid="word_of_day.complete.primary_button"
                  onClick={() => onComplete(score, 3)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Complete Lesson ✓
                </Button>
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
