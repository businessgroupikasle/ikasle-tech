import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "custom-software",
    title: "Custom Software Development",
    shortTitle: "Custom Software",
    icon: "code",
    summary: "Business applications, scalable systems and integrations engineered around how your team actually works.",
    description:
      "When off-the-shelf tools stop fitting, we design and build software around your processes — from internal tools and integrations to complete line-of-business systems with clean, maintainable code.",
    problems: [
      "Teams juggling spreadsheets and disconnected tools",
      "Legacy systems that are hard to change or extend",
      "Manual data entry between applications",
      "Processes that no packaged software supports",
    ],
    capabilities: [
      "Domain modelling and system architecture",
      "REST and GraphQL API design",
      "Third-party and legacy system integration",
      "Role-based access control and audit trails",
      "Automated testing and CI/CD pipelines",
    ],
    technologies: ["TypeScript", "Node.js", "PostgreSQL", "Prisma", "Docker", "GitHub Actions"],
    image: {
      src: "/images/services/custom-software-code-laptop.jpg",
      alt: "Laptop on a desk showing HTML and CSS source code in a split-screen code editor",
      position: "55% 50%",
    },
    projectType: "Software Development",
  },
  {
    slug: "web-applications",
    title: "Web Application Development",
    shortTitle: "Web Applications",
    icon: "globe",
    summary: "Fast, accessible Next.js and React platforms — SaaS products, portals and responsive dashboards.",
    description:
      "We build modern web applications with server rendering, strong typing and thoughtful UX — engineered for performance, accessibility and long-term maintainability.",
    problems: [
      "Slow, outdated web experiences that lose users",
      "Products that don't work well on mobile",
      "Front-ends that are difficult to evolve",
      "No single place for customers or staff to self-serve",
    ],
    capabilities: [
      "Next.js App Router and React Server Components",
      "SaaS architecture and multi-tenant design",
      "Design systems and component libraries",
      "Performance, SEO and Core Web Vitals optimisation",
      "Accessibility (WCAG) practices",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Vercel"],
    image: {
      src: "/images/services/web-app-saas-dashboard.jpg",
      alt: "Desktop monitor displaying a SaaS analytics dashboard with charts and user activity",
      position: "50% 45%",
    },
    projectType: "Web Application",
  },
  {
    slug: "mobile-apps",
    title: "Mobile App Development",
    shortTitle: "Mobile Apps",
    icon: "smartphone",
    summary: "Cross-platform mobile apps connected to your systems, with offline-aware flows and native device features.",
    description:
      "We deliver cross-platform mobile applications that share a single codebase while still using device capabilities like location, camera and notifications — connected securely to your back-end.",
    problems: [
      "Field teams without reliable tools on the move",
      "Separate iOS and Android codebases to maintain",
      "Paper-based check-ins, inspections or approvals",
      "Mobile apps disconnected from core business data",
    ],
    capabilities: [
      "Cross-platform development (React Native / Flutter)",
      "Location, geofencing and device APIs",
      "Push notifications and background sync",
      "Secure authentication and API integration",
      "App store release preparation",
    ],
    technologies: ["React", "Expo", "Flutter", "TypeScript", "Firebase", "Node.js"],
    image: {
      src: "/images/services/mobile-app-phone-mockups.jpg",
      alt: "Two smartphones displaying mobile application screens",
      position: "50% 45%",
    },
    projectType: "Mobile Application",
  },
  {
    slug: "erp-solutions",
    title: "ERP Solutions",
    shortTitle: "ERP & Automation",
    icon: "boxes",
    summary: "Inventory, sales, purchasing, manufacturing and reporting connected in one operational platform.",
    description:
      "We design ERP systems that connect day-to-day operations — inventory, purchasing, sales, production and reporting — so data is entered once and trusted everywhere.",
    problems: [
      "Stock levels that never match reality",
      "Purchase and sales data spread across tools",
      "Production planning done by hand",
      "Reports that take days to compile",
    ],
    capabilities: [
      "Inventory and multi-location stock tracking",
      "Purchase and sales order workflows",
      "Production planning and bills of materials",
      "Approval workflows and business automation",
      "Operational dashboards and reporting",
    ],
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Docker"],
    image: {
      src: "/images/services/erp-warehouse-inventory.jpg",
      alt: "Warehouse with an inventory management dashboard on a laptop and stock, order and alert panels",
      position: "62% 50%",
    },
    projectType: "ERP Solution",
  },
  {
    slug: "ai-automation",
    title: "AI & Automation",
    shortTitle: "AI & Intelligent Solutions",
    icon: "sparkles",
    summary: "Intelligent workflows, AI integrations and automation that remove repetitive work from your day.",
    description:
      "We integrate AI models and automation into existing workflows — practically and safely — to classify, extract, summarise and route information so people can focus on decisions.",
    problems: [
      "Repetitive manual tasks consuming staff time",
      "Unstructured documents and emails to process",
      "Slow responses to routine requests",
      "Data that exists but isn't put to use",
    ],
    capabilities: [
      "LLM integration and prompt engineering",
      "Document extraction and classification",
      "Workflow automation and scheduled jobs",
      "Retrieval over your own knowledge base",
      "Human-in-the-loop review flows",
    ],
    technologies: ["Python", "TypeScript", "Node.js", "FastAPI", "PostgreSQL", "Redis"],
    image: {
      src: "/images/services/ai-workflow-automation-robot.jpg",
      alt: "Friendly robot presenting a task decomposition, execution and feedback-loop workflow",
      position: "48% 50%",
    },
    projectType: "AI & Automation",
  },
  {
    slug: "product-design",
    title: "UI/UX & Product Design",
    shortTitle: "UI/UX & Product Engineering",
    icon: "pen",
    summary: "User research, interface design, interactive prototypes and design systems that ship cleanly to code.",
    description:
      "Design and engineering work as one team: we research, prototype and design interfaces with real implementation constraints in mind, then hand off design systems that map 1:1 to components.",
    problems: [
      "Products that are hard to learn or use",
      "Inconsistent interfaces across screens",
      "Ideas that need validation before a build",
      "Design files that don't translate into code",
    ],
    capabilities: [
      "User research and journey mapping",
      "Wireframes and interactive prototypes",
      "Visual and interaction design",
      "Design systems and tokens",
      "Usability reviews and iteration",
    ],
    technologies: ["Figma", "Framer", "Tailwind CSS", "React", "Rive", "GSAP"],
    image: {
      src: "/images/services/ui-ux-design-workstation.jpg",
      alt: "Designer's workstation with app wireframes and UI screens on a monitor and laptop",
      position: "50% 40%",
    },
    projectType: "UI/UX Design",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
