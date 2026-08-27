import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Route as RouteIcon,
  GraduationCap,
  Users2,
  BarChart3,
  Clock,
  Upload,
} from "lucide-react";
import { useRole } from "@/lib/role-store";

const employeeItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Learning", url: "/my-learning", icon: GraduationCap },
  { title: "Browse Courses", url: "/courses", icon: BookOpen },
  { title: "Learning Paths", url: "/paths", icon: RouteIcon },
  { title: "My Sessions", url: "/sessions", icon: Clock },
];

const managerItems = [
  { title: "Manager Overview", url: "/manager", icon: LayoutDashboard },
  { title: "Employees", url: "/manager/employees", icon: Users2 },
  { title: "Assign Learning", url: "/manager/assign", icon: RouteIcon },
  { title: "Upload Course", url: "/manager/courses/new", icon: Upload },
  { title: "Reports", url: "/manager/reports", icon: BarChart3 },
  { title: "Course Library", url: "/courses", icon: BookOpen },
];

export function AppSidebar() {
  const [role] = useRole();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) =>
    url === "/manager" ? pathname === "/manager" : pathname.startsWith(url);

  const items = role === "manager" ? managerItems : employeeItems;

  return (
    <aside className="sticky top-0 flex h-svh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-4 py-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-md bg-brand text-brand-foreground font-black">
            t
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">TIH Learn</div>
            <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
              {role === "manager" ? "Manager" : "Employee"}
            </div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/60">
          {role === "manager" ? "Manage" : "Learn"}
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const active = isActive(item.url);

            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="size-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
