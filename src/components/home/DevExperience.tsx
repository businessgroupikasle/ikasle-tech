"use client";

import { useState } from "react";
import { TerminalAnimation, type TerminalLine } from "@/components/animations/TerminalAnimation";
import { DeployPipeline } from "./DeployPipeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { MagneticButton } from "@/components/animations/MagneticButton";

const SCRIPT: TerminalLine[] = [
  { kind: "cmd", text: "npx create-next-app ikasle-project" },
  { kind: "out", text: "✓ Created ikasle-project with TypeScript, Tailwind CSS and App Router", tone: "success" },
  { kind: "cmd", text: "npm run build" },
  { kind: "out", text: "▲ Next.js — creating an optimized production build…", tone: "muted" },
  { kind: "out", text: "✓ Compiled successfully", tone: "success" },
  { kind: "out", text: "✓ Type checking completed", tone: "success" },
  { kind: "out", text: "✓ Build ready", tone: "success" },
  { kind: "cmd", text: "git push origin main" },
  { kind: "out", text: "→ Pipeline started · deploying to production", tone: "accent" },
];

/** Which pipeline stage each finished terminal line unlocks (index → stages complete). */
const PROGRESS_AT: Record<number, number> = { 1: 1, 4: 2, 5: 3, 8: 4 };

export function DevExperience() {
  const [stages, setStages] = useState(0);

  const onProgress = (line: number) => {
    if (line < 0) return setStages(0);
    const reached = Object.entries(PROGRESS_AT).filter(([l]) => Number(l) <= line).map(([, s]) => s);
    setStages(reached.length ? Math.max(...reached) : 0);
  };

  return (
    <section aria-labelledby="dev-title" className="relative overflow-hidden bg-bg-soft py-24 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-8">
          <SectionHeading
            id="dev-title"
            eyebrow="Developer experience"
            path="terminal"
            title="Every Great Product Starts With an Idea."
            description="And then a first commit. We set up clean foundations — typed code, automated checks and one-command deploys — so your product can move fast without breaking."
          />
          <MagneticButton>
            <ButtonLink href="/contact" size="lg" arrow>
              Build Your Product With Us
            </ButtonLink>
          </MagneticButton>
        </div>

        <div className="flex flex-col gap-4">
          <TerminalAnimation lines={SCRIPT} onProgress={onProgress} />
          <DeployPipeline progress={stages} />
          <p className="font-mono text-[11px] text-ink-soft">{"// visual demo — no commands are executed"}</p>
        </div>
      </div>
    </section>
  );
}
