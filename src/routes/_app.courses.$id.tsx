import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  PlayCircle,
  Radio,
  Star,
  Users,
} from "lucide-react";
import { getCourse, progressFor } from "@/lib/mock-data";
import { useAzureProfile } from "@/lib/role-store";
import { fmtTime, useCourseState } from "@/lib/learning-store";

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export const Route = createFileRoute("/_app/courses/$id")({
  loader: ({ params }) => {
    const course = getCourse(params.id);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.course.title ?? "Course"} — TIH Learn` },
      {
        name: "description",
        content: loaderData?.course.description ?? "TIH Learn course",
      },
      { property: "og:title", content: `${loaderData?.course.title ?? "Course"} — TIH Learn` },
      {
        property: "og:description",
        content: loaderData?.course.description ?? "TIH Learn course",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoursePage,
  notFoundComponent: () => <div className="p-8">Course not found.</div>,
  errorComponent: () => <div className="p-8">Failed to load course.</div>,
});

function CoursePage() {
  const { course } = Route.useLoaderData();
  const employeeId = useAzureProfile()?.employee.id ?? "";
  const seeded = progressFor(employeeId, course.id);
  const { state, update, log } = useCourseState(course.id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [activeLesson, setActiveLesson] = useState(1);
  const resumed = useRef(false);
  const lastSeek = useRef(0);

  const lessons = Array.from({ length: course.lessons }, (_, i) => ({
    idx: i + 1,
    title: `Lesson ${i + 1}: ${course.title.split(" ").slice(0, 3).join(" ")} — part ${i + 1}`,
    min: Math.round(course.durationMin / course.lessons),
    done: state.completedLessons.includes(i + 1),
  }));

  const percent =
    state.percent ||
    Math.round((state.completedLessons.length / course.lessons) * 100) ||
    (seeded?.percent ?? 0);

  // Session start + exit tracking
  useEffect(() => {
    log("session_start", `Opened "${course.title}"`);
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        const v = videoRef.current;
        updateExit(v?.currentTime ?? 0);
      }
    };
    const updateExit = (t: number) =>
      update({ positionSec: t }, { type: "exit", detail: `Left the course at ${fmtTime(t)}` });
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      updateExit(videoRef.current?.currentTime ?? state.positionSec);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  // Time-spent ticker while playing
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      update({ timeSpentSec: (state.timeSpentSec ?? 0) + 10 });
    }, 10000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, state.timeSpentSec]);

  // Idle timeout (15 min without interaction)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          videoRef.current?.pause();
          log("idle_timeout", "Session ended after 15 minutes of inactivity");
        },
        15 * 60 * 1000,
      );
    };
    reset();
    ["mousemove", "keydown", "click", "scroll"].forEach((e) => window.addEventListener(e, reset));
    return () => {
      clearTimeout(timer);
      ["mousemove", "keydown", "click", "scroll"].forEach((e) =>
        window.removeEventListener(e, reset),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  const onLoaded = () => {
    const v = videoRef.current;
    if (!v) return;
    update({ durationSec: v.duration });
    if (!resumed.current && state.positionSec > 1) {
      v.currentTime = state.positionSec;
      resumed.current = true;
      log("resume", `Resumed from ${fmtTime(state.positionSec)}`);
    }
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = Math.round((v.currentTime / v.duration) * 100);
    if (pct !== state.percent) {
      update({ positionSec: v.currentTime, percent: pct });
      if (pct > 0 && pct % 25 === 0) log("progress", `Reached ${pct}% of the video`);
    }
  };

  const markLessonDone = (idx: number) => {
    if (state.completedLessons.includes(idx)) return;
    const completedLessons = [...state.completedLessons, idx].sort((a, b) => a - b);
    update(
      {
        completedLessons,
        percent: Math.max(
          state.percent,
          Math.round((completedLessons.length / course.lessons) * 100),
        ),
      },
      { type: "lesson_complete", detail: `Completed lesson ${idx}` },
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to library
      </Link>

      <div
        className={`overflow-hidden rounded-2xl bg-gradient-to-br ${course.cover} p-8 text-white shadow-lg`}
      >
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-white/20 backdrop-blur">{course.category}</Badge>
          <Badge className="bg-white/20 backdrop-blur">{course.level}</Badge>
          <Badge className="bg-white/20 backdrop-blur">{course.format}</Badge>
        </div>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
          {course.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/85">{course.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/85">
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" /> {course.durationMin} min
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="size-4" /> {course.lessons} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4" /> {course.enrolled.toLocaleString()} learners
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="size-4" /> {course.rating}
          </span>
          <span>Instructor: {course.instructor}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="bg-black">
              <video
                ref={videoRef}
                src={SAMPLE_VIDEO}
                controls
                className="aspect-video w-full"
                onLoadedMetadata={onLoaded}
                onTimeUpdate={onTimeUpdate}
                onPlay={() => {
                  setPlaying(true);
                  log(
                    "play",
                    `Playing lesson ${activeLesson} at ${fmtTime(videoRef.current?.currentTime ?? 0)}`,
                  );
                }}
                onPause={() => {
                  setPlaying(false);
                  const t = videoRef.current?.currentTime ?? 0;
                  update({ positionSec: t }, { type: "pause", detail: `Paused at ${fmtTime(t)}` });
                }}
                onSeeked={() => {
                  const t = videoRef.current?.currentTime ?? 0;
                  if (Math.abs(t - lastSeek.current) < 1) return;
                  lastSeek.current = t;
                  update({ positionSec: t }, { type: "seek", detail: `Jumped to ${fmtTime(t)}` });
                }}
                onEnded={() => {
                  setPlaying(false);
                  markLessonDone(activeLesson);
                  update({ percent: 100 }, { type: "progress", detail: "Finished the video" });
                }}
              />
            </div>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-4 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${
                    playing ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Radio className="size-3" /> {playing ? "Session active" : "Session idle"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Left off at {fmtTime(state.positionSec)}
                  {state.durationSec ? ` / ${fmtTime(state.durationSec)}` : ""}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const v = videoRef.current;
                    if (!v) return;
                    v.currentTime = state.positionSec;
                    void v.play();
                  }}
                >
                  Resume where I left off
                </Button>
                <Button size="sm" onClick={() => markLessonDone(activeLesson)}>
                  Mark lesson complete
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="activity">Activity log ({state.events.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-4">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Course content</h2>
                    <span className="text-xs text-muted-foreground">
                      {state.completedLessons.length}/{lessons.length} lessons complete
                    </span>
                  </div>
                  <ul className="divide-y rounded-lg border">
                    {lessons.map((l) => (
                      <li
                        key={l.idx}
                        className={`flex items-center gap-3 p-3 ${
                          activeLesson === l.idx ? "bg-muted/60" : ""
                        }`}
                      >
                        {l.done ? (
                          <CheckCircle2 className="size-5 text-success" />
                        ) : (
                          <PlayCircle className="size-5 text-muted-foreground" />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium">{l.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {l.min} min · {course.format}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setActiveLesson(l.idx);
                            log("play", `Opened lesson ${l.idx}`);
                            videoRef.current?.play();
                          }}
                        >
                          {l.done ? "Review" : "Start"}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-lg border border-dashed bg-muted/40 p-6 text-center">
                    <FileText className="mx-auto size-8 text-brand" />
                    <p className="mt-2 text-sm font-medium">Course material.pdf</p>
                    <p className="text-xs text-muted-foreground">
                      Downloadable workbook accompanying this course.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => log("progress", "Downloaded course material.pdf")}
                    >
                      <Download className="size-3.5" /> Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold">Session activity</h3>
                  <p className="text-xs text-muted-foreground">
                    Every play, pause, seek and exit is tracked for this session.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {state.events.map((e, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-md border px-3 py-2 text-xs"
                      >
                        <span className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {e.type.replace("_", " ")}
                          </Badge>
                          {e.detail}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(e.at).toLocaleTimeString()}
                        </span>
                      </li>
                    ))}
                    {state.events.length === 0 && (
                      <li className="py-6 text-center text-xs text-muted-foreground">
                        No activity recorded yet.
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Your progress</span>
                  <span>{percent}%</span>
                </div>
                <Progress value={percent} className="h-2" />
                <div className="mt-1 text-xs text-muted-foreground">
                  Time spent this session: {fmtTime(state.timeSpentSec)} · Lifetime{" "}
                  {(seeded?.timeSpentMin ?? 0) + Math.round(state.timeSpentSec / 60)} min
                </div>
              </div>
              <Button
                className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  v.currentTime = state.positionSec;
                  void v.play();
                }}
              >
                {state.positionSec > 1 ? "Continue where I left off" : "Start course"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => log("progress", "Marked course for later")}
              >
                Mark for later
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2 pt-6 text-sm">
              <h3 className="font-semibold">Quiz</h3>
              <p className="text-xs text-muted-foreground">
                Pass the final knowledge check with 80% or more to earn your certificate.
              </p>
              <div className="mt-2 flex items-center justify-between rounded-lg bg-muted p-3">
                <span className="text-xs">Last attempt</span>
                <span className="font-medium">
                  {(state.quizScore ?? seeded?.quizScore)
                    ? `${state.quizScore ?? seeded?.quizScore}%`
                    : "Not taken"}
                </span>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  const score = 70 + Math.floor(Math.random() * 30);
                  update(
                    { quizScore: score },
                    { type: "quiz_submit", detail: `Scored ${score}% on the knowledge check` },
                  );
                }}
              >
                Take knowledge check
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
