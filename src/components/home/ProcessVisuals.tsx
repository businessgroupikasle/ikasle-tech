import { Activity, Code, Cog, Compass, Lightbulb, PenTool, Rocket, ShieldCheck, TrendingUp } from "lucide-react";
import "./ProcessVisuals.css";

/*
 * One animated vector illustration per delivery phase. Pure SVG + CSS, no JS.
 * Every illustration is drawn in its finished state; the motion in ProcessVisuals.css only plays while the
 * phase is active (the shown desktop preview or the current mobile step) and never under reduced motion.
 * No <defs>/ids are used, so the two copies of each scene (desktop + mobile) can never clash.
 */

const C = {
  navy: "#082B45",
  blue: "#009CFF",
  blueSoft: "#4DB3FF",
  tint: "#EAF6FF",
  line: "#D9E6F2",
  soft: "#F4F8FC",
  editor: "#0B1F33",
  green: "#22C55E",
  yellow: "#FFC94D",
  orange: "#FF8A3D",
  red: "#FF6B6B",
  white: "#FFFFFF",
} as const;

/** Inline animation delay (read by the CSS as var(--d)). */
const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

function Scene({ icon: I, label, tags, alt, children }: { icon: typeof Rocket; label: string; tags: string[]; alt: string; children: React.ReactNode }) {
  return (
    <figure className="pv overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <div className="bg-[radial-gradient(ellipse_at_50%_45%,#EAF6FF,transparent_72%)] px-3 pt-3 sm:px-5 sm:pt-5">
        <svg viewBox="0 0 480 300" className="h-auto w-full" role="img" aria-label={alt}>
          {children}
        </svg>
      </div>
      <figcaption className="flex flex-wrap items-center gap-2 border-t border-line bg-bg-soft px-4 py-2.5">
        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-white text-accent-strong ring-1 ring-line">
          <I className="size-3.5" aria-hidden="true" />
        </span>
        <span className="font-mono text-[11.5px] font-medium text-ink">{label}</span>
        <span className="ml-auto flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-line bg-white px-2 py-0.5 font-mono text-[10.5px] text-ink-soft">
              {t}
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}

/** A gear centred on (cx, cy). `className` controls its rotation. */
function Gear({ cx, cy, r, teeth, fill, hub = C.white, className }: { cx: number; cy: number; r: number; teeth: number; fill: string; hub?: string; className: string }) {
  const w = Math.round(r * 0.3);
  const h = Math.round(r * 0.26);
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g className={className}>
        {Array.from({ length: teeth }, (_, i) => (
          <rect key={i} x={-w / 2} y={-(r + h)} width={w} height={h + 4} rx={2.5} fill={fill} transform={`rotate(${(360 / teeth) * i})`} />
        ))}
        <circle r={r} fill={fill} />
        <circle r={r * 0.42} fill={hub} />
        <circle r={r * 0.16} fill={fill} />
      </g>
    </g>
  );
}

const Floor = ({ y = 276 }: { y?: number }) => <ellipse cx={240} cy={y} rx={200} ry={12} fill={C.tint} />;

/* ---------- 01 Discover: persona, requirements doc, magnifier scanning, idea bulb ---------- */

function Discover() {
  return (
    <Scene icon={Lightbulb} label="01 · discover" tags={["goals", "users", "requirements"]} alt="Illustration: a magnifying glass scanning a requirements document beside a user persona and an idea light bulb">
      <Floor />
      {/* persona + speech bubble */}
      <g className="pv-pop" style={d(0)}>
        <circle cx={78} cy={104} r={32} fill={C.white} stroke={C.line} strokeWidth={2} />
        <circle cx={78} cy={96} r={10} fill={C.navy} />
        <path d="M60 124 q18 -18 36 0" stroke={C.navy} strokeWidth={7} strokeLinecap="round" fill="none" />
      </g>
      <g className="pv-pop" style={d(0.15)}>
        <path d="M70 150 l8 -10 l8 10" fill={C.white} stroke={C.line} strokeWidth={2} strokeLinejoin="round" />
        <rect x={36} y={150} width={84} height={38} rx={12} fill={C.white} stroke={C.line} strokeWidth={2} />
        <rect x={73} y={147} width={10} height={6} fill={C.white} />
        {[60, 78, 96].map((x, i) => (
          <circle key={x} cx={x} cy={169} r={4} fill={C.blue} className="pv-blink" style={d(i * 0.2)} />
        ))}
      </g>

      {/* requirements document */}
      <rect x={150} y={44} width={172} height={214} rx={14} fill={C.white} stroke={C.line} strokeWidth={2} />
      <rect x={170} y={66} width={86} height={10} rx={5} fill={C.navy} />
      <rect x={170} y={86} width={128} height={6} rx={3} fill={C.line} />
      <rect x={170} y={99} width={104} height={6} rx={3} fill={C.line} />
      {[128, 158, 188].map((y, i) => (
        <g key={y}>
          <rect x={170} y={y} width={16} height={16} rx={4} fill={i < 2 ? C.blue : C.white} stroke={i < 2 ? C.blue : C.line} strokeWidth={2} />
          {i < 2 && <path d={`M174 ${y + 8} l3.5 3.5 l6.5 -7`} stroke={C.white} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="pv-draw" style={d(0.4 + i * 0.3)} />}
          <rect x={196} y={y + 5} width={i === 1 ? 72 : 96} height={6} rx={3} fill={C.line} />
        </g>
      ))}
      <rect x={170} y={220} width={132} height={22} rx={7} fill={C.tint} />
      <rect x={180} y={228} width={80} height={6} rx={3} fill={C.blueSoft} opacity={0.6} />

      {/* magnifier scanning the doc */}
      <g className="pv-scan">
        <circle cx={262} cy={150} r={36} fill={C.white} fillOpacity={0.35} stroke={C.blue} strokeWidth={8} />
        <path d="M244 136 a22 22 0 0 1 18 -10" stroke={C.white} strokeWidth={4} strokeLinecap="round" fill="none" />
        <path d="M288 176 L316 204" stroke={C.navy} strokeWidth={12} strokeLinecap="round" />
      </g>

      {/* sticky notes */}
      <g className="pv-pop" style={d(0.3)}>
        <rect x={350} y={136} width={92} height={56} rx={10} fill={C.tint} stroke={C.blueSoft} strokeOpacity={0.5} strokeWidth={2} />
        <text x={364} y={160} className="font-mono" fontSize={12} fontWeight={600} fill={C.navy}>goals</text>
        <rect x={364} y={170} width={60} height={5} rx={2.5} fill={C.blueSoft} opacity={0.5} />
      </g>
      <g className="pv-pop" style={d(0.45)}>
        <rect x={340} y={204} width={100} height={52} rx={10} fill={C.white} stroke={C.line} strokeWidth={2} />
        <text x={354} y={227} className="font-mono" fontSize={12} fontWeight={600} fill={C.navy}>users</text>
        <rect x={354} y={236} width={70} height={5} rx={2.5} fill={C.line} />
      </g>

      {/* idea bulb */}
      <circle cx={396} cy={70} r={36} fill={C.yellow} opacity={0.22} className="pv-glow" />
      {[
        [396, 22, 396, 30],
        [356, 40, 362, 46],
        [436, 40, 430, 46],
      ].map(([x1, y1, x2, y2]) => (
        <path key={`${x1}-${y1}`} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={C.yellow} strokeWidth={4} strokeLinecap="round" className="pv-blink" />
      ))}
      <circle cx={396} cy={68} r={21} fill={C.yellow} />
      <path d="M389 68 l7 7 l7 -7" stroke={C.white} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={387} y={86} width={18} height={13} rx={3} fill={C.navy} />
    </Scene>
  );
}

/* ---------- 02 Plan & Architect: blueprint, drawn connections, compass, roadmap ---------- */

function PlanArchitect() {
  const nodes: [number, number, number, string][] = [
    [190, 50, 100, "frontend"],
    [190, 116, 100, "api"],
    [110, 184, 92, "service"],
    [278, 184, 92, "service"],
  ];
  return (
    <Scene icon={Compass} label="02 · plan & architect" tags={["architecture", "roadmap", "stack"]} alt="Illustration: a blueprint with an architecture diagram being drawn, a drafting compass and a roadmap with milestones">
      <rect x={24} y={20} width={432} height={260} rx={18} fill="#0A3A63" />
      {Array.from({ length: 13 }, (_, i) => (
        <path key={`v${i}`} d={`M${54 + i * 30} 20 V280`} stroke={C.white} strokeOpacity={0.07} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`h${i}`} d={`M24 ${46 + i * 30} H456`} stroke={C.white} strokeOpacity={0.07} />
      ))}

      {/* connections draw in */}
      {["M240 86 V116", "M240 152 V168 H156 V184", "M240 152 V168 H324 V184", "M290 134 H368"].map((p, i) => (
        <path key={p} d={p} stroke={C.blueSoft} strokeWidth={2.5} fill="none" strokeLinejoin="round" pathLength={1} className="pv-draw" style={d(0.35 + i * 0.2)} />
      ))}

      {nodes.map(([x, y, w, label], i) => (
        <g key={`${x}-${y}`} className="pv-pop" style={d(i * 0.12)}>
          <rect x={x} y={y} width={w} height={36} rx={9} fill={C.white} fillOpacity={0.07} stroke={C.white} strokeOpacity={0.75} strokeWidth={2} />
          <text x={x + w / 2} y={y + 22} textAnchor="middle" className="font-mono" fontSize={12} fill={C.white} fillOpacity={0.9}>
            {label}
          </text>
        </g>
      ))}

      {/* database cylinder */}
      <g className="pv-pop" style={d(0.5)}>
        <path d="M372 116 V150 A28 9 0 0 0 428 150 V116" fill={C.white} fillOpacity={0.07} stroke={C.white} strokeOpacity={0.75} strokeWidth={2} />
        <ellipse cx={400} cy={116} rx={28} ry={9} fill="#0A3A63" stroke={C.white} strokeOpacity={0.75} strokeWidth={2} />
        <path d="M372 133 A28 9 0 0 0 428 133" fill="none" stroke={C.white} strokeOpacity={0.4} strokeWidth={1.5} />
      </g>

      {/* drafting compass swinging an arc */}
      <path d="M50 150 A44 44 0 0 0 112 150" fill="none" stroke={C.yellow} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="4 5" />
      <g className="pv-swing" style={{ transformOrigin: "80px 62px" }}>
        <path d="M80 62 L58 146 M80 62 L102 146" stroke={C.yellow} strokeWidth={5} strokeLinecap="round" />
        <circle cx={80} cy={60} r={8} fill={C.yellow} />
        <path d="M80 44 V52" stroke={C.yellow} strokeWidth={4} strokeLinecap="round" />
      </g>

      {/* roadmap */}
      <path d="M70 254 H420" stroke={C.white} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 6" className="pv-flow" />
      {[
        [110, "v1"],
        [240, "v1.1"],
        [370, "v2"],
      ].map(([x, t], i) => (
        <g key={t} className="pv-pop" style={d(0.8 + i * 0.2)}>
          <circle cx={x as number} cy={254} r={7} fill={i === 0 ? C.blue : "#0A3A63"} stroke={C.blueSoft} strokeWidth={2.5} />
          <text x={(x as number) + 12} y={246} className="font-mono" fontSize={11} fill={C.white} fillOpacity={0.8}>
            {t}
          </text>
        </g>
      ))}
    </Scene>
  );
}

/* ---------- 03 Design: artboard, selection, palette, pen curve, cursor ---------- */

function Design() {
  return (
    <Scene icon={PenTool} label="03 · design" tags={["wireframes", "prototype", "design system"]} alt="Illustration: a design artboard with a wireframe layout, colour swatches, a pen-tool curve and a moving cursor">
      <Floor />
      <rect x={60} y={34} width={268} height={226} rx={14} fill={C.white} stroke={C.line} strokeWidth={2} />
      <rect x={76} y={50} width={236} height={18} rx={6} fill={C.tint} />
      {[88, 100, 112].map((x) => (
        <circle key={x} cx={x} cy={59} r={3.5} fill={C.blueSoft} />
      ))}
      {/* hero */}
      <rect x={80} y={84} width={136} height={12} rx={6} fill={C.navy} />
      <rect x={80} y={104} width={108} height={7} rx={3.5} fill={C.line} />
      <rect x={80} y={120} width={58} height={18} rx={9} fill={C.blue} />
      <rect x={232} y={80} width={80} height={58} rx={9} fill={C.tint} />
      <path d="M240 130 L262 106 L278 120 L290 110 L306 130 Z" fill={C.blueSoft} opacity={0.6} />
      <circle cx={292} cy={94} r={6} fill={C.yellow} />
      {/* selection around the hero */}
      <rect x={72} y={76} width={152} height={70} rx={4} fill="none" stroke={C.blue} strokeWidth={1.5} strokeDasharray="5 4" className="pv-march" />
      {[
        [72, 76],
        [224, 76],
        [72, 146],
        [224, 146],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x! - 4} y={y! - 4} width={8} height={8} fill={C.white} stroke={C.blue} strokeWidth={1.5} />
      ))}
      {/* cards */}
      {[78, 162, 246].map((x, i) => (
        <g key={x} className="pv-pop" style={d(0.2 + i * 0.15)}>
          <rect x={x} y={160} width={68} height={84} rx={9} fill={C.soft} stroke={C.line} strokeWidth={1.5} />
          <rect x={x + 10} y={172} width={22} height={22} rx={6} fill={i === 1 ? C.blue : C.tint} />
          <rect x={x + 10} y={204} width={46} height={6} rx={3} fill={C.navy} opacity={0.75} />
          <rect x={x + 10} y={218} width={36} height={5} rx={2.5} fill={C.line} />
        </g>
      ))}

      {/* typography + swatches */}
      <text x={352} y={76} fontSize={36} fontWeight={700} fill={C.navy}>
        Aa
      </text>
      {[
        [362, 106, C.navy],
        [396, 106, C.blue],
        [430, 106, C.tint],
        [362, 140, C.yellow],
        [396, 140, C.blueSoft],
        [430, 140, C.green],
      ].map(([x, y, c], i) => (
        <circle key={`${x}-${y}`} cx={x as number} cy={y as number} r={12} fill={c as string} stroke={C.line} strokeWidth={1.5} className="pv-pop" style={d(0.3 + i * 0.08)} />
      ))}

      {/* pen-tool bezier */}
      <path d="M350 172 L376 200" stroke={C.blue} strokeWidth={1.5} />
      <path d="M444 238 L420 214" stroke={C.blue} strokeWidth={1.5} />
      <path d="M350 236 C 376 200, 420 214, 444 170" fill="none" stroke={C.navy} strokeWidth={3} strokeLinecap="round" pathLength={1} className="pv-draw" style={d(0.4)} />
      <rect x={345} y={231} width={10} height={10} fill={C.white} stroke={C.navy} strokeWidth={2} />
      <rect x={439} y={165} width={10} height={10} fill={C.white} stroke={C.navy} strokeWidth={2} />
      <circle cx={350} cy={172} r={4} fill={C.blue} />
      <circle cx={444} cy={238} r={4} fill={C.blue} />

      {/* cursor */}
      <g transform="translate(206 128)">
        <g className="pv-cursor">
          <path d="M0 0 L0 24 L6.5 18 L11 28 L15.5 26 L11 16 L19 16 Z" fill={C.navy} stroke={C.white} strokeWidth={2} strokeLinejoin="round" />
        </g>
      </g>
    </Scene>
  );
}

