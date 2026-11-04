"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { companyContact } from "@/data/company-contact";

const whatsappNumber = companyContact.phones[0].tel.replace(/\D/g, "");
const whatsappMessage = encodeURIComponent("Hi IKASLE Technologies, I'd like to discuss a project.");

export function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 320);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <>
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with IKASLE Technologies on WhatsApp"
        title="Chat on WhatsApp"
        className="group fixed right-[max(16px,env(safe-area-inset-right))] bottom-[calc(max(16px,env(safe-area-inset-bottom))+76px)] z-[79] flex size-[54px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_32px_-10px_rgb(18_140_73/0.7)] transition duration-200 hover:-translate-y-1 hover:bg-[#1fbd5a] hover:shadow-[0_18px_38px_-10px_rgb(18_140_73/0.8)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] sm:right-6 sm:bottom-25 sm:size-14"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7 fill-current transition-transform duration-200 group-hover:scale-105">
          <path d="M16.04 3A12.8 12.8 0 0 0 5.01 22.3L3.2 28.9l6.75-1.77A12.8 12.8 0 1 0 16.04 3Zm0 23.43c-1.89 0-3.73-.5-5.34-1.46l-.38-.22-4 .98 1.07-3.9-.25-.4A10.63 10.63 0 1 1 16.04 26.43Zm5.83-7.96c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.5-.16-.72.16-.21.32-.83 1.05-1.02 1.26-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.59a9.6 9.6 0 0 1-1.78-2.21c-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.63-.53-.55-.72-.56h-.62c-.22 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.69s1.16 3.12 1.32 3.34c.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.25 1.48.21 2.03.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.3-.21-.62-.37Z" />
        </svg>
      </a>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className={`fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-[max(16px,env(safe-area-inset-left))] z-[79] flex size-12 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-soft backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-accent hover:bg-bg-blue hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:bottom-6 sm:left-6 ${showBackToTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        <ArrowUp className="size-5" strokeWidth={2.25} aria-hidden="true" />
      </button>
    </>
  );
}

