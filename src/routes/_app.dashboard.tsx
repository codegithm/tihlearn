import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  PlayCircle,
  Route as RouteIcon,
  TrendingUp,
} from "lucide-react";
import {
  assignedPathsFor,
  employeeStats,
  getCourse,
  progress as allProgress,
} from "@/lib/mock-data";
import { useAzureProfile } from "@/lib/role-store";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TIH Learn" },
      {
        name: "description",
        content: "Your assigned learning, in-progress courses and upcoming deadlines.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const profile = useAzureProfile();
  const employeeId = profile?.employee.id ?? "";
  const stats = employeeStats(employeeId);
  const paths = assignedPathsFor(employeeId);
  const inProgress = allProgress.filter(
    (p) => p.employeeId === employeeId && p.status === "in_progress",
  );

  const kpis = [
    { icon: RouteIcon, label: "Learning paths", value: stats.pathCount },
    { icon: BookOpen, label: "Courses assigned", value: stats.coursesAssigned },
    { icon: CheckCircle2, label: "Completed", value: stats.completed },
    { icon: Clock, label: "Time this month", value: `${stats.timeSpentMin}m` },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {profile?.employee.name.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You have {inProgress.length} courses in progress and {stats.completionPct}% overall path
            completion.
          </p>
        </div>
        <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Link to="/courses">Browse the library</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="border-border/60">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <k.icon className="size-4 text-muted-foreground" />
                <TrendingUp className="size-3 text-success" />
              </div>
              <div className="mt-3 text-2xl font-semibold">{k.value}</div>
              <div className="text-xs text-muted-foreground">{k.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Continue learning</h2>
            <Link to="/my-learning" className="text-sm text-brand hover:underline">
              View all
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {inProgress.map((p) => {
              const c = getCourse(p.courseId)!;
              return (
                <Card key={c.id} className="overflow-hidden">
                  <div className={`h-28 bg-gradient-to-br ${c.cover}`} />
                  <CardContent className="space-y-3 pt-4">
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {c.category}
                    </Badge>
                    <h3 className="line-clamp-2 text-sm font-semibold leading-tight">{c.title}</h3>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{p.percent}% complete</span>
                        <span>{p.timeSpentMin}m spent</span>
                      </div>
                      <Progress value={p.percent} className="h-1.5" />
                    </div>
                    <Button asChild size="sm" variant="secondary" className="w-full">
                      <Link to="/courses/$id" params={{ id: c.id }}>
                        <PlayCircle className="size-4" /> Resume
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your paths</h2>
          {paths.map((path) => {
            const done = path.courseIds.filter((cid) =>
              allProgress.find(
                (pr) => pr.employeeId === me.id && pr.courseId === cid && pr.status === "completed",
              ),
            ).length;
            const pct = Math.round((done / path.courseIds.length) * 100);
            return (
              <Card key={path.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{path.title}</CardTitle>
                  <CardDescription>
                    Due {new Date(path.dueDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {done}/{path.courseIds.length} courses
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                  <Button asChild size="sm" variant="outline" className="mt-4 w-full">
                    <Link to="/paths/$id" params={{ id: path.id }}>
                      Open path
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-dashed">
            <CardContent className="pt-6 text-center">
              <Flame className="mx-auto size-6 text-brand" />
              <div className="mt-2 text-sm font-medium">5-day learning streak</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Keep it going — 20 minutes today unlocks a new badge.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
