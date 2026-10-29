export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
export const analyticsEnabled = /^G-[A-Z0-9]+$/.test(gaMeasurementId);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  name: "generate_lead" | "contact_click" | "contact_cta_click" | "view_project",
  parameters: Record<string, string> = {},
) {
  if (!analyticsEnabled || typeof window === "undefined") return;
  window.dataLayer ??= [];
  window.gtag ??= function () {
    // The Google tag queue requires an Arguments object for each command.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("event", name, { ...parameters, send_to: gaMeasurementId });
}
