import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { companyContact } from "@/data/company-contact";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Careers", description: "Explore jobs and internships at IKASLE Technologies.", path: "/careers" });

export default function CareersPage() {
  return <>
    <PageHero eyebrow="Careers" path="/careers" title="Build your future with us." description="Explore career and internship opportunities at IKASLE Technologies." />
    <section className="container-x pb-20 sm:pb-24">
      <div className="rounded-3xl border border-line bg-bg-soft p-6 sm:p-10">
        <h2 className="text-2xl font-semibold text-ink">No Current Openings</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">There are currently no listed job or internship opportunities. You can still send your resume for future consideration.</p>
        <p className="mt-3 mb-6 text-ink-soft">Include your preferred role or internship, a short introduction, and your resume as an attachment in your email.</p>
        <ButtonLink href={`mailto:${companyContact.email}?subject=Career%20or%20Internship%20Application`} arrow>Submit your resume</ButtonLink>
      </div>
    </section>
  </>;
}