/* ---------- 04 Develop: laptop with code typing, floating </> badge, gear ---------- */

const CODE_ROWS: [number, number, string][] = [
  [126, 70, C.blueSoft],
  [138, 120, C.white],
  [138, 92, C.yellow],
  [150, 104, C.green],
  [150, 66, C.blueSoft],
  [138, 84, C.white],
  [126, 40, C.blueSoft],
];

function Develop() {
  return (
    <Scene icon={Code} label="04 · develop" tags={["frameworks", "apis", "clean code"]} alt="Illustration: a laptop with code being typed, a floating code badge, a spinning gear and a passing build card">
      <Floor />
      <rect x={96} y={38} width={288} height={184} rx={14} fill={C.navy} />
      <rect x={106} y={48} width={268} height={164} rx={7} fill={C.editor} />
      {[C.red, C.yellow, C.green].map((c, i) => (
        <circle key={c} cx={120 + i * 12} cy={61} r={3.5} fill={c} />
      ))}
      <rect x={160} y={57} width={70} height={8} rx={4} fill={C.white} opacity={0.12} />
      {CODE_ROWS.map(([x, w, c], i) => (
        <g key={i}>
          <text x={112} y={89 + i * 16} className="font-mono" fontSize={9} fill={C.white} fillOpacity={0.25}>
            {i + 1}
          </text>
          <rect x={x} y={82 + i * 16} width={w} height={7} rx={3.5} fill={c} opacity={0.85} className="pv-type" style={d(i * 0.22)} />
        </g>
      ))}
      <rect x={170} y={180} width={3} height={12} fill={C.blueSoft} className="pv-caret" />
      {/* base */}
      <path d="M66 222 H414 L434 240 Q436 246 428 246 H52 Q44 246 46 240 Z" fill={C.line} />
      <rect x={210} y={222} width={60} height={6} rx={3} fill="#C5D6E6" />

      {/* floating badges */}
      <g className="pv-float">
        <circle cx={418} cy={62} r={28} fill={C.blue} />
        <text x={418} y={68} textAnchor="middle" className="font-mono" fontSize={16} fontWeight={700} fill={C.white}>
          {"</>"}
        </text>
      </g>
      <Gear cx={58} cy={84} r={18} teeth={8} fill={C.blueSoft} className="pv-spin" />
      <text x={36} y={190} className="font-mono pv-float" style={d(-1.2)} fontSize={34} fontWeight={700} fill={C.blue} fillOpacity={0.35}>
        {"{ }"}
      </text>
      <g className="pv-pop" style={d(1.4)}>
        <rect x={332} y={172} width={126} height={38} rx={11} fill={C.white} stroke={C.line} strokeWidth={2} />
        <circle cx={352} cy={191} r={9} fill={C.green} />
        <path d="M347.5 191 l3 3 l5.5 -6" stroke={C.white} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x={368} y={195} className="font-mono" fontSize={11.5} fill={C.navy}>
          build ok
        </text>
      </g>
    </Scene>
  );
}

