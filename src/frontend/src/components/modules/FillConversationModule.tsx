import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Props = {
  lesson?: number;
  grade?: number;
  onComplete: (score: number, total: number) => void;
};

type DialogueLine = {
  speaker: "A" | "B";
  text: string;
  keywords?: string[];
};

type Scenario = {
  title: string;
  context: string;
  lines: DialogueLine[];
};

const SCENARIOS: Scenario[] = [
  {
    title: "At the Grocery Store",
    context: "You are shopping for fruits and vegetables.",
    lines: [
      { speaker: "A", text: "Good morning! Can I help you find something?" },
      {
        speaker: "B",
        text: "Yes, I am looking for fresh apples and bananas.",
        keywords: ["apples", "bananas", "looking"],
      },
      {
        speaker: "A",
        text: "They are in aisle three. How many would you like?",
      },
      {
        speaker: "B",
        text: "I would like six apples and a bunch of bananas please.",
        keywords: ["six", "apples", "bananas", "please"],
      },
      { speaker: "A", text: "Great choice! Anything else for you today?" },
      {
        speaker: "B",
        text: "No thank you. That will be all for now.",
        keywords: ["thank", "all"],
      },
    ],
  },
  {
    title: "Meeting a New Friend",
    context: "You are introducing yourself to a new classmate.",
    lines: [
      { speaker: "A", text: "Hi! I don't think we've met. My name is Priya." },
      {
        speaker: "B",
        text: "Hello Priya! My name is Arjun. Nice to meet you.",
        keywords: ["hello", "name", "nice", "meet"],
      },
      { speaker: "A", text: "Nice to meet you too! Which class are you in?" },
      {
        speaker: "B",
        text: "I am in grade seven section B. What about you?",
        keywords: ["grade", "seven", "section"],
      },
      { speaker: "A", text: "I'm in the same class! We can sit together." },
      {
        speaker: "B",
        text: "That would be great. I would love that.",
        keywords: ["great", "love"],
      },
    ],
  },
  {
    title: "Ordering Food",
    context: "You are at a restaurant ordering dinner.",
    lines: [
      {
        speaker: "A",
        text: "Welcome! Have you decided what you would like to order?",
      },
      {
        speaker: "B",
        text: "Yes, I would like the grilled chicken with rice please.",
        keywords: ["grilled", "chicken", "rice", "please"],
      },
      {
        speaker: "A",
        text: "Excellent. Would you like soup or salad to start?",
      },
      {
        speaker: "B",
        text: "I will have the soup please. What kind do you have?",
        keywords: ["soup", "please", "kind"],
      },
      {
        speaker: "A",
        text: "We have tomato, mushroom, and chicken noodle soup today.",
      },
      {
        speaker: "B",
        text: "The tomato soup sounds perfect. Thank you very much.",
        keywords: ["tomato", "soup", "thank"],
      },
    ],
  },
  {
    title: "Doctor's Appointment",
    context: "You are visiting the doctor with a cold.",
    lines: [
      { speaker: "A", text: "Good morning. What seems to be the problem?" },
      {
        speaker: "B",
        text: "I have had a bad cold for three days and my throat hurts.",
        keywords: ["cold", "three", "throat", "hurts"],
      },
      { speaker: "A", text: "Do you have a fever or any headaches?" },
      {
        speaker: "B",
        text: "Yes I had a slight fever last night and some headaches.",
        keywords: ["fever", "night", "headaches"],
      },
      {
        speaker: "A",
        text: "Let me examine you. Open your mouth and say aah.",
      },
      {
        speaker: "B",
        text: "Of course doctor. I will follow your instructions carefully.",
        keywords: ["doctor", "follow", "instructions"],
      },
    ],
  },
  {
    title: "Job Interview",
    context: "You are being interviewed for a part-time position.",
    lines: [
      {
        speaker: "A",
        text: "Thank you for coming in. Please tell me about yourself.",
      },
      {
        speaker: "B",
        text: "Thank you for the opportunity. I am a hardworking dedicated student.",
        keywords: ["opportunity", "hardworking", "dedicated"],
      },
      {
        speaker: "A",
        text: "Why are you interested in working with our company?",
      },
      {
        speaker: "B",
        text: "Your company has an excellent reputation and I want to gain experience.",
        keywords: ["company", "reputation", "experience"],
      },
      { speaker: "A", text: "Do you have any previous work experience?" },
      {
        speaker: "B",
        text: "I have volunteered at a local library and organised community events.",
        keywords: ["volunteered", "library", "community"],
      },
    ],
  },
];

