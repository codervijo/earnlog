import { useEffect, useState } from "react";
import { RealHourlyCard } from "./RealHourlyCard";
import {
  loadSessions, loadSettings, aggregate, byPlatform,
  fmtUSD, fmtNum, withinDays, isToday,
  type Session, type Settings,
} from "../lib/driverstack";
import { TrendingUp, TrendingDown } from "lucide-react";

export function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    setSessions(loadSessions());
    setSettings(loadSettings());
  }, []);

  if (!settings) return null;
  const today = sessions.filter((s) => isToday(s.date));
  const week = sessions.filter((s) => withinDays(s.date, 7));
  const todayAgg = aggregate(today, settings.costPerMile, settings.costMode);
  const weekAgg = aggregate(week, settings.costPerMile, settings.costMode);
  const platforms = byPlatform(week, settings.costPerMile, settings.costMode);
  const best = platforms[0];
  const worst = platforms[platforms.length - 1];

  return (
    <main className="px-5 pt-6">
      <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your real numbers, right now.</p>

      <div className="mt-5 space-y-3">
        <RealHourlyCard
          label="Today's real hourly"
          realHourly={todayAgg.realHourly}
          grossHourly={todayAgg.grossHourly}
          big
        />
        <RealHourlyCard
          label="This week's real hourly"
          realHourly={weekAgg.realHourly}
          grossHourly={weekAgg.grossHourly}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat label="Week gross" value={fmtUSD(weekAgg.grossPay)} />
        <Stat label="Week profit" value={fmtUSD(weekAgg.netProfit)} tone="profit" />
        <Stat label="Week miles" value={fmtNum(weekAgg.miles)} />
        <Stat label="Week hours" value={`${weekAgg.hours.toFixed(1)}h`} />
      </div>

      {best && worst && best !== worst && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <PlatformBadge tone="profit" icon={TrendingUp} title="Best this week" platform={best.platform} value={`$${best.realHourly.toFixed(2)}/hr`} />
          <PlatformBadge tone="cost" icon={TrendingDown} title="Worst this week" platform={worst.platform} value={`$${worst.realHourly.toFixed(2)}/hr`} />
        </div>
      )}

      {sessions.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
          Add sessions in the Logbook to populate your dashboard.
        </div>
      )}
    </main>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "profit" | "cost" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`num mt-1 text-xl font-bold ${tone === "profit" ? "text-profit" : tone === "cost" ? "text-cost" : ""}`}>{value}</div>
    </div>
  );
}

function PlatformBadge({
  tone, icon: Icon, title, platform, value,
}: { tone: "profit" | "cost"; icon: React.ComponentType<{ className?: string }>; title: string; platform: string; value: string }) {
  return (
    <div className={`rounded-2xl border p-4 ${tone === "profit" ? "border-profit/30 bg-profit/10" : "border-cost/30 bg-cost/10"}`}>
      <div className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${tone === "profit" ? "text-profit" : "text-cost"}`}>
        <Icon className="size-3.5" /> {title}
      </div>
      <div className="mt-1 text-lg font-bold">{platform}</div>
      <div className={`num text-sm font-semibold ${tone === "profit" ? "text-profit" : "text-cost"}`}>{value}</div>
    </div>
  );
}
