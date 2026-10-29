"use client";

import { useEffect } from "react";
import Script from "next/script";
import { analyticsEnabled, gaMeasurementId, trackEvent } from "@/lib/analytics";

export function GoogleAnalytics() {
  useEffect(() => {
    if (!analyticsEnabled) return;
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, window.location.href);
      if (url.protocol === "tel:" || url.protocol === "mailto:") {
        trackEvent("contact_click", { contact_method: url.protocol === "tel:" ? "phone" : "email" });
      } else if (url.origin === window.location.origin && url.pathname === "/contact") {
        trackEvent("contact_cta_click", { page_path: window.location.pathname });
      } else if (url.origin === window.location.origin && url.pathname.startsWith("/work/")) {
        trackEvent("view_project", { project_path: url.pathname });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!analyticsEnabled) return null;

  // GA4 owns initial and History API page views. Do not add a route-change page_view effect.
  return (
    <>
      <Script id="ga4-config" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
gtag('js', new Date());
gtag('config', '${gaMeasurementId}', {allow_google_signals: false, allow_ad_personalization_signals: false});`}
      </Script>
      <Script id="ga4-loader" src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
    </>
  );
}
