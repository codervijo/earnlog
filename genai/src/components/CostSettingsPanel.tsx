import { useState } from "react";
import { type Settings } from "@/lib/driverstack";

export function CostSettingsPanel({ settings, onChange }: { settings: Settings; onChange: (s: Settings) => void }) {
  const [open, setOpen] = useState(false);
  const [cpm, setCpm] = useState(settings.costPerMile.toString());
  const [gas, setGas] = useState(settings.gasPrice.toString());
  const [mpg, setMpg] = useState(settings.mpg.toString());

  function save() {
    onChange({
      costPerMile: parseFloat(cpm) || settings.costPerMile,
      gasPrice: parseFloat(gas) || settings.gasPrice,
      mpg: parseFloat(mpg) || settings.mpg,
    });
    setOpen(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <div className="text-sm font-semibold">Cost assumptions</div>
          <div className="text-xs text-muted-foreground num">
            ${settings.costPerMile.toFixed(2)}/mi · ${settings.gasPrice.toFixed(2)}/gal · {settings.mpg} mpg
          </div>
        </div>
        <span className="text-xs text-primary">{open ? "Close" : "Edit"}</span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-border p-4">
          <Row label="Cost per mile ($)" value={cpm} setValue={setCpm} />
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