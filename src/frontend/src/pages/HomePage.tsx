import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Globe,
  MessageCircle,
  Mic,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const COURSE_LEVELS = [
  {
    id: "kids",
    label: "Kids",
    age: "Ages 5–10",
    emoji: "🧒",
    gradientClass: "gradient-kids",
    description:
      "Fun, playful lessons with songs, stories, and games designed for young learners.",
    highlights: [
      "Interactive stories",
      "Pronunciation games",
      "Visual vocabulary",
    ],
  },
  {
    id: "teens",
    label: "Teens",
    age: "Ages 11–17",
    emoji: "🧑‍🎓",
    gradientClass: "gradient-teens",
    description:
      "Engaging conversations, grammar, and writing for school and real-world situations.",
    highlights: ["Essay writing", "Debate practice", "Academic English"],
  },
  {
    id: "adults",
    label: "Adults",
    age: "Ages 18+",
    emoji: "👩‍💼",
    gradientClass: "gradient-adults",
    description:
      "Business English, conversational fluency, and professional communication skills.",
    highlights: ["Business writing", "Interview prep", "Fluency building"],
  },
];

const WHY_FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Learning",
    description:
      "Lexi adapts to your skill level and pace, providing personalized feedback in real time.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Users,
    title: "All Age Groups",
    description:
      "Purpose-built courses for Kids, Teens, and Adults — everyone learns together.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "Daily streaks, lesson completions, and badges keep you motivated to keep going.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

const LEXI_FEATURES = [
  { icon: Mic, text: "Practice pronunciation with real-time feedback" },
  { icon: MessageCircle, text: "Conversational AI that adapts to your level" },
  { icon: Globe, text: "Available 24/7 — learn at your own pace" },
];

const STATS = [
  { value: "50K+", label: "Active Learners" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "200+", label: "Lesson Topics" },
  { value: "24/7", label: "AI Availability" },
];