/* ---------- 05 Automate: meshing gears, conveyor, energy bolt ---------- */

function Automate() {
  return (
    <Scene icon={Cog} label="05 · automate" tags={["ci workflows", "quality checks", "speed"]} alt="Illustration: three meshing gears turning a conveyor belt that carries packages, powered by a lightning bolt">
      <Floor y={280} />
      {/* gears: angular speed is inversely proportional to tooth count so the teeth stay in mesh */}
      <Gear cx={160} cy={104} r={50} teeth={12} fill={C.blue} className="pv-spin pv-slow" />
      <Gear cx={236} cy={152} r={30} teeth={8} fill={C.navy} className="pv-spin-rev pv-mid" />
      <Gear cx={276} cy={111} r={18} teeth={6} fill={C.blueSoft} className="pv-spin pv-fast" />

      {/* power flow into the gears */}
      <path d="M372 92 C 330 92, 330 112, 300 112" fill="none" stroke={C.blue} strokeWidth={3} strokeDasharray="6 6" strokeLinecap="round" className="pv-flow" />
      <circle cx={400} cy={84} r={36} fill={C.yellow} opacity={0.2} className="pv-glow" />
      <circle cx={400} cy={84} r={26} fill={C.yellow} />
      <path d="M404 66 L390 88 H400 L396 104 L412 80 H402 Z" fill={C.navy} strokeLinejoin="round" />

      {/* conveyor */}
      <rect x={40} y={238} width={400} height={18} rx={9} fill={C.navy} />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={58 + i * 45.5} cy={247} r={4.5} fill={C.blueSoft} />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} className="pv-belt" style={{ ...d(-i * 2.4), transform: `translateX(${i * 130}px)` }}>
          <rect x={46} y={206} width={40} height={32} rx={5} fill={C.tint} stroke={C.blue} strokeWidth={2} />
          <path d="M66 206 V238" stroke={C.blue} strokeWidth={2} opacity={0.5} />
          <path d="M58 218 l4 4 l8 -8" stroke={C.green} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <path d="M330 176 C 380 176, 400 196, 404 220" fill="none" stroke={C.blueSoft} strokeWidth={2} strokeDasharray="4 6" className="pv-flow" />
    </Scene>
  );
}

