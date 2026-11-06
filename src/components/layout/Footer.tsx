import Image from "next/image";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { siFacebook, siInstagram, siX } from "simple-icons";
import { ScrollLink as Link } from "@/components/ui/ScrollLink";
import { companyContact } from "@/data/company-contact";
import { footerNav } from "@/data/navigation";
import { services } from "@/data/services";
import { companySocials } from "@/data/socials";
import { FooterMetaBalls } from "./FooterMetaBalls";

const isUrl = (value: string) => /^https:\/\/[^\s/$.?#].[^\s]*$/i.test(value.trim());

// simple-icons no longer ships a LinkedIn glyph, so its path is kept here.
const linkedInPath = "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z";

const socialLinks = [
  { label: "Instagram", href: companySocials.instagram, path: siInstagram.path },
  { label: "LinkedIn", href: companySocials.linkedin, path: linkedInPath },
  { label: "Facebook", href: companySocials.facebook, path: siFacebook.path },
  { label: "X", href: companySocials.x, path: siX.path },
];

function SocialIcon({ path }: { path: string }) {
  return <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true"><path d={path} /></svg>;
}

function Heading({ children }: { children: ReactNode }) {
  return <h2 className="text-sm font-bold tracking-[0.04em] text-ink-deep uppercase">{children}<span className="mt-2 block h-0.5 w-10 rounded-full bg-accent" aria-hidden="true" /></h2>;
}

const linkClass = "text-sm leading-6 text-ink transition-colors hover:text-accent-strong focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  if (!isUrl(href)) return <span className="grid size-9 cursor-not-allowed place-items-center rounded-full border border-line text-ink-soft/45" title={`${label} profile is not configured`}>{children}<span className="sr-only">{label} profile is not available yet</span></span>;
  return <a href={href.trim()} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} className="grid size-9 place-items-center rounded-full border border-accent/45 text-ink transition-colors hover:border-accent hover:bg-white hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{children}</a>;
}

export function Footer() {
  const year = new Date().getFullYear();
  const quickLinks = footerNav.find((group) => group.title === "Quick Links")?.links ?? [];
  const legalLinks = footerNav.find((group) => group.title === "Legal & Support")?.links ?? [];

  return (
    <footer className="site-footer relative overflow-hidden border-t border-line bg-bg-soft">
      <FooterMetaBalls />
      {/* Fixed buttons sit over the bottom corners (chat and WhatsApp right, back to top left). The bottom row keeps out of the right-hand ones
          with its own padding, and out of back to top by sitting above it when stacked and beside it when side by side. Past 1360px the page margin is wide enough. */}
      <div className="container-x relative pt-8 pb-18 sm:pt-10 sm:pb-20 lg:pb-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-[1.15fr_0.7fr_1.25fr_1.35fr] lg:gap-8 xl:gap-12">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/#top" aria-label="IKASLE Technologies — home" className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
              <Image src="/brand/ikasle-logo-flat.webp" alt="IKASLE Technologies" width={720} height={238} sizes="150px" className="h-auto w-37.5 select-none" draggable={false} />
            </Link>
            <p className="mt-4 max-w-67.5 text-sm leading-6 text-ink-soft">Engineering intelligent digital solutions through code, creativity, and technology.</p>
          </div>

          <nav aria-label="Quick links">
            <Heading>Quick Links</Heading>
            <ul className="mt-3 space-y-0.5">{quickLinks.map((item) => <li key={item.href}><Link href={item.href} className={linkClass}>{item.label}</Link></li>)}</ul>
          </nav>

          <nav aria-label="Our services">
            <Heading>Our Services</Heading>
            <ul className="mt-3 space-y-0.5">{services.map((service) => <li key={service.slug}><Link href={`/services/${service.slug}`} className={linkClass}>{service.title}</Link></li>)}</ul>
          </nav>

          <div className="col-span-2 sm:col-span-1">
            <Heading>Contact &amp; Connect</Heading>
            <address className="mt-3 space-y-2 text-sm leading-6 text-ink not-italic">
              {companyContact.phones.map((phone) => <a key={phone.tel} href={`tel:${phone.tel}`} className="flex items-center gap-2.5 transition-colors hover:text-accent-strong"><Phone className="size-4 shrink-0" aria-hidden="true" /><span>{phone.display}</span></a>)}
              <a href={`mailto:${companyContact.email}`} className="flex min-w-0 items-center gap-2.5 transition-colors hover:text-accent-strong"><Mail className="size-4 shrink-0" aria-hidden="true" /><span className="break-all">{companyContact.email}</span></a>
              <div className="flex items-start gap-2.5"><MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" /><span>{companyContact.address.join(", ")}</span></div>
            </address>
            <div className="mt-3 flex flex-wrap gap-2.5">{socialLinks.map(({ label, href, path }) => <SocialLink key={label} href={href} label={label}><SocialIcon path={path} /></SocialLink>)}</div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-accent/30 pt-3 pr-16 sm:mt-6 sm:pt-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:pl-14 min-[1360px]:px-0">
          <p className="text-[13px] text-ink-soft sm:text-sm">© {year} IKASLE Technologies. All rights reserved.</p>
          <nav aria-label="Legal and support">
            <ul className="flex flex-wrap gap-y-1">{legalLinks.map((item, index) => <li key={item.href} className="flex items-center">{index > 0 && <span className="mx-2 h-4 w-px bg-accent/60 sm:mx-3" aria-hidden="true" />}<Link href={item.href} className={linkClass}>{item.label}</Link></li>)}</ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
