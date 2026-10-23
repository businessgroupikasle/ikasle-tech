import { Mail, MapPin, Phone } from "lucide-react";
import { companyContact } from "@/data/company-contact";

/** "Get in Touch": the company's address, phone and email as real text and links (no image), in IKASLE blue. */
export function ContactInfoCard() {
  return (
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
  );
}
