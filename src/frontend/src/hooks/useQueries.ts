import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AgeGroup,
  CourseLevel,
  type Lesson,
  type UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useAllCourses() {
  const { actor, isFetching } = useActor();
  return useQuery<Lesson[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCourses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCoursesByAgeLevel(ageGroup: AgeGroup, level: CourseLevel) {
  const { actor, isFetching } = useActor();
  return useQuery<Lesson[]>({
    queryKey: ["courses", ageGroup, level],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCoursesByAgeLevel(ageGroup, level);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserStreak() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userStreak"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserStreak();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserCompletions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userCompletions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserLessonCompletions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useMarkLessonComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lessonId,
      score,
    }: { lessonId: bigint; score: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.markLessonComplete(lessonId, score);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCompletions"] });
      queryClient.invalidateQueries({ queryKey: ["userStreak"] });
    },
  });
}

export function useStartChatSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.startChatSession();
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      sessionId,
      message,
    }: { sessionId: bigint; message: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessageToTutor(sessionId, message);
    },
  });
}

export function useEndChatSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (sessionId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.endChatSession(sessionId);
    },
  });
}

export { AgeGroup, CourseLevel };
