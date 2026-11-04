import Image from "next/image";
import ourStoryOffice from "../../../public/images/about/our-story-office.png";
import { RevealGroup, RevealItem } from "./AboutReveal";

export function OurStory() {
  return (
    <section id="our-story" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,rgb(0_140_248/0.06),transparent_28%),radial-gradient(circle_at_88%_72%,rgb(77_179_255/0.07),transparent_25%)]"
        aria-hidden="true"
      />
      <RevealGroup className="container-x relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10 xl:gap-16">
        <div className="max-w-xl">
          <RevealItem>
            <p className="text-sm font-bold tracking-[0.06em] text-ink-deep uppercase sm:text-[15px]">
              Our Story
              <RevealItem as="span" kind="bar" delay={0.2} className="mt-2.5 block h-0.75 w-12 origin-left rounded-full bg-accent" aria-hidden />
            </p>
          </RevealItem>
          <RevealItem delay={0.1}>
            <h2 className="mt-5 text-[2.1rem] leading-[1.08] font-bold tracking-[-0.035em] text-balance text-ink-deep sm:text-[2.7rem] lg:text-[2.25rem] xl:text-[3rem]">
              Built on curiosity.
              <br />
              Driven by purpose.
            </h2>
          </RevealItem>
          <RevealItem delay={0.2}>
            <p className="mt-5 max-w-[34rem] text-base leading-7 text-ink sm:text-lg sm:leading-8">
              Our story began in 2020 with a simple idea: connect technology with creativity.
              Today, we build digital solutions around real business needs.
            </p>
          </RevealItem>
        </div>

        <RevealItem kind="right" delay={0.15} className="group relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent/8 blur-2xl" aria-hidden="true" />
          <div className="relative aspect-[2.25/1] overflow-hidden rounded-[1.25rem] border border-line/70 bg-bg-soft shadow-[0_28px_70px_-36px_rgb(8_40_60/0.42)] sm:rounded-[1.5rem]">
            <RevealItem kind="zoom" delay={0.15} className="absolute inset-0">
              <Image
                src={ourStoryOffice}
                alt="A bright modern IKASLE workspace with a laptop, plants, and notebook"
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
              />
            </RevealItem>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgb(6_28_48/0.07),transparent_36%,rgb(255_255_255/0.04))]" aria-hidden="true" />
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
