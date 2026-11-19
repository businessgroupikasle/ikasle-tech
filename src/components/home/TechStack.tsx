import { TechGlobe } from "./TechGlobe";
import { TechStackShell } from "./TechStackShell";
import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";

export function TechStack() {
  return (
    <TechStackShell labelledBy="stack-title">
      <Reveal className="container-x mb-6 flex flex-col items-center text-center sm:mb-8">
        <Eyebrow>THE TECHNOLOGY BEHIND WHAT WE BUILD</Eyebrow>

        <h2
          id="stack-title"
          className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl lg:text-[2.75rem] leading-[1.15]"
        >
          59 Technologies. One Engineering Vision.
        </h2>

        <div className="mt-4 flex max-w-3xl flex-col gap-3 text-center text-base leading-relaxed text-pretty text-ink-soft sm:text-lg">
          <p className="font-medium text-ink-soft">
            Great software starts with the right technology and engineering decisions.
          </p>
          <p>
            IKASLÉ Technologies brings together 59 technologies across frontend development, backend engineering, databases, cloud infrastructure, AI, automation and product design.
          </p>
          <p className="text-sm sm:text-base text-ink-soft">
            Modern web frameworks, scalable infrastructure and intelligent integrations, chosen for each project&apos;s performance goals.
          </p>
        </div>
      </Reveal>

      {/* Every technology is a real, labelled button on the globe, so no separate screen-reader list is needed. */}
      <div className="container-x">
        <TechGlobe />
      </div>

      <Reveal className="container-x mt-8 flex flex-col items-center text-center sm:mt-10">
        <p className="max-w-5xl text-base font-medium leading-relaxed text-ink-soft sm:text-lg md:whitespace-nowrap">
          We don&apos;t follow trends blindly. We choose and engineer technologies that solve real problems.
        </p>
        <p className="mt-3 font-mono text-xs tracking-wide text-ink-soft sm:text-[13px]">
          <span className="font-semibold text-accent" aria-hidden="true">{"// "}</span>
          The right technology. Thoughtful engineering. Products built to scale.
        </p>
      </Reveal>
    </TechStackShell>
  );
}
