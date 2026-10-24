import type { IconName } from "@/types";
import { SERVICE_SLUGS } from "./service-slugs";
import { getService } from "./services";

/** A real project to point to from a service: a live product (external) or a case study (internal). */
export type RelatedWork = { label: string; href: string; external?: boolean };

/** Small decorative technical detail drawn over a service photo (never the main content). */
export type ServiceAccent = "workflow" | "server-render" | "platforms" | "erp-sync" | "ai-extract" | "tokens";

/**
 * Services page content, written for business readers first: value, then capabilities, then technology.
 * Keyed by the same slugs as src/data/services.ts, which are also the /services/[slug] detail-page routes.
 * Photos, problems and technologies come from services.ts; this file only adds the page's own copy.
 */
export type ServicePage = {
  slug: string;
  name: string;
  icon: IconName;
  /** One-line, business-focused card description. */
  card: string;
  heading: string;
  intro: string;
  capabilities: string[];
  benefits: string[];
  related: RelatedWork[];
  accent: ServiceAccent;
  cta?: { label: string; href: string };
};

const KIDDOS = { label: "Kiddos Foods", href: "https://kiddosfoods.com", external: true };
const UZHAVAR = { label: "Uzhavar Connect", href: "https://uzhavarconnect.com/", external: true };
const KIDDOS_ERP = { label: "Kiddos Foods ERP", href: "https://erpkiddosfoods.in", external: true };
const WAHID = { label: "Wahid mobile app", href: "/work#wahid" };
const ERP_CASE = { label: "ERP Solution case study", href: "/work/erp-solution" };