/* ---------- 06 Test & QA: shield with drawn check, checklist, caught bug ---------- */

function Test() {
  return (
    <Scene icon={ShieldCheck} label="06 · test & qa" tags={["functional", "integration", "regression"]} alt="Illustration: a shield with a check mark, a checklist ticking off tests and a bug caught under a magnifying glass">
      <Floor />
      <circle cx={240} cy={146} r={112} fill="none" stroke={C.blue} strokeOpacity={0.25} strokeWidth={2} className="pv-ring" />
      <path d="M240 38 L322 68 V140 C322 198 286 234 240 256 C194 234 158 198 158 140 V68 Z" fill={C.tint} stroke={C.blue} strokeWidth={4} strokeLinejoin="round" />
      <path d="M240 60 L302 82 V140 C302 186 274 214 240 232 C206 214 178 186 178 140 V82 Z" fill={C.white} />
      <path d="M206 146 L232 172 L280 118" stroke={C.blue} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="pv-draw" style={d(0.3)} />

      {/* checklist */}
      <rect x={20} y={74} width={118} height={130} rx={12} fill={C.white} stroke={C.line} strokeWidth={2} />
      {[98, 132, 166].map((y, i) => (
        <g key={y}>
          <g className="pv-pop" style={d(0.5 + i * 0.3)}>
            <circle cx={42} cy={y} r={9} fill={C.green} />
            <path d={`M37.5 ${y} l3 3 l5.5 -6`} stroke={C.white} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <rect x={58} y={y - 3} width={i === 1 ? 50 : 64} height={6} rx={3} fill={C.line} />
        </g>
      ))}

      {/* bug under a magnifier */}
      <circle cx={396} cy={146} r={42} fill={C.white} stroke={C.navy} strokeWidth={6} />
      <path d="M426 176 L452 204" stroke={C.navy} strokeWidth={11} strokeLinecap="round" />
      <g className="pv-wiggle">
        {[-8, 0, 8].map((dy) => (
          <path key={dy} d={`M380 ${150 + dy} H412`} stroke={C.navy} strokeWidth={2.5} strokeLinecap="round" />
        ))}
        <ellipse cx={396} cy={152} rx={11} ry={15} fill={C.red} />
        <path d="M396 138 V166" stroke={C.white} strokeOpacity={0.6} strokeWidth={1.5} />
        <circle cx={396} cy={134} r={7} fill={C.navy} />
        <path d="M392 128 l-5 -7 M400 128 l5 -7" stroke={C.navy} strokeWidth={2} strokeLinecap="round" />
      </g>
      <g className="pv-pop" style={d(1)}>
        <circle cx={430} cy={108} r={11} fill={C.red} />
        <path d="M426 104 l8 8 M434 104 l-8 8" stroke={C.white} strokeWidth={2.4} strokeLinecap="round" />
      </g>

      {/* sparkles */}
      {[
        [178, 44],
        [326, 236],
        [118, 236],
      ].map(([x, y], i) => (
        <path key={`${x}-${y}`} d={`M${x} ${y! - 8} L${x! + 2.5} ${y! - 2.5} L${x! + 8} ${y} L${x! + 2.5} ${y! + 2.5} L${x} ${y! + 8} L${x! - 2.5} ${y! + 2.5} L${x! - 8} ${y} L${x! - 2.5} ${y! - 2.5} Z`} fill={C.yellow} className="pv-twinkle" style={d(i * 0.5)} />
      ))}
    </Scene>
  );
}

