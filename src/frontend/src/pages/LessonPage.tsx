import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Loader2,
  MessageCircle,
  Mic,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllCourses,
  useMarkLessonComplete,
  useUserCompletions,
} from "../hooks/useQueries";

const LESSON_TYPE_ICONS: Record<string, typeof BookOpen> = {
  vocabulary: BookOpen,
  pronunciation: Mic,
  conversation: MessageCircle,
  grammar: GraduationCap,
};

const STARS = ["s1", "s2", "s3", "s4", "s5"];

const SAMPLE_CONTENT = {
  sections: [
    {
      title: "Introduction",
      body: "Welcome to this lesson! In this session, you'll learn key vocabulary and practice using it in real conversations. Pay close attention to pronunciation tips from Lexi.",
    },
    {
      title: "Key Vocabulary",
      body: "Study these important words: \n• Hello / Hi — A friendly greeting\n• Goodbye / Bye — Saying farewell\n• Please — Polite request word\n• Thank you — Expressing gratitude\n• Sorry — Apologizing",
    },
    {
      title: "Practice Exercise",
      body: "Try using each word in a sentence. For example: 'Hello, my name is Alex.' Practice saying these out loud with Lexi for instant pronunciation feedback!",
    },
    {
      title: "Summary",
      body: "Great work! You've covered the basics of greeting and politeness. Continue to the AI Tutor to practice these words in a real conversation with Lexi.",
    },
  ],
};

export function LessonPage() {
  const { id } = useParams({ from: "/layout/lesson/$id" });
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const [score] = useState(100);
  const [completed, setCompleted] = useState(false);

  const { data: courses = [] } = useAllCourses();
  const { data: completions = [] } = useUserCompletions();
  const markComplete = useMarkLessonComplete();

  const lessonId = id ? BigInt(id) : null;
  const lesson = courses.find((c) => c.id === lessonId);
  const isCompleted =
    completions.some((c) => c.lessonId === lessonId) || completed;

  const Icon =
    LESSON_TYPE_ICONS[(lesson?.lessonType as string) ?? "vocabulary"] ??
    BookOpen;

  const handleComplete = async () => {
    if (!lessonId) return;
    try {
      await markComplete.mutateAsync({ lessonId, score: BigInt(score) });
      setCompleted(true);
      toast.success("Lesson completed! 🎉 Great job!");
    } catch {
      toast.error("Failed to mark lesson complete");
    }
  };

  if (!lesson && courses.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Lesson not found
          </h2>
          <Button
            onClick={() => navigate({ to: "/courses" })}
            variant="outline"
          >
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary py-10">
        <div className="max-w-4xl mx-auto px-6">
          <button
            type="button"
            onClick={() => navigate({ to: "/courses" })}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors"
            data-ocid="lesson.link"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </button>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-1">
                {lesson?.title ?? `Lesson #${id}`}
              </h1>
              <div className="flex items-center gap-3">
                {lesson && (
                  <>
                    <Badge className="bg-white/20 text-white border-0 capitalize">
                      {lesson.level}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-0 capitalize">
                      {lesson.ageGroup}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-0 capitalize">
                      {lesson.lessonType as string}
                    </Badge>
                  </>
                )}
                {isCompleted && (
                  <Badge className="bg-green-400/90 text-white border-0">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
            data-ocid="lesson.success_state"
          >
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-bold text-green-800">Lesson Completed!</p>
              <p className="text-sm text-green-600">
                You've finished this lesson. Keep up the great work!
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col gap-6">
          {SAMPLE_CONTENT.sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 card-shadow"
              data-ocid={`lesson.item.${i + 1}`}
            >
              <h3 className="text-lg font-bold text-foreground mb-3">
                {section.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-foreground">Lesson Progress</span>
            <div className="flex items-center gap-1">
              {STARS.map((k) => (
                <Star
                  key={k}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>
          <Progress value={isCompleted ? 100 : 60} className="h-2.5 mb-2" />
          <p className="text-sm text-muted-foreground">
            {isCompleted
              ? "100% — Lesson complete!"
              : "You're making great progress!"}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {!identity ? (
            <Button
              size="lg"
              onClick={() => login()}
              className="gradient-primary text-white border-0 font-bold shadow-md"
              data-ocid="lesson.primary_button"
            >
              Login to Mark Complete
            </Button>
          ) : isCompleted ? (
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: "/courses" })}
              className="font-semibold"
              data-ocid="lesson.link"
            >
              Browse More Lessons
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleComplete}
              disabled={markComplete.isPending}
              className="gradient-primary text-white border-0 font-bold shadow-md"
              data-ocid="lesson.primary_button"
            >
              {markComplete.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" /> Mark as Complete
                </>
              )}
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ to: "/ai-tutor" })}
            className="font-semibold"
            data-ocid="lesson.secondary_button"
          >
            <MessageCircle className="w-4 h-4 mr-2" /> Practice with Lexi
          </Button>
        </div>
      </div>
    </div>
  );
}