export function HomePage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.975_0.006_240)] to-[oklch(0.95_0.02_240)] py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold w-fit">
                <Star className="w-4 h-4 fill-current" />
                #1 AI English Learning Platform
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight">
                Master English{" "}
                <span className="text-gradient-primary">at Any Age</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Learn English with Lexi, your personal AI tutor. Engaging
                lessons for Kids, Teens, and Adults — interactive, personalized,
                and available 24/7.
              </p>

              <div className="flex flex-wrap gap-3">
                {identity ? (
                  <Link to="/courses" data-ocid="hero.primary_button">
                    <Button
                      size="lg"
                      className="gradient-primary text-white border-0 font-bold text-base shadow-md hover:opacity-90 transition-opacity px-8"
                    >
                      Browse Courses <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => login()}
                    disabled={isLoggingIn}
                    className="gradient-primary text-white border-0 font-bold text-base shadow-md hover:opacity-90 transition-opacity px-8"
                    data-ocid="hero.primary_button"
                  >
                    Start Learning FREE{" "}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
                <Link to="/ai-tutor" data-ocid="hero.secondary_button">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-semibold text-base border-2 px-8"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> Talk to Lexi
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-extrabold text-primary">
                      {s.value}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Lexi */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 blur-2xl scale-110" />
                <motion.img
                  src="/assets/generated/lexi-owl-transparent.dim_400x400.png"
                  alt="Lexi AI Tutor Owl"
                  className="relative w-72 h-72 md:w-80 md:h-80 object-contain animate-float drop-shadow-2xl"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="absolute top-4 -right-4 md:right-0 bg-white rounded-2xl rounded-bl-sm shadow-card px-4 py-3 max-w-[180px]"
                >
                  <p className="text-sm font-semibold text-foreground">
                    Hi! I'm Lexi, your AI tutor! 🦉
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Let's learn English together!
                  </p>
                  <div className="absolute bottom-0 left-4 translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="absolute bottom-8 -left-6 bg-white rounded-xl shadow-card px-3 py-2 flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg gradient-adults flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      Level Up!
                    </div>
                    <div className="text-xs text-muted-foreground">
                      5 lessons done
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Levels */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-foreground mb-3">
              Course Levels
            </h2>
            <p className="text-lg text-muted-foreground">
              Tailored learning paths for every age group
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {COURSE_LEVELS.map((level, i) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 bg-white"
                data-ocid={`courses.item.${i + 1}`}
              >
                <div
                  className={`${level.gradientClass} p-6 flex items-center gap-4`}
                >
                  <span className="text-4xl">{level.emoji}</span>
                  <div>
                    <div className="text-xl font-extrabold text-white">
                      {level.label}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      {level.age}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {level.description}
                  </p>
                  <ul className="flex flex-col gap-2 mb-5">
                    {level.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2 text-sm font-medium text-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Link to="/courses">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-semibold group-hover:border-primary group-hover:text-primary transition-colors"
                    >
                      Learn More <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Lexi */}
      <section className="py-20 bg-gradient-to-br from-[oklch(0.965_0.012_240)] to-[oklch(0.94_0.02_240)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-[280px]">
                <div className="bg-foreground rounded-[36px] p-3 shadow-2xl">
                  <div className="bg-white rounded-[28px] overflow-hidden">
                    <div className="bg-primary/10 px-4 py-2 flex items-center gap-2">
                      <img
                        src="/assets/generated/lexi-owl-transparent.dim_400x400.png"
                        alt="Lexi"
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <div className="text-xs font-bold text-foreground">
                          Lexi
                        </div>
                        <div className="text-xs text-green-500 font-medium">
                          ● Online
                        </div>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col gap-2 bg-[oklch(0.975_0.005_240)]">
                      <div className="chat-bubble-lexi p-2.5 text-xs text-foreground max-w-[200px]">
                        Hello! Ready for today's lesson? 📚
                      </div>
                      <div className="chat-bubble-user p-2.5 text-xs text-white ml-auto max-w-[160px]">
                        Yes! Let's practice pronunciation.
                      </div>
                      <div className="chat-bubble-lexi p-2.5 text-xs text-foreground max-w-[210px]">
                        Great! Repeat after me: "The quick brown fox" 🦊
                      </div>
                      <div className="chat-bubble-user p-2.5 text-xs text-white ml-auto max-w-[180px]">
                        The quick brown fox!
                      </div>
                      <div className="chat-bubble-lexi p-2.5 text-xs text-foreground max-w-[200px]">
                        Excellent! Perfect pronunciation! ⭐
                      </div>
                    </div>
                    <div className="p-2 bg-white border-t border-border flex items-center gap-2">
                      <div className="flex-1 bg-accent rounded-full px-3 py-1.5 text-xs text-muted-foreground">
                        Type a message...
                      </div>
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-8"
            >
              <div>
                <h2 className="text-4xl font-extrabold text-foreground mb-3">
                  Meet Your AI Tutor,{" "}
                  <span className="text-gradient-primary">Lexi</span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  Lexi is a friendly, intelligent AI tutor powered by advanced
                  language models. She adapts to your level and makes learning
                  English genuinely fun.
                </p>
              </div>
              <div className="flex flex-col gap-5">
                {LEXI_FEATURES.map(({ icon: Icon, text }, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-foreground font-medium text-base leading-relaxed pt-2">
                      {text}
                    </p>
                  </motion.div>
                ))}
              </div>
              <Link to="/ai-tutor" data-ocid="meet_lexi.primary_button">
                <Button
                  size="lg"
                  className="gradient-primary text-white border-0 font-bold w-fit shadow-md hover:opacity-90 transition-opacity"
                >
                  Chat with Lexi Now <MessageCircle className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Classio */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-foreground mb-3">
              Why Classio Connect?
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to become fluent in English
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {WHY_FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div
                  className={`w-16 h-16 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center`}
                >
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 gradient-primary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <img
              src="/assets/generated/lexi-owl-transparent.dim_400x400.png"
              alt="Lexi"
              className="w-20 h-20 object-contain drop-shadow-lg"
            />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Ready to start your English journey?
            </h2>
            <p className="text-white/80 text-lg">
              Join 50,000+ learners improving their English with Lexi every day.
            </p>
            {identity ? (
              <Link to="/courses" data-ocid="cta.primary_button">
                <Button
                  size="lg"
                  className="bg-white text-primary font-bold text-base hover:bg-white/90 shadow-lg px-8"
                >
                  Browse Courses <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="bg-white text-primary font-bold text-base hover:bg-white/90 shadow-lg px-8"
                data-ocid="cta.primary_button"
              >
                Start Learning FREE <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
