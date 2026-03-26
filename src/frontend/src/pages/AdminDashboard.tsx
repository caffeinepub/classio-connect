import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Copy,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

type TeacherRecord = {
  id: bigint;
  name: string;
  email: string;
  createdAt: bigint;
};

type NavItem = "overview" | "teachers";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [activeNav, setActiveNav] = useState<NavItem>("overview");
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [createdTeacherId, setCreatedTeacherId] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("classio_role");
    if (role !== "admin") {
      navigate({ to: "/" });
    }
  }, [navigate]);

  useEffect(() => {
    if (!actor) return;
    setIsLoadingData(true);
    Promise.all([
      (actor as any).getAllTeachers(),
      (actor as any).getAllStudents(),
    ])
      .then(([teacherList, studentList]) => {
        setTeachers(teacherList || []);
        setTotalStudents((studentList || []).length);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setIsLoadingData(false));
  }, [actor]);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName || !newTeacherEmail) {
      toast.error("Name and email are required");
      return;
    }
    if (!actor) return;
    setIsAdding(true);
    try {
      const id = await (actor as any).createTeacher(
        newTeacherName.trim(),
        newTeacherEmail.trim(),
      );
      setCreatedTeacherId(String(id));
      setTeachers((prev) => [
        ...prev,
        {
          id,
          name: newTeacherName.trim(),
          email: newTeacherEmail.trim(),
          createdAt: BigInt(Date.now()),
        },
      ]);
      setNewTeacherName("");
      setNewTeacherEmail("");
      toast.success("Teacher created successfully!");
    } catch {
      toast.error("Failed to create teacher");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTeacher = async (id: bigint) => {
    if (!actor) return;
    try {
      await (actor as any).deleteTeacher(id);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      toast.success("Teacher deleted");
    } catch {
      toast.error("Failed to delete teacher");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("classio_role");
    navigate({ to: "/" });
  };

  const formatDate = (ts: bigint) => {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString();
  };

  const navItems = [
    { id: "overview" as NavItem, label: "Overview", icon: LayoutDashboard },
    { id: "teachers" as NavItem, label: "Manage Teachers", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="p-6 border-b border-sidebar-border">
          <img
            src="/assets/uploads/classio_logo_reel_compressed-019d290d-aec1-724b-a11c-a9a7f8c9394d-1.jpeg"
            alt="Classio"
            className="h-9 w-auto rounded object-contain"
          />
          <div className="mt-3">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Admin Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              data-ocid={`admin_nav.${id}.tab`}
              onClick={() => setActiveNav(id)}
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
            data-ocid="admin.logout_button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto scrollbar-dark">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              {activeNav === "overview"
                ? "Dashboard Overview"
                : "Manage Teachers"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Admin • Classio Connect
            </p>
          </div>
          {activeNav === "teachers" && (
            <Dialog
              open={addModalOpen}
              onOpenChange={(o) => {
                setAddModalOpen(o);
                if (!o) setCreatedTeacherId(null);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  data-ocid="admin.add_teacher.open_modal_button"
                  size="sm"
                  className="gradient-cyan text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                </DialogHeader>
                {createdTeacherId ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div
                      data-ocid="admin.teacher_created.success_state"
                      className="rounded-xl border border-success/30 bg-success/10 p-5 text-center"
                    >
                      <div className="text-3xl mb-2">🎉</div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Teacher created! Share this ID:
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <span className="text-3xl font-bold text-primary font-display">
                          {createdTeacherId}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(createdTeacherId);
                            toast.success("Copied!");
                          }}
                          className="p-1.5 rounded-lg hover:bg-accent"
                        >
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Teacher will use this ID + their email to login
                      </p>
                    </div>
                    <Button
                      data-ocid="admin.teacher_created.close_button"
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setAddModalOpen(false);
                        setCreatedTeacherId(null);
                      }}
                    >
                      Done
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleAddTeacher} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        data-ocid="admin.teacher_name.input"
                        placeholder="e.g. Priya Sharma"
                        value={newTeacherName}
                        onChange={(e) => setNewTeacherName(e.target.value)}
                        className="bg-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        data-ocid="admin.teacher_email.input"
                        type="email"
                        placeholder="teacher@school.com"
                        value={newTeacherEmail}
                        onChange={(e) => setNewTeacherEmail(e.target.value)}
                        className="bg-secondary"
                      />
                    </div>
                    <Button
                      data-ocid="admin.add_teacher.submit_button"
                      type="submit"
                      disabled={isAdding}
                      className="w-full gradient-cyan text-primary-foreground"
                    >
                      {isAdding ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {isAdding ? "Creating..." : "Create Teacher"}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          )}
        </header>

        <div className="p-8">
          {activeNav === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  data-ocid="admin.teachers_count.card"
                  className="card-dark rounded-2xl p-6 flex items-center gap-5"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold font-display">
                      {isLoadingData ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        teachers.length
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Total Teachers
                    </p>
                  </div>
                </div>
                <div
                  data-ocid="admin.students_count.card"
                  className="card-dark rounded-2xl p-6 flex items-center gap-5"
                >
                  <div className="w-14 h-14 rounded-xl bg-success/15 flex items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-success" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold font-display">
                      {isLoadingData ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        totalStudents
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Total Students
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-dark rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveNav("teachers")}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                  >
                    <span className="text-2xl">👩‍🏫</span>
                    <div>
                      <p className="font-medium text-sm">Manage Teachers</p>
                      <p className="text-xs text-muted-foreground">
                        Add or remove teachers
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav("teachers");
                      setAddModalOpen(true);
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                  >
                    <span className="text-2xl">➕</span>
                    <div>
                      <p className="font-medium text-sm">Add New Teacher</p>
                      <p className="text-xs text-muted-foreground">
                        Create a teacher account
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeNav === "teachers" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="card-dark rounded-2xl overflow-hidden">
                {isLoadingData ? (
                  <div
                    data-ocid="admin.teachers.loading_state"
                    className="flex items-center justify-center py-16"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : teachers.length === 0 ? (
                  <div
                    data-ocid="admin.teachers.empty_state"
                    className="text-center py-16"
                  >
                    <span className="text-5xl">👩‍🏫</span>
                    <p className="mt-4 text-muted-foreground">
                      No teachers yet. Add your first teacher!
                    </p>
                  </div>
                ) : (
                  <Table data-ocid="admin.teachers.table">
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">
                          ID
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Name
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Email
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
                      {teachers.map((teacher, i) => (
                        <TableRow
                          key={String(teacher.id)}
                          data-ocid={`admin.teachers.item.${i + 1}`}
                          className="border-border hover:bg-accent/30"
                        >
                          <TableCell className="font-mono text-primary font-semibold">
                            {String(teacher.id)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {teacher.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {teacher.email}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(teacher.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Button
                              data-ocid={`admin.teachers.delete_button.${i + 1}`}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTeacher(teacher.id)}
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
        </div>
      </main>
    </div>
  );
}
