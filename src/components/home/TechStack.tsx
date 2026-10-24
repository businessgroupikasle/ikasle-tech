import { orbitTechnologies } from "@/data/technologies";
import { TechOrbitWithTooltips } from "./TechOrbitWithTooltips";
import { TechStackShell } from "./TechStackShell";
import { Reveal } from "@/components/animations/Reveal";

export function TechStack() {
  return (
    <TechStackShell labelledBy="stack-title">
      <Reveal className="container-x mb-4 flex flex-col items-center text-center sm:mb-6">
        <h2 id="stack-title" className="text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-4xl lg:text-[2.75rem]">
          The modern stack we build with
        </h2>
      </Reveal>
      {/* The orbit is decorative (aria-hidden); screen readers get the same stack as a plain list. */}
      <ul className="sr-only">
        {orbitTechnologies.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <div className="container-x">
        <TechOrbitWithTooltips />
      </div>
    </TechStackShell>
  );
}
