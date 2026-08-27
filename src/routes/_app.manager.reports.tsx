import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  employees,
  employeeStats,
  learningPaths,
  progress as allProgress,
  sessions,
} from "@/lib/mock-data";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/_app/manager/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Manager · TIH Learn" },
      {
        name: "description",
        content: "Compliance, session and performance reports exportable to CSV and PDF.",
      },
    ],
  }),
  component: ReportsPage,
});

function exportToast(kind: string) {
  toast.success(`${kind} export ready`, {
    description: "Your file will download shortly (mock).",
  });
}

function ReportsPage() {
  const complianceRate = Math.round(
    (allProgress.filter((p) => p.status === "completed").length / allProgress.length) * 100,
  );
  const avgSessionMin = Math.round(
    sessions.reduce((s, x) => s + x.durationMin, 0) / sessions.length,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Reports & analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Export learning data for HR, audit and performance reviews.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportToast("CSV")}>
            <Download className="size-4" /> CSV
          </Button>
          <Button
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={() => exportToast("PDF")}
          >
            <FileText className="size-4" /> PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Overall completion", value: `${complianceRate}%` },
          { label: "Avg. session length", value: `${avgSessionMin}m` },
          { label: "Total sessions", value: sessions.length },
          { label: "Employees tracked", value: employees.length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="text-2xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-lg font-semibold">Path completion by cohort</h2>
            <div className="space-y-4">
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
                  <div key={p.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{p.title}</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                    <div className="mt-1 text-xs text-muted-foreground">
                      {p.assignedTo.length} employees · Due{" "}
                      {new Date(p.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-lg font-semibold">Session log</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s) => {
                  const e = employees.find((emp) => emp.id === s.employeeId)!;
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className={`${e.avatarColor} text-white text-[10px]`}>
                              {e.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{e.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{s.courseTitle}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{s.durationMin}m</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 text-lg font-semibold">Employee compliance</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((e) => {
                const s = employeeStats(e.id);
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell>{e.department}</TableCell>
                    <TableCell>{s.coursesAssigned}</TableCell>
                    <TableCell>{s.completed}</TableCell>
                    <TableCell className="w-40">
                      <div className="flex items-center gap-2">
                        <Progress value={s.completionPct} className="h-1.5 flex-1" />
                        <span className="w-10 text-right text-xs text-muted-foreground">
                          {s.completionPct}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
