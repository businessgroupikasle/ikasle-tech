import { Clock3, FileText, Mail, MapPin, MessagesSquare, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactExperience } from "@/components/contact/ContactExperience";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Tell IKASLE Technologies about your software, web, mobile, ERP or AI project. We'll respond with next steps.",
  path: "/contact",
});

const NEXT_STEPS = [
  { icon: MessagesSquare, title: "We review your brief", text: "An engineer reads every enquiry — not a sales bot." },
  { icon: FileText, title: "Discovery call", text: "We clarify goals, constraints and the shape of a first release." },
  { icon: Clock3, title: "Proposal & plan", text: "A scoped plan with phases, deliverables and a timeline." },
];

export default function ContactPage() {
  const { email, phone, address } = siteConfig.contact;
  const hasDetails = Boolean(email || phone || address);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        path="/contact"
        title="Let's Turn Your Vision Into Software."
        description="Share a few details about what you want to build. The more context you give, the more useful our first reply will be."
      >
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <ul className="grid gap-3">
            {NEXT_STEPS.map(({ icon: I, title, text }, i) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-line bg-white/80 p-4 backdrop-blur">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <I className="size-4.5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-mono text-[11px] text-ink-soft">step {i + 1}</span>
                  <span className="block font-semibold text-ink">{title}</span>
                  <span className="block text-[14px] text-ink-soft">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col justify-center gap-4 rounded-3xl border border-line bg-bg-soft p-6">
            <p className="font-mono text-[12px] text-accent-strong">contact.config</p>
            {hasDetails ? (
              <ul className="space-y-3 text-[15px]">
                {email && (
                  <li className="flex items-center gap-3">
                    <Mail className="size-4 text-ink-soft" aria-hidden="true" />
                    <a href={`mailto:${email}`} className="font-medium text-ink hover:text-accent-strong">
                      {email}
                    </a>
                  </li>
                )}
                {phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="size-4 text-ink-soft" aria-hidden="true" />
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-medium text-ink hover:text-accent-strong">
                      {phone}
                    </a>
                  </li>
                )}
                {address && (
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 text-ink-soft" aria-hidden="true" />
                    <span className="text-ink">{address}</span>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-[15px] leading-relaxed text-ink-soft">
                The quickest way to reach our team is the project form below — it goes straight to the engineers who will scope your project.
              </p>
            )}
          </div>
        </div>
      </PageHero>

      <section aria-label="Contact form" className="pb-24 sm:pb-32">
        <div className="container-x">
          <ContactExperience fallbackEmail={email} />
        </div>
      </section>
    </>
  );
}
