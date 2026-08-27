import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, Clock, Route as RouteIcon, TrendingUp, Users2 } from "lucide-react";
import {
  employees,
  employeeStats,
  learningPaths,
  progress as allProgress,
  sessions,
} from "@/lib/mock-data";
import { useAzureProfile } from "@/lib/role-store";

export const Route = createFileRoute("/_app/manager/report")({
  head: () => ({
    meta: [
      { title: "Manager Overview — TIH Learn" },
      {
        name: "description",
        content: "Team-wide learning KPIs, completion rates and recent activity.",
      },
    ],
  }),
  component: ManagerOverview,
});

function ManagerOverview() {
  const profile = useAzureProfile();
  // Azure AD /me/directReports — scope every metric to the manager's own team.
  const team = profile?.isManager ? profile.directReports : employees;
  const teamIds = team.map((e) => e.id);
  const teamProgress = allProgress.filter((p) => teamIds.includes(p.employeeId));
  const totalAssignments = teamProgress.length || 1;
  const completed = teamProgress.filter((p) => p.status === "completed").length;
  const inProgress = teamProgress.filter((p) => p.status === "in_progress").length;
  const completionPct = Math.round((completed / totalAssignments) * 100);
  const totalMin = teamProgress.reduce((s, p) => s + p.timeSpentMin, 0);

  const kpis = [
    { icon: Users2, label: "Direct reports", value: team.length },
    { icon: RouteIcon, label: "Active paths", value: learningPaths.length },
    { icon: CheckCircle2, label: "Completion rate", value: `${completionPct}%` },
    { icon: Clock, label: "Learning hours", value: `${Math.round(totalMin / 60)}h` },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Manager view</p>
          <h1 className="text-3xl font-semibold tracking-tight">Team learning overview</h1>
          {profile?.isManager && (
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.employee.name} · {team.length} direct reports from Azure AD
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/manager/reports">Export report</Link>
          </Button>
          <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link to="/manager/assign">Assign learning</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
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
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Employee progress</h2>
              <Link to="/manager/employees" className="text-sm text-brand hover:underline">
                View all
              </Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Paths</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((e) => {
                  const s = employeeStats(e.id);
                  return (
                    <TableRow key={e.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className={`${e.avatarColor} text-white text-xs`}>
                              {e.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{e.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {e.role} · {e.department}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{s.pathCount}</Badge>
                      </TableCell>
                      <TableCell className="w-56">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span>
                            {s.completed}/{s.coursesAssigned}
                          </span>
                          <span className="text-muted-foreground">{s.completionPct}%</span>
                        </div>
                        <Progress value={s.completionPct} className="h-1.5" />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {s.timeSpentMin}m
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-lg font-semibold">Recent activity</h2>
            <ul className="space-y-3">
              {sessions
                .filter((s) => teamIds.includes(s.employeeId))
                .slice(0, 6)
                .map((s) => {
                  const e = employees.find((emp) => emp.id === s.employeeId)!;
                  return (
                    <li key={s.id} className="flex gap-3 rounded-lg p-2 hover:bg-muted/60">
                      <Avatar className="size-8">
                        <AvatarFallback className={`${e.avatarColor} text-white text-xs`}>
                          {e.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-sm">
                        <div>
                          <span className="font-medium">{e.name}</span>{" "}
                          <span className="text-muted-foreground">— {s.courseTitle}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{s.activity}</div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {s.start} · {s.durationMin}m
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 text-lg font-semibold">Path completion</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {learningPaths.map((p) => {
              const total = p.assignedTo.length * p.courseIds.length;
              const done = allProgress.filter(
                (pr) =>
                  p.assignedTo.includes(pr.employeeId) &&
                  p.courseIds.includes(pr.courseId) &&
                  pr.status === "completed",
              ).length;
              const pct = Math.round((done / total) * 100);
              return (
                <div key={p.id} className="rounded-lg border p-4">
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {p.assignedTo.length} employees · {p.courseIds.length} courses
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>Completion</span>
                      <span>{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
