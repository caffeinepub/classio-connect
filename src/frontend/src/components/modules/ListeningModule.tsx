import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useState } from "react";

type Choice = { label: string; correct: boolean };
type Question = { q: string; choices: Choice[] };
type ListeningLesson = { passage: string; questions: Question[] };

const LESSONS: Record<number, ListeningLesson> = {
  1: {
    passage:
      "Active listening is a skill that requires full attention. When someone speaks, you should focus on their words, avoid interrupting, and show that you understand by nodding or paraphrasing. Good listeners make the speaker feel valued and understood.",
    questions: [
      {
        q: "What does active listening require?",
        choices: [
          { label: "Multitasking", correct: false },
          { label: "Full attention", correct: true },
          { label: "Taking notes", correct: false },
          { label: "Interrupting", correct: false },
        ],
      },
      {
        q: "How do good listeners show understanding?",
        choices: [
          { label: "By talking more", correct: false },
          { label: "By ignoring", correct: false },
          { label: "By paraphrasing", correct: true },
          { label: "By leaving", correct: false },
        ],
      },
    ],
  },
  2: {
    passage:
      "English has many accents around the world. In Britain, people say 'bath' with a long 'a' sound, while Americans use a short 'a'. Australians have a distinctive rising intonation. Understanding these differences helps you communicate better globally.",
    questions: [
      {
        q: "How do British and American English differ in the word 'bath'?",
        choices: [
          { label: "Spelling", correct: false },
          { label: "Vowel sound", correct: true },
          { label: "Consonants", correct: false },
          { label: "Stress", correct: false },
        ],
      },
      {
        q: "What helps global communication?",
        choices: [
          { label: "Using one accent", correct: false },
          { label: "Avoiding accents", correct: false },
          { label: "Understanding differences", correct: true },
          { label: "Speaking slowly", correct: false },
        ],
      },
    ],
  },
  3: {
    passage:
      "Planning your day helps you use your time well. In the morning, make a list of the tasks you need to complete. Decide which tasks are most important and do them first. Taking short breaks between tasks keeps your mind fresh and helps you stay focused throughout the day.",
    questions: [
      {
        q: "What is the first step in planning your day?",
        choices: [
          { label: "Take a break", correct: false },
          { label: "Make a list of tasks", correct: true },
          { label: "Start with the easiest task", correct: false },
          { label: "Check social media", correct: false },
        ],
      },
      {
        q: "Why should you take short breaks between tasks?",
        choices: [
          { label: "To waste time", correct: false },
          { label: "To keep your mind fresh and stay focused", correct: true },
          { label: "To avoid work", correct: false },
          { label: "To watch television", correct: false },
        ],
      },
    ],
  },
  4: {
    passage:
      "Healthy eating means choosing the right foods to keep your body strong. Fruits and vegetables give us important vitamins and minerals. Drinking plenty of water keeps us hydrated. We should avoid eating too much sugar, oily food, or junk food, as these can cause health problems over time.",
    questions: [
      {
        q: "What do fruits and vegetables provide?",
        choices: [
          { label: "Sugar and fat", correct: false },
          { label: "Vitamins and minerals", correct: true },
          { label: "Protein only", correct: false },
          { label: "Nothing useful", correct: false },
        ],
      },
      {
        q: "What should we avoid for good health?",
        choices: [
          { label: "Fruits and water", correct: false },
          { label: "Vegetables and rice", correct: false },
          { label: "Too much sugar and junk food", correct: true },
          { label: "Dal and roti", correct: false },
        ],
      },
    ],
  },
  5: {
    passage:
      "Reading books is one of the best habits a person can develop. Books improve our vocabulary and language skills. They also increase our knowledge about the world and different cultures. Reading regularly helps us develop our imagination and critical thinking. Even reading for just twenty minutes a day can make a big difference over time.",
    questions: [
      {
        q: "What is one benefit of reading books?",
        choices: [
          { label: "Makes you sleepy", correct: false },
          { label: "Improves vocabulary and language skills", correct: true },
          { label: "Wastes time", correct: false },
          { label: "Reduces knowledge", correct: false },
        ],
      },
      {
        q: "How long should you read each day to make a difference?",
        choices: [
          { label: "Five hours", correct: false },
          { label: "One hour", correct: false },
          { label: "Twenty minutes", correct: true },
          { label: "No time needed", correct: false },
        ],
      },
      {
        q: "What skill does regular reading help develop?",
        choices: [
          { label: "Drawing", correct: false },
          { label: "Singing", correct: false },
          { label: "Critical thinking", correct: true },
          { label: "Cooking", correct: false },
        ],
      },
    ],
  },
  6: {
    passage:
      "Technology has changed how we live every day. Smartphones let us call, message, and access the internet from anywhere. The internet helps us find information, learn new things, and connect with people around the world. However, spending too much time on screens can affect our eyesight and sleep. It is important to use technology wisely and take regular breaks.",
    questions: [
      {
        q: "What can smartphones help us do?",
        choices: [
          { label: "Only make calls", correct: false },
          { label: "Call, message, and access the internet", correct: true },
          { label: "Only browse the internet", correct: false },
          { label: "Watch movies only", correct: false },
        ],
      },
      {
        q: "What problem can too much screen time cause?",
        choices: [
          { label: "Better vision", correct: false },
          { label: "More energy", correct: false },
          { label: "Affect eyesight and sleep", correct: true },
          { label: "Improved focus", correct: false },
        ],
      },
      {
        q: "What is the best way to use technology?",
        choices: [
          { label: "Use it all day without breaks", correct: false },
          { label: "Avoid it completely", correct: false },
          { label: "Use it wisely and take regular breaks", correct: true },
          { label: "Only use it for games", correct: false },
        ],
      },
    ],
  },
};

