import {
  Bell,
  Boxes,
  ChartColumn,
  Factory,
  FileText,
  LayoutDashboard,
  Package,
  Receipt,
  Search,
  ShoppingCart,
  Truck,
  Workflow,
} from "lucide-react";
import { BarChart, LineChart, Meter } from "./charts";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

/* Illustrative ERP interface. All figures are synthetic sample data. */

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Inventory", icon: Package },
  { label: "Sales", icon: Receipt },
  { label: "Purchasing", icon: ShoppingCart },
  { label: "Production", icon: Factory },
  { label: "Stock", icon: Boxes },
  { label: "Reports", icon: ChartColumn },
  { label: "Workflows", icon: Workflow },
];

function ErpShell({ active, children, className }: { active: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("@container flex h-full min-h-0 bg-white text-ink", className)}>
      <aside className="hidden w-40 shrink-0 flex-col gap-0.5 border-r border-line bg-bg-soft p-3 @[560px]:flex">
        <p className="mb-3 flex items-center gap-2 px-2 text-[12px] font-bold tracking-tight">
          <span className="inline-flex size-5 items-center justify-center rounded-md bg-accent-strong font-mono text-[9px] text-white">ik</span>
          ERP Suite
        </p>
        {NAV.map(({ label, icon: I }) => (
          <span
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px]",
              label === active ? "bg-white font-medium text-accent-strong shadow-sm" : "text-ink-soft",
            )}
          >
            <I className="size-3.5" aria-hidden="true" />
            {label}
          </span>
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-10 items-center gap-3 border-b border-line px-3">
          <p className="text-[12px] font-semibold">{active}</p>
          <span className="ml-auto hidden h-6 w-40 items-center gap-1.5 rounded-md border border-line px-2 text-[10px] text-ink-soft @[420px]:flex">
            <Search className="size-3" aria-hidden="true" /> Search items, orders…
          </span>
          <Bell className="size-3.5 text-ink-soft" aria-hidden="true" />
          <span className="size-6 rounded-full bg-gradient-to-br from-accent to-accent-2" aria-hidden="true" />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden p-3">{children}</div>
      </div>
    </div>
  );
}

function Kpi({ label, value, icon: I, delta }: { label: string; value: string; icon: typeof Package; delta?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-ink-soft">{label}</p>
        <I className="size-3.5 text-accent" aria-hidden="true" />
      </div>
      <p className="mt-1 text-[17px] font-semibold tracking-tight">{value}</p>
      {delta && <p className="font-mono text-[9.5px] text-ink-soft">{delta}</p>}
    </div>
  );
}

