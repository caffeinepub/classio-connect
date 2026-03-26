import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  lesson?: number;
  grade?: number;
  onComplete: (score: number, total: number) => void;
  onBack?: () => void;
};

type Scenario = {
  id: number;
  title: string;
  emoji: string;
  description: string;
  aiRole: string;
  studentRole: string;
  hints: string[];
  aiOpening: string;
  aiReplies: string[];
};

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "At the Shop",
    emoji: "🛒",
    description: "Buy 3 items, ask for price and change",
    aiRole: "Shop Owner",
    studentRole: "Customer",
    hints: [
      "Ask for the price: 'How much does this cost?'",
      "Request items: 'I'd like to buy...'",
      "Ask for change: 'Can I get the change for...'",
    ],
    aiOpening:
      "Welcome! How can I help you today? We have fresh fruits, vegetables, and household items.",
    aiReplies: [
      "Of course! The apples are ₹40 per kg and the bananas are ₹30 per dozen. What else can I get you?",
      "Good choice! And for the third item, we have fresh milk for ₹25. Will that work for you?",
      "That comes to ₹95 in total. How much are you paying with?",
      "Here is your change. Thank you for shopping with us! Is there anything else?",
      "You're very welcome! Have a wonderful day! Come again! 😊",
    ],
  },
  {
    id: 2,
    title: "Phone Call to Friend",
    emoji: "📱",
    description: "Call a friend to make weekend plans",
    aiRole: "Friend",
    studentRole: "You",
    hints: [
      "Greet and identify yourself: 'Hi, it's me!'",
      "Ask about the weekend: 'Are you free this Saturday?'",
      "Suggest an activity: 'How about we go to...'",
    ],
    aiOpening: "Hello? Who's calling?",
    aiReplies: [
      "Oh hi! Great to hear from you! I'm free this Saturday. What did you have in mind?",
      "That sounds like so much fun! What time should we meet up?",
      "Perfect! Should I bring anything? Snacks, games, anything?",
      "Awesome! I'm really looking forward to it. Should we invite anyone else?",
      "Sounds like a great plan! I'll see you then — take care! 👋",
    ],
  },
  {
    id: 3,
    title: "At the Doctor",
    emoji: "🏥",
    description: "Describe symptoms, get advice",
    aiRole: "Doctor",
    studentRole: "Patient",
    hints: [
      "Describe how you feel: 'I have been feeling...'",
      "Mention duration: 'It started about two days ago'",
      "Ask for advice: 'What do you recommend, doctor?'",
    ],
    aiOpening: "Good morning! Please take a seat. What brings you in today?",
    aiReplies: [
      "I see. How long have you been experiencing these symptoms? Any fever or cough?",
      "Let me check your temperature. Do you have any allergies to medications?",
      "Based on what you've described, it sounds like a mild infection. I'll prescribe some medicine.",
      "Take one tablet twice a day with food and drink plenty of water. Rest is important.",
      "Come back in three days if you don't feel better. Take care and feel better soon! 😊",
    ],
  },
  {
    id: 4,
    title: "Job Interview",
    emoji: "💼",
    description: "Answer basic interview questions",
    aiRole: "Interviewer",
    studentRole: "Candidate",
    hints: [
      "Introduce yourself clearly: 'My name is... and I have...'",
      "Talk about strengths: 'I am good at...'",
      "Ask a question at the end: 'May I ask about the role?'",
    ],
    aiOpening:
      "Good morning! Please have a seat. Thank you for coming in today. Can you tell me a bit about yourself?",
    aiReplies: [
      "That's great! What are your main strengths and what makes you the right person for this job?",
      "Excellent! Can you share an example of when you solved a problem or worked under pressure?",
      "Impressive! Where do you see yourself professionally in the next two to three years?",
      "Good answer! Do you have any questions for us about the role or the team?",
      "We really enjoyed speaking with you today. We'll be in touch within a week. Thank you! 🤝",
    ],
  },
  {
    id: 5,
    title: "At the Restaurant",
    emoji: "🍽️",
    description: "Order food, ask for the bill",
    aiRole: "Waiter",
    studentRole: "Customer",
    hints: [
      "Ask for the menu: 'Could I see the menu please?'",
      "Place an order: 'I would like to order...'",
      "Ask for the bill: 'Could I have the bill please?'",
    ],
    aiOpening:
      "Good evening! Welcome to La Bella Restaurant. My name is Raj and I'll be your server tonight. Can I get you started with something to drink?",
    aiReplies: [
      "Excellent choice! Are you ready to order your food, or would you like a few more minutes?",
      "Very good! Our chef's special today is grilled chicken with lemon herb sauce. Will you be having dessert?",
      "Wonderful! Your order will be ready in about 20 minutes. Is there anything else I can bring you?",
      "I hope you're enjoying your meal! May I clear any plates for you?",
      "Of course! Here is your bill. Thank you so much for dining with us tonight! Please come again! 😊",
    ],
  },
];

