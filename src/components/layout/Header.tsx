"use client";

import { ScrollLink as Link } from "@/components/ui/ScrollLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { MobileServicesMenu, ServicesMegaMenu } from "./ServicesMegaMenu";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showServices = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    setServicesOpen(true);
  };

  const hideServices = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    servicesCloseTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  // Close menus whenever the route changes.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
  }, []);

  // Mobile menu: lock scroll, close on Escape, keep focus inside the panel.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const toggle = toggleRef.current;
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const focusables = [toggle, ...panelRef.current.querySelectorAll<HTMLElement>("a,button")].filter(Boolean) as HTMLElement[];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        scrolled || open || servicesOpen
          ? "border-b border-line/80 bg-white/75 shadow-[0_8px_30px_-20px_rgb(8_40_60/0.25)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {/* Tablet has no room for the logo, the full nav and the button together, and "Contact" is already in the nav,
          so the button joins from lg. Equal side columns would squeeze the logo, so they also start at lg. */}
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6 md:grid md:grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] [&>*:first-child]:justify-self-start">
        <Logo className="shrink-0" />

        <nav aria-label="Main" className="hidden justify-self-end md:block lg:justify-self-auto">
          <ul className="relative flex items-center gap-1 rounded-full border border-line/70 bg-white/60 p-1 backdrop-blur">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              const isServices = item.href === "/services";
              return (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={isServices ? showServices : undefined}
                  onMouseLeave={isServices ? hideServices : undefined}
                  onFocusCapture={isServices ? showServices : undefined}
                  onBlurCapture={isServices ? (event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hideServices();
                  } : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  <Link
                    href={item.href === "/" ? "/#top" : item.href}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup={isServices ? "true" : undefined}
                    aria-expanded={isServices ? servicesOpen : undefined}
                    aria-controls={isServices ? "services-mega-menu" : undefined}
                    className={cn(
                      "relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                      active ? "text-white" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {item.label}
                      {isServices && <ChevronDown className={cn("size-3.5 transition-transform duration-200", servicesOpen && "rotate-180")} aria-hidden="true" />}
                    </span>
                  </Link>
                  {isServices && (
                    <AnimatePresence>
                      {servicesOpen && <ServicesMegaMenu onNavigate={() => setServicesOpen(false)} />}
                    </AnimatePresence>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <ButtonLink href="/contact#contact-form" arrow className="max-lg:hidden">
            Let&apos;s Talk
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative inline-flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm md:hidden"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="inline-flex"
              >
                {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - var(--header-h))" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white md:hidden"
          >
            <nav aria-label="Mobile" className="container-x flex h-full flex-col justify-between overflow-y-auto pt-6 pb-8">
              <motion.ul
                className="flex flex-col"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
              >
                {mainNav.map((item) => {
                  const active = isActive(pathname, item.href);
                  const isServices = item.href === "/services";
                  return (
                    <motion.li
                      key={item.href}
                      variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
                      className="border-b border-line"
                    >
                      {isServices ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setMobileServicesOpen((value) => !value)}
                            aria-expanded={mobileServicesOpen}
                            aria-controls="mobile-services-menu"
                            className="flex w-full items-center justify-between py-4 text-left text-2xl font-semibold tracking-tight"
                          >
                            <span className={active ? "text-accent-strong" : "text-ink"}>{item.label}</span>
                            <ChevronDown className={cn("size-5 text-ink-soft transition-transform", mobileServicesOpen && "rotate-180")} aria-hidden="true" />
                          </button>
                          <AnimatePresence initial={false}>
                            {mobileServicesOpen && <MobileServicesMenu onNavigate={() => setOpen(false)} />}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href === "/" ? "/#top" : item.href}
                          aria-current={active ? "page" : undefined}
                          className="flex items-center justify-between py-4 text-2xl font-semibold tracking-tight"
                        >
                          <span className={active ? "text-accent-strong" : "text-ink"}>{item.label}</span>
                          <ArrowRight className="size-5 text-ink-soft" aria-hidden="true" />
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>
              <ButtonLink href="/contact#contact-form" onClick={() => setOpen(false)} size="lg" arrow className="mt-6 w-full shrink-0">
                Let&apos;s Talk
              </ButtonLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}