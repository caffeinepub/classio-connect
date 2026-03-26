import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle,
  Edit2,
  Flame,
  GraduationCap,
  Loader2,
  Save,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  AgeGroup,
  CourseLevel,
  useSaveProfile,
  useUserCompletions,
  useUserProfile,
  useUserStreak,
} from "../hooks/useQueries";

const AGE_GROUP_LABELS: Record<string, string> = {
  kids: "Kids (5-10)",
  teens: "Teens (11-17)",
  adults: "Adults (18+)",
};

const AGE_GROUP_GRADIENT: Record<string, string> = {
  kids: "gradient-kids",
  teens: "gradient-teens",
  adults: "gradient-adults",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner 🌱",
  intermediate: "Intermediate 🌟",
  advanced: "Advanced 🚀",
};

export function ProfilePage() {
  const { identity, login } = useInternetIdentity();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(AgeGroup.adults);
  const [level, setLevel] = useState<CourseLevel>(CourseLevel.beginner);

  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: streak } = useUserStreak();
  const { data: completions = [] } = useUserCompletions();
  const saveProfile = useSaveProfile();

  const displayName = profile?.displayName || "Learner";
  const userAgeGroup = (profile?.ageGroup as string) ?? "adults";

  const handleEdit = () => {
    setName(profile?.displayName ?? "");
    setAgeGroup((profile?.ageGroup as AgeGroup) ?? AgeGroup.adults);
    setLevel((profile?.courseLevel as CourseLevel) ?? CourseLevel.beginner);
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await saveProfile.mutateAsync({
        displayName: name,
        ageGroup,
        courseLevel: level,
      });
      setEditing(false);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-10 bg-white rounded-2xl card-shadow max-w-sm w-full mx-4"
          data-ocid="profile.card"
        >
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/classio-logo-transparent.dim_600x200.png"
              alt="Classio Connect"
              style={{ maxWidth: "200px", width: "100%", height: "auto" }}
            />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">
            Your Profile
          </h2>
          <p className="text-muted-foreground mb-6">
            Login to view your learning progress, streaks, and profile settings.
          </p>
          <Button
            onClick={() => login()}
            className="gradient-primary text-white border-0 font-bold w-full"
            data-ocid="profile.primary_button"
          >
            Login to Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        className={`${AGE_GROUP_GRADIENT[userAgeGroup] ?? "gradient-primary"} py-16`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <div>
              {profileLoading ? (
                <Skeleton className="h-8 w-40 bg-white/30 mb-2" />
              ) : (
                <h1 className="text-3xl font-extrabold text-white">
                  {displayName}
                </h1>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-white/20 text-white border-0 capitalize">
                  {AGE_GROUP_LABELS[userAgeGroup] ?? userAgeGroup}
                </Badge>
                <Badge className="bg-white/20 text-white border-0 capitalize">
                  {LEVEL_LABELS[(profile?.courseLevel as string) ?? "beginner"]}
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              delay: 0.1,
              icon: Flame,
              bg: "bg-orange-100",
              color: "text-orange-500",
              value: streak ? Number(streak.currentStreak) : 0,
              label: "Day Streak 🔥",
            },
            {
              delay: 0.15,
              icon: BookOpen,
              bg: "bg-blue-100",
              color: "text-blue-500",
              value: completions.length,
              label: "Lessons Done ✅",
            },
            {
              delay: 0.2,
              icon: Trophy,
              bg: "bg-yellow-100",
              color: "text-yellow-500",
              value: streak ? Number(streak.longestStreak) : 0,
              label: "Best Streak 🏆",
            },
          ].map(({ delay, icon: Icon, bg, color, value, label }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay }}
              className="bg-white rounded-2xl p-6 card-shadow text-center"
              data-ocid="profile.card"
            >
              <div
                className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3`}
              >
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className="text-3xl font-extrabold text-foreground">
                {value}
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-0.5">
                {label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-6 card-shadow mb-6"
          data-ocid="profile.card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Profile Settings
            </h2>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="font-semibold"
                data-ocid="profile.edit_button"
              >
                <Edit2 className="w-4 h-4 mr-1.5" /> Edit
              </Button>
            )}
          </div>

          {editing ? (
            <div className="flex flex-col gap-5">
              <div>
                <Label className="text-sm font-semibold mb-1.5 block">
                  Display Name
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl"
                  data-ocid="profile.input"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-1.5 block">
                  Age Group
                </Label>
                <Select
                  value={ageGroup}
                  onValueChange={(v) => setAgeGroup(v as AgeGroup)}
                >
                  <SelectTrigger
                    className="rounded-xl"
                    data-ocid="profile.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AgeGroup.kids}>Kids (5-10)</SelectItem>
                    <SelectItem value={AgeGroup.teens}>
                      Teens (11-17)
                    </SelectItem>
                    <SelectItem value={AgeGroup.adults}>
                      Adults (18+)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-semibold mb-1.5 block">
                  Course Level
                </Label>
                <Select
                  value={level}
                  onValueChange={(v) => setLevel(v as CourseLevel)}
                >
                  <SelectTrigger
                    className="rounded-xl"
                    data-ocid="profile.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CourseLevel.beginner}>
                      Beginner
                    </SelectItem>
                    <SelectItem value={CourseLevel.intermediate}>
                      Intermediate
                    </SelectItem>
                    <SelectItem value={CourseLevel.advanced}>
                      Advanced
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saveProfile.isPending}
                  className="gradient-primary text-white border-0 font-bold"
                  data-ocid="profile.save_button"
                >
                  {saveProfile.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save Profile
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  className="font-semibold"
                  data-ocid="profile.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">
                  Display Name
                </span>
                <span className="font-semibold text-foreground">
                  {profile?.displayName || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">
                  Age Group
                </span>
                <span className="font-semibold text-foreground capitalize">
                  {AGE_GROUP_LABELS[(profile?.ageGroup as string) ?? "adults"]}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Course Level
                </span>
                <span className="font-semibold text-foreground">
                  {LEVEL_LABELS[(profile?.courseLevel as string) ?? "beginner"]}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 card-shadow"
          data-ocid="profile.panel"
        >
          <h2 className="text-xl font-bold text-foreground mb-4">
            Recent Activity
          </h2>
          {completions.length === 0 ? (
            <div className="text-center py-10" data-ocid="profile.empty_state">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="font-semibold text-foreground">
                No lessons completed yet
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Start your first lesson to see your activity here!
              </p>
              <Link to="/courses">
                <Button
                  size="sm"
                  className="gradient-primary text-white border-0 font-semibold"
                  data-ocid="profile.primary_button"
                >
                  Browse Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {completions.slice(0, 5).map((c, i) => (
                <div
                  key={c.lessonId.toString()}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  data-ocid={`profile.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        Lesson #{c.lessonId.toString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(
                          Number(c.completedAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">
                    Score: {c.score.toString()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