export function ErpDashboard({ className }: { className?: string }) {
  return (
    <ErpShell active="Dashboard" className={className}>
      <div className="grid gap-2.5">
        <div className="grid grid-cols-2 gap-2.5 @[520px]:grid-cols-4">
          <Kpi label="Stock items" value="1,284" icon={Package} delta="12 below reorder" />
          <Kpi label="Open sales orders" value="46" icon={Receipt} delta="9 due today" />
          <Kpi label="Purchase orders" value="18" icon={Truck} delta="5 awaiting receipt" />
          <Kpi label="Production runs" value="7" icon={Factory} delta="3 in progress" />
        </div>
        <div className="grid gap-2.5 @[520px]:grid-cols-[1.25fr_1fr]">
          <div className="rounded-xl border border-line p-3">
            <p className="mb-1 text-[11px] font-semibold">Sales vs purchases</p>
            <LineChart
              labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
              series={[
                { name: "Sales", values: [42, 48, 45, 56, 61, 58, 67], color: brand.blue },
                { name: "Purchases", values: [30, 34, 39, 37, 42, 47, 45], color: brand.blueDeep },
              ]}
            />
          </div>
          <div className="rounded-xl border border-line p-3">
            <p className="mb-2 text-[11px] font-semibold">Units produced / week</p>
            <BarChart name="Units produced per week" data={[320, 410, 380, 460, 520, 490]} labels={["W1", "W2", "W3", "W4", "W5", "W6"]} unit=" units" />
          </div>
        </div>
        <div className="hidden rounded-xl border border-line @[420px]:block">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <p className="text-[11px] font-semibold">Low stock</p>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[9px] text-accent-strong">auto-reorder: on</span>
          </div>
          <table className="w-full text-left text-[10.5px]">
            <thead className="text-ink-soft">
              <tr>
                <th className="px-3 py-1.5 font-normal">SKU</th>
                <th className="px-3 py-1.5 font-normal">Item</th>
                <th className="px-3 py-1.5 font-normal">On hand</th>
                <th className="px-3 py-1.5 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["RM-1042", "Aluminium sheet 2mm", "38", "Reorder"],
                ["PK-0310", "Carton 40×30", "120", "Low"],
                ["CP-2207", "Hinge assembly", "64", "Low"],
              ].map(([sku, item, qty, status]) => (
                <tr key={sku} className="border-t border-line">
                  <td className="px-3 py-1.5 font-mono text-ink-soft">{sku}</td>
                  <td className="px-3 py-1.5">{item}</td>
                  <td className="px-3 py-1.5 font-mono">{qty}</td>
                  <td className="px-3 py-1.5">
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[9.5px]", status === "Reorder" ? "bg-danger/10 text-[#b42318]" : "bg-warning/15 text-[#93370d]")}>
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ErpShell>
  );
}

export function ErpInventory({ className }: { className?: string }) {
  const rows = [
    { sku: "RM-1042", name: "Aluminium sheet 2mm", wh: "Main", qty: 38, level: 19 },
    { sku: "RM-1188", name: "Steel rod 12mm", wh: "Main", qty: 410, level: 82 },
    { sku: "CP-2207", name: "Hinge assembly", wh: "Plant B", qty: 64, level: 32 },
    { sku: "PK-0310", name: "Carton 40×30", wh: "Dispatch", qty: 120, level: 40 },
    { sku: "FG-5001", name: "Cabinet unit A", wh: "Dispatch", qty: 86, level: 71 },
  ];
  return (
    <ErpShell active="Inventory" className={className}>
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        {["All warehouses", "Raw materials", "Components", "Finished goods"].map((t, i) => (
          <span key={t} className={cn("rounded-full border px-2.5 py-1 text-[10px]", i === 0 ? "border-accent/30 bg-accent/10 text-accent-strong" : "border-line text-ink-soft")}>
            {t}
          </span>
        ))}
      </div>
      <div className="rounded-xl border border-line">
        {rows.map((r) => (
          <div key={r.sku} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line px-3 py-2 last:border-0 @[480px]:grid-cols-[80px_1fr_80px_120px]">
            <span className="hidden font-mono text-[10px] text-ink-soft @[480px]:block">{r.sku}</span>
            <span className="truncate text-[11px] font-medium">{r.name}</span>
            <span className="hidden text-[10px] text-ink-soft @[480px]:block">{r.wh}</span>
            <Meter label={`${r.qty} on hand`} value={r.level} color={r.level < 35 ? "var(--warning)" : "var(--accent)"} />
          </div>
        ))}
      </div>
    </ErpShell>
  );
}

export function ErpProduction({ className }: { className?: string }) {
  const cols = [
    { title: "Planned", items: ["Cabinet unit A × 120", "Shelf kit × 300"] },
    { title: "In progress", items: ["Door panel × 80", "Hinge assembly × 500"] },
    { title: "Quality check", items: ["Cabinet unit B × 60"] },
    { title: "Completed", items: ["Drawer set × 200", "Frame × 150"] },
  ];
  return (
    <ErpShell active="Production" className={className}>
      <div className="grid grid-cols-2 gap-2 @[520px]:grid-cols-4">
        {cols.map((c, ci) => (
          <div key={c.title} className="rounded-xl bg-bg-soft p-2">
            <p className="mb-2 flex items-center justify-between text-[10.5px] font-semibold">
              {c.title}
              <span className="font-mono text-[9.5px] text-ink-soft">{c.items.length}</span>
            </p>
            <div className="flex flex-col gap-1.5">
              {c.items.map((it) => (
                <div key={it} className="rounded-lg border border-line bg-white p-2 shadow-sm">
                  <p className="text-[10.5px] font-medium">{it}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <FileText className="size-3 text-ink-soft" aria-hidden="true" />
                    <span className="font-mono text-[9px] text-ink-soft">BOM-{(ci + 1) * 104}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ErpShell>
  );
}
