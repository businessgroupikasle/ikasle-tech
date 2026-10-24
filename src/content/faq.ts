import type { Inline } from "@/content/blog/types";

export type Faq = { id: string; question: string; answer: Inline[][] };

/**
 * FAQ answers are based on what the website already states about IKASLE's services and process.
 * No pricing, turnaround times or support commitments — add those only once they are approved.
 */
export const faqs: Faq[] = [
  {
    id: "services",
    question: "What services does IKASLE Technologies provide?",
    answer: [
      [
        "We design and build digital products across seven areas: custom software development, website development, web application development, mobile app development, ERP and business automation, AI and intelligent solutions, and UI/UX and product design. ",
        { text: "See all services", href: "/services" },
        ".",
      ],
    ],
  },
  {
    id: "custom-software",
    question: "Do you develop custom software for businesses?",
    answer: [
      [
        "Yes. We build software around how a business actually works — internal tools, management systems, integrations between existing systems, reporting dashboards and complete line-of-business applications. ",
        { text: "Custom software development", href: "/services/custom-software-development" },
        ".",
      ],
    ],
  },
  {
    id: "web-and-mobile",
    question: "Can you build web and mobile applications?",
    answer: [
      [
        "Yes. We build web applications such as online stores, customer portals, SaaS products and dashboards, and cross-platform mobile apps for iOS and Android from a single codebase. See ",
        { text: "web applications", href: "/services/web-application-development" },
        " and ",
        { text: "mobile apps", href: "/services/mobile-app-development" },
        ".",
      ],
    ],
  },
  {
    id: "erp",
    question: "Do you provide ERP development services?",
    answer: [
      [
        "Yes. We design ERP systems that connect inventory, purchasing, sales, production planning and reporting, with routine steps automated. ",
        { text: "ERP & business automation", href: "/services/erp-business-automation" },
        " · ",
        { text: "Our work", href: "/work" },
        ".",
      ],
    ],
  },
  {
    id: "ai",
    question: "Can you integrate AI into existing applications?",
    answer: [
      [
        "Yes. We add AI and automation to existing workflows — for example reading and extracting data from documents, sorting and routing requests, and assistants that answer from your own knowledge — with human review where it matters. ",
        { text: "AI & intelligent solutions", href: "/services/ai-intelligent-solutions" },
        ".",
      ],
    ],
  },
  {
    id: "process",
    question: "How does your software development process work?",
    answer: [
      [
        "In four steps: we understand your requirements and agree on a scope; design the solution and share it before building; develop and test in short iterations you can review; then launch and support the product. ",
        { text: "How we work", href: "/services" },
        ".",
      ],
    ],
  },
  {
    id: "existing-application",
    question: "Can you upgrade an existing application?",
    answer: [
      [
        "We can review an existing application and discuss improving, extending or modernising it, or connecting it to other systems. The right approach depends on the current code and goals, so the first step is a conversation about what you have and what you need.",
      ],
    ],
  },
  {
    id: "new-project",
    question: "How can I discuss a new project with your team?",
    answer: [
      [
        "Send us a few details through the ",
        { text: "contact page", href: "/contact" },
        " — what you want to build, who it is for and any constraints. The more context you share, the more useful our first reply will be.",
      ],
    ],
  },
];
