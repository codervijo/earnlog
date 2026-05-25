import { fmtHr, type Platform } from "../lib/driverstack";

interface Row {
  platform: Platform | string;
  realHourly: number;
}

export function PlatformComparisonCard({ rows, title = "Platform truth" }: { rows: Row[]; title?: string }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        No platform data yet.
      </div>
    );
  }
  const max = Math.max(...rows.map((r) => Math.max(r.realHourly, 0)), 1);
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
      <ul className="mt-3 space-y-2.5">
        {rows.map((r) => {
          const pct = Math.max((r.realHourly / max) * 100, 4);
          const neg = r.realHourly < 0;
          return (
            <li key={r.platform}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-semibold">{r.platform}</span>
                <span className={`num font-bold ${neg ? "text-cost" : "text-profit"}`}>{fmtHr(r.realHourly)}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${neg ? "bg-cost" : "bg-profit"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
