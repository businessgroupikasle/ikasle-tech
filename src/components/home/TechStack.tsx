import { orbitTechnologies } from "@/data/technologies";
import { TechOrbit } from "./TechOrbit";
import { TechStackShell } from "./TechStackShell";

export function TechStack() {
  return (
    <TechStackShell labelledBy="stack-title">
      <div className="container-x mb-2 flex flex-col items-center gap-2 text-center sm:mb-4">
        <p className="font-mono text-[12px] tracking-wider text-accent-strong uppercase">package.json</p>
        <h2 id="stack-title" className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          The modern stack we build with
        </h2>
      </div>
      {/* The orbit is decorative (aria-hidden); screen readers get the same stack as a plain list. */}
      <ul className="sr-only">
        {orbitTechnologies.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <div className="container-x">
        <TechOrbit />
      </div>
    </TechStackShell>
  );
}
