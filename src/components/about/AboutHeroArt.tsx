import type { ReactNode } from "react";

type Point = readonly [x: number, y: number];

/** Closed path through four corners, with each corner rounded by a quadratic curve. */
function roundedQuad(corners: readonly Point[], radius: number) {
  const towards = (from: Point, to: Point): Point => {
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const t = radius / length;
    return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
  };
  const segments = corners.map((corner, i) => {
    const previous = corners[(i + corners.length - 1) % corners.length]!;
    const next = corners[(i + 1) % corners.length]!;
    const start = towards(corner, previous);
    const end = towards(corner, next);
    return `${i === 0 ? "M" : "L"}${start[0].toFixed(1)} ${start[1].toFixed(1)}Q${corner[0]} ${corner[1]} ${end[0].toFixed(1)} ${end[1].toFixed(1)}`;
  });
  return `${segments.join("")}Z`;
}

const BACK_LINK = roundedQuad([[268, 148], [414, 294], [268, 440], [122, 294]], 44);
const FRONT_LINK = roundedQuad([[438, 47], [613, 222], [438, 397], [263, 222]], 52);
const BAND = 60;
const EXTRUDE = "translate(5 14)";

function Link({ path, id }: { path: string; id: "back" | "front" }) {
  return (
    <g fill="none" strokeLinejoin="round">
      <path d={path} transform={EXTRUDE} stroke={`url(#about-${id}-depth)`} strokeWidth={BAND} />
      <path d={path} stroke={`url(#about-${id}-rim)`} strokeWidth={BAND} />
      <path d={path} stroke={`url(#about-${id}-face)`} strokeWidth={BAND - 4} />
      {/* Flat centre facet: a hard-edged band reads as a chamfered glass bar, where a blurred one reads as a tube. */}
      <path d={path} stroke={`url(#about-${id}-sheen)`} strokeWidth={BAND * 0.62} />
    </g>
  );
}

function CodeGlyph({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="none" stroke="#0072d1" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2 1 11l8 9M29 2l8 9-8 9M22 0l-6 22" />
    </g>
  );
}

function Layer({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 800 520" className={`absolute inset-0 size-full ${className ?? ""}`} focusable="false">
      {children}
    </svg>
  );
}

/**
 * Interlocking glass links between two floating code panels. Purely decorative.
 * Each moving part is its own stacked SVG, so floating one moves a finished layer instead of repainting the
 * artwork, with its mask and gradients, on every frame. They all share the definitions in the links layer.
 */
