import { cn } from "@/lib/cn";

/*
 * Tiny SVG charts for illustrative dashboards (sample data only).
 * Mark specs: thin bars with 4px rounded data-ends on the baseline, 2px lines,
 * recessive grid, single y-axis. Each mark has a <title> as a native hover tooltip.
 */

export function BarChart({
  data,
  labels,
  className,
  color = "var(--accent)",
  unit = "",
  name,
}: {
  data: number[];
  labels: string[];
  className?: string;
  color?: string;
  unit?: string;
  name: string;
}) {
  const max = Math.max(...data) * 1.15;
  const w = 300;
  const h = 120;
  const gap = 2;
  const bw = w / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h + 16}`} className={cn("w-full", className)} role="img" aria-label={`${name} (sample data)`}>
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1="0" x2={w} y1={h * t} y2={h * t} stroke="var(--line)" strokeWidth="1" />
      ))}
      <line x1="0" x2={w} y1={h} y2={h} stroke="#CFDDEA" strokeWidth="1" />
      {data.map((v, i) => {
        const bh = Math.max(8, (v / max) * h);
        const x = i * bw + bw * 0.22;
        const width = Math.max(2, bw * 0.56 - gap);
        return (
          <g key={i}>
            <path
              d={`M${x},${h} v${-(bh - 4)} q0,-4 4,-4 h${width - 8} q4,0 4,4 v${bh - 4} z`}
              fill={color}
              className="transition-opacity duration-150 hover:opacity-75"
            >
              <title>{`${labels[i]}: ${v}${unit}`}</title>
            </path>
            <text x={x + width / 2} y={h + 12} textAnchor="middle" fontSize="8.5" fill="var(--ink-soft)" fontFamily="var(--font-mono)">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

type Series = { name: string; values: number[]; color: string };

export function LineChart({
  series,
  labels,
  className,
  showLegend = true,
}: {
  series: Series[];
  labels: string[];
  className?: string;
  showLegend?: boolean;
}) {
  const w = 300;
  const h = 110;
  const all = series.flatMap((s) => s.values);
  const max = Math.max(...all) * 1.1;
  const min = Math.min(...all) * 0.85;
  const x = (i: number) => (i / (labels.length - 1)) * w;
  const y = (v: number) => h - ((v - min) / (max - min)) * h;
  return (
    <div className={className}>
      {showLegend && series.length > 1 && (
        <ul className="mb-2 flex flex-wrap gap-3 text-[10px] text-ink-soft">
          {series.map((s) => (
            <li key={s.name} className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} aria-hidden="true" />
              {s.name}
            </li>
          ))}
        </ul>
      )}
      <svg viewBox={`0 0 ${w} ${h + 16}`} className="w-full overflow-visible" role="img" aria-label={`${series.map((s) => s.name).join(" and ")} trend (sample data)`}>
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1="0" x2={w} y1={h * t} y2={h * t} stroke="var(--line)" strokeWidth="1" />
        ))}
        {series.map((s, si) => {
          const d = s.values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
          const lastIndex = s.values.length - 1;
          const last = s.values[lastIndex] ?? 0;
          return (
            <g key={s.name}>
              {si === 0 && <path d={`${d} L${w},${h} L0,${h} Z`} fill={s.color} opacity="0.08" />}
              <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r="6" fill="transparent">
                  <title>{`${s.name} · ${labels[i]}: ${v}`}</title>
                </circle>
              ))}
              <circle cx={x(lastIndex)} cy={y(last)} r="3" fill={s.color} stroke="#fff" strokeWidth="2" />
            </g>
          );
        })}
        {labels.map((l, i) =>
          i % 2 === 0 || labels.length <= 7 ? (
            <text key={l} x={x(i)} y={h + 13} textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"} fontSize="8.5" fill="var(--ink-soft)" fontFamily="var(--font-mono)">
              {l}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

/** Thin horizontal meter with label + value text in ink, colored bar for identity. */
export function Meter({ label, value, max = 100, color = "var(--accent)", suffix = "%" }: { label: string; value: number; max?: number; color?: string; suffix?: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10.5px]">
        <span className="text-ink-soft">{label}</span>
        <span className="font-mono text-ink">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-soft">
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  );
}
