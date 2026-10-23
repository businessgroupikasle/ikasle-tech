import { Clock3, FileText, Mail, MapPin, MessagesSquare, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactExperience } from "@/components/contact/ContactExperience";
import { ContactHeadline } from "@/components/contact/ContactHeadline";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { companyContact } from "@/data/company-contact";

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
  const { email } = siteConfig.contact;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        path="/contact"
        title="Let's Turn Your Vision Into Software."
        heading={<ContactHeadline id="contact-title" />}
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
          {/* Contact details: real text and links (no image), in IKASLE blue. */}
          <div className="rounded-3xl border border-line bg-bg-soft p-6 shadow-[0_18px_40px_-30px_rgb(8_43_69/0.35)] sm:p-7">
            <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">Get in Touch</h2>
            <dl className="mt-5 divide-y divide-line">
              <div className="flex gap-4 pb-5">
                <dt className="contents">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#009CFF] shadow-sm ring-1 ring-line">
                    <MapPin className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className="sr-only">Address</span>
                </dt>
                <dd className="min-w-0">
                  <p className="font-mono text-[11.5px] tracking-wide text-ink-soft uppercase" aria-hidden="true">
                    Address
                  </p>
                  <address className="mt-1 text-[15px] leading-relaxed text-ink not-italic">
                    {companyContact.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
              <div className="flex gap-4 py-5">
                <dt className="contents">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#009CFF] shadow-sm ring-1 ring-line">
                    <Phone className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className="sr-only">Phone</span>
                </dt>
                <dd className="min-w-0">
                  <p className="font-mono text-[11.5px] tracking-wide text-ink-soft uppercase" aria-hidden="true">
                    Phone
                  </p>
                  <ul className="mt-1 flex flex-col gap-0.5">
                    {companyContact.phones.map((p) => (
                      <li key={p.tel}>
                        <a href={`tel:${p.tel}`} className="text-[15px] font-medium text-ink transition-colors hover:text-accent-strong">
                          {p.display}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="flex gap-4 pt-5">
                <dt className="contents">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#009CFF] shadow-sm ring-1 ring-line">
                    <Mail className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className="sr-only">Email</span>
                </dt>
                <dd className="min-w-0">
                  <p className="font-mono text-[11.5px] tracking-wide text-ink-soft uppercase" aria-hidden="true">
                    Email
                  </p>
                  <a href={`mailto:${companyContact.email}`} className="mt-1 inline-block text-[15px] font-medium break-all text-ink transition-colors hover:text-accent-strong">
                    {companyContact.email}
                  </a>
                </dd>
              </div>
            </dl>
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
