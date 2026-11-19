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
/** Icon on a "What We Build" item or a benefit tile; each key maps to a Lucide icon in components/services/deliver-icons.ts. */
export type DeliverIcon =
  | "zap"
  | "target"
  | "hub"
  | "puzzle"
  | "shield"
  | "map-pin"
  | "copy"
  | "bell"
  | "book"
  | "code"
  | "badge"
  | "pointer"
  | "message"
  | "sprout"
  | "app"
  | "briefcase"
  | "workflow"
  | "plug"
  | "chart"
  | "building"
  | "responsive"
  | "layout"
  | "search"
  | "content"
  | "refresh"
  | "gauge"
  | "cloud"
  | "cart"
  | "users"
  | "dashboard"
  | "phone"
  | "tablet"
  | "layers"
  | "calendar"
  | "package"
  | "clipboard"
  | "receipt"
  | "factory"
  | "scan"
  | "database"
  | "bot"
  | "tags"
  | "sparkles"
  | "user-check"
  | "route"
  | "palette"
  | "lightbulb"
  | "pen-tool"
  | "component"
  | "eye";

/** Picks the icon on a "Who needs this?" card. */
export type AudienceKind = "startup" | "smb" | "enterprise";

export type ServicePage = {
  slug: string;
  name: string;
  icon: IconName;
  /** One-line, business-focused card description. */
  card: string;
  heading: string;
  /** Hero text. Separate paragraphs with a blank line. */
  intro: string;
  capabilities: string[];
  benefits: string[];
  related: RelatedWork[];
  accent: ServiceAccent;
  cta?: { label: string; href: string };
  /**
   * Long-form replacement for the "What We Deliver" checklist on the detail page: numbered cards with a title
   * and a line each. `capabilities` stays as the short list the chatbot uses.
   */
  deliver?: SectionCopy & {
    title: string;
    /** `points` adds a short bullet list to the item (e.g. an ERP module's features). */
    items: { title: string; icon: DeliverIcon; text: string; points?: string[] }[];
  };
  /** Extra card section after "What We Deliver" (e.g. "How We Engineer Web Applications", "Mobile Application Capabilities"). */
  features?: SectionCopy & {
    title: string;
    items: { title: string; text: string }[];
  };
  /** Checklist of hand-over deliverables, shown after the process timeline (e.g. UI/UX "What We Deliver"). */
  deliverables?: {
    title: string;
    items: string[];
  };
  /** Optional "Who needs this?" section: one card per kind of business the service suits. */
  audiences?: {
    title: string;
    eyebrow: string;
    items: { kind: AudienceKind; title: string; text: string }[];
  };
  /** Copy for the closing contact CTA; anything left out falls back to the shared service CTA. */
  ctaSection?: {
    eyebrow?: string;
    title: string;
    /** Words in `title` drawn in the accent colour. */
    highlight: string[];
    text: string;
    primaryLabel?: string;
    secondary?: { label: string; href: string };
  };
  /** Optional FAQ shown after the contact CTA (also published as FAQPage structured data). */
  faq?: {
    eyebrow?: string;
    items: { question: string; answer: string }[];
  };
  /** Long-form replacement for the short `benefits` cards on the detail page. */
  benefitDetails?: SectionCopy & {
    /** Section heading. Default: "Business Benefits". */
    title?: string;
    /** Shown as a connected graph of round icon nodes (BenefitsGraph). */
    items: { title: string; icon: DeliverIcon; text: string }[];
  };
};

/** Optional copy under a section heading: small label, sub-heading and intro paragraph. */
export type SectionCopy = { eyebrow?: string; heading?: string; intro?: string };

const KIDDOS = { label: "Kiddos Foods", href: "https://kiddosfoods.com", external: true };
const UZHAVAR = { label: "Uzhavar Connect", href: "https://uzhavarconnect.com/", external: true };
const KIDDOS_ERP = { label: "Kiddos Foods ERP", href: "https://erpkiddosfoods.in", external: true };

