import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRole, signOut, useAzureProfile } from "@/lib/role-store";

export function AppHeader() {
  const [role, setRole] = useRole();
  const navigate = useNavigate();
  const profile = useAzureProfile();
  const me = profile?.employee;
  const isManager = role === "manager";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search courses, paths, employees…" className="pl-9" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        {isManager && (
          <div className="hidden items-center rounded-full border bg-muted p-0.5 text-xs md:flex">
            <button
              onClick={() => setRole("employee")}
              className="rounded-full px-3 py-1 text-muted-foreground transition"
            >
              Employee view
            </button>
            <button
              onClick={() => setRole("manager")}
              className={`rounded-full px-3 py-1 transition ${
                role === "manager"
                  ? "bg-ink text-ink-foreground shadow-sm font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Manager view
            </button>
          </div>
        )}
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="size-4" />
          <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px]">
            3
          </Badge>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full pr-2 hover:bg-muted">
              <Avatar className="size-8">
                <AvatarFallback className={`${me?.avatarColor ?? "bg-muted"} text-white text-xs`}>
                  {(me?.name ?? profile?.name ?? "User")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left text-xs md:block">
                <div className="font-medium">{me?.name ?? profile?.name}</div>
                <div className="text-muted-foreground">{me?.role ?? "Employee"}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
            <DropdownMenuItem className="flex-col items-start">
              <span className="font-medium">{me?.name ?? profile?.name}</span>
              <span className="text-xs text-muted-foreground">{profile?.email ?? me?.email}</span>
              <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                Azure AD · {isManager ? "Manager" : "Employee"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard">My dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                signOut();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="mr-2 size-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
