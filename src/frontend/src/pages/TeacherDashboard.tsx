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
import { BookOpen, Loader2, LogOut, Plus, Trash2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
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

type NavItem = "students" | "add";

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
  const [isAdding, setIsAdding] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<{
    school: string;
    name: string;
    mobile: string;
  } | null>(null);

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
      .then((list: StudentRecord[]) => setStudents(list || []))
      .catch(() => toast.error("Failed to load students"))
      .finally(() => setIsLoadingData(false));
  }, [actor, teacherId]);

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
      setCreatedStudent({
        school: sSchool.trim(),
        name: sName.trim(),
        mobile: sMobile.trim(),
      });
      setSSchool("");
      setSName("");
      setSMobile("");
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

  const navItems = [
    { id: "students" as NavItem, label: "My Students", icon: Users },
    { id: "add" as NavItem, label: "Add Student", icon: Plus },
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

      <main className="flex-1 overflow-auto scrollbar-dark">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-8 py-4">
          <h1 className="text-xl font-bold">
            {activeNav === "students" ? "My Students" : "Add New Student"}
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
              <div className="card-dark rounded-2xl overflow-hidden">
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
                  className="card-dark rounded-2xl p-8 text-center space-y-4"
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
                <div className="card-dark rounded-2xl p-8">
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
                        className="bg-secondary border-border"
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
                        className="bg-secondary border-border"
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
                        className="bg-secondary border-border"
                      />
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
        </div>
      </main>
    </div>
  );
}
