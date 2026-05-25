import { useEffect, useState } from "react";
import { WeeklyReport } from "./WeeklyReport";
import { loadSessions, loadSettings, type Session, type Settings } from "../lib/driverstack";

export function ReportPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    setSessions(loadSessions());
    setSettings(loadSettings());
  }, []);

  if (!settings) return null;

  return (
    <main className="px-5 pt-6">
      <h1 className="text-2xl font-black tracking-tight">Weekly truth</h1>
      <p className="mt-1 mb-5 text-sm text-muted-foreground">Your last 7 days, no filter.</p>
      <WeeklyReport sessions={sessions} settings={settings} />
    </main>
  );
}
