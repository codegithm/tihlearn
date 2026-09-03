import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, Circle, Lock } from "lucide-react";
import { getCourse, getPath, progressFor } from "@/lib/mock-data";
import { useAzureProfile } from "@/lib/role-store";

export const Route = createFileRoute("/_app/paths/$id")({
  loader: ({ params }) => {
    const path = getPath(params.id);
    if (!path) throw notFound();
    return { path };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.path.title ?? "Path"} — TIH Learn` },
      { name: "description", content: loaderData?.path.description ?? "TIH learning path" },
    ],
  }),
  component: PathDetail,
  notFoundComponent: () => <div className="p-8">Path not found.</div>,
  errorComponent: () => <div className="p-8">Failed to load path.</div>,
});

function PathDetail() {
  const { path } = Route.useLoaderData() as { path: import("@/lib/mock-data").LearningPath };
  const employeeId = useAzureProfile()?.employee.id ?? "";
  const rows = path.courseIds.map((cid: string) => ({
    course: getCourse(cid)!,
    p: progressFor(employeeId, cid),
  }));
  const completed = rows.filter((r) => r.p?.status === "completed").length;
  const pct = Math.round((completed / rows.length) * 100);
  let unlockedIndex = 0;
  rows.forEach((r, i) => {
    if (r.p?.status === "completed") unlockedIndex = i + 1;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/paths"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> All paths
      </Link>

      <div className="rounded-2xl border bg-gradient-to-br from-ink to-slate-800 p-8 text-white">
        <Badge className="bg-brand text-brand-foreground">Learning path</Badge>
        <h1 className="mt-3 text-3xl font-semibold">{path.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/80">{path.description}</p>
        <div className="mt-6">
          <div className="mb-1 flex items-center justify-between text-xs text-white/70">
            <span>
              {completed}/{rows.length} courses complete
            </span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="h-1.5 bg-white/15" />
        </div>
      </div>

      <ol className="space-y-3">
        {rows.map((r, i) => {
          const done = r.p?.status === "completed";
          const locked = i > unlockedIndex;
          return (
            <li key={r.course.id}>
              <Card className={locked ? "opacity-60" : ""}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${
                      done
                        ? "bg-success/15 text-success"
                        : locked
                          ? "bg-muted text-muted-foreground"
                          : "bg-brand/15 text-brand"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="size-5" />
                    ) : locked ? (
                      <Lock className="size-4" />
                    ) : (
                      <Circle className="size-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">
                      Step {i + 1} · {r.course.category}
                    </div>
                    <h3 className="text-sm font-semibold">{r.course.title}</h3>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {r.course.durationMin}m · {r.course.format} · {r.course.level}
                    </div>
                  </div>
                  <div className="w-32">
                    <Progress value={r.p?.percent ?? 0} className="h-1.5" />
                    <div className="mt-1 text-right text-[10px] text-muted-foreground">
                      {r.p?.percent ?? 0}%
                    </div>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant={done ? "outline" : "default"}
                    className={
                      !done && !locked ? "bg-brand text-brand-foreground hover:bg-brand/90" : ""
                    }
                    disabled={locked}
                  >
                    <Link to="/courses/$id" params={{ id: r.course.id }}>
                      {done ? "Review" : locked ? "Locked" : "Start"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