interface Props {
  lesson: number;
  onComplete: (score: number, total: number) => void;
}

export function ListeningModule({ lesson, onComplete }: Props) {
  const data = LESSONS[lesson] ?? LESSONS[1];
  const [hasListened, setHasListened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const playPassage = () => {
    try {
      setIsPlaying(true);
      const u = new SpeechSynthesisUtterance(data.passage);
      u.rate = 0.88;
      u.onend = () => {
        setIsPlaying(false);
        setHasListened(true);
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      setIsPlaying(false);
      setHasListened(true);
    }
  };

  const handleAnswer = (qi: number, ci: number) => {
    if (submitted) return;
    setAnswers((p) => ({ ...p, [qi]: ci }));
  };

  const score = data.questions.filter(
    (q, i) => q.choices[answers[i]]?.correct,
  ).length;
  const total = data.questions.length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">
              Listen to the Passage
            </p>
            <p className="text-sm text-cyan-700 mt-1">
              Click play, then answer the questions below
            </p>
          </div>
          <Button
            data-ocid="listening.play.button"
            onClick={playPassage}
            disabled={isPlaying}
            className={`gap-2 ${isPlaying ? "bg-cyan-400 text-white animate-pulse" : "gradient-cyan text-primary-foreground"}`}
          >
            {isPlaying ? "🔊 Playing..." : "▶ Listen to Passage"}
          </Button>
        </div>
        {hasListened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t border-cyan-200 pt-4"
          >
            <p className="text-xs font-semibold text-cyan-600 mb-2">
              Passage Text
            </p>
            <p className="text-sm text-cyan-900 leading-relaxed">
              {data.passage}
            </p>
          </motion.div>
        )}
      </div>

      {hasListened && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <h3 className="font-bold text-foreground">Comprehension Questions</h3>
          {data.questions.map((q, qi) => (
            <div
              key={q.q}
              className="rounded-xl border border-border bg-white p-5 space-y-3"
            >
              <p className="font-medium text-foreground">
                {qi + 1}. {q.q}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {q.choices.map((choice, ci) => {
                  let cls =
                    "border-border bg-white hover:border-primary/50 hover:bg-primary/5";
                  if (submitted) {
                    if (choice.correct)
                      cls = "border-green-400 bg-green-50 text-green-800";
                    else if (answers[qi] === ci)
                      cls = "border-red-400 bg-red-50 text-red-800";
                  } else if (answers[qi] === ci) {
                    cls = "border-primary bg-primary/10 text-primary";
                  }
                  return (
                    <button
                      type="button"
                      key={choice.label}
                      onClick={() => handleAnswer(qi, ci)}
                      disabled={submitted}
                      className={`rounded-xl border-2 py-2 px-3 text-sm text-left transition-all ${cls}`}
                    >
                      {["A", "B", "C", "D"][ci]}. {choice.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {!submitted ? (
            <Button
              data-ocid="listening.submit.primary_button"
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < total}
              className="w-full gradient-cyan text-primary-foreground"
            >
              Submit Answers
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-3 py-4"
            >
              <p className="text-2xl font-bold text-primary">
                {score} / {total} correct
              </p>
              <Button
                data-ocid="listening.complete.primary_button"
                onClick={() => onComplete(score, total)}
                className="gradient-cyan text-primary-foreground px-8"
              >
                Complete Lesson 🎉
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
