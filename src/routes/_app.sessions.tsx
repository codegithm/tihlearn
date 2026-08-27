import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CURRENT_EMPLOYEE_ID, sessions } from "@/lib/mock-data";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/_app/sessions")({
  head: () => ({
    meta: [
      { title: "My Sessions — TIH Learn" },
      {
        name: "description",
        content:
          "Your recent learning session history and idle-timeout events.",
      },
    ],
  }),
  component: SessionsPage,
});

function SessionsPage() {
  const mine = sessions.filter((s) => s.employeeId === CURRENT_EMPLOYEE_ID);
  const totalMin = mine.reduce((sum, s) => sum + s.durationMin, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Session history
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sessions automatically end after 15 minutes of inactivity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <Clock className="size-4 text-muted-foreground" />
            <div className="mt-2 text-2xl font-semibold">{mine.length}</div>
            <div className="text-xs text-muted-foreground">
              Sessions this week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Clock className="size-4 text-muted-foreground" />
            <div className="mt-2 text-2xl font-semibold">{totalMin}m</div>
            <div className="text-xs text-muted-foreground">
              Total learning time
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Clock className="size-4 text-muted-foreground" />
            <div className="mt-2 text-2xl font-semibold">
              {Math.round(totalMin / mine.length) || 0}m
            </div>
            <div className="text-xs text-muted-foreground">
              Average session length
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.courseTitle}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {s.start}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {s.end}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{s.durationMin}m</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.activity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
