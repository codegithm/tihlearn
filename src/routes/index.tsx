import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { isAuthed } from "@/lib/role-store";
import {
  CLIENT_ID,
  TENANT,
  loginPopup,
  tenantAccounts,
} from "@/lib/azure-ad";
import { getEmployee, isManagerUser } from "@/lib/mock-data";
import {
  GraduationCap,
  ShieldCheck,
  LineChart,
  Users,
  Loader2,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function MicrosoftLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`grid size-4 grid-cols-2 gap-[2px] ${className}`} aria-hidden>
      <span className="bg-[#F25022]" />
      <span className="bg-[#7FBA00]" />
      <span className="bg-[#00A4EF]" />
      <span className="bg-[#FFB900]" />
    </span>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [picking, setPicking] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthed()) navigate({ to: "/dashboard" });
  }, [navigate]);

  const chooseAccount = async (oid: string) => {
    setPending(oid);
    setError(null);
    try {
      await loginPopup(oid);
      navigate({ to: "/dashboard" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
      setPending(null);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: Azure AD sign-in */}
      <div className="flex flex-col justify-between p-6 md:p-10">
        <div className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-md bg-brand font-black text-brand-foreground">
            t
          </div>
          <div>
            <div className="text-sm font-semibold">TIH Learn</div>
            <div className="text-xs text-muted-foreground">Employee LMS</div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            TIH Learn uses your company Microsoft account. Single sign-on is handled
            by Azure AD (Microsoft Entra ID) for the <strong>{TENANT}</strong> tenant.
          </p>

          {!picking ? (
            <div className="mt-8 space-y-4">
              <Button
                onClick={() => setPicking(true)}
                className="w-full justify-center gap-3 bg-ink text-ink-foreground hover:bg-ink/90"
              >
                <MicrosoftLogo /> Sign in with Microsoft
              </Button>
              <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                On sign-in we read your directory profile, your Azure AD groups and{" "}
                <code>/me/directReports</code> — if you manage people you land in the
                manager workspace with your own team loaded.
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-2">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Pick an account
              </div>
              {tenantAccounts.map((a) => {
                const emp = getEmployee(a.oid)!;
                const manager = isManagerUser(a.oid);
                return (
                  <button
                    key={a.oid}
                    disabled={pending !== null}
                    onClick={() => chooseAccount(a.oid)}
                    className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition hover:bg-muted disabled:opacity-60"
                  >
                    <Avatar className="size-9">
                      <AvatarFallback className={`${emp.avatarColor} text-white text-xs`}>
                        {a.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {a.name}
                        {manager && (
                          <Badge variant="secondary" className="text-[10px]">
                            Manager
                          </Badge>
                        )}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {a.username}
                      </div>
                    </div>
                    {pending === a.oid ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    )}
                  </button>
                );
              })}
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button
                type="button"
                onClick={() => setPicking(false)}
                className="pt-2 text-xs text-muted-foreground hover:underline"
              >
                Use a different sign-in option
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Prototype build — Azure AD is simulated (app id {CLIENT_ID.slice(0, 8)}…).
            No real Microsoft credentials are collected.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TIH · Sessions auto-expire after 15 minutes of inactivity.
        </p>
      </div>

      {/* Right: hero */}
      <div className="relative hidden overflow-hidden bg-ink text-ink-foreground lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,135,31,0.28),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(245,135,31,0.16),transparent_50%)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs">
              <span className="size-1.5 rounded-full bg-brand" /> Learning for every TIH employee
            </div>
            <h2 className="mt-6 text-4xl font-semibold leading-tight">
              Grow the skills that
              <br />
              <span className="text-brand">move your career forward.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-ink-foreground/70">
              Courses, learning journeys and manager oversight — everything TIH teams
              need to stay compliant, capable and current.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: GraduationCap, label: "Courses & journeys", value: "120+" },
              { icon: Users, label: "Active learners", value: "3,400" },
              { icon: LineChart, label: "Avg. completion", value: "87%" },
              { icon: ShieldCheck, label: "Compliance rate", value: "98%" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <s.icon className="size-5 text-brand" />
                <div className="mt-2 text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-ink-foreground/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
