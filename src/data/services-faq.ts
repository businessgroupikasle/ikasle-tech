import type { FaqContent } from "@/components/services/ServiceFaq";

/** FAQ on the services listing page (/services): general questions about choosing and planning technology. */
export const servicesFaq: FaqContent = {
  eyebrow: "Understanding technology & software development",
  heading: "Making the Right Technology Decisions for Your Business.",
  items: [
    {
      question: "What is the difference between a website and a web application?",
      answer: [
        "A website primarily presents information about a business, brand, product or service. A web application allows users to interact with features, manage information and perform tasks online.",
        { label: "Website examples:", text: "Corporate websites, landing pages, business websites and blogs." },
        { label: "Web application examples:", text: "SaaS platforms, customer portals, booking systems, ERP systems and management dashboards." },
        "Simply put, a website helps people discover your business, while a web application helps them perform tasks online.",
      ],
    },
    {
      question: "What is custom software development, and why does a business need it?",
      answer: [
        "Custom software development involves building applications specifically around a business's workflows, requirements and objectives. It is useful when ready-made software cannot support specific operations, integrations or business processes.",
        "Examples include business management systems, custom dashboards, workflow applications and enterprise software.",
      ],
    },
    {
      question: "What is ERP software, and how does it help businesses?",
      answer: [
        "Enterprise Resource Planning (ERP) software connects business operations such as inventory, purchasing, sales, production and reporting through a shared system.",
        "It helps reduce disconnected records, improve operational visibility and coordinate information across departments.",
      ],
    },
    {
      question: "What is SaaS application development?",
      answer: [
        "Software as a Service (SaaS) is a model where users access software through the internet, commonly using a subscription.",
        "SaaS platforms can include user accounts, dashboards, subscription management, customer portals and administrative features. They are commonly used to deliver business software to multiple customers through one platform.",
      ],
    },
    {
      question: "How can AI and automation improve business operations?",
      answer: [
        "Automation handles repetitive, rule-based tasks, while AI can assist with document processing, information extraction, classification and intelligent responses.",
        "Combining both can reduce manual effort, improve workflow efficiency and help employees focus on decisions that require human judgement.",
      ],
    },
    {
      question: "What should a business consider before developing a mobile application?",
      answer:
        "Start by identifying your target users, business objectives and essential app features. Consider Android and iOS compatibility, backend integrations, security, user experience and ongoing maintenance before choosing a development approach.",
    },
    {
      question: "How much does software development cost?",
      answer: [
        "Software development costs depend on project complexity, functionality, integrations, design requirements, technology and development time.",
        "A requirements assessment helps establish the project scope, deliverables, estimated timeline and development cost before work begins.",
      ],
    },
    {
      question: "Does IKASLÉ Technologies work with international businesses?",
      answer: [
        "Yes. IKASLÉ Technologies is based in Coimbatore, Tamil Nadu, India, and welcomes international project enquiries. Our portfolio includes website projects from the United Kingdom and the United Arab Emirates.",
        "We are open to opportunities from the USA, Saudi Arabia, Canada, Australia, New Zealand and other markets.",
      ],
    },
  ],
};
