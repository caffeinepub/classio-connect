import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AITutorPage } from "./pages/AITutorPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CoursesPage } from "./pages/CoursesPage";
import { LessonPage } from "./pages/LessonPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { StudentDashboard } from "./pages/StudentDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";

// Root for the new multi-role dashboards (no navbar/footer)
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background">
      <Outlet />
      <Toaster richColors position="top-right" theme="dark" />
    </div>
  ),
});

// Old layout route with Navbar/Footer (for legacy pages)
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const teacherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teacher",
  component: TeacherDashboard,
});

const studentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student",
  component: StudentDashboard,
});

const coursesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/courses",
  component: CoursesPage,
});

const lessonRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/lesson/$id",
  component: LessonPage,
});

const aiTutorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai-tutor",
  component: AITutorPage,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  adminRoute,
  teacherRoute,
  studentRoute,
  layoutRoute.addChildren([
    coursesRoute,
    lessonRoute,
    aiTutorRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
