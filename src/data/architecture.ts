export type ArchitectureLayer = {
  id: "frontend" | "api" | "services" | "database" | "cloud";
  title: string;
  description: string;
  /** Callouts shown on the diagram (and as chips under the description) when the layer is selected. */
  modules: [string, string, string];
};

/** Top-to-bottom layers of a typical modern application, as visualised on the home page. */
export const architectureLayers: ArchitectureLayer[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "Web and mobile clients render the experience — server-rendered pages, interactive dashboards and native apps.",
    modules: ["Next.js Web", "Mobile App", "Admin Panel"],
  },
  {
    id: "api",
    title: "API Layer",
    description: "A typed gateway authenticates every request, validates input, applies rate limits and routes it to the right service.",
    modules: ["REST / GraphQL", "Auth", "Rate Limits"],
  },
  {
    id: "services",
    title: "Backend Services",
    description: "Business logic lives in focused, modular services, with background jobs for the work that shouldn't block a request.",
    modules: ["Business Logic", "Service Modules", "Background Jobs"],
  },
  {
    id: "database",
    title: "Database",
    description: "Relational storage with migrations and backups, behind a query layer tuned for the reads that matter.",
    modules: ["PostgreSQL", "Data Storage", "Query Layer"],
  },
  {
    id: "cloud",
    title: "Cloud Infrastructure",
    description: "Managed hosting, automated deployments and autoscaling keep everything running as usage grows.",
    modules: ["Cloud Hosting", "Deployments", "Scalability"],
  },
];
