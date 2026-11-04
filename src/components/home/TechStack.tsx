import { TechGlobe } from "./TechGlobe";
import { TechStackShell } from "./TechStackShell";
import { Reveal } from "@/components/animations/Reveal";

export function TechStack() {
  return (
    <TechStackShell labelledBy="stack-title">
      <Reveal className="container-x mb-3 flex flex-col items-center text-center sm:mb-4">
        <h2 id="stack-title" className="text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-4xl lg:text-[2.75rem]">
          The modern stack we build with
        </h2>
      </Reveal>
      {/* Every technology is a real, labelled button on the globe, so no separate screen-reader list is needed. */}
      <div className="container-x">
        <TechGlobe />
      </div>
    </TechStackShell>
  );
}
