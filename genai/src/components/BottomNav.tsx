import { Link } from "@tanstack/react-router";
import { Home, Calculator, LayoutDashboard, BookOpen, FileBarChart } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/calculator", label: "Calc", icon: Calculator },
  { to: "/dashboard", label: "Stats", icon: LayoutDashboard },
  { to: "/logbook", label: "Log", icon: BookOpen },
  { to: "/report", label: "Report", icon: FileBarChart },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <Icon className="size-5" strokeWidth={2.2} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}