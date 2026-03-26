import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  Filter,
  GraduationCap,
  Lock,
  MessageCircle,
  Mic,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Lesson } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  AgeGroup,
  CourseLevel,
  useAllCourses,
  useUserCompletions,
} from "../hooks/useQueries";

const AGE_GROUPS = [
  { value: "all", label: "All Ages" },
  { value: AgeGroup.kids, label: "Kids (5-10)" },
  { value: AgeGroup.teens, label: "Teens (11-17)" },
  { value: AgeGroup.adults, label: "Adults (18+)" },
];

const LEVELS = [
  { value: "all", label: "All Levels" },
  { value: CourseLevel.beginner, label: "Beginner" },
  { value: CourseLevel.intermediate, label: "Intermediate" },
  { value: CourseLevel.advanced, label: "Advanced" },
];

const LESSON_TYPE_ICONS: Record<string, typeof BookOpen> = {
  vocabulary: BookOpen,
  pronunciation: Mic,
  conversation: MessageCircle,
  grammar: GraduationCap,
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
};

const AGE_GRADIENT: Record<string, string> = {
  kids: "gradient-kids",
  teens: "gradient-teens",
  adults: "gradient-adults",
};

const SAMPLE_LESSONS: Lesson[] = [
  {
    id: 1n,
    title: "Hello & Introductions",
    description: "Learn to greet people and introduce yourself confidently.",
    level: CourseLevel.beginner,
    lessonType: "vocabulary" as any,
    ageGroup: AgeGroup.kids,
  },
  {
    id: 2n,
    title: "Colors & Numbers",
    description: "Master basic colors, numbers 1-20, and simple counting.",
    level: CourseLevel.beginner,
    lessonType: "vocabulary" as any,
    ageGroup: AgeGroup.kids,
  },
  {
    id: 3n,
    title: "Animals & Nature",
    description: "Explore vocabulary for common animals and nature words.",
    level: CourseLevel.beginner,
    lessonType: "vocabulary" as any,
    ageGroup: AgeGroup.kids,
  },
  {
    id: 4n,
    title: "School Vocabulary",
    description: "Essential words for classroom, subjects, and school life.",
    level: CourseLevel.beginner,
    lessonType: "vocabulary" as any,
    ageGroup: AgeGroup.teens,
  },
  {
    id: 5n,
    title: "Present Tense Grammar",
    description: "Understanding and using simple present tense in sentences.",
    level: CourseLevel.intermediate,
    lessonType: "grammar" as any,
    ageGroup: AgeGroup.teens,
  },
  {
    id: 6n,
    title: "Social Conversations",
    description: "How to chat with friends about hobbies, music, and trends.",
    level: CourseLevel.intermediate,
    lessonType: "conversation" as any,
    ageGroup: AgeGroup.teens,
  },
  {
    id: 7n,
    title: "Business Email Writing",
    description: "Craft professional emails that make the right impression.",
    level: CourseLevel.intermediate,
    lessonType: "grammar" as any,
    ageGroup: AgeGroup.adults,
  },
  {
    id: 8n,
    title: "Job Interview English",
    description: "Answer interview questions with clarity and confidence.",
    level: CourseLevel.advanced,
    lessonType: "conversation" as any,
    ageGroup: AgeGroup.adults,
  },
  {
    id: 9n,
    title: "Pronunciation Mastery",
    description: "Improve clarity with phonetics, stress, and intonation.",
    level: CourseLevel.advanced,
    lessonType: "pronunciation" as any,
    ageGroup: AgeGroup.adults,
  },
];

export function CoursesPage() {
  const { identity, login } = useInternetIdentity();
  const [ageFilter, setAgeFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const { data: courses, isLoading } = useAllCourses();
  const { data: completions = [] } = useUserCompletions();

  const displayCourses =
    courses && courses.length > 0 ? courses : SAMPLE_LESSONS;
  const filtered = displayCourses.filter((c) => {
    const ageOk = ageFilter === "all" || c.ageGroup === ageFilter;
    const levelOk = levelFilter === "all" || c.level === levelFilter;
    return ageOk && levelOk;
  });

  const completedIds = new Set(completions.map((c) => c.lessonId.toString()));

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary py-14">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Course Catalog
            </h1>
            <p className="text-white/80 text-lg">
              Explore all English lessons tailored for your age and level
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div
          className="flex flex-wrap gap-4 mb-8 items-center"
          data-ocid="courses.panel"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Filter className="w-4 h-4" /> Filter:
          </div>
          <div className="flex flex-wrap gap-2">
            {AGE_GROUPS.map((g) => (
              <button
                type="button"
                key={g.value}
                onClick={() => setAgeFilter(g.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  ageFilter === g.value
                    ? "gradient-primary text-white shadow-sm"
                    : "bg-white text-muted-foreground border border-border hover:border-primary hover:text-primary"
                }`}
                data-ocid="courses.tab"
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button
                type="button"
                key={l.value}
                onClick={() => setLevelFilter(l.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  levelFilter === l.value
                    ? "bg-foreground text-white shadow-sm"
                    : "bg-white text-muted-foreground border border-border hover:border-foreground hover:text-foreground"
                }`}
                data-ocid="courses.tab"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {!identity && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Login to track your progress and complete lessons
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => login()}
              className="gradient-primary text-white border-0 font-semibold"
              data-ocid="courses.primary_button"
            >
              Login / Sign Up
            </Button>
          </motion.div>
        )}

        {isLoading ? (
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="courses.loading_state"
          >
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
              <Skeleton key={k} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="courses.empty_state">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold text-foreground text-lg">
              No courses found
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((lesson, i) => {
              const Icon =
                LESSON_TYPE_ICONS[lesson.lessonType as string] ?? BookOpen;
              const isComplete = completedIds.has(lesson.id.toString());
              const gradientClass =
                AGE_GRADIENT[lesson.ageGroup as string] ?? "gradient-primary";
              return (
                <motion.div
                  key={lesson.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                  data-ocid={`courses.item.${i + 1}`}
                >
                  <div className={`${gradientClass} h-2`} />
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-10 h-10 rounded-xl ${gradientClass} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        <Badge
                          className={`text-xs font-medium ${LEVEL_COLORS[lesson.level as string] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {lesson.level}
                        </Badge>
                        {isComplete && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            ✓ Done
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">
                        {lesson.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground capitalize font-medium">
                      {lesson.ageGroup} · {lesson.lessonType as string}
                    </div>
                    {isComplete && <Progress value={100} className="h-1.5" />}
                    <div className="mt-auto pt-1">
                      {identity ? (
                        <Link
                          to="/lesson/$id"
                          params={{ id: lesson.id.toString() }}
                          data-ocid={`courses.item.${i + 1}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full font-semibold hover:border-primary hover:text-primary transition-colors"
                          >
                            {isComplete ? "Review" : "Start Lesson"}{" "}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full font-semibold"
                          onClick={() => login()}
                          data-ocid={`courses.item.${i + 1}`}
                        >
                          <Lock className="w-3.5 h-3.5 mr-1.5" /> Login to Start
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
