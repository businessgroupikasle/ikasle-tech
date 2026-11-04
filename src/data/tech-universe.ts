import type { LucideIcon } from "lucide-react";
import {
  BrickWall,
  Bot,
  Cpu,
  DatabaseZap,
  FlaskConical,
  History,
  LayoutTemplate,
  ListChecks,
  MonitorSmartphone,
  Palette,
  Plug,
  Puzzle,
  ScanEye,
  ShieldCheck,
  UserCheck,
  Webhook,
} from "lucide-react";
import {
  siApachejmeter,
  siBootstrap,
  siCss,
  siDbeaver,
  siDocker,
  siExpress,
  siFigma,
  siFlutter,
  siGit,
  siGithub,
  siGithubactions,
  siGooglechrome,
  siGraphql,
  siGreensock,
  siHtml5,
  siJavascript,
  siJira,
  siLinux,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siOllama,
  siOwasp,
  siPhp,
  siPm2,
  siPostgresql,
  siPostman,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siRedmine,
  siSelenium,
  siSqlite,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siUbuntu,
  siVercel,
  siWebgl,
} from "simple-icons";

/*
 * Technology Universe — the single data source for the homepage 3D globe.
 * Add a technology by appending to `techUniverse`; add a category by appending to `techCategories`.
 * The globe, filters and counters are all derived from these arrays (no globe code changes needed).
 */

export type TechCategoryId = "frontend" | "backend" | "database" | "testing" | "automation" | "devops" | "tools" | "networking" | "ai" | "uiux" | "motion";

export const techCategories: { id: TechCategoryId; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Database" },
  { id: "testing", label: "Testing & QA" },
  { id: "automation", label: "Automation" },
  { id: "devops", label: "DevOps" },
  { id: "tools", label: "Tools" },
  { id: "networking", label: "Networking" },
  { id: "ai", label: "AI" },
  { id: "uiux", label: "UI/UX" },
  { id: "motion", label: "Motion & 3D" },
];

/**
 * - `brand`: an authentic mark (Simple Icons, CC0; 24×24 path) drawn in the brand colour.
 * - `wordmark`: brands Simple Icons does not ship (AWS) — a text tile in the brand colours.
 * - `concept`: a practice rather than a product — a neutral line icon, never dressed up as a logo.
 */
export type TechIcon =
  | { kind: "brand"; path: string; hex: string }
  | { kind: "wordmark"; text: string; fg: string; bg: string }
  | { kind: "concept"; Icon: LucideIcon };

export type TechItem = {
  id: string;
  name: string;
  category: TechCategoryId;
  icon: TechIcon;
  description: string;
  /** Only list real IKASLE projects here — leave undefined rather than inventing associations. */
  projects?: string[];
};

const brand = (si: { path: string; hex: string }): TechIcon => ({ kind: "brand", path: si.path, hex: `#${si.hex}` });
const concept = (Icon: LucideIcon): TechIcon => ({ kind: "concept", Icon });

