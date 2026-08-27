import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, FileText, Search, Star, Users } from "lucide-react";
import { categories, courses, departments, levels } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/courses/")({
  head: () => ({
    meta: [
      { title: "Course Library — TIH Learn" },
      {
        name: "description",
        content:
          "Browse and filter TIH's course library by topic, department and level.",
      },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [dept, setDept] = useState<string>("All");
  const [lvl, setLvl] = useState<string>("All");

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (
        q &&
        !`${c.title} ${c.description}`.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      if (cat !== "All" && c.category !== cat) return false;
      if (dept !== "All" && c.department !== "All" && c.department !== dept)
        return false;
      if (lvl !== "All" && c.level !== lvl) return false;
      return true;
    });
  }, [q, cat, dept, lvl]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Course library
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {courses.length} courses across compliance, product, leadership and
          technology.
        </p>
      </div>

      <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[1fr_180px_180px_160px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses…"
            className="pl-9"
          />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger>
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All topics</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={lvl} onValueChange={setLvl}>
          <SelectTrigger>
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              cat === c
                ? "border-brand bg-brand text-brand-foreground"
                : "hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((c) => (
          <Link key={c.id} to="/courses/$id" params={{ id: c.id }}>
            <Card className="group h-full overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className={`relative h-36 bg-gradient-to-br ${c.cover}`}>
                <Badge className="absolute right-2 top-2 bg-black/60 text-white backdrop-blur">
                  {c.format}
                </Badge>
              </div>
              <CardContent className="space-y-3 pt-4">
                <div className="text-[10px] uppercase tracking-wider text-brand">
                  {c.category} · {c.level}
                </div>
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                  {c.title}
                </h3>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {c.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="size-3 fill-amber-500 text-amber-500" />{" "}
                    {c.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3" /> {c.enrolled.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {c.durationMin}m
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <FileText className="mr-1 inline size-3" /> {c.instructor}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No courses match your filters.
          </p>
          <Button
            variant="ghost"
            className="mt-3"
            onClick={() => {
              setQ("");
              setCat("All");
              setDept("All");
              setLvl("All");
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}
