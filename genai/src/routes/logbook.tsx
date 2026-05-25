import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SessionList } from "@/components/SessionList";
import { SessionForm } from "@/components/SessionForm";
import { loadSessions, saveSessions, loadSettings, type Session, type Settings } from "@/lib/driverstack";
import { Plus, X } from "lucide-react";

export const Route = createFileRoute("/logbook")({
  head: () => ({ meta: [{ title: "Logbook — DriverStack" }] }),
  component: Logbook,
});

function Logbook() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [editing, setEditing] = useState<Session | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setSessions(loadSessions());
    setSettings(loadSettings());
  }, []);

  function persist(next: Session[]) {
    setSessions(next);
    saveSessions(next);
  }

  if (!settings) return null;

  return (
    <main className="px-5 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Logbook</h1>
          <p className="mt-1 text-sm text-muted-foreground">{sessions.length} sessions logged.</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditing(null); }}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>

      {(adding || editing) && (
        <div className="mt-5 rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">{editing ? "Edit session" : "Add session"}</div>
            <button onClick={() => { setAdding(false); setEditing(null); }} aria-label="Close">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <SessionForm
            initial={editing ?? undefined}
            settings={settings}
            submitLabel={editing ? "Save changes" : "Add session"}
            onSubmit={(s) => {
              const next = editing
                ? sessions.map((x) => (x.id === s.id ? s : x))
                : [s, ...sessions];
              persist(next);
              setAdding(false);
              setEditing(null);
            }}
            onCancel={() => { setAdding(false); setEditing(null); }}
          />
        </div>
      )}

      <div className="mt-5">
        <SessionList
          sessions={sessions}
          settings={settings}
          onEdit={(s) => { setEditing(s); setAdding(false); }}
          onDelete={(id) => {
            if (confirm("Delete this session?")) persist(sessions.filter((s) => s.id !== id));
          }}
        />
      </div>
    </main>
  );
}