/* ---------- 07 Deploy: rocket lift-off with flame, smoke, stars ---------- */

function Deploy() {
  return (
    <Scene icon={Rocket} label="07 · deploy" tags={["release", "environments", "production checks"]} alt="Illustration: a rocket lifting off a launch pad with flames and smoke, tagged as released to production">
      {/* stars */}
      {[
        [70, 50],
        [130, 96],
        [360, 44],
        [420, 150],
        [96, 170],
        [330, 200],
      ].map(([x, y], i) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill={C.blueSoft} className="pv-twinkle" style={d(i * 0.35)} />
      ))}
      {/* drifting clouds */}
      <g className="pv-cloud">
        <path d="M40 120 a16 16 0 0 1 26 -12 a20 20 0 0 1 36 6 a13 13 0 0 1 4 26 H48 a14 14 0 0 1 -8 -20 Z" fill={C.white} stroke={C.line} strokeWidth={2} />
      </g>
      <g className="pv-cloud" style={d(-6)}>
        <path d="M356 236 a14 14 0 0 1 22 -10 a18 18 0 0 1 32 6 a12 12 0 0 1 3 22 H362 a12 12 0 0 1 -6 -18 Z" fill={C.white} stroke={C.line} strokeWidth={2} />
      </g>

      {/* speed lines */}
      {[198, 282, 214, 266].map((x, i) => (
        <path key={x} d={`M${x} ${190 + (i % 2) * 14} v24`} stroke={C.blue} strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" className="pv-speed" style={d(i * 0.25)} />
      ))}

      {/* smoke + pad */}
      {[
        [196, 256, 16],
        [284, 256, 16],
        [218, 264, 14],
        [262, 264, 14],
        [240, 266, 12],
      ].map(([cx, cy, r], i) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={C.line} className="pv-puff" style={d(i * 0.2)} />
      ))}
      <rect x={176} y={270} width={128} height={10} rx={5} fill={C.navy} />

      {/* rocket */}
      <g className="pv-rocket">
        <g className="pv-flame">
          <path d="M226 184 Q240 244 254 184 Z" fill={C.yellow} />
          <path d="M233 184 Q240 220 247 184 Z" fill={C.orange} />
        </g>
        <path d="M212 152 L190 190 L214 182 Z" fill={C.blue} stroke={C.navy} strokeWidth={3} strokeLinejoin="round" />
        <path d="M268 152 L290 190 L266 182 Z" fill={C.blue} stroke={C.navy} strokeWidth={3} strokeLinejoin="round" />
        <path d="M240 50 C 264 76 272 118 270 176 H210 C208 118 216 76 240 50 Z" fill={C.white} stroke={C.navy} strokeWidth={3} strokeLinejoin="round" />
        <path d="M240 50 C 252 62 259 76 263 90 H217 C221 76 228 62 240 50 Z" fill={C.blue} />
        <circle cx={240} cy={124} r={14} fill={C.tint} stroke={C.navy} strokeWidth={3} />
        <circle cx={235} cy={119} r={4} fill={C.white} />
        <rect x={222} y={174} width={36} height={11} rx={3} fill={C.navy} />
      </g>

      {/* release tag */}
      <g className="pv-pop" style={d(0.6)}>
        <rect x={318} y={88} width={130} height={32} rx={16} fill={C.white} stroke={C.line} strokeWidth={2} />
        <circle cx={338} cy={104} r={5} fill={C.green} className="pv-blink" />
        <text x={352} y={108} className="font-mono" fontSize={11.5} fill={C.navy}>
          v1.4.0 live
        </text>
      </g>
    </Scene>
  );
}

