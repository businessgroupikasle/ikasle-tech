import Link from "next/link";
import { siGithub } from "simple-icons";
import { footerNav } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { LogoMark } from "./Logo";

export function Footer() {
  const { contact, social } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-soft">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-20">
        <div className="flex flex-col gap-5">
          <Link href="/" className="inline-flex items-center gap-2.5 self-start rounded-lg">
            <LogoMark className="size-9" />
            <span className="text-lg font-bold tracking-tight text-ink">IKASLE Technologies</span>
          </Link>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Software engineering, intelligent automation and scalable digital products — designed, coded and shipped by one team.
          </p>
          <pre aria-hidden="true" className="w-fit rounded-xl border border-line bg-white px-4 py-3 font-mono text-[12px] leading-relaxed text-ink-soft shadow-sm">
            <span className="tok-keyword">const</span> <span className="text-ink">mission</span> = <span className="text-[#2c8a3e]">&quot;build what matters&quot;</span>;
          </pre>
        </div>

        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="font-mono text-[12px] font-medium tracking-wider text-ink-soft uppercase">{group.title}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] text-ink transition-colors hover:text-accent-strong">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="font-mono text-[12px] font-medium tracking-wider text-ink-soft uppercase">Get in touch</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="text-ink hover:text-accent-strong">
                  {contact.email}
                </a>
              </li>
            )}
            {contact.phone && (
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-ink hover:text-accent-strong">
                  {contact.phone}
                </a>
              </li>
            )}
            {contact.address && <li className="text-ink-soft">{contact.address}</li>}
            <li>
              <Link href="/contact" className="text-ink hover:text-accent-strong">
                Send us a project brief →
              </Link>
            </li>
            {social.github && (
              <li>
                <a href={social.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ink hover:text-accent-strong">
                  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                    <path d={siGithub.path} />
                  </svg>
                  GitHub
                </a>
              </li>
            )}
            {social.linkedin && (
              <li>
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent-strong">
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-[13px] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} IKASLE Technologies. All rights reserved.</p>
          <p className="font-mono text-[12px]">
            <span className="tok-keyword">{"</>"}</span> engineered with Next.js &amp; TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
