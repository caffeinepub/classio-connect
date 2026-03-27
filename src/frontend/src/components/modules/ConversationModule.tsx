declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import {
  AnimatedCharacter,
  type CharacterType,
} from "@/components/AnimatedCharacter";
import { Button } from "@/components/ui/button";
import { Lightbulb, Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type Scenario = { title: string; description: string; roleContext: string };

const SCENARIOS: Record<number, Scenario> = {
  1: {
    title: "Greetings & Introductions",
    description:
      "Your AI partner is a new student at your school. Greet them and introduce yourself!",
    roleContext: "new_student",
  },
  2: {
    title: "Asking for Directions",
    description:
      "Your AI partner is a lost tourist. Help them find the library!",
    roleContext: "lost_tourist",
  },
};

// Grammar Correction
type GrammarError = { wrong: string; correct: string };

const GRAMMAR_RULES: { pattern: RegExp; wrong: string; correct: string }[] = [
  { pattern: /\bi is\b/i, wrong: "I is", correct: "I am" },
  { pattern: /\bhe go\b(?!es)/i, wrong: "he go", correct: "he goes" },
  { pattern: /\bshe go\b(?!es)/i, wrong: "she go", correct: "she goes" },
  { pattern: /\bthey goes\b/i, wrong: "they goes", correct: "they go" },
  { pattern: /\bi goes\b/i, wrong: "I goes", correct: "I go" },
  { pattern: /\bi were\b/i, wrong: "I were", correct: "I was" },
  { pattern: /\byou was\b/i, wrong: "you was", correct: "you were" },
  { pattern: /\bwe was\b/i, wrong: "we was", correct: "we were" },
  { pattern: /\bthey was\b/i, wrong: "they was", correct: "they were" },
  { pattern: /\bhe don't\b/i, wrong: "he don't", correct: "he doesn't" },
  { pattern: /\bshe don't\b/i, wrong: "she don't", correct: "she doesn't" },
  { pattern: /\bit don't\b/i, wrong: "it don't", correct: "it doesn't" },
  { pattern: /\bi goed\b/i, wrong: "I goed", correct: "I went" },
  { pattern: /\bi buyed\b/i, wrong: "I buyed", correct: "I bought" },
  { pattern: /\bi thinked\b/i, wrong: "I thinked", correct: "I thought" },
  { pattern: /\bmore better\b/i, wrong: "more better", correct: "better" },
  { pattern: /\bmore faster\b/i, wrong: "more faster", correct: "faster" },
  {
    pattern: /\bcan able to\b/i,
    wrong: "can able to",
    correct: "can / is able to",
  },
  { pattern: /\bi have went\b/i, wrong: "I have went", correct: "I have gone" },
  { pattern: /\bhe have\b/i, wrong: "He have", correct: "He has" },
  { pattern: /\bshe have\b/i, wrong: "She have", correct: "She has" },
];

function detectGrammarError(text: string): GrammarError | null {
  for (const rule of GRAMMAR_RULES) {
    if (rule.pattern.test(text)) {
      return { wrong: rule.wrong, correct: rule.correct };
    }
  }
  if (/^i\s/i.test(text.trim()) && !/^I\s/.test(text.trim())) {
    return {
      wrong: "i (lowercase as subject)",
      correct: "I (always capitalize)",
    };
  }
  return null;
}

// Topic Detection & Adaptive Responses
const TOPIC_RESPONSES: Record<string, string[]> = {
  greetings: [
    "Hello! Great to hear from you. How are you feeling today? Tell me in a full sentence!",
    "Hi there! Lovely to chat. What is your name and where are you from?",
    "Hey! Nice to meet you. Can you introduce yourself with two or three sentences?",
  ],
  school: [
    "School sounds interesting! What is your favourite subject and why do you enjoy it?",
    "That reminds me of my school days! Do you have any exams coming up? How do you prepare?",
    "Homework can be challenging! Which subject do you find the hardest and which is the easiest?",
    "Teachers play such an important role. Tell me about a teacher who has inspired you.",
  ],
  family: [
    "Family is so important! How many people are in your family? Tell me about each of them.",
    "That sounds lovely! Do you spend a lot of time with your family on weekends?",
    "Home is where the heart is! What is your favourite thing to do with your family?",
    "Brothers and sisters can be fun! Do you have any siblings? What are they like?",
  ],
  food: [
    "Food is a wonderful topic! What is your all-time favourite dish and who cooks it best?",
    "Yummy! Do you enjoy cooking? What is the easiest dish you can make yourself?",
    "Every region has special food. What traditional food is popular in your area?",
    "Breakfast is the most important meal! What did you have for breakfast today?",
  ],
  sports: [
    "Sports are great for health! Do you play any sport regularly? Tell me more!",
    "Exciting! Who is your favourite sports player and why do you admire them?",
    "Team sports build teamwork. Have you ever played for a school team or a local club?",
    "Watching matches is thrilling! What was the most exciting match you have ever watched?",
  ],
  weather: [
    "The weather affects our mood so much! What kind of weather do you enjoy the most?",
    "Rainy days can be cosy! What do you like to do when it rains outside?",
    "Summer has its own charm! What activities do you enjoy during summer holidays?",
    "Cold winters are wonderful! Do you experience snowfall in your area?",
  ],
  travel: [
    "Travel broadens the mind! Have you visited any place that left a strong impression on you?",
    "Wonderful! If you could travel anywhere in the world, where would you go and why?",
    "Road trips can be so much fun! What is the most interesting trip you have been on?",
    "Different countries, different cultures! What is one thing you would love to experience abroad?",
  ],
  hobbies: [
    "Hobbies keep us creative! How long have you been practising your hobby and how did you start?",
    "That sounds fun! Do you prefer indoor hobbies like reading or outdoor ones like sports?",
    "Music is a universal language! Do you play any instrument or enjoy singing?",
    "Drawing and art express our feelings. Have you ever created something you are really proud of?",
  ],
  feelings: [
    "It is good to talk about feelings! Can you describe exactly how you are feeling and why?",
    "Thank you for sharing. What usually cheers you up when you are feeling down?",
    "Being excited is wonderful! What is making you feel that way? Tell me everything!",
    "Feelings are natural. Try to use describing words — are you slightly, very, or extremely happy?",
  ],
  dreams: [
    "Dreams and goals give us direction! What do you want to be when you grow up and why?",
    "Fantastic ambition! What steps are you taking right now to reach that dream?",
    "The future is bright! Where do you see yourself in ten years? Paint me a picture!",
    "Every great career starts with a plan. What subjects are most important for your dream job?",
  ],
};

const TOPIC_KEYWORDS: Record<string, RegExp> = {
  greetings:
    /\b(hi|hello|hey|good morning|good afternoon|good evening|nice to meet|my name is)\b/i,
  school:
    /\b(school|class|teacher|homework|subject|exam|study|college|university|lesson)\b/i,
  family:
    /\b(family|mother|father|sister|brother|parents|home|mom|dad|uncle|aunt|grandma|grandpa)\b/i,
  food: /\b(eat|food|lunch|dinner|breakfast|rice|pizza|cook|hungry|meal|snack|drink)\b/i,
  sports:
    /\b(play|cricket|football|basketball|game|sport|team|match|run|swim|gym|exercise)\b/i,
  weather:
    /\b(weather|rain|sunny|cold|hot|summer|winter|spring|temperature|climate|wind|snow)\b/i,
  travel:
    /\b(travel|trip|visit|place|holiday|vacation|country|city|abroad|tour|journey)\b/i,
  hobbies:
    /\b(hobby|drawing|painting|reading|music|dance|sing|listen|collect|craft|write)\b/i,
  feelings:
    /\b(feel|feeling|happy|sad|tired|excited|nervous|bored|worried|angry|afraid|joy|stress)\b/i,
  dreams:
    /\b(dream|future|plan|career|become|goal|aspire|wish|ambition|job)\b/i,
};

const CHANGE_TOPIC_REGEX =
  /\b(other topic|change topic|different topic|something else|let's talk about|talk about something|switch topic|another topic)\b/i;

function detectTopic(msg: string): string | null {
  for (const [topic, pattern] of Object.entries(TOPIC_KEYWORDS)) {
    if (pattern.test(msg)) return topic;
  }
  return null;
}

// Types
type ChatMsg = {
  id: string;
  role: "user" | "lexi" | "tip";
  text: string;
  tipData?: { wrong: string; correct: string };
};

interface Props {
  lesson: number;
  onComplete: (score: number, total: number) => void;
}

const CHARACTER_OPTIONS: {
  type: CharacterType;
  label: string;
  color: string;
}[] = [
  { type: "boy", label: "Boy", color: "#3b82f6" },
  { type: "girl", label: "Girl", color: "#a855f7" },
  { type: "teacher", label: "Teacher", color: "#1e40af" },
];

// Classio Tip Card
function ClassioTipCard({
  wrong,
  correct,
}: { wrong: string; correct: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="mx-auto max-w-[90%] rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex gap-3 items-start shadow-sm"
    >
      <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-amber-700 mb-1">Classio Tip</p>
        <p className="text-xs text-amber-900 leading-relaxed">
          You said:{" "}
          <span className="font-semibold line-through opacity-70">{wrong}</span>
          {" — Try: "}
          <span className="font-semibold text-green-700">{correct}</span>
        </p>
        <p className="text-xs text-amber-600 mt-1 italic">
          Great catch — small fixes make a big difference!
        </p>
      </div>
    </motion.div>
  );
}

export function ConversationModule({ lesson, onComplete }: Props) {
  const scenario = SCENARIOS[lesson] ?? SCENARIOS[1];
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterType | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  // Track last picked response index per topic to avoid repetition
  const lastPickedRef = useRef<Record<string, number>>({});

  const speakText = useCallback(
    (text: string) => {
      if (!ttsEnabled) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.9;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    },
    [ttsEnabled],
  );

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const getLexiResponse = (
    userMessage: string,
    _roleContext: string,
  ): string => {
    const msg = userMessage.toLowerCase().trim();

    if (CHANGE_TOPIC_REGEX.test(msg)) {
      return "Sure! Which topic would you like to discuss? You can choose from school life, food, sports, travel, weather, hobbies, or anything you like!";
    }

    const topic = detectTopic(msg);
    if (topic && TOPIC_RESPONSES[topic]) {
      const responses = TOPIC_RESPONSES[topic];
      const lastIdx = lastPickedRef.current[topic] ?? -1;
      // Build list of indices excluding last picked
      const available = responses.map((_, i) => i).filter((i) => i !== lastIdx);
      const pool =
        available.length > 0 ? available : responses.map((_, i) => i);
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      lastPickedRef.current[topic] = chosen;
      return responses[chosen];
    }

    return "That is interesting! Which topic would you like to explore? We can talk about school, family, hobbies, sports, travel, or anything on your mind!";
  };

  const startWithCharacter = (type: CharacterType) => {
    setSelectedCharacter(type);
    const greeting = "Let's talk! How are you?";
    setMessages([{ id: "init", role: "lexi", text: greeting }]);
    setTimeout(() => speakText(greeting), 300);
  };

  const sendText = (text: string) => {
    if (!text.trim()) return;
    const newMsgs: ChatMsg[] = [];

    newMsgs.push({ id: `u-${Date.now()}`, role: "user", text: text.trim() });

    const grammarError = detectGrammarError(text.trim());
    if (grammarError) {
      newMsgs.push({
        id: `tip-${Date.now() + 1}`,
        role: "tip",
        text: "",
        tipData: grammarError,
      });
    }

    const lexiText = getLexiResponse(text.trim(), scenario.roleContext);
    newMsgs.push({ id: `l-${Date.now() + 2}`, role: "lexi", text: lexiText });

    setMessages((p) => [...p, ...newMsgs]);
    setExchangeCount((p) => p + 1);
    setInput("");
    speakText(lexiText);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2200);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const send = () => sendText(input);

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert(
        "Voice input is not supported in this browser. Please use Chrome or Edge.",
      );
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => sendText(transcript), 400);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onerror = (e: any) => {
      console.warn("Speech recognition error:", e.error);
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  if (!selectedCharacter) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 py-4"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Choose Your Conversation Partner
          </h3>
          <p className="text-sm text-gray-500">
            Select a character to practice English conversation with
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CHARACTER_OPTIONS.map((opt) => (
            <motion.button
              key={opt.type}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => startWithCharacter(opt.type)}
              className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-white p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <AnimatedCharacter type={opt.type} isSpeaking={false} />
              <span
                className="font-semibold text-sm"
                style={{ color: opt.color }}
              >
                {opt.label}
              </span>
            </motion.button>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Adaptive conversation — talk about any topic you choose!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[35%_65%] gap-4 min-h-0">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-b from-cyan-50 to-blue-50 border border-cyan-200 p-4 w-full flex flex-col items-center gap-2 relative">
            <AnimatedCharacter
              type={selectedCharacter}
              isSpeaking={isSpeaking}
            />
            <div className="flex items-center gap-1">
              {isSpeaking && (
                <span className="flex gap-0.5">
                  <span
                    className="w-1 h-3 bg-cyan-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1 h-4 bg-cyan-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1 h-3 bg-cyan-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
              )}
              <span className="text-xs font-medium text-cyan-700">
                {isSpeaking
                  ? "Speaking..."
                  : isListening
                    ? "Listening to you..."
                    : "Waiting..."}
              </span>
            </div>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Listening
              </motion.div>
            )}
          </div>

          <div className="rounded-xl bg-white border border-border p-3 w-full">
            <p className="text-xs font-semibold text-cyan-800 mb-1">
              Adaptive Conversation
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Talk about any topic — school, family, sports, food, hobbies,
              weather, travel, or anything you like!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedCharacter(null)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Change character
            </button>
            <button
              type="button"
              title={
                ttsEnabled ? "Mute character voice" : "Enable character voice"
              }
              onClick={() => {
                setTtsEnabled((v) => !v);
                if (ttsEnabled) window.speechSynthesis.cancel();
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              {ttsEnabled ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Simple exchange counter — no cap implied */}
          <div className="flex items-center justify-center w-full">
            <span className="text-xs text-muted-foreground">
              {exchangeCount} {exchangeCount === 1 ? "exchange" : "exchanges"}
            </span>
          </div>
        </div>

        <div className="flex flex-col border border-border rounded-2xl bg-white overflow-hidden">
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                if (msg.role === "tip") {
                  return (
                    <ClassioTipCard
                      key={msg.id}
                      wrong={msg.tipData?.wrong ?? ""}
                      correct={msg.tipData?.correct ?? ""}
                    />
                  );
                }
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {msg.role === "lexi" && (
                      <div className="shrink-0 w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-xs">
                        {selectedCharacter === "boy"
                          ? "B"
                          : selectedCharacter === "girl"
                            ? "G"
                            : "T"}
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-cyan-50 text-cyan-900 border border-cyan-200 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-border p-3 flex gap-2">
            <input
              data-ocid="conversation.message.input"
              type="text"
              placeholder={
                isListening
                  ? "Listening... speak now"
                  : "Type or tap mic to speak..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border"
            />
            <button
              type="button"
              data-ocid="conversation.mic.button"
              onClick={toggleVoice}
              title={isListening ? "Stop listening" : "Speak your message"}
              className={`p-2 rounded-lg transition-colors ${isListening ? "animate-pulse bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              data-ocid="conversation.send.button"
              onClick={send}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Complete Lesson button — appears after 3 exchanges */}
      <AnimatePresence>
        {exchangeCount >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pt-2 text-center"
          >
            <Button
              data-ocid="conversation.complete.primary_button"
              onClick={() => onComplete(Math.min(exchangeCount, 10), 10)}
              className="gradient-cyan text-primary-foreground px-8"
            >
              Complete Lesson
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