/* ---------- 08 Monitor & Optimize: monitor with drawn chart, gauge, heartbeat ---------- */

function MonitorScene() {
  const line = "M90 176 L122 156 L154 164 L186 124 L218 136 L250 102 L282 112 L314 76 L330 82";
  return (
    <Scene icon={Activity} label="08 · monitor & optimize" tags={["health", "performance", "uptime"]} alt="Illustration: a monitor showing a rising performance chart, a health gauge and a live heartbeat line">
      <Floor y={278} />
      <rect x={58} y={28} width={304} height={196} rx={14} fill={C.navy} />
      <rect x={70} y={40} width={280} height={172} rx={8} fill={C.white} />
      <rect x={86} y={54} width={74} height={8} rx={4} fill={C.navy} />
      <circle cx={330} cy={58} r={5} fill={C.green} className="pv-blink" />
      {[90, 128, 166].map((y) => (
        <path key={y} d={`M86 ${y} H334`} stroke={C.line} strokeDasharray="3 4" />
      ))}
      <path d={`${line} L330 196 L90 196 Z`} fill={C.blue} opacity={0.1} className="pv-fade" style={d(0.6)} />
      <path d={line} fill="none" stroke={C.blue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="pv-draw" style={d(0.1)} />
      <circle cx={330} cy={82} r={12} fill={C.blue} opacity={0.2} className="pv-glow" />
      <circle cx={330} cy={82} r={5} fill={C.blue} />
      <rect x={196} y={224} width={28} height={24} fill={C.line} />
      <rect x={160} y={246} width={100} height={10} rx={5} fill="#C5D6E6" />

      {/* gauge */}
      <rect x={374} y={36} width={96} height={100} rx={14} fill={C.white} stroke={C.line} strokeWidth={2} />
      <path d="M394 104 A28 28 0 0 1 450 104" fill="none" stroke={C.line} strokeWidth={8} strokeLinecap="round" />
      <path d="M394 104 A28 28 0 0 1 444 88" fill="none" stroke={C.green} strokeWidth={8} strokeLinecap="round" />
      <g className="pv-needle" style={{ transformOrigin: "422px 104px" }}>
        <path d="M422 104 L436 82" stroke={C.navy} strokeWidth={3.5} strokeLinecap="round" />
      </g>
      <circle cx={422} cy={104} r={5} fill={C.navy} />
      <text x={422} y={126} textAnchor="middle" className="font-mono" fontSize={10.5} fill={C.navy}>
        health
      </text>

      {/* heartbeat */}
      <rect x={374} y={150} width={96} height={64} rx={14} fill={C.white} stroke={C.line} strokeWidth={2} />
      <path d="M384 184 H402 L408 168 L416 198 L422 178 L428 184 H460" fill="none" stroke={C.line} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M384 184 H402 L408 168 L416 198 L422 178 L428 184 H460" fill="none" stroke={C.red} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="pv-trace" />
    </Scene>
  );
}

/* ---------- 09 Scale & Support: growing bars, trend arrow, new server, support chat ---------- */

function Scale() {
  const bars: [number, number, string][] = [
    [62, 50, "#BFE3FF"],
    [102, 82, "#7CC8FF"],
    [142, 118, "#38AEFF"],
    [182, 158, C.blue],
  ];
  return (
    <Scene icon={TrendingUp} label="09 · scale & support" tags={["growth", "maintenance", "support"]} alt="Illustration: growing bar chart with an upward trend arrow, a server rack adding a new server and a support agent chat bubble">
      <Floor />
      <path d="M46 244 H232" stroke={C.line} strokeWidth={3} strokeLinecap="round" />
      {bars.map(([x, h, c], i) => (
        <rect key={x} x={x} y={244 - h} width={28} height={h} rx={6} fill={c} className="pv-grow" style={d(i * 0.15)} />
      ))}
      <path d="M58 200 L106 172 L148 146 L196 98 L226 80" fill="none" stroke={C.navy} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="pv-draw" style={d(0.6)} />
      <path d="M210 76 L228 79 L224 97" fill="none" stroke={C.navy} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" className="pv-pop" style={d(1.1)} />

      {/* server rack: the top unit is the newly added one */}
      {[150, 184, 218].map((y, i) => (
        <g key={y} className={i === 0 ? "pv-pop" : undefined} style={i === 0 ? d(0.8) : undefined}>
          <rect x={282} y={y} width={116} height={28} rx={7} fill={i === 0 ? C.blue : C.navy} />
          <rect x={296} y={y + 11} width={46} height={6} rx={3} fill={C.white} opacity={0.25} />
          {[372, 384].map((x, j) => (
            <circle key={x} cx={x} cy={y + 14} r={3.5} fill={j === 0 ? C.green : C.blueSoft} className="pv-blink" style={d(i * 0.3 + j * 0.15)} />
          ))}
        </g>
      ))}
      <g className="pv-pop" style={d(1)}>
        <circle cx={420} cy={164} r={13} fill={C.green} />
        <path d="M420 157 V171 M413 164 H427" stroke={C.white} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* support chat */}
      <g className="pv-float">
        <rect x={290} y={36} width={160} height={76} rx={18} fill={C.white} stroke={C.line} strokeWidth={2} />
        <path d="M320 112 l-6 14 l18 -14" fill={C.white} stroke={C.line} strokeWidth={2} strokeLinejoin="round" />
        <path d="M321 110 H331" stroke={C.white} strokeWidth={4} />
        <circle cx={324} cy={74} r={20} fill={C.tint} />
        <circle cx={324} cy={70} r={7} fill={C.navy} />
        <path d="M312 86 q12 -10 24 0" stroke={C.navy} strokeWidth={5} strokeLinecap="round" fill="none" />
        <path d="M309 72 a15 15 0 0 1 30 0" stroke={C.blue} strokeWidth={3} fill="none" strokeLinecap="round" />
        <rect x={305} y={69} width={6} height={10} rx={3} fill={C.blue} />
        <rect x={337} y={69} width={6} height={10} rx={3} fill={C.blue} />
        {[366, 384, 402].map((x, i) => (
          <circle key={x} cx={x} cy={74} r={4.5} fill={C.blue} className="pv-blink" style={d(i * 0.2)} />
        ))}
      </g>
    </Scene>
  );
}

