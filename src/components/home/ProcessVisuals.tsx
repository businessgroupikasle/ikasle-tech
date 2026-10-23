import { Check, Database, GitCommitHorizontal, Globe, HardDrive, Layers, Monitor, Network, Server, Users, Zap } from "lucide-react";
import { tokenize } from "@/lib/highlight";
import { cn } from "@/lib/cn";
import "./ProcessVisuals.css";

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

/** Small footnote marking a preview's figures as illustrative. */
function Note({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={cn("mt-3 border-t pt-2.5 font-mono text-[11px]", dark ? "border-editor-line text-editor-muted" : "border-line text-ink-soft")}>{children}</p>;
}

/** A labelled box in an architecture diagram. */
function Node({ icon: I, label, sub, tone = "white" }: { icon: typeof Server; label: string; sub?: string; tone?: "white" | "blue" }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2", tone === "blue" ? "border-accent/30 bg-bg-blue" : "border-line bg-white")}>
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#009CFF] ring-1 ring-line">
        <I className="size-3.5" aria-hidden="true" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[12px] font-semibold text-ink">{label}</span>
        {sub && <span className="block truncate font-mono text-[10px] text-ink-soft">{sub}</span>}
      </span>
    </div>
  );
}

const Arrow = () => (
  <span className="flex justify-center text-accent/60" aria-hidden="true">
    <span className="h-3.5 w-px bg-current" />
  </span>
);

/* ---------- 01 Discover ---------- */

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

/* ---------- 02 Plan & Architect ---------- */

const SYSTEM_CODE = `export const system = {
  frontend: "Next.js app",
  api: "REST · auth · rate limits",
  services: ["orders", "inventory"],
  database: "PostgreSQL",
};`;

function PlanArchitect() {
  return (
    <Card title="architecture/system-design.ts">
      <div className="grid gap-4 sm:grid-cols-[1fr_1.05fr]">
        <div>
          <Node icon={Monitor} label="Frontend" sub="web · mobile" tone="blue" />
          <Arrow />
          <Node icon={Network} label="API layer" sub="REST · auth" />
          <Arrow />
          <div className="grid grid-cols-2 gap-1.5">
            <Node icon={Server} label="Orders" sub="service" />
            <Node icon={Server} label="Inventory" sub="service" />
          </div>
          <Arrow />
          <Node icon={Database} label="Database" sub="PostgreSQL" />
        </div>
        <div className="min-w-0 rounded-xl bg-editor p-3">
          <Code source={SYSTEM_CODE} />
        </div>
      </div>
      <Note>roadmap: v1 core → v1.1 integrations → v2 scale · example plan</Note>
    </Card>
  );
}

/* ---------- 03 Design ---------- */

