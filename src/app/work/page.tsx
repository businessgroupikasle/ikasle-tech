import { PageHero } from "@/components/ui/PageHero";
import { WorkGrid, type WorkEntry } from "@/components/work/WorkGrid";
import { ContactCta } from "@/components/home/ContactCta";
import { DemoDataNote } from "@/components/ui/Badge";
import { projectCategories, projects } from "@/data/projects";
import { works } from "@/data/works";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Work",
  description: "Work by IKASLE Technologies: Kiddos Foods, Uzhavar Connect, the Kiddos Foods ERP, the Wahid mobile app and an ERP case study.",
  path: "/work",
});

export default function WorkPage() {
  // Live products first, then written case studies. Filters (and their counts) come from this list.
  const entries: WorkEntry[] = [...works.map((work) => ({ kind: "live" as const, work })), ...projects.map((project) => ({ kind: "case" as const, project }))];
  // Only offer categories that actually have published projects.
  const categories = projectCategories.filter((c) => entries.some((e) => (e.kind === "case" ? e.project.categories : e.work.categories).includes(c)));

  return (
    <>
      <PageHero
        eyebrow="Case studies"
        path="/work"
        title="Ideas Engineered Into Reality."
        description="Selected software we have designed and built — business systems, web platforms and mobile apps solving real operational problems."
      />
      <section aria-label="Projects" className="pb-12">
        <div className="container-x">
          <WorkGrid entries={entries} categories={categories} />
          <DemoDataNote className="mt-10">Live projects show real screenshots; case-study and app previews are illustrative recreations with sample data</DemoDataNote>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
