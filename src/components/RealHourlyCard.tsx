import { fmtHr, CA_MIN_WAGE } from "../lib/driverstack";
import { AlertTriangle, TrendingUp } from "lucide-react";

interface Props {
  label: string;
  realHourly: number;
  grossHourly?: number;
  big?: boolean;
}

export function RealHourlyCard({ label, realHourly, grossHourly, big }: Props) {
  const under = realHourly < CA_MIN_WAGE;
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`num mt-2 font-bold ${under ? "text-cost" : "text-profit"} ${big ? "text-5xl" : "text-3xl"}`}>
        {fmtHr(realHourly)}
      </div>
      {grossHourly !== undefined && (
        <div className="mt-1 text-sm text-muted-foreground num">
          Gross: <span className="text-foreground">{fmtHr(grossHourly)}</span>
        </div>
      )}
      {under ? (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-cost/15 px-2.5 py-1.5 text-xs font-medium text-cost">
          <AlertTriangle className="size-3.5" />
          Below CA minimum wage (${CA_MIN_WAGE}/hr)
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-profit">
          <TrendingUp className="size-3.5" />
          Above CA minimum
        </div>
      )}
    </div>
  );
}
