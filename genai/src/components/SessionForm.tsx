import { useState } from "react";
import { PLATFORMS, type Session, type Platform, type Settings, uid } from "@/lib/driverstack";

interface Props {
  initial?: Session;
  settings: Settings;
  onSubmit: (s: Session) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function SessionForm({ initial, settings, onSubmit, onCancel, submitLabel = "Calculate" }: Props) {
  const [platform, setPlatform] = useState<Platform>(initial?.platform ?? "Uber");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [grossPay, setGrossPay] = useState(initial?.grossPay?.toString() ?? "");
  const [onlineHours, setOnlineHours] = useState(initial?.onlineHours?.toString() ?? "");
  const [activeHours, setActiveHours] = useState(initial?.activeHours?.toString() ?? "");
  const [miles, setMiles] = useState(initial?.miles?.toString() ?? "");
  const [gasPrice, setGasPrice] = useState((initial?.gasPrice ?? settings.gasPrice).toString());
  const [mpg, setMpg] = useState((initial?.mpg ?? settings.mpg).toString());
  const [otherCosts, setOtherCosts] = useState(initial?.otherCosts?.toString() ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const s: Session = {
      id: initial?.id ?? uid(),
      date,
      platform,
      grossPay: parseFloat(grossPay) || 0,
      onlineHours: parseFloat(onlineHours) || 0,
      activeHours: activeHours ? parseFloat(activeHours) : undefined,
      miles: parseFloat(miles) || 0,
      gasPrice: parseFloat(gasPrice) || settings.gasPrice,
      mpg: parseFloat(mpg) || settings.mpg,
      otherCosts: otherCosts ? parseFloat(otherCosts) : undefined,
    };
    onSubmit(s);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Platform">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
          className="w-full rounded-xl border border-border bg-input px-3 py-3 text-base outline-none focus:border-primary"
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Gross pay ($)">
          <Input value={grossPay} onChange={setGrossPay} type="number" step="0.01" placeholder="182" required />
        </Field>
        <Field label="Date">
          <Input value={date} onChange={setDate} type="date" required />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Online hours">
          <Input value={onlineHours} onChange={setOnlineHours} type="number" step="0.01" placeholder="8.5" required />
        </Field>
        <Field label="Active hours (opt.)">
          <Input value={activeHours} onChange={setActiveHours} type="number" step="0.01" placeholder="6" />
        </Field>
      </div>

      <Field label="Miles driven">
        <Input value={miles} onChange={setMiles} type="number" step="0.1" placeholder="143" required />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Gas price / gal">
          <Input value={gasPrice} onChange={setGasPrice} type="number" step="0.01" />
        </Field>
        <Field label="MPG">
          <Input value={mpg} onChange={setMpg} type="number" step="0.1" />
        </Field>
      </div>

      <Field label="Other costs (opt.)">
        <Input value={otherCosts} onChange={setOtherCosts} type="number" step="0.01" placeholder="tolls, parking" />
      </Field>

      <div className="flex gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3.5 font-semibold text-secondary-foreground"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 rounded-xl bg-primary px-4 py-3.5 font-bold text-primary-foreground active:opacity-90"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function Input({
  value, onChange, ...rest
}: { value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <input
      {...rest}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-input px-3 py-3 text-base outline-none focus:border-primary num"
      inputMode={rest.type === "number" ? "decimal" : undefined}
    />
  );
}