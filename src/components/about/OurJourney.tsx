"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Sparkles,
  Layers,
  Compass,
  Target,
  Workflow,
  BrainCircuit,
  Rocket,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Zap,
  Orbit,
  type LucideIcon,
} from "lucide-react";
import { RevealGroup } from "./AboutReveal";

type JourneyPhase = {
  year: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  status: "Completed" | "Active Now" | "Future Vision";
  focus: string;
  highlights: string[];
};

function CrackerBlast({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.offsetWidth || 800);
    const height = (canvas.height = canvas.offsetHeight || 500);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      gravity: number;
      trail: { x: number; y: number }[];
    };

    const colors = [
      "#38bdf8",
      "#008cf8",
      "#fbbf24",
      "#f43f5e",
      "#34d399",
      "#c084fc",
      "#ffffff",
      "#60a5fa",
      "#f59e0b",
    ];
    const particles: Particle[] = [];

    // 3 Burst epicenters for celebratory cracker blast
    const origins = [
      { x: width * 0.5, y: height * 0.3 },
      { x: width * 0.25, y: height * 0.45 },
      { x: width * 0.75, y: height * 0.45 },
    ];

    origins.forEach((origin) => {
      const count = 35;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 8 + 3.5;
        particles.push({
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)]!,
          alpha: 1,
          decay: Math.random() * 0.016 + 0.012,
          gravity: 0.14,
          trail: [],
        });
      }
    });

    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw spark trail
        ctx.save();
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.5;
        ctx.lineWidth = p.size * 0.7;
        ctx.beginPath();
        for (let t = 0; t < p.trail.length; t++) {
          const pt = p.trail[t]!;
          if (t === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Draw spark head
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-30 h-full w-full rounded-[28px]"
    />
  );
}