const EXCHANGE_DOTS = [0, 1, 2, 3, 4];

type Message = { id: string; role: "ai" | "student"; text: string };

export function RoleplayModule({ onComplete }: Props) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll after messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const selectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setMessages([{ id: "opening", role: "ai", text: scenario.aiOpening }]);
    setExchangeCount(0);
    setDone(false);
    setInput("");
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedScenario || done) return;
    const studentMsg: Message = {
      id: `s-${Date.now()}`,
      role: "student",
      text: input.trim(),
    };
    const nextExchange = exchangeCount + 1;
    const replyIdx = Math.min(
      nextExchange - 1,
      selectedScenario.aiReplies.length - 1,
    );
    const aiMsg: Message = {
      id: `a-${Date.now() + 1}`,
      role: "ai",
      text: selectedScenario.aiReplies[replyIdx],
    };

    setMessages((prev) => [...prev, studentMsg, aiMsg]);
    setInput("");
    setExchangeCount(nextExchange);

    if (nextExchange >= 5) {
      setTimeout(() => setDone(true), 600);
    }
  };

  const resetScenario = () => {
    setSelectedScenario(null);
    setMessages([]);
    setDone(false);
    setExchangeCount(0);
  };

  if (!selectedScenario) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold">Choose a Roleplay Scenario</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Practice real English conversations in everyday situations
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {SCENARIOS.map((scenario) => (
            <motion.button
              key={scenario.id}
              data-ocid={`roleplay.scenario.item.${scenario.id}`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => selectScenario(scenario)}
              className="w-full text-left rounded-2xl border border-border bg-white p-4 flex items-center gap-4 hover:border-red-300 hover:bg-red-50/50 transition-colors shadow-sm"
            >
              <span className="text-3xl">{scenario.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{scenario.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {scenario.description}
                </p>
              </div>
              <Badge className="bg-red-100 text-red-700 border-red-200 text-xs shrink-0">
                5 exchanges
              </Badge>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center space-y-3"
          >
            <div className="text-4xl">🎭</div>
            <h3 className="text-xl font-bold text-green-700">
              Scenario Complete!
            </h3>
            <p className="text-sm text-muted-foreground">
              You completed the &ldquo;{selectedScenario.title}&rdquo; scenario
              with 5 exchanges.
            </p>
            <div className="flex gap-3 justify-center mt-2">
              <Button
                data-ocid="roleplay.complete.primary_button"
                onClick={() => onComplete(85, 100)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Complete Lesson
              </Button>
              <Button
                data-ocid="roleplay.try_another.button"
                variant="outline"
                onClick={resetScenario}
                className="gap-2 border-green-300 text-green-700"
              >
                <RotateCcw className="h-4 w-4" />
                Try Another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1 border-red-200 bg-gradient-to-br from-red-50 to-rose-50 h-fit">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedScenario.emoji}</span>
              <CardTitle className="text-sm font-bold text-red-700">
                {selectedScenario.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="font-semibold text-foreground">You are:</p>
              <p className="text-muted-foreground">
                {selectedScenario.studentRole}
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">AI plays:</p>
              <p className="text-muted-foreground">{selectedScenario.aiRole}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1.5">Hints:</p>
              <ul className="space-y-1.5">
                {selectedScenario.hints.map((hint) => (
                  <li key={hint} className="flex gap-1.5 text-muted-foreground">
                    <span className="text-red-500 shrink-0">•</span>
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-1">
              <div className="flex gap-0.5">
                {EXCHANGE_DOTS.map((dot) => (
                  <div
                    key={`dot-${dot}`}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      dot < exchangeCount ? "bg-red-500" : "bg-red-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground mt-1">
                {exchangeCount}/5 exchanges
              </p>
            </div>
            <Button
              data-ocid="roleplay.back.button"
              variant="ghost"
              size="sm"
              onClick={resetScenario}
              className="w-full text-xs text-muted-foreground hover:text-red-600"
            >
              ← Change Scenario
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2 flex flex-col gap-3">
          <ScrollArea
            className="h-72 rounded-2xl border border-border bg-white p-4"
            ref={scrollRef as any}
          >
            <div className="space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "student" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "ai" && (
                    <div className="text-lg shrink-0 mt-1">
                      {selectedScenario.emoji}
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === "student"
                        ? "bg-red-500 text-white rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {!done && (
            <div className="flex gap-2">
              <Input
                data-ocid="roleplay.chat.input"
                placeholder={`Respond as the ${selectedScenario.studentRole}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button
                data-ocid="roleplay.chat.submit_button"
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