export const servicePages: ServicePage[] = [
  {
    slug: SERVICE_SLUGS.customSoftware,
    name: "Custom Software Development",
    icon: "code",
    card: "Software built around your processes — connecting teams and replacing spreadsheets with one reliable system.",
    heading: "Custom Software Development Built Around Your Business.",
    intro:
      `Your business has its own processes, challenges and way of working. Your software should support them — not force you to change them. IKASLÉ Technologies provides custom software development services for startups, SMEs and enterprises that need software tailored to their specific business requirements.

From business management applications and workflow automation to system integrations and scalable enterprise solutions, we engineer software that simplifies operations, connects information and supports business growth. Based in Coimbatore, India, we welcome custom software development enquiries from businesses across India and international markets.`,
    capabilities: [
      "Business workflow automation",
      "Custom management systems",
      "Third-party integrations",
      "Reporting dashboards",
      "Scalable application architecture",
    ],
    benefits: ["Less manual data entry and fewer errors", "One source of truth your teams can trust", "Software that grows with your business"],
    related: [KIDDOS_ERP],
    accent: "workflow",
    deliver: {
      title: "What We Develop",
      eyebrow: "Custom applications for real business requirements",
      heading: "Software Solutions Designed Around Your Operations.",
      items: [
        { title: "Custom Business Applications", icon: "app", text: "Applications developed around your business workflows, operational requirements and internal processes." },
        { title: "Business Management Systems", icon: "briefcase", text: "Centralized systems that help teams manage business information, activities and operational workflows." },
        { title: "Workflow Automation", icon: "workflow", text: "Software that streamlines repetitive tasks, connects processes and reduces manual intervention." },
        { title: "Third-Party Integrations", icon: "plug", text: "Integrations that connect different applications, services and data sources into a more coordinated system." },
        { title: "Reporting & Analytics Dashboards", icon: "chart", text: "Centralized dashboards that organize business information and make operational data easier to understand." },
        { title: "Enterprise Software Solutions", icon: "building", text: "Structured, scalable applications designed to support complex workflows, business operations and evolving requirements." },
      ],
    },
    benefitDetails: {
      eyebrow: "Software that creates practical value",
      heading: "More Control. Better Visibility. Smarter Operations.",
      items: [
        { title: "Reduce Manual Work", icon: "zap", text: "Automate repetitive business processes and reduce unnecessary data entry." },
        { title: "Improve Information Accuracy", icon: "target", text: "Connect business information through structured systems and consistent data workflows." },
        { title: "Centralize Business Operations", icon: "hub", text: "Bring relevant information and processes together in a system designed around your requirements." },
        { title: "Improve Operational Visibility", icon: "chart", text: "Use dashboards and reporting systems to make business information easier to access and understand." },
        { title: "Adapt as Your Business Evolves", icon: "refresh", text: "Develop applications that can be extended and maintained as your requirements change." },
        { title: "Build Around Your Business", icon: "puzzle", text: "Choose functionality, workflows and integrations based on actual operational needs." },
      ],
    },
    audiences: {
      title: "Who Needs Custom Software Development?",
      eyebrow: "Solutions for different business requirements",
      items: [
        { kind: "startup", title: "Startups", text: "Build an MVP, validate a product idea or develop a custom application around a specific market requirement." },
        { kind: "smb", title: "Small & Medium Businesses", text: "Replace fragmented tools, simplify internal workflows and develop software that supports daily business operations." },
        { kind: "enterprise", title: "Enterprises", text: "Modernize existing applications, connect systems and develop software around complex organizational requirements." },
      ],
    },
    ctaSection: {
      eyebrow: "// let's engineer the right solution.",
      title: "Have a Business Challenge? Let's Build the Software to Solve It.",
      highlight: ["Solve", "It."],
      text: "Tell us about your workflows, challenges and what you want to achieve. We'll explore the requirements and help identify a suitable technology approach.",
      primaryLabel: "Start a Software Project",
      secondary: { label: "Talk to Our Team", href: "/contact" },
    },
    faq: {
      eyebrow: "Custom software development — your questions answered",
      items: [
        {
          question: "What is custom software development?",
          answer:
            "Custom software development is the process of designing, building and maintaining software specifically around an organization's business requirements, workflows and objectives. Unlike standard off-the-shelf software, custom applications can be designed around the functionality and integrations a business needs.",
        },
        {
          question: "Why should a business choose custom software instead of off-the-shelf software?",
          answer:
            "Custom software can be useful when standard applications cannot accommodate specific workflows, business rules, integrations or operational requirements. It offers greater control over functionality and can be developed around the organization's processes.",
        },
        {
          question: "What types of custom software can IKASLÉ Technologies develop?",
          answer:
            "IKASLÉ Technologies develops custom business applications, management systems, workflow automation solutions, reporting dashboards, API integrations and other software systems based on project requirements.",
        },
        {
          question: "Can custom software integrate with our existing applications?",
          answer:
            "Yes. Where supported by the existing systems, custom software can integrate with third-party applications and legacy systems through APIs and other integration methods.",
        },
        {
          question: "Can you automate our existing business processes?",
          answer: "Yes. We can assess repetitive workflows and develop automation solutions based on the processes, systems and requirements involved.",
        },
        {
          question: "Can custom software be expanded as our business grows?",
          answer:
            "Yes. Applications can be designed with maintainable architecture and extensibility in mind. Future expansion depends on the original architecture, infrastructure and evolving requirements.",
        },
        {
          question: "What technologies do you use for custom software development?",
          answer:
            "Our listed technology stack includes TypeScript, Node.js, PostgreSQL, Prisma, Docker and GitHub Actions. The final selection depends on the application's requirements and architecture.",
        },
        {
          question: "Does IKASLÉ Technologies develop software for startups and enterprises?",
          answer:
            "Yes. We welcome custom software project enquiries from startups, SMEs and enterprises. The proposed solution is based on the business requirements and project scope.",
        },
        {
          question: "Does IKASLÉ Technologies work with international businesses?",
          answer:
            "We welcome international project enquiries. Our portfolio includes website projects from the United Kingdom and the United Arab Emirates, and we are open to discussing custom software requirements from other markets.",
        },
        {
          question: "How can I get started with a custom software development project?",
          answer:
            "Contact IKASLÉ Technologies with your business requirements, project idea or existing workflow challenges. Our team can discuss the scope, technical requirements and potential development approach.",
        },
      ],
    },
  },
  {
    slug: SERVICE_SLUGS.websiteDevelopment,
    name: "Website Development",
    icon: "monitor-smartphone",
    card: "Modern, responsive, SEO-friendly business websites that help your brand stand out, reach customers, and grow online.",
    heading: "Website Development That Builds Your Brand and Drives Growth",
    intro: `Your website is more than an online presence. It is where potential customers discover your business, understand your services and decide whether to work with you.

At IKASLÉ Technologies, we design and develop modern, responsive and SEO-friendly websites that bring your brand to life. From corporate websites and business platforms to landing pages and website redesigns, we build digital experiences that combine visual clarity, usability and reliable engineering. Based in Coimbatore, India, we work with businesses looking to establish, improve or expand their digital presence.`,
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
    deliver: {
      title: "What We Deliver",
      items: [
        {
          title: "Business and Corporate Website Development", icon: "building",
          text: "Professional websites that communicate your company's identity, services, expertise and value proposition.",
        },
        { title: "Responsive Website Development", icon: "responsive", text: "Websites designed to provide a consistent experience across desktops, tablets and smartphones." },
        { title: "Landing Page Development", icon: "layout", text: "Focused landing pages for campaigns, products, services and specific marketing objectives." },
        {
          title: "SEO-Friendly Website Development", icon: "search",
          text: "Well-structured pages, semantic HTML, descriptive URLs and technical foundations that support search engine discovery.",
        },
        {
          title: "Content Management Integration", icon: "content",
          text: "Content management capabilities that make it easier to update website information, images, articles and other relevant content.",
        },
        {
          title: "Website Redesign and Modernisation", icon: "refresh",
          text: "Transform outdated websites with improved layouts, modern interfaces, better navigation and maintainable technology.",
        },
        {
          title: "Website Performance Optimisation", icon: "gauge",
          text: "Improve loading efficiency and technical performance through appropriate optimisation of images, code and page resources.",
        },
      ],
    },
    benefitDetails: {
      title: "Business Benefits of Professional Website Development",
      intro: "A well-planned website can help your business establish a stronger digital presence.",
      items: [
        { title: "Stronger Brand Credibility", icon: "badge", text: "Present your business professionally and consistently." },
        { title: "Better User Experience", icon: "pointer", text: "Help visitors find information and navigate your website more easily." },
        { title: "Mobile Accessibility", icon: "phone", text: "Make your website usable across different devices and screen sizes." },
        { title: "Technical Performance", icon: "gauge", text: "Build with attention to loading efficiency and website performance." },
        { title: "SEO-Friendly Foundation", icon: "search", text: "Establish a clear technical and content structure for search engine discovery." },
        { title: "Customer Enquiries", icon: "message", text: "Make it easier for visitors to contact your business and enquire about your services." },
        { title: "Room to Grow", icon: "sprout", text: "Create a website structure that can evolve as your business requirements change." },
      ],
    },
    ctaSection: {
      title: "Have a Website Idea? Let's Build It.",
      highlight: ["Build", "It."],
      text: "Whether you are launching a new business, refreshing your brand or replacing an outdated website, let's discuss what you want to achieve. Tell us about your project. We'll help you plan the right website solution for your business.",
    },
    faq: {
      items: [
        {
          question: "What does a website development company do?",
          answer:
            "A website development company plans, designs, builds and maintains websites. This can include corporate websites, business websites, landing pages, content management systems and other web-based experiences.",
        },
        {
          question: "How much does website development cost?",
          answer:
            "Website development costs depend on the number of pages, design requirements, functionality, integrations, content management needs and project complexity. We evaluate your requirements before providing a project quotation.",
        },
        {
          question: "How long does it take to develop a business website?",
          answer:
            "The timeline depends on the website's scope, number of pages, design complexity, functionality and content readiness. A project timeline can be established after understanding the requirements.",
        },
        {
          question: "Will my website work on mobile devices?",
          answer: "We develop responsive websites designed to adapt to different screen sizes, including smartphones, tablets and desktop computers.",
        },
        {
          question: "Is SEO included in website development?",
          answer:
            "We build with SEO-friendly technical foundations, including semantic structure, page metadata and clear navigation. Ongoing SEO activities such as keyword strategy, content campaigns, link building and search performance management can be scoped separately.",
        },
        {
          question: "Can you redesign my existing website?",
          answer: "Yes. We can review your existing website requirements and help modernise its design, structure, responsiveness and technical implementation.",
        },
        {
          question: "Can I update the website content myself?",
          answer:
            "Content management functionality can be included based on your requirements. The appropriate solution depends on how frequently you update content and the level of control your team needs.",
        },
        {
          question: "Do you develop websites for international businesses?",
          answer:
            "IKASLÉ Technologies is based in Coimbatore, India, and welcomes website development enquiries from businesses in India and international markets.",
        },
      ],
    },
  },
  {
    slug: SERVICE_SLUGS.webApplications,
    name: "Web Application Development",
    icon: "globe",
    card: "Fast, secure web platforms, portals and dashboards your customers and staff can use on any device.",
    heading: "Web Application Development for Products, Platforms and Businesses",
    intro: `We build fast, accessible web applications that help businesses deliver better digital experiences, simplify operations and create new ways to serve their customers. From SaaS products and e-commerce platforms to customer portals and internal dashboards, IKASLÉ Technologies develops modern web applications designed around real user needs, business objectives and long-term growth.

Whether you are launching a new digital product or transforming an existing business process, we bring together thoughtful user experience, modern web technologies and reliable engineering.`,
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
    deliver: {
      title: "What We Build",
      items: [
        {
          title: "SaaS Applications", icon: "cloud",
          text: "Develop subscription-based software platforms with user accounts, application workflows, dashboards and the functionality required to serve multiple customers.",
        },
        {
          title: "E-commerce Web Applications", icon: "cart",
          text: "Build interactive online shopping experiences with product catalogues, customer accounts, shopping carts, order management and payment integrations.",
        },
        {
          title: "Customer Portals", icon: "users",
          text: "Give customers a dedicated online space to access information, manage requests, track activities and interact with your business.",
        },
        {
          title: "Admin Dashboards and Management Platforms", icon: "dashboard",
          text: "Create centralised interfaces for managing users, business information, transactions, operational activities and reports.",
        },
        {
          title: "Business Web Applications", icon: "app",
          text: "Develop browser-based applications that support internal workflows, data management, team collaboration and business operations.",
        },
        { title: "Responsive Web Platforms", icon: "responsive", text: "Deliver consistent application experiences across desktops, tablets and smartphones." },
      ],
    },
    features: {
      title: "How We Engineer Web Applications",
      intro: "We combine modern application architecture, component-based development and user-centred design to build maintainable web platforms.",
      items: [
        {
          title: "Modern Front-End Architecture",
          text: "Develop interactive interfaces using React and Next.js, with an emphasis on reusable components and maintainable code.",
        },
        {
          title: "SaaS and Multi-Tenant Architecture",
          text: "Plan application structures for products that serve multiple organisations or customer accounts, where the project requirements call for it.",
        },
        {
          title: "API and Database Integration",
          text: "Connect application interfaces with backend services, APIs and databases to support reliable information exchange.",
        },
        {
          title: "Design Systems and Component Libraries",
          text: "Create reusable interface components that help maintain consistency across application screens and features.",
        },
        {
          title: "Performance Engineering",
          text: "Optimise application rendering, loading behaviour and resource delivery, with attention to Core Web Vitals.",
        },
        {
          title: "Accessibility and Responsive Design",
          text: "Build interfaces with accessible interaction patterns and layouts that adapt to different devices and screen sizes.",
        },
        {
          title: "Testing and Quality Assurance",
          text: "Validate application functionality, usability, responsiveness and important user workflows before deployment.",
        },
      ],
    },
    benefitDetails: {
      items: [
        { title: "Better Digital Experiences", icon: "sparkles", text: "Give customers and employees intuitive ways to interact with your business." },
        { title: "Improved Operational Efficiency", icon: "gauge", text: "Bring information and workflows into connected digital platforms." },
        { title: "Customer Self-Service", icon: "user-check", text: "Allow users to access relevant information and complete supported activities online." },
        { title: "Scalable Product Architecture", icon: "layers", text: "Build a technical foundation that can accommodate new features and changing requirements." },
        { title: "Centralised Information", icon: "database", text: "Bring relevant data and application functionality together in one platform." },
        { title: "Long-Term Maintainability", icon: "shield", text: "Use structured development practices and reusable components to make future improvements easier." },
      ],
    },
    ctaSection: {
      title: "Have a Web Application Idea? Let's Build It.",
      highlight: ["Build", "It."],
      text: "Planning a SaaS product, customer portal, e-commerce platform or business application? Tell us about your idea, challenges and goals. We'll help you explore the right engineering approach to bring your web application to life.",
    },
    faq: {
      items: [
        {
          question: "What is web application development?",
          answer:
            "Web application development is the process of designing and building interactive software that users access through a web browser. Examples include SaaS platforms, customer portals, e-commerce applications, dashboards and business management systems.",
        },
        {
          question: "What is the difference between a website and a web application?",
          answer:
            "A website primarily presents information about a business, product or service. A web application provides interactive functionality that allows users to perform tasks, manage information, submit data and use digital services.",
        },
        {
          question: "What types of web applications do you develop?",
          answer:
            "We develop SaaS platforms, e-commerce applications, customer portals, administrative dashboards, business applications and other browser-based digital platforms based on project requirements.",
        },
        {
          question: "Can you build a custom SaaS application?",
          answer:
            "Yes. We can develop custom SaaS applications with features such as user accounts, role-based access, subscription workflows and multi-tenant architecture, depending on the product requirements.",
        },
        {
          question: "Can a web application work on mobile devices?",
          answer:
            "Yes. We develop responsive interfaces designed to adapt to smartphones, tablets and desktop devices. The specific functionality and experience depend on the application requirements.",
        },
        {
          question: "Do you integrate APIs and third-party services?",
          answer:
            "Yes. We can integrate suitable third-party services and APIs into web applications based on their availability, documentation, security requirements and project scope.",
        },
        {
          question: "Which technologies do you use for web application development?",
          answer:
            "Our listed technologies include Next.js, React, TypeScript, Tailwind CSS, PostgreSQL and Vercel. The final technology stack is selected according to the application requirements.",
        },
        {
          question: "How much does web application development cost?",
          answer:
            "The cost depends on application complexity, features, user roles, integrations, design requirements, infrastructure and development scope. We assess the requirements before preparing a quotation.",
        },
        {
          question: "How long does it take to develop a web application?",
          answer:
            "Development time depends on the features, architecture, integrations and complexity of the application. A realistic timeline can be established after product discovery and scope definition.",
        },
        {
          question: "Do you work with international businesses?",
          answer:
            "IKASLÉ Technologies is based in Coimbatore, India, and welcomes web application development enquiries from businesses in India and international markets.",
        },
      ],
    },
  },
  {
    slug: SERVICE_SLUGS.mobileApps,
    name: "Mobile App Development",
    icon: "smartphone",
    card: "iOS and Android apps that put your services in the hands of customers and field teams.",
    heading: "Mobile App Development for Businesses, Products and Digital Experiences",
    intro: `Your business deserves more than a mobile presence. It needs an application that makes everyday interactions easier, connects people with services and supports the way your business operates.

At IKASLÉ Technologies, we design and develop mobile applications for Android and iOS, combining intuitive user experiences, reliable engineering and secure backend connectivity. From customer-facing applications and business platforms to field operations and on-demand services, we build mobile solutions around your product requirements and business objectives.`,
    capabilities: [
      "Cross-platform apps for iOS and Android",
      "Location, camera and notification features",
      "Offline-friendly flows that sync later",
      "Secure sign-in and connection to your systems",
      "App store release preparation",
    ],
    benefits: ["Reach customers where they already are", "Give field teams the tools they need on the move", "One codebase to maintain instead of two"],
    related: [],
    accent: "platforms",
    deliver: {
      title: "What We Build",
      items: [
        {
          title: "Android App Development", icon: "phone",
          text: "Develop mobile applications for Android devices with responsive interfaces, device integration and functionality tailored to your users.",
        },
        {
          title: "iOS App Development", icon: "tablet",
          text: "Create mobile experiences for Apple devices, with attention to platform-specific interface conventions, performance and usability.",
        },
        {
          title: "Cross-Platform App Development", icon: "layers",
          text: "Build applications for Android and iOS using a shared codebase with technologies such as React Native or Flutter, where appropriate.",
        },
        {
          title: "Business and Enterprise Mobile Apps", icon: "briefcase",
          text: "Develop applications that help employees manage operations, access business information, complete tasks and stay connected while working remotely or in the field.",
        },
        {
          title: "Customer-Facing Mobile Applications", icon: "users",
          text: "Create digital experiences that allow customers to browse services, manage accounts, place orders, submit requests and interact with your business.",
        },
        {
          title: "On-Demand and Service Applications", icon: "calendar",
          text: "Develop applications for service bookings, delivery workflows, appointment management and other on-demand business models.",
        },
        {
          title: "Mobile App Modernisation", icon: "refresh",
          text: "Improve existing mobile applications through interface updates, functionality enhancements, integration improvements and technical upgrades.",
        },
      ],
    },
    features: {
      title: "Mobile Application Capabilities",
      intro: "We build mobile functionality according to your application requirements.",
      items: [
        {
          title: "Location and Geofencing",
          text: "Use device location capabilities to support location-aware workflows, tracking and geographical notifications where appropriate.",
        },
        { title: "Camera and Media Integration", text: "Enable users to capture photographs, scan documents and upload media through their mobile devices." },
        { title: "Push Notifications", text: "Keep users informed through relevant application notifications, reminders and updates." },
        {
          title: "Offline-Aware Functionality",
          text: "Support selected workflows when connectivity is unavailable, with synchronisation when the device reconnects. Offline functionality depends on application requirements and data design.",
        },
        { title: "Secure Authentication", text: "Implement user authentication, access controls and secure communication with backend services." },
        { title: "API and Backend Integration", text: "Connect mobile applications to business systems, databases and third-party services through suitable APIs." },
      ],
    },
    benefitDetails: {
      items: [
        { title: "Reach Customers on Mobile", icon: "phone", text: "Give customers a convenient way to access your products, services and digital experiences." },
        { title: "Support Teams in the Field", icon: "map-pin", text: "Help employees access information, record activities and complete workflows while away from the office." },
        {
          title: "Reduce Development Duplication", icon: "copy",
          text: "A shared codebase can reduce duplicated development effort when cross-platform architecture is suitable.",
        },
        { title: "Improve Customer Engagement", icon: "bell", text: "Provide useful mobile features, account access and relevant notifications." },
        { title: "Connect Business Systems", icon: "plug", text: "Bring mobile interfaces and existing business applications together through appropriate integrations." },
        { title: "Build for Future Growth", icon: "sprout", text: "Create a maintainable application that can evolve as your users, features and business requirements grow." },
      ],
    },
    ctaSection: {
      title: "Have a Mobile App Idea? Let's Build It.",
      highlight: ["Build", "It."],
      text: "Planning a customer application, business platform or a new digital product? Tell us about your idea, the people who will use it and what you want the application to achieve. We'll help you explore the right mobile app development approach for your business.",
    },
    faq: {
      items: [
        {
          question: "What is mobile app development?",
          answer:
            "Mobile app development is the process of designing, building, testing and deploying applications for smartphones and tablets. Applications can be developed for Android, iOS or both platforms.",
        },
        {
          question: "Do you develop applications for both Android and iOS?",
          answer:
            "Yes. We can develop applications for Android and iOS using cross-platform technologies such as React Native and Flutter, or recommend a platform-specific approach based on project requirements.",
        },
        {
          question: "What is cross-platform mobile app development?",
          answer:
            "Cross-platform development allows developers to build applications for multiple mobile platforms using a shared codebase. It can reduce duplicated development effort, although some features may still require platform-specific implementation.",
        },
        {
          question: "Should I choose React Native or Flutter?",
          answer:
            "The right choice depends on your application requirements, existing technology ecosystem, design needs, integrations and long-term maintenance plans. We evaluate these factors before recommending a technology.",
        },
        {
          question: "Can my mobile app connect to an existing website or ERP?",
          answer:
            "Yes. Mobile applications can connect to suitable existing websites, ERP systems, databases and business applications through APIs and other supported integrations.",
        },
        {
          question: "Can a mobile application work without an internet connection?",
          answer:
            "Selected application features can be designed to work offline, with information synchronised when connectivity returns. The available offline functionality depends on the application's workflows and data requirements.",
        },
        {
          question: "Can you integrate GPS, camera and push notifications?",
          answer:
            "Yes. We can integrate supported device capabilities such as location, camera access and push notifications according to the application requirements and platform permissions.",
        },
        {
          question: "How much does mobile app development cost?",
          answer:
            "The cost depends on the number of features, platform requirements, design complexity, backend services, integrations and maintenance needs. We assess the project scope before providing a quotation.",
        },
        {
          question: "How long does it take to develop a mobile application?",
          answer:
            "The timeline depends on the application's features, complexity, design requirements, integrations and testing needs. We establish a project timeline after understanding the scope.",
        },
        {
          question: "Do you help publish applications on Google Play and the Apple App Store?",
          answer:
            "We can prepare application builds and release materials and support the store submission process within the agreed project scope. Store approval is subject to the respective platform's review policies.",
        },
        {
          question: "Do you develop mobile applications for international businesses?",
          answer:
            "IKASLÉ Technologies is based in Coimbatore, India, and welcomes mobile application development enquiries from businesses in India and international markets.",
        },
      ],
    },
  },
  {
    slug: SERVICE_SLUGS.erp,
    name: "ERP & Business Automation",
    icon: "boxes",
    card: "One system for inventory, purchasing, sales and production — with the routine steps automated.",
    heading: "ERP Software Development & Business Automation for Connected Operations",
    intro: `Manage your business operations through one connected digital system. At IKASLÉ Technologies, we design and develop ERP solutions that bring inventory, purchasing, sales, production and business reporting together. Our systems help businesses reduce disconnected workflows, improve operational visibility and manage critical information through a centralised platform.

From inventory management and order processing to production planning and workflow automation, we develop ERP solutions around the way your business operates.`,
    capabilities: [
      "Inventory and multi-location stock tracking",
      "Purchase and sales order workflows",
      "Production planning",
      "Approvals and automated business steps",
      "Operational dashboards and reports",
    ],
    benefits: ["Stock levels that match reality", "Faster purchasing and sales decisions", "Reports in minutes instead of days"],
    related: [KIDDOS_ERP],
    accent: "erp-sync",
    deliver: {
      title: "ERP Modules and Capabilities",
      intro: "We develop ERP modules based on your business requirements, operational structure and workflows.",
      items: [
        {
          title: "Inventory Management", icon: "package",
          text: "Manage stock information, inventory movements and available quantities through a centralised system.",
          points: ["Stock tracking and inventory updates", "Multi-location inventory management", "Stock movement records", "Inventory visibility and reporting"],
        },
        {
          title: "Purchase Management", icon: "clipboard",
          text: "Organise purchasing activities and improve visibility across procurement workflows.",
          points: ["Purchase requests and orders", "Supplier information management", "Purchase tracking", "Approval workflows"],
        },
        {
          title: "Sales and Order Management", icon: "receipt",
          text: "Connect customer orders, sales activities and fulfilment processes.",
          points: ["Sales order management", "Customer information management", "Order status tracking", "Sales reporting"],
        },
        {
          title: "Production Management", icon: "factory",
          text: "Support manufacturing and production workflows through structured planning and tracking.",
          points: ["Production planning", "Bills of materials", "Material requirements tracking", "Production status monitoring"],
        },
        {
          title: "Workflow and Approval Automation", icon: "workflow",
          text: "Reduce repetitive administrative work by connecting business processes through defined workflows.",
          points: ["Approval processes", "Role-based access", "Automated task assignments", "Workflow notifications"],
        },
        {
          title: "Business Reporting and Dashboards", icon: "dashboard",
          text: "Bring operational information together to support better business visibility.",
          points: ["Inventory reports", "Purchase and sales reports", "Production summaries", "Operational dashboards", "Business performance reports"],
        },
      ],
    },
    benefitDetails: {
      title: "Business Benefits of ERP and Automation",
      items: [
        { title: "Connected Business Operations", icon: "hub", text: "Bring essential business functions together through a shared operational platform." },
        { title: "Improved Inventory Visibility", icon: "package", text: "Access more consistent stock information across supported locations and workflows." },
        { title: "Better Purchasing and Sales Coordination", icon: "cart", text: "Connect purchase and sales processes to improve operational visibility." },
        { title: "Reduced Manual Work", icon: "zap", text: "Automate suitable repetitive tasks and approval workflows." },
        { title: "Faster Business Reporting", icon: "chart", text: "Access organised operational information through dashboards and reports." },
        { title: "Improved Decision-Making", icon: "lightbulb", text: "Use connected business information to understand operations and identify areas requiring attention." },
        { title: "A System That Can Evolve", icon: "refresh", text: "Extend modules and workflows as your business requirements change." },
      ],
    },
    ctaSection: {
      title: "Connect Your Business Operations.",
      highlight: ["Operations."],
      text: "If your business relies on disconnected systems, manual processes or spreadsheets to manage daily operations, it may be time for a more connected approach. Tell us about your workflows and operational challenges. We'll help you explore an ERP solution built around your business.",
    },
    faq: {
      items: [
        {
          question: "What is ERP software?",
          answer:
            "ERP stands for Enterprise Resource Planning. ERP software connects different business functions, such as inventory, purchasing, sales, production and reporting, through an integrated system.",
        },
        {
          question: "What is ERP and business automation?",
          answer:
            "ERP connects business information and operational functions, while business automation uses software workflows to reduce repetitive manual activities. Together, they help organisations manage operations more systematically.",
        },
        {
          question: "What modules can an ERP system include?",
          answer:
            "An ERP system can include inventory management, purchase management, sales and order management, production planning, finance, reporting, customer management and workflow automation. The modules depend on business requirements.",
        },
        {
          question: "Can you develop a custom ERP system?",
          answer:
            "Yes. We develop ERP solutions based on specific business workflows, operational requirements, user roles, reporting needs and integration requirements.",
        },
        {
          question: "Can an ERP system manage multiple warehouses?",
          answer:
            "Yes. Multi-location inventory management can be included when required, allowing businesses to manage stock information across supported warehouses and locations.",
        },
        {
          question: "Can ERP software integrate with existing systems?",
          answer:
            "ERP platforms can integrate with suitable third-party applications, websites, e-commerce platforms and other business systems through supported APIs and integration methods.",
        },
        {
          question: "Can ERP software be customised for manufacturing businesses?",
          answer:
            "Yes. Manufacturing-related functionality can include production planning, bills of materials, material tracking and production status management, depending on the operational requirements.",
        },
        {
          question: "How much does ERP software development cost?",
          answer:
            "The cost depends on the number of modules, business complexity, user roles, integrations, reporting requirements and deployment scope. We evaluate the requirements before preparing a quotation.",
        },
        {
          question: "How long does ERP implementation take?",
          answer:
            "The timeline depends on the number of modules, complexity of workflows, data migration, integrations and testing requirements. We establish a project plan after understanding the business requirements.",
        },
        {
          question: "Do you provide ERP development for international businesses?",
          answer:
            "IKASLÉ Technologies is based in Coimbatore, India, and welcomes ERP development enquiries from businesses in India and international markets.",
        },
      ],
    },
  },
  {
    slug: SERVICE_SLUGS.ai,
    name: "AI & Intelligent Solutions",
    icon: "sparkles",
    card: "Practical AI that reads documents, handles routine requests and routes work, so your team can focus on decisions.",
    heading: "AI Integration and Intelligent Automation for Businesses",
    intro: `Make everyday business operations smarter with practical AI and automation. At IKASLÉ Technologies, we integrate artificial intelligence into business workflows to reduce repetitive tasks, organise information and help teams work more efficiently.

From document processing and intelligent data extraction to AI-powered assistants and automated workflows, we develop solutions that connect AI capabilities with the systems your business already uses. Our focus is practical implementation: using AI where it creates value, keeping people involved in important decisions and building solutions that support real business requirements.`,
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
    deliver: {
      title: "What We Build",
      items: [
        {
          title: "AI-Powered Document Processing", icon: "scan",
          text: "Extract, classify and organise information from supported documents, forms, invoices and other business records.",
        },
        {
          title: "Intelligent Data Extraction", icon: "database",
          text: "Convert relevant information from unstructured documents and text into structured data for further processing.",
        },
        {
          title: "AI-Powered Business Assistants", icon: "bot",
          text: "Build assistants that respond to questions using your organisation's approved documents, information and knowledge resources.",
        },
        {
          title: "Automated Information Classification", icon: "tags",
          text: "Categorise incoming emails, enquiries, documents and requests to help teams organise and process information.",
        },
        {
          title: "Workflow Automation", icon: "workflow",
          text: "Connect business applications and automate repetitive activities, notifications, task assignments and information routing.",
        },
        { title: "AI Integrations", icon: "sparkles", text: "Integrate suitable AI models and services into existing websites, applications and business systems." },
        {
          title: "Human-in-the-Loop Automation", icon: "user-check",
          text: "Include review and approval steps where human verification is important, especially for sensitive or consequential decisions.",
        },
      ],
    },
    features: {
      title: "How We Apply AI and Automation",
      intro: "We focus on practical AI capabilities that can be integrated into existing business processes.",
      items: [
        {
          title: "Large Language Model Integration",
          text: "Connect suitable language models to applications and workflows for tasks such as summarisation, information extraction and text generation.",
        },
        {
          title: "Document Understanding",
          text: "Process supported documents to extract relevant information, identify categories and prepare structured outputs.",
        },
        {
          title: "Intelligent Classification and Routing",
          text: "Analyse incoming information and route requests to the appropriate department, workflow or review process.",
        },
        {
          title: "Knowledge-Based AI Assistants",
          text: "Create assistants that retrieve relevant information from approved organisational knowledge sources to help answer user questions.",
        },
        { title: "Workflow and Scheduled Automation", text: "Automate event-driven and scheduled activities across supported applications and business systems." },
        {
          title: "Human Review and Approval",
          text: "Design review workflows so that employees can verify outputs, approve important actions and handle exceptions.",
        },
      ],
    },
    benefitDetails: {
      title: "Business Benefits of AI and Intelligent Automation",
      items: [
        { title: "Less Repetitive Work", icon: "zap", text: "Automate suitable routine activities so employees can focus on tasks that require human judgement." },
        { title: "Faster Information Processing", icon: "gauge", text: "Extract, organise and summarise supported information through automated workflows." },
        { title: "More Accessible Business Knowledge", icon: "book", text: "Help employees find relevant information through assistants connected to approved knowledge resources." },
        { title: "Improved Workflow Coordination", icon: "workflow", text: "Route requests and information to the right people or systems through defined automation processes." },
        { title: "Better Use of Existing Data", icon: "database", text: "Make relevant information easier to organise, retrieve and use in business workflows." },
        { title: "Human-Controlled Decisions", icon: "user-check", text: "Keep employees involved in approvals, verification and decisions where human oversight matters." },
        {
          title: "Connected Business Applications", icon: "plug",
          text: "Integrate AI capabilities with existing applications instead of requiring every business to replace its current systems.",
        },
      ],
    },
    ctaSection: {
      title: "Make Your Business Work Smarter.",
      highlight: ["Smarter."],
      text: "If your team spends too much time processing documents, sorting requests or repeating the same tasks, there may be an opportunity to automate the workflow. Tell us about the process you want to improve. We'll help you explore a practical AI and automation solution for your business.",
    },
    faq: {
      items: [
        {
          question: "What are AI and intelligent automation solutions?",
          answer:
            "AI and intelligent automation solutions combine artificial intelligence with software workflows to perform activities such as document processing, classification, information extraction, summarisation and request routing.",
        },
        {
          question: "How can AI help my business?",
          answer:
            "AI can help businesses process information, organise documents, respond to routine enquiries, retrieve internal knowledge and automate suitable repetitive tasks. The benefits depend on the workflow, data quality and implementation.",
        },
        {
          question: "Can you integrate AI into an existing business application?",
          answer:
            "Yes. AI capabilities can be integrated into suitable existing websites, web applications, ERP systems and other business platforms through supported APIs and services.",
        },
        {
          question: "Can you build an AI assistant using our company documents?",
          answer:
            "Yes. We can develop knowledge-based assistants that retrieve information from approved company documents and knowledge resources. The solution needs appropriate document processing, retrieval, access controls and testing.",
        },
        {
          question: "Can AI extract information from invoices and documents?",
          answer:
            "Yes. Document-processing workflows can extract and structure relevant information from supported documents. Results should be validated, especially when the information is used for financial or operational decisions.",
        },
        {
          question: "Can AI automate emails and customer enquiries?",
          answer:
            "AI can help classify incoming enquiries, prepare response suggestions, summarise messages and route requests to relevant teams. Automated responses and actions should be designed with appropriate safeguards.",
        },
        {
          question: "Is AI automation suitable for every business process?",
          answer:
            "No. Some activities require human judgement, accountability or physical intervention. We assess each workflow to determine whether automation is practical and beneficial.",
        },
        {
          question: "Will AI replace employees?",
          answer:
            "Our focus is on supporting employees by reducing repetitive work and helping them access information more efficiently. Human involvement remains important for decisions, approvals and tasks requiring judgement.",
        },
        {
          question: "How much does AI integration cost?",
          answer:
            "Costs depend on the use case, model selection, data requirements, integrations, usage volume, infrastructure and ongoing operating costs. We assess the requirements before preparing a proposal.",
        },
        {
          question: "How long does it take to implement an AI solution?",
          answer:
            "The timeline depends on the workflow, data readiness, integrations, testing requirements and complexity. A suitable implementation plan can be prepared after the initial assessment.",
        },
        {
          question: "Is business information secure when using AI?",
          answer:
            "Security depends on the selected AI service, data handling arrangements, access controls, infrastructure and implementation. We consider these requirements when designing the solution and recommend that sensitive information is processed only through appropriately configured services.",
        },
        {
          question: "Do you develop AI solutions for international businesses?",
          answer:
            "IKASLÉ Technologies is based in Coimbatore, India, and welcomes AI integration and automation enquiries from businesses in India and international markets.",
        },
      ],
    },
  },
  {
    slug: SERVICE_SLUGS.productDesign,
    name: "UI/UX & Product Design",
    icon: "pen",
    card: "Research-led interfaces and design systems that make your product easy to learn and pleasant to use.",
    heading: "UI/UX Design and Product Design for Digital Experiences",
    intro: `Design digital products that are intuitive, consistent and built around the people who use them. At IKASLÉ Technologies, we combine user experience research, interface design and product thinking to create digital experiences that make complex interactions feel simple.

From early-stage product ideas and wireframes to interactive prototypes and complete design systems, we help businesses turn concepts into clear, usable and development-ready designs. Our design and engineering teams work together to ensure that what gets designed can translate into a functional digital product.`,
    capabilities: [
      "User research and journey mapping",
      "Wireframes and clickable prototypes",
      "Visual and interaction design",
      "Design systems and reusable components",
      "Usability reviews and iteration",
    ],
    benefits: ["Ideas validated before development starts", "A consistent experience across every screen", "Faster development from clear, ready-to-build designs"],
    related: [KIDDOS, UZHAVAR],
    accent: "tokens",
    deliver: {
      title: "What We Design",
      items: [
        {
          title: "User Experience (UX) Design", icon: "route",
          text: "Understand user behaviour, identify usability challenges and organise digital experiences around clear user journeys.",
        },
        {
          title: "User Interface (UI) Design", icon: "palette",
          text: "Create visually consistent and intuitive interfaces for websites, web applications, mobile applications and digital platforms.",
        },
        {
          title: "Product Design", icon: "lightbulb",
          text: "Transform product ideas into structured digital experiences through research, feature planning, interaction design and prototyping.",
        },
        {
          title: "Wireframing and Prototyping", icon: "pen-tool",
          text: "Visualise application structure and user journeys through wireframes and interactive prototypes before development begins.",
        },
        {
          title: "Design Systems", icon: "component",
          text: "Develop reusable components, typography, colour systems, spacing rules and interface guidelines to maintain consistency across digital products.",
        },
        {
          title: "Website and Mobile App Design", icon: "responsive",
          text: "Design responsive website layouts and mobile application interfaces that adapt to different devices and user needs.",
        },
        {
          title: "Usability Reviews", icon: "eye",
          text: "Evaluate existing interfaces, identify usability issues and recommend design improvements based on user experience principles.",
        },
      ],
    },
    deliverables: {
      title: "What We Deliver",
      items: [
        "User research and journey maps",
        "Information architecture and user flows",
        "Low-fidelity and high-fidelity wireframes",
        "Interactive prototypes",
        "Website and mobile application UI designs",
        "Visual and interaction design specifications",
        "Reusable design systems and components",
        "Design tokens and interface guidelines",
        "Developer-ready design handoff",
        "Usability reviews and design recommendations",
      ],
    },
    benefitDetails: {
      title: "Business Benefits of Professional UI/UX Design",
      items: [
        { title: "Better User Experiences", icon: "pointer", text: "Make digital products easier to understand, navigate and use." },
        { title: "Validate Ideas Earlier", icon: "lightbulb", text: "Explore product concepts and user journeys before committing to full development." },
        { title: "Consistent Brand Experience", icon: "palette", text: "Maintain a recognisable visual language across websites, applications and digital platforms." },
        { title: "Clearer Development Handoff", icon: "code", text: "Give developers structured design files and reusable component specifications." },
        { title: "Reduced Design Rework", icon: "target", text: "Identify usability and interface issues earlier in the product development process." },
        { title: "Scalable Design Systems", icon: "component", text: "Create reusable design foundations that support future features and product expansion." },
        { title: "Improved Product Adoption", icon: "users", text: "Make it easier for users to understand product functionality and complete important tasks." },
      ],
    },
    ctaSection: {
      title: "Have a Product Idea? Let's Design What's Next.",
      highlight: ["What's", "Next."],
      text: "Whether you are starting with an idea, improving an existing application or planning a complete digital product, the right design can make all the difference. Tell us what you want to create. We'll help you turn your vision into a clear, user-focused product experience.",
    },
    faq: {
      items: [
        {
          question: "What is UI/UX design?",
          answer:
            "UI/UX design combines user interface design and user experience design. UI focuses on the visual and interactive elements of a product, while UX focuses on how people navigate, understand and use it.",
        },
        {
          question: "What is the difference between UI design and UX design?",
          answer:
            "UX design focuses on the overall user journey, usability, information structure and interactions. UI design focuses on the visual presentation of the interface, including layouts, typography, colours and interactive elements.",
        },
        {
          question: "What is product design?",
          answer:
            "Product design is the process of planning and designing a digital product around user needs and business objectives. It can include research, feature planning, user flows, interface design, prototyping and design systems.",
        },
        {
          question: "Do you design websites and mobile applications?",
          answer: "Yes. We design user interfaces and experiences for websites, web applications and mobile applications based on the product requirements.",
        },
        {
          question: "What is a wireframe?",
          answer:
            "A wireframe is an early visual representation of a screen or interface. It helps define layout, content hierarchy and functionality before detailed visual design begins.",
        },
        {
          question: "What is an interactive prototype?",
          answer:
            "An interactive prototype demonstrates how users move through an application or website. It helps stakeholders review user journeys and design concepts before development.",
        },
        {
          question: "What is a design system?",
          answer: "A design system is a collection of reusable interface components, design rules and guidelines that helps maintain consistency across digital products.",
        },
        {
          question: "Do you provide developer-ready designs?",
          answer: "Yes. We prepare organised design files, reusable component specifications and implementation guidance to support the development handoff.",
        },
        {
          question: "Can you redesign an existing website or application?",
          answer:
            "Yes. We can review existing interfaces, identify usability and visual design issues and recommend improvements based on your business and user requirements.",
        },
        {
          question: "How much does UI/UX design cost?",
          answer:
            "The cost depends on the number of screens, product complexity, research requirements, prototyping needs and design system scope. We assess the project before preparing a quotation.",
        },
        {
          question: "How long does a UI/UX design project take?",
          answer:
            "The timeline depends on the product scope, number of screens, research requirements, feedback cycles and design complexity. We establish a suitable timeline after understanding the requirements.",
        },
        {
          question: "Do you work with international businesses?",
          answer:
            "IKASLÉ Technologies is based in Coimbatore, India, and welcomes UI/UX and product design enquiries from businesses in India and international markets.",
        },
      ],
    },
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
