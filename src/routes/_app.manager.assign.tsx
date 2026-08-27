import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { courses, employees } from "@/lib/mock-data";
import { useAzureProfile } from "@/lib/role-store";
import { Route as RouteIcon } from "lucide-react";

export const Route = createFileRoute("/_app/manager/assign")({
  head: () => ({
    meta: [
      { title: "Assign Learning — Manager · TIH Learn" },
      {
        name: "description",
        content: "Create structured learning paths and assign them to employees or teams.",
      },
    ],
  }),
  component: AssignPage,
});

function AssignPage() {
  const profile = useAzureProfile();
  // Azure AD /me/directReports — managers assign to their own team.
  const team = profile?.isManager ? profile.directReports : employees;
  const [title, setTitle] = useState("Q3 Compliance Refresh");

  const [description, setDescription] = useState(
    "Refreshers on POPIA and cyber hygiene for the whole team.",
  );
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["c1", "c6"]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [due, setDue] = useState("2026-09-30");

  const toggle = (arr: string[], setArr: (v: string[]) => void, id: string) =>
    setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const submit = () => {
    if (!title || selectedCourses.length === 0 || selectedEmployees.length === 0) {
      toast.error("Add a title, at least one course and at least one employee.");
      return;
    }
    toast.success(`"${title}" assigned to ${selectedEmployees.length} employees.`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 text-xs text-brand">
          <RouteIcon className="size-3.5" /> New learning path
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Assign learning</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Group courses into a sequence and assign them to individuals or teams.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">1. Path details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Due date</Label>
                <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">2. Choose courses</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-2">
              {courses.map((c) => {
                const on = selectedCourses.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                      on ? "border-brand bg-brand/5" : "hover:bg-muted"
                    }`}
                  >
                    <Checkbox
                      checked={on}
                      onCheckedChange={() => toggle(selectedCourses, setSelectedCourses, c.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{c.title}</div>
                      <div className="mt-0.5 flex gap-2 text-xs text-muted-foreground">
                        <span>{c.category}</span>
                        <span>·</span>
                        <span>{c.durationMin}m</span>
                        <span>·</span>
                        <span>{c.level}</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">3. Assign to employees</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-2">
              {team.map((e) => {
                const on = selectedEmployees.includes(e.id);
                return (
                  <label
                    key={e.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                      on ? "border-brand bg-brand/5" : "hover:bg-muted"
                    }`}
                  >
                    <Checkbox
                      checked={on}
                      onCheckedChange={() => toggle(selectedEmployees, setSelectedEmployees, e.id)}
                    />
                    <Avatar className="size-8">
                      <AvatarFallback className={`${e.avatarColor} text-white text-xs`}>
                        {e.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {e.role} · {e.department}
                      </div>
                    </div>
                  </label>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Title</div>
                <div className="font-medium">{title || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Courses</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedCourses.length === 0 && (
                    <span className="text-muted-foreground">None selected</span>
                  )}
                  {selectedCourses.map((id) => (
                    <Badge key={id} variant="secondary" className="text-[10px]">
                      {courses.find((c) => c.id === id)?.title.slice(0, 22)}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Assigned to</div>
                <div className="font-medium">{selectedEmployees.length} employees</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Due</div>
                <div className="font-medium">{due}</div>
              </div>
              <Button
                onClick={submit}
                className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
              >
                Assign learning path
              </Button>
              <Button variant="outline" className="w-full">
                Save as draft
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
