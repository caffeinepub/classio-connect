import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useEndChatSession,
  useSendMessage,
  useStartChatSession,
} from "../hooks/useQueries";

interface Message {
  id: string;
  role: "user" | "lexi";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "lexi",
  content:
    "Hello! 👋 I'm Lexi, your personal English tutor! I'm here to help you practice speaking, improve your grammar, and build your vocabulary. What would you like to work on today? 🦉✨",
  timestamp: new Date(),
};

const QUICK_PROMPTS = [
  "Help me practice pronunciation",
  "Teach me business vocabulary",
  "Let's have a conversation",
  "Correct my grammar",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <img
        src="/assets/generated/lexi-owl-transparent.dim_400x400.png"
        alt="Lexi"
        className="w-8 h-8 object-contain flex-shrink-0"
      />
      <div className="chat-bubble-lexi px-4 py-3 flex items-center gap-1">
        <span
          className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce-dot"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce-dot"
          style={{ animationDelay: "0.16s" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce-dot"
          style={{ animationDelay: "0.32s" }}
        />
      </div>
    </div>
  );
}

export function AITutorPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<bigint | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const startSession = useStartChatSession();
  const sendMessage = useSendMessage();
  const endSession = useEndChatSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    if (!identity) {
      login();
      return;
    }

    let sid = sessionId;
    if (!sid) {
      try {
        sid = await startSession.mutateAsync();
        setSessionId(sid);
      } catch {
        toast.error("Failed to start session");
        return;
      }
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await sendMessage.mutateAsync({
        sessionId: sid,
        message: text,
      });
      const lexiMsg: Message = {
        id: `lexi-${Date.now()}`,
        role: "lexi",
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, lexiMsg]);
    } catch {
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        role: "lexi",
        content: "Oops! I had a little hiccup. Please try again! 🦉",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleReset = async () => {
    if (sessionId) {
      await endSession.mutateAsync(sessionId).catch(() => {});
    }
    setSessionId(null);
    setMessages([WELCOME_MESSAGE]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[oklch(0.97_0.008_240)]">
      {/* Tutor Header */}
      <div className="gradient-primary px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/assets/generated/lexi-owl-transparent.dim_400x400.png"
              alt="Lexi"
              className="w-12 h-12 object-contain drop-shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="text-white font-bold text-lg">Lexi</div>
            <div className="text-white/80 text-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI English Tutor · Always here to
              help
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
          title="Reset conversation"
          data-ocid="chat.button"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {!identity && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between gap-4">
          <span className="text-sm text-amber-800 font-medium">
            Login to save your conversation history and track progress
          </span>
          <Button
            size="sm"
            onClick={() => login()}
            disabled={isLoggingIn}
            className="gradient-primary text-white border-0 font-semibold"
            data-ocid="chat.primary_button"
          >
            Login
          </Button>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6"
        style={{ maxWidth: "860px", width: "100%", margin: "0 auto" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-end gap-2 mb-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "lexi" && (
                <img
                  src="/assets/generated/lexi-owl-transparent.dim_400x400.png"
                  alt="Lexi"
                  className="w-8 h-8 object-contain flex-shrink-0"
                />
              )}
              <div
                className={`max-w-[75%] px-4 py-3 ${msg.role === "user" ? "chat-bubble-user text-white text-sm" : "chat-bubble-lexi text-foreground text-sm"}`}
                data-ocid="chat.row"
              >
                <p className="leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
                <p
                  className={`text-xs mt-1 ${msg.role === "user" ? "text-white/60" : "text-muted-foreground"}`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator />}
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div
          className="px-4 md:px-8 pb-3"
          style={{ maxWidth: "860px", width: "100%", margin: "0 auto" }}
        >
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => handleQuickPrompt(p)}
                className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-primary border border-primary/30 hover:bg-primary hover:text-white transition-colors shadow-xs"
                data-ocid="chat.button"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="bg-white border-t border-border px-4 md:px-8 py-4 shadow-sm"
        style={{
          maxWidth: "860px",
          width: "100%",
          margin: "0 auto",
          alignSelf: "stretch",
        }}
      >
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Lexi... (Enter to send, Shift+Enter for new line)"
              className="resize-none rounded-xl min-h-[48px] max-h-[120px] pr-4 py-3 text-sm border-border focus:border-primary"
              rows={1}
              data-ocid="chat.input"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || sendMessage.isPending}
            className="gradient-primary text-white border-0 w-11 h-11 rounded-xl p-0 shadow-sm hover:opacity-90 transition-opacity flex-shrink-0"
            data-ocid="chat.submit_button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
