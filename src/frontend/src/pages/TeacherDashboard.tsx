import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  Loader2,
  LogOut,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

type StudentRecord = {
  id: bigint;
  schoolName: string;
  studentName: string;
  mobileNumber: string;
  teacherId: bigint;
  createdAt: bigint;
};

type ActivityReport = {
  id: bigint;
  studentId: bigint;
  moduleName: string;
  score: bigint;
  totalQuestions: bigint;
  performanceRemark: string;
  completedAt: bigint;
};

type NavItem = "students" | "add" | "reports";

function getScoreColor(score: number) {
  if (score >= 90) return "bg-green-100 text-green-700 border-green-300";
  if (score >= 70) return "bg-blue-100 text-blue-700 border-blue-300";
  if (score >= 50) return "bg-yellow-100 text-yellow-700 border-yellow-300";
  return "bg-red-100 text-red-700 border-red-300";
}

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [activeNav, setActiveNav] = useState<NavItem>("students");
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const [sSchool, setSSchool] = useState("");
  const [sName, setSName] = useState("");
  const [sMobile, setSMobile] = useState("");
  const [sGrade, setSGrade] = useState("");
  const [studentGrades, setStudentGrades] = useState<Record<string, string>>(
    {},
  );
  const [isAdding, setIsAdding] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<{
    school: string;
    name: string;
    mobile: string;
  } | null>(null);

  const [reports, setReports] = useState<ActivityReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("classio_role");
    if (role !== "teacher") {
      navigate({ to: "/" });
      return;
    }
    const id = localStorage.getItem("classio_teacher_id") || "";
    const name = localStorage.getItem("classio_teacher_name") || "Teacher";
    setTeacherId(id);
    setTeacherName(name);
  }, [navigate]);

  useEffect(() => {
    if (!actor || !teacherId) return;
    setIsLoadingData(true);
    actor
      .getStudentsByTeacher(BigInt(teacherId))
      .then((list: StudentRecord[]) => {
        setStudents(list || []);
        const grades: Record<string, string> = {};
        for (const s of list || []) {
          const g = localStorage.getItem(`classio_grade_${String(s.id)}`);
          if (g) grades[String(s.id)] = g;
        }
        setStudentGrades(grades);
      })
      .catch(() => toast.error("Failed to load students"))
      .finally(() => setIsLoadingData(false));
  }, [actor, teacherId]);

  useEffect(() => {
    if (activeNav !== "reports" || !actor || !teacherId) return;
    setIsLoadingReports(true);
    (actor as any)
      .getReportsByTeacher(BigInt(teacherId))
      .then((list: ActivityReport[]) => setReports(list || []))
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setIsLoadingReports(false));
  }, [activeNav, actor, teacherId]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sSchool || !sName || !sMobile) {
      toast.error("All fields are required");
      return;
    }
    if (sMobile.length < 10) {
      toast.error("Enter a valid mobile number");
      return;
    }
    if (!actor) return;
    setIsAdding(true);
    try {
      const id = await actor.createStudent(
        sSchool.trim(),
        sName.trim(),
        sMobile.trim(),
        BigInt(teacherId),
      );
      const newStudent: StudentRecord = {
        id,
        schoolName: sSchool.trim(),
        studentName: sName.trim(),
        mobileNumber: sMobile.trim(),
        teacherId: BigInt(teacherId),
        createdAt: BigInt(Date.now()),
      };
      setStudents((prev) => [...prev, newStudent]);
      if (sGrade) {
        localStorage.setItem(`classio_grade_${String(id)}`, sGrade);
        setStudentGrades((prev) => ({ ...prev, [String(id)]: sGrade }));
      }
      setCreatedStudent({
        school: sSchool.trim(),
        name: sName.trim(),
        mobile: sMobile.trim(),
      });
      setSSchool("");
      setSName("");
      setSMobile("");
      setSGrade("");
      toast.success("Student created successfully!");
    } catch {
      toast.error("Failed to create student");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteStudent = async (id: bigint) => {
    if (!actor) return;
    try {
      await actor.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success("Student removed");
    } catch {
      toast.error("Failed to delete student");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("classio_role");
    localStorage.removeItem("classio_teacher_id");
    localStorage.removeItem("classio_teacher_name");
    navigate({ to: "/" });
  };

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleDateString();
  const formatReportDate = (ts: bigint) => {
    const n = Number(ts);
    // Handle both ms and ns timestamps
    const ms = n > 1e15 ? n / 1_000_000 : n;
    return new Date(ms).toLocaleDateString();
  };

  const getStudentName = (studentId: bigint) => {
    const s = students.find((st) => BigInt(String(st.id)) === studentId);
    return s ? s.studentName : `Student #${String(studentId)}`;
  };

  const avgClassScore =
    reports.length > 0
      ? Math.round(
          reports.reduce((a, r) => a + Number(r.score), 0) / reports.length,
        )
      : null;

  const navItems = [
    { id: "students" as NavItem, label: "My Students", icon: Users },
    { id: "add" as NavItem, label: "Add Student", icon: Plus },
    { id: "reports" as NavItem, label: "Reports", icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="p-6 border-b border-sidebar-border">
          <img
            src="/assets/classio_logo_reel_compressed-019d290d-aec1-724b-a11c-a9a7f8c9394d.jpeg"
            alt="Classio"
            className="h-9 w-auto rounded object-contain"
          />
          <div className="mt-3">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">
              Teacher Panel
            </p>
            <p className="text-sm font-medium mt-1 truncate">{teacherName}</p>
            <p className="text-xs text-muted-foreground">ID: {teacherId}</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              data-ocid={`teacher_nav.${id}.tab`}
              onClick={() => {
                setActiveNav(id);
                setCreatedStudent(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeNav === id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <button
            type="button"
            data-ocid="teacher.logout_button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-8 py-4">
          <h1 className="text-xl font-bold">
            {activeNav === "students"
              ? "My Students"
              : activeNav === "add"
                ? "Add New Student"
                : "Student Reports"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Teacher • {teacherName}
          </p>
        </header>

        <div className="p-8">
          {activeNav === "students" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="rounded-2xl overflow-hidden border border-border bg-white">
                {isLoadingData ? (
                  <div
                    data-ocid="teacher.students.loading_state"
                    className="flex items-center justify-center py-16"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : students.length === 0 ? (
                  <div
                    data-ocid="teacher.students.empty_state"
                    className="text-center py-16"
                  >
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No students yet.</p>
                    <Button
                      size="sm"
                      className="mt-4 gradient-cyan text-primary-foreground"
                      onClick={() => setActiveNav("add")}
                    >
                      Add your first student
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 text-sm text-blue-700">
                      <span>💡</span>
                      <span>
                        Assign a grade level (1–10) to each student. This sets
                        the lesson difficulty for their modules.
                      </span>
                    </div>
                    <Table data-ocid="teacher.students.table">
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-muted-foreground">
                            ID
                          </TableHead>
                          <TableHead className="text-muted-foreground">
                            Name
                          </TableHead>
                          <TableHead className="text-muted-foreground">
                            School
                          </TableHead>
                          <TableHead className="text-muted-foreground">
                            Mobile
                          </TableHead>
                          <TableHead className="text-muted-foreground">
                            Grade
                          </TableHead>
                          <TableHead className="text-muted-foreground">
                            Created
                          </TableHead>
                          <TableHead className="text-muted-foreground">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((s, i) => (
                          <TableRow
                            key={String(s.id)}
                            data-ocid={`teacher.students.item.${i + 1}`}
                            className="border-border hover:bg-accent/30"
                          >
                            <TableCell className="font-mono text-primary font-semibold">
                              {String(s.id)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {s.studentName}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {s.schoolName}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {s.mobileNumber}
                            </TableCell>
                            <TableCell>
                              <select
                                data-ocid={`teacher.students.grade.${i + 1}`}
                                className="text-sm border border-border rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                                value={studentGrades[String(s.id)] || ""}
                                onChange={(e) => {
                                  const g = e.target.value;
                                  const sid = String(s.id);
                                  if (g) {
                                    localStorage.setItem(
                                      `classio_grade_${sid}`,
                                      g,
                                    );
                                  } else {
                                    localStorage.removeItem(
                                      `classio_grade_${sid}`,
                                    );
                                  }
                                  setStudentGrades((prev) => ({
                                    ...prev,
                                    [sid]: g,
                                  }));
                                  toast.success(
                                    g
                                      ? `Grade ${g} assigned to ${s.studentName}`
                                      : "Grade removed",
                                  );
                                }}
                              >
                                <option value="">— Set Grade</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                                  <option key={g} value={String(g)}>
                                    Grade {g}
                                  </option>
                                ))}
                              </select>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDate(s.createdAt)}
                            </TableCell>
                            <TableCell>
                              <Button
                                data-ocid={`teacher.students.delete_button.${i + 1}`}
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteStudent(s.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeNav === "add" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg"
            >
              {createdStudent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-border bg-white p-8 text-center space-y-4"
                >
                  <div data-ocid="teacher.student_created.success_state">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="text-xl font-bold mb-2">Student Created!</h3>
                    <p className="text-muted-foreground text-sm mb-5">
                      Share these login credentials with the student:
                    </p>
                    <div className="space-y-2 text-left bg-secondary/50 rounded-xl p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">School:</span>
                        <span className="font-medium">
                          {createdStudent.school}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">
                          {createdStudent.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Mobile:</span>
                        <span className="font-medium">
                          {createdStudent.mobile}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      data-ocid="teacher.add_another.button"
                      className="flex-1 gradient-cyan text-primary-foreground"
                      onClick={() => setCreatedStudent(null)}
                    >
                      Add Another
                    </Button>
                    <Button
                      data-ocid="teacher.view_students.button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setCreatedStudent(null);
                        setActiveNav("students");
                      }}
                    >
                      View Students
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="rounded-2xl border border-border bg-white p-8">
                  <h2 className="text-lg font-bold mb-6">Add New Student</h2>
                  <form onSubmit={handleAddStudent} className="space-y-5">
                    <div className="space-y-2">
                      <Label>
                        School Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        data-ocid="teacher.student_school.input"
                        placeholder="e.g. Delhi Public School"
                        value={sSchool}
                        onChange={(e) => setSSchool(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Student Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        data-ocid="teacher.student_name.input"
                        placeholder="Student's full name"
                        value={sName}
                        onChange={(e) => setSName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Mobile Number{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        data-ocid="teacher.student_mobile.input"
                        type="tel"
                        placeholder="10-digit number"
                        value={sMobile}
                        onChange={(e) => setSMobile(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Grade Level{" "}
                        <span className="text-muted-foreground text-xs">
                          (optional)
                        </span>
                      </Label>
                      <select
                        data-ocid="teacher.student_grade.select"
                        className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={sGrade}
                        onChange={(e) => setSGrade(e.target.value)}
                      >
                        <option value="">Not assigned</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                          <option key={g} value={String(g)}>
                            Grade {g}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      data-ocid="teacher.add_student.submit_button"
                      type="submit"
                      disabled={isAdding}
                      className="w-full gradient-cyan text-primary-foreground h-11"
                    >
                      {isAdding ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {isAdding ? "Creating..." : "Create Student Account"}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          {activeNav === "reports" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {avgClassScore !== null && (
                <div className="rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 p-6 flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary">
                      {avgClassScore}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Class Average
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      Overall Class Performance
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {reports.length} report{reports.length !== 1 ? "s" : ""}{" "}
                      across all students
                    </p>
                  </div>
                </div>
              )}

              {/* Bar Chart */}
              {reports.length > 0 && (
                <div className="rounded-2xl border border-border bg-white p-6">
                  <h3 className="font-semibold text-sm text-gray-700 mb-4">
                    📈 Class Scores by Module
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={Array.from(
                        new Set(reports.map((r) => r.moduleName)),
                      ).map((mod) => {
                        const modReports = reports.filter(
                          (r) => r.moduleName === mod,
                        );
                        const avg = Math.round(
                          modReports.reduce((a, r) => a + Number(r.score), 0) /
                            modReports.length,
                        );
                        return {
                          name: mod.split(" ")[0],
                          avg,
                          fill:
                            avg >= 80
                              ? "#22c55e"
                              : avg >= 50
                                ? "#f59e0b"
                                : "#ef4444",
                        };
                      })}
                      margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value}%`,
                          "Avg Score",
                        ]}
                      />
                      <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                        {Array.from(
                          new Set(reports.map((r) => r.moduleName)),
                        ).map((mod) => {
                          const avg = Math.round(
                            reports
                              .filter((r) => r.moduleName === mod)
                              .reduce((a, r) => a + Number(r.score), 0) /
                              reports.filter((r) => r.moduleName === mod)
                                .length,
                          );
                          return (
                            <Cell
                              key={`cell-${mod}`}
                              fill={
                                avg >= 80
                                  ? "#22c55e"
                                  : avg >= 50
                                    ? "#f59e0b"
                                    : "#ef4444"
                              }
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="rounded-2xl overflow-hidden border border-border bg-white">
                {isLoadingReports ? (
                  <div
                    data-ocid="teacher.reports.loading_state"
                    className="flex items-center justify-center py-16"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : reports.length === 0 ? (
                  <div
                    data-ocid="teacher.reports.empty_state"
                    className="text-center py-16"
                  >
                    <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No student reports yet.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reports appear after students complete activities.
                    </p>
                  </div>
                ) : (
                  <Table data-ocid="teacher.reports.table">
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">
                          Student
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Module
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Score
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Performance
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((r, i) => {
                        const scoreNum = Number(r.score);
                        return (
                          <TableRow
                            key={String(r.id)}
                            data-ocid={`teacher.reports.item.${i + 1}`}
                            className="border-border hover:bg-accent/30"
                          >
                            <TableCell className="font-medium">
                              {getStudentName(r.studentId)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {r.moduleName}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`text-xs ${getScoreColor(scoreNum)}`}
                              >
                                {scoreNum}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs">
                              <p className="line-clamp-2">
                                {r.performanceRemark}
                              </p>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatReportDate(r.completedAt)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
