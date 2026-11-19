export type NavItem = {
  label: string;
  href: string;
};

export type IconName =
  | "code"
  | "globe"
  | "monitor-smartphone"
  | "smartphone"
  | "boxes"
  | "sparkles"
  | "pen"
  | "database"
  | "server"
  | "cloud"
  | "layers"
  | "shield"
  | "workflow"
  | "map-pin"
  | "users"
  | "chart"
  | "calendar"
  | "package"
  | "factory"
  | "receipt"
  | "file"
  | "clock";

export type ServiceImage = {
  src: string;
  alt: string;
  /** CSS object-position, tuned per photo so the key device/screen stays in frame when cropped. */
  position: string;
  /** Intrinsic size (used for Open Graph images). */
  width: number;
  height: number;
};

/**
 * Long-form "Service Overview" copy for a service's detail page. When a service has one, it replaces the short
 * summary/description/problems shown there (those still feed the home cards, mega menu and other pages).
 */
export type ServiceOverview = {
  /** Small label under the "Service Overview" heading. */
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  /** Emphasised closing line under the paragraphs. */
  closing?: string;
  /** Small label under the "Challenges We Solve" heading. */
  challengesEyebrow?: string;
  /** Paragraphs above the challenge list. */
  challengesIntro?: string[];
  /** A challenge with `text` shows as a bold title plus description; without it, as a single line. */
  challenges: { title: string; text?: string }[];
};

/** Step-by-step process section; replaces the short "How we build it" box on the detail page. */
export type ServiceApproach = {
  /** Section heading. Default: "Our Engineering Approach". */
  title?: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  steps: { title: string; text: string }[];
};

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  icon: IconName;
  summary: string;
  description: string;
  problems: string[];
  overview?: ServiceOverview;
  capabilities: string[];
  approach?: ServiceApproach;
  /** Not shown on the service pages; used by the site chatbot's knowledge. */
  technologies: string[];
  image: ServiceImage;
  /** Project type preselected on the contact form. */
  projectType: string;
};

export type ProjectCategory =
  | "E-commerce"
  | "ERP Solutions"
  | "Web Applications"
  | "Mobile Applications"
  | "Business Automation";

export type MockupKind = "erp";

export type Feature = {
  title: string;
  description: string;
  icon: IconName;
};

/**
 * Case-study content. Fields marked `pending` are editable placeholders:
 * fill them in src/data/projects.ts once details are confirmed with the client.
 */
export type Project = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  categories: ProjectCategory[];
  mockup: MockupKind;
  overview: string;
  challenge: string;
  solution: string;
  features: Feature[];
  stack: string[];
  /** Not yet confirmed — rendered with a visible "to be confirmed" note. */
  outcome: { pending: true; note: string } | { pending: false; text: string };
  client: { pending: true } | { pending: false; name: string };
  year: string | null;
  screens: { kind: "erp-dashboard" | "erp-inventory" | "erp-production"; caption: string }[];
};
