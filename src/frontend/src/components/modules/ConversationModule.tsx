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
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
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

function getLexiResponse(
  userMessage: string,
  roleContext: string,
  history: number,
): string {
  const msg = userMessage.toLowerCase().trim();
  let correction = "";
  if (/\bi is\b/i.test(userMessage))
    correction = "(Tip: Use 'I am' instead of 'I is') ";
  else if (/\bhe go\b/i.test(userMessage))
    correction = "(Tip: Use 'he goes' with -es) ";
  else if (/\bthey goes\b/i.test(userMessage))
    correction = "(Tip: Use 'they go' without -s) ";

  if (roleContext === "new_student") {
    if (/(hi|hello|hey|good morning|good afternoon|good evening)/i.test(msg))
      return `${correction}Hi there! I just joined this school. I'm a bit nervous. What's your name?`;
    if (/(my name is|i am|i'm|call me)/i.test(msg))
      return `${correction}What a lovely name! Nice to meet you! Which city or town are you from?`;
    if (/(from|live in|city|town|village|state|country)/i.test(msg))
      return `${correction}Oh wow, that sounds wonderful! What are your hobbies? Do you like sports or music?`;
    if (
      /(sport|music|read|play|dance|cricket|football|sing|draw|cook)/i.test(msg)
    )
      return `${correction}That's amazing! I love that too! Should we use formal or informal language with our teacher?`;
    if (/(formal|informal|polite|sir|ma'am|respect)/i.test(msg))
      return `${correction}Exactly right! Formal language is best with teachers and elders. Great thinking!`;
    const fallbacks = [
      `${correction}Interesting! Tell me more using a complete sentence — it helps with fluency!`,
      `${correction}Great effort! Keep going — conversations improve with practice. What else would you like to share?`,
      `${correction}Good job! Remember, in formal introductions say 'I am pleased to meet you'. Give it a try!`,
    ];
    return fallbacks[history % fallbacks.length];
  }

  if (roleContext === "lost_tourist") {
    if (/(where|find|looking|lost|help|library|museum)/i.test(msg))
      return `${correction}Oh thank goodness! I'm looking for the library. Do you know where it is?`;
    if (
      /(turn|go straight|left|right|ahead|cross|next to|opposite|past|walk)/i.test(
        msg,
      )
    )
      return `${correction}Perfect directions! That's very helpful! Is it far from here?`;
    if (/(far|near|close|minute|block|kilometer)/i.test(msg))
      return `${correction}Great, not too far! Thank you! Could you also tell me a landmark nearby?`;
    if (/(landmark|bank|park|church|shop|store|bus)/i.test(msg))
      return `${correction}Excellent! You're so helpful! Remember to use 'Excuse me' when asking strangers.`;
    if (/(excuse me|sorry|pardon|please|thank)/i.test(msg))
      return `${correction}Very polite! Using 'excuse me' and 'please' makes communication so much smoother!`;
    const fallbacks = [
      `${correction}Can you give me step-by-step directions? Try starting with 'Go straight and then...'`,
      `${correction}Hmm, I'm not sure I follow. Try direction words like left, right, straight.`,
      `${correction}Thanks for trying! Try phrases like 'turn left at the signal' or 'it is next to the park'.`,
    ];
    return fallbacks[history % fallbacks.length];
  }

  return `${correction}That's interesting! Keep practicing English every day.`;
}

type ChatMsg = { id: string; role: "user" | "lexi"; text: string };

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

export function ConversationModule({ lesson, onComplete }: Props) {
  const scenario = SCENARIOS[lesson] ?? SCENARIOS[1];
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterType | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const finishRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (exchangeCount >= 5 && finishRef.current) {
      setTimeout(() => {
        finishRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [exchangeCount]);

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

  const startWithCharacter = (type: CharacterType) => {
    setSelectedCharacter(type);
    const greeting = `Hi! I'm your English conversation partner! ${scenario.description} Start the conversation!`;
    setMessages([
      {
        id: "init",
        role: "lexi",
        text: greeting,
      },
    ]);
    setTimeout(() => speakText(greeting), 300);
  };

  const sendText = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: text.trim(),
    };
    const lexiText = getLexiResponse(
      text.trim(),
      scenario.roleContext,
      exchangeCount,
    );
    const lexiMsg: ChatMsg = {
      id: `l-${Date.now() + 1}`,
      role: "lexi",
      text: lexiText,
    };
    setMessages((p) => [...p, userMsg, lexiMsg]);
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
      // Auto-send after short delay so user can see the transcribed text
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

  const score = Math.min(exchangeCount, 5);

  // Character picker screen
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
          Scenario: <span className="font-medium">{scenario.title}</span>
        </p>
      </motion.div>
    );
  }

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-4"
      >
        <div className="flex justify-center">
          <AnimatedCharacter type={selectedCharacter} isSpeaking={false} />
        </div>
        <h3 className="text-2xl font-bold">Conversation Complete!</h3>
        <p className="text-muted-foreground">
          {exchangeCount} exchanges completed
        </p>
        <div className="text-4xl font-bold text-primary">
          {Math.round((score / 5) * 100)}%
        </div>
        <Button
          data-ocid="conversation.complete.primary_button"
          onClick={() => onComplete(score, 5)}
          className="gradient-cyan text-primary-foreground px-8"
        >
          Complete Lesson
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[35%_65%] gap-4 min-h-0">
        {/* Left: Character + scenario */}
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
              {scenario.title}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {scenario.description}
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

          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <span>{exchangeCount}/5 exchanges</span>
            <div className="flex gap-1">
              {["d1", "d2", "d3", "d4", "d5"].map((dotId, dotIdx) => (
                <div
                  key={dotId}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    dotIdx < exchangeCount ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <div className="flex flex-col border border-border rounded-2xl bg-white overflow-hidden">
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
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
              ))}
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
              className={`p-2 rounded-lg transition-colors ${
                isListening
                  ? "animate-pulse bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
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

      {exchangeCount >= 1 && exchangeCount < 5 && (
        <div className="pt-2 text-center">
          <Button
            variant="outline"
            size="sm"
            data-ocid="conversation.complete.secondary_button"
            onClick={() => {
              setCompleted(true);
            }}
            className="text-muted-foreground text-xs"
          >
            Complete with current progress
          </Button>
        </div>
      )}
      {exchangeCount >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            ref={finishRef}
            data-ocid="conversation.finish.primary_button"
            onClick={() => setCompleted(true)}
            className="w-full gradient-cyan text-primary-foreground animate-pulse"
          >
            Finish Conversation — Great job! You completed 5 exchanges!
          </Button>
        </motion.div>
      )}
    </div>
  );
}
