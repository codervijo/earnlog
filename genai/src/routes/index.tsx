import { createFileRoute, Link } from "@tanstack/react-router";
import { PlatformComparisonCard } from "@/components/PlatformComparisonCard";
import { ArrowRight, Eye, Fuel, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DriverStack — Know what you really make driving" },
      { name: "description", content: "Real hourly pay for California rideshare and delivery drivers after gas, miles, waiting time, and platform switching." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="px-5 pt-10">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">earnlog.xyz</div>
      <h1 className="num mt-3 text-4xl font-black leading-[1.05] tracking-tight">
        Know what you<br />really make<br /><span className="text-primary">driving.</span>
      </h1>
      <p className="mt-4 text-base text-muted-foreground">
        DriverStack shows gig drivers their real hourly pay after gas, miles, waiting time, and platform switching.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        <Link
          to="/calculator"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 font-bold text-primary-foreground active:opacity-90"
        >
          Calculate My Real Hourly <ArrowRight className="size-4" />
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-5 py-4 font-semibold text-secondary-foreground"
        >
          <Eye className="size-4" /> See Example Report
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold">
          Your apps show gross pay.<br />
          <span className="text-primary">DriverStack shows the truth.</span>
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Pill icon={Fuel} label="Gas" />
          <Pill icon={MapPin} label="Miles" />
          <Pill icon={Clock} label="Wait time" />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Example shift</div>
        <div className="mt-3 space-y-2 text-sm">
          <Row label="Gross pay" value="$182" />
          <Row label="Online time" value="8h 40m" />
          <Row label="Miles" value="143" />
          <Row label="Estimated costs" value="-$48" tone="cost" />
          <div className="my-2 border-t border-border" />
          <Row label="Real profit" value="$134" tone="profit" bold />
          <Row label="Real hourly" value="$15.46/hr" tone="cost" bold />
        </div>
        <div className="mt-3 rounded-lg bg-cost/15 px-3 py-2 text-xs font-medium text-cost">
          Below CA minimum wage. Your apps didn't tell you that.
        </div>
      </section>

      <section className="mt-6">
        <PlatformComparisonCard
          title="What drivers actually make"
          rows={[
            { platform: "Instacart", realHourly: 19.10 },
            { platform: "DoorDash", realHourly: 17.20 },
            { platform: "Uber Eats", realHourly: 13.90 },
          ]}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-primary/30 bg-primary/10 p-5">
        <div className="text-sm font-bold text-primary">Built for California gig drivers</div>
        <p className="mt-1 text-sm text-foreground/90">
          Full-time Uber, Lyft, DoorDash, Instacart, Uber Eats, Spark, and Amazon Flex drivers — we flag every shift that falls below CA minimum wage.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
        <div className="text-xl font-bold">Stop guessing what you make.</div>
        <p className="mt-1 text-sm text-muted-foreground">Run one shift through DriverStack. Takes 30 seconds.</p>
        <Link
          to="/calculator"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-bold text-primary-foreground"
        >
          Calculate now <ArrowRight className="size-4" />
        </Link>
      </section>

      <footer className="mt-10 pb-4 text-center text-xs text-muted-foreground">
        earnlog.xyz · DriverStack v1
      </footer>
    </main>
  );
}

function Pill({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <Icon className="mx-auto size-5 text-cost" />
      <div className="mt-1 text-xs font-medium">{label}</div>
    </div>
  );
}

function Row({ label, value, tone, bold }: { label: string; value: string; tone?: "profit" | "cost"; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`num ${bold ? "text-base font-bold" : ""} ${tone === "profit" ? "text-profit" : tone === "cost" ? "text-cost" : ""}`}>{value}</span>
    </div>
  );
}
