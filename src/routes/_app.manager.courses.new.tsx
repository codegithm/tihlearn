import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { categories, departments, levels } from "@/lib/mock-data";
import { Upload, FileText, Film, ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/_app/manager/courses/new")({
  head: () => ({
    meta: [
      { title: "Upload Course — Manager · TIH Learn" },
      {
        name: "description",
        content:
          "Upload a new course in PDF, video or quiz format and publish it to the TIH Learn library.",
      },
    ],
  }),
  component: NewCoursePage,
});

type Fmt = "PDF" | "Video" | "Quiz";

function NewCoursePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [department, setDepartment] = useState("All");
  const [level, setLevel] = useState<(typeof levels)[number]>("Beginner");
  const [format, setFormat] = useState<Fmt>("PDF");
  const [duration, setDuration] = useState(45);
  const [lessons, setLessons] = useState(6);
  const [instructor, setInstructor] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const accept =
    format === "PDF" ? ".pdf" : format === "Video" ? "video/mp4,video/webm" : ".json,.txt";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !instructor) {
      toast.error("Please fill in title, description and instructor.");
      return;
    }
    if (format !== "Quiz" && !file) {
      toast.error(`Please upload a ${format} file.`);
      return;
    }
    toast.success(`"${title}" uploaded and published to the library.`);
    navigate({ to: "/courses" });
  };

  const FormatIcon = format === "PDF" ? FileText : format === "Video" ? Film : ClipboardCheck;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 text-xs text-brand">
          <Upload className="size-3.5" /> New course
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Upload a course</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new PDF, video or quiz to the TIH Learn library. Once published it can be added to
          any learning journey.
        </p>
      </div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fraud Awareness for Claims"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will learners walk away with?"
                />
              </div>
              <div className="space-y-2">
                <Label>Instructor</Label>
                <Input
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={level} onValueChange={(v) => setLevel(v as typeof level)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels
                        .filter((l) => l !== "All")
                        .map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lessons</Label>
                  <Input
                    type="number"
                    min={1}
                    value={lessons}
                    onChange={(e) => setLessons(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Format</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["PDF", "Video", "Quiz"] as Fmt[]).map((f) => {
                    const Icon = f === "PDF" ? FileText : f === "Video" ? Film : ClipboardCheck;
                    const on = format === f;
                    return (
                      <button
                        type="button"
                        key={f}
                        onClick={() => {
                          setFormat(f);
                          setFile(null);
                        }}
                        className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition ${
                          on ? "border-brand bg-brand/5" : "hover:bg-muted"
                        }`}
                      >
                        <Icon className="size-5" />
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {format !== "Quiz" ? (
                <div className="space-y-2">
                  <Label>Upload {format} file</Label>
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-sm text-muted-foreground hover:bg-muted">
                    <FormatIcon className="size-6" />
                    {file ? (
                      <span className="font-medium text-foreground">{file.name}</span>
                    ) : (
                      <>
                        <span className="font-medium text-foreground">Click to select a file</span>
                        <span className="text-xs">Accepted: {accept}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept={accept}
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              ) : (
                <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                  Quiz builder — questions can be added after the course is created.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="h-24 rounded-md bg-gradient-to-br from-orange-500 to-amber-600" />
              <div className="font-semibold">{title || "Untitled course"}</div>
              <div className="text-xs text-muted-foreground line-clamp-3">
                {description || "Description will appear here."}
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-[10px]">
                  {category}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {department}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {level}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {format}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {duration}m · {lessons} lessons
                </Badge>
              </div>
              <Button
                type="submit"
                className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
              >
                Publish course
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate({ to: "/courses" })}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
