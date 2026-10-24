import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Mail } from "lucide-react";
import { siInstagram } from "simple-icons";
import { footerNav } from "@/data/navigation";
import { companySocials } from "@/data/socials";
import { FooterMetaBalls } from "./FooterMetaBalls";

const isUrl = (v: string) => /^https:\/\/[^\s/$.?#].[^\s]*$/i.test(v.trim());
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d={siInstagram.path} />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/**
 * One "Connect" entry. Becomes a real link only when its configured value is valid (https URL, or a real
 * email address for mailto). Until then it is a subdued, non-interactive item — no href="#", no empty
 * mailto — with an accessible "not available yet" label.
 */
function ConnectItem({ label, icon, href }: { label: string; icon: ReactNode; href: string | null }) {
  const row = "inline-flex items-center gap-2.5 text-[15px]";
  if (!href) {
    return (
      <span className={`${row} cursor-default text-ink-soft/55`}>
        <span className="inline-flex size-8 items-center justify-center rounded-full border border-line/80 bg-white/60">{icon}</span>
        {label}
        <span className="sr-only">(not available yet)</span>
        <span aria-hidden="true" className="font-mono text-[10.5px] tracking-wide text-ink-soft/60 uppercase">
          soon
        </span>
      </span>
    );
  }
  const external = href.startsWith("https://");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${row} group text-ink transition-colors hover:text-accent-strong`}
    >
      <span className="inline-flex size-8 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors group-hover:border-accent/40 group-hover:text-accent-strong">
        {icon}
      </span>
      {label}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { instagram, linkedin, email } = companySocials;

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-soft">
      <FooterMetaBalls />
      <div className="container-x relative grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 md:py-20 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex self-start rounded-lg" aria-label="IKASLE Technologies — home">
            <Image
              src="/brand/ikasle-logo-flat.webp"
              alt="IKASLE Technologies"
              width={720}
              height={238}
              sizes="160px"
              className="h-12 w-auto select-none"
              draggable={false}
            />
          </Link>
          <p className="max-w-xs text-[15px] leading-relaxed text-ink-soft">
            Engineering intelligent digital solutions through code, creativity, and technology.
          </p>
        </div>

        {/* Quick Links · Legal & Support */}
        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="font-mono text-[12px] font-medium tracking-wider text-ink uppercase">{group.title}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] text-ink-soft transition-colors hover:text-accent-strong">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Connect */}
        <div>
          <h2 className="font-mono text-[12px] font-medium tracking-wider text-ink uppercase">Connect</h2>
          <ul className="mt-5 flex flex-col gap-3">
            <li>
              <ConnectItem label="Instagram" icon={<InstagramIcon />} href={isUrl(instagram) ? instagram.trim() : null} />
            </li>
            <li>
              <ConnectItem label="LinkedIn" icon={<LinkedInIcon />} href={isUrl(linkedin) ? linkedin.trim() : null} />
            </li>
            <li>
              <ConnectItem label="Email" icon={<Mail className="size-4" aria-hidden="true" />} href={isEmail(email) ? `mailto:${email.trim()}` : null} />
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-[13px] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} IKASLE Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