function Design() {
  return (
    <Card title="design/components.fig">
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
          <div className="relative h-16 rounded-lg border-2 border-dashed border-accent/30">
            <span className="absolute -top-2.5 left-2 bg-white px-1 font-mono text-[10px] text-accent-strong">Chart · 8 col</span>
          </div>
        </div>
      </div>
      {/* Components */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
        <span className="rounded-lg bg-[#009CFF] px-3 py-1.5 text-[11.5px] font-semibold text-white">Primary</span>
        <span className="rounded-lg border border-line bg-white px-3 py-1.5 text-[11.5px] font-medium text-ink">Secondary</span>
        <span className="flex h-7 w-28 items-center rounded-lg border border-line px-2 font-mono text-[10.5px] text-ink-soft">Search…</span>
        <span className="rounded-full bg-bg-blue px-2 py-0.5 font-mono text-[10.5px] text-accent-strong">badge</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10.5px] text-ink-soft">
        <span className="text-accent-strong">tokens</span>
        {[
          ["#082B45", "navy"],
          ["#009CFF", "blue"],
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

/* ---------- 04 Develop ---------- */

const PAGE_CODE = `import { StockTable } from "@/components/stock-table";

export default async function Page() {
  const items = await getLowStock({ limit: 20 });
  return <StockTable items={items} />;
}`;

function Develop() {
  return (
    <Card title="src/app/page.tsx" dark>
      <Code source={PAGE_CODE} />
      <Note dark>
        <span className="tok-success">✓ compiled</span> · tsc 0 errors · lint clean
      </Note>
    </Card>
  );
}

/* ---------- 05 Test & QA ---------- */

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

/* ---------- 06 Automate ---------- */

const CI_STEPS: { label: string; cmd: string; time: string }[] = [
  { label: "Code commit", cmd: "push · main", time: "" },
  { label: "Install dependencies", cmd: "npm ci", time: "18s" },
  { label: "Run lint", cmd: "npm run lint", time: "6s" },
  { label: "Type check", cmd: "tsc --noEmit", time: "9s" },
  { label: "Automated tests", cmd: "npm test", time: "41s" },
  { label: "Build application", cmd: "npm run build", time: "37s" },
  { label: "Prepare deployment", cmd: "artifact · release", time: "" },
];

/**
 * CI/CD pipeline. The nodes light up in order each time this preview becomes the active phase — pure CSS
 * (see ProcessVisuals.css), keyed off the active preview / step, so no extra JS or ScrollTrigger is involved.
 */
function Automate() {
  return (
    <Card title=".github/workflows/ci.yml" dark>
      <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
        <pre className="code-surface min-w-0 overflow-x-auto text-[11.5px] leading-[1.7]">
          <code>
            <span className="tok-prop">on</span>
            <span className="tok-punct">: </span>
            <span className="tok-string">[push, pull_request]</span>
            {"\n"}
            <span className="tok-prop">jobs</span>
            <span className="tok-punct">:</span>
            {"\n  "}
            <span className="tok-prop">ci</span>
            <span className="tok-punct">:</span>
            {"\n    "}
            <span className="tok-prop">steps</span>
            <span className="tok-punct">:</span>
            {CI_STEPS.slice(1, 6).map((s) => (
              <span key={s.cmd}>
                {"\n      - "}
                <span className="tok-prop">run</span>
                <span className="tok-punct">: </span>
                <span className="tok-string">{s.cmd}</span>
              </span>
            ))}
          </code>
        </pre>

        <ol className="ci-pipeline relative min-w-0" aria-label="Example CI/CD pipeline">
          {CI_STEPS.map((s, i) => {
            const last = i === CI_STEPS.length - 1;
            return (
              <li key={s.label} className="ci-step relative flex items-center gap-3 py-1.5" style={{ "--i": i } as React.CSSProperties}>
                {!last && <span className="ci-link absolute top-[calc(50%+11px)] left-[11px] h-[calc(100%-22px)] w-0.5" aria-hidden="true" />}
                <span className={cn("ci-node relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-full", last ? "ci-node-ready" : "ci-node-pass")}>
                  {i === 0 ? <GitCommitHorizontal className="size-3.5" aria-hidden="true" /> : last ? <Zap className="size-3.5" aria-hidden="true" /> : <Check className="size-3.5" aria-hidden="true" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-medium text-white">{s.label}</span>
                  <span className="block truncate font-mono text-[10.5px] text-editor-muted">{s.cmd}</span>
                </span>
                <span className={cn("ci-status font-mono text-[10.5px]", last ? "text-[#4db3ff]" : "text-[#4ade80]")}>{last ? "ready" : s.time ? `passed · ${s.time}` : "triggered"}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <Note dark>demonstration pipeline · not a live CI status</Note>
    </Card>
  );
}

/* ---------- 07 Deploy ---------- */

function Deploy() {
  const stages: [string, string, "done" | "running"][] = [
    ["build", "artifact v1.4.0", "done"],
    ["release:staging", "smoke tests", "done"],
    ["release:production", "gradual rollout", "done"],
    ["health-check", "/api/health → 200", "running"],
  ];
  return (
    <Card title="deploy/pipeline.yml">
      <div className="space-y-2.5">
        {stages.map(([s, sub, state]) => (
          <div key={s} className="flex items-center gap-3">
            <span className={cn("inline-flex size-6 items-center justify-center rounded-full", state === "done" ? "bg-success/15 text-success" : "bg-[#009CFF] text-white")}>
              {state === "done" ? <Check className="size-3.5" aria-hidden="true" /> : <GitCommitHorizontal className="size-3.5" aria-hidden="true" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-[12.5px] text-ink">{s}</span>
              <span className="block font-mono text-[10.5px] text-ink-soft">{sub}</span>
            </span>
            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-bg-soft sm:w-20">
              <span className={cn("block h-full rounded-full", state === "done" ? "w-full bg-success" : "shimmer w-full")} />
            </span>
          </div>
        ))}
      </div>
      <Note>release v1.4.0 → production · env: production · demo pipeline</Note>
    </Card>
  );
}

/* ---------- 08 Monitor & Optimize ---------- */

/** Demo response-time series (ms); drawn as a sparkline. */
const LATENCY = [212, 198, 205, 230, 190, 184, 176, 182, 171, 168, 174, 165];

function Sparkline() {
  const w = 220;
  const h = 56;
  const max = 240;
  const min = 140;
  const pts = LATENCY.map((v, i) => [(i / (LATENCY.length - 1)) * w, h - ((v - min) / (max - min)) * h] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full" preserveAspectRatio="none" aria-hidden="true">
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill="#009CFF" opacity="0.1" />
      <path d={d} fill="none" stroke="#009CFF" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

function Monitor_() {
  const health: [string, number][] = [
    ["API", 99],
    ["Database", 97],
    ["Queue", 100],
  ];
  return (
    <Card title="monitoring/metrics.json">
      <div className="grid gap-3 sm:grid-cols-[1.25fr_1fr]">
        <div className="rounded-xl border border-line p-3">
          <p className="flex items-baseline justify-between font-mono text-[10.5px] text-ink-soft">
            response time <span className="text-[13px] font-semibold text-ink">p95 165 ms</span>
          </p>
          <Sparkline />
          <p className="font-mono text-[10px] text-success">↓ 22% after query optimisation</p>
        </div>
        <div className="rounded-xl border border-line p-3">
          <p className="font-mono text-[10.5px] text-ink-soft">system health</p>
          <div className="mt-2 space-y-2">
            {health.map(([name, pct]) => (
              <div key={name}>
                <p className="flex justify-between text-[11.5px] text-ink">
                  {name} <span className="font-mono text-[10.5px] text-success">{pct}%</span>
                </p>
                <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-bg-soft">
                  <span className="block h-full rounded-full bg-success" style={{ width: `${pct}%` }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[
          ["uptime", "99.9%"],
          ["error rate", "0.02%"],
          ["LCP", "1.8 s"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-bg-blue/60 px-2 py-2">
            <p className="text-[13px] font-semibold text-ink">{v}</p>
            <p className="font-mono text-[10px] text-ink-soft">{k}</p>
          </div>
        ))}
      </div>
      <Note>sample data · not a live dashboard</Note>
    </Card>
  );
}

/* ---------- 09 Scale & Support ---------- */

function Scale() {
  return (
    <Card title="infrastructure/scaling.yml">
      <div className="space-y-0">
        <div className="grid grid-cols-2 gap-1.5">
          <Node icon={Users} label="Users" sub="web · mobile" />
          <Node icon={Globe} label="CDN" sub="static assets" />
        </div>
        <Arrow />
        <Node icon={Network} label="Load balancer" sub="health-checked" tone="blue" />
        <Arrow />
        <div className="grid grid-cols-3 gap-1.5">
          {["app-1", "app-2", "app-3"].map((n) => (
            <Node key={n} icon={Layers} label={n} sub="service" />
          ))}
        </div>
        <Arrow />
        <div className="grid grid-cols-3 gap-1.5">
          <Node icon={Database} label="Primary" sub="PostgreSQL" />
          <Node icon={Database} label="Replica" sub="read" />
          <Node icon={HardDrive} label="Cache" sub="Redis" />
        </div>
      </div>
      <pre className="code-surface mt-3 overflow-x-auto rounded-xl bg-editor p-3 text-[11.5px]">
        <code>
          <span className="tok-prop">replicas</span>
          <span className="tok-punct">: {"{ "}</span>
          <span className="tok-prop">min</span>
          <span className="tok-punct">: </span>
          <span className="tok-type">2</span>
          <span className="tok-punct">, </span>
          <span className="tok-prop">max</span>
          <span className="tok-punct">: </span>
          <span className="tok-type">6</span>
          <span className="tok-punct">{" }"}</span>
          {"\n"}
          <span className="tok-prop">scaleOn</span>
          <span className="tok-punct">: </span>
          <span className="tok-string">cpu &gt; 70%</span>
        </code>
      </pre>
      <Note>example topology · support: updates, fixes and new features over time</Note>
    </Card>
  );
}

export const processSteps = [
  { id: "discover", title: "Discover", summary: "We understand your business goals, users, challenges, and requirements to define a clear project roadmap.", Visual: Discover },
  { id: "plan", title: "Plan & Architect", summary: "We define the system architecture, development roadmap, technology stack, and integration strategy.", Visual: PlanArchitect },
  { id: "design", title: "Design", summary: "We create intuitive interfaces, wireframes, prototypes, and design systems focused on real user needs.", Visual: Design },
  { id: "develop", title: "Develop", summary: "Our engineers build secure, scalable applications using modern frameworks, APIs, and maintainable code.", Visual: Develop },
  { id: "test", title: "Test & QA", summary: "We validate functionality, usability, performance, and reliability through structured testing.", Visual: Test },
  { id: "automate", title: "Automate", summary: "We automate testing, repetitive workflows, builds, and deployments to improve consistency and delivery speed.", Visual: Automate },
  { id: "deploy", title: "Deploy", summary: "We deploy applications using controlled release processes, environment configuration, and production checks.", Visual: Deploy },
  { id: "monitor", title: "Monitor & Optimize", summary: "We monitor application health, identify bottlenecks, and continuously improve performance and reliability.", Visual: Monitor_ },
  { id: "scale", title: "Scale & Support", summary: "We maintain, enhance, and scale your software as your users and business requirements grow.", Visual: Scale },
] as const;