export function AboutHeroArt({ className }: { className?: string }) {
  return (
    <div className={`relative aspect-[800/520] ${className ?? ""}`} aria-hidden="true">
      <Layer className="about-fade">
        <ellipse cx="370" cy="478" rx="310" ry="30" fill="url(#about-floor)" filter="url(#about-blur-lg)" />
      </Layer>

      <Layer className="about-art-back">
        <g transform="translate(58 64) skewY(7)">
          <rect width="218" height="186" rx="16" fill="url(#about-panel-back)" stroke="#fff" strokeOpacity=".9" strokeWidth="1.5" />
          <CodeGlyph x={22} y={24} />
          <g fill="#2f93e8">
            <rect x="22" y="72" width="108" height="5" rx="2.5" opacity=".75" />
            <rect x="22" y="94" width="150" height="5" rx="2.5" opacity=".55" />
            <rect x="22" y="116" width="92" height="5" rx="2.5" opacity=".7" />
            <rect x="22" y="138" width="130" height="5" rx="2.5" opacity=".5" />
            <rect x="22" y="160" width="74" height="5" rx="2.5" opacity=".6" />
          </g>
        </g>
      </Layer>

      <Layer className="about-art-links">
      <defs>
        <filter id="about-blur-lg" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="20" /></filter>

        <linearGradient id="about-back-face" gradientUnits="userSpaceOnUse" x1="180" y1="430" x2="360" y2="170">
          <stop offset="0" stopColor="#0a57ad" />
          <stop offset=".34" stopColor="#1487ea" />
          <stop offset=".62" stopColor="#9bd5fb" stopOpacity=".78" />
          <stop offset="1" stopColor="#e9f6ff" stopOpacity=".62" />
        </linearGradient>
        <linearGradient id="about-back-depth" gradientUnits="userSpaceOnUse" x1="180" y1="440" x2="360" y2="180">
          <stop offset="0" stopColor="#063f86" />
          <stop offset=".45" stopColor="#1a7fd6" />
          <stop offset="1" stopColor="#bfe3fb" stopOpacity=".7" />
        </linearGradient>
        <linearGradient id="about-back-rim" gradientUnits="userSpaceOnUse" x1="180" y1="430" x2="360" y2="170">
          <stop offset="0" stopColor="#3d9cf0" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="about-back-sheen" gradientUnits="userSpaceOnUse" x1="150" y1="210" x2="350" y2="400">
          <stop offset="0" stopColor="#fff" stopOpacity=".28" />
          <stop offset=".6" stopColor="#fff" stopOpacity=".05" />
          <stop offset="1" stopColor="#7cc8ff" stopOpacity=".14" />
        </linearGradient>

        <linearGradient id="about-front-face" gradientUnits="userSpaceOnUse" x1="340" y1="90" x2="540" y2="390">
          <stop offset="0" stopColor="#0a55aa" />
          <stop offset=".3" stopColor="#0f74da" />
          <stop offset=".55" stopColor="#3aa6f5" stopOpacity=".95" />
          <stop offset=".74" stopColor="#a8dbfc" stopOpacity=".66" />
          <stop offset="1" stopColor="#eef8ff" stopOpacity=".46" />
        </linearGradient>
        <linearGradient id="about-front-depth" gradientUnits="userSpaceOnUse" x1="340" y1="100" x2="540" y2="400">
          <stop offset="0" stopColor="#053d82" />
          <stop offset=".5" stopColor="#1b86de" />
          <stop offset="1" stopColor="#c7e6fb" stopOpacity=".55" />
        </linearGradient>
        <linearGradient id="about-front-rim" gradientUnits="userSpaceOnUse" x1="360" y1="60" x2="520" y2="400">
          <stop offset="0" stopColor="#4aa6f2" />
          <stop offset=".5" stopColor="#c9e9ff" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="about-front-sheen" gradientUnits="userSpaceOnUse" x1="470" y1="50" x2="600" y2="240">
          <stop offset="0" stopColor="#fff" stopOpacity=".05" />
          <stop offset=".65" stopColor="#fff" stopOpacity=".3" />
          <stop offset="1" stopColor="#fff" stopOpacity=".14" />
        </linearGradient>

        <linearGradient id="about-panel-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5fbff" stopOpacity=".92" />
          <stop offset="1" stopColor="#bfe0f8" stopOpacity=".68" />
        </linearGradient>
        <linearGradient id="about-panel-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3faff" stopOpacity=".9" />
          <stop offset="1" stopColor="#c4e3f9" stopOpacity=".8" />
        </linearGradient>
        <radialGradient id="about-floor">
          <stop offset="0" stopColor="#3a9eef" stopOpacity=".5" />
          <stop offset="1" stopColor="#3a9eef" stopOpacity="0" />
        </radialGradient>

        {/* Where the back link passes in front: the front link's band, around the lower crossing only. */}
        <clipPath id="about-crossing"><rect x="290" y="250" width="180" height="170" /></clipPath>
        <mask id="about-over" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="520">
          <g clipPath="url(#about-crossing)" fill="none" stroke="#fff" strokeWidth={BAND}>
            <path d={FRONT_LINK} />
            <path d={FRONT_LINK} transform={EXTRUDE} />
          </g>
        </mask>
      </defs>

      <Link path={BACK_LINK} id="back" />
      <Link path={FRONT_LINK} id="front" />
      <g mask="url(#about-over)"><Link path={BACK_LINK} id="back" /></g>
      </Layer>

      <Layer className="about-art-front">
        <g transform="translate(472 296) skewY(-7)">
          <rect width="218" height="164" rx="16" fill="url(#about-panel-front)" stroke="#fff" strokeOpacity=".95" strokeWidth="1.5" />
          <g fill="#0072d1">
            <circle cx="24" cy="26" r="4.5" />
            <circle cx="40" cy="26" r="4.5" opacity=".7" />
            <circle cx="56" cy="26" r="4.5" opacity=".45" />
          </g>
          <g fill="#2f93e8">
            <rect x="80" y="23" width="112" height="5" rx="2.5" opacity=".6" />
            <rect x="22" y="56" width="136" height="5" rx="2.5" opacity=".7" />
            <rect x="22" y="78" width="88" height="5" rx="2.5" opacity=".55" />
            <rect x="22" y="100" width="108" height="5" rx="2.5" opacity=".6" />
            <rect x="22" y="122" width="62" height="5" rx="2.5" opacity=".5" />
          </g>
          <CodeGlyph x={146} y={108} scale={1.2} />
        </g>
      </Layer>
    </div>
  );
}
