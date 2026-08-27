import { useCallback, useEffect, useState } from "react";

export type ActivityEvent = {
  at: string; // ISO
  type:
    | "session_start"
    | "play"
    | "pause"
    | "seek"
    | "progress"
    | "lesson_complete"
    | "resume"
    | "exit"
    | "idle_timeout"
    | "quiz_submit";
  detail: string;
};

export type CourseState = {
  courseId: string;
  positionSec: number;
  durationSec: number;
  percent: number;
  timeSpentSec: number;
  completedLessons: number[];
  quizScore: number | null;
  lastActive: string;
  events: ActivityEvent[];
};

const KEY = "tih-learn-progress-v1";

const emptyState = (courseId: string): CourseState => ({
  courseId,
  positionSec: 0,
  durationSec: 0,
  percent: 0,
  timeSpentSec: 0,
  completedLessons: [],
  quizScore: null,
  lastActive: new Date().toISOString(),
  events: [],
});

const readAll = (): Record<string, CourseState> => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
};

const writeAll = (all: Record<string, CourseState>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("tih-learn-progress"));
};

export const getCourseState = (courseId: string): CourseState =>
  readAll()[courseId] ?? emptyState(courseId);

export const updateCourseState = (
  courseId: string,
  patch: Partial<CourseState>,
  event?: Omit<ActivityEvent, "at">,
) => {
  const all = readAll();
  const prev = all[courseId] ?? emptyState(courseId);
  const next: CourseState = {
    ...prev,
    ...patch,
    lastActive: new Date().toISOString(),
    events: event
      ? [{ ...event, at: new Date().toISOString() }, ...prev.events].slice(0, 60)
      : prev.events,
  };
  all[courseId] = next;
  writeAll(all);
  return next;
};

/** Hook: live course state synced with localStorage. */
export function useCourseState(courseId: string) {
  const [state, setState] = useState<CourseState>(() => emptyState(courseId));

  useEffect(() => {
    setState(getCourseState(courseId));
    const sync = () => setState(getCourseState(courseId));
    window.addEventListener("tih-learn-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tih-learn-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, [courseId]);

  const update = useCallback(
    (patch: Partial<CourseState>, event?: Omit<ActivityEvent, "at">) => {
      setState(updateCourseState(courseId, patch, event));
    },
    [courseId],
  );

  const log = useCallback(
    (type: ActivityEvent["type"], detail: string) => {
      setState(updateCourseState(courseId, {}, { type, detail }));
    },
    [courseId],
  );

  return { state, update, log };
}

export const fmtTime = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};
