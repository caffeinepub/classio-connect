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
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

type TeacherRecord = {
  id: bigint;
  name: string;
  email: string;
  createdAt: bigint;
};

type NavItem = "overview" | "teachers";

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 4,
  delayMs = 2000,
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error("Unreachable");
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const [activeNav, setActiveNav] = useState<NavItem>("overview");
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loadError, setLoadError] = useState(false);
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

  const loadData = useCallback(async (currentActor: typeof actor) => {
    if (!currentActor) return;
    setLoadError(false);
    setIsLoadingData(true);
    try {
      const [teacherList, studentList] = await withRetry(() =>
        Promise.all([
          currentActor.getAllTeachers(),
          currentActor.getAllStudents(),
        ]),
      );
      setTeachers(teacherList || []);
      setTotalStudents((studentList || []).length);
    } catch {
      setLoadError(true);
      toast.error("Could not connect to the server. Please retry.");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!actor) return;
    loadData(actor);
  }, [actor, loadData]);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName || !newTeacherEmail) {
      toast.error("Name and email are required");
      return;
    }
    if (!actor) {
      toast.error(
        "System is still loading. Please wait a moment and try again.",
      );
      return;
    }
    setIsAdding(true);
    try {
      const id = await actor.createTeacher(
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
      await actor.deleteTeacher(id);
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
            src="/assets/uploads/classio_logo_reel_compressed-019d30f8-ddb7-741d-bf46-362f4478c78e-1.jpeg"
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

        {/* Education Illustration */}
        <div className="px-4 py-5 flex justify-center">
          <svg
            width="160"
            height="130"
            viewBox="0 0 160 130"
            role="img"
            aria-label="Education illustration"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Desk */}
            <rect
              x="20"
              y="100"
              width="120"
              height="8"
              rx="4"
              fill="oklch(0.88 0.02 250)"
            />
            {/* Book stack */}
            <rect
              x="30"
              y="76"
              width="36"
              height="6"
              rx="2"
              fill="oklch(0.55 0.2 255)"
            />
            <rect
              x="32"
              y="70"
              width="32"
              height="6"
              rx="2"
              fill="oklch(0.65 0.18 280)"
            />
            <rect
              x="34"
              y="64"
              width="28"
              height="6"
              rx="2"
              fill="oklch(0.55 0.22 300)"
            />
            {/* Open book */}
            <path
              d="M75 60 Q80 56 85 60 L85 90 Q80 86 75 90 Z"
              fill="oklch(0.94 0.01 240)"
              stroke="oklch(0.55 0.2 255)"
              strokeWidth="1.5"
            />
            <path
              d="M85 60 Q90 56 95 60 L95 90 Q90 86 85 90 Z"
              fill="oklch(0.94 0.01 240)"
              stroke="oklch(0.55 0.2 255)"
              strokeWidth="1.5"
            />
            <line
              x1="85"
              y1="60"
              x2="85"
              y2="90"
              stroke="oklch(0.55 0.2 255)"
              strokeWidth="1"
            />
            {/* Lines on book */}
            <line
              x1="78"
              y1="70"
              x2="83"
              y2="70"
              stroke="oklch(0.75 0.1 255)"
              strokeWidth="1"
            />
            <line
              x1="78"
              y1="75"
              x2="83"
              y2="75"
              stroke="oklch(0.75 0.1 255)"
              strokeWidth="1"
            />
            <line
              x1="78"
              y1="80"
              x2="83"
              y2="80"
              stroke="oklch(0.75 0.1 255)"
              strokeWidth="1"
            />
            <line
              x1="87"
              y1="70"
              x2="92"
              y2="70"
              stroke="oklch(0.75 0.1 255)"
              strokeWidth="1"
            />
            <line
              x1="87"
              y1="75"
              x2="92"
              y2="75"
              stroke="oklch(0.75 0.1 255)"
              strokeWidth="1"
            />
            <line
              x1="87"
              y1="80"
              x2="92"
              y2="80"
              stroke="oklch(0.75 0.1 255)"
              strokeWidth="1"
            />
            {/* Graduation cap */}
            <rect
              x="98"
              y="35"
              width="32"
              height="6"
              rx="1"
              fill="oklch(0.55 0.2 255)"
            />
            <polygon points="114,22 98,35 130,35" fill="oklch(0.45 0.22 270)" />
            <circle cx="114" cy="22" r="4" fill="oklch(0.55 0.2 255)" />
            {/* Tassel */}
            <line
              x1="130"
              y1="35"
              x2="134"
              y2="50"
              stroke="oklch(0.55 0.22 300)"
              strokeWidth="1.5"
            />
            <circle cx="134" cy="52" r="2.5" fill="oklch(0.55 0.22 300)" />
            {/* Stars */}
            <circle cx="42" cy="30" r="2" fill="oklch(0.65 0.2 50)" />
            <circle cx="55" cy="20" r="1.5" fill="oklch(0.55 0.2 255)" />
            <circle cx="68" cy="32" r="1" fill="oklch(0.55 0.22 300)" />
            <circle cx="140" cy="55" r="1.5" fill="oklch(0.65 0.2 50)" />
          </svg>
        </div>

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
          <div className="flex items-center gap-2">
            {loadError && (
              <Button
                data-ocid="admin.retry.button"
                size="sm"
                variant="outline"
                onClick={() => loadData(actor)}
                className="gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </Button>
            )}
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
                        disabled={isAdding || !actor}
                        className="w-full gradient-cyan text-primary-foreground"
                      >
                        {(isFetching && !actor) || isAdding ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isFetching && !actor
                          ? "Connecting..."
                          : isAdding
                            ? "Creating..."
                            : "Create Teacher"}
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>

        {/* Connecting banner */}
        {!actor && isFetching && (
          <div
            data-ocid="admin.connecting.loading_state"
            className="flex items-center gap-2 px-8 py-2.5 bg-primary/10 border-b border-primary/20 text-sm text-primary"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting to server, please wait...
          </div>
        )}

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
                ) : loadError ? (
                  <div
                    data-ocid="admin.teachers.error_state"
                    className="flex flex-col items-center justify-center py-16 gap-4"
                  >
                    <p className="text-muted-foreground text-center">
                      Could not load data. The server may still be warming up.
                    </p>
                    <Button
                      data-ocid="admin.teachers.retry.button"
                      size="sm"
                      variant="outline"
                      onClick={() => loadData(actor)}
                      className="gap-1.5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Retry
                    </Button>
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
