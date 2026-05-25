import { useEffect, useState } from "react";
import { Home, Calculator, LayoutDashboard, BookOpen, FileBarChart } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/calculator", label: "Calc", icon: Calculator },
  { to: "/dashboard", label: "Stats", icon: LayoutDashboard },
  { to: "/logbook", label: "Log", icon: BookOpen },
  { to: "/report", label: "Report", icon: FileBarChart },
] as const;

export function BottomNav() {
  const [path, setPath] = useState<string>("/");
  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <a
                href={to}
                data-status={active ? "active" : undefined}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
              >
                <Icon className="size-5" strokeWidth={2.2} />
                <span>{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
