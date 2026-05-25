import { aggregate, byPlatform, fmtUSD, fmtHr, fmtNum, type Session, type Settings, withinDays, CA_MIN_WAGE } from "../lib/driverstack";
import { PlatformComparisonCard } from "./PlatformComparisonCard";

export function WeeklyReport({ sessions, settings }: { sessions: Session[]; settings: Settings }) {
  const week = sessions.filter((s) => withinDays(s.date, 7));
  const agg = aggregate(week, settings.costPerMile);
  const platforms = byPlatform(week, settings.costPerMile);
  const under = agg.realHourly < CA_MIN_WAGE;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-secondary p-6">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Weekly truth report</div>
        <div className="text-xs text-muted-foreground">Last 7 days · {week.length} sessions</div>
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Real hourly</div>
          <div className={`num text-5xl font-black ${under ? "text-cost" : "text-profit"}`}>{fmtHr(agg.realHourly)}</div>
          <div className="num mt-1 text-sm text-muted-foreground">Gross looked like {fmtHr(agg.grossHourly)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Total gross" value={fmtUSD(agg.grossPay)} />
        <Stat label="Total costs" value={`-${fmtUSD(agg.totalCosts)}`} tone="cost" />
        <Stat label="Net profit" value={fmtUSD(agg.netProfit)} tone="profit" />
        <Stat label="Hours" value={`${agg.hours.toFixed(1)}h`} />
        <Stat label="Miles" value={fmtNum(agg.miles)} />
        <Stat label="$/mile cost" value={`$${(agg.miles > 0 ? agg.totalCosts / agg.miles : 0).toFixed(2)}`} />
      </div>

      <PlatformComparisonCard rows={platforms} title="Platform ranking" />

      <button
        onClick={() => {
          const text = `My DriverStack weekly truth\nReal hourly: ${fmtHr(agg.realHourly)}\nGross: ${fmtUSD(agg.grossPay)}\nNet: ${fmtUSD(agg.netProfit)}\n${agg.hours.toFixed(1)}h · ${fmtNum(agg.miles)} mi\nearnlog.xyz`;
          if (navigator.share) navigator.share({ text }).catch(() => {});
          else navigator.clipboard?.writeText(text);
        }}
        className="w-full rounded-xl bg-primary py-3.5 font-bold text-primary-foreground"
      >
        Share report
      </button>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "profit" | "cost" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`num mt-1 text-xl font-bold ${tone === "profit" ? "text-profit" : tone === "cost" ? "text-cost" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}
