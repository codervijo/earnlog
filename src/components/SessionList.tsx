import { compute, fmtUSD, fmtHr, CA_MIN_WAGE, type Session, type Settings } from "../lib/driverstack";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  sessions: Session[];
  settings: Settings;
  onEdit: (s: Session) => void;
  onDelete: (id: string) => void;
}

export function SessionList({ sessions, settings, onEdit, onDelete }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
        No sessions yet. Tap "Add session" to log your first shift.
      </div>
    );
  }
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <ul className="space-y-2.5">
      {sorted.map((s) => {
        const c = compute(s, settings.costPerMile, settings.costMode);
        const neg = c.realHourly < CA_MIN_WAGE;
        return (
          <li key={s.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{s.platform}</span>
                  <span className="text-xs text-muted-foreground">{s.date}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground num">
                  <span>{fmtUSD(s.grossPay)} gross</span>
                  <span>{s.onlineHours.toFixed(1)}h</span>
                  <span>{s.miles} mi</span>
                </div>
                <div className={`num mt-2 text-xl font-bold ${neg ? "text-cost" : "text-profit"}`}>
                  {fmtHr(c.realHourly)} <span className="text-xs font-medium text-muted-foreground">real</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => onEdit(s)}
                  className="rounded-lg border border-border bg-secondary p-2 text-secondary-foreground"
                  aria-label="Edit"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  className="rounded-lg border border-border bg-secondary p-2 text-cost"
                  aria-label="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
