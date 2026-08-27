import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { employees, employeeStats, sessions } from "@/lib/mock-data";
import { useAzureProfile } from "@/lib/role-store";

export const Route = createFileRoute("/_app/manager/employees")({
  head: () => ({
    meta: [
      { title: "Employees — Manager · TIH Learn" },
      {
        name: "description",
        content: "Track individual employee learning progress, sessions and completion rates.",
      },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const [q, setQ] = useState("");
  const profile = useAzureProfile();
  // Azure AD /me/directReports — a manager only sees their own team.
  const team = profile?.isManager ? profile.directReports : employees;
  const filtered = team.filter((e) =>
    `${e.name} ${e.role} ${e.department}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Employees</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile?.isManager
            ? `Your ${profile.directReports.length} direct reports from Azure AD, reporting to ${profile.employee.name}.`
            : "Monitor learning progress and session activity for every team member."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search employees…"
            className="pl-9"
          />
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Last session</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => {
                const s = employeeStats(e.id);
                const last = sessions.find((se) => se.employeeId === e.id);
                const risk = s.completionPct < 40;
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
                          <div className="text-xs text-muted-foreground">{e.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{e.department}</TableCell>
                    <TableCell>{s.coursesAssigned}</TableCell>
                    <TableCell className="w-48">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span>
                          {s.completed}/{s.coursesAssigned}
                        </span>
                        <span className="text-muted-foreground">{s.completionPct}%</span>
                      </div>
                      <Progress value={s.completionPct} className="h-1.5" />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {last ? `${last.start.split(" ")[0]} · ${last.durationMin}m` : "—"}
                    </TableCell>
                    <TableCell>
                      {risk ? (
                        <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/20">
                          At risk
                        </Badge>
                      ) : s.completionPct === 100 ? (
                        <Badge className="bg-success/15 text-success hover:bg-success/20">
                          On track
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
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
