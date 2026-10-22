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
