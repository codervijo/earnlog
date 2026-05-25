import { fmtUSD, fmtHr, fmtNum, type Session, type Computed } from "../lib/driverstack";

export function ShareableResultCard({ session, computed }: { session: Session; computed: Computed }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-secondary p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">DriverStack</div>
        <div className="text-xs text-muted-foreground">{session.date}</div>
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{session.platform} · the real numbers</div>

      <div className="mt-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Real hourly</div>
        <div className="num text-5xl font-black text-profit">{fmtHr(computed.realHourly)}</div>
        <div className="num mt-1 text-sm text-muted-foreground">
          Gross looked like {fmtHr(computed.grossHourly)}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Row label="Gross pay" value={fmtUSD(session.grossPay)} />
        <Row label="Online time" value={`${session.onlineHours.toFixed(2)}h`} />
        <Row label="Miles" value={fmtNum(session.miles)} />
        <Row label="Costs" value={`-${fmtUSD(computed.totalCosts)}`} tone="cost" />
        <Row label="Net profit" value={fmtUSD(computed.netProfit)} tone="profit" />
        <Row label="$/mile cost" value={`$${computed.costPerMileActual.toFixed(2)}`} />
      </div>

      <div className="mt-5 border-t border-border pt-3 text-center text-[11px] text-muted-foreground">
        earnlog.xyz · know what you really make driving
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "profit" | "cost" }) {
  return (
    <div className="rounded-xl bg-background/40 p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={`num mt-0.5 font-bold ${
          tone === "profit" ? "text-profit" : tone === "cost" ? "text-cost" : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
