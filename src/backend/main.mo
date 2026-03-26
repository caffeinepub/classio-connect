import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type AgeGroup = { #kids; #teens; #adults };
  type LessonType = { #vocabulary; #pronunciation; #grammar; #conversation };
  type CourseLevel = { #beginner; #intermediate; #advanced };

  type Lesson = {
    id : Nat;
    title : Text;
    description : Text;
    lessonType : LessonType;
    ageGroup : AgeGroup;
    level : CourseLevel;
  };

  module Lesson {
    public func compare(l1 : Lesson, l2 : Lesson) : Order.Order {
      Nat.compare(l1.id, l2.id);
    };
  };

  type UserProfile = {
    displayName : Text;
    ageGroup : AgeGroup;
    courseLevel : CourseLevel;
  };

  type LessonCompletion = {
    lessonId : Nat;
    score : Nat;
    completedAt : Time.Time;
  };

  type Message = {
    sender : Text;
    content : Text;
    timestamp : Time.Time;
  };

  type ChatSession = {
    id : Nat;
    user : Principal;
    messages : List.List<Message>;
    startedAt : Time.Time;
    endedAt : ?Time.Time;
  };

  type StreakTracking = {
    currentStreak : Nat;
    lastActive : Time.Time;
    longestStreak : Nat;
  };

  module StreakTracking {
    public func compare(s1 : StreakTracking, s2 : StreakTracking) : Order.Order {
      switch (Nat.compare(s1.currentStreak, s2.currentStreak)) {
        case (#equal) { Nat.compare(s1.longestStreak, s2.longestStreak) };
        case (order) { order };
      };
    };
    public func compareByLongestStreak(s1 : StreakTracking, s2 : StreakTracking) : Order.Order {
      Nat.compare(s1.longestStreak, s2.longestStreak);
    };
  };

  type TeacherRecord = {
    id : Nat;
    name : Text;
    email : Text;
    createdAt : Time.Time;
  };

  type StudentRecord = {
    id : Nat;
    schoolName : Text;
    studentName : Text;
    mobileNumber : Text;
    teacherId : Nat;
    createdAt : Time.Time;
  };

  type StudentProgress = {
    currentModule : Text;
    currentLesson : Nat;
    lastUpdated : Time.Time;
  };

  let courses = Map.empty<Nat, Lesson>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userLessonCompletions = Map.empty<Principal, List.List<LessonCompletion>>();
  let chatSessions = Map.empty<Nat, ChatSession>();
  let userStreaks = Map.empty<Principal, StreakTracking>();
  var lessonIdCounter = 0;
  var chatSessionIdCounter = 0;

  let teachers = Map.empty<Nat, TeacherRecord>();
  let students = Map.empty<Nat, StudentRecord>();
  let studentProgress = Map.empty<Nat, StudentProgress>();
  var teacherIdCounter = 0;
  var studentIdCounter = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Teacher management - no caller auth (frontend handles role-based access)
  public shared func createTeacher(name : Text, email : Text) : async Nat {
    let id = teacherIdCounter;
    teachers.add(id, { id; name; email; createdAt = Time.now() });
    teacherIdCounter += 1;
    id;
  };

  public shared func deleteTeacher(teacherId : Nat) : async Bool {
    teachers.remove(teacherId);
    true;
  };

  public query func getAllTeachers() : async [TeacherRecord] {
    teachers.values().toArray();
  };

  public query func getTeacherById(teacherId : Nat) : async ?TeacherRecord {
    teachers.get(teacherId);
  };

  public query func teacherLogin(teacherId : Nat, email : Text) : async ?TeacherRecord {
    switch (teachers.get(teacherId)) {
      case (?t) {
        if (t.email.toLower() == email.toLower()) { ?t } else { null };
      };
      case (null) { null };
    };
  };

  // Student management
  public shared func createStudent(schoolName : Text, studentName : Text, mobileNumber : Text, teacherId : Nat) : async Nat {
    let id = studentIdCounter;
    students.add(id, { id; schoolName; studentName; mobileNumber; teacherId; createdAt = Time.now() });
    studentIdCounter += 1;
    id;
  };

  public shared func deleteStudent(studentId : Nat) : async Bool {
    students.remove(studentId);
    true;
  };

  public query func getStudentsByTeacher(teacherId : Nat) : async [StudentRecord] {
    students.values().toArray().filter(func(s : StudentRecord) : Bool { s.teacherId == teacherId });
  };

  public query func getAllStudents() : async [StudentRecord] {
    students.values().toArray();
  };

  public query func studentLogin(schoolName : Text, studentName : Text, mobileNumber : Text) : async ?StudentRecord {
    let matches = students.values().toArray().filter(func(s : StudentRecord) : Bool {
      s.schoolName.toLower() == schoolName.toLower() and
      s.studentName.toLower() == studentName.toLower() and
      s.mobileNumber == mobileNumber
    });
    if (matches.size() > 0) { ?matches[0] } else { null };
  };

  public shared func updateStudentProgress(studentId : Nat, currentModule : Text, currentLesson : Nat) : async Bool {
    studentProgress.add(studentId, { currentModule; currentLesson; lastUpdated = Time.now() });
    true;
  };

  public query func getStudentProgress(studentId : Nat) : async ?StudentProgress {
    studentProgress.get(studentId);
  };

  // Lesson/course functions
  func getUserProfileInternal(user : Principal) : UserProfile {
    switch (userProfiles.get(user)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User profile not found") };
    };
  };

  let dayDuration = 86_400_000_000_000;
  func toDayNum(time : Time.Time) : Int {
    time / dayDuration;
  };

  public shared ({ caller }) func createLesson(lesson : Lesson) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized");
    };
    let newLesson = { lesson with id = lessonIdCounter };
    courses.add(lessonIdCounter, newLesson);
    lessonIdCounter += 1;
    newLesson.id;
  };

  public shared ({ caller }) func updateLesson(lessonId : Nat, lesson : Lesson) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized");
    };
    if (not courses.containsKey(lessonId)) { Runtime.trap("Lesson not found") };
    courses.add(lessonId, { lesson with id = lessonId });
    true;
  };

  public shared ({ caller }) func deleteLesson(lessonId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized");
    };
    if (not courses.containsKey(lessonId)) { Runtime.trap("Lesson not found") };
    courses.remove(lessonId);
    true;
  };

  public query func getAllCourses() : async [Lesson] {
    courses.values().toArray().sort();
  };

  public query func getCoursesByAgeLevel(ageGroup : AgeGroup, level : CourseLevel) : async [Lesson] {
    courses.values().toArray().filter(func(c : Lesson) : Bool { c.ageGroup == ageGroup and c.level == level });
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func markLessonComplete(lessonId : Nat, score : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let completion : LessonCompletion = { lessonId; score; completedAt = Time.now() };
    let current = switch (userLessonCompletions.get(caller)) {
      case (?c) { c };
      case (null) { List.empty<LessonCompletion>() };
    };
    current.add(completion);
    userLessonCompletions.add(caller, current);
    updateStreakInternal(caller);
  };

  public query ({ caller }) func getUserLessonCompletions() : async [LessonCompletion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (userLessonCompletions.get(caller)) {
      case (?c) { c.toArray() };
      case (null) { [] };
    };
  };

  func updateStreakInternal(user : Principal) {
    let currentTimeDay = toDayNum(Time.now());
    let currentStreak = switch (userStreaks.get(user)) {
      case (?streak) {
        if (toDayNum(streak.lastActive) == currentTimeDay) { streak.currentStreak }
        else if (toDayNum(streak.lastActive) == currentTimeDay - 1) { streak.currentStreak + 1 }
        else { 1 };
      };
      case (null) { 1 };
    };
    let updatedStreak = {
      currentStreak;
      lastActive = Time.now();
      longestStreak = switch (userStreaks.get(user)) {
        case (?s) { if (currentStreak > s.longestStreak) { currentStreak } else { s.longestStreak } };
        case (null) { 1 };
      };
    };
    userStreaks.add(user, updatedStreak);
  };

  public shared ({ caller }) func startChatSession() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let session : ChatSession = {
      id = chatSessionIdCounter;
      user = caller;
      messages = List.empty<Message>();
      startedAt = Time.now();
      endedAt = null;
    };
    chatSessions.add(chatSessionIdCounter, session);
    chatSessionIdCounter += 1;
    session.id;
  };

  public shared ({ caller }) func sendMessageToTutor(sessionId : Nat, message : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let userMessage : Message = { sender = "user"; content = message; timestamp = Time.now() };
    let session = getSessionInternal(sessionId, caller);
    session.messages.add(userMessage);
    let prompt = buildPrompt(session.user, message);
    let aiResponse = await makeAIRequest(prompt);
    let aiMessage : Message = { sender = "ai"; content = aiResponse; timestamp = Time.now() };
    session.messages.add(aiMessage);
    aiResponse;
  };

  public shared ({ caller }) func endChatSession(sessionId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let session = getSessionInternal(sessionId, caller);
    chatSessions.add(sessionId, { session with endedAt = ?Time.now() });
    true;
  };

  func getSessionInternal(sessionId : Nat, caller : Principal) : ChatSession {
    switch (chatSessions.get(sessionId)) {
      case (null) { Runtime.trap("Chat session not found") };
      case (?session) {
        if (session.user != caller) { Runtime.trap("Unauthorized") };
        session;
      };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func buildPrompt(user : Principal, message : Text) : Text {
    let profile = getUserProfileInternal(user);
    let ageGroupPrompt = switch (profile.ageGroup) {
      case (#kids) { "Encourage kids with simple language." };
      case (#teens) { "Use relatable examples for teenagers." };
      case (#adults) { "Provide practical examples for adults." };
    };
    "You are Lexi, a friendly English tutor. " # ageGroupPrompt # " Student says: " # message;
  };

  func makeAIRequest(prompt : Text) : async Text {
    let url = "https://ai.api/classio";
    let body = "{ \"prompt\": \"" # prompt # "\" }";
    await OutCall.httpPostRequest(url, [], body, transform);
  };

  public query ({ caller }) func getUserStreak() : async StreakTracking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (userStreaks.get(caller)) {
      case (?s) { s };
      case (null) { { currentStreak = 0; lastActive = 0; longestStreak = 0 } };
    };
  };
};
