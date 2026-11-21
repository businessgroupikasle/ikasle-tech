import Image from "next/image";
import { Lightbulb, MessagesSquare, MonitorSmartphone, Presentation, UsersRound, type LucideIcon } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/about/AboutReveal";
import { cn } from "@/lib/cn";

/**
 * Culture & Workplace gallery. Tiles with a `photo` show it; the others are illustrated placeholders in the brand
 * style — replace them by adding real team photos (put them in public/images/careers and set `photo`).
 */
const tiles: { title: string; caption: string; icon: LucideIcon; photo?: { src: string; alt: string }; span: string; tone: string }[] = [
  {
    title: "Our Workspace",
    caption: "Where ideas turn into products",
    icon: MonitorSmartphone,
    photo: { src: "/images/about/our-story-office.png", alt: "The IKASLÉ Technologies office workspace" },
    span: "md:col-span-2 md:row-span-2",
    tone: "from-sky-500 to-blue-700",
  },
  { title: "Team Collaboration", caption: "Designers, developers and creators, side by side", icon: UsersRound, span: "", tone: "from-indigo-500 to-blue-700" },
  { title: "Brainstorming", caption: "Every project starts with a whiteboard", icon: Lightbulb, span: "", tone: "from-cyan-500 to-sky-700" },
  { title: "Team Meetings", caption: "Plans, reviews and shared wins", icon: Presentation, span: "", tone: "from-blue-500 to-indigo-600" },
  { title: "Open Conversations", caption: "Ask, share and learn from each other", icon: MessagesSquare, span: "", tone: "from-sky-400 to-cyan-600" },
];

export function CultureGallery() {
  return (
    <section aria-labelledby="culture-title" className="bg-bg-soft py-20 sm:py-24">
      <div className="container-x">
        <RevealGroup className="mx-auto max-w-2xl text-center">
          <RevealItem as="span" className="block font-mono text-[12px] tracking-wide text-accent-strong uppercase">
            Culture & workplace
          </RevealItem>
          <RevealItem delay={0.05}>
            <h2 id="culture-title" className="mt-3 text-[2rem] leading-[1.1] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-[2.6rem]">
              A Workplace Built for Ideas
            </h2>
          </RevealItem>
          <RevealItem delay={0.1} className="mt-4 text-[17px] leading-relaxed text-ink-soft">
            Collaborative spaces, honest conversations and a team that builds things together.
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="mt-12 grid auto-rows-[200px] gap-4 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[220px]" amount={0.15}>
          {tiles.map((tile, i) => (
            <RevealItem key={tile.title} delay={0.07 * i} className={cn("group relative overflow-hidden rounded-3xl", tile.span)}>
              {tile.photo ? (
                <Image
                  src={tile.photo.src}
                  alt={tile.photo.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className={cn("absolute inset-0 bg-linear-to-br", tile.tone)} aria-hidden="true">
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-size-[28px_28px]" />
                  <tile.icon
                    className="absolute -right-6 -bottom-6 size-40 text-white/15 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6"
                    strokeWidth={1.2}
                  />
                  <span className="absolute top-5 left-5 grid size-12 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur">
                    <tile.icon className="size-6" strokeWidth={1.8} />
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-deep/80 via-ink-deep/30 to-transparent p-5 pt-14">
                <h3 className="text-[17px] font-semibold text-white">{tile.title}</h3>
                <p className="mt-0.5 text-[13.5px] text-white/80">{tile.caption}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
