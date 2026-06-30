import { useState, useEffect } from "react";
import { SessionForm } from "./SessionForm";
import { ShareableResultCard } from "./ShareableResultCard";
import { CostSettingsPanel } from "./CostSettingsPanel";
import {
  compute, loadSettings, saveSettings, loadSessions, saveSessions,
  type Session, type Settings,
} from "../lib/driverstack";
import { Share2, Plus } from "lucide-react";

export function CalculatorPage() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [result, setResult] = useState<Session | null>(null);

  useEffect(() => { saveSettings(settings); }, [settings]);

  function handleSubmit(s: Session) {
    setResult(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveToLog() {
    if (!result) return;
    const all = loadSessions();
    saveSessions([result, ...all.filter((x) => x.id !== result.id)]);
    alert("Saved to logbook.");
  }

  function share() {
    if (!result) return;
    const c = compute(result, settings.costPerMile, settings.costMode);
    const text = `My real hourly: $${c.realHourly.toFixed(2)}/hr (${result.platform})\nGross: $${result.grossPay} · ${result.onlineHours}h · ${result.miles}mi\nvia DriverStack — earnlog.xyz`;
    if (navigator.share) navigator.share({ text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  }

  return (
    <main className="px-5 pt-6">
      <h1 className="text-2xl font-black tracking-tight">Real hourly calculator</h1>
      <p className="mt-1 text-sm text-muted-foreground">One shift in. Truth out.</p>

      {result && (
        <div className="mt-5 space-y-3">
          <ShareableResultCard session={result} computed={compute(result, settings.costPerMile, settings.costMode)} />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={share}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground"
            >
              <Share2 className="size-4" /> Share
            </button>
            <button
              onClick={saveToLog}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 font-semibold"
            >
              <Plus className="size-4" /> Save to log
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <SessionForm
          settings={settings}
          onSubmit={handleSubmit}
          submitLabel={result ? "Recalculate" : "Show me the truth"}
        />
      </div>

      <div className="mt-6">
        <CostSettingsPanel settings={settings} onChange={setSettings} />
      </div>
    </main>
  );
}