export const techUniverse: TechItem[] = [
  // Frontend
  { id: "html5", name: "HTML5", category: "frontend", icon: brand(siHtml5), description: "Semantic, accessible markup as the foundation of every page." },
  { id: "css", name: "CSS", category: "frontend", icon: brand(siCss), description: "Modern layouts, theming and motion in plain CSS." },
  { id: "javascript", name: "JavaScript", category: "frontend", icon: brand(siJavascript), description: "Interactive behaviour across browsers and runtimes." },
  { id: "typescript", name: "TypeScript", category: "frontend", icon: brand(siTypescript), description: "Build reliable applications with type-safe code." },
  { id: "react", name: "React", category: "frontend", icon: brand(siReact), description: "Create interactive, component-based interfaces." },
  { id: "nextjs", name: "Next.js", category: "frontend", icon: brand(siNextdotjs), description: "Build fast, modern React web applications." },
  { id: "tailwindcss", name: "Tailwind CSS", category: "frontend", icon: brand(siTailwindcss), description: "Style modern websites rapidly with utility-first CSS." },
  { id: "bootstrap", name: "Bootstrap", category: "frontend", icon: brand(siBootstrap), description: "Responsive component framework for quick, consistent UIs." },
  { id: "flutter", name: "Flutter", category: "frontend", icon: brand(siFlutter), description: "Cross-platform mobile apps from a single codebase." },
  { id: "responsive-design", name: "Responsive Design", category: "frontend", icon: concept(MonitorSmartphone), description: "Layouts that adapt cleanly from phones to wide desktops." },

  // Backend
  { id: "nodejs", name: "Node.js", category: "backend", icon: brand(siNodedotjs), description: "Power scalable APIs and server-side applications." },
  { id: "express", name: "Express", category: "backend", icon: brand(siExpress), description: "Lightweight HTTP services and REST endpoints on Node.js." },
  { id: "python", name: "Python", category: "backend", icon: brand(siPython), description: "Back-end services, scripting, data work and automation." },
  { id: "php", name: "PHP", category: "backend", icon: brand(siPhp), description: "Server-side web applications and existing PHP platforms." },
  { id: "graphql", name: "GraphQL", category: "backend", icon: brand(siGraphql), description: "Typed APIs that let clients fetch exactly the data they need." },
  { id: "rest-apis", name: "REST APIs", category: "backend", icon: concept(Webhook), description: "Designing clear, versioned HTTP APIs for web and mobile clients." },
  { id: "api-integration", name: "API Integration", category: "backend", icon: concept(Plug), description: "Connecting payment, messaging and third-party services." },

  // Database
  { id: "postgresql", name: "PostgreSQL", category: "database", icon: brand(siPostgresql), description: "Manage structured application and business data." },
  { id: "mysql", name: "MySQL", category: "database", icon: brand(siMysql), description: "Relational storage for transactional web applications." },
  { id: "mongodb", name: "MongoDB", category: "database", icon: brand(siMongodb), description: "Document storage for flexible, fast-changing data." },
  { id: "sqlite", name: "SQLite", category: "database", icon: brand(siSqlite), description: "Embedded storage for local, mobile and lightweight apps." },
  { id: "redis", name: "Redis", category: "database", icon: brand(siRedis), description: "In-memory caching, queues and rate limiting." },
  { id: "prisma", name: "Prisma", category: "database", icon: brand(siPrisma), description: "Simplify database access with type-safe queries." },
  { id: "database-design", name: "Database Design", category: "database", icon: concept(DatabaseZap), description: "Schemas, indexes and queries planned for growth." },

  // Testing & QA
  { id: "functional-testing", name: "Functional Testing", category: "testing", icon: concept(ListChecks), description: "Verifying every feature against its requirements." },
  { id: "integration-testing", name: "Integration Testing", category: "testing", icon: concept(Puzzle), description: "Checking that services, APIs and databases work together." },
  { id: "regression-testing", name: "Regression Testing", category: "testing", icon: concept(History), description: "Making sure new releases don't break existing behaviour." },
  { id: "api-testing", name: "API Testing", category: "testing", icon: concept(FlaskConical), description: "Validating endpoints, payloads, errors and auth rules." },
  { id: "uat", name: "User Acceptance Testing", category: "testing", icon: concept(UserCheck), description: "Confirming the software works for real users before launch." },

  // Automation & performance
  { id: "selenium", name: "Selenium", category: "automation", icon: brand(siSelenium), description: "Automated browser tests for repeatable UI checks." },
  { id: "jmeter", name: "Apache JMeter", category: "automation", icon: brand(siApachejmeter), description: "Load and performance testing before traffic arrives." },
  { id: "owasp", name: "OWASP Testing", category: "automation", icon: brand(siOwasp), description: "Security checks guided by the OWASP testing practices." },

  // DevOps & deployment
  { id: "git", name: "Git", category: "devops", icon: brand(siGit), description: "Version control for every line of code we ship." },
  { id: "github", name: "GitHub", category: "devops", icon: brand(siGithub), description: "Manage codebase versioning and team collaboration." },
  { id: "github-actions", name: "GitHub Actions", category: "devops", icon: brand(siGithubactions), description: "CI pipelines for linting, testing and builds on every push." },
  { id: "docker", name: "Docker", category: "devops", icon: brand(siDocker), description: "Deploy consistent software environments anywhere." },
  { id: "aws", name: "AWS", category: "devops", icon: { kind: "wordmark", text: "aws", fg: "#FF9900", bg: "#232F3E" }, description: "Host and scale cloud-native applications securely." },
  { id: "vercel", name: "Vercel", category: "devops", icon: brand(siVercel), description: "Edge hosting and preview deployments for web apps." },
  { id: "ubuntu", name: "Ubuntu", category: "devops", icon: brand(siUbuntu), description: "Linux servers for VPS and cloud deployments." },
  { id: "nginx", name: "Nginx", category: "devops", icon: brand(siNginx), description: "Reverse proxy, TLS and static delivery in production." },
  { id: "pm2", name: "PM2", category: "devops", icon: brand(siPm2), description: "Keeping Node.js services running and restarting cleanly." },

  // Tools
  { id: "postman", name: "Postman", category: "tools", icon: brand(siPostman), description: "Exploring, documenting and testing APIs." },
  { id: "jira", name: "Jira", category: "tools", icon: brand(siJira), description: "Planning sprints and tracking delivery work." },
  { id: "redmine", name: "Redmine", category: "tools", icon: brand(siRedmine), description: "Issue and defect tracking for client projects." },
  { id: "chrome-devtools", name: "Chrome DevTools", category: "tools", icon: brand(siGooglechrome), description: "Debugging, profiling and performance audits in the browser." },
  { id: "dbeaver", name: "DBeaver", category: "tools", icon: brand(siDbeaver), description: "Inspecting and managing databases across engines." },

  // Networking & security
  { id: "linux-admin", name: "Linux Administration", category: "networking", icon: brand(siLinux), description: "Configuring, securing and maintaining Linux servers." },
  { id: "network-security", name: "Network Security", category: "networking", icon: concept(ShieldCheck), description: "Hardening access, traffic and infrastructure." },
  { id: "firewall-vpn", name: "Firewall & VPN", category: "networking", icon: concept(BrickWall), description: "Controlling and protecting traffic to private systems." },

  // AI
  { id: "ollama", name: "Ollama", category: "ai", icon: brand(siOllama), description: "Running open language models on private infrastructure." },
  { id: "local-llms", name: "Local LLMs", category: "ai", icon: concept(Cpu), description: "Private AI features that keep business data in-house." },
  { id: "ai-automation", name: "AI Automation", category: "ai", icon: concept(Bot), description: "Automating repetitive work with AI-assisted workflows." },
  { id: "computer-vision", name: "Computer Vision", category: "ai", icon: concept(ScanEye), description: "Extracting information from images and camera feeds." },

  // UI/UX
  { id: "figma", name: "Figma", category: "uiux", icon: brand(siFigma), description: "Wireframes, prototypes and design systems." },
  { id: "uiux-design", name: "UI/UX Design", category: "uiux", icon: concept(LayoutTemplate), description: "Interfaces designed around real user needs." },
  { id: "visual-design", name: "Visual Design", category: "uiux", icon: concept(Palette), description: "Typography, colour and brand-consistent visuals." },

  // Motion & 3D
  { id: "threejs", name: "Three.js", category: "motion", icon: brand(siThreedotjs), description: "Interactive 3D graphics on the web." },
  { id: "webgl", name: "WebGL", category: "motion", icon: brand(siWebgl), description: "GPU-accelerated rendering in the browser." },
  { id: "gsap", name: "GSAP", category: "motion", icon: brand(siGreensock), description: "Smooth, scroll-driven web animation." },
];

export const techCategoryLabel = Object.fromEntries(techCategories.map((c) => [c.id, c.label])) as Record<TechCategoryId, string>;

export const techCountByCategory = Object.fromEntries(techCategories.map((c) => [c.id, techUniverse.filter((t) => t.category === c.id).length])) as Record<TechCategoryId, number>;
