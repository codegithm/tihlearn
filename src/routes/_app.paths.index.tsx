import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Route as RouteIcon, Users } from "lucide-react";
import { learningPaths, progress as allProgress } from "@/lib/mock-data";
import { useAzureProfile, useRole } from "@/lib/role-store";

export const Route = createFileRoute("/_app/paths/")({
  head: () => ({
    meta: [
      { title: "Learning Paths — TIH Learn" },
      {
        name: "description",
        content: "Structured, sequenced learning tracks assigned to TIH employees and teams.",
      },
    ],
  }),
  component: PathsPage,
});

function PathsPage() {
  const [role] = useRole();
  const employeeId = useAzureProfile()?.employee.id ?? "";
  const visible =
    role === "manager"
      ? learningPaths
      : learningPaths.filter((p) => p.assignedTo.includes(employeeId));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Learning paths</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {role === "manager"
              ? "All paths in your organisation."
              : "Paths currently assigned to you."}
          </p>
        </div>
        {role === "manager" && (
          <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link to="/manager/assign">Create path</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((path) => {
          const done = path.courseIds.filter((cid) =>
            allProgress.find(
              (pr) =>
                pr.employeeId === employeeId && pr.courseId === cid && pr.status === "completed",
            ),
          ).length;
          const pct =
            role === "manager"
              ? Math.round(
                  (allProgress.filter(
                    (pr) =>
                      path.assignedTo.includes(pr.employeeId) &&
                      path.courseIds.includes(pr.courseId) &&
                      pr.status === "completed",
                  ).length /
                    (path.assignedTo.length * path.courseIds.length)) *
                    100,
                )
              : Math.round((done / path.courseIds.length) * 100);
          return (
            <Card key={path.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-brand">
                  <RouteIcon className="size-3.5" /> Learning path
                </div>
                <CardTitle className="text-lg">{path.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{path.description}</p>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{path.courseIds.length} courses</span>
                    <span>{pct}% complete</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="gap-1">
                    <Users className="size-3" /> {path.assignedTo.length} assigned
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <CalendarDays className="size-3" /> Due{" "}
                    {new Date(path.dueDate).toLocaleDateString()}
                  </Badge>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/paths/$id" params={{ id: path.id }}>
                    Open path
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
