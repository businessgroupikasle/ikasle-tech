import { Activity, Check, Cloud, Database, GitCommitHorizontal, Server } from "lucide-react";
import { tokenize } from "@/lib/highlight";
import { cn } from "@/lib/cn";

/* One programming-themed preview per delivery phase. Pure markup, no JS. All figures are sample data. */

function Card({ title, children, dark = false }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border shadow-soft", dark ? "border-editor-line bg-editor" : "border-line bg-white")}>
      <p className={cn("border-b px-4 py-2.5 font-mono text-[11.5px]", dark ? "border-editor-line bg-editor-panel text-editor-muted" : "border-line bg-bg-soft text-ink-soft")}>{title}</p>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Code({ source }: { source: string }) {
  return (
    <pre className="code-surface overflow-x-auto text-[12px]">
      <code>
        {tokenize(source).map((t, i) => (
          <span key={i} className={`tok-${t.cls}`}>
            {t.text}
          </span>
        ))}
      </code>
    </pre>
  );
}

function Discover() {
  return (
    <Card title="docs/requirements.md">
      <div className="space-y-3 text-[13px]">
        <p className="font-semibold text-ink"># Inventory module</p>
        <p className="font-mono text-[11.5px] text-ink-soft">
          <span className="text-accent-strong">scope:</span> v1 · stock tracking, alerts, reports
        </p>
        {[
          ["Track stock per warehouse", true],
          ["Low-stock alerts", true],
          ["Barcode scanning", false],
        ].map(([t, done]) => (
          <p key={t as string} className="flex items-center gap-2 text-ink-soft">
            <span className={cn("inline-flex size-4 items-center justify-center rounded border", done ? "border-accent bg-accent text-white" : "border-line")}>
              {done ? <Check className="size-3" aria-hidden="true" /> : null}
            </span>
            {t as string}
          </p>
        ))}
        <p className="rounded-lg bg-bg-soft p-2.5 font-mono text-[11.5px] text-ink-soft">
          <span className="text-accent-strong">As a</span> warehouse manager, <span className="text-accent-strong">I want</span> reorder alerts <span className="text-accent-strong">so that</span> we never run out.
        </p>
      </div>
    </Card>
  );
}

function Design() {
  return (
    <Card title="design/system.fig">
      <div className="grid grid-cols-[48px_1fr] gap-2.5">
        <div className="space-y-2 rounded-lg bg-bg-soft p-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={cn("h-2.5 rounded", i === 0 ? "bg-accent/60" : "bg-line")} />
          ))}
        </div>
        <div className="space-y-2.5">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 rounded-lg border-2 border-dashed border-accent/30" />
            ))}
          </div>
          <div className="relative h-20 rounded-lg border-2 border-dashed border-accent/30">
            <span className="absolute -top-2.5 left-2 bg-white px-1 font-mono text-[10px] text-accent-strong">Chart · 8 col</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3 font-mono text-[10.5px] text-ink-soft">
        <span className="text-accent-strong">tokens</span>
        {[
          ["#08283C", "navy"],
          ["#008CF8", "blue"],
          ["#EAF6FF", "tint"],
        ].map(([hex, name]) => (
          <span key={name} className="inline-flex items-center gap-1.5 rounded-md border border-line px-1.5 py-0.5">
            <span className="size-2.5 rounded-sm border border-line" style={{ background: hex }} />
            {name}
          </span>
        ))}
        <span className="rounded-md border border-line px-1.5 py-0.5">radius 12</span>
      </div>
    </Card>
  );
}

const PAGE_CODE = `import { StockTable } from "@/components/stock-table";

export default async function Page() {
  const items = await getLowStock({ limit: 20 });
  return <StockTable items={items} />;
}`;

