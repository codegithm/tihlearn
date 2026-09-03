import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { assignedPathsFor, getCourse, progress as allProgress } from "@/lib/mock-data";
import { useAzureProfile } from "@/lib/role-store";
import { PlayCircle } from "lucide-react";

export const Route = createFileRoute("/_app/my-learning")({
  head: () => ({
    meta: [
      { title: "My Learning — TIH Learn" },
      {
        name: "description",
        content: "Your in-progress, upcoming and completed courses in one place.",
      },
    ],
  }),
  component: MyLearning,
});

function MyLearning() {
  const employeeId = useAzureProfile()?.employee.id ?? "";
  const paths = assignedPathsFor(employeeId);
  const courseIds = Array.from(new Set(paths.flatMap((p) => p.courseIds)));
  const rows = courseIds
    .map((id) => ({
      course: getCourse(id)!,
      p: allProgress.find((pr) => pr.employeeId === employeeId && pr.courseId === id),
    }))
    .filter((r) => r.course);

  const inProgress = rows.filter((r) => r.p?.status === "in_progress");
  const notStarted = rows.filter((r) => !r.p || r.p.status === "not_started");
  const completed = rows.filter((r) => r.p?.status === "completed");

  const Section = ({ list }: { list: typeof rows }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {list.map(({ course, p }) => (
        <Card key={course.id} className="overflow-hidden">
          <div className={`h-24 bg-gradient-to-br ${course.cover}`} />
          <CardContent className="space-y-3 pt-4">
            <Badge variant="secondary" className="text-[10px]">
              {course.category}
            </Badge>
            <h3 className="line-clamp-2 text-sm font-semibold">{course.title}</h3>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{p?.percent ?? 0}%</span>
                <span>{p?.timeSpentMin ?? 0}m spent</span>
              </div>
              <Progress value={p?.percent ?? 0} className="h-1.5" />
            </div>
            <Button asChild size="sm" variant="secondary" className="w-full">
              <Link to="/courses/$id" params={{ id: course.id }}>
                <PlayCircle className="size-4" />
                {p?.status === "completed"
                  ? "Review"
                  : p?.status === "in_progress"
                    ? "Resume"
                    : "Start"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
      {list.length === 0 && (
        <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </p>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My learning</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything assigned to you across all learning paths.
        </p>
      </div>

      <Tabs defaultValue="progress">
        <TabsList>
          <TabsTrigger value="progress">In progress ({inProgress.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({notStarted.length})</TabsTrigger>
          <TabsTrigger value="done">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="progress" className="mt-6">
          <Section list={inProgress} />
        </TabsContent>
        <TabsContent value="upcoming" className="mt-6">
          <Section list={notStarted} />
        </TabsContent>
        <TabsContent value="done" className="mt-6">
          <Section list={completed} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
