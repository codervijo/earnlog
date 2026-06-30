import { useState } from "react";
import { IRS_MILEAGE_RATE_2026, type CostMode, type Settings } from "../lib/driverstack";

export function CostSettingsPanel({ settings, onChange }: { settings: Settings; onChange: (s: Settings) => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<CostMode>(settings.costMode);
  const [cpm, setCpm] = useState(settings.costPerMile.toString());
  const [gas, setGas] = useState(settings.gasPrice.toString());
  const [mpg, setMpg] = useState(settings.mpg.toString());

  const irsCents = Math.round(IRS_MILEAGE_RATE_2026 * 100);

  function save() {
    onChange({
      costMode: mode,
      costPerMile: parseFloat(cpm) || settings.costPerMile,
      gasPrice: parseFloat(gas) || settings.gasPrice,
      mpg: parseFloat(mpg) || settings.mpg,
    });
    setOpen(false);
  }

  const summary =
    settings.costMode === "irs-full"
      ? `Full cost · IRS ${irsCents}¢/mi`
      : `Fuel-only · $${settings.costPerMile.toFixed(2)}/mi + gas`;

  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <div className="text-sm font-semibold">Cost assumptions</div>
          <div className="text-xs text-muted-foreground num">
            {summary} · ${settings.gasPrice.toFixed(2)}/gal · {settings.mpg} mpg
          </div>
        </div>
        <span className="text-xs text-primary">{open ? "Close" : "Edit"}</span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-border p-4">
          <div>
            <div className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">Cost model</div>
            <div className="grid grid-cols-2 gap-2">
              <ModeButton
                active={mode === "irs-full"}
                onClick={() => setMode("irs-full")}
                title="Full cost"
                sub={`IRS ${irsCents}¢/mi`}
              />
              <ModeButton
                active={mode === "fuel-only"}
                onClick={() => setMode("fuel-only")}
                title="Fuel-only"
                sub="gas burned"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {mode === "irs-full" ? (
                <>
                  Counts <strong className="text-foreground">{irsCents}¢/mi</strong> — the IRS
                  full operating cost (gas, depreciation, maintenance, insurance, tires).
                  Gas price and MPG below are ignored in this mode.
                </>
              ) : (
                <>
                  Counts only gas burned (from gas price &amp; MPG) plus the per-mile add-on
                  below. Understates true cost.{" "}
                </>
              )}
              <a href="/cost-per-mile/" className="text-primary underline">
                How this is calculated
              </a>
            </p>
          </div>

          {mode === "fuel-only" && <Row label="Non-fuel cost per mile ($)" value={cpm} setValue={setCpm} />}
          <Row label="Gas price ($/gal)" value={gas} setValue={setGas} />
          <Row label="MPG" value={mpg} setValue={setMpg} />
          <button
            onClick={save}
            className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground"
          >
            Save defaults
          </button>
        </div>
      )}
    </div>
  );
}

function ModeButton({ active, onClick, title, sub }: { active: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-3 text-left ${active ? "border-primary bg-primary/10" : "border-border bg-secondary"}`}
    >
      <div className={`text-sm font-bold ${active ? "text-primary" : "text-foreground"}`}>{title}</div>
      <div className="num text-xs text-muted-foreground">{sub}</div>
    </button>
  );
}

function Row({ label, value, setValue }: { label: string; value: string; setValue: (v: string) => void }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="num w-full rounded-xl border border-border bg-input px-3 py-3 outline-none focus:border-primary"
      />
    </label>
  );
}
