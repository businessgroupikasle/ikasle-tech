import { BookOpenCheck, Lightbulb, Rocket, UsersRound, type LucideIcon } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/about/AboutReveal";

const reasons: { title: string; text: string; icon: LucideIcon; tone: string }[] = [
  { title: "Career Growth", text: "Learn, develop and advance your professional skills.", icon: Rocket, tone: "from-sky-500 to-blue-700" },
  { title: "Creative Environment", text: "Work with passionate and innovative professionals.", icon: Lightbulb, tone: "from-indigo-500 to-blue-600" },
  { title: "Team Collaboration", text: "Collaborate with talented people across departments.", icon: UsersRound, tone: "from-cyan-500 to-sky-700" },
  { title: "Learning Opportunities", text: "Work on real-world projects and gain practical experience.", icon: BookOpenCheck, tone: "from-accent to-accent-strong" },
];

/** "Why Join Our Team?" — four feature cards that rise in on scroll and lift on hover. */
export function WhyJoin() {
  return (
    <section aria-labelledby="why-join" className="bg-bg-soft py-20 sm:py-24">
      <div className="container-x">
        <RevealGroup className="mx-auto max-w-2xl text-center">
          <RevealItem as="span" className="block font-mono text-[12px] tracking-wide text-accent-strong uppercase">
            Life at IKASLÉ
          </RevealItem>
          <RevealItem delay={0.05}>
            <h2 id="why-join" className="mt-3 text-[2rem] leading-[1.1] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-[2.6rem]">
              Why Join Our Team?
            </h2>
          </RevealItem>
          <RevealItem delay={0.1} className="mt-4 text-[17px] leading-relaxed text-ink-soft">
            A place to do meaningful work, keep learning and grow alongside people who care about their craft.
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" amount={0.2}>
          {reasons.map((reason, i) => (
            <RevealItem key={reason.title} delay={0.08 * i} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-white p-7 shadow-[0_8px_24px_-20px_rgb(8_40_60/0.35)] transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-accent/35 hover:shadow-[0_28px_48px_-30px_rgb(0_110_200/0.5)] motion-reduce:hover:translate-y-0">
                <span className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                <span
                  className={`relative grid size-14 place-items-center rounded-2xl bg-linear-to-br ${reason.tone} text-white shadow-[0_14px_28px_-14px_rgb(0_110_200/0.8)] transition-[rotate,scale] duration-500 group-hover:scale-110 group-hover:-rotate-6`}
                  aria-hidden="true"
                >
                  <reason.icon className="size-6.5" strokeWidth={1.8} />
                </span>
                <h3 className="relative mt-6 text-[19px] font-semibold tracking-[-0.01em] text-ink">{reason.title}</h3>
                <p className="relative mt-2 text-[15px] leading-relaxed text-ink-soft">{reason.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
