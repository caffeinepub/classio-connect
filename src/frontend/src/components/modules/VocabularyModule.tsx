import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type WordEntry = { word: string; meaning: string; emoji: string };

const LESSON_WORDS: Record<number, WordEntry[]> = {
  1: [
    { word: "book", meaning: "a printed text document", emoji: "📗" },
    { word: "pen", meaning: "a writing instrument", emoji: "✒️" },
    { word: "table", meaning: "flat surface on legs", emoji: "🪑" },
    { word: "chair", meaning: "seat with a back", emoji: "🪑" },
    { word: "window", meaning: "glass opening in a wall", emoji: "🪟" },
    { word: "door", meaning: "hinged panel for entry", emoji: "🚪" },
    { word: "phone", meaning: "device for communication", emoji: "📱" },
    { word: "bag", meaning: "container for carrying items", emoji: "👜" },
  ],
  2: [
    { word: "run", meaning: "move fast on feet", emoji: "🏃" },
    { word: "walk", meaning: "move at normal pace", emoji: "🚶" },
    { word: "eat", meaning: "consume food", emoji: "🍽️" },
    { word: "drink", meaning: "swallow liquid", emoji: "🥤" },
    { word: "sleep", meaning: "rest with eyes closed", emoji: "😴" },
    { word: "read", meaning: "look at written text", emoji: "📖" },
    { word: "write", meaning: "form letters on paper", emoji: "✍️" },
    { word: "speak", meaning: "say words aloud", emoji: "🗣️" },
  ],
  3: [
    { word: "big", meaning: "large in size", emoji: "🐘" },
    { word: "small", meaning: "little in size", emoji: "🐭" },
    { word: "fast", meaning: "moving quickly", emoji: "⚡" },
    { word: "slow", meaning: "moving at low speed", emoji: "🐢" },
    { word: "happy", meaning: "feeling joyful", emoji: "😊" },
    { word: "sad", meaning: "feeling unhappy", emoji: "😢" },
    { word: "beautiful", meaning: "pleasing to look at", emoji: "🌸" },
    { word: "strong", meaning: "having great power", emoji: "💪" },
  ],
  4: [
    { word: "doctor", meaning: "a person who treats the sick", emoji: "👨‍⚕️" },
    { word: "teacher", meaning: "a person who educates others", emoji: "👩‍🏫" },
    {
      word: "engineer",
      meaning: "a person who designs and builds things",
      emoji: "👷",
    },
    {
      word: "farmer",
      meaning: "a person who grows crops or raises animals",
      emoji: "🧑‍🌾",
    },
    {
      word: "chef",
      meaning: "a professional cook in a restaurant",
      emoji: "👨‍🍳",
    },
    { word: "driver", meaning: "a person who operates a vehicle", emoji: "🚗" },
    { word: "nurse", meaning: "a person who cares for patients", emoji: "👩‍⚕️" },
    { word: "pilot", meaning: "a person who flies an aircraft", emoji: "✈️" },
  ],
  5: [
    { word: "rain", meaning: "water falling from clouds", emoji: "🌧️" },
    {
      word: "sun",
      meaning: "the star that gives us light and warmth",
      emoji: "☀️",
    },
    { word: "cloud", meaning: "a mass of water vapour in the sky", emoji: "☁️" },
    { word: "wind", meaning: "moving air outside", emoji: "💨" },
    { word: "mountain", meaning: "a very large natural hill", emoji: "⛰️" },
    { word: "river", meaning: "a large natural flow of water", emoji: "🏞️" },
    { word: "forest", meaning: "a large area covered with trees", emoji: "🌲" },
    {
      word: "snow",
      meaning: "frozen water falling as white flakes",
      emoji: "❄️",
    },
  ],
  6: [
    { word: "breakfast", meaning: "the first meal of the day", emoji: "🍳" },
    { word: "lunch", meaning: "the midday meal", emoji: "🍱" },
    { word: "dinner", meaning: "the main evening meal", emoji: "🍛" },
    {
      word: "snack",
      meaning: "a small amount of food between meals",
      emoji: "🥪",
    },
    {
      word: "fruit",
      meaning: "sweet food that grows on plants or trees",
      emoji: "🍎",
    },
    {
      word: "vegetable",
      meaning: "a plant or part of a plant used as food",
      emoji: "🥦",
    },
    {
      word: "sweet",
      meaning: "having a sugary taste; dessert-like",
      emoji: "🍬",
    },
    { word: "spicy", meaning: "having a strong, hot flavour", emoji: "🌶️" },
  ],
  7: [
    {
      word: "independence",
      meaning: "freedom from control of others",
      emoji: "🗽",
    },
    {
      word: "circumstances",
      meaning: "the conditions that affect a situation",
      emoji: "🔄",
    },
    {
      word: "ambition",
      meaning: "a strong desire to achieve something",
      emoji: "🎯",
    },
    {
      word: "consequence",
      meaning: "a result or effect of an action",
      emoji: "⚖️",
    },
    {
      word: "evaluate",
      meaning: "to judge the quality or importance of something",
      emoji: "🔍",
    },
    {
      word: "summarize",
      meaning: "to give a brief account of the main points",
      emoji: "📝",
    },
    {
      word: "perspective",
      meaning: "a particular way of thinking about something",
      emoji: "🧐",
    },
    {
      word: "contribute",
      meaning: "to give or add something to help a cause",
      emoji: "🤝",
    },
  ],
  8: [
    { word: "analyze", meaning: "to examine something in detail", emoji: "🔬" },
    {
      word: "hypothesis",
      meaning: "a proposed explanation based on limited evidence",
      emoji: "💡",
    },
    {
      word: "considerable",
      meaning: "large in size, amount, or extent",
      emoji: "📊",
    },
    {
      word: "distinguish",
      meaning: "to recognize the difference between things",
      emoji: "🔀",
    },
    { word: "elaborate", meaning: "to explain in more detail", emoji: "📖" },
    { word: "significant", meaning: "important or meaningful", emoji: "⭐" },
    {
      word: "evidence",
      meaning: "facts that prove something is true",
      emoji: "🗂️",
    },
    {
      word: "contradiction",
      meaning: "a statement that goes against another",
      emoji: "❌",
    },
  ],
  9: [
    {
      word: "eloquent",
      meaning: "fluent and persuasive in speaking or writing",
      emoji: "🎙️",
    },
    {
      word: "meticulous",
      meaning: "showing great attention to detail",
      emoji: "🔎",
    },
    {
      word: "prejudice",
      meaning: "an unfair opinion formed without knowing the facts",
      emoji: "⚖️",
    },
    {
      word: "inevitable",
      meaning: "certain to happen and unable to be avoided",
      emoji: "⏳",
    },
    {
      word: "contemplate",
      meaning: "to think deeply and carefully about something",
      emoji: "🤔",
    },
    {
      word: "metaphor",
      meaning: "a figure of speech comparing two unlike things",
      emoji: "🌉",
    },
    {
      word: "inference",
      meaning: "a conclusion reached from evidence and reasoning",
      emoji: "🧩",
    },
    {
      word: "persuade",
      meaning: "to convince someone to do or believe something",
      emoji: "🗣️",
    },
  ],
  10: [
    {
      word: "sophisticated",
      meaning: "having a refined understanding of complex issues",
      emoji: "🎩",
    },
    {
      word: "ambiguous",
      meaning: "open to more than one interpretation",
      emoji: "❓",
    },
    {
      word: "rhetoric",
      meaning: "the art of effective persuasive speaking or writing",
      emoji: "📜",
    },
    {
      word: "phenomenon",
      meaning: "a remarkable or observable fact or event",
      emoji: "🌟",
    },
    {
      word: "introspective",
      meaning: "examining one's own thoughts and feelings",
      emoji: "🪞",
    },
    {
      word: "paradox",
      meaning: "a statement that seems contradictory but may be true",
      emoji: "♾️",
    },
    {
      word: "empirical",
      meaning: "based on observation and experience rather than theory",
      emoji: "🧪",
    },
    {
      word: "articulate",
      meaning: "able to express thoughts clearly and effectively",
      emoji: "💬",
    },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pronunciationScore(spoken: string, target: string): number {
  const s = spoken.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  if (s === t) return 100;
  const m = s.length;
  const n = t.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array(n + 1)
      .fill(0)
      .map((_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        s[i - 1] === t[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  const maxLen = Math.max(m, n);
  return maxLen === 0 ? 100 : Math.round((1 - dp[m][n] / maxLen) * 100);
}

const hasSpeechRecognition =
  typeof window !== "undefined" &&
  !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);

interface PronunciationResult {
  score: number;
  transcript: string;
}

interface Props {
  lesson: number;
  onComplete: (score: number, total: number) => void;
}

export function VocabularyModule({ lesson, onComplete }: Props) {
  const clampedLesson = Math.min(Math.max(lesson, 1), 10);
  const words = LESSON_WORDS[clampedLesson] ?? LESSON_WORDS[1];
  const matchWords = words.slice(0, 4);

  const [phase, setPhase] = useState<"flashcard" | "match">("flashcard");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, "correct" | "wrong">>(
    {},
  );
  const [shuffledDefs] = useState(() =>
    shuffle(matchWords.map((w) => w.meaning)),
  );
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Pronunciation mic state
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationResult, setPronunciationResult] =
    useState<PronunciationResult | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentWord = words[cardIndex];

  // Clear pronunciation result when card changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: cardIndex is intentionally used as a trigger
  useEffect(() => {
    setPronunciationResult(null);
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
  }, [cardIndex]);

  const speakWord = (word: string) => {
    try {
      const u = new SpeechSynthesisUtterance(word);
      u.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const startRecording = () => {
    if (!hasSpeechRecognition) return;
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const sc = pronunciationScore(transcript, currentWord.word);
      setPronunciationResult({ score: sc, transcript });
      setIsRecording(false);
      setHasInteracted(true);

      if (sc >= 80) {
        setTimeout(() => {
          setPronunciationResult(null);
          nextCard();
        }, 1200);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setPronunciationResult({ score: 0, transcript: "(could not hear you)" });
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
  };

  const nextCard = () => {
    setFlipped(false);
    setPronunciationResult(null);
    if (cardIndex + 1 >= words.length) {
      setPhase("match");
    } else {
      setCardIndex((p) => p + 1);
    }
  };

  const handleSelectWord = (word: string) => {
    if (matched[word]) return;
    setSelectedWord(word);
    setHasInteracted(true);
  };

  const handleSelectDef = (def: string) => {
    if (!selectedWord) return;
    const correct = matchWords.find((w) => w.word === selectedWord)?.meaning;
    const already = Object.values(matched).includes(def);
    if (already) return;
    if (correct === def) {
      const newMatched = { ...matched, [selectedWord]: def };
      setMatched(newMatched);
      setFeedback((p) => ({ ...p, [selectedWord]: "correct" }));
      setScore((p) => p + 1);
      setSelectedWord(null);
      if (Object.keys(newMatched).length === matchWords.length) {
        setTimeout(() => setDone(true), 600);
      }
    } else {
      const sw = selectedWord;
      setFeedback((p) => ({ ...p, [sw]: "wrong" }));
      setTimeout(() => {
        setFeedback((p) => {
          const n = { ...p };
          delete n[sw];
          return n;
        });
        setSelectedWord(null);
      }, 800);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-4"
      >
        <div className="text-6xl">🏆</div>
        <h3 className="text-2xl font-bold">Matching Complete!</h3>
        <p className="text-muted-foreground">
          You matched {score} out of {matchWords.length} correctly
        </p>
        <div className="text-4xl font-bold text-primary">
          {Math.round((score / matchWords.length) * 100)}%
        </div>
        <Button
          data-ocid="vocab.complete.primary_button"
          onClick={() => onComplete(score, matchWords.length)}
          className="gradient-cyan text-primary-foreground px-8"
        >
          Complete Lesson 🎉
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {phase === "flashcard" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Word {cardIndex + 1} of {words.length}
            </p>
            <p className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              Grade {clampedLesson} Vocabulary
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={cardIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="cursor-pointer"
              onClick={() => {
                setFlipped((f) => !f);
                setHasInteracted(true);
              }}
            >
              <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-cyan-50 to-white min-h-48 flex flex-col items-center justify-center gap-3 p-8 shadow-lg">
                <span className="text-6xl">{currentWord.emoji}</span>
                <h2 className="text-4xl font-bold tracking-wide">
                  {currentWord.word}
                </h2>
                {flipped ? (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg text-primary font-medium text-center"
                  >
                    {currentWord.meaning}
                  </motion.p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Tap to reveal meaning
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pronunciation feedback box */}
          <AnimatePresence>
            {pronunciationResult && (
              <motion.div
                key="pron-feedback"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`rounded-xl border p-4 space-y-2 ${
                  pronunciationResult.score >= 80
                    ? "bg-green-50 border-green-300"
                    : "bg-amber-50 border-amber-300"
                }`}
                data-ocid="vocab.pronunciation.success_state"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-semibold ${
                      pronunciationResult.score >= 80
                        ? "text-green-700"
                        : "text-amber-700"
                    }`}
                  >
                    {pronunciationResult.score >= 80
                      ? `Your pronunciation score: ${pronunciationResult.score}% — Excellent! Moving forward...`
                      : `Your pronunciation score: ${pronunciationResult.score}% — You said "${pronunciationResult.transcript}". Try saying "${currentWord.word}" again.`}
                  </span>
                </div>
                {/* Score bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pronunciationResult.score}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-2 rounded-full ${
                      pronunciationResult.score >= 80
                        ? "bg-green-500"
                        : "bg-amber-400"
                    }`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button row */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => speakWord(currentWord.word)}
              data-ocid="vocab.hear.button"
            >
              🔊 Hear
            </Button>

            {hasSpeechRecognition ? (
              <Button
                variant={isRecording ? "destructive" : "outline"}
                className={`flex-1 gap-2 ${isRecording ? "animate-pulse" : ""}`}
                onClick={isRecording ? stopRecording : startRecording}
                data-ocid="vocab.pronounce.button"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" /> Listening...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" /> Pronounce
                  </>
                )}
              </Button>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-2">
                Voice check not supported in this browser
              </div>
            )}

            <Button
              className="flex-1 gradient-cyan text-primary-foreground"
              onClick={nextCard}
              data-ocid="vocab.next.button"
            >
              {cardIndex + 1 >= words.length
                ? "Start Matching →"
                : "Next Word →"}
            </Button>
          </div>
        </div>
      )}

      {phase === "match" && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold">Match the Words!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click a word, then its matching definition
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                Words
              </p>
              {matchWords.map((w) => (
                <button
                  type="button"
                  key={w.word}
                  onClick={() => handleSelectWord(w.word)}
                  disabled={!!matched[w.word]}
                  className={`w-full py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                    matched[w.word]
                      ? "bg-green-100 border-green-400 text-green-700 cursor-default"
                      : feedback[w.word] === "wrong"
                        ? "bg-red-100 border-red-400 text-red-700"
                        : selectedWord === w.word
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-white border-border hover:border-primary/50"
                  }`}
                >
                  {w.emoji} {w.word}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                Meanings
              </p>
              {shuffledDefs.map((def) => {
                const isMatched = Object.values(matched).includes(def);
                return (
                  <button
                    type="button"
                    key={def}
                    onClick={() => handleSelectDef(def)}
                    disabled={isMatched}
                    className={`w-full py-3 px-4 rounded-xl border-2 text-xs text-left transition-all ${
                      isMatched
                        ? "bg-green-100 border-green-400 text-green-700 cursor-default"
                        : "bg-white border-border hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    {def}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {Object.keys(matched).length} / {matchWords.length} matched
          </div>
          {hasInteracted && (
            <div className="pt-2 text-center">
              <Button
                variant="outline"
                size="sm"
                data-ocid="vocab.complete.secondary_button"
                onClick={() => onComplete(score, matchWords.length)}
                className="text-muted-foreground text-xs"
              >
                Complete with current progress
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