function CountdownTo2027() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Target date: January 1, 2027 00:00:00
    const target = new Date("2027-01-01T00:00:00");

    const updateTimer = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const blocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="mt-8 grid grid-cols-4 gap-2.5 sm:gap-4 max-w-lg mx-auto">
      {blocks.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center rounded-2xl border border-cyan-400/30 bg-gradient-to-b from-cyan-400/15 to-blue-500/10 p-3 sm:p-5 backdrop-blur-md shadow-[0_0_24px_rgba(56,189,248,0.2)]"
        >
          <span className="font-mono text-2xl font-black text-white sm:text-4xl tabular-nums">
            {mounted ? String(value).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 font-mono text-[9px] font-semibold text-cyan-300 uppercase tracking-widest sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

const JOURNEY_PHASES: JourneyPhase[] = [
  {
    year: "2020",
    phase: "Phase 01",
    title: "The Beginning of a Vision",
    subtitle: "Where It All Started.",
    description:
      "An idea was born to bring technology and creativity together and explore new possibilities through digital solutions.",
    icon: Sparkles,
    status: "Completed",
    focus: "Curiosity & Early Possibilities",
    highlights: ["Founded in Coimbatore", "Technology & Creativity Union", "Exploratory Digital Solutions"],
  },
  {
    year: "2021",
    phase: "Phase 02",
    title: "Laying the Foundation",
    subtitle: "Learning to Build.",
    description:
      "We focused on establishing our foundation, developing our capabilities and shaping the values that would guide our journey.",
    icon: Layers,
    status: "Completed",
    focus: "Core Engineering & Principles",
    highlights: ["Technical Foundation Setup", "Capability Development", "Guiding Values Established"],
  },
  {
    year: "2022",
    phase: "Phase 03",
    title: "Growth and Exploration",
    subtitle: "Expanding Our Horizons.",
    description:
      "We explored new technologies, learned from new challenges and expanded our understanding of the digital world.",
    icon: Compass,
    status: "Completed",
    focus: "Modern Frameworks & Horizon Expansion",
    highlights: ["Exploration of New Stacks", "Learning from Complex Challenges", "Broader Tech Landscape"],
  },
  {
    year: "2023",
    phase: "Phase 04",
    title: "Making an Impact",
    subtitle: "Turning Ideas Into Experiences.",
    description:
      "We strengthened our capabilities and continued creating digital solutions around evolving business requirements.",
    icon: Target,
    status: "Completed",
    focus: "Real Business Digital Solutions",
    highlights: ["Evolving Business Workflows", "Production-Ready Platforms", "Strengthened Delivery"],
  },
  {
    year: "2024",
    phase: "Phase 05",
    title: "Evolving for the Future",
    subtitle: "Adapting and Improving.",
    description:
      "We focused on improving our approach, embracing change and preparing ourselves for the next stage of growth.",
    icon: Workflow,
    status: "Completed",
    focus: "Scalable Architecture & Optimization",
    highlights: ["Approach Modernization", "Change & Process Agility", "Scale Preparation"],
  },
  {
    year: "2025",
    phase: "Phase 06",
    title: "Building Smarter Solutions",
    subtitle: "Exploring Intelligent Technology.",
    description:
      "We expanded our interest in AI, automation and smarter ways to approach digital product development.",
    icon: BrainCircuit,
    status: "Completed",
    focus: "AI & Intelligent Automation",
    highlights: ["AI Technology Integration", "Automated Workflows", "Smart Product Development"],
  },
  {
    year: "2026",
    phase: "Phase 07",
    title: "Engineering What's Next",
    subtitle: "A New Chapter Begins.",
    description:
      "We are sharpening our identity as a software engineering company, strengthening our capabilities and opening new opportunities for international collaboration.",
    icon: Rocket,
    status: "Active Now",
    focus: "Global Software Engineering Partner",
    highlights: ["International Portfolio (UK & UAE)", "59 Engineering Practices", "Custom Software & SaaS"],
  },
  {
    year: "2027",
    phase: "Phase 08",
    title: "Scaling New Frontiers & Autonomous Systems",
    subtitle: "The Future We Are Engineering.",
    description:
      "Looking ahead, we are expanding into autonomous agent workflows, advanced AI platforms, and deepened international partnerships to empower businesses with future-ready technology.",
    icon: Orbit,
    status: "Future Vision",
    focus: "Autonomous AI, Global Expansion & Scaled Ecosystems",
    highlights: ["Autonomous AI Agents", "Next-Gen Cloud Architecture", "Expanded International Footprint"],
  },
];

const PHASE_COUNT = JOURNEY_PHASES.length;

export function OurJourney() {
  const [activeIndex, setActiveIndex] = useState(0); // Starts from 2020
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2 });

  useEffect(() => {
    if (isPaused || !inView) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev < PHASE_COUNT - 1 ? prev + 1 : 0));
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, inView]);

  const current: JourneyPhase = JOURNEY_PHASES[activeIndex] ?? (JOURNEY_PHASES[0] as JourneyPhase);
  const Icon = current.icon;

  const nextPhase = () => {
    setIsPaused(true);
    setActiveIndex((prev) => (prev < PHASE_COUNT - 1 ? prev + 1 : 0));
  };

  const prevPhase = () => {
    setIsPaused(true);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : PHASE_COUNT - 1));
  };

  return (
    <section
      ref={sectionRef}
      id="our-journey"
      aria-labelledby="journey-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#092640_0%,#051829_50%,#03101c_100%)] py-20 text-white sm:py-24 lg:py-28"
    >
      {/* Blueprint grid, faded toward the edges */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 size-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#008cf833_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="container-x relative">
        {/* Section heading */}
        <RevealGroup kind="rise">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="size-3.5 text-[#38bdf8]" aria-hidden="true" />
              <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#7dd3fc] uppercase">
                OUR JOURNEY · 2020 — 2027
              </span>
            </div>
            <h2
              id="journey-title"
              className="mt-6 text-balance text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-[3.25rem] leading-[1.1]"
            >
              A Journey of Learning, Building and Evolving
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-[17px]">
              From our beginnings in 2020 to building for businesses worldwide, explore the milestones that shape who we are today.
            </p>
          </div>
        </RevealGroup>

        {/* Timeline. Each node sits in the centre of one of 8 equal columns, so the track and the progress fill
            run exactly from the first node's centre to the last. */}
        <div className="relative mx-auto mt-14 max-w-4xl sm:mt-16">
          <div className="relative grid grid-cols-[repeat(8,minmax(0,1fr))]">
            <div
              className="absolute top-5 left-[calc(100%/16)] right-[calc(100%/16)] h-px -translate-y-1/2 bg-white/15 sm:top-7"
              aria-hidden="true"
            />
            <div
              className="absolute top-5 left-[calc(100%/16)] h-px -translate-y-1/2 bg-linear-to-r from-accent to-[#38bdf8] shadow-[0_0_12px_#008cf8] transition-[width] duration-500 ease-out sm:top-7"
              style={{ width: `${(activeIndex / (PHASE_COUNT - 1)) * (100 - 100 / PHASE_COUNT)}%` }}
              aria-hidden="true"
            />

            {JOURNEY_PHASES.map((phase, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;

              return (
                <button
                  key={phase.year}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPaused(true);
                  }}
                  aria-label={`View milestone for year ${phase.year}`}
                  aria-pressed={isActive}
                  className="group relative z-10 flex flex-col items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#38bdf8]"
                >
                  <span
                    className={`relative flex size-10 items-center justify-center rounded-full border transition-all duration-300 sm:size-14 ${
                      isActive
                        ? phase.status === "Future Vision"
                          ? "scale-110 border-[#38bdf8] bg-linear-to-r from-accent to-[#38bdf8] text-white shadow-[0_0_28px_rgba(56,189,248,0.85)] ring-4 ring-[#38bdf8]/30"
                          : "scale-110 border-accent bg-accent text-white shadow-[0_0_28px_rgba(0,140,248,0.75)] ring-4 ring-accent/25"
                        : isPast
                          ? "border-accent/70 bg-[#0b2a45] text-[#7dd3fc]"
                          : phase.status === "Future Vision"
                            ? "border-[#38bdf8]/40 bg-[#38bdf8]/[0.08] text-[#7dd3fc] group-hover:border-[#38bdf8] group-hover:text-white"
                            : "border-white/15 bg-white/[0.04] text-white/50 group-hover:border-white/40 group-hover:text-white"
                    }`}
                  >
                    {isActive && phase.year === "2027" && (
                      <>
                        <span className="absolute -inset-2 animate-ping rounded-full bg-[#38bdf8]/60 motion-reduce:hidden" />
                        <span className="absolute -inset-4 animate-pulse rounded-full bg-linear-to-r from-amber-400/40 via-cyan-400/50 to-pink-500/40 blur-md motion-reduce:hidden" />
                      </>
                    )}
                    {isActive && phase.year !== "2027" && (
                      <span className={`absolute -inset-1 animate-ping rounded-full ${phase.status === "Future Vision" ? "bg-[#38bdf8]/40" : "bg-accent/40"} motion-reduce:hidden`} />
                    )}
                    <span className="text-[10px] font-semibold tabular-nums tracking-tight sm:text-sm">{phase.year}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spotlight card for the selected year */}
        <div className="relative mx-auto mt-10 max-w-5xl sm:mt-12">
          {/* Explosive Cracker Blast fireworks for 2027 */}
          <CrackerBlast key={`cracker-${current.year}`} active={current.year === "2027"} />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-[28px] border transition-all duration-500 p-6 backdrop-blur-2xl sm:p-10 lg:p-12 ${
                current.year === "2027"
                  ? "border-cyan-400/40 bg-[linear-gradient(145deg,rgb(0_140_248/0.22),rgb(8_36_62/0.85)_45%,rgb(3_16_28/0.95))] shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_0_90px_-20px_rgb(56_189_248/0.7)]"
                  : "border-white/12 bg-[linear-gradient(145deg,rgb(255_255_255/0.12),rgb(255_255_255/0.03)_45%,rgb(255_255_255/0.06))] shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_40px_90px_-40px_rgb(0_140_248/0.45)]"
              }`}
            >
              {/* Cracker flash blast aura when entering 2027 */}
              {current.year === "2027" && (
                <motion.div
                  initial={{ opacity: 1, scale: 0.5 }}
                  animate={{ opacity: 0, scale: 2.5 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.75)_0%,rgba(251,191,36,0.35)_40%,transparent_75%)]"
                  aria-hidden="true"
                />
              )}
              {/* Oversized watermark year */}
              <span
                className="pointer-events-none absolute -right-4 -bottom-8 font-mono text-[10rem] leading-none font-black text-white/[0.03] select-none sm:text-[14rem]"
                aria-hidden="true"
              >
                {current.year}
              </span>

              {current.year === "2027" ? (
                /* Empty / Launch Announcement Card with Countdown Timer until January 1, 2027 */
                <div className="relative z-10 flex flex-col items-center text-center py-6 sm:py-10">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-amber-500/20 px-4 py-1.5 text-xs font-bold text-cyan-200 shadow-[0_0_24px_rgba(56,189,248,0.5)]">
                    <Sparkles className="size-3.5 text-amber-300 animate-spin" aria-hidden="true" />
                    💥 2027 Horizon · Arriving January 1, 2027
                  </span>

                  <h3 className="mt-6 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Will Update You Soon.
                  </h3>
                  <p className="mt-3 max-w-xl text-base font-medium text-[#7dd3fc] sm:text-lg">
                    The Next Chapter of IKASLÉ Technologies is Under Construction.
                  </p>

                  <p className="mt-4 max-w-xl text-center text-sm leading-relaxed text-white/70 sm:text-base">
                    Our 2027 technology roadmap, autonomous AI initiatives, and upcoming milestones will be announced soon. Counting down to January 1:
                  </p>

                  {/* Live countdown timer until January 1, 2027 */}
                  <div className="w-full">
                    <CountdownTo2027 />
                  </div>

                  <div className="mt-9 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={prevPhase}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/15"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                      <span>Back to 2026</span>
                    </button>
                    <button
                      type="button"
                      onClick={nextPhase}
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-white shadow-[0_0_24px_rgba(0,140,248,0.45)] transition-colors hover:bg-accent-strong"
                    >
                      <span>Restart Timeline</span>
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Regular 2-column milestone card for 2020 - 2026 */
                <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                  {/* Left: narrative */}
                  <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-3">
                      {current.status === "Active Now" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                          Active Chapter
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/70">
                          <CheckCircle2 className="size-3.5 text-accent" aria-hidden="true" />
                          Milestone Reached
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 text-balance text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl lg:text-[2.75rem] leading-[1.1]">
                      {current.title}
                    </h3>
                    <p className="mt-3 text-base font-medium text-[#7dd3fc]">{current.subtitle}</p>

                    <p className="mt-5 max-w-xl text-justify text-base leading-relaxed text-white/75 sm:text-[17px]">{current.description}</p>

                    <div className="mt-7 border-t border-white/10 pt-6">
                      <p className="text-xs font-semibold tracking-wide text-white/50 uppercase">Key Milestones &amp; Focus</p>
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {current.highlights.map((h) => (
                          <span
                            key={h}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-white/85"
                          >
                            <Zap className="size-3 text-accent" aria-hidden="true" />
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: summary card and controls */}
                  <div className="flex h-full flex-col justify-between gap-6 lg:col-span-5">
                    <div className="rounded-2xl border border-white/12 bg-black/20 p-6 backdrop-blur-md">
                      <div className="flex items-center justify-between border-b border-white/10 pb-5">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-[linear-gradient(145deg,#1a9bff,#0070d6)] text-white shadow-[0_0_24px_rgba(0,140,248,0.55)]">
                          <Icon className="size-6" strokeWidth={2} aria-hidden="true" />
                        </div>
                        <div className="text-right">
                          <span className="block font-mono text-[11px] tracking-wider text-white/50">TIMELINE ERA</span>
                          <span className="font-mono text-lg font-bold text-white">{current.year} CE</span>
                        </div>
                      </div>

                      <div className="mt-5 space-y-5">
                        <div>
                          <span className="block text-[11px] font-semibold tracking-wide text-white/50 uppercase">Strategic Focus</span>
                          <p className="mt-1 text-sm font-semibold text-white/95">{current.focus}</p>
                        </div>

                        <div>
                          <span className="block text-[11px] font-semibold tracking-wide text-white/50 uppercase">Progress</span>
                          <div className="mt-1.5 flex items-center justify-between text-xs">
                            <span className="font-semibold text-accent">{current.phase}</span>
                            <span className="tabular-nums text-white/70">
                              {activeIndex + 1} / {PHASE_COUNT}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-linear-to-r from-accent to-[#38bdf8] transition-[width] duration-300"
                              style={{ width: `${((activeIndex + 1) / PHASE_COUNT) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={prevPhase}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 py-3 text-xs font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/15 active:scale-[0.98]"
                      >
                        <ChevronLeft className="size-4" aria-hidden="true" />
                        <span>Previous Year</span>
                      </button>

                      <button
                        type="button"
                        onClick={nextPhase}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-xs font-semibold text-white shadow-[0_0_24px_rgba(0,140,248,0.45)] transition-colors hover:bg-accent-strong active:scale-[0.98]"
                      >
                        <span>Next Year</span>
                        <ChevronRight className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
