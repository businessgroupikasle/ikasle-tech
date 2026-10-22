import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge, DemoDataNote } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { ProjectReveal } from "@/components/animations/ProjectReveal";
import { RevealGroup, RevealItem } from "@/components/animations/ScrollReveal";
import { ProjectVisual } from "@/components/work/ProjectVisual";
import { CaseStory } from "@/components/work/CaseStory";
import { ScreenGallery } from "@/components/work/ScreenGallery";
import { ContactCta } from "@/components/home/ContactCta";
import { ButtonLink } from "@/components/ui/Button";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({ title: `${project.title} — Case Study`, description: project.summary, path: `/work/${project.slug}` });
}

function Pending({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 rounded-2xl border border-dashed border-warning/40 bg-warning/[0.06] px-4 py-3 text-[14.5px] text-[#7a4b00]">
      <Clock3 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length]!;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Work", item: absoluteUrl("/work") },
      { "@type": "ListItem", position: 2, name: project.title, item: absoluteUrl(`/work/${project.slug}`) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />

      <section className="relative overflow-hidden pt-[calc(var(--header-h)+40px)] pb-16">
        <div className="ambient" aria-hidden="true" />
        <div className="container-x relative">
          <Link href="/work" className="inline-flex items-center gap-2 font-mono text-[13px] text-ink-soft transition-colors hover:text-accent-strong">
            <ArrowLeft className="size-4" aria-hidden="true" /> cd ../work
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <SectionHeading as="h1" eyebrow={project.kicker} path={`/work/${project.slug}`} title={project.title} description={project.summary} />
            <dl className="grid grid-cols-2 gap-4 rounded-3xl border border-line bg-white/80 p-6 text-[14px] shadow-sm backdrop-blur">
              <div>
                <dt className="font-mono text-[11.5px] text-ink-soft">Client</dt>
                <dd className="mt-1 font-medium text-ink">{project.client.pending ? "To be confirmed" : project.client.name}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11.5px] text-ink-soft">Year</dt>
                <dd className="mt-1 font-medium text-ink">{project.year ?? "To be confirmed"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-[11.5px] text-ink-soft">Categories</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {project.categories.map((c) => (
                    <Badge key={c}>{c}</Badge>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <ProjectReveal className="mt-14 rounded-[28px] bg-gradient-to-br from-bg-soft to-[#EAF6FF] p-4 sm:p-10">
            <ProjectVisual kind={project.mockup} />
          </ProjectReveal>
          <DemoDataNote className="mt-3" />
        </div>
      </section>

      <section aria-label="Case study" className="py-16 sm:py-24">
        <div className="container-x">
          <CaseStory
            chapters={[
              { id: "overview", label: "Overview", title: "What we built", body: project.overview },
              { id: "challenge", label: "Challenge", title: "The problem to solve", body: project.challenge },
              { id: "solution", label: "Solution", title: "How the platform solves it", body: project.solution },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="features-title" className="bg-bg-soft py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading id="features-title" eyebrow="Features" path="modules/" title="Key capabilities" />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.features.map((f) => (
              <RevealItem key={f.title} className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon name={f.icon} className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{f.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="stack-title" className="py-20 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[220px_1fr]">
          <h2 id="stack-title" className="font-mono text-[12px] text-accent-strong">Technology Stack</h2>
          <div>
            {project.stack.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <li key={t}>
                    <Badge tone="accent">{t}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <Pending>The confirmed technology stack for this project will be listed here once approved for publication.</Pending>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="screens-title" className="pb-20 sm:pb-28">
        <div className="container-x">
          <SectionHeading id="screens-title" eyebrow="Application screens" path="screens/" title="Inside the product" description="Interface recreations of the key screens, populated with sample data." />
          <div className="mt-12">
            <ScreenGallery screens={project.screens} />
          </div>
        </div>
      </section>

      <section aria-labelledby="outcome-title" className="bg-bg-soft py-20 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[220px_1fr]">
          <h2 id="outcome-title" className="font-mono text-[12px] text-accent-strong">Project Outcome</h2>
          <div className="max-w-2xl">
            {project.outcome.pending ? <Pending>{project.outcome.note}</Pending> : <p className="text-[17px] leading-relaxed text-ink-soft">{project.outcome.text}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/contact?type=${encodeURIComponent("ERP Solution")}`} arrow>
                Discuss a similar project
              </ButtonLink>
              <ButtonLink href="/work" variant="secondary">
                View all work
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {next.slug !== project.slug && (
        <nav aria-label="Next project" className="border-t border-line">
          <Link href={`/work/${next.slug}`} className="group container-x flex items-center justify-between gap-6 py-12">
            <span>
              <span className="font-mono text-[12px] text-ink-soft">Next case study</span>
              <span className="mt-1 block text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent-strong sm:text-4xl">{next.title}</span>
            </span>
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white">
              <ArrowRight className="size-5" aria-hidden="true" />
            </span>
          </Link>
        </nav>
      )}

      <ContactCta />
    </>
  );
}