export const processSteps = [
  { id: "discover", title: "Discover", summary: "We understand your business goals, users, challenges, and requirements to define a clear project roadmap.", Visual: Discover },
  { id: "plan", title: "Plan & Architect", summary: "We define the system architecture, development roadmap, technology stack, and integration strategy.", Visual: PlanArchitect },
  { id: "design", title: "Design", summary: "We create intuitive interfaces, wireframes, prototypes, and design systems focused on real user needs.", Visual: Design },
  { id: "develop", title: "Develop", summary: "Our engineers build secure, scalable applications using modern frameworks, APIs, and maintainable code.", Visual: Develop },
  { id: "automate", title: "Automate", summary: "We automate repetitive development tasks, configure CI workflows, and prepare automated quality checks to improve consistency and delivery speed.", Visual: Automate },
  { id: "test", title: "Test & QA", summary: "We validate functionality, usability, integration, performance, and reliability through structured manual and automated testing.", Visual: Test },
  { id: "deploy", title: "Deploy", summary: "We deploy applications using controlled release processes, environment configuration, and production checks.", Visual: Deploy },
  { id: "monitor", title: "Monitor & Optimize", summary: "We monitor application health, identify bottlenecks, and continuously improve performance and reliability.", Visual: MonitorScene },
  { id: "scale", title: "Scale & Support", summary: "We maintain, enhance, and scale your software as your users and business requirements grow.", Visual: Scale },
] as const;