export const servicePages: ServicePage[] = [
  {
    slug: SERVICE_SLUGS.customSoftware,
    name: "Custom Software Development",
    icon: "code",
    card: "Software built around your processes — connecting teams and replacing spreadsheets with one reliable system.",
    heading: "Software Designed for the Way You Work.",
    intro:
      "We build custom applications that simplify your operations, connect your teams, and adapt to your business instead of forcing your business to adapt to the software.",
    capabilities: [
      "Business workflow automation",
      "Custom management systems",
      "Third-party integrations",
      "Reporting dashboards",
      "Scalable application architecture",
    ],
    benefits: ["Less manual data entry and fewer errors", "One source of truth your teams can trust", "Software that grows with your business"],
    related: [KIDDOS_ERP, ERP_CASE],
    accent: "workflow",
  },
  {
    slug: SERVICE_SLUGS.websiteDevelopment,
    name: "Website Development",
    icon: "monitor-smartphone",
    card: "Modern, responsive, SEO-friendly business websites that help your brand stand out, reach customers, and grow online.",
    heading: "Websites That Represent Your Brand and Drive Growth.",
    intro:
      "Your website is often the first interaction customers have with your business. At IKASLE Technologies, we design and develop fast, responsive, visually engaging websites that communicate your brand, improve user experience, and support your digital growth.",
    capabilities: [
      "Business and corporate websites",
      "Responsive website development",
      "Landing pages and campaign websites",
      "SEO-friendly website architecture",
      "Content management integration",
      "Website redesign and modernization",
      "Website speed and performance optimization",
    ],
    benefits: [
      "Stronger brand credibility",
      "Better user experience",
      "Improved mobile accessibility",
      "Faster website performance",
      "SEO-ready technical foundation",
      "Easier customer enquiries",
    ],
    related: [KIDDOS, UZHAVAR],
    accent: "server-render",
    cta: { label: "Let's Build Your Website", href: "/contact" },
  },
  {
    slug: SERVICE_SLUGS.webApplications,
    name: "Web Application Development",
    icon: "globe",
    card: "Fast, secure web platforms, portals and dashboards your customers and staff can use on any device.",
    heading: "Web Platforms People Enjoy Using.",
    intro:
      "We build fast, accessible web applications — online stores, customer portals, SaaS products and internal dashboards — that work on every device and are easy to grow.",
    capabilities: [
      "E-commerce storefronts and customer portals",
      "SaaS products and admin dashboards",
      "Responsive design for phones, tablets and desktops",
      "Search-friendly, fast-loading pages",
      "Accessibility built in from the start",
    ],
    benefits: ["A professional online presence that converts", "Self-service that saves your team time", "A platform that is easy to extend later"],
    related: [KIDDOS, UZHAVAR],
    accent: "server-render",
  },
  {
    slug: SERVICE_SLUGS.mobileApps,
    name: "Mobile App Development",
    icon: "smartphone",
    card: "iOS and Android apps that put your services in the hands of customers and field teams.",
    heading: "Your Business, in Your Customers’ Pockets.",
    intro:
      "We design and build mobile apps for iOS and Android from a single codebase — connected securely to your systems and prepared for the app stores.",
    capabilities: [
      "Cross-platform apps for iOS and Android",
      "Location, camera and notification features",
      "Offline-friendly flows that sync later",
      "Secure sign-in and connection to your systems",
      "App store release preparation",
    ],
    benefits: ["Reach customers where they already are", "Give field teams the tools they need on the move", "One codebase to maintain instead of two"],
    related: [WAHID],
    accent: "platforms",
  },
  {
    slug: SERVICE_SLUGS.erp,
    name: "ERP & Business Automation",
    icon: "boxes",
    card: "One system for inventory, purchasing, sales and production — with the routine steps automated.",
    heading: "One Connected System for Your Operations.",
    intro:
      "We design ERP systems that bring inventory, purchasing, sales, production and reporting together, so information is entered once and trusted everywhere.",
    capabilities: [
      "Inventory and multi-location stock tracking",
      "Purchase and sales order workflows",
      "Production planning",
      "Approvals and automated business steps",
      "Operational dashboards and reports",
    ],
    benefits: ["Stock levels that match reality", "Faster purchasing and sales decisions", "Reports in minutes instead of days"],
    related: [KIDDOS_ERP, ERP_CASE],
    accent: "erp-sync",
  },
  {
    slug: SERVICE_SLUGS.ai,
    name: "AI & Intelligent Solutions",
    icon: "sparkles",
    card: "Practical AI that reads documents, handles routine requests and routes work, so your team can focus on decisions.",
    heading: "Let Intelligent Automation Handle the Routine.",
    intro:
      "We add AI and automation to the workflows you already have — safely and practically — to read, sort, summarise and route information so people can focus on the work that needs them.",
    capabilities: [
      "Document reading and data extraction",
      "Automated sorting and routing of requests",
      "Assistants that answer from your own knowledge",
      "Scheduled and event-driven automations",
      "Human review where it matters",
    ],
    benefits: ["Hours of repetitive work handed to software", "Faster responses to routine requests", "Better use of the data you already have"],
    related: [],
    accent: "ai-extract",
  },
  {
    slug: SERVICE_SLUGS.productDesign,
    name: "UI/UX & Product Design",
    icon: "pen",
    card: "Research-led interfaces and design systems that make your product easy to learn and pleasant to use.",
    heading: "Products People Understand at First Glance.",
    intro:
      "We research, prototype and design interfaces with how they will be built in mind, then deliver design systems that turn directly into consistent, reusable components.",
    capabilities: [
      "User research and journey mapping",
      "Wireframes and clickable prototypes",
      "Visual and interaction design",
      "Design systems and reusable components",
      "Usability reviews and iteration",
    ],
    benefits: ["Ideas validated before development starts", "A consistent experience across every screen", "Faster development from clear, ready-to-build designs"],
    related: [KIDDOS, UZHAVAR, WAHID],
    accent: "tokens",
  },
];

/**
 * A service's page copy joined with its catalogue entry — the one lookup the routes and pages use.
 * Unknown slug → undefined (a 404). Known slug without a catalogue entry → an error naming it, because that is
 * a data bug (the two files out of sync), which must never be hidden behind a "not found" page.
 */
export function getServiceDetail(slug: string) {
  const page = servicePages.find((p) => p.slug === slug);
  if (!page) return undefined;
  const service = getService(slug);
  if (!service) throw new Error(`Service "${slug}" has page copy but no entry in src/data/services.ts`);
  return { page, service };
}
