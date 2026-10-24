import {
  siDocker,
  siFigma,
  siGit,
  siGithub,
  siGithubactions,
  siGraphql,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siVercel,
  siFlutter,
} from "simple-icons";

export type Technology = {
  name: string;
  /** SVG path in a 24×24 viewBox (from Simple Icons, CC0). `null` renders a wordmark tile. */
  path: string | null;
  hex: string;
};

const t = (name: string, icon: { path: string; hex: string }): Technology => ({ name, path: icon.path, hex: `#${icon.hex}` });

export const technologies: Technology[] = [
  t("Next.js", siNextdotjs),
  t("React", siReact),
  t("TypeScript", siTypescript),
  t("Node.js", siNodedotjs),
  t("PostgreSQL", siPostgresql),
  t("Prisma", siPrisma),
  t("Tailwind CSS", siTailwindcss),
  t("Docker", siDocker),
  t("Git", siGit),
  t("GitHub", siGithub),
  // Simple Icons does not ship the AWS mark (trademark request), so render a text tile.
  { name: "AWS", path: null, hex: "#FF9900" },
  t("GitHub Actions", siGithubactions),
  t("Vercel", siVercel),
  t("Redis", siRedis),
  t("GraphQL", siGraphql),
  t("Python", siPython),
  t("Flutter", siFlutter),
  t("Three.js", siThreedotjs),
  t("Figma", siFigma),
];

/** The core of the stack shown in the homepage orbit (names must match `technologies`). */
export const orbitTechnologies = ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Docker", "GitHub", "AWS"];

/** Tooltip content for each orbit technology — keyed by exact technology name. */
export const orbitTooltipData: Record<string, { category: string; description: string }> = {
  "Next.js":       { category: "Frontend Framework",   description: "Build fast, modern React web applications." },
  "React":         { category: "UI Library",            description: "Create interactive, component-based interfaces." },
  "TypeScript":    { category: "Programming Language",  description: "Build reliable applications with type-safe code." },
  "Node.js":       { category: "Backend Runtime",       description: "Power scalable APIs and server-side applications." },
  "PostgreSQL":    { category: "Database",              description: "Manage structured application and business data." },
  "Prisma":        { category: "Database Toolkit",      description: "Simplify database access with type-safe queries." },
  "Tailwind CSS":  { category: "Styling Framework",     description: "Style modern websites rapidly with utility-first CSS." },
  "Docker":        { category: "Containerization",      description: "Deploy consistent software environments anywhere." },
  "GitHub":        { category: "Version Control",       description: "Manage codebase versioning and team collaboration." },
  "AWS":           { category: "Cloud Infrastructure",  description: "Host and scale cloud-native applications securely." },
};