function Develop() {
  return (
    <Card title="src/app/page.tsx" dark>
      <Code source={PAGE_CODE} />
      <p className="mt-3 border-t border-editor-line pt-2.5 font-mono text-[11px]">
        <span className="tok-success">✓ compiled</span>
        <span className="tok-muted"> · tsc 0 errors · lint clean</span>
      </p>
    </Card>
  );
}

function Test() {
  const tests = ["checkout › creates an order", "stock › flags items below reorder level", "auth › redirects signed-out users", "api › rejects an invalid payload"];
  return (
    <Card title="tests/e2e.spec.ts" dark>
      <div className="code-surface space-y-1 text-[12px]">
        <p className="tok-muted">Running 4 tests using 2 workers</p>
        {tests.map((t) => (
          <p key={t} className="flex items-start gap-2">
            <Check className="mt-1 size-3 shrink-0 text-[#4ade80]" aria-hidden="true" />
            <span className="tok-plain">{t}</span>
          </p>
        ))}
        <p className="pt-2">
          <span className="tok-success">4 passed</span>
          <span className="tok-muted"> (sample run)</span>
        </p>
      </div>
    </Card>
  );
}

function Deploy() {
  const stages: [string, "done" | "running"][] = [
    ["build", "done"],
    ["test", "done"],
    ["deploy:staging", "done"],
    ["deploy:production", "running"],
  ];
  return (
    <Card title="deploy/pipeline.yml">
      <div className="space-y-2">
        {stages.map(([s, state]) => (
          <div key={s} className="flex items-center gap-3">
            <span className={cn("inline-flex size-6 items-center justify-center rounded-full", state === "done" ? "bg-success/15 text-success" : "bg-accent text-white")}>
              {state === "done" ? <Check className="size-3.5" aria-hidden="true" /> : <GitCommitHorizontal className="size-3.5" aria-hidden="true" />}
            </span>
            <span className="flex-1 font-mono text-[12.5px] text-ink">{s}</span>
            <span className="h-1.5 w-20 overflow-hidden rounded-full bg-bg-soft">
              <span className={cn("block h-full rounded-full", state === "done" ? "w-full bg-success" : "shimmer w-full")} />
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 border-t border-line pt-2.5 font-mono text-[11px] text-ink-soft">release v1.4.0 → production · demo pipeline</p>
    </Card>
  );
}

const METRICS = `{
  "p95LatencyMs": 180,
  "uptime30d": "99.9%",
  "instances": { "min": 2, "max": 6 },
  "cpu": "41%",
  "alerts": 0
}`;

function Scale() {
  return (
    <Card title="monitoring/metrics.json" dark>
      <Code source={METRICS} />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-editor-line pt-2.5 font-mono text-[11px] text-editor-muted">
        <span className="flex items-center gap-1.5"><Server className="size-3" aria-hidden="true" /> autoscale 2→6</span>
        <span className="flex items-center gap-1.5"><Database className="size-3" aria-hidden="true" /> postgres + cache</span>
        <span className="flex items-center gap-1.5"><Cloud className="size-3" aria-hidden="true" /> CDN</span>
        <span className="flex items-center gap-1.5"><Activity className="size-3" aria-hidden="true" /> sample data</span>
      </div>
    </Card>
  );
}

export const processSteps = [
  { id: "discover", title: "Discover", summary: "We map goals, users and constraints into clear requirements and a scoped roadmap.", Visual: Discover },
  { id: "design", title: "Design", summary: "Wireframes and interface design, validated with prototypes before a line of production code.", Visual: Design },
  { id: "develop", title: "Develop", summary: "Typed, reviewed, modular code — built in short iterations you can see and test.", Visual: Develop },
  { id: "test", title: "Test", summary: "Automated unit, integration and end-to-end tests guard every change.", Visual: Test },
  { id: "deploy", title: "Deploy", summary: "CI/CD pipelines ship to production safely, with previews for every change.", Visual: Deploy },
  { id: "scale", title: "Scale", summary: "Monitoring, performance work and infrastructure that grows with your users.", Visual: Scale },
] as const;
