/**
 * The single source of truth for service identifiers. Each slug is also the service's detail-page route,
 * /services/[slug], and keys both src/data/services.ts (catalogue: photo, problems, technologies) and
 * src/data/service-pages.ts (page copy). Never write a service slug as a string literal anywhere else.
 */
export const SERVICE_SLUGS = {
  customSoftware: "custom-software-development",
  webApplications: "web-application-development",
  mobileApps: "mobile-app-development",
  erp: "erp-business-automation",
  ai: "ai-intelligent-solutions",
  productDesign: "ui-ux-product-design",
} as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[keyof typeof SERVICE_SLUGS];
