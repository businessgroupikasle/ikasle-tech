export type NavItem = {
  label: string;
  href: string;
};

export type IconName =
  | "code"
  | "globe"
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

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  icon: IconName;
  summary: string;
  description: string;
  problems: string[];
  capabilities: string[];
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

