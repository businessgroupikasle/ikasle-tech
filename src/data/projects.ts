import type { Project, ProjectCategory } from "@/types";

/**
 * Case studies.
 *
 * CONTENT NOTE — keep this honest:
 * - Feature lists come from the confirmed project scope.
 * - Client names, years, outcomes and the confirmed tech stack are left as
 *   `pending` placeholders until they are approved for publication. The UI
 *   shows a visible "to be confirmed" note for anything pending.
 * - Interface previews are illustrative React mockups using sample data.
 */
export const projects: Project[] = [
  {
    slug: "erp-solution",
    title: "ERP Solution",
    kicker: "Enterprise Resource Planning",
    summary:
      "An integrated ERP covering inventory, purchasing, sales, production planning, stock management, reporting and workflow automation.",
    categories: ["ERP Solutions", "Web Applications", "Business Automation"],
    mockup: "erp",
    overview:
      "A web-based ERP application that brings core operational processes into one system: inventory, purchase and sales, production planning, stock management, reports and analytics, with automated workflows connecting them.",
    challenge:
      "Operational data — stock, orders and production — typically lives across spreadsheets and separate tools. That makes stock levels unreliable, slows down purchasing and sales decisions, and turns reporting into a manual exercise.",
    solution:
      "A single ERP platform with dedicated modules sharing one data model. Transactions recorded in one module (for example a sales order) update the related records elsewhere (stock levels, production demand, reports), and routine steps are handled by configurable workflows.",
    features: [
      { title: "Inventory management", description: "Item master, categories, units and warehouse-level records.", icon: "package" },
      { title: "Purchase & sales", description: "Purchase orders, sales orders and their status through fulfilment.", icon: "receipt" },
      { title: "Production planning", description: "Plan production runs against demand and available materials.", icon: "factory" },
      { title: "Stock management", description: "Stock movements, adjustments and current levels per location.", icon: "boxes" },
      { title: "Reports & analytics", description: "Operational reports and dashboards across modules.", icon: "chart" },
      { title: "Workflow automation", description: "Automated steps and approvals between modules.", icon: "workflow" },
    ],
    stack: [],
    outcome: {
      pending: true,
      note: "Project outcomes will be published once confirmed with the client.",
    },
    client: { pending: true },
    year: null,
    screens: [
      { kind: "erp-dashboard", caption: "Operations dashboard — illustrative layout with sample data" },
      { kind: "erp-inventory", caption: "Inventory & stock management — sample data" },
      { kind: "erp-production", caption: "Production planning board — sample data" },
    ],
  },
];

export const projectCategories: ProjectCategory[] = [
  "E-commerce",
  "ERP Solutions",
  "Web Applications",
  "Mobile Applications",
  "Business Automation",
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