const EASY_SCENARIOS: Scenario[] = [
  {
    title: "Good Morning",
    context: "You meet your neighbour in the morning.",
    lines: [
      { speaker: "A", text: "Good morning! How are you today?" },
      {
        speaker: "B",
        text: "I am fine thank you. How are you?",
        keywords: ["fine", "thank"],
      },
      { speaker: "A", text: "I am very well. It is a nice day today." },
      {
        speaker: "B",
        text: "Yes it is sunny and warm outside.",
        keywords: ["sunny", "warm"],
      },
    ],
  },
  {
    title: "At the Playground",
    context: "You are talking to a friend at school.",
    lines: [
      { speaker: "A", text: "Do you want to play with me?" },
      {
        speaker: "B",
        text: "Yes I would love to play with you.",
        keywords: ["yes", "love", "play"],
      },
      { speaker: "A", text: "What game do you want to play?" },
      {
        speaker: "B",
        text: "Let us play football it is my favourite game.",
        keywords: ["football", "favourite"],
      },
    ],
  },
];

function checkAnswer(userAnswer: string, keywords: string[]): boolean {
  const lower = userAnswer.toLowerCase();
  const matchCount = keywords.filter((kw) =>
    lower.includes(kw.toLowerCase()),
  ).length;
  return matchCount >= Math.ceil(keywords.length * 0.5);
}

export function FillConversationModule({
  lesson = 1,
  grade = 1,
  onComplete,
}: Props) {
  const scenarioPool = grade <= 3 ? EASY_SCENARIOS : SCENARIOS;
  const scenario = scenarioPool[(lesson - 1) % scenarioPool.length];
  const blankLines = scenario.lines.filter((l) => l.speaker === "B");

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleCheck = () => {
    const res: Record<number, boolean> = {};
    let bIdx = 0;
    for (const line of scenario.lines) {
      if (line.speaker === "B") {
        res[bIdx] = checkAnswer(answers[bIdx] ?? "", line.keywords ?? []);
        bIdx++;
      }
    }
    setResults(res);
    setChecked(true);
  };

  const score = Object.values(results).filter(Boolean).length;
  const total = blankLines.length;

  let bIdx = 0;

  return (
    <div className="space-y-5">
      <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-teal-700 uppercase tracking-wide">
              {scenario.title}
            </CardTitle>
            <Badge className="bg-teal-100 text-teal-700 border-teal-200 text-xs">
              Fill in the Blanks
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {scenario.context}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {scenario.lines.map((line) => {
            if (line.speaker === "A") {
              return (
                <div key={`A-${line.text.slice(0, 20)}`} className="flex gap-3">
                  <span className="text-xs font-bold text-teal-600 w-4 pt-2.5">
                    A
                  </span>
                  <div className="flex-1 bg-white rounded-xl px-4 py-3 text-sm border border-teal-100 text-foreground">
                    {line.text}
                  </div>
                </div>
              );
            }
            const idx = bIdx++;
            return (
              <div key={`B-${idx}`} className="flex gap-3">
                <span className="text-xs font-bold text-blue-600 w-4 pt-2.5">
                  B
                </span>
                <div className="flex-1">
                  {checked ? (
                    <div
                      className={`rounded-xl px-4 py-3 text-sm border flex items-start gap-2 ${
                        results[idx]
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}
                    >
                      {results[idx] ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">
                          {answers[idx] || "(no answer)"}
                        </p>
                        {!results[idx] && (
                          <p className="text-xs mt-0.5 text-muted-foreground">
                            Expected: <em>{line.text}</em>
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <input
                      data-ocid={`fill_conversation.input.${idx + 1}`}
                      type="text"
                      placeholder="Type your response here..."
                      value={answers[idx] ?? ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [idx]: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl px-4 py-3 text-sm border border-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-muted-foreground"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-teal-200 bg-teal-50 p-5 text-center space-y-3"
          >
            <div className="text-4xl">{score === total ? "🎉" : "💪"}</div>
            <p className="font-bold text-lg text-teal-700">
              {score} / {total} lines correct
            </p>
            <p className="text-sm text-muted-foreground">
              {score === total
                ? "Perfect! You nailed the conversation!"
                : score >= total / 2
                  ? "Good work! Review the highlighted lines to improve."
                  : "Keep practicing — conversations get easier with time!"}
            </p>
            <Button
              data-ocid="fill_conversation.complete.primary_button"
              onClick={() => onComplete(score, total)}
              className="bg-teal-600 hover:bg-teal-700 text-white mt-2"
            >
              Complete Lesson
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {!checked && (
        <Button
          data-ocid="fill_conversation.check.primary_button"
          onClick={handleCheck}
          disabled={
            blankLines.length > 0 &&
            (Object.keys(answers).length < blankLines.length ||
              Object.values(answers).some((v) => !v.trim()))
          }
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
        >
          Check Answers
        </Button>
      )}
      <p className="text-xs text-center text-muted-foreground">
        💡 Tip: Use keywords from the context — partial matches count!
      </p>
    </div>
  );
}
