import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Lesson {
    id: bigint;
    title: string;
    description: string;
    level: CourseLevel;
    lessonType: LessonType;
    ageGroup: AgeGroup;
}
export interface StreakTracking {
    longestStreak: bigint;
    lastActive: Time;
    currentStreak: bigint;
}
export interface LessonCompletion {
    lessonId: bigint;
    completedAt: Time;
    score: bigint;
}
export interface UserProfile {
    courseLevel: CourseLevel;
    displayName: string;
    ageGroup: AgeGroup;
}
export interface http_header {
    value: string;
    name: string;
}
export enum AgeGroup {
    teens = "teens",
    kids = "kids",
    adults = "adults"
}
export enum CourseLevel {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced"
}
export enum LessonType {
    conversation = "conversation",
    grammar = "grammar",
    pronunciation = "pronunciation",
    vocabulary = "vocabulary"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface ActivityReport {
    id: bigint;
    studentId: bigint;
    moduleName: string;
    score: bigint;
    totalQuestions: bigint;
    performanceRemark: string;
    completedAt: bigint;
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createLesson(lesson: Lesson): Promise<bigint>;
    deleteLesson(lessonId: bigint): Promise<boolean>;
    endChatSession(sessionId: bigint): Promise<boolean>;
    getAllCourses(): Promise<Array<Lesson>>;
    getAllStreaks(): Promise<Array<StreakTracking>>;
    getAllStreaksByLongest(): Promise<Array<StreakTracking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoursesByAgeLevel(ageGroup: AgeGroup, level: CourseLevel): Promise<Array<Lesson>>;
    getUserLessonCompletions(): Promise<Array<LessonCompletion>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserStreak(): Promise<StreakTracking>;
    isCallerAdmin(): Promise<boolean>;
    markLessonComplete(lessonId: bigint, score: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessageToTutor(sessionId: bigint, message: string): Promise<string>;
    startChatSession(): Promise<bigint>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateLesson(lessonId: bigint, lesson: Lesson): Promise<boolean>;
    createTeacher(name: string, email: string): Promise<bigint>;
    deleteTeacher(teacherId: bigint): Promise<boolean>;
    getAllTeachers(): Promise<Array<TeacherRecord>>;
    getTeacherById(teacherId: bigint): Promise<TeacherRecord | null>;
    teacherLogin(teacherId: bigint, email: string): Promise<TeacherRecord | null>;
    createStudent(schoolName: string, studentName: string, mobileNumber: string, teacherId: bigint): Promise<bigint>;
    deleteStudent(studentId: bigint): Promise<boolean>;
    getStudentsByTeacher(teacherId: bigint): Promise<Array<StudentRecord>>;
    getAllStudents(): Promise<Array<StudentRecord>>;
    studentLogin(schoolName: string, studentName: string, mobileNumber: string): Promise<StudentRecord | null>;
    updateStudentProgress(studentId: bigint, currentModule: string, currentLesson: bigint): Promise<boolean>;
    getStudentProgress(studentId: bigint): Promise<StudentProgress | null>;
    saveActivityReport(studentId: bigint, moduleName: string, score: bigint, totalQuestions: bigint, performanceRemark: string): Promise<bigint>;
    getReportsByStudent(studentId: bigint): Promise<Array<ActivityReport>>;
    getReportsByTeacher(teacherId: bigint): Promise<Array<ActivityReport>>;
    getAllReports(): Promise<Array<ActivityReport>>;
}
export interface TeacherRecord {
    id: bigint;
    name: string;
    email: string;
    createdAt: bigint;
}
export interface StudentRecord {
    id: bigint;
    schoolName: string;
    studentName: string;
    mobileNumber: string;
    teacherId: bigint;
    createdAt: bigint;
}
export interface StudentProgress {
    currentModule: string;
    currentLesson: bigint;
    lastUpdated: bigint;
}
