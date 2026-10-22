"use client";

import { motion } from "motion/react";
import { Check, GitBranch, Hammer, FlaskConical, Rocket } from "lucide-react";
import { cn } from "@/lib/cn";

const STAGES = [
  { label: "Commit", icon: GitBranch },
  { label: "Build", icon: Hammer },
  { label: "Test", icon: FlaskConical },
  { label: "Deploy", icon: Rocket },
];

/**
 * Commit → Build → Test → Deploy progress illustration (SVG/CSS + Motion).
 * `progress` (0..STAGES.length) is driven by the terminal demo next to it.
 */
export function DeployPipeline({ progress, className }: { progress: number; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-line bg-white p-5 shadow-soft", className)} role="img" aria-label={`Deployment pipeline: ${Math.min(progress, STAGES.length)} of ${STAGES.length} stages complete`}>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[12px] text-ink-soft">pipeline · main</p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-mono text-[11px] transition-colors",
            progress >= STAGES.length ? "bg-success/10 text-[#067647]" : "bg-accent/10 text-accent-strong",
          )}
        >
          {progress >= STAGES.length ? "deployed" : progress > 0 ? "running" : "queued"}
        </span>
      </div>
      <ol className="relative grid grid-cols-4 gap-2">
        <div className="absolute top-5 right-[12.5%] left-[12.5%] h-0.5 rounded-full bg-line" aria-hidden="true" />
        <motion.div
          className="absolute top-5 left-[12.5%] h-0.5 origin-left rounded-full bg-gradient-to-r from-accent to-accent-2"
          style={{ width: "75%" }}
          initial={false}
          animate={{ scaleX: Math.min(1, Math.max(0, (progress - 1) / (STAGES.length - 1))) }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          aria-hidden="true"
        />
        {STAGES.map((s, i) => {
          const done = progress > i;
          const Icon = done ? Check : s.icon;
          return (
            <li key={s.label} className="relative flex flex-col items-center gap-2">
              <motion.span
                initial={false}
                animate={{ scale: done ? 1 : 0.92 }}
                className={cn(
                  "relative z-10 inline-flex size-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  done ? "border-accent bg-accent text-white" : "border-line bg-white text-ink-soft",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </motion.span>
              <span className={cn("text-[12px] font-medium", done ? "text-ink" : "text-ink-soft")}>{s.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
